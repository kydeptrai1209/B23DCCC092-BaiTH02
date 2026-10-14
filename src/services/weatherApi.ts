import type { OpenMeteoResponse } from '../types/weather'

export async function fetchCityWeather(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'Asia/Ho_Chi_Minh',
    forecast_days: '7',
  })

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`

  const response = await fetch(url, {
    method: 'GET',
    signal,
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(
      `Không thể lấy dữ liệu thời tiết (Mã lỗi HTTP: ${response.status} ${response.statusText})`
    )
  }

  const data: OpenMeteoResponse = await response.json()

  if (!data.current || !data.daily) {
    throw new Error('Dữ liệu trả về từ máy chủ Open-Meteo không hợp lệ.')
  }

  return data
}
