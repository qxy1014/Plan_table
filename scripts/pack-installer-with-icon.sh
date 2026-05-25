#!/bin/bash
# 完整打包脚本（NSIS 安装器版）：构建 + electron-builder + 手动注入图标
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
  cp "$UNPACKED" "$TEMPEXE"
  "$RCEDIT" "$TEMPEXE" \
    --set-version-string FileDescription "时间计划桌面应用" \
    --set-version-string ProductName "时间计划" \
    --set-version-string LegalCopyright "Copyright (c) 2026 时间计划" \
    --set-file-version 1.0.0 \
    --set-product-version 1.0.0.0 \
    --set-version-string InternalName "时间计划" \
    --set-version-string OriginalFilename "" \
    --set-icon "build/icon.ico" 2>&1
  cp "$TEMPEXE" "$UNPACKED"
  rm -f "$TEMPEXE"
  echo "  图标注入完成"
fi

echo "=== 构建 NSIS 安装器 ==="
npx electron-builder --win nsis --prepackaged release/win-unpacked

echo "=== 完成 ==="
ls -la release/*.exe 2>/dev/null || true
