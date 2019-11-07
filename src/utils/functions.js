/** 公共方法类 */

// 获得当前时间
export function getNowTime() {
  // 加0
  function time(num) {
    if (num < 10) {
      num = '0' + num
    }
    return num;
  }
  var myDate = new Date();
  myDate.getYear(); //获取当前年份(2位)
  myDate.getFullYear(); //获取完整的年份(4位,1970-????)
  myDate.getMonth(); //获取当前月份(0-11,0代表1月)
  myDate.getDate(); //获取当前日(1-31)
  myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
  myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
  myDate.getHours(); //获取当前小时数(0-23)
  myDate.getMinutes(); //获取当前分钟数(0-59)
  myDate.getSeconds(); //获取当前秒数(0-59)
  myDate.getMilliseconds(); //获取当前毫秒数(0-999)
  myDate.toLocaleDateString(); //获取当前日期
  var nowTime = myDate.getFullYear() + '-' + time(myDate.getMonth() + 1) + '-' + myDate.getDate() + ' ' + time(myDate.getHours()) + ':' + time(myDate.getMinutes()) + ':' + time(myDate.getSeconds());

  return nowTime;
}



export function formateTime(datetime) {
  let nowTime = getNowTime().substr(0, 10);
  let listTime = datetime.substr(0, 10);

  if (nowTime === listTime) {
    return datetime.substr(11, 5);
  } else {
    return datetime.substr(5, 5);
  }

}



export function trim(str){
   return str.replace(/(^\s*)|(\s*$)/g, "");
}


export function checkClient(){
  let ua = navigator.userAgent;
  let browser = {},
      weixin = ua.match(/MicroMessenger\/([^\s]+)/i),
      webkit = ua.match(/WebKit\/([\d.]+)/i),
      android = ua.match(/(Android)\s+([\d.]+)/i),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/i),
      ipod = ua.match(/(iPod).*OS\s([\d_]+)/i),
      iphone = !ipod && !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/i),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/i),
      touchpad = webos && ua.match(/TouchPad/i),
      kindle = ua.match(/Kindle\/([\d.]+)/i),
      silk = ua.match(/Silk\/([\d._]+)/i),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/i),
      mqqbrowser = ua.match(/MQQBrowser\/([\d.]+)/i),
      chrome = ua.match(/CriOS\/([\d.]+)/i),
      opera = ua.match(/Opera\/([\d.]+)/i),
      safari = ua.match(/Safari\/([\d.]+)/i);

      console.log(ua)
}
