import dayjs from 'dayjs'

// 时间格式化方法
export function formatTime(time: number | string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(time).format(format)
}

// 当前时间
export function datetime(): string {
  return dayjs().format('YYYY-MM-DD HH:mm')
}

/**
 * 人性化显示时间
 *
 * @param {Object} datetime
 */
export function beautifyTime(datetime: string = ''): string {
  if (datetime == null) {
    return ''
  }

  datetime = datetime.replace(/-/g, '/')

  const time = new Date()
  let outTime = new Date(datetime)
  if (/^[1-9]\d*$/.test(datetime)) {
    outTime = new Date(parseInt(datetime) * 1000)
  }

  if (time.getTime() < outTime.getTime()) {
    return formatTime(outTime, 'YYYY/MM/DD')
  }

  if (time.getFullYear() != outTime.getFullYear()) {
    return formatTime(outTime, 'YYYY/MM/DD')
  }

  if (time.getMonth() != outTime.getMonth()) {
    return formatTime(outTime, 'MM/DD')
  }

  if (time.getDate() != outTime.getDate()) {
    const day = outTime.getDate() - time.getDate()
    if (day == -1) {
      return formatTime(outTime, '昨天 HH:mm')
    }

    if (day == -2) {
      return formatTime(outTime, '前天 HH:mm')
    }

    return formatTime(outTime, 'MM/DD')
  }

  if (time.getHours() != outTime.getHours()) {
    return formatTime(outTime, 'HH:mm')
  }

  let minutes = outTime.getMinutes() - time.getMinutes()
  if (minutes == 0) {
    return '刚刚'
  }

  minutes = Math.abs(minutes)
  return `${minutes}分钟前`
}

export function humanizeTime(timestamp: number): string {
  const now = new Date()
  const messageDate = new Date(timestamp)

  const seconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  // 检查是否是同一天
  const isSameDay =
    now.getFullYear() === messageDate.getFullYear() &&
    now.getMonth() === messageDate.getMonth() &&
    now.getDate() === messageDate.getDate()

  // 检查是否是同一年
  const isSameYear = now.getFullYear() === messageDate.getFullYear()

  if (seconds < 60) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (isSameDay) {
    // 同一天
    const hour = messageDate.getHours().toString().padStart(2, '0')
    const minute = messageDate.getMinutes().toString().padStart(2, '0')
    return `${hour}:${minute}`
  } else if (days <= 1) {
    // 昨天
    const hour = messageDate.getHours().toString().padStart(2, '0')
    const minute = messageDate.getMinutes().toString().padStart(2, '0')
    return `昨天 ${hour}:${minute}`
  } else if (isSameYear) {
    // 同一年
    const month = (messageDate.getMonth() + 1).toString().padStart(2, '0')
    const day = messageDate.getDate().toString().padStart(2, '0')
    const hour = messageDate.getHours().toString().padStart(2, '0')
    const minute = messageDate.getMinutes().toString().padStart(2, '0')
    return `${month}/${day} ${hour}:${minute}`
  } else {
    // 剩余情况，显示具体日期和时间
    const year = messageDate.getFullYear()
    const month = (messageDate.getMonth() + 1).toString().padStart(2, '0')
    const day = messageDate.getDate().toString().padStart(2, '0')
    const hour = messageDate.getHours().toString().padStart(2, '0')
    const minute = messageDate.getMinutes().toString().padStart(2, '0')
    return `${year}/${month}/${day} ${hour}:${minute}`
  }
}
