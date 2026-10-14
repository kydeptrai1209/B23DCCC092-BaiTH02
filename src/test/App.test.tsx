import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'
import * as weatherApi from '../services/weatherApi'
import type { OpenMeteoResponse } from '../types/weather'

const mockWeatherData: OpenMeteoResponse = {
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
    time: [
      '2026-10-14',
      '2026-10-15',
      '2026-10-16',
      '2026-10-17',
      '2026-10-18',
      '2026-10-19',
      '2026-10-20',
    ],
    weather_code: [0, 1, 2, 61, 80, 0, 2],
    temperature_2m_max: [32, 33, 31, 29, 28, 30, 31],
    temperature_2m_min: [24, 25, 23, 22, 21, 23, 24],
  },
}

describe('Weather App Component Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('renders initial state with 8 Vietnamese cities and highlights active city', async () => {
    const fetchSpy = vi.spyOn(weatherApi, 'fetchCityWeather').mockResolvedValue(mockWeatherData)

    render(<App />)

    // Check header
    expect(screen.getByText('Thời Tiết Việt Nam')).toBeInTheDocument()

    // Check active city highlight
    const haNoiCard = screen.getByTestId('city-card-ha-noi')
    expect(haNoiCard).toBeInTheDocument()
    expect(screen.getByText('Đang xem')).toBeInTheDocument()

    // Wait for weather data to display
    await waitFor(() => {
      expect(screen.getByTestId('weather-current')).toBeInTheDocument()
    })

    // Verify current weather details (YC2)
    expect(screen.getByTestId('current-temp')).toHaveTextContent('28°C')
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText(/12.5/)).toBeInTheDocument()
    expect(screen.getByText(/14:30 - 14\/10\/2026/)).toBeInTheDocument()

    // Verify 7-day forecast (YC3) - all 7 days have day of week and day/month
    expect(screen.getByTestId('weather-forecast')).toBeInTheDocument()
    expect(screen.getByText('Hôm nay · Thứ Tư')).toBeInTheDocument()
    expect(screen.getByText('Ngày mai · Thứ Năm')).toBeInTheDocument()
    expect(screen.getByText('Thứ Sáu')).toBeInTheDocument()
    expect(screen.getByText('Thứ Bảy')).toBeInTheDocument()
    expect(screen.getByText('Chủ Nhật')).toBeInTheDocument()
    expect(screen.getByText('Thứ Hai')).toBeInTheDocument()
    expect(screen.getByText('Thứ Ba')).toBeInTheDocument()
    expect(screen.getByText('14/10')).toBeInTheDocument()
    expect(screen.getByText('15/10')).toBeInTheDocument()
    expect(screen.getByText('20/10')).toBeInTheDocument()

    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('toggles °C to °F without making any additional API calls (YC5)', async () => {
    const fetchSpy = vi.spyOn(weatherApi, 'fetchCityWeather').mockResolvedValue(mockWeatherData)

    render(<App />)

    await waitFor(() => {
      expect(screen.getByTestId('current-temp')).toHaveTextContent('28°C')
    })

    expect(fetchSpy).toHaveBeenCalledTimes(1)

    // Click °F button
    const fahrenheitButton = screen.getByRole('button', { name: '°F' })
    fireEvent.click(fahrenheitButton)

    // 28°C = 82°F (round(28 * 9/5 + 32) = 82)
    await waitFor(() => {
      expect(screen.getByTestId('current-temp')).toHaveTextContent('82°F')
    })

    // CRITICAL (YC5): API must NOT be called again on unit toggle
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    // Switch back to °C
    const celsiusButton = screen.getByRole('button', { name: '°C' })
    fireEvent.click(celsiusButton)

    await waitFor(() => {
      expect(screen.getByTestId('current-temp')).toHaveTextContent('28°C')
    })
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('handles accent-insensitive search properly (ha noi -> Hà Nội, da lat -> Đà Lạt)', async () => {
    vi.spyOn(weatherApi, 'fetchCityWeather').mockResolvedValue(mockWeatherData)

    render(<App />)

    await waitFor(() => {
      expect(screen.getByTestId('weather-current')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Tìm thành phố/i)

    // Type unaccented 'da lat'
    fireEvent.change(searchInput, { target: { value: 'da lat' } })
    expect(screen.getByTestId('city-card-da-lat')).toBeInTheDocument()
    expect(screen.queryByTestId('city-card-ha-noi')).not.toBeInTheDocument()

    // Type 'saigon' alias
    fireEvent.change(searchInput, { target: { value: 'saigon' } })
    expect(screen.getByTestId('city-card-tp-ho-chi-minh')).toBeInTheDocument()
    expect(screen.queryByTestId('city-card-da-lat')).not.toBeInTheDocument()
  })

  it('allows toggling favorite cities and saving to localStorage', async () => {
    vi.spyOn(weatherApi, 'fetchCityWeather').mockResolvedValue(mockWeatherData)

    render(<App />)

    await waitFor(() => {
      expect(screen.getByTestId('weather-current')).toBeInTheDocument()
    })

    // Click favorite on Đà Nẵng
    const starBtn = screen.getByTestId('favorite-btn-da-nang')
    fireEvent.click(starBtn)

    // Tab favorites should show count 1
    const favTab = screen.getByTestId('tab-favorites')
    expect(favTab).toHaveTextContent('Yêu thích (1)')

    // Click favorites tab
    fireEvent.click(favTab)
    expect(screen.getByTestId('city-card-da-nang')).toBeInTheDocument()
    expect(screen.queryByTestId('city-card-ha-noi')).not.toBeInTheDocument()
  })

  it('displays error state with retry button when API fails (YC4)', async () => {
    const fetchSpy = vi.spyOn(weatherApi, 'fetchCityWeather')
      .mockRejectedValueOnce(new Error('Mất kết nối mạng'))
      .mockResolvedValueOnce(mockWeatherData)

    render(<App />)

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument()
    })
    expect(screen.getByText(/Mất kết nối mạng/)).toBeInTheDocument()

    // Click Thử lại button
    const retryBtn = screen.getByRole('button', { name: /Thử lại/i })
    fireEvent.click(retryBtn)

    // Should succeed on second try
    await waitFor(() => {
      expect(screen.getByTestId('weather-current')).toBeInTheDocument()
    })
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it('displays empty state when unselected (YC4)', async () => {
    vi.spyOn(weatherApi, 'fetchCityWeather').mockResolvedValue(mockWeatherData)

    render(<App />)

    await waitFor(() => {
      expect(screen.getByTestId('weather-current')).toBeInTheDocument()
    })

    // Click button to unselect city
    const unselectBtn = screen.getByRole('button', {
      name: /Bỏ chọn thành phố/i,
    })
    fireEvent.click(unselectBtn)

    // Verify EmptyState is rendered
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByText('Chưa chọn thành phố')).toBeInTheDocument()
  })

  it('renders in unselected state when initialCity is null and selects city via suggestion chip (YC4)', async () => {
    const fetchSpy = vi.spyOn(weatherApi, 'fetchCityWeather').mockResolvedValue(mockWeatherData)

    render(<App initialCity={null} />)

    // Empty state should be visible immediately
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByText('Chưa chọn thành phố')).toBeInTheDocument()
    expect(screen.queryByTestId('weather-current')).not.toBeInTheDocument()

    // Click quick suggestion chip "Hà Nội"
    const quickChip = screen.getByRole('button', { name: 'Hà Nội' })
    fireEvent.click(quickChip)

    // Should fetch and display weather
    await waitFor(() => {
      expect(screen.getByTestId('weather-current')).toBeInTheDocument()
    })
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    // Clicking top-right Bỏ chọn button on WeatherCurrent card should unselect
    const deselectBtn = screen.getByTitle('Bỏ chọn thành phố')
    fireEvent.click(deselectBtn)

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })
})

