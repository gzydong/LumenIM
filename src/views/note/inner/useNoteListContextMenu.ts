import { useCommonContextMenu, IDropdownOption } from '@/hooks/useCommonContextMenu.ts'
import { useNoteStore } from '@/store'
import { ServeDeleteArticle, ServeMoveArticleClassify } from '@/api/article'
import { toApi } from '@/api'
import { useInject } from '@/hooks'
export function useNoteListContextMenu() {
  const store = useNoteStore()
  const { dialog } = useInject()

  const { menu, ContextMenuElement } = useCommonContextMenu(handle)

  // 修改笔记分类
  const onChangeClassify = (article_id: number, classify_id: number) => {
    toApi(
      ServeMoveArticleClassify,
      { article_id, classify_id },
      {
        onSuccess: () => {
          store.loadNoteList({}, false)
          store.loadClass()
        }
      }
    )
  }

  const onDelete = (article_id: number) => {
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
        await toApi(
          ServeDeleteArticle,
          {
            article_id
          },
          {
            onSuccess: () => {
              store.loadNoteList({}, false)
              store.loadClass()
            }
          }
        )
      }
    })
  }

  function handle(key: string, option: IDropdownOption) {
    const item = menu.getItem()

    switch (key) {
      case 'delete':
        onDelete(item.article_id)
        break
      default:
        if (option.extra === 'classify') {
          onChangeClassify(item.article_id, parseInt(option.key as string))
        }
        break
    }
  }

  const onContextMenu = (e: any, note: any) => {
    const options: IDropdownOption[] = [
      {
        label: '删除笔记',
        key: 'delete'
      },
      {
        type: 'divider',
        key: 'divider'
      },
      {
        label: '修改分类',
        key: 'classify',
        children: store.class?.map((item): IDropdownOption => {
          return {
            label: item.count ? `${item.class_name} (${item.count})` : item.class_name,
            key: item.id,
            disabled: item.id === note?.classify_id,
            extra: 'classify'
          }
        })
      }
    ]

    options && menu.show(e, options, note)
  }

  return {
    onContextMenu,
    ContextMenuElement
  }
}
