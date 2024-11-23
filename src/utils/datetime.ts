/**
 * 时间格式化方法
 *
 * @param {(Object|string|number)} time
 * @param {String} cFormat
 * @returns {String | null}
 */
export function parseTime(time, cFormat = '{y}-{m}-{d} {h}:{i}:{s}') {
  if (arguments.length === 0) {
    return null
  }

  let date
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'

  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }

    date = new Date(time.replace(/-/g, '/'))
  }

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }

  const time_str = format.replace(/{([ymdhisa])+}/g, (_, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }

    return value.toString().padStart(2, '0')
  })

  return time_str
}

/**
 * 人性化显示时间
 *
 * @param {Object} datetime
 */
export function beautifyTime(datetime = '') {
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
    return parseTime(outTime, '{y}/{m}/{d}')
  }

  if (time.getFullYear() != outTime.getFullYear()) {
    return parseTime(outTime, '{y}/{m}/{d}')
  }

  if (time.getMonth() != outTime.getMonth()) {
    return parseTime(outTime, '{m}/{d}')
  }

  if (time.getDate() != outTime.getDate()) {
    const day = outTime.getDate() - time.getDate()
    if (day == -1) {
      return parseTime(outTime, '昨天 {h}:{i}')
    }

    if (day == -2) {
      return parseTime(outTime, '前天 {h}:{i}')
    }

    return parseTime(outTime, '{m}-{d}')
  }

  if (time.getHours() != outTime.getHours()) {
    return parseTime(outTime, '{h}:{i}')
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
