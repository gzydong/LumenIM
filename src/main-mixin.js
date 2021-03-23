import SocketInstance from './socket-instance';
import {
    ServeGetUserSetting
} from "@/api/user";

export default {
    data() {
        return {
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
            SocketInstance.connect();
            this.loadUserSetting();
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