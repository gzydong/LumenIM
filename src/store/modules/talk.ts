import { defineStore } from 'pinia'
import { ServeGetTalkList, ServeCreateTalkList } from '@/api/chat'
import { formatTalkItem, ttime, KEY_INDEX_NAME } from '@/utils/talk'
import { useEditorDraftStore } from './editor-draft'
import { ISession } from '@/types/chat'

interface TalkStoreState {
  loadStatus: number
  items: ISession[]
}

export const useTalkStore = defineStore('talk', {
  state: (): TalkStoreState => {
    return {
      // 加载状态[1:未加载;2:加载中;3:加载完成;4:加载失败;]
      loadStatus: 2,

      // 会话列表
      items: []
    }
  },
  getters: {
    // 过滤所有置顶对话列表
    topItems: (state) => {
      return state.items.filter((item: ISession) => item.is_top == 1)
    },

    // 对话列表
    talkItems: (state) => {
      return state.items.sort((a, b) => {
        return ttime(b.updated_at) - ttime(a.updated_at)
      })
    },

    // 消息未读数总计
    talkUnreadNum: (state) => {
      return state.items.reduce((total: number, item: ISession) => {
        return total + item.unread_num
      }, 0)
    }
  },
  actions: {
    findItem(index_name: string) {
      return this.items.find((item: ISession) => item.index_name === index_name) as ISession
    },

    // 更新对话节点
    updateItem(params: any) {
      const item = this.items.find((item) => item.index_name === params.index_name)

      item && Object.assign(item, params)
    },

    // 新增对话节点
    addItem(params: any) {
      this.items = [params, ...this.items]
    },

    // 移除对话节点
    delItem(index_name: string) {
      const i = this.items.findIndex((item) => item.index_name === index_name)

      if (i >= 0) {
        this.items.splice(i, 1)
      }

      this.items = [...this.items]
    },

    // 更新对话消息
    updateMessage(params: any) {
      const item = this.items.find((item) => item.index_name === params.index_name)

      if (item) {
        item.unread_num++
        // item.msg_text = params.msg_text
        item.updated_at = params.updated_at
      }
    },

    // 更新联系人备注
    setRemark(params: any) {
      const item = this.items.find((item) => item.index_name === `1_${params.user_id}`)

      item && (item.remark = params.remark)
    },

    // 加载会话列表
    loadTalkList() {
      this.loadStatus = 2

      const resp = ServeGetTalkList()

      resp.then(({ code, data }) => {
        if (code == 200) {
          this.items = data.items.map((item: any) => {
            const value = formatTalkItem(item)

            const draft = useEditorDraftStore().items[value.index_name]
            if (draft) {
              value.draft_text = JSON.parse(draft).text || ''
            }

            if (value.is_robot == 1) {
              value.is_online = 1
            }

            return value
          })

          this.loadStatus = 3
        } else {
          this.loadStatus = 4
        }
      })

      resp.catch(() => {
        this.loadStatus = 4
      })
    },

    findTalkIndex(index_name: string) {
      return this.items.findIndex((item: ISession) => item.index_name === index_name)
    },

    toTalk(talk_type: number, receiver_id: number, router: any) {
      const route = {
        path: '/message',
        query: {
          v: new Date().getTime()
        }
      }

      if (this.findTalkIndex(`${talk_type}_${receiver_id}`) >= 0) {
        sessionStorage.setItem(KEY_INDEX_NAME, `${talk_type}_${receiver_id}`)
        return router.push(route)
      }

      ServeCreateTalkList({
        talk_type,
        receiver_id
      }).then(({ code, data, message }) => {
        if (code == 200) {
          if (this.findTalkIndex(`${talk_type}_${receiver_id}`) === -1) {
            this.addItem(formatTalkItem(data))
          }

          sessionStorage.setItem(KEY_INDEX_NAME, `${talk_type}_${receiver_id}`)
          return router.push(route)
        } else {
          window['$message'].info(message)
        }
      })
    }
  }
})
