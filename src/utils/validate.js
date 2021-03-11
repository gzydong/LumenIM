/**
 * 检测是否是字邮箱地址
 * 
 * @param {String} s 
 */
export const isEmail = (s) => {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
* 检测是否是手机号
* 
* @param {String} s 
*/
export const isMobile = (s) => {
  return /^1[0-9]{10}$/.test(s)
}

/**
* 检测是否为url
* 
* @param {String} s 
*/
export const isURL = (s) => {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
* 检测是否为数字类型
* 
* @param {*} o 
*/
export const isNumber = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Number'
}

/**
* 检测是否为 Booleanl 类型
* 
* @param {*} o 
*/
export const isBoolean = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Boolean'
}

/**
* 检测是非是微信浏览器
*/
export const isWeiXin = () => {
  let ua = navigator.userAgent.toLowerCase();
  return ua.match(/microMessenger/i) == 'micromessenger'
}