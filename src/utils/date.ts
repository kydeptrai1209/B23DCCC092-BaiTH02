const VIETNAMESE_DAYS = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
]

/**
 * Định dạng thời gian cập nhật hiện tại theo kiểu Việt Nam: "HH:mm - DD/MM/YYYY"
 */
export function formatCurrentUpdateTime(isoString: string): string {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return isoString

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${hours}:${minutes} - ${day}/${month}/${year}`
}

/**
 * Định dạng thứ và ngày cho dự báo 7 ngày
 */
export function formatForecastDate(dateStr: string, index: number): {
  dayOfWeek: string
  dayOfMonth: string
} {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const dayOfMonth = `${day}/${month}`

  let dayOfWeek = VIETNAMESE_DAYS[date.getDay()]
  if (index === 0) {
    dayOfWeek = 'Hôm nay'
  } else if (index === 1) {
    dayOfWeek = 'Ngày mai'
  }

  return { dayOfWeek, dayOfMonth }
}
