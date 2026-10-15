# -*- coding: utf-8 -*-
"""歌曲评论：持久化到 comments.json（含楼中楼回复 / 点赞 / 爱心 / 删除）。"""
from __future__ import annotations

import json
import threading
import time
import uuid
from typing import Any

from app_paths import get_root
from play_stats import song_key

ROOT = get_root()
COMMENTS_PATH = ROOT / "comments.json"
_LOCK = threading.Lock()


def load_comments() -> dict[str, Any]:
    if not COMMENTS_PATH.is_file():
        return {"version": 1, "songs": {}}
    try:
        data = json.loads(COMMENTS_PATH.read_text(encoding="utf-8-sig"))
        if not isinstance(data, dict):
            return {"version": 1, "songs": {}}
        if not isinstance(data.get("songs"), dict):
            data["songs"] = {}
        data.setdefault("version", 1)
        return data
    except Exception:
        return {"version": 1, "songs": {}}


def save_comments(data: dict[str, Any]) -> None:
    COMMENTS_PATH.parent.mkdir(parents=True, exist_ok=True)
    text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    tmp = COMMENTS_PATH.with_suffix(".json.tmp")
    tmp.write_text(text, encoding="utf-8")
    tmp.replace(COMMENTS_PATH)


def _normalize_item(item: dict[str, Any]) -> dict[str, Any] | None:
    text = str(item.get("text") or "").strip()
    if not text:
        return None
    liked = bool(item.get("liked"))
    hearted = bool(item.get("hearted"))
    likes = int(item.get("likes") or 0)
    hearts = int(item.get("hearts") or 0)
    if liked and likes < 1:
        likes = 1
    if hearted and hearts < 1:
        hearts = 1
    if not liked:
        likes = 0
    if not hearted:
        hearts = 0
    parent_id = str(item.get("parentId") or item.get("parent_id") or "").strip()
    return {
        "id": str(item.get("id") or ""),
        "text": text,
        "author": str(item.get("author") or item.get("author_name") or ""),
        "time": int(item.get("time") or 0),
        "likes": likes,
        "hearts": hearts,
        "liked": liked,
        "hearted": hearted,
        "parentId": parent_id,
        "userId": str(item.get("userId") or item.get("user_id") or ""),
    }


def list_comments(
    title: str = "", artist: str = "", song_id: str = "", key: str = ""
) -> list[dict[str, Any]]:
    key = (key or "").strip() or song_key(title, artist, song_id)
    songs = load_comments().get("songs") or {}
    rows = songs.get(key) if isinstance(songs.get(key), list) else []
    out: list[dict[str, Any]] = []
    for item in rows:
        if not isinstance(item, dict):
            continue
        norm = _normalize_item(item)
        if norm:
            out.append(norm)
    out.sort(key=lambda x: x["time"])
    return out


def _resolve_key(payload: dict[str, Any]) -> str:
    title = str(payload.get("title") or "").strip()
    artist = str(payload.get("artist") or "").strip()
    song_id = str(payload.get("id") or payload.get("songId") or "").strip()
    key = str(payload.get("key") or "").strip()
    return key or song_key(title, artist, song_id)


def add_comment(payload: dict[str, Any]) -> dict[str, Any]:
    key = _resolve_key(payload)
    text = str(payload.get("text") or "").strip()
    if not text:
        return {"ok": False, "error": "评论不能为空"}
    if text.startswith("__STICKER__:"):
        if len(text) > 12000:
            return {"ok": False, "error": "表情包过大，请换用内置表情包"}
    elif len(text) > 500:
        return {"ok": False, "error": "评论请不超过 500 字"}

    parent_id = str(payload.get("parentId") or payload.get("parent_id") or "").strip()
    item = {
        "id": uuid.uuid4().hex[:12],
        "text": text,
        "author": str(payload.get("author") or "").strip(),
        "time": int(time.time() * 1000),
        "likes": 0,
        "hearts": 0,
        "liked": False,
        "hearted": False,
        "parentId": parent_id,
        "userId": str(payload.get("userId") or "").strip(),
    }
    with _LOCK:
        data = load_comments()
        songs = data.setdefault("songs", {})
        rows = songs.get(key) if isinstance(songs.get(key), list) else []
        if parent_id:
            exists = any(
                isinstance(r, dict) and str(r.get("id")) == parent_id for r in rows
            )
            if not exists:
                return {"ok": False, "error": "原评论不存在，无法回复"}
            # 若回复的是回复，挂到顶层评论下
            for r in rows:
                if isinstance(r, dict) and str(r.get("id")) == parent_id:
                    root = str(r.get("parentId") or r.get("parent_id") or "").strip()
                    if root:
                        item["parentId"] = root
                    break
        rows = [*rows, item]
        songs[key] = rows[-300:]
        save_comments(data)
    return {"ok": True, "comment": _normalize_item(item), "comments": list_comments(key=key)}


def delete_comment(payload: dict[str, Any]) -> dict[str, Any]:
    key = _resolve_key(payload)
    comment_id = str(payload.get("commentId") or payload.get("comment_id") or "").strip()
    if not comment_id:
        return {"ok": False, "error": "缺少评论 ID"}
    with _LOCK:
        data = load_comments()
        songs = data.setdefault("songs", {})
        rows = songs.get(key) if isinstance(songs.get(key), list) else []
        next_rows = []
        removed = False
        for r in rows:
            if not isinstance(r, dict):
                continue
            rid = str(r.get("id") or "")
            pid = str(r.get("parentId") or r.get("parent_id") or "")
            if rid == comment_id or pid == comment_id:
                removed = True
                continue
            next_rows.append(r)
        if not removed:
            return {"ok": False, "error": "找不到这条评论"}
        songs[key] = next_rows
        save_comments(data)
    return {"ok": True, "comments": list_comments(key=key)}


def react_comment(payload: dict[str, Any], kind: str) -> dict[str, Any]:
    """kind: like | heart —— 本地单用户，再次点击取消。"""
    key = _resolve_key(payload)
    comment_id = str(payload.get("commentId") or payload.get("comment_id") or "").strip()
    if not comment_id:
        return {"ok": False, "error": "缺少评论 ID"}
    flag = "liked" if kind == "like" else "hearted"
    count_key = "likes" if kind == "like" else "hearts"

    with _LOCK:
        data = load_comments()
        songs = data.setdefault("songs", {})
        rows = songs.get(key) if isinstance(songs.get(key), list) else []
        found = None
        for r in rows:
            if isinstance(r, dict) and str(r.get("id")) == comment_id:
                on = not bool(r.get(flag))
                r[flag] = on
                r[count_key] = 1 if on else 0
                found = r
                break
        if found is None:
            return {"ok": False, "error": "找不到这条评论"}
        songs[key] = rows
        save_comments(data)
    return {
        "ok": True,
        "comment": _normalize_item(found),
        "comments": list_comments(key=key),
    }


def handle_comment_action(payload: dict[str, Any]) -> dict[str, Any]:
    action = str(payload.get("action") or "add").strip().lower()
    if action in ("add", "create", "send"):
        return add_comment(payload)
    if action in ("delete", "remove"):
        return delete_comment(payload)
    if action == "like":
        return react_comment(payload, "like")
    if action == "heart":
        return react_comment(payload, "heart")
    return {"ok": False, "error": f"未知操作: {action}"}
