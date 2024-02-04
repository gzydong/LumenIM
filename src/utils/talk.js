import { parseTime } from './datetime'

export const KEY_INDEX_NAME = 'send_message_index_name'

export function formatTalkRecord(uid, data) {
  data.float = 'center'

  if (data.user_id > 0) {
    data.float = data.user_id == uid ? 'right' : 'left'
  }

  data.is_check = false

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
 * 格式化聊天对话列表数据
 *
 * @param {Object} params
 */
export function formatTalkItem(params) {
  let options = {
    id: 0,
    talk_mode: 1,
    to_from_id: 0,
    name: '未设置',
    remark: '',
    avatar: '',
    is_disturb: 2,
    is_top: 2,
    is_online: 2,
    is_robot: 2,
    unread_num: 0,
    content: '...',
    draft_text: '',
    msg_text: '',
    index_name: '',
    updated_at: parseTime(new Date())
  }

  options = { ...options, ...params }
  options.index_name = `${options.talk_mode}_${options.to_from_id}`

  return options
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

export const ttime = (datetime) => {
  if (datetime == undefined || datetime == '') {
    return new Date().getTime()
  }

  return new Date(datetime.replace(/-/g, '/')).getTime()
}
