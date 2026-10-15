# -*- coding: utf-8 -*-
"""把 release 目录安装到本机，并创建桌面快捷方式。"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import time
import zipfile
from pathlib import Path


APP_NAME = "猫耳律动"
EXE_NAME = "猫耳律动.exe"
CONFIG_NAME = "ludong-config.json"
LAST_PATHS_FILE = (
    Path(os.environ.get("LOCALAPPDATA", str(Path.home())))
    / "LudongPlayer"
    / "last-install.json"
)


def _first_existing_drive(*letters: str) -> Path | None:
    for letter in letters:
        p = Path(f"{letter}:/")
        try:
            if p.exists():
                return p
        except OSError:
            continue
    return None


def default_install_dir() -> Path:
    last = load_last_paths().get("install_dir")
    if last:
        return Path(last)
    extra = _first_existing_drive("D", "E", "F")
    if extra is not None:
        return extra / APP_NAME
    base = Path(os.environ.get("LOCALAPPDATA", str(Path.home())))
    return base / "Programs" / APP_NAME


def default_library_dir() -> Path:
    last = load_last_paths().get("userdata_root")
    if last:
        return Path(last)
    extra = _first_existing_drive("D", "E", "F")
    if extra is not None:
        return extra / f"{APP_NAME}导入歌曲"
    docs = Path.home() / "Documents"
    if docs.is_dir():
        return docs / f"{APP_NAME}导入歌曲"
    return Path(os.environ.get("LOCALAPPDATA", str(Path.home()))) / "LudongPlayer" / "userdata"


def load_last_paths() -> dict:
    if not LAST_PATHS_FILE.is_file():
        return {}
    try:
        data = json.loads(LAST_PATHS_FILE.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def save_last_paths(install_dir: Path, userdata_root: Path) -> None:
    LAST_PATHS_FILE.parent.mkdir(parents=True, exist_ok=True)
    LAST_PATHS_FILE.write_text(
        json.dumps(
            {
                "install_dir": str(install_dir),
                "userdata_root": str(userdata_root),
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


def normalize_install_dir(raw: str) -> Path:
    path = Path(raw.strip().strip('"')).expanduser()
    if not path.is_absolute():
        path = Path.cwd() / path
    path = path.resolve()
    if path.name != APP_NAME:
        path = path / APP_NAME
    return path


def normalize_library_dir(raw: str) -> Path:
    path = Path(raw.strip().strip('"')).expanduser()
    if not path.is_absolute():
        path = Path.cwd() / path
    return path.resolve()


def validate_writable_dir(path: Path, kind: str) -> None:
    forbidden = ("windows", "system32", "syswow64")
    parts = {p.lower() for p in path.parts}
    if parts & set(forbidden):
        raise ValueError(f"{kind}不能放在系统目录：{path}")
    try:
        path.mkdir(parents=True, exist_ok=True)
        probe = path / ".ludong-write-test"
        probe.write_text("ok", encoding="utf-8")
        probe.unlink(missing_ok=True)
    except OSError as e:
        raise ValueError(f"无法写入{kind}：{path}\n{e}") from e


def prompt_install_options() -> tuple[Path, Path] | None:
    """弹出窗口让用户选安装目录和导入歌曲目录。失败时退回控制台输入。"""
    try:
        return _prompt_gui()
    except Exception as e:
        print(f"无法打开图形安装界面（{e}），改为命令行输入。")
        return _prompt_console()


def _prompt_gui() -> tuple[Path, Path] | None:
    import tkinter as tk
    from tkinter import filedialog, messagebox

    result: dict[str, Path | None] = {"install": None, "library": None}

    root = tk.Tk()
    root.title(f"{APP_NAME} 安装")
    root.geometry("640x280")
    root.resizable(False, False)
    try:
        root.attributes("-topmost", True)
        root.after(400, lambda: root.attributes("-topmost", False))
    except tk.TclError:
        pass

    install_var = tk.StringVar(value=str(default_install_dir()))
    library_var = tk.StringVar(value=str(default_library_dir()))

    tk.Label(root, text="选择安装位置和导入歌曲存放位置", font=("Microsoft YaHei UI", 12)).pack(
        anchor="w", padx=16, pady=(16, 8)
    )

    def row(label: str, var: tk.StringVar, initial: Path) -> None:
        frame = tk.Frame(root)
        frame.pack(fill="x", padx=16, pady=6)
        tk.Label(frame, text=label, width=16, anchor="w").pack(side="left")
        entry = tk.Entry(frame, textvariable=var)
        entry.pack(side="left", fill="x", expand=True, padx=(0, 8))

        def browse() -> None:
            picked = filedialog.askdirectory(
                parent=root,
                title=label,
                initialdir=str(initial if initial.exists() else Path.home()),
            )
            if picked:
                var.set(picked)

        tk.Button(frame, text="浏览…", command=browse, width=8).pack(side="left")

    row("程序安装目录", install_var, default_install_dir())
    row("导入歌曲目录", library_var, default_library_dir())
    tk.Label(
        root,
        text="导入的本地歌会按账号放在「导入歌曲目录\\账号\\music」。\n"
        "若所选安装目录名不是「猫耳律动」，会自动在里面再建一层该文件夹。",
        justify="left",
        fg="#444",
    ).pack(anchor="w", padx=16, pady=(4, 8))

    btns = tk.Frame(root)
    btns.pack(fill="x", padx=16, pady=8)

    def on_ok() -> None:
        try:
            install_dir = normalize_install_dir(install_var.get())
            library_dir = normalize_library_dir(library_var.get())
            if install_dir == library_dir or library_dir.is_relative_to(install_dir):
                raise ValueError("导入歌曲目录请不要放在程序安装目录里面，避免重装时被清空。")
            validate_writable_dir(install_dir.parent, "安装目录")
            validate_writable_dir(library_dir, "导入歌曲目录")
        except Exception as err:
            messagebox.showerror("路径无效", str(err), parent=root)
            return
        result["install"] = install_dir
        result["library"] = library_dir
        root.destroy()

    def on_cancel() -> None:
        root.destroy()

    tk.Button(btns, text="开始安装", command=on_ok, width=12).pack(side="right")
    tk.Button(btns, text="取消", command=on_cancel, width=10).pack(side="right", padx=(0, 8))
    root.protocol("WM_DELETE_WINDOW", on_cancel)
    root.mainloop()

    if result["install"] is None or result["library"] is None:
        return None
    return result["install"], result["library"]


def _prompt_console() -> tuple[Path, Path] | None:
    print(f"默认安装目录：{default_install_dir()}")
    raw_install = input("回车使用默认，或输入安装路径：").strip()
    if not raw_install:
        install_dir = default_install_dir()
        if install_dir.name != APP_NAME:
            install_dir = install_dir / APP_NAME
    else:
        install_dir = normalize_install_dir(raw_install)

    print(f"默认导入歌曲目录：{default_library_dir()}")
    raw_lib = input("回车使用默认，或输入导入歌曲路径：").strip()
    library_dir = default_library_dir() if not raw_lib else normalize_library_dir(raw_lib)
    if install_dir == library_dir or library_dir.is_relative_to(install_dir):
        print("导入歌曲目录不能放在安装目录里。")
        return None
    validate_writable_dir(install_dir.parent, "安装目录")
    validate_writable_dir(library_dir, "导入歌曲目录")
    return install_dir, library_dir


def write_app_config(install_dir: Path, userdata_root: Path) -> None:
    (install_dir / CONFIG_NAME).write_text(
        json.dumps({"userdata_root": str(userdata_root)}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def desktop_dir() -> Path:
    d = Path.home() / "Desktop"
    if d.is_dir():
        return d
    one = Path.home() / "OneDrive" / "Desktop"
    if one.is_dir():
        return one
    return d


def payload_zip() -> Path:
    if getattr(sys, "frozen", False):
        meipass = Path(getattr(sys, "_MEIPASS", Path(sys.executable).parent))
        embedded = meipass / "payload.zip"
        if embedded.is_file():
            return embedded
        return Path(sys.executable).resolve().parent / "payload.zip"
    return Path(__file__).resolve().parent / "payload.zip"


def _no_window_flags() -> int:
    return getattr(subprocess, "CREATE_NO_WINDOW", 0)


def stop_running_app() -> None:
    """安装前结束正在运行的播放器，避免文件被占用导致第二次安装失败。"""
    # 结束主程序
    subprocess.run(
        ["taskkill", "/F", "/IM", EXE_NAME],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=False,
        creationflags=_no_window_flags(),
    )
    # 结束占用 5500 的旧本地服务
    try:
        out = subprocess.check_output(
            ["netstat", "-ano"],
            stderr=subprocess.DEVNULL,
            creationflags=_no_window_flags(),
        ).decode("utf-8", "ignore")
    except Exception:
        out = ""
    pids: set[str] = set()
    for line in out.splitlines():
        if ":5500" not in line or "LISTENING" not in line.upper():
            continue
        parts = line.split()
        if parts and parts[-1].isdigit() and parts[-1] != "0":
            pids.add(parts[-1])
    for pid in pids:
        subprocess.run(
            ["taskkill", "/F", "/PID", pid],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
            creationflags=_no_window_flags(),
        )
    time.sleep(0.6)


def safe_rmtree(path: Path, retries: int = 8) -> None:
    last_err: Exception | None = None
    for i in range(retries):
        try:
            if path.exists():
                shutil.rmtree(path)
            return
        except Exception as e:
            last_err = e
            stop_running_app()
            time.sleep(0.4 + i * 0.2)
    raise RuntimeError(
        f"无法覆盖旧安装目录（文件可能仍被占用）: {path}\n"
        f"请先完全退出「{APP_NAME}」后再试。\n详情: {last_err}"
    )


def extract_payload(dest: Path) -> None:
    zpath = payload_zip()
    if not zpath.is_file():
        raise FileNotFoundError(f"找不到安装数据: {zpath}")
    stop_running_app()
    safe_rmtree(dest)
    dest.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zpath, "r") as zf:
        zf.extractall(dest)


def make_shortcut(target: Path, icon: Path, link: Path) -> None:
    ps = f"""
