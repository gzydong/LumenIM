/**
 * WebSocket 连接类
 */
class WsSocket {
    constructor(sid,events) {
        this.wsConnect = null;

        this.events = Object.assign({
            onError:function(evt){},
            onOpen:function(evt){},
            onMessage:function(evt){},
            onClose:function(evt){},
        },events);

        this.config = {
            wsUrl: 'ws://47.105.180.123:9501/socket.io?sid=' + sid,
            heartbeat: {
                enabled: true,
                time: 10000,//连接后,定时发送,否则不段时间不通信会自动断连(时间长短一般是服务端指定的),
                setInterval: null,
            },
            reconnect:{
                lockReconnect:false,
                setTimeout:null,
                time:3000,//重连间隔时间
                number:20 //重连次数
            },
        }
    }

    //初始化连接
    initWebSocket() {
        if(this.wsConnect){
            this.wsConnect.close()
        }
        
        let _this = this, ws = new WebSocket(this.config.wsUrl);
        ws.onerror = function (evt) {
            console.log('error',evt);
            _this.events.onError(evt);
        };

        ws.onopen = function (evt) {  //绑定连接事件
            console.log('onopen',evt);
            if (_this.config.heartbeat.enabled) {
                _this.heartbeat();
            }

            _this.events.onOpen(evt);
        };

        ws.onmessage = function (evt) {//绑定收到消息事件
            let [eventType, message] = JSON.parse(evt.data.substr(2));

            _this.events.onMessage(evt,eventType,message);
        };

        ws.onclose = function (evt) { //绑定关闭或断开连接事件
            console.log('关闭回调参数',evt)

            if (_this.config.heartbeat.enabled) {
                clearInterval(_this.config.heartbeat.setInterval);
            }

            if(evt.code == 1006){
                _this.reconnect();
            }else if(evt.code == 4030){
                alert('您的账号在其他设备登录，如果这不是您的操作，请及时修改您的登录密码');
            }

            _this.events.onClose(evt);
        };

        this.wsConnect = ws;
    }

    reconnect() {//重新连接
        let _this = this;
        if(_this.config.reconnect.lockReconnect || _this.config.reconnect.number == 0) {
            return;
        };

        _this.config.reconnect.lockReconnect = true;

        //没连接上会一直重连，设置延迟避免请求过多
        _this.config.reconnect.setTimeout && clearTimeout(_this.config.reconnect.setTimeout);

        _this.config.reconnect.setTimeout = setTimeout(function () {
            //新连接
            _this.initWebSocket();

            _this.config.reconnect.lockReconnect = false;

            _this.config.reconnect.number--;
            
            let number = _this.config.reconnect.number;
            console.log(`正在尝试重新连接(${number}S)...`);
        },_this.config.reconnect.time);
    };

    heartbeat() {
        let _this = this;
        _this.config.heartbeat.setInterval = setInterval(function () {
            _this.wsConnect.send('heartbeat');
        }, _this.config.heartbeat.time);
    }
}

export default WsSocket;