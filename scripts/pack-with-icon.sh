#!/bin/bash
# 完整打包脚本：构建 + electron-builder + 手动注入图标
# rcedit 在 electron-builder 刚创建 exe 后可能会因文件锁定失败（杀毒扫描等），
# 通过复制到临时路径 → 注入 → 复制回来的方式规避。
set -e
cd "$(dirname "$0")/.."

echo "=== 1/3 构建项目 ==="
npm run build

echo "=== 2/3 electron-builder 打包（仅解包）==="
npx electron-builder --dir

echo "=== 3/3 注入图标和版本信息 ==="
RCEDIT="$LOCALAPPDATA/electron-builder/Cache/winCodeSign/winCodeSign-2.6.0/rcedit-x64.exe"

if [ ! -f "$RCEDIT" ]; then
  echo "错误: rcedit 未找到 ($RCEDIT)"
  exit 1
fi

UNPACKED="release/win-unpacked/时间计划.exe"
TEMPEXE="/tmp/plan-table-icon-temp.exe"

if [ -f "$UNPACKED" ]; then
  echo "  复制到临时路径..."
  cp "$UNPACKED" "$TEMPEXE"

  echo "  注入资源..."
  "$RCEDIT" "$TEMPEXE" \
    --set-version-string FileDescription "时间计划桌面应用" \
    --set-version-string ProductName "时间计划" \
    --set-version-string LegalCopyright "Copyright (c) 2026 时间计划" \
    --set-file-version 1.0.0 \
    --set-product-version 1.0.0.0 \
    --set-version-string InternalName "时间计划" \
    --set-version-string OriginalFilename "" \
    --set-icon "build/icon.ico" 2>&1

  echo "  复制回原路径..."
  cp "$TEMPEXE" "$UNPACKED"
  rm -f "$TEMPEXE"
  echo "  图标注入完成"
else
  echo "  [错误] $UNPACKED 不存在"
  exit 1
fi

echo "=== 构建便携版 ==="
npx electron-builder --win portable --prepackaged release/win-unpacked

echo "=== 创建桌面快捷方式 ==="
powershell -ExecutionPolicy Bypass -File scripts/create-shortcut.ps1 2>&1 || true

echo "=== 完成 ==="
ls -la release/*.exe 2>/dev/null || true
