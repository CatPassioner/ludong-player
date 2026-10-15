# -*- coding: utf-8 -*-
"""扫描 lyrics-bg 文件夹，生成背景图列表（支持 png/jpg/jpeg/webp/gif）。"""
from __future__ import annotations

import json
from pathlib import Path

from app_paths import get_root

ROOT = get_root()
BG_DIR = ROOT / "lyrics-bg"
OUT = BG_DIR / "list.json"
EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"}


def main() -> None:
    BG_DIR.mkdir(exist_ok=True)
    files = sorted(
        [p for p in BG_DIR.iterdir() if p.is_file() and p.suffix.lower() in EXTS],
        key=lambda p: p.name.casefold(),
    )
    data = [{"file": p.name} for p in files]
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8-sig")
    print(f"已生成 {len(data)} 张歌词背景到 lyrics-bg/list.json")
    for item in data:
        print(f" - {item['file']}")


if __name__ == "__main__":
    main()
