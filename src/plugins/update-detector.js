// 页面更新检测器 - 检测指定JS文件路径变更
export class JsUpdateDetector {
  constructor(options = {}) {
    // 配置参数，指定需要检测的JS路径
    this.options = {
      checkInterval: 300000, // 默认5分钟检测一次
      jsSelector: 'script[src^="/assets/index-"]', // 匹配资产目录下的index开头JS
      ...options
    }

    // 存储初始的JS路径
    this.initialJsSrc = null

    // 初始化检测
    this.init()
  }

  // 初始化，获取初始JS路径
  init() {
    try {
      // 获取初始页面中的目标JS元素
      const jsElement = document.querySelector(this.options.jsSelector)
      if (jsElement) {
        this.initialJsSrc = jsElement.src
        console.log('初始JS路径:', this.initialJsSrc)

        // 开始定期检测
        this.startChecking()
      } else {
        console.error('未找到目标JS文件，无法初始化更新检测')
      }
    } catch (error) {
      console.error('初始化更新检测失败:', error)
    }
  }

  // 开始定期检测
  startChecking() {
    this.intervalId = setInterval(() => this.checkForUpdates(), this.options.checkInterval)
  }

  // 检查JS路径是否有更新
  async checkForUpdates() {
    try {
      // 获取当前页面的HTML内容
      const response = await fetch(window.location.href, {
        method: 'GET',
        cache: 'no-store'
      })

      const html = await response.text()
      // 创建临时DOM解析器
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      // 从最新HTML中查找目标JS路径
      const jsElement = doc.querySelector(this.options.jsSelector)
      if (!jsElement) {
        console.warn('未在最新页面中找到目标JS文件')
        return
      }

      const currentJsSrc = jsElement.src

      // 比较JS路径是否有变化
      if (this.initialJsSrc && currentJsSrc && this.initialJsSrc !== currentJsSrc) {
        this.handleUpdateDetected()
      }
    } catch (error) {
      console.error('检查更新失败:', error)
    }
  }

  // 处理检测到更新的情况
  handleUpdateDetected() {
    // 显示提示，询问用户是否刷新页面
    const shouldReload = confirm('检测到页面有更新，是否立即刷新以获取最新版本？')
    if (shouldReload) {
      // 强制刷新，忽略缓存
      window.location.reload(true)
    } else {
      console.log('用户选择稍后更新')
    }
  }

  // 停止检测
  stopChecking() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
}
