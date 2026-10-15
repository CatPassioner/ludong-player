# -*- coding: utf-8 -*-
"""检查 / 下载 / 应用更新（覆盖安装目录，保留私人歌曲目录）。"""
from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import tempfile
import threading
import urllib.error
import urllib.request
import zipfile
from pathlib import Path
from typing import Any

from app_paths import get_root, get_userdata_root, read_app_config
from app_version import APP_VERSION, DEFAULT_MANIFEST_URL

_VERSION_RE = re.compile(r"(\d+)(?:\.(\d+))?(?:\.(\d+))?")


def parse_version(text: str) -> tuple[int, int, int]:
    m = _VERSION_RE.search(str(text or "").strip())
    if not m:
        return (0, 0, 0)
    return (int(m.group(1) or 0), int(m.group(2) or 0), int(m.group(3) or 0))


def version_gt(remote: str, local: str) -> bool:
    return parse_version(remote) > parse_version(local)


def local_version() -> str:
    path = get_root() / "version.json"
    if path.is_file():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            v = str((data or {}).get("version") or "").strip()
            if v:
                return v
        except Exception:
            pass
    return APP_VERSION


def manifest_url() -> str:
    path = get_root() / "version.json"
    if path.is_file():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            url = str((data or {}).get("manifestUrl") or "").strip()
            if url:
                return url
        except Exception:
            pass
    return DEFAULT_MANIFEST_URL


def _manifest_candidates(url: str) -> list[str]:
    target = (url or "").strip()
    if not target:
        return []
    out = [target]
    # 部分网络连 *.supabase.co 比 *.storage.supabase.co 更稳（或相反）
    if "://ojqxcduzeqblwpzulovz.supabase.co/" in target:
        alt = target.replace(
            "://ojqxcduzeqblwpzulovz.supabase.co/",
            "://ojqxcduzeqblwpzulovz.storage.supabase.co/",
            1,
        )
        if alt not in out:
            out.append(alt)
    elif "://ojqxcduzeqblwpzulovz.storage.supabase.co/" in target:
        alt = target.replace(
            "://ojqxcduzeqblwpzulovz.storage.supabase.co/",
            "://ojqxcduzeqblwpzulovz.supabase.co/",
            1,
        )
        if alt not in out:
            out.append(alt)
    return out


def fetch_manifest(url: str | None = None, timeout: float = 12.0) -> dict[str, Any]:
    target = (url or manifest_url()).strip()
    if not target:
        raise ValueError("未配置更新地址")
    last_err: Exception | None = None
    for candidate in _manifest_candidates(target):
        for attempt in range(3):
            try:
                req = urllib.request.Request(
                    candidate,
                    headers={
                        "User-Agent": f"LudongPlayer/{local_version()}",
                        "Cache-Control": "no-cache",
                        "Pragma": "no-cache",
                    },
                    method="GET",
                )
                with urllib.request.urlopen(req, timeout=timeout) as res:
                    raw = res.read().decode("utf-8", "replace")
                data = json.loads(raw)
                if not isinstance(data, dict):
                    raise ValueError("更新清单格式无效")
                return data
            except Exception as e:
                last_err = e
                if attempt < 2:
                    import time

                    time.sleep(0.6 * (attempt + 1))
    assert last_err is not None
    raise last_err


def check_for_update() -> dict[str, Any]:
    current = local_version()
    try:
        remote = fetch_manifest()
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return {
                "ok": True,
                "hasUpdate": False,
                "currentVersion": current,
                "message": "暂无发布更新清单",
            }
        return {"ok": False, "hasUpdate": False, "currentVersion": current, "error": str(e)}
    except Exception as e:
        return {"ok": False, "hasUpdate": False, "currentVersion": current, "error": str(e)}

    remote_ver = str(remote.get("version") or "").strip()
    installer = str(remote.get("installerUrl") or remote.get("url") or "").strip()
    patch = str(remote.get("patchUrl") or "").strip()
    notes = str(remote.get("notes") or remote.get("changelog") or "").strip()
    mandatory = bool(remote.get("mandatory") or False)
    has = bool(remote_ver and version_gt(remote_ver, current) and (patch or installer))
    return {
        "ok": True,
        "hasUpdate": has,
        "currentVersion": current,
        "latestVersion": remote_ver,
        "notes": notes,
        "installerUrl": installer if has else "",
        "patchUrl": patch if has else "",
        "updateMode": "patch" if (has and patch) else ("installer" if has else ""),
        "mandatory": mandatory if has else False,
        "installDir": str(get_root()),
        "libraryDir": str(get_userdata_root()),
    }


