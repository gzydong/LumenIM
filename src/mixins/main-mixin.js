import SocketInstance from '@/im-server/socket-instance'
import { ServeGetUserSetting } from '@/api/user'

export default {
  created() {
    // 判断用户是否登录
    if (this.$store.getters.loginStatus) {
      this.initialize()
      this.$store.dispatch('LOAD_TALK_ITEMS')
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
  },
}
