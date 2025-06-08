class EventBus {
  private channels: { [key: string]: ((data: any) => void)[] } = {}

  // 订阅方法：允许回调函数接收参数
  subscribe(channel: string, callback?: (data: any) => void): void {
    if (!this.channels[channel]) {
      this.channels[channel] = []
    }

    if (callback) {
      this.channels[channel].push(callback)
    }
  }

  // 发布方法：传递数据给所有订阅者
  emit(channel: string, data: any): void {
    if (!this.channels[channel]) return

    this.channels[channel].forEach((callback: (data: any) => void) => {
      callback(data)
    })
  }

  // 取消订阅
  unsubscribe(channel: string, callback: (data: any) => void): void {
    if (!this.channels[channel]) return

    this.channels[channel] = this.channels[channel].filter(
      (item: (data: any) => void) => item !== callback
    )
  }
}

export default EventBus
