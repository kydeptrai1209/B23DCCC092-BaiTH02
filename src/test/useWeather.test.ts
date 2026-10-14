import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useWeather } from '../hooks/useWeather'
import * as weatherApi from '../services/weatherApi'
import { VIETNAM_CITIES } from '../constants/cities'
import type { OpenMeteoResponse } from '../types/weather'

const mockCityA = VIETNAM_CITIES[0] // Ha Noi
const mockCityB = VIETNAM_CITIES[1] // Hai Phong

const mockDataA: OpenMeteoResponse = {
  latitude: 21.0285,
  longitude: 105.8542,
  timezone: 'Asia/Ho_Chi_Minh',
  current: {
    time: '2026-10-14T14:30',
    temperature_2m: 28,
    relative_humidity_2m: 75,
    wind_speed_10m: 12.5,
    weather_code: 0,
  },
  daily: {
    time: ['2026-10-14'],
    weather_code: [0],
    temperature_2m_max: [32],
    temperature_2m_min: [24],
  },
}

const mockDataB: OpenMeteoResponse = {
  ...mockDataA,
  latitude: 20.8449,
  longitude: 106.6881,
  current: {
    ...mockDataA.current,
    temperature_2m: 26,
  },
}

describe('useWeather hook race conditions & state integrity', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('handles null selectedCity by returning null data and not loading', () => {
    const { result } = renderHook(() => useWeather(null))
    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('loads city weather and updates data state', async () => {
    vi.spyOn(weatherApi, 'fetchCityWeather').mockResolvedValue(mockDataA)

    const { result } = renderHook(() => useWeather(mockCityA))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toEqual(mockDataA)
      expect(result.current.error).toBeNull()
    })
  })

  it('handles race conditions when switching cities rapidly without leaking stale data or prematurely stopping loading', async () => {
    let resolveCityA: (val: OpenMeteoResponse) => void
    const promiseA = new Promise<OpenMeteoResponse>((resolve) => {
      resolveCityA = resolve
    })

    const fetchSpy = vi.spyOn(weatherApi, 'fetchCityWeather').mockImplementation((lat) => {
      if (lat === mockCityA.latitude) {
        return promiseA
      }
      return Promise.resolve(mockDataB)
    })

    const { result, rerender } = renderHook(
      ({ city }) => useWeather(city),
      { initialProps: { city: mockCityA } }
    )

    // City A is loading
    expect(result.current.isLoading).toBe(true)

    // User rapidly switches to City B before City A resolves
    rerender({ city: mockCityB })

    // Wait for City B to resolve
    await waitFor(() => {
      expect(result.current.data).toEqual(mockDataB)
      expect(result.current.isLoading).toBe(false)
    })

    // Later City A resolves (should be ignored because request was aborted/cancelled)
    act(() => {
      resolveCityA!(mockDataA)
    })

    // Data must remain City B, NOT overwritten by City A
    expect(result.current.data).toEqual(mockDataB)
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it('clears data and sets error when API request fails', async () => {
    vi.spyOn(weatherApi, 'fetchCityWeather').mockRejectedValue(new Error('Network connection timeout'))

    const { result } = renderHook(() => useWeather(mockCityA))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('Network connection timeout')
      expect(result.current.data).toBeNull()
    })
  })

  it('cleans up state when city is deselected to null', async () => {
    vi.spyOn(weatherApi, 'fetchCityWeather').mockResolvedValue(mockDataA)

    const { result, rerender } = renderHook(
      ({ city }) => useWeather(city),
      { initialProps: { city: mockCityA as typeof mockCityA | null } }
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(mockDataA)
    })

    // Deselect city
    rerender({ city: null })

    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })
})
