type callBack = (time: number) => void

/**
 * 短信倒计时锁
 */
class SmsLock {
  // 计时器
  timer: number | null = null

  // 倒计时默认60秒
  lockTime: number = 60

  // 锁标记名称
  lockName: string = ''

  // 回调方法
  callBack: callBack

  /**
   * 实例化构造方法
   * @param purpose 唯一标识
   * @param lockTime
   * @param fn
   */
  constructor(purpose: string, lockTime = 60, fn: callBack) {
    this.lockTime = lockTime

    this.lockName = `SMSLOCK_${purpose}`

    this.callBack = fn

    this.compute()
  }

  // 开始计时
  start() {
    // 设置本地缓存
    localStorage.setItem(this.lockName, `${this.getCurrentTime() + this.lockTime}`)

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
  getCurrentTime(): number {
    return Math.floor(new Date().getTime() / 1000)
  }

  // 获取过期时间
  getExpireTime(): any {
    return localStorage.getItem(this.lockName)
  }

  // 清除计时器
  clear() {
    this.timer && clearTimeout(this.timer)
  }
}

export default SmsLock
