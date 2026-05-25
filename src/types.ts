export interface Task {
  id: string
  title: string
  dayOfWeek: number    // 0-6, 0=周一
  startHour: number    // 0-23
  startMinute: number  // 0-59
  endHour: number
  endMinute: number
  color: string
  description?: string
}

export interface ElectronAPI {
  getWeekTasks: (weekStart: string) => Promise<Task[]>
  saveWeekTasks: (weekStart: string, tasks: Task[]) => Promise<{ success: boolean }>
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export const DAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

export const HOUR_START = 6
export const HOUR_END = 24
export const SLOT_HEIGHT = 48 // px per hour

export interface TodoItem {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export const TASK_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
]
