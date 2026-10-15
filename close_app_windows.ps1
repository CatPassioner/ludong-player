# 更新时关掉本安装目录的旧 Edge/Chrome 应用窗（供桌面程序调用）
# 一般用户无需手动运行

param(
  [Parameter(Mandatory = $true)]
  [string]$ProfileDir
)

$p = [System.IO.Path]::GetFullPath($ProfileDir)
Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
  Where-Object {
    ($_.Name -eq 'msedge.exe' -or $_.Name -eq 'chrome.exe') -and
    $_.CommandLine -and
    ($_.CommandLine -like ("*" + $p + "*"))
  } |
  ForEach-Object {
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }
