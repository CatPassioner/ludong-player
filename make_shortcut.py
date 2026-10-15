# -*- coding: utf-8 -*-
"""在项目目录和桌面创建「猫耳律动」快捷方式。"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PY = Path(sys.executable)
PYW = PY.with_name("pythonw.exe")
TARGET = PYW if PYW.is_file() else PY
SCRIPT = ROOT / "desktop_app.py"
LINK_NAME = "猫耳律动.lnk"


def make_ico() -> str:
    src = ROOT / "logo.jpg"
    ico = ROOT / "logo.ico"
    try:
        from PIL import Image

        if src.is_file():
            img = Image.open(src).convert("RGBA")
            img = img.resize((256, 256), Image.Resampling.LANCZOS)
            img.save(ico, sizes=[(256, 256), (64, 64), (48, 48), (32, 32), (16, 16)])
            return str(ico)
    except Exception:
        pass
    return str(TARGET)


def q(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def create_shortcut(path: Path, icon: str) -> None:
    ps_file = ROOT / "_mk_shortcut.ps1"
    ps_file.write_text(
        "\n".join(
            [
                "$s = New-Object -ComObject WScript.Shell",
                f"$sc = $s.CreateShortcut({q(str(path))})",
                f"$sc.TargetPath = {q(str(TARGET))}",
                f"$sc.Arguments = {q(str(SCRIPT))}",
                f"$sc.WorkingDirectory = {q(str(ROOT))}",
                "$sc.WindowStyle = 7",
                "$sc.Description = 'Maor Ludong'",
                f"$sc.IconLocation = {q(icon)}",
                "$sc.Save()",
            ]
        ),
        encoding="utf-8-sig",
    )
    subprocess.run(
        [
            "powershell",
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            str(ps_file),
        ],
        check=False,
    )
    try:
        ps_file.unlink()
    except OSError:
        pass
    print("shortcut:", path, "exists" if path.is_file() else "FAILED")


def main() -> None:
    icon = make_ico()
    desktop = Path.home() / "Desktop"
    onedrive = Path.home() / "OneDrive" / "Desktop"
    targets = [ROOT / LINK_NAME]
    if desktop.is_dir():
        targets.append(desktop / LINK_NAME)
    elif onedrive.is_dir():
        targets.append(onedrive / LINK_NAME)
    for p in targets:
        create_shortcut(p, icon)


if __name__ == "__main__":
    main()
