import { defineStore } from 'pinia'
import { ServeFindFileSplitInfo, ServeFileSubareaUpload } from '@/api/upload'
import { ServePublishMessage } from '@/api/chat'
import { toApi } from '@/api'

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
    async initUploadFile(file: File, talkType: number, receiverId: number, username: string) {
      const { code, data } = await toApi(ServeFindFileSplitInfo, {
        file_name: file.name,
        file_size: file.size
      })

      if (code !== 200) throw new Error('Failed to find file split info.')

      const { upload_id, shard_size } = data

      // @ts-ignore
      this.items.unshift({
        file: file,
        talk_type: talkType,
        receiver_id: receiverId,
        upload_id: upload_id,
        uploadIndex: 0,
        percentage: 0,
        status: 0, // 文件上传状态 0:等待上传 1:上传中 2:上传完成 3:网络异常
        files: fileSlice(file, upload_id, shard_size),
        avatar: '',
        username: username
      })

      this.triggerUpload(upload_id)
      this.isShow = true
    },

    // 获取分片文件数组索引
    findItem(uploadId: string): any {
      return this.items.find((item: any) => item.upload_id === uploadId)
    },

    // 触发上传
    async triggerUpload(uploadId: string) {
      const item = this.findItem(uploadId)

      if (!item) return

      item.status = 1
      const { code } = await toApi(ServeFileSubareaUpload, item.files[item.uploadIndex])
      item.status = 3

      if (code !== 200) throw new Error('Failed to find file split info.')

      item.uploadIndex++

      if (item.uploadIndex === item.files.length) {
        item.status = 2
        item.percentage = 100
        this.sendUploadMessage(item)
      } else {
        item.percentage = (item.uploadIndex / item.files.length) * 100
        this.triggerUpload(uploadId)
      }
    },

    // 发送上传消息
    sendUploadMessage(item: any) {
      ServePublishMessage({
        type: 'file',
        talk_mode: item.talk_type,
        to_from_id: item.receiver_id,
        body: { upload_id: item.upload_id }
      })
    }
  }
})
