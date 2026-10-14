import { describe, it, expect } from 'vitest'
import {
  celsiusToFahrenheit,
  convertTemperature,
  formatTemperature,
} from '../utils/temperature'

describe('Temperature Conversion Utilities', () => {
  it('converts Celsius to Fahrenheit correctly', () => {
    expect(celsiusToFahrenheit(0)).toBe(32)
    expect(celsiusToFahrenheit(100)).toBe(212)
    expect(celsiusToFahrenheit(25)).toBe(77)
    expect(celsiusToFahrenheit(-10)).toBe(14)
  })

  it('converts and rounds temperatures by unit', () => {
    expect(convertTemperature(24.4, 'celsius')).toBe(24)
    expect(convertTemperature(24.6, 'celsius')).toBe(25)
    expect(convertTemperature(25, 'fahrenheit')).toBe(77)
  })

  it('formats temperature strings with appropriate symbols', () => {
    expect(formatTemperature(28, 'celsius')).toBe('28°C')
    expect(formatTemperature(28, 'fahrenheit')).toBe('82°F')
    expect(formatTemperature(0, 'celsius')).toBe('0°C')
    expect(formatTemperature(0, 'fahrenheit')).toBe('32°F')
  })
})
