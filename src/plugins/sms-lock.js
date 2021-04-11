/**
 * 短信倒计时锁
 */
class SmsLock {
  // 发送倒计时默认60秒
  time = null

  // 计时器
  timer = null

  // 倒计时默认60秒
  lockTime = 60

  // 锁标记名称
  lockName = ''

  /**
   * 实例化构造方法
   *
   * @param {String} purpose 唯一标识
   * @param {Number} time
   */
  constructor(purpose, lockTime = 60) {
    this.lockTime = lockTime
    this.lockName = `SMSLOCK_${purpose}`

    this.init()
  }

  // 开始计时
  start(time = null) {
    this.time = time == null || time >= this.lockTime ? this.lockTime : time

    this.clearInterval()

    this.timer = setInterval(() => {
      if (this.time == 0) {
        this.clearInterval()
        this.time = null
        localStorage.removeItem(this.lockName)
        return
      }

      this.time--

      // 设置本地缓存
      localStorage.setItem(this.lockName, this.getTime() + this.time)
    }, 1000)
  }

  // 页面刷新初始化
  init() {
    let result = localStorage.getItem(this.lockName)

    if (result == null) return

    let time = result - this.getTime()
    if (time > 0) {
      this.start(time)
    } else {
      localStorage.removeItem(this.lockName)
    }
  }

  // 获取当前时间
  getTime() {
    return Math.floor(new Date().getTime() / 1000)
  }

  // 清除计时器
  clearInterval() {
    clearInterval(this.timer)
  }
}

export default SmsLock
