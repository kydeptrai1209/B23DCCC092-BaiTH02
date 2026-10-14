import React from 'react'
import { RefreshCw, CloudSun } from 'lucide-react'
import type { TemperatureUnit } from '../types/weather'

interface HeaderProps {
  unit: TemperatureUnit
  onToggleUnit: () => void
  onRefresh?: () => void
  isRefreshing?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <header className="w-full bg-slate-900/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* App Title & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <CloudSun className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent leading-tight">
              Thời Tiết Việt Nam
            </h1>
            <p className="text-xs text-slate-400 font-medium">Dữ liệu thời gian thực từ Open-Meteo</p>
          </div>
        </div>

        {/* Action Controls: Refresh + Unit Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Làm mới dữ liệu"
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white border border-white/10 transition-all flex items-center gap-1.5 text-sm disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`}
              />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          )}

          {/* °C / °F Switcher (YC5: Không gọi lại API) */}
          <div
            className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10"
            role="group"
            aria-label="Đơn vị nhiệt độ"
          >
            <button
              type="button"
              onClick={() => unit !== 'celsius' && onToggleUnit()}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                unit === 'celsius'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => unit !== 'fahrenheit' && onToggleUnit()}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                unit === 'fahrenheit'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
