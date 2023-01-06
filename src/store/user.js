import { defineStore } from 'pinia'
import { ServeGetUserSetting } from '@/api/user'
import { ServeFindFriendApplyNum } from '@/api/contacts'
import { delAccessToken } from '@/utils/auth'
import { storage } from '@/utils/storage'
import { defAvatar,defBanner } from '@/constant/default'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      uid: 0, // 用户ID
      nickname: '', // 用户昵称
      gender: 0, // 性别
      motto: '', // 个性签名
      avatar: defAvatar,
      banner: defBanner, // 名片背景
      online: false, // 在线状态
      isQiye: false,
      isContactApply: false,
    }
  },
  getters: {},
  actions: {
    // 设置用户登录状态
    updateSocketStatus(status) {
      this.online = status
    },

    logoutLogin() {
      storage.remove('user_info')
      delAccessToken()
      location.reload()
    },

    loadSetting() {
      ServeGetUserSetting().then(({ code, data }) => {
        if (code == 200) {
          this.nickname = data.user_info.nickname
          this.uid = data.user_info.uid
          this.avatar = data.user_info.avatar

          this.gender = data.user_info.gender
          this.mobile = data.user_info.mobile || ''
          this.email = data.user_info.email || ''
          this.motto = data.user_info.motto
          this.isQiye = data.user_info.is_qiye || false

          storage.set('user_info', data)
        }
      })

      ServeFindFriendApplyNum().then(({ code, data }) => {
        if (code == 200) {
          this.isContactApply = data.unread_num > 0
        }
      })
    },
  },
})
