<template>
  <div class="lum-dialog-mask" v-show="isShow">
    <el-container class="lum-dialog-box" v-outside="close">
      <el-header class="no-padding header" height="60px">
        <p>会话记录 ({{ records.length }})</p>
        <p class="tools">
          <i class="el-icon-close" @click="close" />
        </p>
      </el-header>
      <el-main class="no-padding main" v-loading="loading">
        <el-scrollbar class="full-height" tag="section" :native="false">
          <div v-for="record in records" :key="record.id" class="message-group">
            <div class="left-box">
              <el-avatar
                fit="contain"
                shape="square"
                :size="30"
                :src="record.avatar"
              />
            </div>

            <div class="right-box">
              <div class="msg-header">
                <span class="name">
                  {{
                    record.nickname_remarks
                      ? record.nickname_remarks
                      : record.nickname
                  }}
                </span>
                <el-divider direction="vertical" />
                <span class="time">{{ record.created_at }}</span>
              </div>

              <!-- 文本消息 -->
              <text-message
                v-if="record.msg_type == 1"
                :content="record.content"
              />

              <!-- 文件 - 图片消息 -->
              <image-message
                v-else-if="record.msg_type == 2 && record.file.file_type == 1"
                :src="record.file.file_url"
              />

              <!-- 文件 - 音频消息 -->
              <audio-message
                v-else-if="record.msg_type == 2 && record.file.file_type == 2"
                :src="record.file.file_url"
              />

              <!-- 文件 - 视频消息 -->
              <video-message
                v-else-if="record.msg_type == 2 && record.file.file_type == 3"
              />

              <!-- 文件 - 其它格式文件 -->
              <file-message
                v-else-if="record.msg_type == 2 && record.file.file_type == 4"
                :file="record.file"
                :record_id="record.id"
              />

              <!-- 代码块消息 -->
              <code-message
                v-else-if="record.msg_type == 5"
                :code="record.code_block.code"
                :lang="record.code_block.code_lang"
              />

              <div v-else class="other-message">未知消息类型</div>
            </div>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { ServeGetForwardRecords } from '@/api/chat'

export default {
  name: 'TalkForwardRecord',
  data() {
    return {
      // 记录列表
      records: [],

      // 加载状态
      loading: false,

      // 窗口是否显示
      isShow: false,
    }
  },
  methods: {
    // 加载数据列表
    loadRecords() {
      this.loading = true
      ServeGetForwardRecords({
        records_id: this.records_id,
      })
        .then(res => {
          if (res.code == 200) {
            this.records = res.data.rows
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 显示窗口
    open(records_id) {
      if (records_id != this.records_id) {
        this.records = []
      }

      this.records_id = records_id
      this.isShow = true
      this.loadRecords()
    },

    // 关闭窗口
    close() {
      this.isShow = false
    },
  },
}
</script>
<style lang="less" scoped>
.lum-dialog-mask {
  z-index: 99999;
}

.lum-dialog-box {
  width: 500px;
  max-width: 500px;
  height: 600px;
}

/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}

@import '~@/assets/css/talk/talk-records.less';
</style>
