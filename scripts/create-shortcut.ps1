# 创建桌面快捷方式，使用柯基图标
$desktop = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop '时间计划.lnk'

# 查找最新的便携版 exe
$releaseDir = 'D:\plan_table\release'
$exe = Get-ChildItem "$releaseDir\时间计划 *.exe" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $exe) {
    Write-Host "错误: 未找到打包好的 exe，请先运行 npm run pack"
    exit 1
}

$iconPath = 'D:\plan_table\build\icon.ico'

$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($shortcutPath)
$Shortcut.TargetPath = $exe.FullName
$Shortcut.IconLocation = $iconPath
$Shortcut.WorkingDirectory = $releaseDir
$Shortcut.Save()

Write-Host "桌面快捷方式已创建: $shortcutPath"
Write-Host "目标: $($exe.FullName)"
Write-Host "图标: $iconPath"
