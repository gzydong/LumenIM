import store from '@/store';
import config from '@/config/config';
import WsSocket from '@/plugins/socket/ws-socket';
import {
    getToken
} from '@/utils/auth';

// 引入消息处理类
import TalkEvent from '@/plugins/socket/event/talk-event';
import RevokeEvent from '@/plugins/socket/event/revoke-event';
import LoginEvent from '@/plugins/socket/event/login-event';
import KeyboardEvent from '@/plugins/socket/event/keyboard-event';
import GroupJoinEvent from '@/plugins/socket/event/group-join-event';
import FriendApplyEvent from '@/plugins/socket/event/friend-apply-event';

/**
 * SocketInstance 连接实例
 * 
 * 注释: 所有 WebSocket 消息接收处理在此实例中处理
 */
class SocketInstance {

    /**
     * WsSocket 实例
     */
    socket = null;

    /**
     * SocketInstance 初始化实例
     */
    constructor() {
        this.socket = new WsSocket(() => {
            return `${config.ws_url}?token=` + getToken();
        }, {
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
            urlCallBack: () => {
                return `${config.ws_url}?token=` + getToken();
            }
        });

        this.registerEvents()
    }

    // 连接 WebSocket 服务
    connect() {
        this.socket.connection()
    }

    /**
     * 注册回调消息处理事件
     */
    registerEvents() {
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
     * 聊天发送数据
     * 
     * @param {Object} mesage
     */
    send(mesage) {
        this.socket.send(mesage);
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