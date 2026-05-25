import { formatWeekLabel } from '../utils/dateUtils'

interface Props {
  monday: Date
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export default function WeekNavigator({ monday, onPrev, onNext, onToday }: Props) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm shrink-0">
      <h1 className="text-lg font-bold text-gray-800">时间计划</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={onPrev}
          className="px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="上一周"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-medium text-gray-700 min-w-[160px] text-center">
          {formatWeekLabel(monday)}
        </span>
        <button
          onClick={onNext}
          className="px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="下一周"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={onToday}
          className="ml-2 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          今天
        </button>
      </div>
    </header>
  )
}
