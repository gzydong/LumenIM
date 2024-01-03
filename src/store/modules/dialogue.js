import { defineStore } from 'pinia'
import {
  ServeRemoveRecords,
  ServeRevokeRecords,
  ServePublishMessage,
  ServeCollectEmoticon
} from '@/api/chat'
import { ServeGetGroupMembers } from '@/api/group'
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
        talk_type: 0, // 对话来源[1:私聊;2:群聊]
        receiver_id: 0
      },

      // 好友是否正在输入文字
      keyboard: false,

      // 对方是否在线
      online: false,

      // 聊天记录
      records: [],

      // 新消息提示
      unreadBubble: 0,

      // 是否开启多选操作模式
      isOpenMultiSelect: false,

      // 是否显示编辑器
      isShowEditor: false,

      // 是否显示会话列表
      isShowSessionList: true,

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
      }
    }
  },
  getters: {
    // 多选列表
    selectItems: (state) => state.records.filter((item) => item.isCheck),
    // 当前对话是否是群聊
    isGroupTalk: (state) => state.talk.talk_type === 2
  },
  actions: {
    // 更新在线状态
    setOnlineStatus(status) {
      this.online = status
    },

    // 更新对话信息
    setDialogue(data = {}) {
      this.online = data.is_online == 1
      this.talk = {
        username: data.remark || data.name,
        talk_type: data.talk_type,
        receiver_id: data.receiver_id
      }

      this.index_name = `${data.talk_type}_${data.receiver_id}`
      this.records = []
      this.unreadBubble = 0
      this.isShowEditor = data?.is_robot === 0

      this.members = []
      if (data.talk_type == 2) {
        this.updateGroupMembers()
      }
    },

    // 更新提及列表
    async updateGroupMembers() {
      let { code, data } = await ServeGetGroupMembers({
        group_id: this.talk.receiver_id
      })

      if (code != 200) return

      this.members = data.items.map((o) => ({
        id: o.user_id,
        nickname: o.nickname,
        avatar: o.avatar,
        gender: o.gender,
        leader: o.leader,
        remark: o.remark,
        online: false,
        value: o.nickname
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

    // 关闭多选模式
    closeMultiSelect() {
      this.isOpenMultiSelect = false

      for (const item of this.selectItems) {
        if (item.isCheck) {
          item.isCheck = false
        }
      }
    },

    // 删除聊天记录
    ApiDeleteRecord(msgIds = []) {
      ServeRemoveRecords({
        talk_type: this.talk.talk_type,
        receiver_id: this.talk.receiver_id,
        msg_ids: msgIds
      }).then((res) => {
        if (res.code == 200) {
          this.batchDelDialogueRecord(msgIds)
        } else {
          window['$message'].warning(res.message)
        }
      })
    },

    // 撤销聊天记录
    ApiRevokeRecord(msg_id = '') {
      ServeRevokeRecords({ msg_id }).then((res) => {
        if (res.code == 200) {
          this.updateDialogueRecord({ msg_id, is_revoke: 1 })
        } else {
          window['$message'].warning(res.message)
        }
      })
    },

    // 转发聊天记录
    ApiForwardRecord(options) {
      let data = {
        type: 'forward',
        receiver: {
          talk_type: this.talk.talk_type,
          receiver_id: this.talk.receiver_id
        },
        ...options
      }

      ServePublishMessage(data).then((res) => {
        if (res.code == 200) {
          this.closeMultiSelect()
        }
      })
    },

    ApiCollectImage(options) {
      const { msg_id } = options

      ServeCollectEmoticon({ msg_id }).then(() => {
        useEditorStore().loadUserEmoticon()
        window['$message'] && window['$message'].success('收藏成功')
      })
    }
  }
})
