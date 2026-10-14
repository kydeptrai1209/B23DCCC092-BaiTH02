import { useState } from 'react'
import type { City, TemperatureUnit } from './types/weather'
import { VIETNAM_CITIES, DEFAULT_CITY } from './constants/cities'
import { getWeatherCondition } from './constants/weatherCodes'
import { useWeather } from './hooks/useWeather'
import { useFavorites } from './hooks/useFavorites'
import { Header } from './components/Header'
import { CityList } from './components/CityList'
import { WeatherCurrent } from './components/WeatherCurrent'
import { WeatherForecast } from './components/WeatherForecast'
import { WeatherBackground } from './components/WeatherBackground'
import { LoadingSkeleton } from './components/LoadingSkeleton'
import { ErrorState } from './components/ErrorState'
import { EmptyState } from './components/EmptyState'

export function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(DEFAULT_CITY)
  const [unit, setUnit] = useState<TemperatureUnit>('celsius')

  // Weather data hook
  const { data, isLoading, error, refetch } = useWeather(selectedCity)

  // Favorites hook (localStorage)
  const { favoriteIds, toggleFavorite } = useFavorites()

  // Toggle °C / °F (YC5: purely in client state, does not call API)
  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'))
  }

  // Weather condition for dynamic background
  const currentCondition = data?.current
    ? getWeatherCondition(data.current.weather_code)
    : null

  return (
    <div className="relative min-h-screen flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Dynamic Background Effect based on weather_code */}
      <WeatherBackground condition={currentCondition} />

      {/* App Header with non-refetching °C / °F switcher */}
      <Header
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onRefresh={refetch}
        isRefreshing={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* YC6 Responsive Layout:
            - từ 768px (md): 2 cột (md:grid-cols-12 với cột danh sách và cột thông tin)
            - nhỏ hơn: 1 cột xếp dọc (grid-cols-1)
        */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Cột 1: Danh sách 8 thành phố, tìm kiếm, yêu thích */}
          <aside className="md:col-span-5 lg:col-span-4 w-full">
            <CityList
              cities={VIETNAM_CITIES}
              selectedCity={selectedCity}
              onSelectCity={(city) => setSelectedCity(city)}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
            />

            {/* Quick Unselect button for testing / viewing unselected state (YC4) */}
            {selectedCity && (
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => setSelectedCity(null)}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors underline decoration-dotted underline-offset-4"
                >
                  Bỏ chọn thành phố (xem giao diện chưa chọn)
                </button>
              </div>
            )}
          </aside>

          {/* Cột 2: Thời tiết hiện tại và Dự báo 7 ngày */}
          <section className="md:col-span-7 lg:col-span-8 w-full space-y-6">
            {/* Trạng thái 1: Chưa chọn thành phố (YC4) */}
            {!selectedCity && (
              <EmptyState onSelectCity={(city) => setSelectedCity(city)} />
            )}

            {/* Trạng thái 2: Đang tải dữ liệu (YC4) */}
            {selectedCity && isLoading && <LoadingSkeleton />}

            {/* Trạng thái 3: Gặp lỗi khi tải dữ liệu, có nút Thử lại (YC4) */}
            {selectedCity && !isLoading && error && (
              <ErrorState message={error} onRetry={refetch} />
            )}

            {/* Trạng thái 4: Tải dữ liệu thành công, hiển thị thời tiết và dự báo */}
            {selectedCity && !isLoading && !error && data && (
              <>
                {/* Thời tiết hiện tại (YC2) */}
                <WeatherCurrent
                  city={selectedCity}
                  current={data.current}
                  unit={unit}
                />

                {/* Dự báo 7 ngày (YC3) */}
                <WeatherForecast
                  daily={data.daily}
                  unit={unit}
                />
              </>
            )}
          </section>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="w-full border-t border-white/10 py-5 text-center text-xs text-slate-400 bg-slate-950/40 backdrop-blur-md">
        <p className="max-w-7xl mx-auto px-4">
          Ứng dụng Thời Tiết 8 Thành Phố Việt Nam • Dữ liệu dự báo khí tượng từ{' '}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline font-semibold"
          >
            Open-Meteo
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
