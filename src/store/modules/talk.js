import { getSort, getMutipSort } from '@/utils/functions'
import { ServeGetTalkList } from '@/api/chat'
import { formateTalkItem } from '@/utils/talk'

const Talk = {
  state: {
    loadStatus: 1, // 加载状态[1:未加载;2:加载中;3:加载完成;4:加载失败;]

    // 会话列表
    items: [],

    // 最后一条消息
    unreadMessage: {
      num: 0,
      nickname: '未知',
      content: '...',
    },
  },
  getters: {
    // 过滤所有置顶对话列表
    topItems: state => {
      return state.items.filter(item => item.is_top == 1)
    },
    talkItems: state => {
      return state.items.sort(
        getMutipSort([getSort((a, b) => a.updated_at > b.updated_at)])
      )
    },
    // 消息未读数总计
    unreadNum: state => {
      return state.items.reduce((total, item) => {
        return total + parseInt(item.unread_num)
      }, 0)
    },
    talkNum: state => state.items.length,
  },
  mutations: {
    SET_LOAD_STATUS(state, resource) {
      state.loadStatus = resource
    },

    // 设置对话列表
    SET_TALK_ITEMS(state, resource) {
      state.items = resource.items
    },

    // 更新对话节点
    UPDATE_TALK_ITEM(state, resource) {
      for (const iterator of state.items) {
        if (iterator.index_name === resource.index_name) {
          Object.assign(iterator, resource)
          break
        }
      }
    },

    // 新增对话节点
    PUSH_TALK_ITEM(state, resource) {
      state.items.push(resource)
    },

    // 移除对话节点
    REMOVE_TALK_ITEM(state, index_name) {
      for (let i in state.items) {
        if (state.items[i].index_name === index_name) {
          state.items.splice(i, 1)
          break
        }
      }
    },

    // 更新对话消息
    UPDATE_TALK_MESSAGE(state, resource) {
      for (const iterator of state.items) {
        if (iterator.index_name !== resource.index_name) {
          continue
        }

        iterator.unread_num++
        iterator.msg_text = resource.msg_text
        iterator.updated_at = resource.updated_at
        break
      }
    },

    SET_TLAK_UNREAD_MESSAGE(state, resource) {
      state.unreadMessage.num++
      state.unreadMessage.nickname = resource.nickname
      state.unreadMessage.content = resource.content
    },

    // 清除最后一条未读消息
    CLEAR_TLAK_UNREAD_MESSAGE(state) {
      state.unreadMessage = {
        num: 0,
        nickname: '未知',
        content: '...',
      }
    },
  },
  actions: {
    // 加载会话列表
    LOAD_TALK_ITEMS(context) {
      context.commit('SET_LOAD_STATUS', 2)

      ServeGetTalkList()
        .then(({ code, data }) => {
          if (code !== 200) return

          context.commit('SET_TALK_ITEMS', {
            items: data.map(item => formateTalkItem(item)),
          })
          
          context.commit('SET_LOAD_STATUS', 3)
        })
        .catch(() => {
          context.commit('SET_LOAD_STATUS', 4)
        })
    },
  },
}

export default Talk
