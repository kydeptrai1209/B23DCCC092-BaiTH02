import { describe, it, expect } from 'vitest'
import { removeVietnameseTones, matchCitySearch } from '../utils/string'
import { VIETNAM_CITIES } from '../constants/cities'

describe('Vietnamese String & Search Utilities', () => {
  it('removes Vietnamese tones and normalizes properly', () => {
    expect(removeVietnameseTones('Hà Nội')).toBe('ha noi')
    expect(removeVietnameseTones('Đà Nẵng')).toBe('da nang')
    expect(removeVietnameseTones('TP. Hồ Chí Minh')).toBe('tp. ho chi minh')
    expect(removeVietnameseTones('Cần Thơ')).toBe('can tho')
    expect(removeVietnameseTones('Đà Lạt')).toBe('da lat')
    expect(removeVietnameseTones('Hải Phòng')).toBe('hai phong')
  })

  it('handles empty and boundary string inputs', () => {
    expect(removeVietnameseTones('')).toBe('')
    expect(removeVietnameseTones('   ')).toBe('')
  })

  it('matches cities with Vietnamese accents or without accents', () => {
    const haNoi = VIETNAM_CITIES.find((c) => c.id === 'ha-noi')!
    expect(matchCitySearch(haNoi, 'Hà Nội')).toBe(true)
    expect(matchCitySearch(haNoi, 'ha noi')).toBe(true)
    expect(matchCitySearch(haNoi, 'HANOI')).toBe(true)
    expect(matchCitySearch(haNoi, 'hn')).toBe(true)
    expect(matchCitySearch(haNoi, 'da nang')).toBe(false)

    const daLat = VIETNAM_CITIES.find((c) => c.id === 'da-lat')!
    expect(matchCitySearch(daLat, 'da lat')).toBe(true)
    expect(matchCitySearch(daLat, 'dalat')).toBe(true)
    expect(matchCitySearch(daLat, 'ĐÀ LẠT')).toBe(true)

    const tphcm = VIETNAM_CITIES.find((c) => c.id === 'tp-ho-chi-minh')!
    expect(matchCitySearch(tphcm, 'ho chi minh')).toBe(true)
    expect(matchCitySearch(tphcm, 'saigon')).toBe(true)
    expect(matchCitySearch(tphcm, 'sai gon')).toBe(true)
    expect(matchCitySearch(tphcm, 'tphcm')).toBe(true)
  })
})
