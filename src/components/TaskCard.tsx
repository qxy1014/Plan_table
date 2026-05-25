import type { Task } from '../types'

interface Props {
  task: Task
  style: React.CSSProperties
  onClick: () => void
}

export default function TaskCard({ task, style, onClick }: Props) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="absolute left-0.5 right-0.5 rounded px-1.5 py-0.5 cursor-pointer overflow-hidden
        text-white text-xs shadow-sm hover:brightness-110 active:brightness-95 transition-all
        select-none z-10"
      style={style}
      title={`${task.title}\n${String(task.startHour).padStart(2, '0')}:${String(task.startMinute).padStart(2, '0')} — ${String(task.endHour).padStart(2, '0')}:${String(task.endMinute).padStart(2, '0')}${task.description ? '\n备注：' + task.description : ''}`}
    >
      <div className="font-medium truncate">{task.title}</div>
      <div className="opacity-75 truncate">
        {String(task.startHour).padStart(2, '0')}:{String(task.startMinute).padStart(2, '0')} —{' '}
        {String(task.endHour).padStart(2, '0')}:{String(task.endMinute).padStart(2, '0')}
      </div>
      {task.description && (
        <div className="opacity-60 truncate text-[10px]">{task.description}</div>
      )}
    </div>
  )
}
