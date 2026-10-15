# -*- coding: utf-8 -*-
"""猫耳律动 · 桌面窗口（无浏览器地址栏）。"""
from __future__ import annotations

import os
import json
import socket
import subprocess
import sys
import time
import traceback
import urllib.error
import urllib.request
from pathlib import Path

from app_paths import get_root

ROOT = get_root()
HOST = "127.0.0.1"
PORT = 5500
URL = f"http://{HOST}:{PORT}/"
LOG = ROOT / "desktop_app.log"


def log(msg: str) -> None:
    line = msg.rstrip() + "\n"
    try:
        with LOG.open("a", encoding="utf-8") as f:
            f.write(line)
    except OSError:
        pass


def port_open(port: int = PORT) -> bool:
    try:
        with socket.create_connection((HOST, port), timeout=0.4):
            return True
    except OSError:
        return False


def kill_port(port: int = PORT) -> None:
    """强制结束占用端口的旧服务，避免继续跑过期代码导致账号数据串号。"""
    if os.name != "nt":
        return
    try:
        out = subprocess.check_output(
            ["netstat", "-ano"],
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
            stderr=subprocess.DEVNULL,
        ).decode("utf-8", "ignore")
    except Exception:
        return
    pids: set[str] = set()
    needle = f":{port} "
    for line in out.splitlines():
        if needle not in line or "LISTENING" not in line.upper():
            continue
        parts = line.split()
        if not parts:
            continue
        pid = parts[-1]
        if pid.isdigit() and pid != "0":
            pids.add(pid)
    for pid in pids:
        try:
            subprocess.run(
                ["taskkill", "/F", "/PID", pid],
                creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                check=False,
            )
            log(f"killed old server pid={pid}")
        except Exception:
            pass
    # 等端口释放
    for _ in range(20):
        if not port_open(port):
            break
        time.sleep(0.1)


def wait_ready(timeout: float = 10.0) -> bool:
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(URL, timeout=0.6) as res:
                if getattr(res, "status", 200) < 500:
                    return True
        except (urllib.error.URLError, TimeoutError, OSError):
            time.sleep(0.2)
    return port_open()


def server_matches_this_install() -> bool:
    """避免复用其它安装目录残留在 5500 的旧服务（搬家/重装后常见）。"""
    try:
        with urllib.request.urlopen(f"{URL}api/version", timeout=0.8) as res:
            raw = res.read().decode("utf-8", "replace")
        data = json.loads(raw) if raw else {}
        remote = str((data or {}).get("installDir") or "").strip()
        if not remote:
            return False
        return Path(remote).resolve() == ROOT.resolve()
    except Exception:
        return False


def _wallpaper_api_ready() -> bool:
    try:
        with urllib.request.urlopen(
            f"http://127.0.0.1:{PORT}/api/wallpaper/status", timeout=1.2
        ) as res:
            return int(getattr(res, "status", 0) or 0) == 200
    except Exception:
        return False


def start_server() -> None:
    # 旧进程若没有壁纸等新接口，强制重启，避免一直复用过期服务
    if port_open():
        if server_matches_this_install() and _wallpaper_api_ready():
            log("server already ready, reuse")
            return
        log("port busy by stale/other server, restarting")
        kill_port(PORT)
    creation = getattr(subprocess, "CREATE_NO_WINDOW", 0)
    if getattr(sys, "frozen", False):
        # --serve 会优先加载安装目录旁的 server.py（见 run_server_mode）
        cmd = [sys.executable, "--serve", "--port", str(PORT)]
    else:
        cmd = [sys.executable, str(ROOT / "server.py"), "--port", str(PORT)]
    subprocess.Popen(
        cmd,
        cwd=str(ROOT),
        creationflags=creation,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    log("started server")


def find_browser() -> Path | None:
    candidates: list[Path] = []
    local = Path(os.environ.get("LOCALAPPDATA", ""))
    pf = Path(os.environ.get("ProgramFiles", r"C:\Program Files"))
    pf86 = Path(os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)"))
    candidates.extend(
        [
            pf / "Microsoft" / "Edge" / "Application" / "msedge.exe",
            pf86 / "Microsoft" / "Edge" / "Application" / "msedge.exe",
            local / "Microsoft" / "Edge" / "Application" / "msedge.exe",
            pf / "Google" / "Chrome" / "Application" / "chrome.exe",
            pf86 / "Google" / "Chrome" / "Application" / "chrome.exe",
            local / "Google" / "Chrome" / "Application" / "chrome.exe",
        ]
    )
    for p in candidates:
        if p.is_file():
            return p
    return None


def tint_caption_color() -> None:
    """把系统标题栏染成 logo 的浅蓝色。仅 Windows 11 生效。"""
    if os.name != "nt":
        return
    import ctypes
    from ctypes import wintypes

    user32 = ctypes.windll.user32
    dwmapi = ctypes.windll.dwmapi
    # #cce4fe -> COLORREF 是 BGR
    caption = ctypes.c_int(0x00FEE4CC)
    text = ctypes.c_int(0x00302820)
    enum_proc = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)

    def _each(hwnd, _lparam):
        if not user32.IsWindowVisible(hwnd):
            return True
        length = user32.GetWindowTextLengthW(hwnd)
        if length <= 0:
            return True
        buf = ctypes.create_unicode_buffer(length + 1)
        user32.GetWindowTextW(hwnd, buf, length + 1)
        if "猫耳律动" not in buf.value:
            return True
        dwmapi.DwmSetWindowAttribute(hwnd, 35, ctypes.byref(caption), ctypes.sizeof(caption))
        dwmapi.DwmSetWindowAttribute(hwnd, 36, ctypes.byref(text), ctypes.sizeof(text))
        return True

    user32.EnumWindows(enum_proc(_each), 0)


