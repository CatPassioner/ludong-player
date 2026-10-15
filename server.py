# -*- coding: utf-8 -*-
"""本地播放器服务：公共曲库 + 每账号私人曲库。"""
from __future__ import annotations

import argparse
import json
import mimetypes
import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, unquote, urlparse

from app_paths import get_root, get_userdata_root, sanitize_user_id

ROOT = get_root()
# 与 desktop_app 一致：http://127.0.0.1:5500/maoerludong/
APP_WEB_PATH = "maoerludong"


def _load_disk_module(mod_name: str, file_name: str):
    """把安装目录旁的 .py 注入为正式模块名，供 import_music 等使用。"""
    import importlib.util
    import sys

    path = get_root() / file_name
    if not path.is_file():
        return None
    spec = importlib.util.spec_from_file_location(mod_name, path)
    if not spec or not spec.loader:
        return None
    mod = importlib.util.module_from_spec(spec)
    sys.modules[mod_name] = mod
    spec.loader.exec_module(mod)
    return mod


def _load_import_music():
    """优先用安装目录旁的 py，方便补丁更新导入/扫盘逻辑。"""
    import importlib

    # 先替换依赖，避免外部 import_music 仍引用 exe 内旧的 find_lrc
    _load_disk_module("app_paths", "app_paths.py")
    _load_disk_module("gen_playlist", "gen_playlist.py")
    _load_disk_module("library", "library.py")
    mod = _load_disk_module("import_music", "import_music.py")
    if mod is not None:
        return mod.import_file_bytes, mod.parse_multipart
    mod = importlib.import_module("import_music")
    return mod.import_file_bytes, mod.parse_multipart


def _load_wallpaper():
    """优先用安装目录旁的 wallpaper.py，方便补丁更新。"""
    import importlib

    _load_disk_module("app_paths", "app_paths.py")
    mod = _load_disk_module("wallpaper", "wallpaper.py")
    if mod is not None:
        return mod
    return importlib.import_module("wallpaper")


def _load_cover_library():
    import importlib

    _load_disk_module("app_paths", "app_paths.py")
    mod = _load_disk_module("cover_library", "cover_library.py")
    if mod is not None:
        return mod
    return importlib.import_module("cover_library")