def _download_file(url: str, dest: Path, timeout: float = 600.0) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(dest.suffix + ".part")
    req = urllib.request.Request(
        url,
        headers={"User-Agent": f"LudongPlayer/{local_version()}"},
        method="GET",
    )
    with urllib.request.urlopen(req, timeout=timeout) as res, tmp.open("wb") as out:
        while True:
            chunk = res.read(1024 * 256)
            if not chunk:
                break
            out.write(chunk)
    if dest.exists():
        dest.unlink()
    tmp.replace(dest)


def _no_window_flags() -> int:
    return getattr(subprocess, "CREATE_NO_WINDOW", 0)


def _safe_extract_zip(zpath: Path, dest: Path) -> None:
    dest = dest.resolve()
    with zipfile.ZipFile(zpath, "r") as zf:
        for info in zf.infolist():
            name = info.filename.replace("\\", "/")
            if not name or name.endswith("/"):
                continue
            if name.startswith("/") or ".." in name.split("/"):
                raise ValueError(f"非法更新文件路径: {name}")
            target = (dest / name).resolve()
            try:
                target.relative_to(dest)
            except ValueError as e:
                raise ValueError(f"非法更新文件路径: {name}") from e
            target.parent.mkdir(parents=True, exist_ok=True)
            with zf.open(info, "r") as src, target.open("wb") as out:
                shutil.copyfileobj(src, out)


def _close_browser_app_windows(install_dir: Path) -> None:
    """关掉本安装目录 .browser-profile 对应的 Edge/Chrome 应用窗，避免更新后旧界面残留。"""
    if os.name != "nt":
        return
    profile = install_dir / ".browser-profile"
    script = install_dir / "close_app_windows.ps1"
    try:
        if script.is_file():
            subprocess.run(
                [
                    "powershell",
                    "-NoProfile",
                    "-ExecutionPolicy",
                    "Bypass",
                    "-File",
                    str(script),
                    "-ProfileDir",
                    str(profile.resolve()),
                ],
                creationflags=_no_window_flags(),
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                timeout=12,
                check=False,
            )
            return
    except Exception:
        pass
    # 回退：内联命令（完整安装包里的 updater 也会走到这里）
    safe = str(profile.resolve()).replace("'", "''")
    ps = (
        "$p = '{safe}';"
        "Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |"
        " Where-Object {{"
        "  ($_.Name -eq 'msedge.exe' -or $_.Name -eq 'chrome.exe') -and"
        "  $_.CommandLine -and ($_.CommandLine -like ('*' + $p + '*'))"
        " }} |"
        " ForEach-Object {{ Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }}"
    ).format(safe=safe)
    try:
        subprocess.run(
            ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps],
            creationflags=_no_window_flags(),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=12,
            check=False,
        )
    except Exception:
        pass


def _restart_app(install_dir: Path) -> None:
    # 先关旧窗口，再拉起新进程
    _close_browser_app_windows(install_dir)
    exe = install_dir / "猫耳律动.exe"
    if exe.is_file():
        subprocess.Popen([str(exe)], cwd=str(install_dir))

    def _later_exit() -> None:
        import time

        time.sleep(0.35)
        os._exit(0)

    threading.Thread(target=_later_exit, daemon=True).start()