$s = New-Object -ComObject WScript.Shell
$sc = $s.CreateShortcut('{str(link).replace("'", "''")}')
$sc.TargetPath = '{str(target).replace("'", "''")}'
$sc.WorkingDirectory = '{str(target.parent).replace("'", "''")}'
$sc.WindowStyle = 7
$sc.Description = 'Maor Ludong'
$sc.IconLocation = '{str(icon if icon.is_file() else target).replace("'", "''")}'
$sc.Save()
"""
    subprocess.run(
        ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps],
        check=False,
        creationflags=_no_window_flags(),
    )


def parse_cli_args(argv: list[str] | None = None) -> dict:
    args = list(argv if argv is not None else sys.argv[1:])
    out: dict = {
        "update": False,
        "install_dir": None,
        "library_dir": None,
        "no_start": False,
    }
    i = 0
    while i < len(args):
        a = args[i]
        if a == "--update":
            out["update"] = True
        elif a == "--no-start":
            out["no_start"] = True
        elif a == "--install-dir" and i + 1 < len(args):
            i += 1
            out["install_dir"] = args[i]
        elif a == "--library-dir" and i + 1 < len(args):
            i += 1
            out["library_dir"] = args[i]
        i += 1
    return out


def resolve_update_paths(cli: dict) -> tuple[Path, Path]:
    raw_install = str(cli.get("install_dir") or "").strip()
    raw_lib = str(cli.get("library_dir") or "").strip()
    last = load_last_paths()
    if raw_install:
        install_dir = normalize_install_dir(raw_install)
    elif last.get("install_dir"):
        install_dir = Path(str(last["install_dir"]))
    else:
        install_dir = default_install_dir()
        if install_dir.name != APP_NAME:
            install_dir = install_dir / APP_NAME

    if raw_lib:
        library_dir = normalize_library_dir(raw_lib)
    elif last.get("userdata_root"):
        library_dir = Path(str(last["userdata_root"]))
    else:
        # 尝试读已有安装目录里的配置
        cfg_path = install_dir / CONFIG_NAME
        library_dir = default_library_dir()
        if cfg_path.is_file():
            try:
                data = json.loads(cfg_path.read_text(encoding="utf-8"))
                if isinstance(data, dict) and data.get("userdata_root"):
                    library_dir = Path(str(data["userdata_root"]))
            except Exception:
                pass

    if install_dir == library_dir or library_dir.is_relative_to(install_dir):
        raise ValueError("导入歌曲目录不能放在程序安装目录里面")
    validate_writable_dir(install_dir.parent, "安装目录")
    validate_writable_dir(library_dir, "导入歌曲目录")
    return install_dir, library_dir


def run_install(install_dir: Path, library_dir: Path, *, start_app: bool, quiet: bool) -> int:
    if not quiet:
        print(f"程序目录：{install_dir}")
        print(f"导入歌曲：{library_dir}")
    try:
        extract_payload(install_dir)
        write_app_config(install_dir, library_dir)
        save_last_paths(install_dir, library_dir)
    except Exception as e:
        print(f"安装失败: {e}")
        if not quiet:
            input("按回车退出…")
        return 1

    exe = install_dir / EXE_NAME
    icon = install_dir / "logo.ico"
    if not exe.is_file():
        print(f"安装不完整，未找到 {EXE_NAME}")
        if not quiet:
            input("按回车退出…")
        return 1

    link = desktop_dir() / f"{APP_NAME}.lnk"
    make_shortcut(exe, icon, link)
    start_menu = (
        Path(os.environ.get("APPDATA", ""))
        / "Microsoft"
        / "Windows"
        / "Start Menu"
        / "Programs"
    )
    if start_menu.is_dir():
        make_shortcut(exe, icon, start_menu / f"{APP_NAME}.lnk")

    print(f"安装完成：{install_dir}")
    if start_app:
        print("正在启动…")
        try:
            subprocess.Popen([str(exe)], cwd=str(install_dir))
        except OSError as e:
            print(f"启动失败: {e}")
    if quiet:
        return 0
    try:
        from tkinter import messagebox
        import tkinter as tk

        tw = tk.Tk()
        tw.withdraw()
        messagebox.showinfo(
            "安装完成",
            f"程序：{install_dir}\n导入歌曲：{library_dir}\n已创建桌面快捷方式。",
            parent=tw,
        )
        tw.destroy()
    except Exception:
        input("按回车退出安装程序…")
    return 0


def main() -> int:
    cli = parse_cli_args()
    if cli["update"]:
        print(f"正在更新 {APP_NAME} …")
        try:
            install_dir, library_dir = resolve_update_paths(cli)
        except Exception as e:
            print(f"更新失败: {e}")
            return 1
        return run_install(
            install_dir,
            library_dir,
            start_app=not cli["no_start"],
            quiet=True,
        )

    print(f"正在安装 {APP_NAME} …")
    print("请选择安装目录，以及导入的本地歌曲要放在哪。")
    try:
        picked = prompt_install_options()
    except Exception as e:
        print(f"安装失败: {e}")
        input("按回车退出…")
        return 1
    if picked is None:
        print("已取消安装。")
        time.sleep(0.8)
        return 0
    install_dir, library_dir = picked
    print("若上次没关干净，会先结束旧进程再覆盖安装。")
    return run_install(install_dir, library_dir, start_app=True, quiet=False)


if __name__ == "__main__":
    raise SystemExit(main())
