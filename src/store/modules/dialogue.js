import { defineStore } from 'pinia'
import { ServeRemoveRecords, ServeRevokeRecords, ServePublishMessage } from '@/api/chat'
import { ServeGetGroupMembers } from '@/api/group'
import { toApi } from '@/api'
import { ServeCustomizeEmoticonCreate } from '@/api/emoticon'
import { useEditorStore } from './editor'

// 键盘消息事件定时器
let keyboardTimeout = null

export const useDialogueStore = defineStore('dialogue', {
  state: () => {
    return {
      // 对话索引（聊天对话的唯一索引）
      index_name: '',

      // 对话节点
      talk: {
        username: '',
        talk_mode: 0, // 对话来源[1:私聊;2:群聊]
        to_from_id: 0
      },

      // 好友是否正在输入文字
      keyboard: false,

      // 对方是否在线
      online: false,

      // 聊天记录
      records: [],

      // 新消息提示
      unreadBubble: 0,

      // 是否显示编辑器
      isShowEditor: false,

      // 是否显示会话列表
      isShowSessionMenu: true,

      // 群成员列表
      members: [],

      // 对话记录
      items: {
        '1_1': {
          talk_type: 1, // 对话类型
          receiver_id: 0, // 接收者ID
          read_sequence: 0, // 当前已读的最后一条记录
          records: []
        }
      },

      // 聊天面板的容器ID
      container: ''
    }
  },
  getters: {
    // 当前对话是否是群聊
    isGroupTalk: (state) => state.talk.talk_mode === 2
  },
  actions: {
    // 更新在线状态
    setOnlineStatus(status) {
      this.online = status
    },

    // 更新对话信息
    setDialogue(data = {}) {
      this.online = data.is_online === 1

      this.talk = {
        username: data.remark || data.name,
        talk_mode: data.talk_mode,
        to_from_id: data.to_from_id
      }

      this.index_name = `${data.talk_mode}_${data.to_from_id}`
      this.records = []
      this.unreadBubble = 0

      // 是机器人则不显示编辑器
      this.isShowEditor = data?.is_robot === 1 ? false : true

      this.members = []

      if (data.talk_mode == 2) {
        this.updateGroupMembers()
      }
    },

    // 更新提及列表
    async updateGroupMembers() {
      this.members = []
      const { code, data } = await toApi(ServeGetGroupMembers, {
        group_id: this.talk.to_from_id
      })

      if (code != 200) return

      this.members = data?.items.map((item) => ({
        id: item.user_id,
        nickname: item.nickname,
        avatar: item.avatar,
        gender: item.gender,
        leader: item.leader,
        remark: item.remark,
        online: false,
        value: item.nickname
      }))
    },

    // 清空对话记录
    clearDialogueRecord() {
      this.records = []
    },

    // 数组头部压入对话记录
    unshiftDialogueRecord(records) {
      this.records.unshift(...records)
    },

    // 推送对话记录
    addDialogueRecord(record) {
      // TOOD 需要通过 sequence 排序，保证消息一致性
      // this.records.splice(index, 0, record)

      this.records.push(record)
    },

    // 更新对话记录
    updateDialogueRecord(params) {
      const { msg_id = '' } = params

      const item = this.records.find((item) => item.msg_id === msg_id)

      item && Object.assign(item, params)
    },

    // 批量删除对话记录
    batchDelDialogueRecord(msgIds = []) {
      msgIds.forEach((msgid) => {
        const index = this.records.findIndex((item) => item.msg_id === msgid)

        if (index >= 0) this.records.splice(index, 1)
      })
    },

    // 自增好友键盘输入事件
    triggerKeyboard() {
      this.keyboard = true

      clearTimeout(keyboardTimeout)

      keyboardTimeout = setTimeout(() => (this.keyboard = false), 2000)
    },

    setUnreadBubble(value) {
      if (value === 0) {
        this.unreadBubble = 0
      } else {
        this.unreadBubble++
      }
    },

    // 删除聊天记录
    async ApiDeleteRecord(msgIds = []) {
      const { code, data } = await toApi(ServeRemoveRecords, {
        talk_mode: this.talk.talk_mode,
        to_from_id: this.talk.to_from_id,
        msg_ids: msgIds
      })

      code == 200 && this.batchDelDialogueRecord(msgIds)
    },

    // 撤销聊天记录
    async ApiRevokeRecord(msg_id = '') {
      const { code, data } = await toApi(ServeRevokeRecords, {
        talk_mode: this.talk.talk_mode,
        to_from_id: this.talk.to_from_id,
        msg_id
      })

      code == 200 && this.updateDialogueRecord({ msg_id, is_revoke: 1 })
    },

    // 转发聊天记录
    async ApiForwardRecord(params = {}) {
      const { code, data } = await toApi(ServePublishMessage, {
        type: 'forward',
        ...params
      })
    },

    async ApiCollectImage(params = {}) {
      const { code, data } = await toApi(ServeCustomizeEmoticonCreate, params)

      if (code === 200) {
        window['$message']?.success('收藏成功')
        useEditorStore().loadUserEmoticon()
      }
    }
  }
})
