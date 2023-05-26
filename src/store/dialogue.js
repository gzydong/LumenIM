import { defineStore } from 'pinia'
import {
  ServeRemoveRecords,
  ServeRevokeRecords,
  ServeForwardRecords,
} from '@/api/chat'

// 键盘消息事件定时器
let keyboardTimeout = null

export const useDialogueStore = defineStore('dialogue', {
  state: () => {
    return {
      // 对话索引（聊天对话的唯一索引）
      index_name: null,

      // 对话节点
      talk: {
        username: '',
        talk_type: 0, // 对话来源[1:私聊;2:群聊]
        receiver_id: 0,
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

      // 对话记录
      items: [
        {
          talk_type: 1, // 对话类型
          receiver_id: 0, // 接收者ID
          read_sequence: 0, // 当前已读的最后一条记录
          records: [],
        },
      ],
    }
  },
  getters: {
    // 多选列表
    selectItems: state => state.records.filter(item => item.isCheck),
    // 当前对话是否是群聊
    isGroupTalk: state => state.talk.talk_type === 2,
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
        username: data.remark_name || data.name,
        talk_type: data.talk_type,
        receiver_id: data.receiver_id,
      }

      this.index_name = data.talk_type + '_' + data.receiver_id
      this.records = []
      this.unreadBubble = 0
      this.isShowEditor = data.is_robot === 0
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
      const item = this.records.find(item => item.id === params.id)

      item && Object.assign(item, params)
    },

    // 批量删除对话记录
    batchDelDialogueRecord(ids) {
      ids.forEach(id => {
        const index = this.records.findIndex(item => item.id === id)

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
      if (value == 0) {
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
    ApiDeleteRecord(ids = []) {
      ServeRemoveRecords({
        talk_type: this.talk.talk_type,
        receiver_id: this.talk.receiver_id,
        record_id: ids.join(','),
      }).then(res => {
        if (res.code == 200) {
          this.batchDelDialogueRecord(ids)
        } else {
          window['$message'].warning(res.message)
        }
      })
    },

    // 撤销聊天记录
    ApiRevokeRecord(record_id) {
      ServeRevokeRecords({ record_id }).then(res => {
        if (res.code == 200) {
          this.updateDialogueRecord({ id: record_id, is_revoke: 1 })
        } else {
          window['$message'].warning(res.message)
        }
      })
    },

    // 转发聊天记录
    ApiForwardRecord(options) {
      let data = Object.assign(
        {
          talk_type: this.talk.talk_type,
          receiver_id: this.talk.receiver_id,
        },
        options
      )

      ServeForwardRecords(data).then(res => {
        if (res.code == 200) {
          this.closeMultiSelect()
        }
      })
    },

    ApiSendTextMessage(options) {},
  },
})
