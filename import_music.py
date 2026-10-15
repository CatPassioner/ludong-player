# -*- coding: utf-8 -*-
"""导入本地 mp3 / lrc / 封面到「当前账号」私人曲库，并刷新歌单。"""
from __future__ import annotations

import json
import re
from pathlib import Path

from app_paths import sanitize_user_id, user_music_dir
from gen_playlist import (
    COVER_OUT_NAME,
    folder_name,
    parse_name,
    process_cover_image,
)
from library import build_merged_playlist, regenerate_shared_playlist, regenerate_user_playlist

AUDIO_EXT = {".mp3"}
LYRIC_EXT = {".lrc", ".srt"}
COVER_EXT = {".jpg", ".jpeg", ".png", ".webp"}
VIDEO_EXT = {".mp4", ".webm", ".mkv", ".mov", ".m4v", ".acc"}
ALLOWED_EXT = AUDIO_EXT | LYRIC_EXT | COVER_EXT | VIDEO_EXT
BIND_NAME = "song-bind.json"
# 绑定前缀：歌曲-晴天 / 歌曲_晴天 / 歌曲 晴天
SONG_PREFIX_RE = re.compile(r"^歌曲[-_\s]+", re.I)


def safe_filename(name: str) -> str:
    base = Path(name).name
    base = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "_", base).strip(" .")
    return base or "unnamed"


def pairing_stem(stem: str) -> str:
    """去掉「歌曲-」绑定前缀，再参与解析/匹配。"""
    s = str(stem or "").strip()
    stripped = SONG_PREFIX_RE.sub("", s).strip()
    return stripped or s


def parse_song_stem(stem: str) -> tuple[str, str]:
    """解析文件名：先剥绑定前缀，再拆 歌名 - 歌手。"""
    return parse_name(pairing_stem(stem))


def parse_multipart(body: bytes, content_type: str) -> list[tuple[str, bytes]]:
    """解析 multipart/form-data，返回 [(filename, data), ...]。"""
    m = re.search(r"boundary=([^;]+)", content_type, flags=re.I)
    if not m:
        return []
    boundary = m.group(1).strip().strip('"').encode("ascii", "ignore")
    if not boundary:
        return []

    files: list[tuple[str, bytes]] = []
    delim = b"--" + boundary
    for raw in body.split(delim):
        if not raw or raw in (b"--", b"--\r\n", b"\r\n"):
            continue
        if raw.startswith(b"--"):
            continue
        if raw.startswith(b"\r\n"):
            raw = raw[2:]
        if raw.endswith(b"\r\n"):
            raw = raw[:-2]
        if raw == b"--":
            continue

        sep = raw.find(b"\r\n\r\n")
        if sep < 0:
            continue
        header_blob = raw[:sep].decode("utf-8", "replace")
        data = raw[sep + 4 :]
        if data.endswith(b"\r\n"):
            data = data[:-2]

        if "filename=" not in header_blob:
            continue
        fm = re.search(r'filename="([^"]*)"', header_blob, flags=re.I)
        if not fm:
            fm = re.search(r"filename=([^;\r\n]+)", header_blob, flags=re.I)
        if not fm:
            continue
        filename = fm.group(1).strip().strip('"')
        if not filename:
            continue
        files.append((filename, data))
    return files


def _write_bytes(dest: Path, data: bytes) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)


def _norm_key(text: str) -> str:
    return re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "", str(text or "").casefold())


def _stem_match_keys(stem: str) -> list[str]:
    """从一个文件名 stem 抽出用于绑定的规范化键。"""
    raw = str(stem or "").strip()
    paired = pairing_stem(raw)
    title, artist = parse_name(paired)
    stem_title = re.split(r"\s+-\s+", paired, maxsplit=1)[0]
    if "-" in stem_title and " - " not in paired:
        stem_title = paired.split("-", 1)[0].strip() or stem_title
    stem_title = re.sub(
        r"(?i)[\s_\-]*(mv|official|officialmv|歌词|高清|现场|中文)$",
        "",
        stem_title,
    ).strip() or paired
    cleaned = re.sub(
        r"(?i)^(日推歌曲|歌曲|mv|官方|官方mv|完整版)+",
        "",
        stem_title,
    ).strip() or stem_title
    cleaned = re.sub(r"[《（【\[].*$", "", cleaned).strip() or cleaned
    keys = [
        _norm_key(raw),
        _norm_key(paired),
        _norm_key(title),
        _norm_key(f"{title}{artist}"),
        _norm_key(stem_title),
        _norm_key(cleaned),
    ]
    return [k for k in dict.fromkeys(keys) if k and k not in {"logo", "mv", "video", "歌曲"}]


