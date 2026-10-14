import React from 'react'
import { MapPin, Compass } from 'lucide-react'
import type { City } from '../types/weather'
import { VIETNAM_CITIES } from '../constants/cities'

interface EmptyStateProps {
  onSelectCity: (city: City) => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectCity }) => {
  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 border border-blue-400/30 flex items-center justify-center mb-6 shadow-inner animate-pulse">
        <Compass className="w-10 h-10 text-blue-400" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Chưa chọn thành phố</h2>
      <p className="text-slate-400 max-w-md text-sm sm:text-base mb-6 leading-relaxed">
        Vui lòng chọn một thành phố từ danh sách bên cạnh để xem tình hình thời tiết hiện tại và dự báo chi tiết trong 7 ngày tới.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-slate-500 uppercase font-semibold mr-1">Gợi ý chọn nhanh:</span>
        {VIETNAM_CITIES.slice(0, 3).map((city) => (
          <button
            key={city.id}
            type="button"
            onClick={() => onSelectCity(city)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 text-xs font-medium border border-white/10 transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            {city.name}
          </button>
        ))}
      </div>
    </div>
  )
}
