import { useInject } from './useInject.ts'
import { ServGroupSecede, ServGroupDismiss } from '@/api/group'

type GroupParmas = {
  group_id: number
  name: string
}

export function useGroup() {
  const { dialog } = useInject()
  // 解散群
  const onGroupDismiss = (params: GroupParmas, fn: Function) => {
    dialog.create({
      showIcon: false,
      title: `确定要解散[${params.name}] 群聊？ 此操作是不可逆的！`,
      content: '解散后不再接收此群的任何消息。',
      positiveText: '确定',
      negativeText: '取消',
      positiveButtonProps: {
        textColor: '#ffffff'
      },
      onPositiveClick: async () => {
        const { code } = await ServGroupDismiss({
          group_id: params.group_id
        })

        if (code == 200) {
          fn()
        }

        return code == 200
      }
    })
  }

  // 退群
  const onSignOutGroup = (params: GroupParmas, fn: Function) => {
    dialog.create({
      showIcon: true,
      title: `退出 [${params.name}] 群聊？`,
      content: '退出后不再接收此群的任何消息。',
      positiveText: '确定',
      negativeText: '取消',
      positiveButtonProps: {
        textColor: '#ffffff'
      },
      onPositiveClick: async () => {
        const { code } = await ServGroupSecede({
          group_id: params.group_id
        })

        if (code == 200) {
          fn()
        }

        return code == 200
      }
    })
  }

  return { onGroupDismiss, onSignOutGroup }
}
