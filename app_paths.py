# -*- coding: utf-8 -*-
"""应用路径：安装目录 + 每账号独立用户数据（不打进安装包）。"""
from __future__ import annotations

import os
import re
import sys
from pathlib import Path

# UUID 最长 36；允许连字符与下划线
_USER_ID_RE = re.compile(r"^[A-Za-z0-9_-]{1,80}$")
CONFIG_NAME = "ludong-config.json"


def get_root() -> Path:
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent


def _config_path() -> Path:
    return get_root() / CONFIG_NAME


def read_app_config() -> dict:
    path = _config_path()
    if not path.is_file():
        return {}
    try:
        import json

        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def default_userdata_root() -> Path:
    base = os.environ.get("LOCALAPPDATA") or os.environ.get("HOME") or str(get_root())
    return Path(base) / "LudongPlayer" / "userdata"


def get_userdata_root() -> Path:
    """
    用户私有数据根目录（歌单/导入/喜欢/统计）。
    优先读安装时写入的 ludong-config.json，否则用旧的 LOCALAPPDATA 默认路径。
    """
    raw = str(read_app_config().get("userdata_root") or "").strip()
    path = Path(raw) if raw else default_userdata_root()
    path.mkdir(parents=True, exist_ok=True)
    return path


def sanitize_user_id(user_id: str | None) -> str:
    uid = str(user_id or "").strip()
    if not uid:
        return ""
    if not _USER_ID_RE.fullmatch(uid):
        import hashlib

        return "u-" + hashlib.md5(uid.encode("utf-8")).hexdigest()[:16]
    return uid


def shared_music_dir() -> Path:
    return get_root() / "music"


def user_dir(user_id: str | None) -> Path | None:
    uid = sanitize_user_id(user_id)
    if not uid:
        return None
    path = get_userdata_root() / uid
    path.mkdir(parents=True, exist_ok=True)
    return path


def user_music_dir(user_id: str | None) -> Path | None:
    base = user_dir(user_id)
    if base is None:
        return None
    music = base / "music"
    music.mkdir(parents=True, exist_ok=True)
    return music
