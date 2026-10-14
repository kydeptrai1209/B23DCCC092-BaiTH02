import type { City } from '../types/weather'

/**
 * Chuyển chuỗi tiếng Việt có dấu thành không dấu và chuẩn hóa chữ thường
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'))
    .toLowerCase()
    .trim()
}

/**
 * Kiểm tra xem một thành phố có khớp với từ khóa tìm kiếm (không phân biệt hoa thường và dấu tiếng Việt)
 */
export function matchCitySearch(city: City, rawQuery: string): boolean {
  const query = removeVietnameseTones(rawQuery)
  if (!query) return true

  const normalizedCityName = removeVietnameseTones(city.name)
  if (normalizedCityName.includes(query)) return true

  const normalizedAscii = removeVietnameseTones(city.asciiName)
  if (normalizedAscii.includes(query)) return true

  if (city.aliases.some((alias) => removeVietnameseTones(alias).includes(query))) {
    return true
  }

  return false
}
