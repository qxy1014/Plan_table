import { contextBridge, ipcRenderer } from 'electron'
import type { Task } from './types'

contextBridge.exposeInMainWorld('electronAPI', {
  getWeekTasks: (weekStart: string): Promise<Task[]> =>
    ipcRenderer.invoke('get-week-tasks', weekStart),
  saveWeekTasks: (weekStart: string, tasks: Task[]): Promise<{ success: boolean }> =>
    ipcRenderer.invoke('save-week-tasks', weekStart, tasks),
})
