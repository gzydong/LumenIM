import { defineStore } from 'pinia'

// 编辑器草稿
export const useEditorDraftStore = defineStore('editor-draft', {
  // 开启数据持久化
  persist: true,
  state: () => {
    return {
      items: {}
    }
  },
  actions: {}
})
