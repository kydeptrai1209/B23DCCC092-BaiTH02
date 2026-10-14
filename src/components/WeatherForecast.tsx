import React from 'react'
import { Calendar } from 'lucide-react'
import type { OpenMeteoDaily, TemperatureUnit } from '../types/weather'
import { getWeatherCondition } from '../constants/weatherCodes'
import { WeatherIcon } from './WeatherIcon'
import { formatTemperature } from '../utils/temperature'
import { formatForecastDate } from '../utils/date'

interface WeatherForecastProps {
  daily: OpenMeteoDaily
  unit: TemperatureUnit
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ daily, unit }) => {
  // Collect 7 days of forecast
  const items = daily.time.map((dateStr, index) => {
    const { dayOfWeek, dayOfMonth } = formatForecastDate(dateStr, index)
    const weatherCode = daily.weather_code[index]
    const tempMax = daily.temperature_2m_max[index]
    const tempMin = daily.temperature_2m_min[index]
    const condition = getWeatherCondition(weatherCode)

    return {
      index,
      dateStr,
      dayOfWeek,
      dayOfMonth,
      condition,
      tempMax,
      tempMin,
    }
  })

  return (
    <div
      data-testid="weather-forecast"
      className="rounded-3xl bg-white/10 border border-white/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Dự báo thời tiết 7 ngày tới</h3>
            <p className="text-xs text-slate-400">Nhiệt độ cao nhất và thấp nhất theo từng ngày</p>
          </div>
        </div>
      </div>

      {/* Grid of forecast cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-7 gap-2.5 sm:gap-3 pt-2">
        {items.map((item) => {
          const isToday = item.index === 0
          return (
            <div
              key={item.dateStr}
              className={`flex flex-col justify-between p-3.5 sm:p-4 lg:p-2.5 xl:p-3.5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                isToday
                  ? 'bg-gradient-to-b from-blue-600/25 to-indigo-600/15 border-blue-400/40 shadow-blue-500/10'
                  : 'bg-white/5 hover:bg-white/10 border-white/10'
              }`}
            >
              {/* Day & Date */}
              <div className="flex lg:flex-col justify-between items-center lg:items-start mb-2.5 gap-0.5">
                <span
                  className={`text-xs sm:text-sm font-semibold leading-tight ${
                    isToday ? 'text-blue-300 font-bold' : 'text-slate-200'
                  }`}
                >
                  {item.dayOfWeek}
                </span>
                <span className="text-xs text-slate-400 font-medium">{item.dayOfMonth}</span>
              </div>

              {/* Weather Icon and Short Label */}
              <div className="flex lg:flex-col items-center justify-center my-2 gap-2">
                <WeatherIcon name={item.condition.iconName} className="w-8 h-8 sm:w-9 sm:h-9" />
                <span className="text-xs text-slate-300 font-medium text-center line-clamp-1">
                  {item.condition.label}
                </span>
              </div>

              {/* Temperatures: Min and Max (YC3: Cao nhất và Thấp nhất) */}
              <div className="pt-2.5 border-t border-white/10 flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">Cao:</span>
                  <span className="font-bold text-amber-300 text-xs sm:text-sm">
                    {formatTemperature(item.tempMax, unit)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">Thấp:</span>
                  <span className="font-semibold text-blue-300 text-xs sm:text-sm">
                    {formatTemperature(item.tempMin, unit)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
