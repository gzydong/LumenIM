import store from '@/store'
import router from '@/router'
import { parseTime } from '@/utils/functions'
import { ServeCreateTalkList } from '@/api/chat'

const KEY_INDEX_NAME = 'send_message_index_name'

/**
 * 通过对话索引查找对话列表下标
 *
 * @param {String} index_name
 */
export function findTalkIndex(index_name) {
  return store.state.talks.items.findIndex(
    item => item.index_name == index_name
  )
}

/**
 * 通过对话索引查找对话列表
 *
 * @param {String} index_name
 */
export function findTalk(index_name) {
  return store.state.talks.items.find(item => item.index_name == index_name)
}

/**
 * 格式化聊天对话列表数据
 *
 * @param {Object} params
 */
export function formateTalkItem(params) {
  let options = {
    id: 0,
    talk_type: 1,
    receiver_id: 0,
    name: '未设置昵称',
    remark_name: '',
    avatar: '',
    is_disturb: 0,
    is_top: 0,
    is_online: 0,
    is_robot: 0,
    unread_num: 0,
    content: '......',
    draft_text: '',
    msg_text: '',
    index_name: '',
    created_at: parseTime(new Date()),
  }

  Object.assign(options, params)
  
  options.index_name = `${options.talk_type}_${options.receiver_id}`

  return options
}

/**
 * 打开指定对话窗口
 *
 * @param {Integer} talk_type 对话类型[1:私聊;2:群聊;]
 * @param {Integer} receiver_id 接收者ID
 */
export function toTalk(talk_type, receiver_id) {
  ServeCreateTalkList({
    talk_type: parseInt(talk_type),
    receiver_id: parseInt(receiver_id),
  }).then(({ code, data }) => {
    if (code == 200) {
      sessionStorage.setItem(KEY_INDEX_NAME, `${talk_type}_${receiver_id}`)

      if (findTalkIndex(`${talk_type}_${receiver_id}`) == -1) {
        store.commit('PUSH_TALK_ITEM', formateTalkItem(data))
      }

      router.push({
        path: '/message',
        query: {
          v: new Date().getTime(),
        },
      })
    }
  })
}

/**
 * 获取需要打开的对话索引值
 *
 * @returns
 */
export function getCacheIndexName() {
  let index_name = sessionStorage.getItem(KEY_INDEX_NAME)
  if (index_name) {
    sessionStorage.removeItem(KEY_INDEX_NAME)
  }

  return index_name
}
