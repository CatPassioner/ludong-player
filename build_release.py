# -*- coding: utf-8 -*-
"""打包：生成可执行程序 + 安装包（发给朋友用）。"""
from __future__ import annotations

import os
import json
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"
BUILD = ROOT / "build"
RELEASE = ROOT / "release"
APP_DIR_NAME = "猫耳律动"
SETUP_NAME = "猫耳律动-安装包"

ASSET_FILES = [
    "index.html",
    "app.js",
    "styles.css",
    "logo.jpg",
    "logo.ico",
    "cloud-config.js",
    "cloud-comments.js",
    "version.json",
    "import-guide.pdf",
]
ASSET_DIRS = ["music", "lyrics-bg", "emoji"]


def run(cmd: list[str]) -> None:
    print(">", " ".join(cmd))
    subprocess.check_call(cmd, cwd=str(ROOT))


def write_version_json() -> Path:
    from app_version import APP_VERSION, DEFAULT_MANIFEST_URL

    path = ROOT / "version.json"
    path.write_text(
        json.dumps(
            {
                "version": APP_VERSION,
                "manifestUrl": DEFAULT_MANIFEST_URL,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    return path


def write_patch_zip(app_dir: Path) -> Path:
    """小型热更新包（前端等资源），可放进免费版 50MB 限额。"""
    RELEASE.mkdir(exist_ok=True)
    patch = RELEASE / "ludong-patch.zip"
    names = [
        "index.html",
        "app.js",
        "styles.css",
        "cloud-config.js",
        "cloud-comments.js",
        "version.json",
        "close_app_windows.ps1",
        "import-guide.pdf",
        "wallpaper.py",
        "cover_library.py",
        "server.py",
        "desktop_app.py",
    ]
    if patch.exists():
        patch.unlink()
    with zipfile.ZipFile(patch, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for name in names:
            src = app_dir / name
            if src.is_file():
                zf.write(src, arcname=name)
    return patch


def write_update_manifest(setup_exe: Path, patch_zip: Path | None = None) -> Path:
    from app_version import APP_VERSION, DEFAULT_MANIFEST_URL

    ascii_setup = RELEASE / "ludong-setup.exe"
    try:
        shutil.copy2(setup_exe, ascii_setup)
    except Exception:
        ascii_setup = setup_exe

    public_patch = (
        "https://ojqxcduzeqblwpzulovz.supabase.co/storage/v1/object/public/"
        "ludong-releases/ludong-patch.zip"
    )
    # 完整包默认仍写公开地址；免费版超 50MB 时可改成网盘直链，或先留空只发补丁
    public_installer = (
        "https://ojqxcduzeqblwpzulovz.supabase.co/storage/v1/object/public/"
        f"ludong-releases/{ascii_setup.name}"
    )
    manifest = {
        "version": APP_VERSION,
        "notes": "支持小补丁更新（适配免费版 50MB）；登录 QQ 号可补全 @qq.com；头像同步修复。",
        "patchUrl": public_patch if patch_zip and patch_zip.is_file() else "",
        "installerUrl": "",
        "mandatory": False,
    }
    out = RELEASE / "update.json"
    out.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    tip = RELEASE / "发版上传说明.txt"
    tip.write_text(
        "\n".join(
            [
                f"当前版本：{APP_VERSION}",
                "",
                "【推荐 · 免费版】只上传小文件到 Supabase → ludong-releases：",
                "  1) ludong-patch.zip   （通常 < 2MB）",
                "  2) update.json",
                "",
                "【完整安装包】约 87MB，超过免费全局 50MB 上传限制：",
                f"  - 本地文件：{ascii_setup.name} 或 {setup_exe.name}",
                "  - 可传到网盘/GitHub Releases，再把直链填进 update.json 的 installerUrl",
                "  - 新用户仍可用微信等直接发安装包",
                "",
                f"清单地址：{DEFAULT_MANIFEST_URL}",
                f"补丁地址：{public_patch}",
                "",
                "说明：已装旧版且只会下完整包的客户端，若没有 installerUrl 就收不到自动更新；",
                "可先让他们装一次新安装包，之后都走补丁更新。",
                "",
            ]
        ),
        encoding="utf-8",
    )
    return out


def ensure_ico() -> Path:
    ico = ROOT / "logo.ico"
    src = ROOT / "logo.jpg"
    if ico.is_file() and ico.stat().st_mtime >= src.stat().st_mtime:
        return ico
    from PIL import Image

    img = Image.open(src).convert("RGBA")
    img = img.resize((256, 256), Image.Resampling.LANCZOS)
    img.save(ico, sizes=[(256, 256), (64, 64), (48, 48), (32, 32), (16, 16)])
    return ico


def build_app_exe() -> Path:
    ico = ensure_ico()
    for p in (DIST / APP_DIR_NAME, BUILD / APP_DIR_NAME):
        if p.exists():
            shutil.rmtree(p, ignore_errors=True)

    cmd = [
        sys.executable,
        "-m",
        "PyInstaller",
        "--noconfirm",
        "--clean",
        "--windowed",
        "--name",
        APP_DIR_NAME,
        "--icon",
        str(ico),
        "--hidden-import",
        "PIL",
        "--hidden-import",
        "PIL.Image",
        "--hidden-import",
        "server",
        "--hidden-import",
        "gen_playlist",
        "--hidden-import",
        "gen_lyrics_bg",
        "--hidden-import",
        "app_paths",
        "--hidden-import",
        "library",
        "--hidden-import",
        "import_music",
        "--hidden-import",
        "play_stats",
        "--hidden-import",
        "delete_song",
        "--hidden-import",
        "likes",
        "--hidden-import",
        "comments",
        "--hidden-import",
        "app_version",
        "--hidden-import",
        "updater",
        "--hidden-import",
        "wallpaper",
        "--hidden-import",
        "cover_library",
        str(ROOT / "desktop_app.py"),
    ]
    run(cmd)
    app_dir = DIST / APP_DIR_NAME
    exe = app_dir / f"{APP_DIR_NAME}.exe"
    if not exe.is_file():
        raise FileNotFoundError(f"未生成 exe: {exe}")
    return app_dir


def copy_assets(app_dir: Path) -> None:
    for name in ASSET_FILES:
        src = ROOT / name
        if src.is_file():
            shutil.copy2(src, app_dir / name)
    for name in ASSET_DIRS:
        src = ROOT / name
        dst = app_dir / name
        if dst.exists():
            shutil.rmtree(dst, ignore_errors=True)
        if src.is_dir():
            shutil.copytree(
                src,
                dst,
                ignore=shutil.ignore_patterns("*.pyc", "__pycache__"),
            )


def zip_dir(src_dir: Path, zip_path: Path, arc_root: str | None = None) -> None:
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for f in src_dir.rglob("*"):
            if f.is_file():
                rel = f.relative_to(src_dir)
                arc = f"{arc_root}/{rel.as_posix()}" if arc_root else rel.as_posix()
                zf.write(f, arcname=arc)


def build_setup(app_dir: Path) -> Path:
    RELEASE.mkdir(exist_ok=True)
    staging = RELEASE / "_setup_staging"
    if staging.exists():
        shutil.rmtree(staging, ignore_errors=True)
    staging.mkdir(parents=True)

    payload = staging / "payload.zip"
    zip_dir(app_dir, payload)

    ico = ensure_ico()
    add_data = f"{payload}{os.pathsep}."
    run(
        [
            sys.executable,
            "-m",
            "PyInstaller",
            "--noconfirm",
            "--clean",
            "--console",
            "--onefile",
            "--name",
            SETUP_NAME,
            "--icon",
            str(ico),
            "--add-data",
            add_data,
            "--hidden-import",
            "tkinter",
            "--hidden-import",
            "tkinter.filedialog",
            "--hidden-import",
            "tkinter.messagebox",
            "--distpath",
            str(RELEASE),
            "--workpath",
            str(BUILD / "setup"),
            "--specpath",
            str(BUILD),
            str(ROOT / "installer_bootstrap.py"),
        ]
    )

    setup_exe = RELEASE / f"{SETUP_NAME}.exe"
    if not setup_exe.is_file():
        raise FileNotFoundError(f"未生成安装包: {setup_exe}")

    portable_zip = RELEASE / f"{APP_DIR_NAME}-便携版.zip"
    zip_dir(app_dir, portable_zip, arc_root=APP_DIR_NAME)

    readme = RELEASE / "发给朋友-说明.txt"
    readme.write_text(
        "\n".join(
            [
                "发给朋友：猫耳律动-安装包.exe",
                "",
                "朋友双击安装包 → 选择程序安装目录、导入歌曲存放目录 → 创建桌面快捷方式 → 自动启动。",
                "要求：Windows 10/11，已安装 Microsoft Edge 或 Google Chrome。",
                "",
                "有 D/E 盘时，默认会装到非 C 盘；也可以点「浏览」改到任意文件夹。",
                "导入的本地歌按账号放在：所选导入目录\\账号\\music",
                "请不要把导入歌曲目录放在程序安装目录里面（重装会清空程序目录）。",
                "",
                "再次安装：请先关掉正在运行的猫耳律动，再运行安装包（安装程序也会自动结束旧进程）。",
                "第二次打开播放器：可直接点桌面快捷方式，无需重装。",
                "后续版本：客户端会提示更新，点「立即更新」即可覆盖安装，私人歌曲保留。",
                "",
                "若杀毒软件拦截：选「仍要运行 / 允许」。",
                "卸载：删除你选的安装目录，并删掉桌面快捷方式。",
                "清除私人歌曲：删除你选的导入歌曲目录。",
                "",
                "备用：猫耳律动-便携版.zip 解压后双击其中的 猫耳律动.exe 即可。",
                "",
            ]
        ),
        encoding="utf-8",
    )

    write_patch_zip(app_dir)
    patch = RELEASE / "ludong-patch.zip"
    write_update_manifest(setup_exe, patch if patch.is_file() else None)
    shutil.rmtree(staging, ignore_errors=True)
    return setup_exe


def main() -> int:
    print("=== 开始打包猫耳律动 ===")
    write_version_json()
    app_dir = build_app_exe()
    copy_assets(app_dir)
    bundle = build_setup(app_dir)
    print()
    print("打包完成。发给朋友这个文件即可：")
    print(f"  {bundle}")
    print()
    print("备用（解压即用，无需安装）：")
    print(f"  {RELEASE / f'{APP_DIR_NAME}-便携版.zip'}")
    print()
    print("免费版发布更新：上传 release\\ludong-patch.zip + update.json 到 ludong-releases（勿传 87MB 安装包）")
    print(f"说明见：{RELEASE / '发版上传说明.txt'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
