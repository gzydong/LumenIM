export default {
  /* 合法uri*/
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
