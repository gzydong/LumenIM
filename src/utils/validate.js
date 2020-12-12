export default {
  /* 合法url*/
  validateURL(str) {
    const reg =
      /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return reg.test(str);
  },

  /* 小写字母*/
  validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
  },

  /* 大写字母*/
  validateUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
  },

  /* 大小写字母*/
  validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
  },

  /* 验证手机号*/
  validatPhone(str) {
    const reg = /^1[3456789]\d{9}$/;
    return reg.test(str);
  },

  /* 验证密码格式*/
  validatPassword(str) {
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
    return reg.test(str);
  },


}


/**
 * 检测是否是字邮箱地址
 * 
 * @param {*} s 
 */
export const isEmail = (s) => {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
* 检测是否是手机号
* 
* @param {*} s 
*/
export const isMobile = (s) => {
  return /^1[0-9]{10}$/.test(s)
}

/**
* 检测是否为url
* 
* @param {*} s 
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