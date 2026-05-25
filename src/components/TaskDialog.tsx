import { useState } from 'react'
import type { Task } from '../types'
import { DAY_LABELS, HOUR_START, HOUR_END, TASK_COLORS } from '../types'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  task: Task | null
  defaultDay: number
  defaultStartH: number
  defaultStartM: number
  onSave: (task: Task) => void
  onDelete: (taskId: string) => void
  onClose: () => void
}

export default function TaskDialog({
  task,
  defaultDay,
  defaultStartH,
  defaultStartM,
  onSave,
  onDelete,
  onClose,
}: Props) {
  const isEditing = !!task
  const [title, setTitle] = useState(task?.title ?? '')
  const [day, setDay] = useState(task?.dayOfWeek ?? defaultDay)
  const [startH, setStartH] = useState(task?.startHour ?? defaultStartH)
  const [startM, setStartM] = useState(task?.startMinute ?? defaultStartM)
  const [endH, setEndH] = useState(task?.endHour ?? defaultStartH + 1)
  const [endM, setEndM] = useState(task?.endMinute ?? defaultStartM)
  const [color, setColor] = useState(
    task?.color ?? TASK_COLORS[Math.floor(Math.random() * TASK_COLORS.length)]
  )
  const [description, setDescription] = useState(task?.description ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const startTotal = startH * 60 + startM
    const endTotal = endH * 60 + endM
    if (endTotal <= startTotal) return

    onSave({
      id: task?.id ?? uuidv4(),
      title: title.trim(),
      dayOfWeek: day,
      startHour: startH,
      startMinute: startM,
      endHour: endH,
      endMinute: endM,
      color,
      description: description.trim() || undefined,
    })
  }

  const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i)
  const minutes = [0, 15, 30, 45]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-[400px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {isEditing ? '编辑事务' : '添加事务'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">事务名称</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="例如：团队周会"
              autoFocus
            />
          </div>

          {/* 星期选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">日期</label>
            <div className="flex gap-1">
              {DAY_LABELS.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDay(i)}
                  className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${
                    day === i
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 时间选择 */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">开始时间</label>
              <div className="flex gap-1">
                <select
                  value={startH}
                  onChange={(e) => setStartH(Number(e.target.value))}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {String(h).padStart(2, '0')}时
                    </option>
                  ))}
                </select>
                <select
                  value={startM}
                  onChange={(e) => setStartM(Number(e.target.value))}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {minutes.map((m) => (
                    <option key={m} value={m}>
                      {String(m).padStart(2, '0')}分
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <span className="text-gray-400 pb-2">—</span>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">结束时间</label>
              <div className="flex gap-1">
                <select
                  value={endH}
                  onChange={(e) => setEndH(Number(e.target.value))}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {String(h).padStart(2, '0')}时
                    </option>
                  ))}
                </select>
                <select
                  value={endM}
                  onChange={(e) => setEndM(Number(e.target.value))}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {minutes.map((m) => (
                    <option key={m} value={m}>
                      {String(m).padStart(2, '0')}分
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 颜色 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">颜色标记</label>
            <div className="flex gap-2">
              {TASK_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-blue-400 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">备注（可选）</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
              rows={2}
              placeholder="补充说明..."
            />
          </div>

          {/* 按钮 */}
          <div className="flex justify-between pt-2">
            <div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => onDelete(task!.id)}
                  className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  删除
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                {isEditing ? '保存' : '添加'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
