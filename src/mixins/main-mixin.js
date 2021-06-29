import SocketInstance from '../socket-instance'
import { ServeGetUserSetting } from '@/api/user'

export default {
  created() {
    // 判断用户是否登录
    if (this.$store.getters.loginStatus) {
      this.initialize()
    }
  },
  methods: {
    // 页面初始化设置
    initialize() {
      SocketInstance.connect()
      this.loadUserSetting()
    },

    // 加载用户相关设置信息，更新本地缓存
    loadUserSetting() {
      ServeGetUserSetting().then(({ code, data }) => {
        if (code == 200) {
          const { user_info } = data

          this.$store.commit('UPDATE_USER_INFO', {
            uid: user_info.uid,
            nickname: user_info.nickname,
            sex: user_info.gender,
            signature: user_info.motto,
            avatar: user_info.avatar,
          })
        }
      })
    },

    reload() {
      this.$root.$children[0].refreshView()
    },

    // 跳转到指定好友对话页
    dumpTalkPage(index_name) {
      sessionStorage.setItem('send_message_index_name', index_name)

      if (this.$route.path == '/message') {
        this.reloadPage()
        return
      }

      this.$router.push('/message')
    },
  },
}
