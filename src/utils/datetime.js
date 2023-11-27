/**
 * 人性化时间显示
 *
 * @param {Object} datetime
 */
export function formatTime(datetime) {
  if (datetime == null) return ''

  datetime = datetime.replace(/-/g, '/')

  let time = new Date()
  let outTime = new Date(datetime)
  if (/^[1-9]\d*$/.test(datetime)) {
    outTime = new Date(parseInt(datetime) * 1000)
  }

  if (time.getTime() < outTime.getTime() || time.getFullYear() != outTime.getFullYear()) {
    return parseTime(outTime, '{y}/{m}/{d} {h}:{i}')
  }

  if (time.getMonth() != outTime.getMonth()) {
    return parseTime(outTime, '{m}/{d} {h}:{i}')
  }

  if (time.getDate() != outTime.getDate()) {
    let day = outTime.getDate() - time.getDate()
    if (day == -1) {
      return parseTime(outTime, '昨天 {h}:{i}')
    }

    if (day == -2) {
      return parseTime(outTime, '前天 {h}:{i}')
    }

    return parseTime(outTime, '{m}-{d} {h}:{i}')
  }

  let diff = time.getTime() - outTime.getTime()

  if (time.getHours() != outTime.getHours() || diff > 30 * 60 * 1000) {
    return parseTime(outTime, '{h}:{i}')
  }

  let minutes = outTime.getMinutes() - time.getMinutes()
  if (minutes == 0) {
    return '刚刚'
  }

  minutes = Math.abs(minutes)
  return `${minutes}分钟前`
}

/**
 * 时间格式化方法
 *
 * @param {(Object|string|number)} time
 * @param {String} cFormat
 * @returns {String | null}
 */
export function parseTime(time, cFormat) {
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

  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
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

  let time = new Date()
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
    let day = outTime.getDate() - time.getDate()
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
