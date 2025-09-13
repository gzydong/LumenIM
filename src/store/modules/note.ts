import { defineStore } from 'pinia'

import {
  fetchArticleClassDelete,
  fetchArticleClassEdit,
  fetchArticleClassList,
  fetchArticleClassSort,
  fetchArticleDetail,
  fetchArticleList
} from '@/apis/api'
import { fetchApi } from '@/apis/request.ts'
import { ArticleClassListResponse_Item, ArticleListResponse_Item } from '@/apis/types'

export interface NoteFileItem {
  annex_id: number
  annex_name: string
  annex_size: number
  created_at: string
}

interface NoteStoreState {
  class: ArticleClassListResponse_Item[]
  notes: {
    loadStatus: number
    params: {
      keyword: string
      find_type: number
      classify_id: number
    }
    items: ArticleListResponse_Item[]
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
        params: { keyword: '', find_type: 1, classify_id: 0 },
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
    setParams(params: { keyword: string; find_type: number; classify_id: number }) {
      this.notes.params = Object.assign({ keyword: '', find_type: 1, classify_id: 0 }, params)
      this.loadNoteList(params, false)
    },

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
      const [err, data] = await fetchApi(fetchArticleClassList, {})
      if (err) return

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

      const [err, { items }] = await fetchApi(fetchArticleList, { ...this.notes.params })
      if (err) return

      this.notes.items = items
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

      const [err, data] = await fetchApi(fetchArticleDetail, { article_id: articleId })

      if (err || data?.article_id != this.view.loadId) return

      this.view.loadStatus = 1

      this.detail = {
        ...data,
        status: 1,
        class_name: ''
      } as NoteStoreState['detail']

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
        const [err, data] = await fetchApi(fetchArticleClassEdit, { name })
        if (err) return

        return this.class.unshift({
          id: data.classify_id,
          class_name: name,
          count: 0,
          is_default: 2
        })
      }

      const [err] = await fetchApi(fetchArticleClassEdit, { classify_id: classifyId, name })
      if (err) return

      const item = this.class.find((item) => item.id === classifyId)
      item && Object.assign(item, { class_name: name })
    },

    async deleteClass(classify_id: number) {
      const [err] = await fetchApi(fetchArticleClassDelete, { classify_id })
      if (err) return

      const index = this.class.findIndex((item) => item.id === classify_id)
      index >= 0 && this.class.splice(index, 1)
    },

    async sort(classifyIds: number[]) {
      await fetchApi(fetchArticleClassSort, { classify_ids: classifyIds })
    }
  }
})
