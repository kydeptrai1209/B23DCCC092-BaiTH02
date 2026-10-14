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
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(selectedCity))
  const [error, setError] = useState<string | null>(null)
  const [retryTrigger, setRetryTrigger] = useState<number>(0)
  const [prevCityId, setPrevCityId] = useState<string | null>(selectedCity?.id ?? null)

  const currentCityId = selectedCity?.id ?? null
  if (currentCityId !== prevCityId) {
    setPrevCityId(currentCityId)
    setData(null)
    setIsLoading(Boolean(selectedCity))
    setError(null)
  }

  const refetch = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setRetryTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!selectedCity) {
      return
    }

    const abortController = new AbortController()

    fetchCityWeather(selectedCity.latitude, selectedCity.longitude, abortController.signal)
      .then((res) => {
        if (!abortController.signal.aborted) {
          setData(res)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (abortController.signal.aborted) {
          return
        }
        setData(null)
        const message =
          err instanceof Error
            ? err.message
            : 'Đã xảy ra lỗi không xác định khi tải dữ liệu thời tiết.'
        setError(message)
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
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
