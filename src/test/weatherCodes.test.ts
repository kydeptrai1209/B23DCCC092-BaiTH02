import { describe, it, expect } from 'vitest'
import { getWeatherCondition, WEATHER_CONDITIONS } from '../constants/weatherCodes'

describe('Weather Code Mapping Utilities', () => {
  it('maps standard clear sky codes', () => {
    const clear = getWeatherCondition(0)
    expect(clear.label).toBe('Quang đãng')
    expect(clear.category).toBe('clear')
    expect(clear.iconName).toBe('Sun')
  })

  it('maps rain and thunderstorm codes', () => {
    const rain = getWeatherCondition(61)
    expect(rain.label).toBe('Mưa nhẹ')
    expect(rain.category).toBe('rain')
    expect(rain.iconName).toBe('CloudRain')

    const thunder = getWeatherCondition(95)
    expect(thunder.label).toBe('Dông sét')
    expect(thunder.category).toBe('thunder')
    expect(thunder.iconName).toBe('CloudLightning')
  })

  it('returns fallback condition for unknown codes', () => {
    const unknown = getWeatherCondition(9999)
    expect(unknown.label).toBe('Không xác định')
    expect(unknown.description).toContain('9999')
  })

  it('provides all expected theme classes for conditions', () => {
    for (const code of Object.keys(WEATHER_CONDITIONS).map(Number)) {
      const condition = getWeatherCondition(code)
      expect(condition.themeClasses.bgGradient).toBeDefined()
      expect(condition.themeClasses.accentColor).toBeDefined()
    }
  })
})
