import { useMemo } from 'react'
import type { Task } from '../types'
import { DAY_LABELS, HOUR_START, HOUR_END, SLOT_HEIGHT } from '../types'
import { getWeekDates, isToday, formatDate } from '../utils/dateUtils'
import TaskCard from './TaskCard'

interface Props {
  monday: Date
  tasks: Task[]
  onSlotClick: (day: number, hour: number, minute: number) => void
  onTaskClick: (task: Task) => void
}

export default function WeekView({ monday, tasks, onSlotClick, onTaskClick }: Props) {
  const dates = useMemo(() => getWeekDates(monday), [monday])
  const hours = useMemo(
    () => Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i),
    []
  )

  const getTasksForSlot = (day: number, hour: number): Task[] => {
    return tasks.filter((t) => {
      if (t.dayOfWeek !== day) return false
      return t.startHour <= hour && t.endHour > hour
    })
  }

  const getTaskStyle = (task: Task): React.CSSProperties => {
    const startMin = task.startHour * 60 + task.startMinute
    const endMin = task.endHour * 60 + task.endMinute
    const baseMin = HOUR_START * 60
    const top = ((startMin - baseMin) / 60) * SLOT_HEIGHT
    const height = ((endMin - startMin) / 60) * SLOT_HEIGHT
    return {
      top: `${top}px`,
      height: `${Math.max(height, 20)}px`,
      backgroundColor: task.color,
    }
  }

  return (
    <div className="flex-1 overflow-auto bg-white/60 backdrop-blur-[2px]">
      <div className="flex" style={{ minWidth: '900px' }}>
        {/* 时间轴 */}
        <div className="shrink-0 w-16 pt-7">
          {hours.map((h) => (
            <div
              key={h}
              className="flex items-start justify-end pr-2 text-xs text-gray-500 leading-none"
              style={{ height: `${SLOT_HEIGHT}px` }}
            >
              <span className="-mt-[0.35rem]">{h}:00</span>
            </div>
          ))}
        </div>

        {/* 日期列 */}
        {dates.map((date, dayIdx) => {
          const today = isToday(date)
          return (
            <div key={dayIdx} className="flex-1 min-w-[100px] border-l border-gray-200">
              {/* 日期头部 */}
              <div
                className={`text-center py-2 border-b border-gray-200 text-sm font-medium shrink-0 ${
                  today ? 'bg-blue-50/70 text-blue-600' : 'text-gray-700'
                }`}
              >
                <div>{DAY_LABELS[dayIdx]}</div>
                <div className={`text-xs ${today ? 'text-blue-500' : 'text-gray-400'}`}>
                  {formatDate(date)}
                </div>
              </div>

              {/* 时间格子 */}
              <div className="relative">
                {hours.map((h) => (
                  <div
                    key={h}
                    onClick={() => onSlotClick(dayIdx, h, 0)}
                    className={`border-b border-gray-200 cursor-pointer transition-colors ${
                      today ? 'hover:bg-blue-50/50' : 'hover:bg-gray-50'
                    }`}
                    style={{ height: `${SLOT_HEIGHT}px` }}
                  />
                ))}

                {/* 叠加的任务卡片 */}
                {tasks
                  .filter((t) => t.dayOfWeek === dayIdx)
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      style={getTaskStyle(task)}
                      onClick={() => onTaskClick(task)}
                    />
                  ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