class UTF8Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **getattr(SimpleHTTPRequestHandler, "extensions_map", {}),
        ".js": "application/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".html": "text/html; charset=utf-8",
        ".mp3": "audio/mpeg",
        ".mp4": "video/mp4",
        ".webm": "video/webm",
        ".mkv": "video/x-matroska",
        ".mov": "video/quicktime",
        ".m4v": "video/x-m4v",
        ".acc": "video/mp4",
    }

    def translate_path(self, path: str) -> str:
        path = unquote(path, encoding="utf-8", errors="replace")
        path = path.split("?", 1)[0].split("#", 1)[0]
        rel = path.lstrip("/")
        # /maoerludong/... → 项目根目录文件
        prefix = APP_WEB_PATH + "/"
        if rel == APP_WEB_PATH or rel.startswith(prefix):
            rel = "" if rel == APP_WEB_PATH else rel[len(prefix) :]

        # 私人文件：/userdata/<uid>/... → %LOCALAPPDATA%/猫耳律动/userdata/<uid>/...
        if rel.startswith("userdata/") or rel.startswith("userdata\\"):
            rest = rel.split("/", 1)[1] if "/" in rel else ""
            full = (get_userdata_root() / rest).resolve()
            try:
                full.relative_to(get_userdata_root().resolve())
            except ValueError:
                return str(ROOT / "index.html")
            return str(full)

        full = (ROOT / rel).resolve()
        try:
            full.relative_to(ROOT)
        except ValueError:
            return str(ROOT / "index.html")
        return str(full)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def _send_json(self, code: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _user_id_from_qs(self, parsed) -> str:
        qs = parse_qs(parsed.query or "")
        return sanitize_user_id((qs.get("userId") or qs.get("user_id") or [""])[0])

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path, encoding="utf-8", errors="replace")
        uid = self._user_id_from_qs(parsed)

        # 根路径与无斜杠入口 → /maoerludong/
        if path in ("", "/"):
            self.send_response(302)
            self.send_header("Location", f"/{APP_WEB_PATH}/")
            self.end_headers()
            return
        if path.rstrip("/") == f"/{APP_WEB_PATH}" and not path.endswith("/"):
            q = f"?{parsed.query}" if parsed.query else ""
            self.send_response(302)
            self.send_header("Location", f"/{APP_WEB_PATH}/{q}")
            self.end_headers()
            return

        if path.rstrip("/") == "/api/playlist":
            try:
                from library import build_merged_playlist

                songs = build_merged_playlist(uid or None)
                self._send_json(
                    200,
                    {
                        "ok": True,
                        "songs": songs,
                        "sharedCount": sum(1 for s in songs if s.get("scope") == "shared"),
                        "privateCount": sum(1 for s in songs if s.get("scope") == "user"),
                        "userId": uid or "",
                    },
                )
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/version":
            try:
                from updater import local_version, manifest_url

                self._send_json(
                    200,
                    {
                        "ok": True,
                        "version": local_version(),
                        "manifestUrl": manifest_url(),
                        "installDir": str(get_root()),
                    },
                )
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/wallpaper/status":
            try:
                wp = _load_wallpaper()
                self._send_json(200, wp.status())
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/wallpaper/preview":
            try:
                wp = _load_wallpaper()
                qs = parse_qs(parsed.query or "")
                kind = str((qs.get("kind") or [""])[0] or "")
                item_id = str((qs.get("id") or [""])[0] or "")
                img = wp.preview_path(kind, item_id)
                if not img or not img.is_file():
                    self.send_error(404, "No wallpaper preview")
                    return
                data = img.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "image/jpeg")
                self.send_header("Content-Length", str(len(data)))
                self.send_header("Cache-Control", "no-cache")
                self.end_headers()
                self.wfile.write(data)
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/cover-library":
            try:
                cl = _load_cover_library()
                self._send_json(200, cl.list_items())
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/cover-library/preview":
            try:
                cl = _load_cover_library()
                qs = parse_qs(parsed.query or "")
                item_id = str((qs.get("id") or [""])[0] or "")
                img = cl.item_path(item_id)
                if not img or not img.is_file():
                    self.send_error(404, "No cover")
                    return
                data = img.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "image/jpeg")
                self.send_header("Content-Length", str(len(data)))
                self.send_header("Cache-Control", "no-cache")
                self.end_headers()
                self.wfile.write(data)
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/update/check":
            try:
                from updater import check_for_update

                self._send_json(200, check_for_update())
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/play-stats":
            try:
                from play_stats import load_stats, ranking, set_active_user

                if not uid:
                    self._send_json(
                        200,
                        {"ok": True, "songs": {}, "ranking": [], "userId": ""},
                    )
                    return
                set_active_user(uid)
                data = load_stats(uid)
                self._send_json(
                    200,
                    {
                        "ok": True,
                        "songs": data.get("songs") or {},
                        "ranking": ranking(8, uid),
                        "userId": uid,
                    },
                )
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/likes":
            try:
                from likes import list_likes, load_likes, set_active_user

                if uid:
                    set_active_user(uid)
                data = load_likes(uid or None)
                self._send_json(
                    200,
                    {
                        "ok": True,
                        "songs": data.get("songs") or {},
                        "likes": list_likes(uid or None),
                    },
                )
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/comments":
            try:
                from comments import list_comments

                qs = parse_qs(parsed.query or "")
                key = (qs.get("key") or [""])[0]
                title = (qs.get("title") or [""])[0]
                artist = (qs.get("artist") or [""])[0]
                song_id = (qs.get("id") or [""])[0]
                rows = list_comments(
                    title=title, artist=artist, song_id=song_id, key=key
                )
                self._send_json(200, {"ok": True, "comments": rows})
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return
        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path, encoding="utf-8", errors="replace")
        uid_qs = self._user_id_from_qs(parsed)

        if path.rstrip("/") == "/api/play-stats":
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                length = 0
            body = self.rfile.read(max(0, length)) if length > 0 else b"{}"
            try:
                payload = json.loads(body.decode("utf-8") or "{}")
                if not isinstance(payload, dict):
                    raise ValueError("invalid payload")
                if uid_qs and not payload.get("userId"):
                    payload["userId"] = uid_qs
                from play_stats import record_play

                self._send_json(200, record_play(payload))
            except Exception as exc:
                self._send_json(400, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/play-stats/reset-shared":
            try:
                from play_stats import reset_shared_stats

                self._send_json(200, reset_shared_stats())
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/likes":
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                length = 0
            body = self.rfile.read(max(0, length)) if length > 0 else b"{}"
            try:
                payload = json.loads(body.decode("utf-8") or "{}")
                if not isinstance(payload, dict):
                    raise ValueError("invalid payload")
                if uid_qs and not payload.get("userId"):
                    payload["userId"] = uid_qs
                liked = payload.get("liked")
                if liked is None:
                    liked = str(payload.get("action") or "add").lower() != "remove"
                from likes import upsert_like

                self._send_json(200, upsert_like(payload, bool(liked)))
            except Exception as exc:
                self._send_json(400, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/comments":
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                length = 0
            body = self.rfile.read(max(0, length)) if length > 0 else b"{}"
            try:
                payload = json.loads(body.decode("utf-8") or "{}")
                if not isinstance(payload, dict):
                    raise ValueError("invalid payload")
                from comments import handle_comment_action

                result = handle_comment_action(payload)
                code = 200 if result.get("ok") else 400
                self._send_json(code, result)
            except Exception as exc:
                self._send_json(400, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/delete-song":
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                length = 0
            body = self.rfile.read(max(0, length)) if length > 0 else b"{}"
            try:
                payload = json.loads(body.decode("utf-8") or "{}")
                if not isinstance(payload, dict):
                    raise ValueError("invalid payload")
                if uid_qs and not payload.get("userId"):
                    payload["userId"] = uid_qs
                from delete_song import delete_song

                result = delete_song(payload)
                code = 200 if result.get("ok") else 400
                self._send_json(code, result)
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/update/apply":
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                length = 0
            body = self.rfile.read(max(0, length)) if length > 0 else b"{}"
            try:
                payload = json.loads(body.decode("utf-8") or "{}")
                if not isinstance(payload, dict):
                    payload = {}
                from updater import apply_update

                result = apply_update(
                    payload.get("installerUrl") or None,
                    payload.get("patchUrl") or None,
                )
                code = 200 if result.get("ok") else 400
                self._send_json(code, result)
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/update/apply-upload":
            # 浏览器已下载补丁时走此接口（避开本机 Python 连不上 Supabase）
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                length = 0
            if length <= 0:
                self._send_json(400, {"ok": False, "error": "没有收到补丁文件"})
                return
            if length > 30 * 1024 * 1024:
                self._send_json(400, {"ok": False, "error": "补丁过大"})
                return
            body = self.rfile.read(length)
            content_type = self.headers.get("Content-Type", "")
            latest = str((qs.get("latestVersion") or qs.get("version") or [""])[0] or "")
            raw = body
            try:
                if "multipart/form-data" in content_type.lower():
                    _imp, parse_multipart = _load_import_music()
                    items = parse_multipart(body, content_type)
                    # parse_multipart → [(filename, data), ...]
                    if not items:
                        self._send_json(400, {"ok": False, "error": "表单里没有补丁文件"})
                        return
                    raw = items[0][1]
                from updater import apply_patch_bytes

                result = apply_patch_bytes(raw, latest)
                code = 200 if result.get("ok") else 400
                self._send_json(code, result)
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/wallpaper/upload":
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                length = 0
            if length <= 0:
                self._send_json(400, {"ok": False, "error": "没有收到图片"})
                return
            if length > 25 * 1024 * 1024:
                self._send_json(400, {"ok": False, "error": "图片过大（请小于 25MB）"})
                return
            body = self.rfile.read(length)
            content_type = self.headers.get("Content-Type", "")
            try:
                wp = _load_wallpaper()
                _, parse_multipart = _load_import_music()
                items = parse_multipart(body, content_type)
                if not items:
                    self._send_json(400, {"ok": False, "error": "未解析到图片文件"})
                    return
                name, data = items[0][0], items[0][1]
                result = wp.save_upload(name, data)
                code = 200 if result.get("ok") else 400
                self._send_json(code, result)
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/wallpaper/apply":
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                length = 0
            body = self.rfile.read(max(0, length)) if length > 0 else b""
            content_type = self.headers.get("Content-Type", "")
            try:
                wp = _load_wallpaper()
                if length > 0 and "multipart/form-data" in content_type.lower():
                    _, parse_multipart = _load_import_music()
                    items = parse_multipart(body, content_type)
                    if items:
                        result = wp.apply_upload(items[0][0], items[0][1])
                    else:
                        result = wp.apply_saved()
                else:
                    payload = {}
                    if body:
                        try:
                            payload = json.loads(body.decode("utf-8") or "{}")
                        except Exception:
                            payload = {}
                    if not isinstance(payload, dict):
                        payload = {}
                    result = wp.apply_saved(payload.get("id") or None)
                code = 200 if result.get("ok") else 400
                self._send_json(code, result)
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/wallpaper/select":
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                length = 0
            body = self.rfile.read(max(0, length)) if length > 0 else b"{}"
            try:
                payload = json.loads(body.decode("utf-8") or "{}")
                if not isinstance(payload, dict):
                    payload = {}
                wp = _load_wallpaper()
                result = wp.select_item(str(payload.get("id") or ""))
                code = 200 if result.get("ok") else 400
                self._send_json(code, result)
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/wallpaper/delete":
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                length = 0
            body = self.rfile.read(max(0, length)) if length > 0 else b"{}"
            try:
                payload = json.loads(body.decode("utf-8") or "{}")
                if not isinstance(payload, dict):
                    payload = {}
                wp = _load_wallpaper()
                result = wp.delete_library_item(str(payload.get("id") or ""))
                code = 200 if result.get("ok") else 400
                self._send_json(code, result)
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/wallpaper/restore":
            try:
                wp = _load_wallpaper()
                result = wp.restore_original()
                code = 200 if result.get("ok") else 400
                self._send_json(code, result)
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/cover-library/upload":
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                length = 0
            if length <= 0:
                self._send_json(400, {"ok": False, "error": "没有收到图片"})
                return
            if length > 12 * 1024 * 1024:
                self._send_json(400, {"ok": False, "error": "图片过大（请小于 12MB）"})
                return
            body = self.rfile.read(length)
            content_type = self.headers.get("Content-Type", "")
            try:
                cl = _load_cover_library()
                _, parse_multipart = _load_import_music()
                items = parse_multipart(body, content_type)
                if not items:
                    self._send_json(400, {"ok": False, "error": "未解析到图片文件"})
                    return
                result = cl.add_upload(items[0][0], items[0][1])
                code = 200 if result.get("ok") else 400
                self._send_json(code, result)
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") == "/api/cover-library/delete":
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                length = 0
            body = self.rfile.read(max(0, length)) if length > 0 else b"{}"
            try:
                payload = json.loads(body.decode("utf-8") or "{}")
                if not isinstance(payload, dict):
                    payload = {}
                cl = _load_cover_library()
                result = cl.delete_item(str(payload.get("id") or ""))
                code = 200 if result.get("ok") else 400
                self._send_json(code, result)
            except Exception as exc:
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if path.rstrip("/") != "/api/import":
            self.send_error(404, "Not Found")
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0:
            self._send_json(400, {"ok": False, "error": "没有收到文件"})
            return
        if length > 220 * 1024 * 1024:
            self._send_json(400, {"ok": False, "error": "文件过大（单次请小于 220MB）"})
            return

        body = self.rfile.read(length)
        content_type = self.headers.get("Content-Type", "")
        try:
            import_file_bytes, parse_multipart = _load_import_music()

            items = parse_multipart(body, content_type)
            if not items:
                self._send_json(400, {"ok": False, "error": "未解析到可导入的文件"})
                return
            result = import_file_bytes(items, user_id=uid_qs or None)
            code = 200 if result.get("ok") else 400
            self._send_json(code, result)
        except Exception as exc:
            self._send_json(500, {"ok": False, "error": str(exc)})

    def log_message(self, fmt: str, *args) -> None:
        try:
            super().log_message(fmt, *args)
        except UnicodeEncodeError:
            pass


def main() -> None:
    os.chdir(ROOT)
    try:
        from gen_playlist import main as gen

        gen()
    except Exception as exc:
        print(f"生成歌单跳过: {exc}")
    try:
        from gen_lyrics_bg import main as gen_bg

        gen_bg()
    except Exception as exc:
        print(f"歌词背景跳过: {exc}")

    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=5500)
    args = parser.parse_args()

    mimetypes.add_type("audio/mpeg", ".mp3")

    handler = partial(UTF8Handler, directory=str(ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    print(f"猫耳律动已启动: http://127.0.0.1:{args.port}/{APP_WEB_PATH}/")
    print(f"私人曲库目录: {get_userdata_root()}")
    print("支持中英文歌曲文件名，关闭本窗口即停止服务。")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止")


if __name__ == "__main__":
    main()
