<template>
  <el-container
    class="container animated bounceInUp"
    v-outside="closeBox"
    v-if="show"
  >
    <el-header class="no-padding header" height="50px">
      <p>
        上传管理 <span v-show="total">({{ successNum }}/{{ total }})</span>
      </p>
      <i class="close-btn el-icon-close" @click="closeBox" />
    </el-header>

    <el-main class="no-padding mian lum-scrollbar">
      <div class="empty-data" v-show="total == 0">
        <SvgNotData />
        <p>暂无上传文件</p>
      </div>

      <div
        v-for="file in items"
        v-show="!file.isDelete"
        :key="file.hashName"
        class="file-item"
      >
        <div class="file-header">
          <div class="type-icon">{{ file.ext }}</div>
          <el-tooltip :content="file.filename" placement="top-start">
            <div class="filename">{{ file.filename }}</div>
          </el-tooltip>

          <div class="status">
            <span v-if="file.status == 0">等待上传</span>
            <span v-else-if="file.status == 1" style="color: #66b1ff">
              正在上传...
            </span>
            <span v-else-if="file.status == 2" style="color: #67c23a">
              已完成
            </span>
            <span v-else style="color: red">网络异常</span>
          </div>
        </div>
        <div class="file-mian">
          <div class="progress">
            <el-progress
              type="dashboard"
              :percentage="file.progress"
              :width="50"
              :color="colors"
            />
            <span class="name">上传进度</span>
          </div>
          <div class="detail">
            <p>
              文件类型：<span>{{ file.filetype }}</span>
            </p>
            <p>
              文件大小：<span>{{ file.filesize }}</span>
            </p>
            <p>
              上传时间：<span>{{ file.datetime }}</span>
            </p>
          </div>
        </div>
        <div v-show="file.status == 2 || file.status == 3" class="file-means">
          <div class="btns" @click="removeFile(file.hashName)">删除</div>
          <div
            v-show="file.status == 3"
            class="btns"
            @click="triggerUpload(file.hashName)"
          >
            继续上传
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Vue from 'vue'
import { SvgNotData } from '@/core/icons'
import { Progress } from 'element-ui'
Vue.use(Progress)

import { ServeFindFileSplitInfo, ServeFileSubareaUpload } from '@/api/upload'
import { formateSize, getFileExt, parseTime } from '@/utils/functions'
import { ServeSendTalkFile } from '@/api/chat'

