import { fetchContactDelete, fetchContactEditRemark } from '@/apis/api.ts'
import { fetchApi } from '@/apis/request.ts'
import { NInput } from 'naive-ui'
import { h } from 'vue'
import { useInject } from './useInject.ts'

interface IContactParams {
  user_id: number
  nickname?: string
  remark: string
}

export function useContact() {
  const { toShowUserInfo, dialog } = useInject()

  const onDeleteContact = (item: IContactParams, fn?: () => void) => {
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
        const options = { successText: '删除联系人成功' }

        const [err] = await fetchApi(fetchContactDelete, { user_id: item.user_id }, options)
        if (err) return false

        if (fn) fn()
      }
    })
  }

  const onChangeContactRemark = (item: IContactParams, fn?: (data: any) => void) => {
    let remark = ''
    const onPositiveClick = async () => {
      const [err] = await fetchApi(
        fetchContactEditRemark,
        {
          user_id: item.user_id,
          remark: remark
        },
        {
          successText: '备注修改成功'
        }
      )

      if (err) return false

      if (fn) {
        fn({
          user_id: item.user_id,
          remark: remark
        })
      }

      return true
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
