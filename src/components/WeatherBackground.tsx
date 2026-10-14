import React from 'react'
import type { WeatherCondition } from '../types/weather'

interface WeatherBackgroundProps {
  condition: WeatherCondition | null
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ condition }) => {
  const category = condition?.category || 'clear'
  const gradient = condition?.themeClasses.bgGradient || 'from-slate-900 via-indigo-950 to-slate-950'

  return (
    <div
      data-testid="weather-background"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-all duration-1000 ease-in-out"
    >
      {/* Base deep background */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* Dynamic atmospheric gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${gradient} transition-all duration-1000 ease-out`}
      />

      {/* Condition-specific ambient visual effects */}
      {category === 'clear' && (
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl animate-pulse" />
      )}

      {category === 'clouds' && (
        <>
          <div className="absolute top-10 -left-20 w-80 h-80 rounded-full bg-slate-400/10 blur-3xl" />
          <div className="absolute top-40 right-0 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
        </>
      )}

      {category === 'rain' && (
        <>
          <div className="absolute -top-20 left-1/3 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl" />
        </>
      )}

      {category === 'thunder' && (
        <>
          <div className="absolute -top-10 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-10 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl" />
        </>
      )}

      {category === 'fog' && (
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/40 via-slate-900/40 to-transparent" />
      )}

      {category === 'snow' && (
        <div className="absolute -top-20 right-1/4 w-96 h-96 rounded-full bg-indigo-300/15 blur-3xl" />
      )}

      {/* Subtle vignette border gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.5)_100%)]" />
    </div>
  )
}
