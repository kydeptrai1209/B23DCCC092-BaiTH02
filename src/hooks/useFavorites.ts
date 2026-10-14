import { useState, useCallback } from 'react'
import { getFavoriteCityIds, saveFavoriteCityIds } from '../utils/storage'

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getFavoriteCityIds())

  const toggleFavorite = useCallback((cityId: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(cityId)
      const next = exists ? prev.filter((id) => id !== cityId) : [...prev, cityId]
      saveFavoriteCityIds(next)
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (cityId: string) => {
      return favoriteIds.includes(cityId)
    },
    [favoriteIds]
  )

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite,
  }
}
