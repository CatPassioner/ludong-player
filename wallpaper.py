# -*- coding: utf-8 -*-
"""静态桌面壁纸：壁纸库 + 读屏幕尺寸、缩放、设置/还原。"""
from __future__ import annotations

import json
import time
import uuid
from pathlib import Path
from typing import Any

from app_paths import default_userdata_root, get_userdata_root

META_NAME = "meta.json"
SOURCE_NAME = "source.jpg"
PREPARED_NAME = "prepared.jpg"
ORIG_NAME = "original.json"
SELECTED_NAME = "selected.json"
LIBRARY_INDEX = "index.json"
ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
MAX_BYTES = 25 * 1024 * 1024
MAX_LIBRARY = 40


def wallpaper_dir() -> Path:
    """机器级目录（与账号无关），放在 userdata 根的同级。"""
    try:
        base = get_userdata_root().parent
    except Exception:
        base = default_userdata_root().parent
    path = base / "wallpaper"
    path.mkdir(parents=True, exist_ok=True)
    return path


def library_dir() -> Path:
    path = wallpaper_dir() / "library"
    path.mkdir(parents=True, exist_ok=True)
    return path


def screen_size() -> dict[str, int]:
    """读取屏幕像素；多显示器时优先用虚拟桌面总尺寸。"""
    w = h = 0
    try:
        import ctypes

        user32 = ctypes.windll.user32
        try:
            user32.SetProcessDPIAware()
        except Exception:
            pass
        primary_w = int(user32.GetSystemMetrics(0) or 0)
        primary_h = int(user32.GetSystemMetrics(1) or 0)
        virt_w = int(user32.GetSystemMetrics(78) or 0)
        virt_h = int(user32.GetSystemMetrics(79) or 0)
        if virt_w >= primary_w and virt_h >= primary_h and virt_w > 0 and virt_h > 0:
            w, h = virt_w, virt_h
        else:
            w, h = primary_w, primary_h
    except Exception:
        w = h = 0
    if w < 320 or h < 240:
        w, h = 1920, 1080
    return {"width": w, "height": h}


def _read_json(path: Path) -> dict[str, Any]:
    if not path.is_file():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def _current_wallpaper_from_registry() -> dict[str, str]:
    out = {"path": "", "style": "10", "tile": "0"}
    try:
        import winreg

        with winreg.OpenKey(
            winreg.HKEY_CURRENT_USER, r"Control Panel\Desktop"
        ) as key:
            try:
                out["path"] = str(winreg.QueryValueEx(key, "Wallpaper")[0] or "")
            except OSError:
                pass
            try:
                out["style"] = str(winreg.QueryValueEx(key, "WallpaperStyle")[0] or "10")
            except OSError:
                pass
            try:
                out["tile"] = str(winreg.QueryValueEx(key, "TileWallpaper")[0] or "0")
            except OSError:
                pass
    except Exception:
        pass
    return out


def _backup_original_if_needed() -> dict[str, Any]:
    """首次由本软件改壁纸前，备份系统原壁纸路径。"""
    dest = wallpaper_dir() / ORIG_NAME
    existing = _read_json(dest)
    if existing.get("path") or existing.get("backedUp"):
        return existing
    cur = _current_wallpaper_from_registry()
    prepared = (wallpaper_dir() / PREPARED_NAME).resolve()
    cur_path = Path(cur.get("path") or "")
    # 若当前已是我们生成的图，仍记一份，避免空备份
    meta = {
        "backedUp": True,
        "path": str(cur_path) if cur_path.is_file() else str(cur.get("path") or ""),
        "style": cur.get("style") or "10",
        "tile": cur.get("tile") or "0",
        "preparedPath": str(prepared),
    }
    _write_json(dest, meta)
    return meta


