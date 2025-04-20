import { useInject } from './useInject.ts'
import { ServContactDelete, ServContactEditRemark } from '@/api/contact.ts'
import { NInput } from 'naive-ui'
import { h } from 'vue'

interface IContactParams {
  user_id: number
  nickname?: string
  remark: string
}

export function useContact() {
  const { toShowUserInfo, dialog } = useInject()

  const onDeleteContact = (item: IContactParams, fn?: Function) => {
    dialog.create({
      showIcon: false,
      title: `删除好友`,
      content: () => {
        return (
          <>
            你要删除与【<span style={{ color: 'red' }}>{item.remark || item.nickname}</span>
            】好友的关系？请注意，删除操作将永久切断与该联系人的消息往来，您将不再接收任何来自他(她)们的信息。
          </>
        )
      },
      positiveText: '确定',
      negativeText: '取消',
      positiveButtonProps: {
        textColor: '#ffffff'
      },
      onPositiveClick: async () => {
        await ServContactDelete(
          { user_id: item.user_id },
          {
            successText: '删除联系人成功',
            onSuccess: () => {
              fn && fn()
            }
          }
        )
      }
    })
  }

  const onChangeContactRemark = (item: IContactParams, fn?: Function) => {
    let remark = ''
    const onPositiveClick = async () => {
      const { code } = await ServContactEditRemark(
        {
          user_id: item.user_id,
          remark: remark
        },
        {
          successText: '备注修改成功',
          onSuccess: () => {
            if (fn) {
              fn({
                user_id: item.user_id,
                remark: remark
              })
            }
          }
        }
      )

      return code == 200
    }

    dialog.create({
      showIcon: false,
      title: '修改备注',
      content: () => {
        return h(NInput, {
          defaultValue: item.remark,
          placeholder: '请输入备注信息',
          style: { marginTop: '20px' },
          onInput: (value: string) => (remark = value)
        })
      },
      negativeText: '取消',
      positiveText: '修改备注',
      positiveButtonProps: {
        textColor: '#ffffff'
      },
      onPositiveClick
    })
  }

  return {
    toShowUserInfo,
    onDeleteContact,
    onChangeContactRemark
  }
}