def apply_patch_file(patch_path: Path, latest_version: str = "") -> dict[str, Any]:
    """用本地已下载的补丁 zip 覆盖安装目录并重启。"""
    install_dir = get_root()
    path = Path(patch_path)
    if not path.is_file() or path.stat().st_size < 32:
        return {"ok": False, "error": "补丁文件无效"}
    try:
        _safe_extract_zip(path, install_dir)
    except Exception as e:
        return {"ok": False, "error": f"应用补丁失败：{e}"}
    _restart_app(install_dir)
    return {
        "ok": True,
        "restarting": True,
        "message": "补丁已应用，正在重启",
        "latestVersion": latest_version,
        "mode": "patch",
    }


def apply_patch_bytes(data: bytes, latest_version: str = "") -> dict[str, Any]:
    if not data or len(data) < 32:
        return {"ok": False, "error": "补丁文件无效"}
    temp_root = Path(tempfile.gettempdir()) / "LudongPlayer-update"
    temp_root.mkdir(parents=True, exist_ok=True)
    patch_path = temp_root / "ludong-patch-upload.zip"
    patch_path.write_bytes(data)
    return apply_patch_file(patch_path, latest_version)


def apply_patch_update(patch_url: str, latest_version: str = "") -> dict[str, Any]:
    """下载小型补丁 zip，解压覆盖安装目录后重启（适合免费版 <50MB）。"""
    temp_root = Path(tempfile.gettempdir()) / "LudongPlayer-update"
    temp_root.mkdir(parents=True, exist_ok=True)
    patch_path = temp_root / "ludong-patch.zip"
    last_err: Exception | None = None
    for candidate in _manifest_candidates(patch_url) or [patch_url]:
        for attempt in range(3):
            try:
                _download_file(candidate, patch_path)
                last_err = None
                break
            except Exception as e:
                last_err = e
                if attempt < 2:
                    import time

                    time.sleep(0.8 * (attempt + 1))
        if last_err is None:
            break
    if last_err is not None:
        return {
            "ok": False,
            "error": (
                f"下载补丁失败：{last_err}。"
                "若本机 Python 连不上云端，请用新版客户端（浏览器下载补丁）。"
            ),
        }
    return apply_patch_file(patch_path, latest_version)


def apply_installer_update(installer_url: str, latest_version: str = "") -> dict[str, Any]:
    install_dir = get_root()
    cfg = read_app_config()
    library_dir = Path(str(cfg.get("userdata_root") or get_userdata_root()))

    temp_root = Path(tempfile.gettempdir()) / "LudongPlayer-update"
    temp_root.mkdir(parents=True, exist_ok=True)
    setup_path = temp_root / "ludong-setup.exe"

    try:
        _download_file(installer_url, setup_path)
    except Exception as e:
        return {"ok": False, "error": f"下载更新失败：{e}"}

    if not setup_path.is_file() or setup_path.stat().st_size < 1024:
        return {"ok": False, "error": "下载的安装包无效"}

    cmd = [
        str(setup_path),
        "--update",
        "--install-dir",
        str(install_dir),
        "--library-dir",
        str(library_dir),
    ]
    try:
        subprocess.Popen(
            cmd,
            cwd=str(temp_root),
            creationflags=_no_window_flags() if os.name == "nt" else 0,
        )
    except OSError as e:
        return {"ok": False, "error": f"无法启动安装程序：{e}"}

    def _later_exit() -> None:
        import time

        time.sleep(1.2)
        os._exit(0)

    threading.Thread(target=_later_exit, daemon=True).start()
    return {
        "ok": True,
        "restarting": True,
        "message": "正在更新，程序将自动重启",
        "latestVersion": latest_version,
        "mode": "installer",
    }


def apply_update(installer_url: str | None = None, patch_url: str | None = None) -> dict[str, Any]:
    """优先小补丁；没有补丁再用完整安装包。"""
    info = check_for_update()
    if not info.get("ok"):
        return info
    patch = (patch_url or info.get("patchUrl") or "").strip()
    installer = (installer_url or info.get("installerUrl") or "").strip()
    latest = str(info.get("latestVersion") or "")
    if patch:
        return apply_patch_update(patch, latest)
    if installer:
        return apply_installer_update(installer, latest)
    if not info.get("hasUpdate"):
        return {"ok": False, "error": "当前已是最新版本"}
    return {"ok": False, "error": "更新清单缺少补丁或安装包地址"}
