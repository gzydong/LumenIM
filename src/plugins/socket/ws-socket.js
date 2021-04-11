class WsSocket {
  /**
   * Websocket 连接
   *
   * @var Websocket
   */
  connect

  /**
   * 服务器连接地址
   */
  url

  /**
   * 配置信息
   *
   * @var Object
   */
  config = {
    heartbeat: {
      enabled: true, // 是否发送心跳包
      time: 10000, // 心跳包发送间隔时长
      setInterval: null, // 心跳包计时器
    },
    reconnect: {
      lockReconnect: false,
      setTimeout: null, // 计时器对象
      time: 5000, // 重连间隔时间
      number: 50, // 重连次数
    },
  }

  /**
   * 自定义绑定消息事件
   *
   * @var Array
   */
  onCallBacks = []

  /**
   * 创建 WsSocket 的实例
   *
   * @param {Function} urlCallBack url闭包函数
   * @param {Object} events 原生 WebSocket 绑定事件
   */
  constructor(urlCallBack, events) {
    this.urlCallBack = urlCallBack

    // 定义 WebSocket 原生方法
    this.events = Object.assign(
      {
        onError: evt => {},
        onOpen: evt => {},
        onClose: evt => {},
      },
      events
    )
  }

  /**
   * 事件绑定
   *
   * @param {String} event 事件名
   * @param {Function} callBack 回调方法
   */
  on(event, callBack) {
    this.onCallBacks[event] = callBack
    return this
  }

  /**
   * 加载 WebSocket
   */
  loadSocket() {
    // 判断当前是否已经连接
    if (this.connect != null) {
      this.connect.close()
      this.connect = null
    }

    this.url = this.urlCallBack()
    const connect = new WebSocket(this.url)
    connect.onerror = this.onError.bind(this)
    connect.onopen = this.onOpen.bind(this)
    connect.onmessage = this.onMessage.bind(this)
    connect.onclose = this.onClose.bind(this)

    this.connect = connect
  }

  /**
   * 连接 Websocket
   */
  connection() {
    this.loadSocket()
  }

  /**
   * 掉线重连 Websocket
   */
  reconnect() {
    let reconnect = this.config.reconnect
    if (reconnect.lockReconnect || reconnect.number == 0) {
      return
    }

    this.config.reconnect.lockReconnect = true

    // 没连接上会一直重连，设置延迟避免请求过多
    reconnect.setTimeout && clearTimeout(reconnect.setTimeout)

    this.config.reconnect.setTimeout = setTimeout(() => {
      this.connection()

      this.config.reconnect.lockReconnect = false
      this.config.reconnect.number--

      console.log(
        `网络连接已断开，正在尝试重新连接(${this.config.reconnect.number})...`
      )
    }, reconnect.time)
  }

  /**
   * 解析接受的消息
   *
   * @param {Object} evt Websocket 消息
   */
  onParse(evt) {
    let [eventType, message] = JSON.parse(evt.data)

    return {
      event: eventType,
      data: message,
      orginData: evt.data,
    }
  }

  /**
   * 打开连接
   *
   * @param {Object} evt Websocket 消息
   */
  onOpen(evt) {
    this.events.onOpen(evt)

    if (this.config.heartbeat.enabled) {
      this.heartbeat()
    }
  }

  /**
   * 关闭连接
   *
   * @param {Object} evt Websocket 消息
   */
  onClose(evt) {
    if (this.config.heartbeat.enabled) {
      clearInterval(this.config.heartbeat.setInterval)
    }

    if (evt.code == 1006) {
      this.reconnect()
    }

    this.events.onClose(evt)
  }

  /**
   * 连接错误
   *
   * @param {Object} evt Websocket 消息
   */
  onError(evt) {
    this.events.onError(evt)
  }

  /**
   * 接收消息
   *
   * @param {Object} evt Websocket 消息
   */
  onMessage(evt) {
    let result = this.onParse(evt)

    // 判断消息事件是否被绑定
    if (this.onCallBacks.hasOwnProperty(result.event)) {
      this.onCallBacks[result.event](result.data, result.orginData)
    } else {
      console.warn(`WsSocket 消息事件[${result.event}]未绑定...`)
    }
  }

  /**
   * WebSocket心跳检测
   */
  heartbeat() {
    this.config.heartbeat.setInterval = setInterval(() => {
      this.connect.send('PING')
    }, this.config.heartbeat.time)
  }

  /**
   * 聊天发送数据
   *
   * @param {Object} mesage
   */
  send(mesage) {
    this.connect.send(JSON.stringify(mesage))
  }

  /**
   * 推送消息
   *
   * @param {String} event 事件名
   * @param {Object} data 数据
   */
  emit(event, data) {
    if (this.connect && this.connect.readyState === 1) {
      this.connect.send(
        JSON.stringify({
          event,
          data,
        })
      )
    } else {
      console.error('WebSocket 连接已关闭...', this.connect)
    }
  }
}

export default WsSocket
