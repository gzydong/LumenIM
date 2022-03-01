import Base from './base'
import Vue from 'vue'
import vm from '@/main'
import NewMessageNotify from '@/components/notify/NewMessageNotify'
import { ServeClearTalkUnreadNum, ServeCreateTalkList } from '@/api/chat'
import { formateTalkItem, findTalkIndex, toTalk } from '@/utils/talk'
import { parseTime } from '@/utils/functions'

/**
 * 好友状态事件
 */
class Talk extends Base {
  /**
   * @var resource 资源
   */
  resource

  /**
   * 发送者ID
   */
  sender_id = 0

  /**
   * 接收者ID
   */
  receiver_id = 0

  /**
   * 聊天类型[1:私聊;2:群聊;]
   */
  talk_type = 0

  /**
   * 初始化构造方法
   *
   * @param {Object} resource Socket消息
   */
  constructor(resource) {
    super()

    this.sender_id = resource.sender_id
    this.receiver_id = resource.receiver_id
    this.talk_type = resource.talk_type

    this.resource = resource.data
  }

  /**
   * 判断消息发送者是否来自于我
   * @returns
   */
  isCurrSender() {
    return this.sender_id == this.getAccountId()
  }

  /**
   * 获取对话索引
   *
   * @return String
   */
  getIndexName() {
    if (this.talk_type == 2) {
      return `${this.talk_type}_${this.receiver_id}`
    }

    let receiver_id = this.isCurrSender() ? this.receiver_id : this.sender_id

    return `${this.talk_type}_${receiver_id}`
  }

  /**
   * 消息浮动方式
   *
   * @returns
   */
  getFloatType() {
    let user_id = this.resource.user_id

    if (user_id == 0) return 'center'

    return user_id == this.getAccountId() ? 'right' : 'left'
  }

  /**
   * 获取聊天列表左侧的对话信息
   */
  getTalkText() {
    let text = this.resource.content

    switch (this.resource.msg_type) {
      case 2:
        let file_type = this.resource.file.file_type
        text = file_type == 1 ? '[图片消息]' : '[文件消息]'
        break
      case 3:
        text = '[会话记录]'
        break
      case 4:
        text = '[代码消息]'
        break
      case 8:
        text = '[登录提醒]'
        break
    }

    return text
  }

  handle() {
    // 判断当前是否在聊天页面
    if (!this.isTalkPage()) {

      // 判断消息是否来自于我自己，否则会提示消息通知
      !this.isCurrSender() && this.showMessageNocice()
    }

    // 判断会话列表是否存在，不存在则创建
    if (findTalkIndex(this.getIndexName()) == -1) {
      return this.addTalkItem()
    }

    let isTrue = this.isTalk(this.talk_type, this.receiver_id, this.sender_id)

    // 判断当前是否正在和好友对话
    if (isTrue) {
      this.insertTalkRecord()
    } else {
      this.updateTalkItem()
    }
  }

  /**
   * 显示消息提示
   * @returns
   */
  showMessageNocice() {
    let avatar = this.resource.avatar
    let nickname = this.resource.nickname
    let talk_type = this.resource.talk_type
    let receiver_id = this.receiver_id

    if (talk_type == 2) {
      avatar = this.resource.group_avatar
      nickname += `【 ${this.resource.group_name} 】`
    } else {
      receiver_id = this.sender_id
    }

    this.$notify({
      message: vm.$createElement(NewMessageNotify, {
        props: {
          avatar,
          talk_type,
          nickname,
          content: this.getTalkText(),
          datetime: this.resource.created_at,
        },
      }),
      customClass: 'im-notify',
      duration: 3000,
      position: 'top-right',
      onClick: function() {
        this.close()
        toTalk(talk_type, receiver_id)
      },
    })
  }

  /**
   * 加载对接节点
   */
  addTalkItem() {
    let receiver_id = this.sender_id
    let talk_type = this.talk_type

    if (talk_type == 1 && this.receiver_id != this.getAccountId()) {
      receiver_id = this.receiver_id
    } else if (talk_type == 2) {
      receiver_id = this.receiver_id
    }

    ServeCreateTalkList({
      talk_type,
      receiver_id,
    }).then(({ code, data }) => {
      if (code == 200) {
        this.getStoreInstance().commit('PUSH_TALK_ITEM', formateTalkItem(data))
      }
    })
  }

  /**
   * 插入对话记录
   */
  insertTalkRecord() {
    let store = this.getStoreInstance()
    let record = this.resource

    record.float = this.getFloatType()

    store.commit('PUSH_DIALOGUE', record)

    // 获取聊天面板元素节点
    let el = document.getElementById('lumenChatPanel')

    // 判断的滚动条是否在底部
    let isBottom = Math.ceil(el.scrollTop) + el.clientHeight >= el.scrollHeight

    if (isBottom || record.user_id == this.getAccountId()) {
      Vue.nextTick(() => {
        el.scrollTop = el.scrollHeight
      })
    } else {
      store.commit('SET_TLAK_UNREAD_MESSAGE', {
        content: this.getTalkText(),
        nickname: record.nickname,
      })
    }

    store.commit('UPDATE_TALK_ITEM', {
      index_name: this.getIndexName(),
      msg_text: this.getTalkText(),
      updated_at: parseTime(new Date()),
    })

    if (this.talk_type == 1 && this.getAccountId() !== this.sender_id) {
      ServeClearTalkUnreadNum({
        talk_type: 1,
        receiver_id: this.sender_id,
      })
    }
  }

  /**
   * 更新对话列表记录
   */
  updateTalkItem() {
    let store = this.getStoreInstance()

    store.commit('UPDATE_TALK_MESSAGE', {
      index_name: this.getIndexName(),
      msg_text: this.getTalkText(),
      updated_at: parseTime(new Date()),
    })
  }
}

export default Talk