def _fit_cover(img, width: int, height: int):
    """等比放大后居中裁切，铺满屏幕。"""
    from PIL import Image

    iw, ih = img.size
    if iw <= 0 or ih <= 0:
        return img.resize((width, height), Image.Resampling.LANCZOS)
    scale = max(width / iw, height / ih)
    nw = max(1, int(round(iw * scale)))
    nh = max(1, int(round(ih * scale)))
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = max(0, (nw - width) // 2)
    top = max(0, (nh - height) // 2)
    return resized.crop((left, top, left + width, top + height))


def prepare_image(src: Path, width: int | None = None, height: int | None = None) -> Path:
    from PIL import Image

    size = screen_size()
    tw = int(width or size["width"])
    th = int(height or size["height"])
    with Image.open(src) as im:
        im = im.convert("RGB")
        fitted = _fit_cover(im, tw, th)
        out = wallpaper_dir() / PREPARED_NAME
        fitted.save(out, format="JPEG", quality=92, optimize=True)
    return out


def _set_windows_wallpaper(image_path: Path) -> None:
    import ctypes

    path = str(image_path.resolve())
    if not Path(path).is_file():
        raise FileNotFoundError("壁纸文件不存在")

    # 样式：填充（Fill）
    try:
        import winreg

        with winreg.OpenKey(
            winreg.HKEY_CURRENT_USER,
            r"Control Panel\Desktop",
            0,
            winreg.KEY_SET_VALUE,
        ) as key:
            winreg.SetValueEx(key, "WallpaperStyle", 0, winreg.REG_SZ, "10")
            winreg.SetValueEx(key, "TileWallpaper", 0, winreg.REG_SZ, "0")
    except Exception:
        pass

    SPI_SETDESKWALLPAPER = 0x0014
    SPIF_UPDATEINIFILE = 0x01
    SPIF_SENDWININICHANGE = 0x02
    ok = ctypes.windll.user32.SystemParametersInfoW(
        SPI_SETDESKWALLPAPER,
        0,
        path,
        SPIF_UPDATEINIFILE | SPIF_SENDWININICHANGE,
    )
    if not ok:
        raise OSError("系统拒绝设置桌面壁纸（可检查杀毒/权限）")


def _library_index_path() -> Path:
    return library_dir() / LIBRARY_INDEX


def _read_library_index() -> list[dict[str, Any]]:
    path = _library_index_path()
    if not path.is_file():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        rows = data if isinstance(data, list) else data.get("items") or []
        return [r for r in rows if isinstance(r, dict) and r.get("id")]
    except Exception:
        return []


def _write_library_index(items: list[dict[str, Any]]) -> None:
    _write_json(_library_index_path(), {"items": items})


def library_item_path(item_id: str) -> Path | None:
    iid = str(item_id or "").strip()
    if not iid or "/" in iid or "\\" in iid or ".." in iid:
        return None
    p = library_dir() / f"{iid}.jpg"
    return p if p.is_file() else None


def _migrate_legacy_source() -> None:
    """把旧版单张 source.jpg 迁进壁纸库。"""
    d = wallpaper_dir()
    source = d / SOURCE_NAME
    if not source.is_file():
        return
    items = _read_library_index()
    if items:
        return
    iid = uuid.uuid4().hex[:12]
    dest = library_dir() / f"{iid}.jpg"
    try:
        dest.write_bytes(source.read_bytes())
    except OSError:
        return
    items = [
        {
            "id": iid,
            "name": "壁纸",
            "createdAt": int(source.stat().st_mtime),
        }
    ]
    _write_library_index(items)
    _write_json(d / SELECTED_NAME, {"id": iid})


def list_library() -> list[dict[str, Any]]:
    _migrate_legacy_source()
    out = []
    for row in _read_library_index():
        iid = str(row.get("id") or "")
        p = library_item_path(iid)
        if not p:
            continue
        mtime = int(p.stat().st_mtime)
        out.append(
            {
                "id": iid,
                "name": str(row.get("name") or "壁纸"),
                "previewUrl": f"/api/wallpaper/preview?id={iid}&v={mtime}",
                "createdAt": row.get("createdAt") or mtime,
            }
        )
    return out


def selected_id() -> str:
    data = _read_json(wallpaper_dir() / SELECTED_NAME)
    return str(data.get("id") or "")


def status() -> dict[str, Any]:
    size = screen_size()
    d = wallpaper_dir()
    source = d / SOURCE_NAME
    prepared = d / PREPARED_NAME
    orig = _read_json(d / ORIG_NAME)
    items = list_library()
    sid = selected_id()
    if sid and not any(i["id"] == sid for i in items):
        sid = items[0]["id"] if items else ""
    has_source = source.is_file() and source.stat().st_size > 0
    has_prepared = prepared.is_file() and prepared.stat().st_size > 0
    preview = ""
    if sid:
        p = library_item_path(sid)
        if p:
            preview = f"/api/wallpaper/preview?id={sid}&v={int(p.stat().st_mtime)}"
    if not preview and has_prepared:
        preview = f"/api/wallpaper/preview?v={int(prepared.stat().st_mtime)}"
    elif not preview and has_source:
        preview = f"/api/wallpaper/preview?kind=source&v={int(source.stat().st_mtime)}"
    return {
        "ok": True,
        "screenWidth": size["width"],
        "screenHeight": size["height"],
        "hasImage": bool(items) or has_source or has_prepared,
        "hasPrepared": has_prepared,
        "canRestore": bool(orig.get("backedUp")),
        "active": bool(orig.get("applied")),
        "previewUrl": preview,
        "selectedId": sid,
        "items": items,
        "originalPath": str(orig.get("path") or ""),
    }


def _set_selected(item_id: str) -> None:
    _write_json(wallpaper_dir() / SELECTED_NAME, {"id": str(item_id or "")})


def _use_library_as_source(item_id: str) -> Path:
    lib = library_item_path(item_id)
    if not lib:
        raise FileNotFoundError("壁纸库里找不到这张图")
    source = wallpaper_dir() / SOURCE_NAME
    source.write_bytes(lib.read_bytes())
    _set_selected(item_id)
    return source


def save_upload(filename: str, data: bytes) -> dict[str, Any]:
    name = str(filename or "wallpaper.jpg")
    ext = Path(name).suffix.lower()
    if ext not in ALLOWED_EXT:
        return {"ok": False, "error": "仅支持 JPG / PNG / WebP / BMP"}
    if not data:
        return {"ok": False, "error": "空文件"}
    if len(data) > MAX_BYTES:
        return {"ok": False, "error": "图片过大（请小于 25MB）"}

    size = screen_size()
    d = wallpaper_dir()
    raw_path = d / f"upload{ext}"
    raw_path.write_bytes(data)
    iid = uuid.uuid4().hex[:12]
    lib_path = library_dir() / f"{iid}.jpg"
    source = d / SOURCE_NAME
    try:
        from PIL import Image

        with Image.open(raw_path) as im:
            rgb = im.convert("RGB")
            rgb.save(lib_path, format="JPEG", quality=92, optimize=True)
            rgb.save(source, format="JPEG", quality=95, optimize=True)
    except Exception as exc:
        return {"ok": False, "error": f"无法读取图片：{exc}"}
    finally:
        try:
            if raw_path.is_file():
                raw_path.unlink()
        except OSError:
            pass

    items = _read_library_index()
    items.insert(
        0,
        {
            "id": iid,
            "name": Path(name).stem[:40] or "壁纸",
            "createdAt": int(time.time()),
        },
    )
    while len(items) > MAX_LIBRARY:
        old = items.pop()
        op = library_item_path(str(old.get("id") or ""))
        if op:
            try:
                op.unlink()
            except OSError:
                pass
    _write_library_index(items)
    _set_selected(iid)
    prepare_image(source, size["width"], size["height"])
    meta = {
        "filename": name,
        "screenWidth": size["width"],
        "screenHeight": size["height"],
        "savedAt": time.time(),
        "id": iid,
    }
    _write_json(d / META_NAME, meta)
    st = status()
    st.update(
        {
            "ok": True,
            "id": iid,
            "message": f"已加入壁纸库（{size['width']}×{size['height']}）",
        }
    )
    return st


def select_item(item_id: str) -> dict[str, Any]:
    try:
        _use_library_as_source(item_id)
    except Exception as exc:
        return {"ok": False, "error": str(exc)}
    size = screen_size()
    prepare_image(wallpaper_dir() / SOURCE_NAME, size["width"], size["height"])
    st = status()
    st.update({"ok": True, "message": "已选中这张壁纸"})
    return st


def apply_saved(item_id: str | None = None) -> dict[str, Any]:
    d = wallpaper_dir()
    sid = str(item_id or selected_id() or "").strip()
    if sid:
        try:
            _use_library_as_source(sid)
        except Exception as exc:
            return {"ok": False, "error": str(exc)}
    source = d / SOURCE_NAME
    prepared = d / PREPARED_NAME
    if not source.is_file() and not prepared.is_file():
        return {"ok": False, "error": "请先在壁纸库上传或选择一张图片"}

    size = screen_size()
    if source.is_file():
        prepared = prepare_image(source, size["width"], size["height"])
    elif not prepared.is_file():
        return {"ok": False, "error": "请先在壁纸库上传或选择一张图片"}

    _backup_original_if_needed()
    try:
        _set_windows_wallpaper(prepared)
    except Exception as exc:
        return {"ok": False, "error": str(exc)}

    orig = _read_json(d / ORIG_NAME)
    orig["applied"] = True
    orig["appliedPath"] = str(prepared.resolve())
    _write_json(d / ORIG_NAME, orig)
    st = status()
    st.update(
        {
            "ok": True,
            "message": f"已设为桌面壁纸（{size['width']}×{size['height']}）",
        }
    )
    return st


def apply_upload(filename: str, data: bytes) -> dict[str, Any]:
    saved = save_upload(filename, data)
    if not saved.get("ok"):
        return saved
    return apply_saved(saved.get("id"))


def delete_library_item(item_id: str) -> dict[str, Any]:
    iid = str(item_id or "").strip()
    items = [r for r in _read_library_index() if str(r.get("id")) != iid]
    p = library_dir() / f"{iid}.jpg"
    if p.is_file():
        try:
            p.unlink()
        except OSError:
            pass
    _write_library_index(items)
    if selected_id() == iid:
        _set_selected(items[0]["id"] if items else "")
    st = status()
    st.update({"ok": True, "message": "已从壁纸库删除"})
    return st


def restore_original() -> dict[str, Any]:
    d = wallpaper_dir()
    orig = _read_json(d / ORIG_NAME)
    if not orig.get("backedUp"):
        return {"ok": False, "error": "没有可还原的原壁纸（尚未用本软件设置过）"}

    path = Path(str(orig.get("path") or "").strip())
    # 不要还原到我们自己生成的 prepared.jpg
    prepared = (d / PREPARED_NAME).resolve()
    try:
        if path.is_file() and path.resolve() != prepared:
            # 写回样式
            try:
                import winreg

                with winreg.OpenKey(
                    winreg.HKEY_CURRENT_USER,
                    r"Control Panel\Desktop",
                    0,
                    winreg.KEY_SET_VALUE,
                ) as key:
                    winreg.SetValueEx(
                        key,
                        "WallpaperStyle",
                        0,
                        winreg.REG_SZ,
                        str(orig.get("style") or "10"),
                    )
                    winreg.SetValueEx(
                        key,
                        "TileWallpaper",
                        0,
                        winreg.REG_SZ,
                        str(orig.get("tile") or "0"),
                    )
            except Exception:
                pass
            _set_windows_wallpaper(path)
            msg = "已还原原来的桌面壁纸"
        else:
            # 原文件不在了：用系统默认方式尽量清掉自定义
            try:
                import ctypes

                SPI_SETDESKWALLPAPER = 0x0014
                SPIF_UPDATEINIFILE = 0x01
                SPIF_SENDWININICHANGE = 0x02
                ctypes.windll.user32.SystemParametersInfoW(
                    SPI_SETDESKWALLPAPER,
                    0,
                    "",
                    SPIF_UPDATEINIFILE | SPIF_SENDWININICHANGE,
                )
            except Exception:
                pass
            msg = "原壁纸文件已不存在，已尝试清除自定义壁纸；可在 Windows 设置里再选一张"
    except Exception as exc:
        return {"ok": False, "error": str(exc)}

    orig["applied"] = False
    _write_json(d / ORIG_NAME, orig)
    st = status()
    st.update({"ok": True, "message": msg})
    return st


def preview_path(kind: str = "", item_id: str = "") -> Path | None:
    if item_id:
        return library_item_path(item_id)
    d = wallpaper_dir()
    if str(kind or "").lower() == "source":
        p = d / SOURCE_NAME
        return p if p.is_file() else None
    p = d / PREPARED_NAME
    if p.is_file():
        return p
    p = d / SOURCE_NAME
    return p if p.is_file() else None
