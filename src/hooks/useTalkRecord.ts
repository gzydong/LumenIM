import { reactive, computed, nextTick } from 'vue'
import { ServeTalkRecords } from '@/api/chat'
import { useDialogueStore } from '@/store'
import { ITalkRecord } from '@/types/chat'
import { formatTalkRecord } from '@/utils/talk'
import { addClass, removeClass } from '@/utils/dom'

interface Params {
  toFromId: number
  talkMode: number
  limit: number
}

const getChatPanelElement = (): HTMLElement | null => {
  return document.getElementById('imChatPanel')
}

export const useTalkRecord = (uid: number) => {
  const dialogueStore = useDialogueStore()

  const records = computed((): ITalkRecord[] => dialogueStore.records)

  const location = reactive({
    msgid: '',
    num: 0
  })

  const loadConfig = reactive({
    toFromId: 0,
    talkMode: 0,
    status: 0,
    cursor: 0
  })

  const onJumpMessage = (msgid: string) => {
    const element = document.getElementById(msgid)
    if (!element) {
      if (location.msgid == '') {
        location.msgid = msgid
        location.num = 3
      } else {
        location.num--

        if (location.num === 0) {
          location.msgid = ''
          location.num = 0
          window['$message'].info('仅支持查看最近300条的记录')
          return
        }
      }

      return getChatPanelElement()?.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    location.msgid = ''
    location.num = 0

    element?.scrollIntoView({
      behavior: 'smooth'
    })

    addClass(element, 'border')

    setTimeout(() => {
      element && removeClass(element, 'border')
    }, 3000)
  }

  // 加载数据列表
  const load = async (params: Params) => {
    const request = {
      talk_mode: params.talkMode,
      to_from_id: params.toFromId,
      cursor: loadConfig.cursor,
      limit: 30
    }

    loadConfig.status = 0

    let scrollHeight = 0
    const el = getChatPanelElement()
    if (el) {
      scrollHeight = el.scrollHeight
    }

    const { data, code } = await ServeTalkRecords(request)
    if (code != 200) {
      return (loadConfig.status = 1)
    }

    // 防止对话切换过快，数据渲染错误
    if (request.talk_mode != loadConfig.talkMode || request.to_from_id != loadConfig.toFromId) {
      return (location.msgid = '')
    }

    const items = (data.items || []).map((item: ITalkRecord) => formatTalkRecord(uid, item))

    if (request.cursor == 0) {
      // 判断是否是初次加载
      dialogueStore.clearDialogueRecord()
    }

    dialogueStore.unshiftDialogueRecord(items.reverse())

    loadConfig.status = items.length >= request.limit ? 1 : 2

    loadConfig.cursor = data.cursor

    nextTick(() => {
      const el = getChatPanelElement()

      if (el) {
        if (request.cursor == 0) {
          el.scrollTop = el.scrollHeight
          setTimeout(() => (el.scrollTop = el.scrollHeight), 10)
          setTimeout(() => (el.scrollTop = el.scrollHeight), 60)
          setTimeout(() => (el.scrollTop = el.scrollHeight), 120)
        } else {
          el.scrollTop = el.scrollHeight - scrollHeight
        }
      }

      if (location.msgid) {
        onJumpMessage(location.msgid)
      }
    })
  }

  const onRefreshLoad = () => {
    if (loadConfig.status == 1) {
      load({
        toFromId: loadConfig.toFromId,
        talkMode: loadConfig.talkMode,
        limit: 30
      })
    }
  }

  const onLoad = (params: Params) => {
    loadConfig.cursor = 0
    loadConfig.toFromId = params.toFromId
    loadConfig.talkMode = params.talkMode

    load(params)
  }

  return { loadConfig, records, onLoad, onRefreshLoad, onJumpMessage }
}
