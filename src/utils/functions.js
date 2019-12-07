/** 公共方法类 */

/**
 * 格式化时间
 *
 * @param {Object} fmt
 * @param {Object} date
 */
export function dateFormat(fmt, date) {
  let ret;
  let opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };

  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };

  return fmt;
}

/**
 * 人性化时间显示
 *
 * @param {Object} datetime
 */
export function formateTime(datetime) {
  datetime = datetime.replace(/-/g, "/");

  //当前时间戳
  let time = new Date();
  let outTime = new Date(datetime);
  if (/^[1-9]\d*$/.test(datetime)) {
    outTime = new Date(parseInt(datetime) * 1000);
  }

  if (time.getTime() < outTime.getTime()) {
    return dateFormat("YYYY/mm/dd HH:MM", outTime);
  }

  if (time.getFullYear() != outTime.getFullYear()) {
    return dateFormat("YYYY/mm/dd HH:MM", outTime);
  }

  if (time.getMonth() != outTime.getMonth()) {
    return dateFormat("mm/dd HH:MM", outTime);
  }

  if (time.getDate() != outTime.getDate()) {
    let day = outTime.getDate() - time.getDate();
    if (day > 0) {
      return dateFormat("mm-dd HH:MM", outTime);
    }

    if (day == -1) {
      return dateFormat("昨天 HH:MM", outTime);
    }

    if (day == -2) {
      return dateFormat("前天 HH:MM", outTime);
    }

    return dateFormat("mm-dd HH:MM", outTime);
  }

  if (time.getHours() != outTime.getHours()) {
    return dateFormat("HH:MM", outTime);
  }

  let minutes = outTime.getMinutes() - time.getMinutes();
  if (minutes == 0) {
    return '刚刚';
  }

  minutes = Math.abs(minutes)
  return `${minutes}分钟前`;
}
