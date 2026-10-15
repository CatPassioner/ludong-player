# -*- coding: utf-8 -*-
"""听歌次数统计：严格按账号写入 userdata/<uid>/play_stats.json。"""
from __future__ import annotations

import json
import re
import threading
from pathlib import Path
from typing import Any

from app_paths import get_root, get_userdata_root, sanitize_user_id, user_dir

ROOT = get_root()
_LOCK = threading.Lock()
_tls = threading.local()


def set_active_user(user_id: str | None) -> None:
    _tls.user_id = sanitize_user_id(user_id)


def _active_user() -> str:
    return sanitize_user_id(getattr(_tls, "user_id", "") or "")


def _stats_path(user_id: str) -> Path:
    uid = sanitize_user_id(user_id)
    if not uid:
        raise ValueError("missing user id")
    base = user_dir(uid)
    if base is None:
        raise ValueError("cannot resolve user dir")
    return base / "play_stats.json"


def _norm(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").strip().casefold())


def song_key(title: str, artist: str, song_id: str = "") -> str:
    t, a = _norm(title), _norm(artist)
    if t or a:
        return f"{t}|{a}"
    return _norm(song_id) or "unknown"


def load_stats(user_id: str | None = None) -> dict[str, Any]:
    uid = sanitize_user_id(user_id if user_id is not None else _active_user())
    if not uid:
        return {"version": 1, "songs": {}}
    try:
        path = _stats_path(uid)
    except ValueError:
        return {"version": 1, "songs": {}}
    if not path.is_file():
        return {"version": 1, "songs": {}}
    try:
        data = json.loads(path.read_text(encoding="utf-8-sig"))
        if not isinstance(data, dict):
            return {"version": 1, "songs": {}}
        songs = data.get("songs")
        if not isinstance(songs, dict):
            data["songs"] = {}
        data.setdefault("version", 1)
        return data
    except Exception:
        return {"version": 1, "songs": {}}


def save_stats(data: dict[str, Any], user_id: str | None = None) -> None:
    uid = sanitize_user_id(user_id if user_id is not None else _active_user())
    if not uid:
        return
    path = _stats_path(uid)
    path.parent.mkdir(parents=True, exist_ok=True)
    text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    tmp = path.with_suffix(".json.tmp")
    tmp.write_text(text, encoding="utf-8")
    tmp.replace(path)


def ranking(limit: int = 10, user_id: str | None = None) -> list[dict[str, Any]]:
    data = load_stats(user_id)
    songs = data.get("songs") or {}
    rows = []
    for key, item in songs.items():
        if not isinstance(item, dict):
            continue
        count = int(item.get("count") or 0)
        if count <= 0:
            continue
        rows.append(
            {
                "key": key,
                "title": item.get("title") or "未知歌曲",
                "artist": item.get("artist") or "未知歌手",
                "cover": item.get("cover") or "",
                "id": item.get("id") or "",
                "count": count,
            }
        )
    rows.sort(key=lambda x: (-x["count"], x["title"]))
    return rows[: max(1, min(limit, 50))]


def reset_shared_stats() -> dict[str, Any]:
    """只清安装目录里的旧公共 play_stats.json，绝不碰各账号 userdata 统计。"""
    cleared: list[str] = []
    shared = ROOT / "play_stats.json"
    try:
        if shared.is_file():
            shared.write_text(
                json.dumps({"version": 1, "songs": {}}, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            cleared.append(str(shared))
    except Exception:
        pass
    return {"ok": True, "cleared": cleared}


def record_play(payload: dict[str, Any]) -> dict[str, Any]:
    uid = sanitize_user_id(payload.get("userId") or payload.get("user_id"))
    if not uid:
        return {"ok": False, "error": "缺少账号，无法记录听歌次数"}
    set_active_user(uid)
    title = str(payload.get("title") or "").strip()
    artist = str(payload.get("artist") or "").strip()
    song_id = str(payload.get("id") or "").strip()
    cover = str(payload.get("cover") or "").strip()
    if cover.lower().startswith("./music/"):
        cover = cover[8:]
    elif cover.lower().startswith("music/"):
        cover = cover[6:]
    for _ in range(2):
        try:
            from urllib.parse import unquote

            decoded = unquote(cover)
            if decoded == cover:
                break
            cover = decoded
        except Exception:
            break
    delta = int(payload.get("delta") or 1)
    if delta < 1:
        delta = 1
    if delta > 100:
        delta = 100

    key = str(payload.get("key") or "").strip() or song_key(title, artist, song_id)
    with _LOCK:
        data = load_stats(uid)
        songs = data.setdefault("songs", {})
        item = songs.get(key) if isinstance(songs.get(key), dict) else {}
        item = {
            "title": title or item.get("title") or "未知歌曲",
            "artist": artist or item.get("artist") or "未知歌手",
            "cover": cover or item.get("cover") or "",
            "id": song_id or item.get("id") or "",
            "count": int(item.get("count") or 0) + delta,
        }
        songs[key] = item
        save_stats(data, uid)
        return {
            "ok": True,
            "key": key,
            "count": item["count"],
            "userId": uid,
            "ranking": ranking(8, uid),
        }
