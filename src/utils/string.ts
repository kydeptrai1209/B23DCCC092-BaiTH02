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

  // Chuẩn hóa loại bỏ dấu chấm, gạch nối và khoảng trắng dư thừa
  const cleanQuery = query.replace(/[.\-_]/g, '').replace(/\s+/g, '')

  const targets = [
    city.name,
    city.asciiName,
    city.region,
    `Miền ${city.region}`,
    ...city.aliases,
  ]

  return targets.some((target) => {
    const normalized = removeVietnameseTones(target)
    if (normalized.includes(query)) return true
    const cleanTarget = normalized.replace(/[.\-_]/g, '').replace(/\s+/g, '')
    if (cleanTarget.includes(cleanQuery)) return true
    return false
  })
}
