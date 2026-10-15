# -*- coding: utf-8 -*-
"""歌词页自定义封面库：上传后可在列表里选取。"""
from __future__ import annotations

import json
import time
import uuid
from pathlib import Path
from typing import Any

from app_paths import default_userdata_root, get_userdata_root

INDEX_NAME = "index.json"
ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
MAX_BYTES = 12 * 1024 * 1024
MAX_ITEMS = 60


def cover_dir() -> Path:
    try:
        base = get_userdata_root().parent
    except Exception:
        base = default_userdata_root().parent
    path = base / "cover-library"
    path.mkdir(parents=True, exist_ok=True)
    return path


def _read_index() -> list[dict[str, Any]]:
    path = cover_dir() / INDEX_NAME
    if not path.is_file():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        rows = data if isinstance(data, list) else data.get("items") or []
        return [r for r in rows if isinstance(r, dict) and r.get("id")]
    except Exception:
        return []


def _write_index(items: list[dict[str, Any]]) -> None:
    (cover_dir() / INDEX_NAME).write_text(
        json.dumps(items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def item_path(item_id: str) -> Path | None:
    iid = str(item_id or "").strip()
    if not iid or "/" in iid or "\\" in iid or ".." in iid:
        return None
    p = cover_dir() / f"{iid}.jpg"
    return p if p.is_file() else None


def list_items() -> dict[str, Any]:
    items = []
    for row in _read_index():
        iid = str(row.get("id") or "")
        p = item_path(iid)
        if not p:
            continue
        mtime = int(p.stat().st_mtime)
        items.append(
            {
                "id": iid,
                "name": str(row.get("name") or "封面"),
                "previewUrl": f"/api/cover-library/preview?id={iid}&v={mtime}",
                "createdAt": row.get("createdAt") or mtime,
            }
        )
    return {"ok": True, "items": items}


def add_upload(filename: str, data: bytes) -> dict[str, Any]:
    name = str(filename or "cover.jpg")
    ext = Path(name).suffix.lower()
    if ext not in ALLOWED_EXT:
        return {"ok": False, "error": "仅支持 JPG / PNG / WebP / BMP"}
    if not data:
        return {"ok": False, "error": "空文件"}
    if len(data) > MAX_BYTES:
        return {"ok": False, "error": "图片过大（请小于 12MB）"}

    iid = uuid.uuid4().hex[:12]
    raw = cover_dir() / f"upload{ext}"
    out = cover_dir() / f"{iid}.jpg"
    raw.write_bytes(data)
    try:
        from PIL import Image

        with Image.open(raw) as im:
            im = im.convert("RGB")
            # 封面库缩略存档，控制体积
            im.thumbnail((1280, 1280), Image.Resampling.LANCZOS)
            im.save(out, format="JPEG", quality=88, optimize=True)
    except Exception as exc:
        return {"ok": False, "error": f"无法读取图片：{exc}"}
    finally:
        try:
            if raw.is_file():
                raw.unlink()
        except OSError:
            pass

    items = _read_index()
    items.insert(
        0,
        {
            "id": iid,
            "name": Path(name).stem[:40] or "封面",
            "createdAt": int(time.time()),
        },
    )
    # 超限删最旧
    while len(items) > MAX_ITEMS:
        old = items.pop()
        op = item_path(str(old.get("id") or ""))
        if op:
            try:
                op.unlink()
            except OSError:
                pass
    _write_index(items)
    result = list_items()
    result.update({"ok": True, "id": iid, "message": "已加入封面库"})
    return result


def delete_item(item_id: str) -> dict[str, Any]:
    iid = str(item_id or "").strip()
    items = [r for r in _read_index() if str(r.get("id")) != iid]
    p = cover_dir() / f"{iid}.jpg"
    if p.is_file():
        try:
            p.unlink()
        except OSError:
            pass
    _write_index(items)
    result = list_items()
    result.update({"ok": True, "message": "已删除"})
    return result
