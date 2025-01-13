import { LRUCache } from 'lru-cache'

// @ts-ignore
const cache = new LRUCache<string, boolean>({
  max: 10000,
  ttl: 3 * 60 * 1000 // 过期时间，单位为毫秒
})

const maxAttempts = 100

const defaultEvent = {
  onError: (evt: any) => console.error('WebSocket Error:', evt),
  onOpen: (evt: any) => console.log('WebSocket Opened:', evt),
  onClose: (evt: any) => console.log('WebSocket Closed:', evt)
}

class WsSocket {
  connect: WebSocket | null = null

  config: any = {
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

  onCallBacks: Record<string, Function> = {}

  defaultEvent: Record<string, Function> = defaultEvent

  constructor(
    private urlCallBack: () => string,
    private events: Partial<typeof defaultEvent>
  ) {
    this.events = { ...this.defaultEvent, ...events }
  }

  on(event: string, callback: Function): this {
    this.onCallBacks[event] = callback
    return this
  }

  loadSocket(): void {
    this.connect = new WebSocket(this.urlCallBack())
    this.connect.onerror = this.onError.bind(this)
    this.connect.onopen = this.onOpen.bind(this)
    this.connect.onmessage = this.onMessage.bind(this)
    this.connect.onclose = this.onClose.bind(this)
  }

  connection(): void {
    this.connect === null && this.loadSocket()
  }

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

  onParse(evt: MessageEvent): any {
    return JSON.parse(evt.data)
  }

  onOpen(evt: Event): void {
    this.lastTime = Date.now()

    this.events.onOpen?.(evt)

    this.config.reconnect.interval = [1000, 1000, 3000, 5000, 10000]
    this.config.reconnect.lockReconnect = false
    this.config.reconnect.attempts = maxAttempts

    this.heartbeat()
  }

  onClose(evt: CloseEvent): void {
    this.events.onClose?.(evt)
    this.connect = null

    this.config.heartbeat.setInterval && clearInterval(this.config.heartbeat.setInterval)

    this.config.reconnect.lockReconnect = false

    if (evt.code !== 1000) {
      this.reconnect()
    }
  }

  onError(evt: Event): void {
    this.events.onError?.(evt)
  }

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

  heartbeat(): void {
    this.config.heartbeat.setInterval && clearInterval(this.config.heartbeat.setInterval)

    this.config.heartbeat.setInterval = setInterval(() => {
      this.ping()
    }, this.config.heartbeat.pingInterval)
  }

  ping(): void {
    this.connect?.send(JSON.stringify({ event: 'ping' }))
  }

  send(message: any): void {
    if (this.connect && this.connect.readyState === WebSocket.OPEN) {
      this.connect.send(typeof message === 'string' ? message : JSON.stringify(message))
    } else {
      alert('WebSocket 连接已关闭')
    }
  }

  close(): void {
    this.connect?.close()
    this.config.heartbeat.setInterval && clearInterval(this.config.heartbeat.setInterval)
  }

  emit(event: string, payload: any): void {
    if (this.connect && this.connect.readyState === WebSocket.OPEN) {
      this.connect.send(JSON.stringify({ event, payload }))
    } else {
      console.error('WebSocket connection closed...', this.connect)
    }
  }
}

export default WsSocket
