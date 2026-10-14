import { useState, useEffect, useCallback } from 'react'
import type { City, OpenMeteoResponse } from '../types/weather'
import { fetchCityWeather } from '../services/weatherApi'

interface UseWeatherResult {
  data: OpenMeteoResponse | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useWeather(selectedCity: City | null): UseWeatherResult {
  const [data, setData] = useState<OpenMeteoResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [retryTrigger, setRetryTrigger] = useState<number>(0)

  const refetch = useCallback(() => {
    setRetryTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!selectedCity) {
      return
    }

    const abortController = new AbortController()

    queueMicrotask(() => {
      if (!abortController.signal.aborted) {
        setIsLoading(true)
        setError(null)
      }
    })

    fetchCityWeather(selectedCity.latitude, selectedCity.longitude, abortController.signal)
      .then((res) => {
        setData(res)
        setError(null)
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        const message =
          err instanceof Error
            ? err.message
            : 'Đã xảy ra lỗi không xác định khi tải dữ liệu thời tiết.'
        setError(message)
      })
      .finally(() => {
        setIsLoading(false)
      })

    return () => {
      abortController.abort()
    }
  }, [selectedCity, retryTrigger])

  return {
    data: selectedCity ? data : null,
    isLoading: selectedCity ? isLoading : false,
    error: selectedCity ? error : null,
    refetch,
  }
}
