import { defineStore } from 'pinia'
import { ServeFindFileSplitInfo, ServeFileSubareaUpload } from '@/api/upload'
import { ServeSendTalkFile } from '@/api/chat'

// @ts-ignore
const message = window.$message

// 处理拆分上传文件
function fileSlice(file: File, uploadId: string, eachSize: number) {
  const splitNum = Math.ceil(file.size / eachSize) // 分片总数
  const items: FormData[] = []

  // 处理每个分片的上传操作
  for (let i = 0; i < splitNum; i++) {
    const start = i * eachSize
    const end = Math.min(file.size, start + eachSize)

    const form = new FormData()
    form.append('file', file.slice(start, end))
    form.append('upload_id', uploadId)
    form.append('split_index', `${i + 1}`)
    form.append('split_num', `${splitNum}`)

    items.push(form)
  }

  return items
}

export const useUploadsStore = defineStore('uploads', {
  state: () => {
    return {
      isShow: false,
      items: []
    }
  },
  getters: {
    successCount: (state) => {
      return state.items.filter((item: any) => {
        return item.status === 2
      }).length
    }
  },
  actions: {
    close() {
      this.isShow = false
    },

    // 初始化上传
    initUploadFile(file: File, talkType: number, receiverId: number, username: string) {
      ServeFindFileSplitInfo({
        file_name: file.name,
        file_size: file.size
      }).then((res) => {
        if (res.code == 200) {
          const { upload_id, split_size } = res.data

          // @ts-ignore
          this.items.unshift({
            file: file,
            talk_type: talkType,
            receiver_id: receiverId,
            upload_id: upload_id,
            uploadIndex: 0,
            percentage: 0,
            status: 0, // 文件上传状态 0:等待上传 1:上传中 2:上传完成 3:网络异常
            files: fileSlice(file, upload_id, split_size),
            avatar: '',
            username: username
          })

          this.triggerUpload(upload_id)
          this.isShow = true
        } else {
          message.error(res.message)
        }
      })
    },

    // 获取分片文件数组索引
    findItem(uploadId: string): any {
      return this.items.find((item: any) => item.upload_id === uploadId)
    },

    // 触发上传
    triggerUpload(uploadId: string) {
      const item = this.findItem(uploadId)

      const form = item.files[item.uploadIndex]

      item.status = 1

      ServeFileSubareaUpload(form)
        .then((res) => {
          if (res.code == 200) {
            item.uploadIndex++

            if (item.uploadIndex === item.files.length) {
              item.status = 2
              item.percentage = 100
              this.sendUploadMessage(item)
            } else {
              const percentage = (item.uploadIndex / item.files.length) * 100
              item.percentage = percentage.toFixed(1)
              this.triggerUpload(uploadId)
            }
          } else {
            item.status = 3
          }
        })
        .catch(() => {
          item.status = 3
        })
    },

    // 发送上传消息
    sendUploadMessage(item: any) {
      ServeSendTalkFile({
        upload_id: item.upload_id,
        receiver_id: item.receiver_id,
        talk_type: item.talk_type
      })
    }
  }
})
