import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import type { AllPlans, Task } from './types'

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

export function saveWeekTasks(weekStart: string, tasks: Task[]): void {
  const all = readPlans()
  if (tasks.length === 0) {
    delete all[weekStart]
  } else {
    all[weekStart] = tasks
  }
  writePlans(all)
}
