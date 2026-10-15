# -*- coding: utf-8 -*-
"""我喜欢：严格按账号写入 userdata/<uid>/likes.json。"""
from __future__ import annotations

import json
import threading
import time
from pathlib import Path
from typing import Any

from app_paths import sanitize_user_id, user_dir
from play_stats import song_key

_LOCK = threading.Lock()
_tls = threading.local()


def set_active_user(user_id: str | None) -> None:
    _tls.user_id = sanitize_user_id(user_id)


def _active_user() -> str:
    return sanitize_user_id(getattr(_tls, "user_id", "") or "")


def _likes_path(user_id: str) -> Path:
    uid = sanitize_user_id(user_id)
    if not uid:
        raise ValueError("missing user id")
    base = user_dir(uid)
    if base is None:
        raise ValueError("cannot resolve user dir")
    return base / "likes.json"


def load_likes(user_id: str | None = None) -> dict[str, Any]:
    uid = sanitize_user_id(user_id if user_id is not None else _active_user())
    if not uid:
        return {"version": 1, "songs": {}}
    try:
        path = _likes_path(uid)
    except ValueError:
        return {"version": 1, "songs": {}}
    if not path.is_file():
        return {"version": 1, "songs": {}}
    try:
        data = json.loads(path.read_text(encoding="utf-8-sig"))
        if not isinstance(data, dict):
            return {"version": 1, "songs": {}}
        if not isinstance(data.get("songs"), dict):
            data["songs"] = {}
        data.setdefault("version", 1)
        return data
    except Exception:
        return {"version": 1, "songs": {}}


def save_likes(data: dict[str, Any], user_id: str | None = None) -> None:
    uid = sanitize_user_id(user_id if user_id is not None else _active_user())
    if not uid:
        return
    path = _likes_path(uid)
    path.parent.mkdir(parents=True, exist_ok=True)
    text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    tmp = path.with_suffix(".json.tmp")
    tmp.write_text(text, encoding="utf-8")
    tmp.replace(path)


def list_likes(user_id: str | None = None) -> list[dict[str, Any]]:
    songs = load_likes(user_id).get("songs") or {}
    rows = []
    for key, item in songs.items():
        if not isinstance(item, dict):
            continue
        rows.append(
            {
                "key": key,
                "id": item.get("id") or "",
                "title": item.get("title") or "未知歌曲",
                "artist": item.get("artist") or "未知歌手",
                "cover": item.get("cover") or "",
                "coverRel": item.get("coverRel") or "",
                "fileRel": item.get("fileRel") or "",
                "lrcFile": item.get("lrcFile") or "",
                "url": item.get("url") or "",
                "base": item.get("base") or "",
                "scope": item.get("scope") or "",
                "local": bool(item.get("local")),
                "likedAt": int(item.get("likedAt") or 0),
            }
        )
    rows.sort(key=lambda x: (-x["likedAt"], x["title"]))
    return rows


def upsert_like(payload: dict[str, Any], liked: bool = True) -> dict[str, Any]:
    uid = sanitize_user_id(payload.get("userId") or payload.get("user_id"))
    if not uid:
        return {"ok": False, "error": "缺少账号，无法保存喜欢"}
    set_active_user(uid)
    title = str(payload.get("title") or "").strip()
    artist = str(payload.get("artist") or "").strip()
    song_id = str(payload.get("id") or "").strip()
    key = str(payload.get("key") or "").strip() or song_key(title, artist, song_id)

    with _LOCK:
        data = load_likes(uid)
        songs = data.setdefault("songs", {})
        if not liked:
            songs.pop(key, None)
            if song_id:
                for k, item in list(songs.items()):
                    if str(item.get("id") or "") == song_id:
                        songs.pop(k, None)
            save_likes(data, uid)
            return {
                "ok": True,
                "liked": False,
                "key": key,
                "likes": list_likes(uid),
            }

        prev = songs.get(key) if isinstance(songs.get(key), dict) else {}
        songs[key] = {
            "id": song_id or prev.get("id") or "",
            "title": title or prev.get("title") or "未知歌曲",
            "artist": artist or prev.get("artist") or "未知歌手",
            "cover": str(payload.get("cover") or prev.get("cover") or ""),
            "coverRel": str(payload.get("coverRel") or prev.get("coverRel") or ""),
            "fileRel": str(payload.get("fileRel") or prev.get("fileRel") or ""),
            "lrcFile": str(payload.get("lrcFile") or prev.get("lrcFile") or ""),
            "url": str(payload.get("url") or prev.get("url") or ""),
            "base": str(payload.get("base") or prev.get("base") or ""),
            "scope": str(payload.get("scope") or prev.get("scope") or ""),
            "local": bool(
                payload.get("local") if "local" in payload else prev.get("local")
            ),
            "likedAt": int(time.time() * 1000),
        }
        save_likes(data, uid)
        return {
            "ok": True,
            "liked": True,
            "key": key,
            "likes": list_likes(uid),
        }
