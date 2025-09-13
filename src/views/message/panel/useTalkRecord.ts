import { fetchMessageRecords } from '@/apis/api'
import { useDialogueStore } from '@/store'
import { ITalkRecord } from '@/types/chat'
import { safeParseJson } from '@/utils/common'

export function useTalkRecord() {
  const dialogueStore = useDialogueStore()

  const records = computed((): ITalkRecord[] => dialogueStore.records)

  let cursor = 0

  // 加载数据列表
  const loadChatRecord = async (): Promise<boolean> => {
    const { target: talk } = dialogueStore

    const request = {
      talk_mode: talk.talk_mode,
      to_from_id: talk.to_from_id,
      cursor: cursor,
      limit: 30
    }

    try {
      console.log('Loading talk records with request:', request)
      const data = await fetchMessageRecords(request)

      if (request.talk_mode !== talk.talk_mode || request.to_from_id !== talk.to_from_id) {
        console.error('Talk mode or to_from_id changed')
        throw new Error('Talk mode or to_from_id changed')
      }

      if (request.cursor === 0) {
        dialogueStore.clearDialogueRecord()
      }

      const list = data.items.map((item: any) => {
        item.extra = safeParseJson(item.extra || '{}')
        item.quote = safeParseJson(item.quote || '{}')
        item.status = 1
        return item
      })

      dialogueStore.unshiftDialogueRecord(list.reverse())
      cursor = data.cursor

      return data.items.length < request.limit ? false : true
    } catch (error) {
      console.error('Error loading talk records:', error)
      throw error
    }
  }

  // 重置对话记录
  const resetTalkRecord = (): void => {
    cursor = 0
    dialogueStore.clearDialogueRecord()
  }

  return { records, loadChatRecord, dialogueStore, resetTalkRecord }
}
