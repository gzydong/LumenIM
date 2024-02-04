import { useInject } from './useInject'
import { ServeDeleteContact, ServeEditContactRemark } from '@/api/contact'
import { toApi } from '@/api'
import { NInput } from 'naive-ui'
import { h } from 'vue'

interface onDeleteContactParams {
  user_id: number
  nickname: string
  remark: string
}

interface onEditContactRemarkParams {
  user_id: number
  nickname: string
  remark: string
}

export function useContact() {
  const { toShowUserInfo, dialog } = useInject()

  const onDeleteContact = (item: onDeleteContactParams, fn?: Function) => {
    dialog.error({
      title: `删除 (${item.remark || item.nickname}) 好友？`,
      content:
        '请注意，删除操作将永久切断与该联系人的消息往来，您将不再接收任何来自他(她)们的信息。',
      positiveText: '确定',
      negativeText: '取消',
      positiveButtonProps: {
        textColor: '#ffffff'
      },
      onPositiveClick: async () => {
        await toApi(
          ServeDeleteContact,
          { user_id: item.user_id },
          {
            showMessageText: '删除联系人成功',
            onSuccess: () => {
              fn && fn()
            }
          }
        )
      }
    })
  }

  const onEditContactRemark = (item: onEditContactRemarkParams, fn?: Function) => {
    let remark = ''
    dialog.create({
      showIcon: false,
      title: '修改备注',
      content: () => {
        return h(NInput, {
          defaultValue: item.remark,
          placeholder: '请输入备注信息',
          style: { marginTop: '20px' },
          onInput: (value: string) => (remark = value),
          autofocus: true
        })
      },
      negativeText: '取消',
      positiveText: '修改备注',
      positiveButtonProps: {
        textColor: '#ffffff'
      },
      onPositiveClick: async () => {
        await toApi(
          ServeEditContactRemark,
          {
            user_id: item.user_id,
            remark: remark
          },
          {
            showMessageText: '备注修改成功',
            onSuccess: () => {
              fn && fn()
            }
          }
        )
      }
    })
  }

  return {
    toShowUserInfo,
    onDeleteContact,
    onEditContactRemark
  }
}
