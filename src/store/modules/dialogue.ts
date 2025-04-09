import { defineStore } from 'pinia'
import { ServeRemoveRecords, ServeRevokeRecords, ServePublishMessage } from '@/api/chat'
import { ServeGetGroupMembers } from '@/api/group'
import { TalkModeEnum } from '@/constant/chat'
import { toApi } from '@/api'
import { ServeCustomizeEmoticonCreate } from '@/api/emoticon'
import { useEditorStore } from './editor'
import { ITalkRecord } from '@/types/chat'

// 键盘消息事件定时器
let keyboardTimeout: number

interface IMember {
  id: number
  nickname: string
  avatar: string
  gender: number
  leader: number
  remark: string
}

export const useDialogueStore = defineStore('dialogue', {
  state: () => {
    return {
      // 对话索引（聊天对话的唯一索引）
      index_name: '',

      // 对话节点
      target: {
        username: '',
        talk_mode: 0, // 对话来源[1:私聊;2:群聊]
        to_from_id: 0 // 对话对象ID[群ID或者好友ID]
      },

      // 好友是否正在输入文字
      keyboard: false,

      // 聊天记录
      records: [] as ITalkRecord[],

      // 新消息提示
      unreadBubble: 0,

      // 是否显示编辑器
      isShowEditor: false,

      // 群成员列表
      members: [] as IMember[],

      // 聊天面板的容器ID
      container: ''
    }
  },
  getters: {
    // 当前对话是否是群聊
    isGroupTalk: (state) => state.target.talk_mode === TalkModeEnum.Group
  },
  actions: {
    // 更新对话信息
    setDialogue(data: any = {}) {
      this.target = {
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

      if (data.talk_mode == TalkModeEnum.Group) {
        this.updateGroupMembers()
      }
    },

    // 更新提及列表
    async updateGroupMembers() {
      const { to_from_id: group_id } = this.target

      this.members = []
      const { code, data } = await toApi(ServeGetGroupMembers, { group_id })

      if (code != 200) return

      this.members = data?.items.map((item: any) => ({
        id: item.user_id,
        nickname: item.nickname,
        avatar: item.avatar,
        gender: item.gender,
        leader: item.leader,
        remark: item.remark
      }))
    },

    // 清空对话记录
    clearDialogueRecord() {
      this.records = []
    },

    // 数组头部压入对话记录
    unshiftDialogueRecord(records: ITalkRecord[]) {
      this.records.unshift(...records)
    },

    // 推送对话记录
    addDialogueRecord(record: any) {
      this.records.push(record)
    },

    // 更新对话记录
    updateDialogueRecord(params: any) {
      const { msg_id = '' } = params

      const item = this.records.find((item: ITalkRecord) => item.msg_id === msg_id)

      item && Object.assign(item, params)
    },

    // 批量删除对话记录
    batchDelDialogueRecord(msgIds: string[]) {
      msgIds.forEach((msg_id) => {
        const index = this.records.findIndex((item: ITalkRecord) => item.msg_id === msg_id)

        if (index >= 0) this.records.splice(index, 1)
      })
    },

    // 自增好友键盘输入事件
    triggerKeyboard() {
      this.keyboard = true

      keyboardTimeout && clearTimeout(keyboardTimeout)

      keyboardTimeout = setTimeout(() => (this.keyboard = false), 2000)
    },

    setUnreadBubble(clear: boolean = false) {
      if (clear) {
        this.unreadBubble = 0
      } else {
        this.unreadBubble++
      }
    },

    // 删除聊天记录
    async deleteRecord(msgIds: string[]) {
      const { code } = await toApi(ServeRemoveRecords, {
        talk_mode: this.target.talk_mode,
        to_from_id: this.target.to_from_id,
        msg_ids: msgIds
      })

      code == 200 && this.batchDelDialogueRecord(msgIds)
    },

    // 撤销聊天记录
    async revokeRecord(msg_id: string) {
      const { code } = await toApi(ServeRevokeRecords, {
        talk_mode: this.target.talk_mode,
        to_from_id: this.target.to_from_id,
        msg_id
      })

      code == 200 && this.updateDialogueRecord({ msg_id, is_revoked: 1 })
    },

    // 转发聊天记录
    async forwardRecord(params = {}) {
      await toApi(ServePublishMessage, {
        type: 'forward',
        ...params
      })
    },

    async collectImage(params = {}) {
      await toApi(ServeCustomizeEmoticonCreate, params, {
        showMessageText: '收藏成功',
        onSuccess: () => {
          useEditorStore().loadUserEmoticon()
        }
      })
    },

    /**
     * 滚动到底部
     * @param animation 是否使用动画
     */
    scrollToBottom(animation: boolean = false) {
      const el = document.getElementById(this.container)
      el?.scrollTo({
        top: el?.scrollHeight + 1000,
        behavior: animation ? 'smooth' : 'auto'
      })
    }
  }
})
