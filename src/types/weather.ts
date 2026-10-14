export interface City {
  id: string
  name: string
  asciiName: string
  aliases: string[]
  latitude: number
  longitude: number
  region: 'Bắc' | 'Trung' | 'Nam'
}

export type TemperatureUnit = 'celsius' | 'fahrenheit'

export interface OpenMeteoCurrent {
  time: string
  temperature_2m: number
  relative_humidity_2m: number
  wind_speed_10m: number
  weather_code: number
}

export interface OpenMeteoDaily {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
}

export interface OpenMeteoResponse {
  latitude: number
  longitude: number
  timezone: string
  current: OpenMeteoCurrent
  daily: OpenMeteoDaily
}

export interface WeatherCondition {
  label: string
  description: string
  iconName: 'Sun' | 'CloudSun' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'CloudLightning' | 'CloudSnow'
  category: 'clear' | 'clouds' | 'fog' | 'rain' | 'thunder' | 'snow'
  themeClasses: {
    bgGradient: string
    cardBg: string
    accentColor: string
    glowColor: string
  }
}

export interface DailyForecastItem {
  date: string
  dayOfWeek: string
  dayOfMonth: string
  weatherCode: number
  tempMax: number
  tempMin: number
}
