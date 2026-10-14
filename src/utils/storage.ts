const FAVORITES_STORAGE_KEY = 'weather_vn_favorite_city_ids'

export function getFavoriteCityIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveFavoriteCityIds(ids: string[]): void {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Gracefully handle storage errors
  }
}

export function toggleFavoriteCityId(id: string): string[] {
  const current = getFavoriteCityIds()
  const exists = current.includes(id)
  const updated = exists ? current.filter((item) => item !== id) : [...current, id]
  saveFavoriteCityIds(updated)
  return updated
}
