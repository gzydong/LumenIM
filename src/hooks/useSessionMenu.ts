import { reactive, nextTick, computed, h, inject } from 'vue'
import { ISession } from '@/types/chat'
import { renderIcon } from '@/utils/util'
import {
  ArrowUp,
  ArrowDown,
  Logout,
  Delete,
  Clear,
  Remind,
  CloseRemind,
  EditTwo,
  IdCard
} from '@icon-park/vue-next'
import { ServeTopTalkList, ServeDeleteTalkList, ServeSetNotDisturb } from '@/api/chat'
import { useDialogueStore, useTalkStore } from '@/store'
import { ServeSecedeGroup } from '@/api/group'
import { ServeDeleteContact, ServeEditContactRemark } from '@/api/contact'
import { NInput } from 'naive-ui'

interface IDropdown {
  options: any[]
  show: boolean
  x: number
  y: number
  item: any
}

export function useSessionMenu() {
  const dropdown: IDropdown = reactive({
    options: [],
    show: false,
    x: 0,
    y: 0,
    item: {}
  })

  const dialogueStore = useDialogueStore()
  const talkStore = useTalkStore()

  const user: any = inject('$user')

  // 当前会话索引
  const indexName = computed(() => dialogueStore.index_name)

  const onContextMenu = (e: any, item: ISession) => {
    dropdown.show = false
    dropdown.item = Object.assign({}, item)
    dropdown.options = []

    const options: any[] = []

    if (item.talk_type == 1) {
      options.push({
        icon: renderIcon(IdCard),
        label: '好友信息',
        key: 'info'
      })

      options.push({
        icon: renderIcon(EditTwo),
        label: '修改备注',
        key: 'remark'
      })
    }

    options.push({
      icon: renderIcon(item.is_top ? ArrowDown : ArrowUp),
      label: item.is_top ? '取消置顶' : '会话置顶',
      key: 'top'
    })

    options.push({
      icon: renderIcon(item.is_disturb ? Remind : CloseRemind),
      label: item.is_disturb ? '关闭免打扰' : '开启免打扰',
      key: 'disturb'
    })

    options.push({
      icon: renderIcon(Clear),
      label: '移除会话',
      key: 'remove'
    })

    if (item.talk_type == 1) {
      options.push({
        icon: renderIcon(Delete),
        label: '删除好友',
        key: 'delete_contact'
      })
    } else {
      options.push({
        icon: renderIcon(Logout),
        label: '退出群聊',
        key: 'signout_group'
      })
    }

    dropdown.options = [...options]

    nextTick(() => {
      dropdown.show = true
      dropdown.x = e.clientX
      dropdown.y = e.clientY
    })

    e.preventDefault()
  }

  const onCloseContextMenu = () => {
    dropdown.show = false
    dropdown.item = {}
  }

  const onDeleteTalk = (index_name = '') => {
    talkStore.delItem(index_name)

    index_name === indexName.value && dialogueStore.$reset()
  }

  const onUserInfo = (item: ISession) => {
    user(item.receiver_id)
  }

  // 移除会话
  const onRemoveTalk = (item: ISession) => {
    ServeDeleteTalkList({
      list_id: item.id
    }).then(({ code }) => {
      if (code == 200) {
        onDeleteTalk(item.index_name)
      }
    })
  }

  // 设置消息免打扰
  const onSetDisturb = (item: ISession) => {
    ServeSetNotDisturb({
      talk_type: item.talk_type,
      receiver_id: item.receiver_id,
      is_disturb: item.is_disturb == 0 ? 1 : 0
    }).then(({ code, message }) => {
      if (code == 200) {
        window['$message'].success('设置成功!')
        talkStore.updateItem({
          index_name: item.index_name,
          is_disturb: item.is_disturb == 0 ? 1 : 0
        })
      } else {
        window['$message'].error(message)
      }
    })
  }

  // 置顶会话
  const onToTopTalk = (item: ISession) => {
    if (item.is_top == 0 && talkStore.topItems.length >= 18) {
      return window['$message'].info('置顶最多不能超过18个会话')
    }

    ServeTopTalkList({
      list_id: item.id,
      type: item.is_top == 0 ? 1 : 2
    }).then(({ code, message }) => {
      if (code == 200) {
        talkStore.updateItem({
          index_name: item.index_name,
          is_top: item.is_top == 0 ? 1 : 0
        })
      } else {
        window['$message'].error(message)
      }
    })
  }

  // 移除联系人
  const onDeleteContact = (item: ISession) => {
    const name = item.remark || item.name

    window['$dialog'].create({
      showIcon: false,
      title: `删除 [${name}] 联系人？`,
      content: '删除后不再接收对方任何消息。',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        ServeDeleteContact({
          friend_id: item.receiver_id
        }).then(({ code, message }) => {
          if (code == 200) {
            window['$message'].success('删除联系人成功')
            onDeleteTalk(item.index_name)
          } else {
            window['$message'].error(message)
          }
        })
      }
    })
  }

  // 退出群聊
  const onSignOutGroup = (item: ISession) => {
    window['$dialog'].create({
      showIcon: false,
      title: `退出 [${item.name}] 群聊？`,
      content: '退出后不再接收此群的任何消息。',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        ServeSecedeGroup({
          group_id: item.receiver_id
        }).then(({ code, message }) => {
          if (code == 200) {
            window['$message'].success('已退出群聊')
            onDeleteTalk(item.index_name)
          } else {
            window['$message'].error(message)
          }
        })
      }
    })
  }

  const onChangeRemark = (item: ISession) => {
    let remark = ''
    window['$dialog'].create({
      showIcon: false,
      title: '修改备注',
      content: () => {
        return h(NInput, {
          defaultValue: item.remark,
          placeholder: '请输入备注信息',
          style: { marginTop: '20px' },
          onInput: (value) => (remark = value),
          autofocus: true
        })
      },
      negativeText: '取消',
      positiveText: '修改备注',
      onPositiveClick: () => {
        ServeEditContactRemark({
          friend_id: item.receiver_id,
          remark: remark
        }).then(({ code, message }) => {
          if (code == 200) {
            window['$message'].success('备注成功')
            talkStore.updateItem({
              index_name: item.index_name,
              remark: remark
            })
          } else {
            window['$message'].error(message)
          }
        })
      }
    })
  }

  // 会话列表右键菜单回调事件
  const onContextMenuTalkHandle = (key: string) => {
    // 注册回调事件
    const evnets = {
      info: onUserInfo,
      top: onToTopTalk,
      remove: onRemoveTalk,
      disturb: onSetDisturb,
      signout_group: onSignOutGroup,
      delete_contact: onDeleteContact,
      remark: onChangeRemark
    }

    dropdown.show = false
    evnets[key] && evnets[key](dropdown.item)
  }

  return { dropdown, onContextMenu, onCloseContextMenu, onContextMenuTalkHandle, onToTopTalk }
}
