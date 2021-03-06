// 加载配置信息
import config from '@/config/config';

// 全局引入自定义的 WebSocket 插件
import WsSocket from '@/plugins/socket/ws-socket';

// 引入消息处理类
import TalkEvent from '@/plugins/socket/event/talk-event';
import RevokeEvent from '@/plugins/socket/event/revoke-event';
import LoginEvent from '@/plugins/socket/event/login-event';
import KeyboardEvent from '@/plugins/socket/event/keyboard-event';
import GroupJoinEvent from '@/plugins/socket/event/group-join-event';
import FriendApplyEvent from '@/plugins/socket/event/friend-apply-event';

import {
    ServeGetUserSetting
} from "@/api/user";

import {
    getToken
} from '@/utils/auth';


// 预留
window.addEventListener('blur', () => {
    // document.title = "亲，欢迎你回来"
});
window.addEventListener('focus', () => {
    // document.title = "小伙不要走，我要和你对决"
});

export default {
    data() {
        return {
            // WsSocket对象 
            socket: null,

            //当前正在对话的用户数据
            message: {
                avatar: '',
                source: 0,
                receiveId: 0,
                records: [],
                index_name: '',
            },
        }
    },
    created() {
        // 判断用户是否登录
        if (this.$store.getters.loginStatus) {
            this.initialize();
        }
    },
    methods: {
        // 页面初始化设置
        initialize() {
            this.loadWebsocket();
            this.loadUserSetting();
        },

        // 连接websocket服务器
        loadWebsocket() {
            const store = this.$store;
            const url = `${config.ws_url}?token=` + getToken();

            // 实例化
            let socket = new WsSocket(url, {
                onError: (evt) => {
                    console.log('Websocket 连接失败回调方法')
                },
                // Websocket 连接成功回调方法
                onOpen: (evt) => {
                    store.commit('UPDATE_SOCKET_STATUS', true);
                },
                // Websocket 断开连接回调方法
                onClose: (evt) => {
                    store.commit('UPDATE_SOCKET_STATUS', false);
                },
            });

            // 绑定接收的事件
            socket.on('event_talk', (data) => {
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

            // 连接服务
            socket.connection();
            this.socket = socket;
        },

        // 更新当前正在对话的用户数据
        updateMessage(source, receive_id, avatar = '') {
            this.message.source = parseInt(source);
            this.message.receiveId = parseInt(receive_id);
            this.message.avatar = avatar;
            this.message.records = [];
            this.message.index_name = source + '_' + receive_id;
        },

        // 加载用户相关设置信息，更新本地缓存
        loadUserSetting() {
            ServeGetUserSetting().then(res => {
                if (res.code == 200) {
                    const {
                        user_info
                    } = res.data;

                    this.$store.commit('UPDATE_USER_INFO', {
                        uid: user_info.uid,
                        nickname: user_info.nickname,
                        sex: user_info.gender,
                        signature: user_info.motto,
                        avatar: user_info.avatar
                    });
                }
            });
        },

        // 跳转到指定好友对话页
        dumpTalkPage(index_name) {
            sessionStorage.setItem("send_message_index_name", index_name);

            if (this.$route.path == '/message') {
                this.$root.$children[0].refreshView();
                return;
            }

            this.$router.push('/message');
        }
    }
}