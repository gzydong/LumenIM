import { computed } from 'vue'
import { ServeTalkRecords } from '@/api/chat'
import { toApi } from '@/api'
import { useDialogueStore } from '@/store'
import { ITalkRecord } from '@/types/chat'

export function useTalkRecord() {
  const dialogueStore = useDialogueStore()

  const records = computed((): ITalkRecord[] => dialogueStore.records)

  let cursor = 0

  // 加载数据列表
  const loadChatRecord = async (): Promise<boolean> => {
    const { talk } = dialogueStore

    const request = {
      talk_mode: talk.talk_mode,
      to_from_id: talk.to_from_id,
      cursor: cursor,
      limit: 30
    }

    try {
      console.log('Loading talk records with request:', request)
      const { code, data, message } = await toApi(ServeTalkRecords, request)

      if (request.talk_mode !== talk.talk_mode || request.to_from_id !== talk.to_from_id) {
        console.error('Talk mode or to_from_id changed')
        throw new Error('Talk mode or to_from_id changed')
      }

      if (code !== 200) {
        console.error('API error:', message)
        throw new Error(message)
      }

      if (request.cursor === 0) {
        dialogueStore.clearDialogueRecord()
      }

      data.items.map((item: any) => {
        item.extra = JSON.parse(item.extra)
        item.quote = JSON.parse(item.quote)
      })

      dialogueStore.unshiftDialogueRecord(data.items.reverse())
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
