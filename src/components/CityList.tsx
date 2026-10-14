import React, { useState, useMemo } from 'react'
import { Search, X, Star, Building2 } from 'lucide-react'
import type { City } from '../types/weather'
import { matchCitySearch } from '../utils/string'
import { CityCard } from './CityCard'

interface CityListProps {
  cities: City[]
  selectedCity: City | null
  onSelectCity: (city: City) => void
  favoriteIds: string[]
  onToggleFavorite: (cityId: string) => void
}

type FilterTab = 'all' | 'favorites'

export const CityList: React.FC<CityListProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  favoriteIds,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  // Filter cities based on active tab and Vietnamese accent-insensitive search
  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      // Tab check
      if (activeTab === 'favorites' && !favoriteIds.includes(city.id)) {
        return false
      }
      // Search check
      return matchCitySearch(city, searchQuery)
    })
  }, [cities, activeTab, favoriteIds, searchQuery])

  return (
    <div
      data-testid="city-list-container"
      className="rounded-3xl bg-white/10 border border-white/20 p-5 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col gap-4"
    >
      {/* Title & Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">8 Thành Phố Việt Nam</h3>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
          {filteredCities.length} / {cities.length}
        </span>
      </div>

      {/* Search Input (Không phân biệt dấu tiếng Việt) */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm thành phố (vd: ha noi, tphcm, hue)..."
          className="w-full pl-10 pr-9 py-2.5 bg-black/30 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/80 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            title="Xóa tìm kiếm"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs: Tất cả / Yêu thích */}
      <div className="flex rounded-xl bg-black/30 p-1 border border-white/10 text-xs font-medium">
        <button
          type="button"
          data-testid="tab-all"
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white font-semibold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Tất cả ({cities.length})
        </button>
        <button
          type="button"
          data-testid="tab-favorites"
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
            activeTab === 'favorites'
              ? 'bg-amber-600 text-white font-semibold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          Yêu thích ({favoriteIds.length})
        </button>
      </div>

      {/* City List (YC1: Highlight selected city) */}
      <div className="space-y-2.5 overflow-y-auto max-h-[480px] pr-0.5 custom-scrollbar">
        {filteredCities.length > 0 ? (
          filteredCities.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              isSelected={selectedCity?.id === city.id}
              isFavorite={favoriteIds.includes(city.id)}
              onSelect={onSelectCity}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        ) : (
          <div className="py-8 text-center text-slate-400 text-sm">
            {activeTab === 'favorites' ? (
              <div className="space-y-2">
                <Star className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
                <p>Chưa có thành phố nào trong danh sách yêu thích.</p>
                <p className="text-xs text-slate-500">
                  Nhấn vào biểu tượng ngôi sao để lưu thành phố vào đây.
                </p>
              </div>
            ) : (
              <p>Không tìm thấy thành phố nào khớp với &quot;{searchQuery}&quot;</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
