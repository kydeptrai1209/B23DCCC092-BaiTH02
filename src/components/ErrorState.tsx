import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'

interface ErrorStateProps {
  message?: string | null
  onRetry: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div
      data-testid="error-state"
      className="flex flex-col items-center justify-center py-12 px-6 text-center rounded-3xl bg-rose-950/30 border border-rose-500/30 backdrop-blur-md shadow-2xl"
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-rose-400" />
      </div>

      <h2 className="text-xl font-bold text-white mb-2">Không thể tải dữ liệu thời tiết</h2>
      <p className="text-rose-200/80 max-w-md text-sm mb-6 leading-relaxed">
        {message || 'Đã có lỗi xảy ra trong quá trình kết nối với máy chủ Open-Meteo. Vui lòng kiểm tra lại kết nối mạng và thử lại.'}
      </p>

      {/* Nút Thử lại (YC4) */}
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-95 text-white font-medium text-sm shadow-lg shadow-rose-900/50 transition-all cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        Thử lại
      </button>
    </div>
  )
}
