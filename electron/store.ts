import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import type { AllPlans, AppSettings, Task } from './types'

const getDataPath = (): string => {
  const userDataPath = app.getPath('userData')
  return path.join(userDataPath, 'plan-data.json')
}

export function readPlans(): AllPlans {
  const dataPath = getDataPath()
  try {
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf-8')
      return JSON.parse(raw)
    }
  } catch {
    // 文件损坏时返回默认数据
  }
  return {}
}

export function writePlans(allPlans: AllPlans): void {
  const dataPath = getDataPath()
  const dir = path.dirname(dataPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(dataPath, JSON.stringify(allPlans, null, 2), 'utf-8')
}

export function getWeekTasks(weekStart: string): Task[] {
  const all = readPlans()
  return all[weekStart] || []
}

const getSettingsPath = (): string => {
  const userDataPath = app.getPath('userData')
  return path.join(userDataPath, 'settings.json')
}

export function readSettings(): AppSettings {
  const settingsPath = getSettingsPath()
  try {
    if (fs.existsSync(settingsPath)) {
      const raw = fs.readFileSync(settingsPath, 'utf-8')
      return JSON.parse(raw)
    }
  } catch { /* ignore */ }
  return {}
}

export function writeSettings(settings: AppSettings): void {
  const settingsPath = getSettingsPath()
  const dir = path.dirname(settingsPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8')
}

export function saveWeekTasks(weekStart: string, tasks: Task[]): void {
  const all = readPlans()
  if (tasks.length === 0) {
    delete all[weekStart]
  } else {
    all[weekStart] = tasks
  }
  writePlans(all)
}
