import { useState, useEffect, useCallback } from 'react'
import type { AppSettings, Task } from './types'
import { getMonday } from './utils/dateUtils'
import WeekNavigator from './components/WeekNavigator'
import WeekView from './components/WeekView'
import TaskDialog from './components/TaskDialog'
import TodoPage from './components/TodoPage'
import BackgroundSettings from './components/BackgroundSettings'

async function loadWeekTasks(weekStart: string): Promise<Task[]> {
  if (window.electronAPI) {
    return window.electronAPI.getWeekTasks(weekStart)
  }
  const saved = localStorage.getItem('plan-table-data')
  if (saved) {
    try {
      const all: Record<string, Task[]> = JSON.parse(saved)
      return all[weekStart] || []
    } catch { /* ignore */ }
  }
  return []
}

async function persistWeekTasks(weekStart: string, tasks: Task[]): Promise<void> {
  if (window.electronAPI) {
    await window.electronAPI.saveWeekTasks(weekStart, tasks)
  } else {
    const saved = localStorage.getItem('plan-table-data')
    let all: Record<string, Task[]> = {}
    if (saved) {
      try { all = JSON.parse(saved) } catch { /* */ }
    }
    if (tasks.length === 0) {
      delete all[weekStart]
    } else {
      all[weekStart] = tasks
    }
    localStorage.setItem('plan-table-data', JSON.stringify(all))
  }
}

async function loadSettings(): Promise<AppSettings> {
  if (window.electronAPI) {
    return window.electronAPI.getSettings()
  }
  const saved = localStorage.getItem('plan-table-settings')
  if (saved) {
    try { return JSON.parse(saved) } catch { /* */ }
  }
  return {}
}

async function saveSettings(settings: AppSettings): Promise<void> {
  if (window.electronAPI) {
    await window.electronAPI.saveSettings(settings)
  } else {
    localStorage.setItem('plan-table-settings', JSON.stringify(settings))
  }
}

const DEFAULT_BG = './4096x2626.jpg'

export default function App() {
  const currentMonday = getMonday(new Date()).toISOString()
  const [weekStart, setWeekStart] = useState(currentMonday)
  const [tasks, setTasks] = useState<Task[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultDay, setDefaultDay] = useState(0)
  const [defaultStartH, setDefaultStartH] = useState(8)
  const [defaultStartM, setDefaultStartM] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [page, setPage] = useState<'week' | 'todo'>('week')
  const [backgroundImage, setBackgroundImage] = useState(DEFAULT_BG)

  useEffect(() => {
    Promise.all([
      loadWeekTasks(currentMonday),
      loadSettings(),
    ]).then(([t, settings]) => {
      setTasks(t)
      if (settings.backgroundImage) {
        setBackgroundImage(settings.backgroundImage)
      }
      setLoaded(true)
    })
  }, [])

  const navigateTo = useCallback(async (newWeekStart: string) => {
    // 保存当前周
    await persistWeekTasks(weekStart, tasks)
    // 加载新周
    const newTasks = await loadWeekTasks(newWeekStart)
    setWeekStart(newWeekStart)
    setTasks(newTasks)
  }, [weekStart, tasks])

  const monday = new Date(weekStart)

  const handlePrevWeek = () => {
    const d = new Date(monday)
    d.setDate(d.getDate() - 7)
    navigateTo(d.toISOString())
  }

  const handleNextWeek = () => {
    const d = new Date(monday)
    d.setDate(d.getDate() + 7)
    navigateTo(d.toISOString())
  }

  const handleToday = () => {
    const d = getMonday(new Date())
    if (d.toISOString() === weekStart) return
    navigateTo(d.toISOString())
  }

  const handleSlotClick = (day: number, hour: number, minute: number) => {
    setEditingTask(null)
    setDefaultDay(day)
    setDefaultStartH(hour)
    setDefaultStartM(minute)
    setDialogOpen(true)
  }

  const handleTaskClick = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleSaveTask = async (task: Task) => {
    let updated: Task[]
    const idx = tasks.findIndex((t) => t.id === task.id)
    if (idx >= 0) {
      updated = [...tasks]
      updated[idx] = task
    } else {
      updated = [...tasks, task]
    }
    setTasks(updated)
    await persistWeekTasks(weekStart, updated)
    setDialogOpen(false)
    setEditingTask(null)
  }

  const handleDeleteTask = async (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId)
    setTasks(updated)
    await persistWeekTasks(weekStart, updated)
    setDialogOpen(false)
    setEditingTask(null)
  }

  const handleSetBackground = async (dataUrl: string) => {
    setBackgroundImage(dataUrl)
    await saveSettings({ backgroundImage: dataUrl })
  }

  const handleResetBackground = async () => {
    setBackgroundImage(DEFAULT_BG)
    await saveSettings({ backgroundImage: '' })
  }

  if (!loaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">加载中...</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 顶部标签导航 */}
      <div className="flex border-b border-gray-200 bg-white shrink-0">
        <button
          onClick={() => setPage('week')}
          className={`flex-1 py-3 text-sm font-medium transition-all border-b-2 ${
            page === 'week'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-400 border-transparent hover:text-gray-600'
          }`}
        >
          📅 周计划
        </button>
        <button
          onClick={() => setPage('todo')}
          className={`flex-1 py-3 text-sm font-medium transition-all border-b-2 ${
            page === 'todo'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-400 border-transparent hover:text-gray-600'
          }`}
        >
          ✅ 待办
        </button>
        <div className="pr-2 flex items-center">
          <BackgroundSettings
            backgroundImage={backgroundImage}
            onSetBackground={handleSetBackground}
            onResetBackground={handleResetBackground}
          />
        </div>
      </div>

      {page === 'week' ? (
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
          }}
        >
          <WeekNavigator
            monday={monday}
            onPrev={handlePrevWeek}
            onNext={handleNextWeek}
            onToday={handleToday}
          />
          <WeekView
            monday={monday}
            tasks={tasks}
            onSlotClick={handleSlotClick}
            onTaskClick={handleTaskClick}
          />
          {dialogOpen && (
            <TaskDialog
              task={editingTask}
              defaultDay={defaultDay}
              defaultStartH={defaultStartH}
              defaultStartM={defaultStartM}
              onSave={handleSaveTask}
              onDelete={handleDeleteTask}
              onClose={() => {
                setDialogOpen(false)
                setEditingTask(null)
              }}
            />
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <TodoPage backgroundImage={backgroundImage} />
        </div>
      )}
    </div>
  )
}
