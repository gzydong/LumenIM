import { fetchContactApplyUnreadNum, fetchGroupApplyUnreadNum, fetchUserSetting } from '@/apis/api'
import { fetchApi } from '@/apis/request'
import { storage } from '@/utils'
import * as auth from '@/utils/auth.ts'
import { defineStore } from 'pinia'

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
      const [err, data] = await fetchApi(fetchUserSetting, {})
      if (err) return

      this.nickname = data.user_info.nickname
      this.uid = data.user_info.uid
      this.avatar = data.user_info.avatar
      this.gender = data.user_info.gender
      this.mobile = data.user_info.mobile || ''
      this.email = data.user_info.email || ''
      this.motto = data.user_info.motto
      this.isQiye = data.user_info.is_qiye

      storage.set('user_info', data)
    },
    async loadFriendApplyNum() {
      const [err, data] = await fetchApi(fetchContactApplyUnreadNum, {})

      if (!err) {
        this.isContactApply = data.num > 0
      }
    },
    async loadGroupApplyUnread() {
      const [err, data] = await fetchApi(fetchGroupApplyUnreadNum, {})

      if (!err) {
        this.isGroupApply = data.num > 0
      }
    }
  }
})
