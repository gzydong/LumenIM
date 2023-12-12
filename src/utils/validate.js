/**
 * 检测是否是字邮箱地址
 *
 * @param {String} value
 */
export const isEmail = (value) => {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value)
}

/**
 * 检测是否是手机号
 *
 * @param {String} value
 */
export const isMobile = (value) => {
  return /^1[0-9]{10}$/.test(value)
}

/**
 * 检测是否为url
 *
 * @param {String} value
 */
export const isURL = (value) => {
  return /^http[s]?:\/\/.*/.test(value)
}

/**
 * 检测是否为数字类型
 *
 * @param {*} value
 */
export const isNumber = (value) => {
  return Object.prototype.toString.call(value).slice(8, -1) === 'Number'
}

/**
 * 检测是否为 Booleanl 类型
 *
 * @param {*} value
 */
export const isBoolean = (value) => {
  return Object.prototype.toString.call(value).slice(8, -1) === 'Boolean'
}
