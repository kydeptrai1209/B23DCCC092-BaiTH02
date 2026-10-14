import { describe, it, expect, beforeEach } from 'vitest'
import {
  getFavoriteCityIds,
  saveFavoriteCityIds,
  toggleFavoriteCityId,
} from '../utils/storage'

describe('Favorite City Storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns empty array when no favorites stored', () => {
    expect(getFavoriteCityIds()).toEqual([])
  })

  it('saves and retrieves favorite city IDs', () => {
    saveFavoriteCityIds(['ha-noi', 'da-nang'])
    expect(getFavoriteCityIds()).toEqual(['ha-noi', 'da-nang'])
  })

  it('toggles favorite city ID adding and removing', () => {
    const afterAdd = toggleFavoriteCityId('tp-ho-chi-minh')
    expect(afterAdd).toContain('tp-ho-chi-minh')
    expect(getFavoriteCityIds()).toContain('tp-ho-chi-minh')

    const afterRemove = toggleFavoriteCityId('tp-ho-chi-minh')
    expect(afterRemove).not.toContain('tp-ho-chi-minh')
    expect(getFavoriteCityIds()).not.toContain('tp-ho-chi-minh')
  })

  it('handles invalid json gracefully', () => {
    localStorage.setItem('weather_vn_favorite_city_ids', 'invalid-json{{{')
    expect(getFavoriteCityIds()).toEqual([])
  })
})
