import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import path from 'path'
import { getWeekTasks, saveWeekTasks } from './store'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: '时间计划',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

const menuTemplate: Electron.MenuItemConstructorOptions[] = [
  {
    label: '文件',
    submenu: [
      { label: '退出', role: 'quit' },
    ],
  },
  {
    label: '编辑',
    submenu: [
      { label: '撤销', role: 'undo' },
      { label: '重做', role: 'redo' },
      { type: 'separator' },
      { label: '剪切', role: 'cut' },
      { label: '复制', role: 'copy' },
      { label: '粘贴', role: 'paste' },
      { label: '全选', role: 'selectAll' },
    ],
  },
  {
    label: '查看',
    submenu: [
      { label: '重新加载', role: 'reload' },
      { label: '开发者工具', role: 'toggleDevTools' },
      { type: 'separator' },
      { label: '放大', role: 'zoomIn' },
      { label: '缩小', role: 'zoomOut' },
      { label: '重置缩放', role: 'resetZoom' },
    ],
  },
  {
    label: '帮助',
    submenu: [
      { label: '关于', role: 'about' },
    ],
  },
]

Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('get-week-tasks', async (_event, weekStart: string) => {
  return getWeekTasks(weekStart)
})

ipcMain.handle('save-week-tasks', async (_event, weekStart: string, tasks: unknown[]) => {
  saveWeekTasks(weekStart, tasks as any[])
  return { success: true }
})
