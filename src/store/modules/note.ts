import { defineStore } from 'pinia'
import {
  ServeGetArticleDetail,
  ServeGetArticleClass,
  ServeGetArticleTag,
  ServeGetArticleList,
  ServeEditArticleClass,
  ServeEditArticleTag,
  ServeDeleteArticleClass,
  ServeDeleteArticleTag
} from '@/api/article'

interface Tag {
  id: number
  tag_name: string
  count: number
}

interface Class {
  id: number
  class_name: string
  count: number
  is_default: number
}

export interface NoteItem {
  id: number
  title: string
  abstract: string
  class_id: number
  class_name: string
  image: string
  is_asterisk: number
  status: number
  tags_id: string
  created_at: string
  updated_at: string
}

export interface NoteFileItem {
  id: number
  created_at: string
  original_name: string
  size: number
  suffix: string
}

interface NoteStoreState {
  tags: Tag[]
  class: Class[]
  notes: {
    loadStatus: number
    params: {
      page: number
      keyword: string
      find_type: number
      cid: number
    }
    items: NoteItem[]
  }
  view: {
    editorMode: string
    loadId: number
    loadStatus: number
    detail: {
      id: number
      class_id: number
      class_name: string
      title: string
      is_asterisk: number
      status: number
      tags: {
        id: number
      }[]
      files: NoteFileItem[]
      md_content: string
      created_at: string
      updated_at: string
    }
  }
}

export const useNoteStore = defineStore('note', {
  state: (): NoteStoreState => {
    return {
      tags: [],
      class: [],

      notes: {
        loadStatus: 0,
        params: { page: 1, keyword: '', find_type: 1, cid: 0 },
        items: []
      },

      view: {
        editorMode: 'preview',
        loadId: 0,
        loadStatus: 0,
        detail: {
          id: 0,
          class_id: 0,
          title: '',
          is_asterisk: 0,
          status: 1,
          tags: [],
          files: [],
          md_content: '',
          created_at: '',
          class_name: ''
        }
      }
    }
  },

  actions: {
    close() {
      this.view.loadId = 0
    },

    addNewNote(class_id = 0) {
      this.view.detail = {
        class_id: class_id,
        class_name: '',
        created_at: '',
        files: [],
        id: 0,
        is_asterisk: 0,
        md_content: '',
        status: 1,
        tags: [],
        title: '请编辑标题！！！'
      }

      this.view.loadId = 1
      this.view.loadStatus = 1

      this.setEditorMode('edit')

      this.loadClass()
    },

    loadClass() {
      ServeGetArticleClass().then(({ code, data }) => {
        if (code != 200) return false

        this.class = data.items
      })
    },

    loadTags() {
      ServeGetArticleTag().then(({ code, data }) => {
        if (code != 200) return false

        this.tags = data.tags
      })
    },

    loadNoteList(params = {}, isReset = true) {
      if (isReset) {
        Object.assign(this.notes.params, { page: 1, keyword: '', find_type: 1, cid: 0 }, params)
      } else {
        Object.assign(this.notes.params, params)
      }

      this.notes.loadStatus = 0
      this.notes.items = []
      ServeGetArticleList(this.notes.params).then((res) => {
        this.notes.items = res.data.items

        this.notes.loadStatus = 1
      })
    },

    updateNoteItem(id: number, params = {}) {
      const item = this.notes.items.find((item) => item.id == id)

      item && Object.assign(item, params)
    },

    // 加载详情信息
    loadDetail(id: number) {
      this.view.loadId = id
      this.view.loadStatus = 0

      this.setEditorMode('preview')

      ServeGetArticleDetail({
        article_id: id
      }).then(({ code, data }) => {
        if (code != 200 && data.id != this.view.loadId) {
          return
        }

        this.view.loadStatus = 1

        data.class_name = ''

        this.view.detail = data

        const node = this.class.find((item) => {
          return item.id == data.class_id
        })

        if (node) {
          this.view.detail.class_name = node.class_name || ''
        }
      })
    },

    // 修改编辑模式
    setEditorMode(value: string) {
      this.view.editorMode = value
    },

    // 修改收藏状态
    setCollectionStatus(isTrue: boolean) {
      this.view.detail.is_asterisk = isTrue ? 1 : 0
    },

    // 编辑分类
    async editClass(class_id: number, class_name: string) {
      const res = await ServeEditArticleClass({ class_id, class_name })

      if (res && res.code === 200) {
        if (class_id === 0) {
          this.class.unshift({
            id: res.data.id,
            class_name,
            count: 0,
            is_default: 0
          })
        } else {
          const item = this.class.find((item) => item.id === class_id)

          item && Object.assign(item, { class_name })
        }
      }
    },

    async deleteClass(class_id: number) {
      const res = await ServeDeleteArticleClass({ class_id })

      if (res && res.code == 200) {
        const index = this.class.findIndex((item) => item.id === class_id)

        if (index >= 0) {
          this.class.splice(index, 1)
        }
      } else {
        window['$message'].info(res.message)
      }
    },

    // 编辑标签
    async editTag(tag_id: number, tag_name: string) {
      const res = await ServeEditArticleTag({ tag_id, tag_name })

      if (res && res.code === 200) {
        if (tag_id === 0) {
          this.tags.unshift({
            id: res.data.id,
            tag_name,
            count: 0
          })
        } else {
          const item = this.tags.find((item) => item.id === tag_id)

          item && Object.assign(item, { tag_name })
        }
      }
    },

    async deleteTag(tag_id: number) {
      const res = await ServeDeleteArticleTag({ tag_id })

      if (res && res.code == 200) {
        const index = this.tags.findIndex((item) => item.id === tag_id)

        if (index >= 0) {
          this.tags.splice(index, 1)
        }
      } else {
        window['$message'].info(res.message)
      }
    }
  }
})
