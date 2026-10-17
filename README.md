# 猫耳律动

本机桌面音乐播放器（HTTP 本地服务 + Edge/Chrome 应用窗口 + Supabase 云端能力）。

当前版本见 `app_version.py`（现为 **2.0.02**）。

## 功能概要

- 本地 / 私人曲库播放，歌词与 MV
- 云端共同曲库、评论、好友与私信（Supabase）
- 设置：背景亮度、静态桌面壁纸库、导入歌曲
- 桌面安装包 / 补丁发版（`build_release.py`）

## 本地运行

1. 安装 Python 3.10+（建议 3.12）
2. 在项目根目录执行：

```bash
python server.py
```

或使用桌面入口：

```bash
python desktop_app.py
```

浏览器打开提示的地址（默认 `http://127.0.0.1:5500/maoerludong/`）。这是本机入口，私人曲库、壁纸、软件更新都走这里。

## 公网网站版

同一套前端也可以挂到 GitHub Pages 等静态托管上，给别人用浏览器打开：

- 公网地址：登录 + 云端共同曲库 + 评论
- `http://127.0.0.1:5500/maoerludong/`：本机桌面版完整功能

开启方式：仓库 Settings → Pages → Source 选 `main` 分支、根目录 `/`。地址形如  
`https://catpassioner.github.io/ludong-player/`

## 云端配置

公共配置在 `cloud-config.js`（仅 publishable / anon key，**不要**放入 service_role）。

相关 SQL 脚本：`supabase_*.sql`，在 Supabase SQL 编辑器中按需执行。

## 如何导入音乐

### 从视频提取素材（推荐先看）

若要从 B 站等视频里提取 **音频 / 视频 / 歌词 / 弹幕**，请先观看这位 UP 主的教程：

**[Bilibili：如何提取音频、视频、歌词、弹幕等](https://www.bilibili.com/video/BV1x1b76qEL9/)**

提取完成后，再按下面命名导入到猫耳律动（私人空间或云端共同曲库）。

### 导入歌曲命名

私人导入支持分开上传，同一首歌请使用同一绑定名：

- 推荐：`歌曲-歌名.mp3` / `.lrc` / `.jpg` / `.mp4`
- 或：`歌名 - 歌手` 系列同名文件

软件设置里「导入说明」PDF 与上述页面说明一致；提取方法以 B 站教程为准。

## 发版

```bash
python build_release.py
```

产物在 `release/`（已加入 `.gitignore`，不提交仓库）。

## 不包含在仓库中的内容

- `music/` 本机曲库、用户私人数据
- `build/` `dist/` `release/` 构建与安装包
- 大型视频素材（如动态壁纸 mp4）
- `.browser-profile/` 本地浏览器配置

## 许可说明

请勿上传无版权商业音乐到共同曲库。仓库内仅包含程序源码与必要资源。
