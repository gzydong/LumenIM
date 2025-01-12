import { bus } from '@/utils'
import { ITalkRecord } from '@/types/chat'
import { clipboard, htmlDecode, clipboardImage } from '@/utils/common'
import { downloadImage, getFilenameFromUrl } from '@/utils/file'
import MultiSelectFooter from './MultiSelectFooter.vue'
import { useDialogueStore, useUserStore } from '@/store'
import { useInject } from '@/hooks'

export function useContextMenu(chat: any) {
  const multiSelectCount = ref(0)
  const isShowMultiSelect = ref(false)

  const dialogueStore = useDialogueStore()
  const userStore = useUserStore()
  const { message } = useInject()

  const contextMenuOptions = (item: ITalkRecord) => {
    const options: any[] = []

    if ([1, 3].includes(item.msg_type)) {
      options.push({ label: '复制', key: 'copy' })
    }

    // 仅支持2分钟内的消息撤回
    if (
      Date.now() - new Date(item.send_time).getTime() < 2 * 60 * 1000 &&
      item.from_id === userStore.uid
    ) {
      // 目前仅支持自己发送的消息才能撤回
      options.push({ label: '撤回', key: 'revoke' })
    }

    options.push({ label: '回复', key: 'quote' })
    options.push({ label: '删除', key: 'delete' })
    options.push({ label: '多选', key: 'multiSelect' })

    if ([3, 4, 5].includes(item.msg_type)) {
      options.push({ label: '下载', key: 'download' })
    }

    if ([3].includes(item.msg_type)) {
      options.push({ label: '收藏', key: 'collect' })
    }

    return options
  }

  const onContextMenuEvent = (key: string, item: ITalkRecord) => {
    const evnets = {
      copy: onCopy,
      download: onDownload,
      quote: onQuote,
      revoke: onRevoke,
      multiSelect: onMultiSelect,
      delete: onDelete,
      collect: onCollectImage
    }

    evnets[key] && evnets[key](item)
  }

  const onCollectImage = (data: ITalkRecord) => {
    dialogueStore.ApiCollectImage({
      url: data.extra?.url
    })
  }

  const onQuote = (item: ITalkRecord) => {
    const data = {
      id: item.msg_id,
      title: `${item.nickname} ${item.send_time}`,
      describe: '',
      image: ''
    }

    switch (item.msg_type) {
      case 1:
        data.describe = item?.extra?.content
        break // 文本消息
      case 2:
        data.describe = '[代码消息]'
        break // 代码消息
      case 3:
        data.image = item.extra.url
        break // 图片文件
      case 4:
        data.describe = '[语音文件]'
        break // 语音文件
      case 5:
        data.describe = '[视频文件]'
        break // 视频文件
      case 6:
        data.describe = '[其它文件]'
        break // 其它文件
      case 7:
        data.describe = '[位置消息]'
        break // 位置消息
      case 8:
        data.describe = '[名片消息]'
        break // 名片消息
      case 9:
        data.describe = '[转发消息]'
        break // 转发消息
      case 10:
        data.describe = '[登录消息]'
        break // 登录消息
      case 11:
        data.describe = '[投票消息]'
        break // 投票消息
      case 12:
        data.describe = '[图文消息]'
        break // 图文消息
    }

    bus.emit('editor:quote', data)
  }

  const onCopy = (item: ITalkRecord) => {
    if (item.msg_type == 1) {
      if (item.extra.content && item.extra.content.length > 0) {
        return clipboard(htmlDecode(item.extra.content), () => message.success('复制成功'))
      }
    }

    if (item.extra?.url) {
      return clipboardImage(item.extra.url, () => {
        message.success('复制成功')
      })
    }
  }

  const onDownload = (item: ITalkRecord) => {
    if (item.msg_type == 3) {
      const filename = getFilenameFromUrl(item.extra?.url)
      return downloadImage(item.extra.url, filename || '文件')
    }

    if (item.msg_type == 4) {
      return message.info('音频暂不支持下载!')
    }

    if (item.msg_type == 5) {
      return message.info('视频暂不支持下载!')
    }

    return message.info('该类型文件暂不支持下载!')
  }

  const onRevoke = (item: ITalkRecord) => {
    dialogueStore.ApiRevokeRecord(item.msg_id)
    item.is_revoked = 1
  }

  const onDelete = (item: ITalkRecord) => {
    dialogueStore.ApiDeleteRecord([item.msg_id])
  }

  const onMultiSelect = (item: ITalkRecord) => {
    chat.value?.enableMultiSelect(true)
    chat.value?.setMultiSelect([item.msg_id])
  }

  const onCloseMultiSelect = () => {
    chat.value?.enableMultiSelect(false)
    isShowMultiSelect.value = false
  }

  const onMultiSelectDelete = () => {
    if (multiSelectCount.value == 0) {
      return message.info('请选择要删除的消息')
    }

    dialogueStore.ApiDeleteRecord(chat.value?.getMultiSelect())
    chat.value?.enableMultiSelect(false)
    isShowMultiSelect.value = false
  }

  const onChatElementSelect = (elements: string[]) => {
    isShowMultiSelect.value = true
    multiSelectCount.value = elements.length
  }

  const onMultiSelectForward = (mode: string, items: { id: number; type: number }[]) => {
    if (multiSelectCount.value == 0) {
      return message.info('请选择要转发的消息')
    }

    dialogueStore.ApiForwardRecord({
      talk_mode: dialogueStore.target.talk_mode,
      to_from_id: dialogueStore.target.to_from_id,
      body: {
        action: mode == 'merge' ? 2 : 1,
        msg_ids: chat.value?.getMultiSelect(),
        user_ids: items.filter((item) => item.type == 1).map((item) => item.id),
        group_ids: items.filter((item) => item.type == 2).map((item) => item.id)
      }
    })

    chat.value?.enableMultiSelect(false)
    isShowMultiSelect.value = false
  }

  const MultiSelectComponent = defineComponent(() => {
    return () => {
      return h(MultiSelectFooter, {
        count: multiSelectCount.value,
        onClose: onCloseMultiSelect,
        onDelete: onMultiSelectDelete,
        onForward: onMultiSelectForward
      })
    }
  })

  return {
    multiSelectCount,
    isShowMultiSelect,
    contextMenuOptions,
    onContextMenuEvent,
    onChatElementSelect,
    MultiSelectComponent
  }
}
