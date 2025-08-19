/**
 * 计算从开始日期到现在的已还期数
 * @param startDate 开始日期
 * @param totalInstallments 总分期数
 * @returns 已还期数
 */
export function calculatePaidInstallments(startDate: Date, totalInstallments: number): number {
  const now = new Date()
  const start = new Date(startDate)
  
  // 计算月份差
  const yearDiff = now.getFullYear() - start.getFullYear()
  const monthDiff = now.getMonth() - start.getMonth()
  const totalMonths = yearDiff * 12 + monthDiff
  
  // 如果当前日期在开始日期的同月或之后，且日期大于等于开始日期，则算作已还
  const dayDiff = now.getDate() - start.getDate()
  const adjustedMonths = dayDiff >= 0 ? totalMonths : totalMonths - 1
  
  // 确保已还期数不超过总分期数，且不为负数
  const paidInstallments = Math.max(0, Math.min(adjustedMonths, totalInstallments))
  
  return paidInstallments
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param date 日期
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 解析日期字符串为 Date 对象
 * @param dateString 日期字符串 (YYYY-MM-DD)
 * @returns Date 对象
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00')
}

/**
 * 获取当前日期字符串
 * @returns 当前日期字符串 (YYYY-MM-DD)
 */
export function getCurrentDateString(): string {
  return formatDate(new Date())
}

/**
 * 获取默认开始日期（当前日期往前推3个月）
 * @returns 默认开始日期
 */
export function getDefaultStartDate(): Date {
  const now = new Date()
  now.setMonth(now.getMonth() - 3)
  return now
}
