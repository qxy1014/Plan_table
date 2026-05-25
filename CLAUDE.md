# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

| 命令 | 作用 |
|------|------|
| `npm run dev:web` | Vite 开发服务器（仅浏览器端，端口 5173） |
| `npm run dev` | 完整开发模式（Vite + Electron 并行启动） |
| `npm run build` | 构建渲染层（Vite→dist/）+ Electron 主进程（tsc→dist-electron/） |
| `npm start` | 构建 Electron 后直接启动桌面应用 |
| `npm run pack` | 构建并打包为便携版 exe（输出到 `release/`） |
| `npm run pack:installer` | 构建并打包为 NSIS 安装器 exe |
| `gh repo create` | 在 GitHub 创建仓库（加 `--push` 自动推送，`--public`/`--private` 控制可见性） |

## Git 工作流

- 使用 `gh repo create` + `git push` 即可完成仓库创建和代码推送，无需手动在 GitHub 网页操作。
- 远程仓库：`https://github.com/qxy1014/Plan_table.git`

## 架构

```
src/                          # React 渲染进程 (Vite)
├── main.tsx                  # 入口
├── App.tsx                   # 根组件：标签切换（📅 周计划 / ✅ 待办）
├── types.ts                  # 共享类型 + 常量 (Task, TodoItem, DAY_LABELS 等)
├── index.css                 # Tailwind + 全局样式
├── utils/dateUtils.ts        # 周日期计算工具
└── components/
    ├── WeekView.tsx           # 核心：7 天 × 18 小时时间网格，叠加 TaskCard
    ├── WeekNavigator.tsx      # 周切换导航（上/下/今天）
    ├── TaskCard.tsx           # 时间网格上的任务卡片
    ├── TaskDialog.tsx         # 任务编辑弹窗（增删改）
    └── TodoPage.tsx           # 简单待办清单

electron/                     # Electron 主进程 (tsc 编译)
├── main.ts                   # 主进程入口，窗口管理 + IPC 注册
├── preload.ts                # contextBridge 暴露 electronAPI 到渲染进程
├── store.ts                  # JSON 文件持久化（%APPDATA%/plan-data.json）
└── types.ts                  # 后端类型（与 src/types.ts 独立定义）
```

**数据流：** 渲染进程通过 `window.electronAPI.getWeekTasks/saveWeekTasks` → IPC → 主进程读写 `plan-data.json`。浏览器模式下回退到 `localStorage`。数据以 `Record<weekStartISOString, Task[]>` 结构存储。

**周视图布局：** 左侧时间轴（6时-24时，每小时 48px） + 7 列日期网格。任务卡片通过绝对定位叠加在对应时间格上，`dayOfWeek` 0=周一，`startHour/startMinute` 决定 top，`endHour/endMinute` 决定高度。

## 修改流程（必须遵守）

1. **修改代码** → 完成代码改动
2. **测试验证** → 必须运行 `npm run dev:web` 在浏览器中手动测试，确认改动效果符合预期，且无回归问题
3. **打包 exe** → 测试通过后，运行 `npm run pack` 重新打包便携版 exe
4. **提交代码** → 打包完成后，提交所有改动到本地仓库并推送到 GitHub（`git commit` + `git push`）

> 每次改动都必须走完以上四步，不能跳过测试直接打包，不能跳过提交。

## 打包注意事项

- `public/` 目录下的文件会在 Vite 构建时复制到 `dist/`，electron-builder 会打包 `dist/**/*`。
- 图片资源引用使用相对路径（如 `url('./image.jpg')`），不要用绝对路径（`/image.jpg`），因为在 Electron `loadFile` 模式下绝对路径会解析到文件系统根目录。
