class EventBus {
  private channels = {}

  // 定义订阅方法
  subscribe(channel: string, callback: Function) {
    // 如果频道不存在，则创建一个新的频道
    if (!this.channels[channel]) {
      this.channels[channel] = []
    }

    // 将回调函数添加到频道的订阅者列表中
    this.channels[channel].push(callback)
  }

  // 定义发布方法
  emit(channel: string, data: any) {
    // 如果频道不存在，则直接返回
    if (!this.channels[channel]) {
      return
    }

    // 遍历频道的订阅者列表，并依次调用回调函数
    this.channels[channel].forEach((callback: Function) => {
      callback(data)
    })
  }

  unsubscribe(channel: string, callback: Function) {
    // 如果频道不存在，则创建一个新的频道
    if (!this.channels[channel]) {
      this.channels[channel] = []
    }

    for (const index in this.channels[channel]) {
      if (this.channels[channel][index] === callback) {
        this.channels[channel].splice(index, 1)
      }
    }
  }
}

export default EventBus

export const bus = new EventBus()
