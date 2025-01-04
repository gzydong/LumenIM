import { defineStore } from 'pinia'
import { ServeGetTalkList, ServeCreateTalk } from '@/api/chat'
import { toApi } from '@/api'

import { formatTalkItem, KEY_INDEX_NAME } from '@/utils/talk'
import { useEditorDraftStore } from './editor-draft.ts'
import { ISession } from '@/types/chat'

export const useTalkStore = defineStore('talk', {
  state: () => ({
    loadStatus: 2, // 加载状态[1:未加载;2:加载中;3:加载完成;4:加载失败;]
    items: [] as ISession[],
    // 是否显示会话列表
    isShowSessionMenu: true
  }),

  getters: {
    topItems: (state) => state.items.filter((item) => item.is_top === 1),
    unreadItems: (state) => state.items.filter((item) => item.unread_num > 0),
    groupItems: (state) => state.items.filter((item) => item.talk_mode === 2),
    friendItems: (state) => state.items.filter((item) => item.talk_mode === 1),
    talkUnreadNum: (state) => state.items.reduce((total, item) => total + item.unread_num, 0)
  },

  actions: {
    findItem(index_name: string): ISession | undefined {
      return this.items.find((item) => item.index_name === index_name)
    },

    findIndex(index_name: string): number {
      return this.items.findIndex((item) => item.index_name === index_name)
    },

    updateItem(params: Partial<ISession>) {
      if (!params.index_name) return

      const item = this.findItem(params.index_name)

      item && Object.assign(item, params)
    },

    addItem(item: ISession) {
      this.items.unshift(item)
    },

    delItem(index_name: string) {
      const index = this.findIndex(index_name)
      if (index >= 0) {
        this.items.splice(index, 1)
      }
    },

    updateMessage(
      params: Pick<ISession, 'index_name' | 'msg_text' | 'updated_at'>,
      isClear = false
    ) {
      const index = this.findIndex(params.index_name)
      if (index === -1) return

      const item = this.items[index]

      if (isClear) {
        item.unread_num = 0
      } else {
        item.unread_num++
      }

      item.msg_text = params.msg_text
      item.updated_at = params.updated_at

      if (index !== 0) {
        this.items.splice(index, 1)
        this.items.unshift(item)
      }
    },

    clearUnreadNum(index_name: string) {
      const item = this.findItem(index_name)
      if (item) {
        item.unread_num = 0
      }
    },

    setRemark(params: { user_id: number; remark: string }) {
      const item = this.findItem(`1_${params.user_id}`)
      if (item) {
        item.remark = params.remark
      }
    },

    async loadTalkList() {
      const { code, data } = await toApi(ServeGetTalkList)
      if (code !== 200) return

      this.loadStatus = 3

      const editorDraftStore = useEditorDraftStore()

      const items = data.items?.map((item: any) => {
        const value = formatTalkItem(item)

        const draft = editorDraftStore.items[value.index_name]
        if (draft) {
          value.draft_text = JSON.parse(draft).text || ''
        }

        return value
      })

      // 排序
      this.items = items.sort((a: ISession, b: ISession) => {
        return b.updated_at.localeCompare(a.updated_at)
      })
    },

    async toTalk(talk_mode: number, to_from_id: number, router: any) {
      const indexName = `${talk_mode}_${to_from_id}`
      const route = {
        path: '/message',
        query: {
          v: new Date().getTime()
        }
      }

      if (this.findIndex(indexName) >= 0) {
        sessionStorage.setItem(KEY_INDEX_NAME, indexName)
        return await router.push(route)
      }

      const { code, data } = await toApi(ServeCreateTalk, { talk_mode, to_from_id })
      if (code !== 200) return

      if (this.findIndex(indexName) === -1) {
        this.addItem(formatTalkItem(data) as ISession)
      }

      sessionStorage.setItem(KEY_INDEX_NAME, indexName)
      await router.push(route)
    }
  }
})
