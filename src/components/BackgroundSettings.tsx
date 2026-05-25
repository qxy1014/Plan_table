import { useRef } from 'react'

interface Props {
  backgroundImage: string
  onSetBackground: (dataUrl: string) => void
  onResetBackground: () => void
}

export default function BackgroundSettings({
  backgroundImage,
  onSetBackground,
  onResetBackground,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const defaultBg = './4096x2626.jpg'

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSetBackground(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleReset = () => {
    onResetBackground()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isCustom = backgroundImage && backgroundImage !== defaultBg

  return (
    <>
      <button
        onClick={() => {
          const dialog = document.getElementById('bg-settings-dialog')
          if (dialog) (dialog as HTMLDialogElement).showModal()
        }}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
        title="自定义背景"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      <dialog
        id="bg-settings-dialog"
        className="rounded-xl shadow-2xl p-0 backdrop:bg-black/30"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            (e.currentTarget as HTMLDialogElement).close()
          }
        }}
      >
        <div className="p-6 w-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">背景设置</h2>
            <button
              onClick={() => {
                const dialog = document.getElementById('bg-settings-dialog')
                if (dialog) (dialog as HTMLDialogElement).close()
              }}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 预览 */}
          <div
            className="w-full h-40 rounded-lg bg-cover bg-center border border-gray-200 mb-4"
            style={{
              backgroundImage: `url(${backgroundImage || defaultBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* 操作按钮 */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              选择图片
            </button>
            {isCustom && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                恢复默认
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="text-xs text-gray-400">支持 JPG、PNG、GIF 等常见图片格式，建议使用横向图片以获得最佳效果。</p>
        </div>
      </dialog>
    </>
  )
}
