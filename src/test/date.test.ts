import { describe, it, expect } from 'vitest'
import { formatForecastDate, formatCurrentUpdateTime } from '../utils/date'

describe('Date formatting utilities', () => {
  describe('formatForecastDate', () => {
    it('formats today (index 0) correctly regardless of day of week', () => {
      const result = formatForecastDate('2026-10-14', 0)
      expect(result.dayOfWeek).toBe('Hôm nay')
      expect(result.dayOfMonth).toBe('14/10')
    })

    it('formats tomorrow (index 1) correctly', () => {
      const result = formatForecastDate('2026-10-15', 1)
      expect(result.dayOfWeek).toBe('Ngày mai')
      expect(result.dayOfMonth).toBe('15/10')
    })

    it('calculates correct Vietnamese day of week for subsequent days without UTC timezone shifting', () => {
      // 2026-10-16 is Friday (Thứ Sáu)
      const friday = formatForecastDate('2026-10-16', 2)
      expect(friday.dayOfWeek).toBe('Thứ Sáu')
      expect(friday.dayOfMonth).toBe('16/10')

      // 2026-10-17 is Saturday (Thứ Bảy)
      const saturday = formatForecastDate('2026-10-17', 3)
      expect(saturday.dayOfWeek).toBe('Thứ Bảy')
      expect(saturday.dayOfMonth).toBe('17/10')

      // 2026-10-18 is Sunday (Chủ Nhật)
      const sunday = formatForecastDate('2026-10-18', 4)
      expect(sunday.dayOfWeek).toBe('Chủ Nhật')
      expect(sunday.dayOfMonth).toBe('18/10')

      // 2026-10-19 is Monday (Thứ Hai)
      const monday = formatForecastDate('2026-10-19', 5)
      expect(monday.dayOfWeek).toBe('Thứ Hai')
      expect(monday.dayOfMonth).toBe('19/10')

      // 2026-10-20 is Tuesday (Thứ Ba)
      const tuesday = formatForecastDate('2026-10-20', 6)
      expect(tuesday.dayOfWeek).toBe('Thứ Ba')
      expect(tuesday.dayOfMonth).toBe('20/10')
    })

    it('handles padding of single digit days and months', () => {
      const result = formatForecastDate('2026-05-03', 2)
      expect(result.dayOfMonth).toBe('03/05')
      // 2026-05-03 is Sunday (Chủ Nhật)
      expect(result.dayOfWeek).toBe('Chủ Nhật')
    })
  })

  describe('formatCurrentUpdateTime', () => {
    it('formats ISO datetime string to HH:mm - DD/MM/YYYY', () => {
      expect(formatCurrentUpdateTime('2026-10-14T14:30')).toBe('14:30 - 14/10/2026')
      expect(formatCurrentUpdateTime('2026-01-05T08:05')).toBe('08:05 - 05/01/2026')
    })

    it('returns empty string for falsy input', () => {
      expect(formatCurrentUpdateTime('')).toBe('')
    })
  })
})
