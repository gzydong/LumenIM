import { ServeFindUserEmoticon, ServeUploadEmoticon } from '@/api/emoticon'

import { ServeCollectEmoticon } from '@/api/chat'

import { Notification } from 'element-ui'

export default {
  state: {
    items: [
      {
        emoticon_id: -1,
        name: 'QQ表情/符号表情',
        url: require('@/assets/image/icon_face.png'),
        list: [],
      },
      {
        emoticon_id: 0,
        name: '我的收藏',
        url: require('@/assets/image/icon_heart.png'),
        list: [],
      },
    ],
  },
  mutations: {
    // 加载用户表情包
    LOAD_USER_EMOTICON(state) {
      ServeFindUserEmoticon().then(res => {
        if (res.code == 200) {
          const { collect_emoticon, sys_emoticon } = res.data

          state.items = state.items.slice(0, 2)

          // 用户收藏的系统表情包
          state.items[1].list = collect_emoticon

          // 用户添加的系统表情包
          state.items.push(...sys_emoticon)
        }
      })
    },

    // 收藏用户表情包
    SAVE_USER_EMOTICON(state, resoure) {
      ServeCollectEmoticon({
        record_id: resoure.record_id,
      })
        .then(res => {
          if (res.code == 200) {
            Notification({
              title: '收藏提示',
              message: '表情包收藏成功...',
              type: 'success',
            })

            this.commit('LOAD_USER_EMOTICON')
          }
        })
        .catch(() => {
          Notification({
            title: '收藏提示',
            message: '表情包收藏失败...',
            type: 'warning',
          })
        })
    },

    // 自定义上传用户表情包
    UPLOAD_USER_EMOTICON(state, resoure) {
      let fileData = new FormData()
      fileData.append('emoticon', resoure.file)
      ServeUploadEmoticon(fileData)
        .then(res => {
          if (res.code == 200) {
            state.items[1].list.push(res.data)
          }
        })
        .catch(() => {
          Notification({
            message: '网络异常请稍后再试...',
            type: 'error',
            duration: 3000,
          })
        })
    },

    // 添加系统表情包
    APPEND_SYS_EMOTICON(state, resoure) {
      state.items.push(resoure)
    },

    // 移除系统表情包
    REMOVE_SYS_EMOTICON(state, resoure) {
      for (let i in state.items) {
        if (state.items[i].emoticon_id === resoure.emoticon_id) {
          state.items.splice(i, 1)
          break
        }
      }
    },
  },
}
