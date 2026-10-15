# -*- coding: utf-8 -*-
"""扫描 music 下各子文件夹中的 mp3/lrc/封面，生成 playlist.json。"""
from __future__ import annotations

import hashlib
import json
import re
import shutil
from pathlib import Path

from PIL import Image

from app_paths import get_root

ROOT = get_root()
MUSIC = ROOT / "music"
OUT = MUSIC / "playlist.json"

SKIP_TAGS = re.compile(r"(aplmate\.com|aplmate|download|320k|flac|^mp3$)", re.I)
COVER_SIZE = 600
COVER_OUT_NAME = "cover.jpg"
COVER_CANDIDATES = (
    "cover.jpg",
    "cover.jpeg",
    "cover.png",
    "cover.webp",
    "folder.jpg",
    "Folder.jpg",
)


def parse_name(stem: str) -> tuple[str, str]:
    parts = [p.strip() for p in re.split(r"\s+-\s+", stem) if p.strip()]
    # 兼容「风铃-蒋孜怡」这类无空格分隔
    if len(parts) == 1 and "-" in stem:
        parts = [p.strip() for p in stem.split("-", 1) if p.strip()]
    parts = [p for p in parts if not SKIP_TAGS.fullmatch(p) and not SKIP_TAGS.search(p)]
    parts = [p for p in parts if "aplmate" not in p.lower()]
    if not parts:
        return stem, "未知歌手"
    if len(parts) == 1:
        return parts[0], "未知歌手"
    return parts[0], parts[1]


def folder_name(title: str, artist: str) -> str:
    raw = f"{title} - {artist}".strip(" -")
    return re.sub(r'[<>:"/\\|?*]', "_", raw).strip() or "未命名歌曲"


def stable_id(key: str) -> str:
    digest = hashlib.md5(key.encode("utf-8")).hexdigest()[:10]
    return f"local-{digest}"


def norm_key(text: str) -> str:
    return re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "", text.casefold())


def find_lrc(mp3: Path) -> Path | None:
    """同文件夹内：优先同名 .lrc/.srt，否则取第一份歌词文件。"""
    for ext in (".lrc", ".srt"):
        same = mp3.with_suffix(ext)
        if same.is_file():
            return same
    lyrics = sorted(mp3.parent.glob("*.lrc")) + sorted(mp3.parent.glob("*.srt"))
    lyrics = [p for p in lyrics if p.is_file()]
    return lyrics[0] if lyrics else None


# 浏览器可播的 MV；.acc 按用户实际文件后缀一并识别
VIDEO_EXTS = (".mp4", ".webm", ".mkv", ".mov", ".m4v", ".acc")


def find_video(mp3: Path) -> Path | None:
    """同文件夹内：优先与 mp3 同名的视频，其次 mv/video，再取第一份。"""
    folder = mp3.parent
    for ext in VIDEO_EXTS:
        same = mp3.with_suffix(ext)
        if same.is_file():
            return same
    for stem in ("mv", "MV", "video", "Video"):
        for ext in VIDEO_EXTS:
            p = folder / f"{stem}{ext}"
            if p.is_file():
                return p
    videos: list[Path] = []
    for ext in VIDEO_EXTS:
        videos.extend(folder.glob(f"*{ext}"))
    videos = [p for p in videos if p.is_file()]
    return sorted(videos, key=lambda p: p.name.casefold())[0] if videos else None


def process_cover_image(src: Path, dest: Path, size: int = COVER_SIZE) -> None:
    """统一为正方形 JPEG 封面。"""
    img = Image.open(src)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGBA")
        bg = Image.new("RGB", img.size, (18, 22, 28))
        bg.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
        img = bg
    else:
        img = img.convert("RGB")

    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    img = img.crop((left, top, left + side, top + side))
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "JPEG", quality=88, optimize=True)


def ensure_song_folders() -> None:
    """把 music 根目录散落的 mp3 归入「歌名 - 歌手」子文件夹。"""
    MUSIC.mkdir(exist_ok=True)
    for mp3 in list(MUSIC.glob("*.mp3")):
        title, artist = parse_name(mp3.stem)
        dest_dir = MUSIC / folder_name(title, artist)
        dest_dir.mkdir(exist_ok=True)
        target = dest_dir / mp3.name
        if not target.exists():
            shutil.move(str(mp3), str(target))
        root_lrc = mp3.with_suffix(".lrc")
        if root_lrc.exists():
            shutil.move(str(root_lrc), str(dest_dir / root_lrc.name))


def match_song_folder(stem: str) -> Path | None:
    """把根目录封面文件名匹配到 music 子文件夹。"""
    key = norm_key(stem)
    if not key or key in {"logo"}:
        return None
    folders = [d for d in MUSIC.iterdir() if d.is_dir()]
    best: Path | None = None
    best_score = 0
    for folder in folders:
        title = folder.name.split(" - ")[0]
        title_key = norm_key(title)
        folder_key = norm_key(folder.name)
        score = 0
        if key == title_key or key == folder_key:
            score = 100
        elif key in folder_key or title_key in key:
            score = min(len(key), len(title_key)) + 20
        elif folder_key in key:
            score = min(len(key), len(folder_key)) + 10
        if score > best_score:
            best_score = score
            best = folder
    return best if best_score >= 10 else None


def ingest_root_covers() -> None:
    """把工作区根目录的歌曲封面图写入对应歌曲文件夹并统一处理为 cover.jpg。"""
    MUSIC.mkdir(exist_ok=True)
    for src in sorted(ROOT.glob("*.jpg")) + sorted(ROOT.glob("*.jpeg")) + sorted(
        ROOT.glob("*.png")
    ) + sorted(ROOT.glob("*.webp")):
        if src.name.casefold() == "logo.jpg":
            continue
        folder = match_song_folder(src.stem)
        if not folder:
            print(f" 跳过未匹配封面: {src.name}")
            continue
        dest = folder / COVER_OUT_NAME
        process_cover_image(src, dest)
        print(f" 封面已写入: {folder.name}/{COVER_OUT_NAME} ← {src.name}")
        try:
            src.unlink()
        except OSError:
            print(f" 提示: 无法删除根目录原图（可能被占用）: {src.name}")


def find_cover(folder: Path) -> Path | None:
    """优先标准 cover.jpg；否则取文件夹内图片并规范化。"""
    standard = folder / COVER_OUT_NAME
    if standard.is_file():
        return standard

    for name in COVER_CANDIDATES:
        p = folder / name
        if p.is_file():
            try:
                process_cover_image(p, standard)
                return standard
            except Exception:
                return p

    images: list[Path] = []
    for pat in ("*.jpg", "*.jpeg", "*.png", "*.webp"):
        images.extend(folder.glob(pat))
    images = [p for p in images if p.is_file()]
    if not images:
        return None
    src = sorted(images, key=lambda p: p.name.casefold())[0]
    try:
        process_cover_image(src, standard)
        return standard
    except Exception:
        return src


def main() -> None:
    ensure_song_folders()
    print("处理根目录歌曲封面…")
    ingest_root_covers()

    # 公共曲库写入 music/playlist.json（私人曲库在 userdata，不进安装包）
    from library import regenerate_shared_playlist

    songs = regenerate_shared_playlist()
    print(f"已生成 {len(songs)} 首公共歌曲到 music/playlist.json")
    for s in songs:
        flag = "有歌词" if s["lrc"] else "无歌词"
        cover_flag = "有封面" if s["cover"] else "无封面"
        print(f" - {s['title']} / {s['artist']} [{flag}] [{cover_flag}]")


if __name__ == "__main__":
    main()
