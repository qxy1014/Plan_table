import { useState, useEffect } from 'react'
import type { TodoItem } from '../types'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'plan-table-todos'

function loadTodos(): TodoItem[] {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try { return JSON.parse(saved) } catch { /* */ }
  }
  return []
}

function saveTodos(todos: TodoItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [input, setInput] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setTodos(loadTodos())
    setLoaded(false)
    // 延迟显示，让背景图先加载
    setTimeout(() => setLoaded(true), 100)
  }, [])

  const persistAndSet = (updated: TodoItem[]) => {
    setTodos(updated)
    saveTodos(updated)
  }

  const handleAdd = () => {
    const title = input.trim()
    if (!title) return
    const newItem: TodoItem = {
      id: uuidv4(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    persistAndSet([newItem, ...todos])
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd()
  }

  const handleToggle = (id: string) => {
    persistAndSet(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const handleDelete = (id: string) => {
    persistAndSet(todos.filter((t) => t.id !== id))
  }

  const activeTodos = todos.filter((t) => !t.completed)
  const completedTodos = todos.filter((t) => t.completed)

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* 五条悟背景图 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://wallpapercave.com/wp/wp14028824.jpg)',
        }}
      />
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* 内容区 */}
      <div
        className={`relative z-10 flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-6 transition-opacity duration-700 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* 标题 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg tracking-wider">
            待办清单
          </h1>
          <p className="text-white/70 text-sm mt-1">
            {activeTodos.length} 项待完成
          </p>
        </div>

        {/* 输入框 */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="添加新的待办事项..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white placeholder-white/50 outline-none focus:border-white/50 focus:bg-white/25 transition-all text-sm"
          />
          <button
            onClick={handleAdd}
            className="px-5 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium hover:bg-white/30 active:scale-95 transition-all text-sm shrink-0"
          >
            添加
          </button>
        </div>

        {/* 待办列表 */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {/* 未完成 */}
          {activeTodos.map((todo) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}

          {/* 分隔线 */}
          {completedTodos.length > 0 && activeTodos.length > 0 && (
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-white/15" />
              <span className="text-white/40 text-xs">已完成</span>
              <div className="flex-1 h-px bg-white/15" />
            </div>
          )}

          {/* 已完成 */}
          {completedTodos.map((todo) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}

          {todos.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/50 text-sm">还没有待办事项</p>
              <p className="text-white/30 text-xs mt-1">在上方输入框添加一个吧</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TodoRow({
  todo,
  onToggle,
  onDelete,
}: {
  todo: TodoItem
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-md border transition-all ${
        todo.completed
          ? 'bg-white/5 border-white/8'
          : 'bg-white/10 border-white/15 hover:bg-white/15'
      }`}
    >
      {/* 勾选框 */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          todo.completed
            ? 'bg-emerald-400 border-emerald-400'
            : 'border-white/40 hover:border-white/70'
        }`}
      >
        {todo.completed && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* 标题 */}
      <span
        className={`flex-1 text-sm transition-all ${
          todo.completed
            ? 'text-white/40 line-through'
            : 'text-white/90'
        }`}
      >
        {todo.title}
      </span>

      {/* 删除按钮 */}
      <button
        onClick={() => onDelete(todo.id)}
        className="text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
