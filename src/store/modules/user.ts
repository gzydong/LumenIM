import { defineStore } from 'pinia'
import { toApi } from '@/api'
import { ServeGetUserSetting } from '@/api/user'
import { ServeFindFriendApplyNum } from '@/api/contact'
import { ServeGroupApplyUnread } from '@/api/group'
import * as auth from '@/utils/auth'
import { storage } from '@/utils'

interface IUserStoreState {
  uid: number
  nickname: string
  mobile: string
  email: string
  gender: number
  motto: string
  avatar: string
  online: boolean
  isQiye: boolean
  isContactApply: boolean
  isGroupApply: boolean
}

export const useUserStore = defineStore('user', {
  persist: true,
  state: (): IUserStoreState => {
    return {
      uid: 0, // 用户ID
      mobile: '',
      email: '',
      nickname: '', // 用户昵称
      gender: 0, // 性别
      motto: '', // 个性签名
      avatar: '',
      online: false, // 在线状态
      isQiye: false,
      isContactApply: false,
      isGroupApply: false
    }
  },
  getters: {},
  actions: {
    // 设置用户登录状态
    updateSocketStatus(status: boolean) {
      this.online = status
    },

    logoutLogin() {
      this.$reset()
      storage.remove('user_info')
      auth.deleteToken()
      location.reload()
    },

    loadSetting() {
      this.loadUserSetting()
      this.loadFriendApplyNum()
      this.loadGroupApplyUnread()
    },
    async loadUserSetting() {
      const { code, data } = await toApi(ServeGetUserSetting)
      if (code != 200) return

      this.nickname = data.user_info.nickname
      this.uid = data.user_info.uid
      this.avatar = data.user_info.avatar
      this.gender = data.user_info.gender
      this.mobile = data.user_info.mobile || ''
      this.email = data.user_info.email || ''
      this.motto = data.user_info.motto
      this.isQiye = data.user_info.is_qiye || false

      storage.set('user_info', data)
    },
    async loadFriendApplyNum() {
      const { code, data } = await toApi(ServeFindFriendApplyNum)

      if (code == 200) {
        this.isContactApply = data.unread_num > 0
      }
    },
    async loadGroupApplyUnread() {
      const { code, data } = await toApi(ServeGroupApplyUnread)

      if (code == 200) {
        this.isGroupApply = data.unread_num > 0
      }
    }
  }
})
