@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "PY=E:\python\python.exe"
if not exist "%PY%" set "PY=python"
"%PY%" "%~dp0desktop_app.py"
if errorlevel 1 (
  echo 启动失败，请查看 desktop_app.log
  pause
)
