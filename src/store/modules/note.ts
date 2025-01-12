import { defineStore } from 'pinia'
import {
  ServeGetArticleDetail,
  ServeGetArticleClass,
  ServeGetArticleList,
  ServeCreateArticleClass,
  ServeUpdateArticleClass,
  ServeDeleteArticleClass
} from '@/api/article'

import { toApi } from '@/api'

interface Class {
  id: number
  class_name: string
  count: number
  is_default: number
}

export interface NoteItem {
  article_id: number
  title: string
  abstract: string
  classify_id: number
  class_name: string
  image: string
  is_asterisk: number
  status: number
  tags_id: string
  created_at: string
  updated_at: string
}

export interface NoteFileItem {
  annex_id: number
  annex_name: string
  annex_size: number
  created_at: string
}

interface NoteStoreState {
  class: Class[]
  notes: {
    loadStatus: number
    params: {
      keyword: string
      find_type: number
      classify_id: number
      tag_id: number
    }
    items: NoteItem[]
  }
  view: {
    editorMode: string
    loadId: number
    loadStatus: number
  }
  detail: {
    article_id: number
    classify_id: number
    class_name: string
    title: string
    is_asterisk: number
    status: number
    tag_ids: {
      id: number
    }[]
    annex_list: NoteFileItem[]
    md_content: string
    created_at: string
    updated_at: string
  }
}

export const useNoteStore = defineStore('note', {
  state: (): NoteStoreState => {
    return {
      class: [],

      notes: {
        loadStatus: 0,
        params: { keyword: '', find_type: 1, classify_id: 0, tag_id: 0 },
        items: []
      },

      view: {
        editorMode: 'preview',
        loadId: 0,
        loadStatus: 0
      },
      detail: {
        article_id: 0,
        classify_id: 0,
        title: '',
        is_asterisk: 0,
        status: 1,
        tag_ids: [],
        annex_list: [],
        md_content: '',
        created_at: '',
        class_name: '',
        updated_at: ''
      }
    }
  },

  actions: {
    close() {
      this.view.loadId = 0
    },

    addNewNote(class_id = 0) {
      this.detail = {
        classify_id: class_id,
        class_name: '',
        created_at: '',
        annex_list: [],
        article_id: 0,
        is_asterisk: 2,
        md_content: '',
        status: 1,
        tag_ids: [],
        title: '',
        updated_at: ''
      }

      this.view.loadId = 1
      this.view.loadStatus = 1

      this.setEditorMode('edit')

      this.loadClass()
    },

    async loadClass() {
      const { code, data } = await toApi(ServeGetArticleClass)
      if (code != 200) return

      this.class = data.items
    },

    async loadNoteList(params = {}, isReset = true) {
      if (isReset) {
        Object.assign(this.notes.params, { keyword: '', find_type: 1, classify_id: 0 }, params)
      } else {
        Object.assign(this.notes.params, params)
      }

      this.notes.loadStatus = 0
      this.notes.items = []

      const { code, data } = await toApi(ServeGetArticleList, { ...this.notes.params })
      if (code != 200) return

      this.notes.items = data.items
      this.notes.loadStatus = 1
    },

    updateNoteItem(id: number, params = {}) {
      const item = this.notes.items.find((item) => item.article_id == id)

      item && Object.assign(item, params)
    },

    // 加载详情信息
    async loadDetail(articleId: number) {
      this.view.loadId = articleId
      this.view.loadStatus = 0

      this.setEditorMode('preview')

      const { code, data } = await toApi(ServeGetArticleDetail, { article_id: articleId })

      if (code != 200 || data.article_id != this.view.loadId) return

      this.view.loadStatus = 1

      this.detail = data

      const node = this.class.find((item) => item.id == data.classify_id)
      if (node) {
        this.detail.class_name = node.class_name || '默认分类'
      }
    },

    // 修改编辑模式
    setEditorMode(value: string) {
      this.view.editorMode = value
    },

    // 修改收藏状态
    setCollectionStatus(isTrue: boolean) {
      this.detail.is_asterisk = isTrue ? 1 : 0
    },

    // 编辑分类
    async editClass(classifyId: number, name: string) {
      if (classifyId === 0) {
        // 创建
        const { code, data } = await toApi(ServeCreateArticleClass, { name })
        if (code != 200) return

        return this.class.unshift({
          id: data.classify_id,
          class_name: name,
          count: 0,
          is_default: 2
        })
      }

      // 更新
      const { code } = await toApi(ServeUpdateArticleClass, { classify_id: classifyId, name })
      if (code != 200) return

      const item = this.class.find((item) => item.id === classifyId)
      item && Object.assign(item, { class_name: name })
    },

    async deleteClass(classify_id: number) {
      const { code } = await toApi(ServeDeleteArticleClass, { classify_id })
      if (code != 200) return

      const index = this.class.findIndex((item) => item.id === classify_id)

      index >= 0 && this.class.splice(index, 1)
    }
  }
})
