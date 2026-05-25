export interface Task {
  id: string
  title: string
  dayOfWeek: number
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
  color: string
  description?: string
}

// key: weekStart ISO string, value: tasks for that week
export type AllPlans = Record<string, Task[]>

export interface AppSettings {
  backgroundImage?: string // base64 data URL or empty
}
