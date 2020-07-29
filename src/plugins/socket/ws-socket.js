/**
 * WebSocket 连接类
 */
class WsSocket {

  // WebSocket 对象
  wsConnect = null;

  // 配置信息
  config = {
    wsUrl: null,
    heartbeat: {
      enabled: true, //是否发送心跳包
      time: 10000, //心跳包发送间隔时长
      setInterval: null //心跳包计时器
    },
    reconnect: {
      lockReconnect: false,
      setTimeout: null, //计时器对象
      time: 3000, //重连间隔时间
      number: 50 //重连次数
    }
  }

  /**
   * WsSocket 实例化构造方法
   * 
   * @param {*} url socket url
   * @param {*} events 
   * @param {*} tokenCallback 获取token 回调方法
   */
  constructor(url, events, tokenCallback) {
    this.events = Object.assign({
      onError: function (evt) {},
      onOpen: function (evt) {},
      onMessage: function (evt) {},
      onClose: function (evt) {}
    }, events);

    this.tokenCallback = tokenCallback;

    this.config.wsUrl = url;
  }

  /**
   * 初始化连接
   */
  initWebSocket() {
    if (this.wsConnect) {
      this.wsConnect.close();
    }

    let that = this;
    this.wsConnect = new WebSocket(`${this.config.wsUrl}?token=${this.tokenCallback()}`);
    this.wsConnect.onerror = function (evt) {
      that.events.onError(evt);
    };

    this.wsConnect.onopen = function (evt) { //绑定连接事件
      if (that.config.heartbeat.enabled) {
        that.heartbeat();
      }

      that.events.onOpen(evt);
      console.log('Websocket connection succeeded...');
    };

    this.wsConnect.onmessage = function (evt) { //绑定收到消息事件
      let [eventType, message] = JSON.parse(evt.data);

      that.events.onMessage(evt, eventType, message);
    };

    this.wsConnect.onclose = function (evt) { //绑定关闭或断开连接事件
      if (that.config.heartbeat.enabled) {
        clearInterval(that.config.heartbeat.setInterval);
      }

      if (evt.code == 1006) {
        that.reconnect();
      }

      that.events.onClose(evt);
    };
  }

  /**
   * 断开重连方法
   */
  reconnect() {
    let that = this;
    if (that.config.reconnect.lockReconnect || that.config.reconnect.number == 0) {
      return;
    };

    that.config.reconnect.lockReconnect = true;

    //没连接上会一直重连，设置延迟避免请求过多
    that.config.reconnect.setTimeout && clearTimeout(that.config.reconnect.setTimeout);

    that.config.reconnect.setTimeout = setTimeout(function () {
      that.initWebSocket();

      that.config.reconnect.lockReconnect = false;

      that.config.reconnect.number--;

      let number = that.config.reconnect.number;
      console.log(`网络连接已断开，正在尝试重新连接(${number}S)...`);
    }, that.config.reconnect.time);
  };

  /**
   * WebSocket心跳检测
   */
  heartbeat() {
    let that = this;
    that.config.heartbeat.setInterval = setInterval(function () {
      that.wsConnect.send('heartbeat');
    }, that.config.heartbeat.time);
  }

  /**
   * 聊天发送数据
   * @param {Object} mesage
   */
  send(mesage) {
    this.wsConnect.send(JSON.stringify(mesage));
  }
}

export default WsSocket;