export default {
  name: 'MeEditorFileManage',
  model: {
    prop: 'show',
    event: 'close',
  },
  props: {
    show: Boolean,
  },
  components: {
    SvgNotData,
  },
  data() {
    return {
      colors: [
        {
          color: '#f56c6c',
          percentage: 20,
        },
        {
          color: '#e6a23c',
          percentage: 40,
        },
        {
          color: '#5cb87a',
          percentage: 60,
        },
        {
          color: '#1989fa',
          percentage: 80,
        },
        {
          color: '#11ce65',
          percentage: 100,
        },
      ],

      items: [],
    }
  },
  computed: {
    total() {
      return this.items.filter(item => {
        return item.isDelete === false
      }).length
    },
    successNum() {
      return this.items.filter(item => {
        return item.isDelete === false && item.status == 2
      }).length
    },
  },
  methods: {
    closeBox() {
      this.$emit('close', false)
    },

    upload(file) {
      ServeFindFileSplitInfo({
        file_name: file.name,
        file_size: file.size,
      }).then(res => {
        if (res.code == 200) {
          const { upload_id, split_size } = res.data

          this.items.unshift({
            hashName: upload_id,
            originalFile: file,
            filename: file.name,
            status: 0, // 文件上传状态 0:等待上传 1:上传中 2:上传完成 3:网络异常
            progress: 0,
            filesize: formateSize(file.size),
            filetype: file.type || '未知',
            datetime: parseTime(new Date(), '{m}-{d} {h}:{i}'),
            ext: getFileExt(file.name),
            forms: this.fileSlice(file, upload_id, split_size),
            successNum: 0,
            isDelete: false,
          })

          this.triggerUpload(upload_id)
        }
      })
    },

    // 处理拆分上传文件
    fileSlice(file, hash, eachSize) {
      const splitNum = Math.ceil(file.size / eachSize) // 分片总数
      const forms = []

      // 处理每个分片的上传操作
      for (let i = 0; i < splitNum; i++) {
        let start = i * eachSize
        let end = Math.min(file.size, start + eachSize)

        // 构建表单
        const form = new FormData()
        form.append('file', file.slice(start, end))
        form.append('upload_id', hash)
        form.append('split_index', i)
        form.append('split_num', splitNum)
        forms.push(form)
      }

      return forms
    },

    // 触发上传文件
    triggerUpload(hashName) {
      let $index = this.getFileIndex(hashName)
      if ($index < 0 || this.items[$index].isDelte) {
        return
      }

      let i = this.items[$index].successNum
      let form = this.items[$index].forms[i]
      let length = this.items[$index].forms.length
      this.items[$index].status = 1

      ServeFileSubareaUpload(form)
        .then(res => {
          if (res.code == 200) {
            $index = this.getFileIndex(hashName)
            this.items[$index].successNum++
            this.items[$index].progress = Math.floor(
              (this.items[$index].successNum / length) * 100
            )
            if (this.items[$index].successNum == length) {
              this.items[$index].status = 2
              if (res.data.is_merge) {
                ServeSendTalkFile({
                  upload_id: res.data.upload_id,
                  receiver_id: this.$store.state.dialogue.receiver_id,
                  talk_type: this.$store.state.dialogue.talk_type,
                })
              }
            } else {
              this.triggerUpload(hashName)
            }
          } else {
            this.items[$index].status = 3
          }
        })
        .catch(() => {
          $index = this.getFileIndex(hashName)
          this.items[$index].status = 3
        })
    },

    // 获取分片文件数组索引
    getFileIndex(hashName) {
      return this.items.findIndex(item => {
        return item.hashName === hashName
      })
    },

    removeFile(hashName) {
      let index = this.getFileIndex(hashName)
      this.items[index].isDelete = true
    },

    clear() {
      this.items = []
    },
  },
}
</script>
<style lang="less" scoped>
.container {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 400px;
  height: 600px;
  background-color: white;
  box-shadow: 0 0 5px #eae5e5;
  border: 1px solid #eae5e5;
  overflow: hidden;
  border-radius: 3px 3px 0 0;

  .header {
    height: 50px;
    line-height: 50px;
    position: relative;
    text-indent: 20px;
    border-bottom: 1px solid #f5eeee;

    i {
      position: absolute;
      right: 20px;
      top: 15px;
      font-size: 20px;
      cursor: pointer;
    }
  }

  .mian {
    .empty-data {
      width: 100%;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-top: 50%;

      svg {
        font-size: 70px;
      }

      p {
        margin-top: 30px;
        color: #cccccc;
        font-size: 10px;
      }
    }
  }
}

.file-item {
  width: 95%;
  min-height: 100px;
  background-color: white;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  margin: 15px auto;
  box-shadow: 0 0 5px #eae5e5;
  overflow: hidden;

  .file-header {
    height: 45px;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    border-bottom: 1px solid #f7f4f4;

    .type-icon {
      height: 30px;
      width: 30px;
      background-color: #66b1ff;
      border-radius: 50%;
      margin-left: 5px;
      font-size: 10px;
      font-weight: 200;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      color: white;
    }

    .filename {
      margin-left: 10px;
      font-size: 14px;
      width: 65%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status {
      position: absolute;
      right: 14px;
      top: 12px;
      font-size: 13px;
      color: #6b6868;
      font-weight: 200;
    }
  }

  .file-mian {
    padding: 8px;
    display: flex;
    flex-direction: row;

    .progress {
      width: 80px;
      height: 80px;
      flex-shrink: 0;
      background: #f9f6f6;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      cursor: pointer;

      .name {
        font-size: 12px;
        color: #ada8a8;
        font-weight: 300;
      }
    }

    .detail {
      flex: auto;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      padding-left: 20px;
      justify-content: center;
      align-items: flex-start;
      font-size: 13px;

      p {
        margin: 3px;
        color: #ada8a8;

        span {
          color: #595a5a;
          font-weight: 500;
        }
      }
    }
  }

  .file-means {
    width: 96.5%;
    height: 35px;
    border-top: 1px dashed rgb(234, 227, 227);
    margin: 3px auto;
    padding-top: 5px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .btns {
      width: 80px;
      height: 25px;
      border: 1px solid #e6e1e1;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 3px;
      border-radius: 15px;
      font-size: 12px;
      color: #635f5f;
      cursor: pointer;

      &:active {
        box-shadow: 0 0 5px #eae5e5;
        font-size: 13px;
      }
    }
  }
}
</style>
