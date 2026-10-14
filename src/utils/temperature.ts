import type { TemperatureUnit } from '../types/weather'

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round(celsiusToFahrenheit(celsius))
  }
  return Math.round(celsius)
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const converted = convertTemperature(celsius, unit)
  const symbol = unit === 'fahrenheit' ? '°F' : '°C'
  return `${converted}${symbol}`
}

export function formatTemperatureNumber(celsius: number, unit: TemperatureUnit): number {
  return convertTemperature(celsius, unit)
}

export function getUnitSymbol(unit: TemperatureUnit): string {
  return unit === 'fahrenheit' ? '°F' : '°C'
}
