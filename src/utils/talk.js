import store from '@/store'
import router from '@/router'
import { parseTime } from '@/utils/functions'

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
    receiver_id:0,
    name: '未设置昵称',
    remark_name: '',
    avatar: '',
    is_disturb: 0,
    is_top: 0,
    is_online:false,
    unread_num: 0,
    content: '......',
    draft_text: '',
    msg_text:'',
    index_name: '',
    created_at: parseTime(new Date()),
  }

  Object.assign(options, params)
  options.index_name =`${options.talk_type}_${options.receiver_id}`

  return options
}

/**
 * 打开指定对话窗口
 *
 * @param {Integer} userId 用户ID
 * @param {Integer} talkType 对话类型[1:私聊;2:群聊;]
 */
export function openTalk(userId, talkType) {
  router.push({
    path: '/message',
    query: {
      talk: userId,
      type: talkType,
      v: new Date().getTime(),
    },
  })
}
