export function countDownTime(second = 0) {
  // 小于10 加0 处理
  function formate0to9(arg) {
    return arg < 10 ? `0${arg}` : arg
  }

  const hours = parseInt((second / 60 / 60) % 24, 10) //剩余的小时
  const minutes = parseInt((second / 60) % 60, 10) //剩余的分钟
  const seconds = parseInt(second % 60, 10) //剩余的秒数

  return `${formate0to9(hours)}:${formate0to9(minutes)}:${formate0to9(seconds)}`
}
