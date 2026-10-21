@echo off
chcp 65001 >nul
cd /d "%~dp0"

if "%~1"=="" (
  echo 用法：把 LDDC 导出的 .lrc 拖到本 bat 上。
  echo 也可以：python tools_lrc_convert.py 某首歌.lrc
  echo.
  pause
  exit /b 1
)

python "%~dp0tools_lrc_convert.py" %*
echo.
pause
