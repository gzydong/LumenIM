import { useNoteStore, useSettingsStore } from '@/store'
import { type ToolbarNames, type Themes } from 'md-editor-v3'
import {
  ServArticleCollect,
  ServArticleEdit,
  ServArticleDelete,
  ServArticleMoveClassify
} from '@/api/article'
import { ServUploadImage } from '@/api/upload'
import { downloadBlobFile } from '@/utils/file'
import { useInject } from '@/hooks'
import { debounce } from '@/utils/common'

const toolbars: ToolbarNames[] = [
  'revoke',
  'next',
  '-',
  'bold',
  'underline',
  'italic',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'unorderedList',
  'orderedList',
  'task',
  'link',
  'image',
  'table',
  'mermaid',

  '=',
  'preview',
  'fullscreen'
]

export function useNoteEditor() {
  const store = useNoteStore()
  const settingsStore = useSettingsStore()

  const { message, dialog } = useInject()

  // 加载状态
  const loadStatus = computed(() => store.view.loadStatus === 0)

  // 保存笔记加载loading
  const saveLoading = ref(false)

  const editor = reactive({
    title: store.detail.title,
    markdown: store.detail.md_content
  })

  // 当前是否是预览模式
  const isPreviewMode = computed(() => store.view.editorMode == 'preview')

  // 分类列表
  const classOptions = computed(() => {
    return store.class?.map((item) => {
      return {
        label: item.count ? `${item.class_name} (${item.count})` : item.class_name,
        value: item.id
      }
    })
  })

  // 编辑器上传图片
  const onUploadImage = async (files: File[], callback: any) => {
    if (!files.length) return

    const form = new FormData()
    form.append('file', files[0])

    const { code, data } = await ServUploadImage(form)
    if (code != 200) return

    callback([data.src])
  }

  // 收藏笔记
  const onCollection = async () => {
    const action = store.detail.is_asterisk == 1 ? 2 : 1

    const { code } = await ServArticleCollect({
      article_id: store.detail.article_id,
      action: action
    })

    if (code != 200) return

    store.setCollectionStatus(action == 1)
  }

  // 下载笔记
  const onDownload = () => {
    downloadBlobFile(store.detail.title + '.md', store.detail.md_content)
  }

  // 删除笔记
  const onDelete = () => {
    dialog.create({
      showIcon: false,
      title: `删除笔记？`,
      content: '笔记删除后30天之内，可在回收站中进行恢复。',
      positiveText: '确定',
      negativeText: '取消',
      positiveButtonProps: {
        textColor: '#ffffff'
      },
      onPositiveClick: async () => {
        await ServArticleDelete(
          {
            article_id: store.detail.article_id
          },
          {
            onSuccess: () => {
              store.loadNoteList({}, false)
              store.close()
            }
          }
        )
      }
    })
  }

  // 修改笔记分类
  const onChangeClassify = (classify_id: number) => {
    const { article_id } = store.detail

    ServArticleMoveClassify(
      { article_id, classify_id },
      {
        onSuccess: () => {
          const find = store.class.find((i) => i.id == classify_id)
          store.detail.classify_id = classify_id
          store.detail.class_name = find?.class_name || ''

          store.loadNoteList({}, false)
          store.loadClass()
        }
      }
    )
  }

  // 保存笔记
  const onSave = async (isCloseEditMode: boolean = false) => {
    if (editor.markdown == '' && store.detail.article_id == 0) {
      return store.close()
    }

    if (!editor.title.length) {
      return message.warning('请输入笔记标题')
    }

    let classify_id = store.detail.classify_id
    if (classify_id == 0) {
      classify_id = store.class.find((i) => i.is_default == 1)?.id || 0
    }

    const params = {
      article_id: store.detail.article_id,
      classify_id: classify_id,
      title: editor.title,
      md_content: editor.markdown
    }

    const { code, data } = await ServArticleEdit(params, { loading: saveLoading })
    if (code != 200) return

    if (store.detail.article_id == 0) {
      store.loadClass()
      store.loadNoteList({}, false)

      if (classify_id != 0) {
        const find = store.class.find((i) => i.id == classify_id)
        store.detail.classify_id = classify_id
        store.detail.class_name = find?.class_name || ''
      }
    } else {
      store.updateNoteItem(data.article_id, {
        article_id: data.article_id,
        abstract: data.abstract,
        image: data.image,
        title: data.title
      })
    }

    store.detail.md_content = editor.markdown
    store.detail.title = editor.title
    store.detail.article_id = data.article_id

    if (isCloseEditMode) {
      store.setEditorMode('preview')
    }

    message.success('已保存')
  }

  // 防抖的保存事件
  const onSaveDebounce = debounce(onSave, 500)

  const editorBtnText = computed(() => {
    if (isPreviewMode.value) return '编辑'

    if (editor.markdown.length == 0) return '取消编辑'

    return saveLoading.value ? '保存中..' : '保存'
  })

  // 标题输入键盘事件
  const onTitle = (e: any) => {
    editor.title = e.target.innerText.replace(/\n/g, '')
  }

  const onClickEditorBtn = () => {
    if (isPreviewMode.value) {
      store.setEditorMode('edit')
    } else {
      onSave(true)
    }
  }

  const themeMode = computed(() => settingsStore.currentThemeMode as Themes)

  watch(
    () => store.detail.article_id,
    () => {
      editor.markdown = store.detail.md_content
      editor.title = store.detail.title
    }
  )

  return {
    editor,
    classOptions,
    toolbars,
    isPreviewMode,
    onUploadImage,
    onCollection,
    onDownload,
    onDelete,
    onChangeClassify,
    onSave,
    onSaveDebounce,
    editorBtnText,
    loadStatus,
    onTitle,
    onClickEditorBtn,
    themeMode,
    detail: computed(() => store.detail)
  }
}
