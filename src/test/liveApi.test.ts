import { describe, it, expect } from 'vitest'
import { fetchCityWeather } from '../services/weatherApi'
import { VIETNAM_CITIES } from '../constants/cities'

describe('Open-Meteo Live API Contract', () => {
  it('successfully fetches valid data from Open-Meteo for Hanoi', async () => {
    const hanoi = VIETNAM_CITIES[0]
    const data = await fetchCityWeather(hanoi.latitude, hanoi.longitude)

    expect(data.current).toBeDefined()
    expect(typeof data.current.temperature_2m).toBe('number')
    expect(typeof data.current.relative_humidity_2m).toBe('number')
    expect(typeof data.current.wind_speed_10m).toBe('number')
    expect(typeof data.current.weather_code).toBe('number')
    expect(typeof data.current.time).toBe('string')

    expect(data.daily).toBeDefined()
    expect(data.daily.time).toHaveLength(7)
    expect(data.daily.weather_code).toHaveLength(7)
    expect(data.daily.temperature_2m_max).toHaveLength(7)
    expect(data.daily.temperature_2m_min).toHaveLength(7)
  })
})
