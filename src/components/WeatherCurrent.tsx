import React from 'react'
import { Droplets, Wind, Clock, MapPin, Sparkles, X } from 'lucide-react'
import type { City, OpenMeteoCurrent, TemperatureUnit } from '../types/weather'
import { getWeatherCondition } from '../constants/weatherCodes'
import { WeatherIcon } from './WeatherIcon'
import { formatTemperature } from '../utils/temperature'
import { formatCurrentUpdateTime } from '../utils/date'

interface WeatherCurrentProps {
  city: City
  current: OpenMeteoCurrent
  unit: TemperatureUnit
  onDeselect?: () => void
}

export const WeatherCurrent: React.FC<WeatherCurrentProps> = ({
  city,
  current,
  unit,
  onDeselect,
}) => {
  const condition = getWeatherCondition(current.weather_code)
  const formattedTemp = formatTemperature(current.temperature_2m, unit)
  const updateTime = formatCurrentUpdateTime(current.time)

  return (
    <div
      data-testid="weather-current"
      className="relative overflow-hidden rounded-3xl bg-white/10 border border-white/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all"
    >
      {/* Background ambient radial highlight */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Top right deselect button */}
      {onDeselect && (
        <button
          type="button"
          onClick={onDeselect}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/15 active:scale-95 text-slate-400 hover:text-white border border-white/10 transition-all flex items-center gap-1.5 text-xs cursor-pointer z-10"
          title="Bỏ chọn thành phố"
        >
          <X className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bỏ chọn</span>
        </button>
      )}

      {/* Top row: City info & Weather Icon */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <MapPin className="w-3 h-3" />
              Khu vực {city.region}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Thời gian thực
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {city.name}
          </h2>

          <p className="mt-1 text-base sm:text-lg text-slate-200 font-medium">
            {condition.description}
          </p>
        </div>

        {/* Weather Icon (Hero sized) */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg flex items-center justify-center self-end sm:self-auto">
          <WeatherIcon name={condition.iconName} className="w-14 h-14 sm:w-16 sm:h-16" />
        </div>
      </div>

      {/* Middle row: Big temperature reading */}
      <div className="mt-6 sm:mt-8 flex items-baseline gap-3">
        <span
          data-testid="current-temp"
          className="text-6xl sm:text-7xl font-black tracking-tight text-white drop-shadow-md"
        >
          {formattedTemp}
        </span>
        <span className="text-sm sm:text-base font-semibold px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-300">
          {condition.label}
        </span>
      </div>

      {/* Bottom row: Detailed weather metrics (YC2: Độ ẩm, Tốc độ gió, Thời điểm cập nhật) */}
      <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Humidity */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Độ ẩm</p>
            <p className="text-base sm:text-lg font-bold text-white">
              {current.relative_humidity_2m}%
            </p>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Tốc độ gió</p>
            <p className="text-base sm:text-lg font-bold text-white">
              {current.wind_speed_10m} <span className="text-xs font-normal text-slate-300">km/h</span>
            </p>
          </div>
        </div>

        {/* Update Time */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Thời điểm cập nhật</p>
            <p className="text-sm sm:text-base font-bold text-white">
              {updateTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
