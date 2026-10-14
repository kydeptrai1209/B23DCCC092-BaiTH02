import React from 'react'
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  CloudSnow,
} from 'lucide-react'
import type { WeatherCondition } from '../types/weather'

interface WeatherIconProps {
  name: WeatherCondition['iconName']
  className?: string
  size?: number
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  name,
  className = 'w-6 h-6',
  size,
}) => {
  const props = { className, size }

  switch (name) {
    case 'Sun':
      return <Sun {...props} className={`text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] ${className}`} />
    case 'CloudSun':
      return <CloudSun {...props} className={`text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.5)] ${className}`} />
    case 'Cloud':
      return <Cloud {...props} className={`text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.4)] ${className}`} />
    case 'CloudFog':
      return <CloudFog {...props} className={`text-teal-300 drop-shadow-[0_0_8px_rgba(94,234,212,0.4)] ${className}`} />
    case 'CloudDrizzle':
      return <CloudDrizzle {...props} className={`text-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,0.5)] ${className}`} />
    case 'CloudRain':
      return <CloudRain {...props} className={`text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.6)] ${className}`} />
    case 'CloudLightning':
      return <CloudLightning {...props} className={`text-yellow-400 drop-shadow-[0_0_14px_rgba(250,204,21,0.7)] ${className}`} />
    case 'CloudSnow':
      return <CloudSnow {...props} className={`text-indigo-200 drop-shadow-[0_0_10px_rgba(199,210,254,0.6)] ${className}`} />
    default:
      return <Sun {...props} className={`text-amber-400 ${className}`} />
  }
}
