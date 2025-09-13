import { fetchTalkSessionDelete, fetchTalkSessionDisturb, fetchTalkSessionTop } from '@/apis/api'
import { fetchApi } from '@/apis/request'
import { useContact, useGroup, useInject } from '@/hooks'
import { IDropdownOption, useCommonContextMenu } from '@/hooks/useCommonContextMenu.ts'
import { useDialogueStore, useTalkStore } from '@/store'
import { ISession } from '@/types/chat'
import { renderIcon } from '@/utils/common'
import {
  ArrowDown,
  ArrowUp,
  Clear,
  CloseRemind,
  Delete,
  EditTwo,
  IdCard,
  Remind
} from '@icon-park/vue-next'

export function useSessionMenu() {
  const dialogueStore = useDialogueStore()
  const talkStore = useTalkStore()
  const { message, toShowUserInfo } = useInject()

  const { onDeleteContact: onDeleteContact2, onChangeContactRemark } = useContact()
  const { onSignOutGroup: onSignOutGroup2 } = useGroup()
  const { menu, ContextMenuElement } = useCommonContextMenu(onContextMenuTalkHandle)

  // 当前会话索引
  const indexName = computed(() => dialogueStore.index_name)

  const onContextMenu = (e: any, item: ISession) => {
    const options: IDropdownOption[] = []

    if (item.talk_mode === 1 && item.is_robot !== 1) {
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
      type: 'divider'
    })

    if (item.talk_mode == 1 && item.is_robot !== 1) {
      options.push({
        icon: renderIcon(Delete),
        label: '删除好友',
        key: 'delete_contact'
      })
    }

    if (item.talk_mode === 2) {
      options.push({
        icon: renderIcon(Delete),
        label: '退出群聊',
        key: 'signout_group'
      })
    }

    options.push({
      icon: renderIcon(Clear),
      label: '移除会话',
      key: 'remove'
    })

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
  const onRemoveTalk = async (item: ISession) => {
    const [err] = await fetchApi(fetchTalkSessionDelete, {
      talk_mode: item.talk_mode,
      to_from_id: item.to_from_id
    })

    if (!err) {
      onDeleteTalk(item.index_name)
    }
  }

  // 设置消息免打扰
  const onSetDisturb = async (item: ISession) => {
    const [err] = await fetchApi(fetchTalkSessionDisturb, {
      talk_mode: item.talk_mode,
      to_from_id: item.to_from_id,
      action: item.is_disturb === 2 ? 1 : 2
    })

    if (!err) {
      talkStore.updateItem({
        index_name: item.index_name,
        is_disturb: item.is_disturb === 1 ? 2 : 1
      })
    }
  }

  // 置顶会话
  const onToTopTalk = async (item: ISession) => {
    if (item.is_top === 2 && talkStore.topItems.length >= 18) {
      return message.warning('置顶最多不能超过18个会话')
    }

    const [err] = await fetchApi(fetchTalkSessionTop, {
      talk_mode: item.talk_mode,
      to_from_id: item.to_from_id,
      action: item.is_top === 2 ? 1 : 2
    })

    if (!err) {
      talkStore.updateItem({
        index_name: item.index_name,
        is_top: item.is_top === 1 ? 2 : 1
      })
    }
  }

  // 移除联系人
  const onDeleteContact = (item: ISession) => {
    onDeleteContact2(
      {
        user_id: item.to_from_id,
        nickname: item.name,
        remark: item.remark
      },
      () => {
        onDeleteTalk(item.index_name)
      }
    )
  }

  // 退出群聊
  const onSignOutGroup = (item: ISession) => {
    onSignOutGroup2(
      {
        group_id: item.to_from_id,
        name: item.name
      },
      () => {
        onDeleteTalk(item.index_name)
      }
    )
  }

  const onChangeRemark = (item: ISession) => {
    onChangeContactRemark(
      {
        user_id: item.to_from_id,
        remark: item.remark
      },
      ({ remark }) => {
        talkStore.updateItem({
          index_name: item.index_name,
          remark: remark
        })
      }
    )
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
