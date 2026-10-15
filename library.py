# -*- coding: utf-8 -*-
"""公共曲库 + 每账号私人曲库的扫描与合并。"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app_paths import get_root, sanitize_user_id, shared_music_dir, user_music_dir
from gen_playlist import (
    COVER_CANDIDATES,
    find_cover,
    find_lrc,
    find_video,
    parse_name,
    stable_id,
)


def _scan_dir(music_dir: Path, *, scope: str, base: str, id_prefix: str) -> list[dict[str, Any]]:
    if not music_dir.is_dir():
        return []
    songs: list[dict[str, Any]] = []
    files = sorted(music_dir.glob("*/*.mp3"), key=lambda p: p.as_posix().casefold())
    files += sorted(music_dir.glob("*.mp3"), key=lambda p: p.name.casefold())
    seen: set[str] = set()
    for path in files:
        try:
            rel = path.relative_to(music_dir).as_posix()
        except ValueError:
            continue
        if rel in seen:
            continue
        seen.add(rel)
        title, artist = parse_name(path.stem)
        lrc = find_lrc(path)
        video = find_video(path)
        folder = path.parent
        cover = None
        if folder != music_dir:
            cover = find_cover(folder)
        else:
            for name in COVER_CANDIDATES:
                p = music_dir / name
                if p.is_file():
                    cover = p
                    break
        cover_rel = ""
        if cover and cover.is_file():
            try:
                cover_rel = cover.relative_to(music_dir).as_posix()
            except ValueError:
                cover_rel = ""
        lrc_rel = ""
        if lrc and lrc.is_file():
            try:
                lrc_rel = lrc.relative_to(music_dir).as_posix()
            except ValueError:
                lrc_rel = ""
        video_rel = ""
        if video and video.is_file():
            try:
                video_rel = video.relative_to(music_dir).as_posix()
            except ValueError:
                video_rel = ""
        songs.append(
            {
                "id": f"{id_prefix}-{stable_id(rel)}",
                "title": title,
                "artist": artist,
                "cover": cover_rel,
                "file": rel,
                "lrc": lrc_rel,
                "video": video_rel,
                "duration": 0,
                "scope": scope,
                "base": base,
            }
        )
    return songs


def write_playlist(music_dir: Path, songs: list[dict[str, Any]]) -> None:
    music_dir.mkdir(parents=True, exist_ok=True)
    out = music_dir / "playlist.json"
    # 落盘时去掉运行时字段也可；保留 scope/base 方便调试
    text = json.dumps(songs, ensure_ascii=False, indent=2) + "\n"
    out.write_text(text, encoding="utf-8-sig")


def regenerate_shared_playlist() -> list[dict[str, Any]]:
    music = shared_music_dir()
    music.mkdir(exist_ok=True)
    songs = _scan_dir(music, scope="shared", base="music", id_prefix="shared")
    write_playlist(music, songs)
    return songs


def regenerate_user_playlist(user_id: str) -> list[dict[str, Any]]:
    uid = sanitize_user_id(user_id)
    music = user_music_dir(uid)
    if music is None:
        return []
    base = f"userdata/{uid}/music"
    songs = _scan_dir(music, scope="user", base=base, id_prefix=f"user-{uid[:8]}")
    write_playlist(music, songs)
    return songs


def build_merged_playlist(user_id: str | None = None) -> list[dict[str, Any]]:
    shared = regenerate_shared_playlist()
    uid = sanitize_user_id(user_id)
    if not uid:
        return shared
    private = regenerate_user_playlist(uid)
    return shared + private


def resolve_media_path(base: str, rel: str) -> Path | None:
    """把 base + relative file 解析成绝对路径，并做目录穿越检查。"""
    rel = (rel or "").replace("\\", "/").strip().lstrip("/")
    base = (base or "").replace("\\", "/").strip().strip("/")
    if not rel or ".." in rel.split("/"):
        return None
    root = get_root()
    if base == "music" or base.startswith("music/"):
        full = (shared_music_dir() / rel).resolve()
        try:
            full.relative_to(shared_music_dir().resolve())
        except ValueError:
            return None
        return full
    if base.startswith("userdata/"):
        # userdata/<uid>/music
        parts = base.split("/")
        if len(parts) < 3 or parts[0] != "userdata":
            return None
        uid = sanitize_user_id(parts[1])
        music = user_music_dir(uid)
        if music is None:
            return None
        full = (music / rel).resolve()
        try:
            full.relative_to(music.resolve())
        except ValueError:
            return None
        return full
    # 兼容旧数据：只有 rel
    full = (root / "music" / rel).resolve()
    try:
        full.relative_to((root / "music").resolve())
    except ValueError:
        return None
    return full
