import React from 'react'
import { MapPin, Star } from 'lucide-react'
import type { City } from '../types/weather'

interface CityCardProps {
  city: City
  isSelected: boolean
  isFavorite: boolean
  onSelect: (city: City) => void
  onToggleFavorite: (cityId: string) => void
}

export const CityCard: React.FC<CityCardProps> = ({
  city,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  return (
    <div
      data-testid={`city-card-${city.id}`}
      onClick={() => onSelect(city)}
      className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 border select-none ${
        isSelected
          ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-blue-400/80 shadow-lg shadow-blue-500/20 ring-2 ring-blue-400/50'
          : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
      }`}
    >
      {/* Active selection accent bar */}
      {isSelected && (
        <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-r-full" />
      )}

      {/* Left info: Icon, Name, Region */}
      <div className="flex items-center gap-3 min-w-0 pl-1">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            isSelected
              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/40'
              : 'bg-white/10 text-slate-300 group-hover:bg-white/15'
          }`}
        >
          <MapPin className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={`font-semibold text-sm sm:text-base truncate ${
                isSelected ? 'text-white font-bold' : 'text-slate-100 group-hover:text-white'
              }`}
            >
              {city.name}
            </h4>
            {isSelected && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500 text-white leading-none">
                Đang xem
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 truncate">
            Miền {city.region} • {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
          </p>
        </div>
      </div>

      {/* Right button: Toggle Favorite */}
      <button
        type="button"
        data-testid={`favorite-btn-${city.id}`}
        title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        aria-label={isFavorite ? `Bỏ yêu thích ${city.name}` : `Thêm ${city.name} vào yêu thích`}
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite(city.id)
        }}
        className={`p-2 rounded-xl transition-all shrink-0 ${
          isFavorite
            ? 'text-amber-400 hover:text-amber-300 hover:scale-110'
            : 'text-slate-500 hover:text-amber-300 hover:bg-white/10'
        }`}
      >
        <Star
          className={`w-5 h-5 transition-transform ${
            isFavorite ? 'fill-amber-400 text-amber-400' : ''
          }`}
        />
      </button>
    </div>
  )
}
