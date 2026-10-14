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
 * Không phụ thuộc vào timezone của máy khách vì dữ liệu trả về từ Open-Meteo đã ở múi giờ Asia/Ho_Chi_Minh.
 */
export function formatCurrentUpdateTime(isoString: string): string {
  if (!isoString) return ''

  // Open-Meteo current.time trả về định dạng "YYYY-MM-DDTHH:mm"
  const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/)
  if (match) {
    const [, year, month, day, hours = '00', minutes = '00'] = match
    return `${hours}:${minutes} - ${day}/${month}/${year}`
  }

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
 * Định dạng thứ và ngày cho dự báo 7 ngày.
 * Tách trực tiếp ngày tháng từ chuỗi "YYYY-MM-DD" để tránh lỗi lệch 1 ngày khi Date() parse chuỗi ISO thành UTC.
 */
export function formatForecastDate(dateStr: string, index: number): {
  dayOfWeek: string
  dayOfMonth: string
} {
  const parts = dateStr.split('-')
  let dayOfWeek = ''
  let dayOfMonth = ''

  if (parts.length === 3) {
    const year = Number(parts[0])
    const month = Number(parts[1])
    const day = Number(parts[2])
    const dayPad = String(day).padStart(2, '0')
    const monthPad = String(month).padStart(2, '0')
    dayOfMonth = `${dayPad}/${monthPad}`

    // Khởi tạo Date theo constructor cục bộ để tính chính xác thứ trong tuần
    const date = new Date(year, month - 1, day)
    dayOfWeek = VIETNAMESE_DAYS[date.getDay()] || ''
  } else {
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    dayOfMonth = `${day}/${month}`
    dayOfWeek = VIETNAMESE_DAYS[date.getDay()] || ''
  }

  if (index === 0) {
    dayOfWeek = 'Hôm nay'
  } else if (index === 1) {
    dayOfWeek = 'Ngày mai'
  }

  return { dayOfWeek, dayOfMonth }
}
