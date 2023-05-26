import { useTalkStore } from '@/store/talk'
import router from '@/router'
import { parseTime } from '@/utils/datetime'
import { ServeCreateTalkList } from '@/api/chat'

const KEY_INDEX_NAME = 'send_message_index_name'

export function formatTalkRecord(uid, data) {
  data.float = 'center'

  if (data.user_id > 0) {
    data.float = data.user_id == uid ? 'right' : 'left'
  }

  data.isCheck = false

  return data
}

// 播放消息提示
export function palyMusic(muted = false) {
  let audio = document.getElementById('audio')
  audio.currentTime = 0
  audio.muted = muted
  audio.play()
}

/**
 * 通过对话索引查找对话列表下标
 *
 * @param {String} index_name
 */
export function findTalkIndex(index_name) {
  return useTalkStore().items.findIndex(item => item.index_name === index_name)
}

/**
 * 通过对话索引查找对话列表
 *
 * @param {String} index_name
 */
export function findTalk(index_name) {
  return useTalkStore().items.find(item => item.index_name === index_name)
}

/**
 * 格式化聊天对话列表数据
 *
 * @param {Object} params
 */
export function formatTalkItem(params) {
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

  options.msg_text = options.msg_text
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
  if (findTalkIndex(`${talk_type}_${receiver_id}`) >= 0) {
    sessionStorage.setItem(KEY_INDEX_NAME, `${talk_type}_${receiver_id}`)
    return router.push({
      path: '/message',
      query: {
        v: new Date().getTime(),
      },
    })
  }

  ServeCreateTalkList({
    talk_type: parseInt(talk_type),
    receiver_id: parseInt(receiver_id),
  }).then(({ code, data, message }) => {
    if (code == 200) {
      sessionStorage.setItem(KEY_INDEX_NAME, `${talk_type}_${receiver_id}`)

      if (findTalkIndex(`${talk_type}_${receiver_id}`) === -1) {
        useTalkStore().addItem(formatTalkItem(data))
      }

      router.push({
        path: '/message',
        query: {
          v: new Date().getTime(),
        },
      })
    } else {
      window['$message'].info(message)
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

/**
 * 获取需要打开的对话索引值
 *
 * @returns
 */
export function setCacheIndexName(type, id) {
  sessionStorage.setItem(KEY_INDEX_NAME, `${type}_${id}`)
}
