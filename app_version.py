# -*- coding: utf-8 -*-
"""应用版本号。发版时只改这里，再跑 build_release.py。"""

APP_VERSION = "2.0.01"

# 远端更新清单（放到 Supabase Storage 公开桶 ludong-releases/update.json）
DEFAULT_MANIFEST_URL = (
    "https://ojqxcduzeqblwpzulovz.supabase.co/storage/v1/object/public/"
    "ludong-releases/update.json"
)