def open_app_window(url: str) -> bool:
    exe = find_browser()
    if not exe:
        log("no Edge/Chrome found")
        return False
    # 启动先开登录小窗；登录后由页面 resize 到播放器尺寸
    profile = ROOT / ".browser-profile"
    profile.mkdir(exist_ok=True)
    # 更新重启前先清掉旧应用窗，避免叠两个界面；不用 --new-window，减少残留
    try:
        from updater import _close_browser_app_windows

        _close_browser_app_windows(ROOT)
    except Exception:
        pass
    subprocess.Popen(
        [
            str(exe),
            f"--app={url}",
            "--window-size=420,680",
            "--window-position=220,80",
            f"--user-data-dir={profile}",
            "--disable-features=TranslateUI",
            "--no-first-run",
        ],
        cwd=str(ROOT),
    )
    log(f"opened app window via {exe.name}")
    threading = __import__("threading")

    def _later_tint() -> None:
        time.sleep(1.2)
        try:
            tint_caption_color()
        except Exception:
            log("caption tint failed:\n" + traceback.format_exc())

    threading.Thread(target=_later_tint, daemon=True).start()
    return True


def open_webview(url: str) -> bool:
    try:
        import webview
    except ImportError:
        log("pywebview not installed")
        return False
    try:
        webview.create_window(
            "猫耳律动",
            url,
            width=420,
            height=680,
            min_size=(380, 560),
            background_color="#eef3f8",
            text_select=False,
        )
        try:
            webview.start(gui="edgechromium")
        except Exception:
            webview.start()
        return True
    except Exception:
        log("webview failed:\n" + traceback.format_exc())
        return False


def run_server_mode() -> int:
    os.chdir(ROOT)
    argv = [a for a in sys.argv[1:] if a != "--serve"]
    sys.argv = [sys.argv[0], *argv]
    # 优先用安装目录旁的 server.py，方便补丁更新接口（如壁纸）
    disk = ROOT / "server.py"
    if disk.is_file():
        import importlib.util
        import sys as _sys

        spec = importlib.util.spec_from_file_location("ludong_server_disk", disk)
        if spec and spec.loader:
            mod = importlib.util.module_from_spec(spec)
            _sys.modules["ludong_server_disk"] = mod
            spec.loader.exec_module(mod)
            mod.main()
            return 0
    from server import main as server_main

    server_main()
    return 0


def main() -> int:
    try:
        LOG.write_text("", encoding="utf-8")
    except OSError:
        pass
    log("launch")
    os.chdir(ROOT)
    start_server()
    if not wait_ready():
        log("server not ready")
        return 1

    # Edge/Chrome 应用窗口更稳；失败再退回内嵌窗口
    if open_app_window(URL):
        return 0
    if open_webview(URL):
        return 0
    log("all window methods failed")
    return 1


if __name__ == "__main__":
    try:
        if "--serve" in sys.argv:
            raise SystemExit(run_server_mode())
        raise SystemExit(main())
    except Exception:
        log(traceback.format_exc())
        raise SystemExit(1)
