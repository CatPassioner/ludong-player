# -*- coding: utf-8 -*-
"""删除本地歌曲：mp3 / lrc / 封面（公共曲库或当前账号私人曲库）。"""
from __future__ import annotations

import shutil
from pathlib import Path
from typing import Any

from app_paths import sanitize_user_id, shared_music_dir, user_music_dir
from library import build_merged_playlist, regenerate_shared_playlist, resolve_media_path
from play_stats import load_stats, save_stats, song_key, set_active_user

COVER_NAMES = {
    "cover.jpg",
    "cover.jpeg",
    "cover.png",
    "cover.webp",
    "folder.jpg",
    "Folder.jpg",
}


def _unlink(path: Path | None, removed: list[str], music_root: Path) -> None:
    if path is None or not path.is_file():
        return
    try:
        path.unlink()
        try:
            removed.append(path.relative_to(music_root).as_posix())
        except ValueError:
            removed.append(path.name)
    except OSError:
        pass


def _cleanup_folder(folder: Path, music_root: Path) -> None:
    if not folder.is_dir() or folder.resolve() == music_root.resolve():
        return
    try:
        leftovers = list(folder.iterdir())
    except OSError:
        return
    useful = [
        p
        for p in leftovers
        if p.is_file()
        and p.suffix.lower() in {".mp3", ".lrc", ".jpg", ".jpeg", ".png", ".webp"}
    ]
    if useful:
        return
    shutil.rmtree(folder, ignore_errors=True)


def delete_song(payload: dict[str, Any]) -> dict[str, Any]:
    scope = str(payload.get("scope") or "").strip().lower()
    base = str(payload.get("base") or "").strip()
    file_rel = str(payload.get("file") or "").strip()
    lrc_rel = str(payload.get("lrc") or "").strip()
    cover_rel = str(payload.get("cover") or "").strip()
    title = str(payload.get("title") or "").strip()
    artist = str(payload.get("artist") or "").strip()
    song_id = str(payload.get("id") or "").strip()
    uid = sanitize_user_id(payload.get("userId") or payload.get("user_id"))

    # 兼容旧数据：没传 scope/base 时按路径判断
    if not scope:
        if base.startswith("userdata/"):
            scope = "user"
        else:
            scope = "shared"
    if not base:
        base = f"userdata/{uid}/music" if scope == "user" and uid else "music"

    if scope == "user":
        if not uid:
            return {"ok": False, "error": "请先登录后再删除私人歌曲"}
        if not base.startswith(f"userdata/{uid}/"):
            return {"ok": False, "error": "无权删除该歌曲"}
        music = user_music_dir(uid)
        if music is None:
            return {"ok": False, "error": "私人曲库不存在"}
    else:
        # 公共曲库：本机安装目录下的共享歌曲
        scope = "shared"
        base = "music"
        music = shared_music_dir()
        music.mkdir(exist_ok=True)

    mp3 = resolve_media_path(base, file_rel)
    if mp3 is None or not mp3.is_file():
        return {"ok": False, "error": "找不到要删除的 MP3 文件"}

    removed: list[str] = []
    folder = mp3.parent
    _unlink(mp3, removed, music)

    lrc = resolve_media_path(base, lrc_rel) if lrc_rel else None
    if lrc is None and folder.is_dir():
        for p in folder.glob("*.lrc"):
            _unlink(p, removed, music)
    else:
        _unlink(lrc, removed, music)

    cover = resolve_media_path(base, cover_rel) if cover_rel else None
    if cover is not None:
        _unlink(cover, removed, music)
    elif folder.is_dir() and folder.resolve() != music.resolve():
        for name in COVER_NAMES:
            _unlink(folder / name, removed, music)
        for pat in ("*.jpg", "*.jpeg", "*.png", "*.webp"):
            for p in folder.glob(pat):
                _unlink(p, removed, music)

    _cleanup_folder(folder, music)

    if scope == "user" and uid:
        build_merged_playlist(uid)
    else:
        regenerate_shared_playlist()
        if uid:
            build_merged_playlist(uid)

    # 清统计 / 喜欢
    try:
        if uid:
            set_active_user(uid)
        data = load_stats(uid or None)
        songs = data.get("songs") or {}
        key = song_key(title, artist, song_id)
        changed = False
        if key in songs:
            songs.pop(key, None)
            changed = True
        for k, item in list(songs.items()):
            if song_id and str(item.get("id") or "") == song_id:
                songs.pop(k, None)
                changed = True
        if changed:
            data["songs"] = songs
            save_stats(data, uid or None)
    except Exception:
        pass

    try:
        from likes import load_likes, save_likes, set_active_user as set_likes_user

        if uid:
            set_likes_user(uid)
        liked = load_likes(uid or None)
        songs = liked.get("songs") or {}
        key = song_key(title, artist, song_id)
        changed = False
        if key in songs:
            songs.pop(key, None)
            changed = True
        for k, item in list(songs.items()):
            if song_id and str(item.get("id") or "") == song_id:
                songs.pop(k, None)
                changed = True
        if changed:
            liked["songs"] = songs
            save_likes(liked, uid or None)
    except Exception:
        pass

    return {"ok": True, "removed": removed, "scope": scope}