def _read_bind(folder: Path) -> dict:
    path = folder / BIND_NAME
    if not path.is_file():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def _write_bind(folder: Path, stem: str, title: str, artist: str) -> None:
    """写入/合并绑定键，方便以后分开上传仍能进同一文件夹。"""
    folder.mkdir(parents=True, exist_ok=True)
    prev = _read_bind(folder)
    keys = list(prev.get("keys") or [])
    for k in _stem_match_keys(stem):
        if k not in keys:
            keys.append(k)
    title_key = _norm_key(title)
    if title_key and title_key not in keys:
        keys.append(title_key)
    full_key = _norm_key(f"{title}{artist}")
    if full_key and full_key not in keys:
        keys.append(full_key)
    meta = {
        "title": title or prev.get("title") or "",
        "artist": artist or prev.get("artist") or "",
        "keys": keys,
    }
    try:
        (folder / BIND_NAME).write_text(
            json.dumps(meta, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    except OSError:
        pass


def _folder_match_keys(folder: Path) -> list[str]:
    title = folder.name.split(" - ")[0]
    keys = [_norm_key(title), _norm_key(folder.name)]
    bind = _read_bind(folder)
    for k in bind.get("keys") or []:
        nk = _norm_key(str(k))
        if nk:
            keys.append(nk)
    bt = _norm_key(str(bind.get("title") or ""))
    if bt:
        keys.append(bt)
    mp3s = [p for p in folder.glob("*.mp3") if p.is_file()]
    for p in mp3s:
        keys.extend(_stem_match_keys(p.stem))
        keys.append(_norm_key(pairing_stem(p.stem).split(" - ")[0]))
    return [k for k in dict.fromkeys(keys) if k]


def _match_in_music(music: Path, stem: str) -> Path | None:
    """在指定 music 根下按绑定名/歌名匹配歌曲文件夹。"""
    keys = _stem_match_keys(stem)
    if not keys or not music.is_dir():
        return None

    best: Path | None = None
    best_score = 0
    for folder in music.iterdir():
        if not folder.is_dir():
            continue
        folder_keys = _folder_match_keys(folder)
        if not folder_keys:
            continue
        title_key = _norm_key(folder.name.split(" - ")[0])
        folder_key = _norm_key(folder.name)
        score = 0
        for k in keys:
            if k in folder_keys and (k == title_key or k == folder_key):
                score = max(score, 120)
            elif k in folder_keys:
                score = max(score, 110)
            elif k == title_key or k == folder_key:
                score = max(score, 100)
            elif title_key and (k in title_key or title_key in k) and min(len(k), len(title_key)) >= 2:
                score = max(score, min(len(k), len(title_key)) + 40)
            elif any(k in fk or fk in k for fk in folder_keys if len(fk) >= 2 and len(k) >= 2):
                longest = max(len(fk) for fk in folder_keys)
                score = max(score, min(len(k), longest) + 25)
        if score > best_score:
            best_score = score
            best = folder
    # 提高阈值，减少误挂；精确歌名/绑定键一般 ≥100
    return best if best_score >= 40 else None


def _primary_mp3(folder: Path) -> Path | None:
    mp3s = sorted([p for p in folder.glob("*.mp3") if p.is_file()], key=lambda p: p.name.casefold())
    return mp3s[0] if mp3s else None


def _resolve_song_folder(music: Path, stem: str, *, create: bool = True) -> Path | None:
    """
    按「歌曲-歌名」或「歌名 - 歌手」找到已有文件夹；没有则按需新建。
    分开上传时依赖同一绑定名归到同一目录。
    """
    paired = pairing_stem(stem)
    folder = _match_in_music(music, paired) or _match_in_music(music, stem)
    title, artist = parse_song_stem(stem)
    if folder is not None:
        # 先前只有歌词/封面时可能是「歌名 - 未知歌手」，有正式歌手则改名合并
        if artist and artist != "未知歌手":
            old_artist = folder.name.split(" - ")[-1] if " - " in folder.name else ""
            if old_artist in {"", "未知歌手"}:
                target = music / folder_name(title, artist)
                if target.resolve() != folder.resolve():
                    if not target.exists():
                        try:
                            folder.rename(target)
                            folder = target
                        except OSError:
                            pass
                    elif not any(target.glob("*.mp3")):
                        # 目标空壳：把文件挪过去
                        try:
                            target.mkdir(parents=True, exist_ok=True)
                            for item in list(folder.iterdir()):
                                dest = target / item.name
                                if not dest.exists():
                                    item.rename(dest)
                            if not any(folder.iterdir()):
                                folder.rmdir()
                            folder = target
                        except OSError:
                            pass
        _write_bind(folder, stem, title, artist)
        return folder
    if not create:
        return None
    folder = music / folder_name(title, artist)
    folder.mkdir(parents=True, exist_ok=True)
    _write_bind(folder, stem, title, artist)
    return folder


def import_file_bytes(items: list[tuple[str, bytes]], user_id: str | None = None) -> dict:
    """
    导入到当前账号私人空间。无 user_id 时拒绝写入公共曲库，避免互相污染。
    """
    uid = sanitize_user_id(user_id)
    if not uid:
        return {
            "ok": False,
            "error": "请先登录后再导入歌曲（导入只进入你的私人空间）",
        }

    music = user_music_dir(uid)
    if music is None:
        return {"ok": False, "error": "无法创建私人曲库目录"}

    saved_mp3: list[str] = []
    saved_lrc: list[str] = []
    saved_cover: list[str] = []
    saved_video: list[str] = []
    skipped: list[str] = []

    audios: list[tuple[str, bytes]] = []
    lyrics: list[tuple[str, bytes]] = []
    covers: list[tuple[str, bytes]] = []
    videos: list[tuple[str, bytes]] = []

    for name, data in items:
        safe = safe_filename(name)
        ext = Path(safe).suffix.lower()
        if ext not in ALLOWED_EXT:
            if ext in {".aac", ".m4a", ".flac", ".wav", ".ogg"}:
                skipped.append(
                    f"{safe}（这是音频，不是视频；MV 请用 mp4/webm/mkv。音频请用「导入 MP3」或先转成 mp3）"
                )
            else:
                skipped.append(f"{safe}（不支持的格式）")
            continue
        if not data:
            skipped.append(f"{safe}（空文件）")
            continue
        if ext in AUDIO_EXT:
            audios.append((safe, data))
        elif ext in LYRIC_EXT:
            lyrics.append((safe, data))
        elif ext in VIDEO_EXT:
            videos.append((safe, data))
        else:
            covers.append((safe, data))

    for name, data in audios:
        stem = Path(name).stem
        folder = _resolve_song_folder(music, stem, create=True)
        assert folder is not None
        # 磁盘上的 mp3 仍用安全文件名；绑定靠 song-bind.json + 歌名
        dest_name = safe_filename(name)
        # 若原名带「歌曲-」前缀，写入时改成剥前缀后的名字，避免列表显示怪异
        paired = pairing_stem(stem)
        if paired != stem:
            title, artist = parse_song_stem(stem)
            dest_name = safe_filename(f"{folder_name(title, artist)}.mp3")
        dest = folder / dest_name
        _write_bytes(dest, data)
        _write_bind(folder, stem, *parse_song_stem(stem))
        saved_mp3.append(f"{folder.name}/{dest_name}")

    for name, data in lyrics:
        stem = Path(name).stem
        ext = Path(name).suffix.lower() or ".lrc"
        folder = _resolve_song_folder(music, stem, create=True)
        assert folder is not None
        mp3 = _primary_mp3(folder)
        out_name = f"{mp3.stem}{ext}" if mp3 else safe_filename(f"{pairing_stem(stem)}{ext}")
        dest = folder / out_name
        # 同歌只留一份歌词，避免旧 .lrc 挡住新 .srt
        for old in list(folder.iterdir()):
            if not old.is_file():
                continue
            if old.suffix.lower() not in LYRIC_EXT:
                continue
            if old.resolve() == dest.resolve():
                continue
            try:
                old.unlink()
            except OSError:
                pass
        _write_bytes(dest, data)
        saved_lrc.append(f"{folder.name}/{out_name}")

    for name, data in covers:
        stem = Path(name).stem
        folder = _resolve_song_folder(music, stem, create=True)
        assert folder is not None
        tmp = folder / f"_import_{safe_filename(name)}"
        _write_bytes(tmp, data)
        try:
            process_cover_image(tmp, folder / COVER_OUT_NAME)
            saved_cover.append(f"{folder.name}/{COVER_OUT_NAME}")
        except Exception:
            skipped.append(f"{name}（封面处理失败）")
        finally:
            try:
                tmp.unlink(missing_ok=True)
            except OSError:
                pass

    # 本批刚写入的歌曲文件夹，便于「同一次选中 MP3+MP4」时挂上视频
    batch_folders: list[Path] = []
    for rel in saved_mp3:
        folder = music / Path(rel).parts[0]
        if folder.is_dir() and folder not in batch_folders:
            batch_folders.append(folder)

    def _resolve_video_folder(stem: str) -> Path | None:
        folder = _resolve_song_folder(music, stem, create=False)
        if folder is not None:
            return folder
        soft = re.sub(
            r"(?i)[\s_\-]*(mv|official|official.?video|歌词版|高清|现场)$",
            "",
            pairing_stem(stem),
        ).strip()
        if soft and soft != pairing_stem(stem):
            folder = _resolve_song_folder(music, soft, create=False)
            if folder is not None:
                return folder
        if _norm_key(pairing_stem(stem)) in {"mv", "video", "officialmv"} and len(batch_folders) == 1:
            return batch_folders[0]
        if len(batch_folders) == 1:
            return batch_folders[0]
        # 仍无对应歌曲时：若文件名带绑定前缀或「歌名 - 歌手」，先建文件夹收下
        paired = pairing_stem(stem)
        if SONG_PREFIX_RE.match(str(stem or "").strip()) or " - " in paired or (
            "-" in paired and _norm_key(paired) not in {"mv", "video"}
        ):
            return _resolve_song_folder(music, stem, create=True)
        return None

    for name, data in videos:
        stem = Path(name).stem
        ext = Path(name).suffix.lower() or ".mp4"
        folder = _resolve_video_folder(stem)
        if folder is None:
            skipped.append(
                f"{name}（未找到对应歌曲。请命名为「歌曲-歌名」或「歌名 - 歌手」，"
                f"或先导入同名 MP3 / 与 MP3 一起选中）"
            )
            continue
        mp3 = _primary_mp3(folder)
        # 写成与 mp3 同名，歌词页才能稳定找到
        out_name = f"{mp3.stem}{ext}" if mp3 else safe_filename(f"{pairing_stem(stem)}{ext}")
        dest = folder / out_name
        # 覆盖：先清掉该歌文件夹里旧的 MV，避免换后缀后仍播到旧文件
        for old in list(folder.iterdir()):
            if not old.is_file():
                continue
            if old.suffix.lower() not in VIDEO_EXT:
                continue
            if old.resolve() == dest.resolve():
                continue
            try:
                old.unlink()
            except OSError:
                pass
        _write_bytes(dest, data)
        _write_bind(folder, stem, *parse_song_stem(stem))
        saved_video.append(f"{folder.name}/{out_name}")

    merged = build_merged_playlist(uid)
    return {
        "ok": True,
        "mp3": saved_mp3,
        "lrc": saved_lrc,
        "cover": saved_cover,
        "video": saved_video,
        "skipped": skipped,
        "songCount": len(merged),
        "privateCount": len(regenerate_user_playlist(uid)),
        "sharedCount": len(regenerate_shared_playlist()),
        "userId": uid,
    }
