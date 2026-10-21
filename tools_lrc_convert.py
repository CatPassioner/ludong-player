# -*- coding: utf-8 -*-
"""把 LDDC 等逐字 LRC 规范成猫耳律动可用的增强 LRC（整句 + 逐字时间轴）。

用法：
  python tools_lrc_convert.py 烟火.lrc
  python tools_lrc_convert.py 某文件夹 --line   # 仅逐句
  或把文件拖到「转换逐字歌词.bat」上
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

META_RE = re.compile(r"^\[(ti|ar|al|by|offset|from|length|tool):(.*)\]$", re.I)
ANGLE_RE = re.compile(r"<(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?>([^<]*)")
BRACKET_RE = re.compile(r"\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\]([^\[]*)")


def parse_clock(mm: str, ss: str, frac: str | None) -> float:
    ms = (frac or "0").ljust(3, "0")[:3]
    return int(mm) * 60 + int(ss) + int(ms) / 1000


def fmt_tag(sec: float, angle: bool = False) -> str:
    t = max(0.0, float(sec))
    m = int(t // 60)
    s = t - m * 60
    whole = int(s)
    ms = int(round((s - whole) * 1000))
    if ms == 1000:
        whole += 1
        ms = 0
    body = f"{m:02d}:{whole:02d}.{ms:03d}"
    return f"<{body}>" if angle else f"[{body}]"


def parse_angle_line(row: str):
    words = []
    end = None
    for m in ANGLE_RE.finditer(row):
        time = parse_clock(m.group(1), m.group(2), m.group(3))
        text = m.group(4) or ""
        if text:
            words.append({"time": time, "text": text})
        else:
            end = time
    if len(words) < 2:
        return None
    return {"words": words, "end": end}


def parse_bracket_enhanced(row: str):
    segs = [
        {
            "time": parse_clock(m.group(1), m.group(2), m.group(3)),
            "text": m.group(4) or "",
        }
        for m in BRACKET_RE.finditer(row)
    ]
    content = [s for s in segs if s["text"]]
    if len(content) < 2:
        return None
    short_n = sum(1 for s in content if len(s["text"].strip()) <= 2)
    if short_n < int(len(content) * 0.6 + 0.999):
        return None
    words = []
    for s in content:
        text = re.sub(r"<[^>]+>", "", s["text"])
        if text:
            words.append({"time": s["time"], "text": text})
    if len(words) < 2:
        return None
    trailing = [s for s in segs if not s["text"]]
    end = trailing[-1]["time"] if trailing else None
    return {"words": words, "end": end}


def coalesce_chars(items: list[dict]):
    if len(items) < 10:
        return None
    short_n = sum(1 for e in items if len(e["text"]) <= 2)
    if short_n < len(items) * 0.8:
        return None
    gaps = [items[i]["time"] - items[i - 1]["time"] for i in range(1, len(items))]
    gaps.sort()
    median = gaps[len(gaps) // 2] if gaps else 0.3
    break_gap = max(0.95, median * 2.8)
    out = []
    cur = None
    for ev in items:
        piece = ev["text"]
        if cur is None:
            cur = {"words": [{"time": ev["time"], "text": piece}], "end": None}
            continue
        prev = cur["words"][-1]["time"]
        if ev["time"] - prev >= break_gap:
            cur["end"] = prev + min(max((ev["time"] - prev) * 0.35, 0.25), 0.9)
            out.append(cur)
            cur = {"words": [{"time": ev["time"], "text": piece}], "end": None}
        else:
            cur["words"].append({"time": ev["time"], "text": piece})
    if cur:
        out.append(cur)
    return out or None


def extract_lines(text: str):
    meta = {"ti": "", "ar": "", "al": ""}
    lines = []
    singles = []
    for raw in text.replace("\ufeff", "").splitlines():
        row = raw.strip()
        if not row:
            continue
        mm = META_RE.match(row)
        if mm:
            key = mm.group(1).lower()
            if key in meta:
                meta[key] = mm.group(2).strip()
            continue
        parsed = None
        if re.search(r"<\d{1,2}:\d{1,2}", row):
            parsed = parse_angle_line(row)
        if parsed is None:
            parsed = parse_bracket_enhanced(row)
        if parsed is not None:
            lines.append(parsed)
            continue
        any_ts = False
        for m in BRACKET_RE.finditer(row):
            any_ts = True
            tx = re.sub(r"<[^>]+>", "", m.group(4) or "").strip()
            if tx:
                singles.append(
                    {
                        "time": parse_clock(m.group(1), m.group(2), m.group(3)),
                        "text": tx,
                    }
                )
        if not any_ts:
            singles.append({"time": -1, "text": row})

    if not lines and singles:
        merged = coalesce_chars([s for s in singles if s["time"] >= 0])
        if merged:
            return meta, merged
        lines = [
            {"words": [{"time": s["time"], "text": s["text"]}], "end": None}
            for s in singles
            if s["time"] >= 0 and s["text"]
        ]
    return meta, lines


def build_enhanced(meta: dict, lines: list) -> str:
    head = []
    if meta.get("ti"):
        head.append(f"[ti:{meta['ti']}]")
    if meta.get("ar"):
        head.append(f"[ar:{meta['ar']}]")
    if meta.get("al"):
        head.append(f"[al:{meta['al']}]")
    head.append("[tool:猫耳律动 tools_lrc_convert]")
    head.append("")
    body = []
    for line in lines:
        words = line["words"]
        if not words:
            continue
        row = fmt_tag(words[0]["time"], False)
        for w in words:
            row += fmt_tag(w["time"], True) + w["text"]
        if line.get("end") is not None:
            row += fmt_tag(line["end"], True)
        body.append(row)
    return "\n".join(head + body) + "\n"


def build_line_only(meta: dict, lines: list) -> str:
    head = []
    if meta.get("ti"):
        head.append(f"[ti:{meta['ti']}]")
    if meta.get("ar"):
        head.append(f"[ar:{meta['ar']}]")
    if meta.get("al"):
        head.append(f"[al:{meta['al']}]")
    head.append("[tool:猫耳律动 tools_lrc_convert line-only]")
    head.append("")
    body = []
    for line in lines:
        words = line["words"]
        if not words:
            continue
        text = "".join(w["text"] for w in words)
        body.append(fmt_tag(words[0]["time"], False) + text)
    return "\n".join(head + body) + "\n"


def safe_name(meta: dict, src: Path) -> str:
    ti = re.sub(r'[\\/:*?"<>|]', "", meta.get("ti") or "").strip()
    ar = re.sub(r'[\\/:*?"<>|]', "", meta.get("ar") or "").strip()
    if ti and ar:
        return f"{ti}-{ar}.lrc"
    if ti:
        return f"{ti}.lrc"
    return src.stem + ".lrc"


def convert_file(path: Path, line_only: bool = False, out_dir: Path | None = None) -> Path:
    text = path.read_text(encoding="utf-8-sig")
    meta, lines = extract_lines(text)
    if not lines:
        raise ValueError(f"没有识别到歌词行：{path.name}")
    out_text = build_line_only(meta, lines) if line_only else build_enhanced(meta, lines)
    dest_dir = out_dir or path.parent
    dest = dest_dir / safe_name(meta, path)
    if dest.resolve() == path.resolve():
        dest = dest_dir / (path.stem + (".逐句.lrc" if line_only else ".增强.lrc"))
    dest.write_text(out_text, encoding="utf-8")
    return dest


def iter_inputs(paths: list[Path]) -> list[Path]:
    out: list[Path] = []
    for p in paths:
        if p.is_dir():
            out.extend(sorted(p.glob("*.lrc")))
        elif p.is_file():
            out.append(p)
    return out


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="LDDC 逐字 LRC → 猫耳律动增强/逐句 LRC")
    parser.add_argument("paths", nargs="+", help="lrc 文件或文件夹")
    parser.add_argument("--line", action="store_true", help="仅导出逐句（去掉字时间轴）")
    parser.add_argument("-o", "--out", type=Path, help="输出目录")
    args = parser.parse_args(argv)

    inputs = iter_inputs([Path(p) for p in args.paths])
    if not inputs:
        print("没有找到 .lrc 文件", file=sys.stderr)
        return 1

    ok = 0
    for path in inputs:
        try:
            dest = convert_file(path, line_only=args.line, out_dir=args.out)
            print(f"OK  {path.name}  →  {dest.name}")
            ok += 1
        except Exception as err:  # noqa: BLE001
            print(f"FAIL {path.name}: {err}", file=sys.stderr)
    print(f"完成 {ok}/{len(inputs)}")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
