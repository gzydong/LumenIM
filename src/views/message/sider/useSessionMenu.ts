import { ISession } from '@/types/chat'
import { renderIcon } from '@/utils/common'
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
import { useCommonContextMenu, IDropdownOption } from '@/hooks/useCommonContextMenu.ts'
import { useInject } from '@/hooks'

export function useSessionMenu() {
  const dialogueStore = useDialogueStore()
  const talkStore = useTalkStore()
  const { dialog, message, toShowUserInfo } = useInject()
  const { menu, ContextMenuElement } = useCommonContextMenu(onContextMenuTalkHandle)

  // 当前会话索引
  const indexName = computed(() => dialogueStore.index_name)

  const onContextMenu = (e: any, item: ISession) => {
    const options: IDropdownOption[] = []

    if (item.talk_mode === 1) {
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
      icon: renderIcon(item.is_top === 1 ? ArrowDown : ArrowUp),
      label: item.is_top === 1 ? '取消置顶' : '会话置顶',
      key: 'top'
    })

    options.push({
      icon: renderIcon(item.is_disturb === 1 ? CloseRemind : Remind),
      label: item.is_disturb === 1 ? '关闭免打扰' : '开启免打扰',
      key: 'disturb'
    })

    options.push({
      icon: renderIcon(Clear),
      label: '移除会话',
      key: 'remove'
    })

    if (item.talk_mode == 1) {
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

    options && menu.show(e, options, item)
  }

  const onDeleteTalk = (index_name = '') => {
    talkStore.delItem(index_name)

    index_name === indexName.value && dialogueStore.$reset()
  }

  const onUserInfo = (item: ISession) => {
    toShowUserInfo(item.to_from_id)
  }

  // 移除会话
  const onRemoveTalk = (item: ISession) => {
    ServeDeleteTalkList({
      talk_mode: item.talk_mode,
      to_from_id: item.to_from_id
    }).then(({ code }) => {
      if (code == 200) {
        onDeleteTalk(item.index_name)
      }
    })
  }

  // 设置消息免打扰
  const onSetDisturb = (item: ISession) => {
    ServeSetNotDisturb({
      talk_mode: item.talk_mode,
      to_from_id: item.to_from_id,
      action: item.is_disturb === 2 ? 1 : 2
    }).then(({ code, message }) => {
      if (code == 200) {
        message.success('设置成功!')
        talkStore.updateItem({
          index_name: item.index_name,
          is_disturb: item.is_disturb === 1 ? 2 : 1
        })
      } else {
        message.error(message)
      }
    })
  }

  // 置顶会话
  const onToTopTalk = (item: ISession) => {
    if (item.is_top === 2 && talkStore.topItems.length >= 18) {
      return message.warning('置顶最多不能超过18个会话')
    }

    ServeTopTalkList({
      talk_mode: item.talk_mode,
      to_from_id: item.to_from_id,
      action: item.is_top === 2 ? 1 : 2
    }).then(({ code, message }) => {
      if (code == 200) {
        talkStore.updateItem({
          index_name: item.index_name,
          is_top: item.is_top === 1 ? 2 : 1
        })
      } else {
        message.error(message)
      }
    })
  }

  // 移除联系人
  const onDeleteContact = (item: ISession) => {
    const name = item.remark || item.name

    dialog.create({
      showIcon: false,
      title: `删除 [${name}] 联系人？`,
      content: '删除后不再接收对方任何消息。',
      positiveText: '确定',
      negativeText: '取消',
      positiveButtonProps: {
        textColor: '#ffffff'
      },
      onPositiveClick: () => {
        ServeDeleteContact({
          user_id: item.to_from_id
        }).then(({ code, message }) => {
          if (code == 200) {
            message.success('删除联系人成功')
            onDeleteTalk(item.index_name)
          } else {
            message.error(message)
          }
        })
      }
    })
  }

  // 退出群聊
  const onSignOutGroup = (item: ISession) => {
    dialog.create({
      showIcon: false,
      title: `退出 [${item.name}] 群聊？`,
      content: '退出后不再接收此群的任何消息。',
      positiveText: '确定',
      negativeText: '取消',
      positiveButtonProps: {
        textColor: '#ffffff'
      },
      onPositiveClick: () => {
        ServeSecedeGroup({
          group_id: item.to_from_id
        }).then(({ code, message }) => {
          if (code == 200) {
            message.success('已退出群聊')
            onDeleteTalk(item.index_name)
          } else {
            message.error(message)
          }
        })
      }
    })
  }

  const onChangeRemark = (item: ISession) => {
    let remark = ''
    dialog.create({
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
      positiveButtonProps: {
        textColor: '#ffffff'
      },
      onPositiveClick: () => {
        ServeEditContactRemark({
          user_id: item.to_from_id,
          remark: remark
        }).then(({ code, message }) => {
          if (code == 200) {
            message.success('备注成功')
            talkStore.updateItem({
              index_name: item.index_name,
              remark: remark
            })
          } else {
            message.error(message)
          }
        })
      }
    })
  }

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

  // 会话列表右键菜单回调事件
  function onContextMenuTalkHandle(key: string, _: IDropdownOption) {
    const item = menu.getItem()
    evnets[key] && evnets[key](item)
  }

  return { onContextMenu, ContextMenuElement, onToTopTalk }
}
