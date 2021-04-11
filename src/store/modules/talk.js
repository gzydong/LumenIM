import { getSort, getMutipSort } from '@/utils/functions'

const Talk = {
  state: {
    // 用户对话列表
    items: [],

    // 最后一条消息
    unreadMessage: {
      num: 0,
      nickname: '未知',
      content: '...',
    },

    // 对话列表重载状态
    heavyLoad: false,
  },
  getters: {
    // 过滤所有置顶对话列表
    topItems: state => {
      return state.items.filter(item => item.is_top == 1)
    },
    talkItems: state => {
      return state.items.sort(
        getMutipSort([
          getSort((a, b) => a.unread_num > b.unread_num),
          getSort((a, b) => a.updated_at > b.updated_at),
        ])
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
    // 设置对话列表
    SET_TALK_ITEM(state, resource) {
      state.items = resource.items
    },

    // 更新对话节点
    UPDATE_TALK_ITEM(state, resource) {
      Object.assign(state.items[resource.index], resource.item)
    },

    // 新增对话节点
    INSERT_TALK_ITEM(state, resource) {
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

    // 更新对话节点在线状态
    UPDATE_TALK_ONLINE_STATUS(state, resource) {
      state.items[resource.index].online = parseInt(resource.status)
    },

    // 更新对话消息
    UPDATE_TALK_MESSAGE(state, resource) {
      state.items[resource.index].msg_text = resource.item.msg_text
      state.items[resource.index].unread_num++
      state.items[resource.index].updated_at = resource.item.updated_at
    },

    // 清空对话的未读数
    CLEAR_TLAK_UNREAD_NUM(state, index) {
      state.items[index].unread_num = 0
    },

    // 触发对话列表重新加载
    TRIGGER_TALK_ITEMS_LOAD(state, status = false) {
      state.heavyLoad = status
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
}

export default Talk
