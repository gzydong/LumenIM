import { LRUCache } from 'lru-cache'

// 定义回调函数类型
type WsCallback = (payload: any, raw?: string) => void

// 消息事件类型
interface WebSocketEvents {
  onOpen: (evt: Event) => void
  onClose: (evt: CloseEvent) => void
  onError: (evt: Event) => void
}

const cache = new LRUCache<string, boolean>({
  max: 10000,
  ttl: 3 * 60 * 1000 // 过期时间，单位为毫秒
})

const maxAttempts = 100

const defaultEvent: WebSocketEvents = {
  onError: (evt: Event) => console.error('WebSocket Error:', evt),
  onOpen: (evt: Event) => console.log('WebSocket Opened:', evt),
  onClose: (evt: CloseEvent) => console.log('WebSocket Closed:', evt)
}

class WsSocket {
  connect: WebSocket | null = null

  config: {
    heartbeat: {
      setInterval: NodeJS.Timeout | null
      pingInterval: number
      pingTimeout: number
    }
    reconnect: {
      lockReconnect: boolean
      setTimeout: NodeJS.Timeout | null
      interval: number[]
      attempts: number
    }
  } = {
    heartbeat: {
      setInterval: null,
      pingInterval: 20000,
      pingTimeout: 60000
    },
    reconnect: {
      lockReconnect: false,
      setTimeout: null,
      interval: [2000, 2500, 3000, 3000, 5000, 8000], // Exponential backoff
      attempts: maxAttempts
    }
  }

  lastTime: number = 0

  onCallBacks: Record<string, WsCallback> = {}

  defaultEvent: WebSocketEvents = defaultEvent

  constructor(
    private urlCallBack: () => string,
    private events: Partial<WebSocketEvents>
  ) {
    this.events = { ...this.defaultEvent, ...events }
  }

  /**
   * 绑定自定义事件回调
   */
  on(event: string, callback: WsCallback): this {
    this.onCallBacks[event] = callback
    return this
  }

  /**
   * 初始化 WebSocket 实例
   */
  loadSocket(): void {
    this.connect = new WebSocket(this.urlCallBack())
    // this.connect.binaryType = 'arraybuffer'
    this.connect.onerror = this.onError.bind(this)
    this.connect.onopen = this.onOpen.bind(this)
    this.connect.onmessage = this.onMessage.bind(this)
    this.connect.onclose = this.onClose.bind(this)
  }

  /**
   * 建立连接
   */
  connection(): void {
    if (this.connect === null) {
      this.loadSocket()
    }
  }

  /**
   * 重连逻辑
   */
  reconnect(): void {
    if (this.config.reconnect.lockReconnect || this.config.reconnect.attempts <= 0) return

    this.config.reconnect.lockReconnect = true
    this.config.reconnect.attempts--

    const delay = this.config.reconnect.interval.shift()

    this.config.reconnect.setTimeout = setTimeout(() => {
      console.log(new Date().toLocaleString(), 'Attempting to reconnect to WebSocket...')
      this.connection()
    }, delay || 10000)
  }

  /**
   * 解析消息
   */
  onParse(evt: MessageEvent): any {
    return JSON.parse(evt.data)
  }

  /**
   * WebSocket 打开事件处理
   */
  onOpen(evt: Event): void {
    this.lastTime = Date.now()

    this.events.onOpen?.(evt)

    this.config.reconnect.interval = [1000, 1000, 3000, 5000, 10000]
    this.config.reconnect.lockReconnect = false
    this.config.reconnect.attempts = maxAttempts

    this.heartbeat()
  }

  /**
   * WebSocket 关闭事件处理
   */
  onClose(evt: CloseEvent): void {
    this.events.onClose?.(evt)
    this.connect = null

    if (this.config.heartbeat.setInterval) {
      clearInterval(this.config.heartbeat.setInterval)
    }

    this.config.reconnect.lockReconnect = false

    if (evt.code !== 1000) {
      this.reconnect()
    }
  }

  /**
   * WebSocket 错误事件处理
   */
  onError(evt: Event): void {
    this.events.onError?.(evt)
  }

  /**
   * 接收消息处理
   */
  onMessage(evt: MessageEvent): void {
    this.lastTime = Date.now()

    const data = this.onParse(evt)

    if (data.event === 'pong') {
      return
    }

    if (data.ackid) {
      this.connect?.send(`{"event":"ack","ackid":"${data.ackid}"}`)

      if (cache.has(data.ackid)) return

      cache.set(data.ackid, true)
    }

    if (this.onCallBacks[data.event]) {
      this.onCallBacks[data.event](data.payload, evt.data)
    } else {
      console.warn(`WsSocket message event [${data.event}] not bound...`)
    }
  }

  /**
   * 心跳机制
   */
  heartbeat(): void {
    if (this.config.heartbeat.setInterval) {
      clearInterval(this.config.heartbeat.setInterval)
    }

    this.config.heartbeat.setInterval = setInterval(() => {
      this.ping()
    }, this.config.heartbeat.pingInterval)
  }

  /**
   * 发送心跳包
   */
  ping(): void {
    this.connect?.send(JSON.stringify({ event: 'ping' }))
  }

  /**
   * 发送数据
   */
  send(message: any): void {
    if (this.connect && this.connect.readyState === WebSocket.OPEN) {
      this.connect.send(typeof message === 'string' ? message : JSON.stringify(message))
    } else {
      alert('WebSocket 连接已关闭')
    }
  }

  /**
   * 主动关闭连接
   */
  close(): void {
    this.connect?.close()
    if (this.config.heartbeat.setInterval) {
      clearInterval(this.config.heartbeat.setInterval)
    }
  }

  /**
   * 发送自定义事件
   */
  emit(event: string, payload: any): void {
    if (this.connect && this.connect.readyState === WebSocket.OPEN) {
      this.connect.send(JSON.stringify({ event, payload }))
    } else {
      console.error('WebSocket connection closed...', this.connect)
    }
  }
}

export default WsSocket
