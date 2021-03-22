import WsSocket from '@/plugins/socket/ws-socket';
import store from '@/store';

// 引入消息处理类
import TalkEvent from '@/plugins/socket/event/talk-event';
import RevokeEvent from '@/plugins/socket/event/revoke-event';
import LoginEvent from '@/plugins/socket/event/login-event';
import KeyboardEvent from '@/plugins/socket/event/keyboard-event';
import GroupJoinEvent from '@/plugins/socket/event/group-join-event';
import FriendApplyEvent from '@/plugins/socket/event/friend-apply-event';

/**
 * SocketInstance 连接实例(待完善)
 * 
 * 注释: 所有 WebSocket 消息接收处理在此实例中处理
 */
class SocketInstance {

    /**
     * WsSocket 实例
     * @class WsSocket
     */
    socket = null;

    // WebSocket 连接地址
    url = 'ws://47.105.180.123:9504/socket.io?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZWZhdWx0XzYwNTg5ODFjNzcxNTI4LjcyMDg0MzU0IiwiaWF0IjoxNjE2NDE4ODQ0LCJuYmYiOjE2MTY0MTg4NDQsImV4cCI6MTYxNjUwNTI0NCwidXNlcl9pZCI6MjA1NSwicGxhdGZvcm0iOiJ3ZWIiLCJqd3Rfc2NlbmUiOiJkZWZhdWx0In0.lHgkfYtAbIWTOG0xPztGEax9Z40DSUmuRDadyDliZVk';

    /**
     * SocketInstance 初始化实例
     */
    constructor() {
        this.socket = new WsSocket(this.url, {
            onError: (evt) => {
                console.log('Websocket 连接失败回调方法')
            },
            // Websocket 连接成功回调方法
            onOpen: (evt) => {
                this.updateSocketStatus(true);
            },
            // Websocket 断开连接回调方法
            onClose: (evt) => {
                this.updateSocketStatus(false);
            },
        });

        this.registerEvent()
    }

    connect() {
        this.socket.connection()
    }

    /**
     * 注册回调处理事件
     */
    registerEvent() {
        this.socket.on('event_talk', (data) => {
            (new TalkEvent(data)).handle();
        }).on('event_online_status', (data) => {
            (new LoginEvent(data)).handle();
        }).on('event_keyboard', (data) => {
            (new KeyboardEvent(data)).handle();
        }).on('event_revoke_talk', (data) => {
            (new RevokeEvent(data)).handle();
        }).on('event_friend_apply', (data) => {
            (new FriendApplyEvent(data)).handle();
        }).on('join_group', (data) => {
            (new GroupJoinEvent(data)).handle();
        });
    }

    /**
     * 更新 WebSocket 连接状态
     * 
     * @param {Boolean} status 连接状态
     */
    updateSocketStatus(status) {
        store.commit('UPDATE_SOCKET_STATUS', status);
    }

    /**
     * 推送消息
     * 
     * @param {String} event 事件名
     * @param {object} data 数据
     */
    emit(event, data) {
        this.socket.emit(event, data);
    }
}

export default new SocketInstance();