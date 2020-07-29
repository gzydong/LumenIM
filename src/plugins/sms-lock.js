/**
 * 短信发送按钮锁
 */
class SmsLock {

  // 发送倒计时默认60秒
  time = null;

  // 计时器
  timer = null;

  // 倒计时默认60秒
  lockTime = 60;

  // 锁标记名称
  lockName = '';

  /**
   * 实例化构造方法
   * 
   * @param {string} purpose 名称唯一
   * @param {int} time
   */
  constructor(purpose, lockTime = 60) {
    this.lockTime = lockTime;
    this.lockName = `sms_lock_${purpose}`;
    this.init();
  }

  // 开始计时
  start(time = null) {
    if (time) {
      this.time = time >= this.lockTime ? this.lockTime : time;
    } else {
      this.time = this.lockTime;
    }

    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.time == 0) {
        clearInterval(this.timer);
        this.time = null;
        localStorage.removeItem(this.lockName);
        return false;
      }

      this.time--;

      // 设置本地缓存
      localStorage.setItem(this.lockName, this.getTime() + this.time);
    }, 1000);
  }

  // 页面刷新初始化
  init() {
    let result = localStorage.getItem(this.lockName); // 读取本地缓存
    if (result == null) return false;

    let t = result - this.getTime();
    if (t > 0) this.start(t);
  }

  getTime() {
    return Math.floor((new Date()).getTime() / 1000);
  }
}

export default SmsLock;
