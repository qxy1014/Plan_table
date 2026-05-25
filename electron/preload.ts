import { contextBridge, ipcRenderer } from 'electron'
import type { AppSettings, Task } from './types'

contextBridge.exposeInMainWorld('electronAPI', {
  getWeekTasks: (weekStart: string): Promise<Task[]> =>
    ipcRenderer.invoke('get-week-tasks', weekStart),
  saveWeekTasks: (weekStart: string, tasks: Task[]): Promise<{ success: boolean }> =>
    ipcRenderer.invoke('save-week-tasks', weekStart, tasks),
  getSettings: (): Promise<AppSettings> =>
    ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: AppSettings): Promise<{ success: boolean }> =>
    ipcRenderer.invoke('save-settings', settings),
})
