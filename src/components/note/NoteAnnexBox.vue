<template>
  <div>
    <p>笔记附件列表({{ files.length }})</p>
    <div class="annex-box lum-scrollbar">
      <input ref="uploads" type="file" @change="uploadAnnex" />
      <div class="annex-main">
        <p v-show="files.length == 0" class="empty-text">
          暂无附件
        </p>

        <div v-for="(file, i) in files" :key="file.id" class="file-item">
          <div class="suffix">{{ file.suffix }}</div>
          <div class="content">
            <div class="filename">{{ file.original_name }}</div>
            <div class="filetool">
              <span>{{ formateTime(file.created_at) }}</span>
              <span class="size">
                {{ formateSize(file.size) }}
              </span>
              <div class="tools">
                <i class="el-icon-download" @click="downloadAnnex(file.id)" />
                <i class="el-icon-delete" @click="deleteAnnex(file.id, i)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="annex-footer">
        <p class="notice-text">最多可支持上传{{ maxNum }}个附件</p>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-upload"
          :disabled="files.length >= maxNum"
          :loading="loadStatus"
          @click="$refs.uploads.click()"
          >{{ loadStatus ? '上传中...' : '上传附件' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ServeDeleteArticleAnnex,
  ServeDownloadAnnex as downloadAnnex,
  ServeUploadArticleAnnex,
} from '@/api/article'
import { formateSize, formateTime, parseTime } from '@/utils/functions'

export default {
  name: 'NoteAnnexBox',
  props: {
    id: {
      type: Number,
      default: 0,
    },
    files: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      loadStatus: false,
      disabled: false,
      maxNum: 10,
    }
  },
  methods: {
    // 格式化文件大小
    formateSize,

    // 格式化时间显示格式
    formateTime,

    // 下载笔记附件
    downloadAnnex,

    // 删除笔记附件
    deleteAnnex(annex_id, index) {
      ServeDeleteArticleAnnex({
        annex_id,
      }).then(({ code }) => {
        if (code == 200) {
          this.$delete(this.files, index)
        }
      })
    },

    // 上传笔记附件文件
    uploadAnnex(e) {
      if (e.target.files.length == 0) {
        return false
      }

      let file = e.target.files[0]
      if (file.size / (1024 * 1024) > 5) {
        this.$message('笔记附件不能大于5M!')
        return false
      }

      let fileData = new FormData()
      fileData.append('annex', file)
      fileData.append('article_id', this.id)

      this.loadStatus = true
      ServeUploadArticleAnnex(fileData)
        .then(({ code, data }) => {
          if (code == 200) {
            this.files.push({
              id: data.id,
              original_name: data.original_name,
              created_at: parseTime(new Date()),
              size: data.size,
              suffix: data.suffix,
            })
          }
        })
        .finally(() => {
          this.loadStatus = false
        })
    },
  },
}
</script>
<style lang="less" scoped>
/* 文件管理弹出层 */
.annex-box {
  width: 300px;
  min-height: 50px;
  max-height: 675px;
  background-color: white;
  overflow-y: auto;

  .annex-main {
    min-height: 30px;
    border-bottom: 1px solid rgb(239, 233, 233);
    margin-bottom: 8px;
    padding: 5px 0;

    .empty-text {
      color: #969292;
      font-size: 12px;
      margin-top: 10px;
    }

    .file-item {
      height: 50px;
      margin-bottom: 5px;
      margin-top: 10px;

      .suffix {
        width: 50px;
        height: 100%;
        background-color: #ffcc80;
        border-radius: 3px;
        float: left;
        line-height: 50px;
        text-align: center;
        color: white;
      }

      .content {
        float: left;
        width: 247px;
        height: 100%;

        .filename {
          padding-left: 5px;
          color: #172b4d;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .filetool {
          color: #505f79;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.6;
          padding-left: 5px;
          margin-top: 9px;
          position: relative;

          span {
            margin: 0 3px;
            &.size {
              color: #3a8ee6;
            }
          }
        }

        .tools {
          position: absolute;
          top: -5px;
          right: 5px;
          width: 55px;
          height: 24px;
          text-align: right;
          line-height: 28px;

          i {
            font-size: 16px;
            cursor: pointer;
            margin-right: 5px;
          }

          .el-icon-download {
            color: #66b1ff;
          }

          .el-icon-delete {
            color: red;
          }
        }
      }
    }
  }

  input {
    display: none;
  }

  .annex-footer {
    .notice-text {
      font-size: 12px;
      color: #ccc;
      text-align: left;
      float: left;
      padding-top: 10px;
    }

    button {
      float: right;
    }
  }
}
</style>
