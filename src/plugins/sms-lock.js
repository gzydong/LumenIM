/**
 * 短信倒计时锁
 */
class SmsLock {
  // 计时器
  timer = null

  // 倒计时默认60秒
  lockTime = 60

  // 锁标记名称
  lockName = ''

  // 回调方法
  callBack = () => {}

  /**
   * 实例化构造方法
   *
   * @param {String} purpose 唯一标识
   * @param {Number} time
   */
  constructor(purpose, lockTime = 60, fn = (time) => {}) {
    this.lockTime = lockTime

    this.lockName = `SMSLOCK_${purpose}`

    this.callBack = fn

    this.compute()
  }

  // 开始计时
  start() {
    // 设置本地缓存
    localStorage.setItem(this.lockName, this.getCurrentTime() + this.lockTime)

    this.compute()
  }

  compute() {
    this.clear()

    const time = this.getExpireTime()

    if (time === null) return

    if (time <= this.getCurrentTime()) {
      this.callBack(0)
      localStorage.removeItem(this.lockName)
      return
    }

    const t = time - this.getCurrentTime()

    this.callBack(t)

    this.timer = setTimeout(() => this.compute(), 1000)
  }

  // 获取当前时间
  getCurrentTime() {
    return Math.floor(new Date().getTime() / 1000)
  }

  // 获取过期时间
  getExpireTime() {
    return localStorage.getItem(this.lockName)
  }

  // 清除计时器
  clear() {
    clearTimeout(this.timer)
  }
}

export default SmsLock
