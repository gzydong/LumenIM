<template>
  <div class="lum-dialog-mask animated fadeIn" v-show="isShow">
    <el-container class="lum-dialog-box" v-outside="close">
      <el-header class="padding0 header" height="60px">
        <p>会话记录 ({{ records.length }})</p>
        <p class="tools">
          <i class="el-icon-close" @click="close"></i>
        </p>
      </el-header>

      <el-main class="padding0 main" v-if="loadStatus == 0">
        <div class="loading">
          <div class="ant-spin ant-spin-lg ant-spin-spinning">
            <span class="ant-spin-dot ant-spin-dot-spin">
              <i class="ant-spin-dot-item"></i>
              <i class="ant-spin-dot-item"></i>
              <i class="ant-spin-dot-item"></i>
              <i class="ant-spin-dot-item"></i>
            </span>
          </div>
          <p>正在努力加载中 ...</p>
        </div>
      </el-main>

      <el-main class="padding0 main" v-else>
        <el-scrollbar :native="false" tag="section" class="hv100">
          <div
            class="message-group"
            v-for="(record, i) in records"
            :key="record.id"
          >
            <div class="left-box">
              <img :src="record.avatar" :onerror="$store.state.detaultAvatar" />
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
                <span class="time">/ {{ record.created_at }}</span>
              </div>

              <!-- 文本消息 -->
              <div class="msg-text" v-if="record.msg_type == 1">
                <pre
                  class="pre"
                  v-html="record.content"
                  v-href="'rgb(51, 51, 51)'"
                ></pre>
              </div>

              <!-- 文件-图片消息 -->
              <div
                class="msg-image"
                v-else-if="record.msg_type == 2 && record.file.file_type == 1"
              >
                <el-image
                  :lazy="true"
                  fit="cover"
                  :style="getImgStyle(record.file.file_url)"
                  :src="record.file.file_url"
                  @click="catImages(record.file.file_url)"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                  <div slot="placeholder" class="image-slot">图片加载中</div>
                </el-image>
              </div>

              <!-- 文件-音频消息 -->
              <div
                class="msg-audio"
                v-else-if="record.msg_type == 2 && record.file.file_type == 2"
              >
                文件-音频消息
              </div>

              <!-- 文件-视频消息 -->
              <div
                class="msg-video"
                v-else-if="record.msg_type == 2 && record.file.file_type == 3"
              >
                文件-视频消息
              </div>

              <!-- 其它格式的文件消息 -->
              <div
                class="msg-file"
                v-else-if="record.msg_type == 2 && record.file.file_type == 4"
              >
                <div class="file-icon">
                  {{ record.file.file_suffix.toUpperCase() }}
                </div>
                <div class="file-info">
                  <p>{{ record.file.original_name }}</p>
                  <p>
                    {{ renderSize(record.file.file_size) }}
                    <span>该文件永久保存</span>
                  </p>
                </div>
                <div class="file-tool">
                  <i
                    class="iconfont icon-download"
                    @click="download(record.id)"
                  ></i>
                </div>
              </div>

              <!-- 代码块消息 -->
              <div class="msg-text" v-else-if="record.msg_type == 5">
                <pre class="pre" v-text="record.code_block.code"></pre>
              </div>

              <div v-else class="other-message">未知消息类型</div>
            </div>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { ServeGetForwardRecords } from "@/api/chat";
import {
  formateSize,
  download,
  imgZoom,
  replaceEmoji,
} from "@/utils/functions";

export default {
  name: "forward-records",
  data() {
    return {
      // 用户ID
      uid: this.$store.state.user.uid,
      // 记录列表
      records: [],
      // 加载状态
      loadStatus: 0,
      // 窗口是否显示
      isShow: false,
    };
  },
  methods: {
    // 格式化文件大小
    renderSize: formateSize,

    // 下载文件
    download: download,

    // 获取图片信息
    getImgStyle: imgZoom,

    // 加载数据列表
    loadRecords() {
      this.loadStatus = 0;
      ServeGetForwardRecords({
        records_id: this.records_id,
      })
        .then((res) => {
          if (res.code == 200) {
            this.loadStatus = 1;
            this.records = res.data.rows.map((item) => {
              if (item.msg_type == 1) {
                item.content = replaceEmoji(item.content);
              }

              return item;
            });
          }
        })
        .catch((err) => {
          this.loadStatus = 0;
        });
    },

    // 显示窗口
    open(records_id) {
      this.records_id = records_id;
      this.isShow = true;
      this.loadRecords();
    },

    // 关闭窗口
    close() {
      this.isShow = false;
    },

    // 查看图片大图
    catImages(src) {
      window.open(src);
    },
  },
};
</script>
<style lang="less" scoped>
.lum-dialog-box {
  width: 500px;
  max-width: 500px;
  height: 600px;

  .main {
    .loading {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      p {
        font-size: 13px;
        margin-top: 10px;
        color: #e2dfdf;
      }
    }
  }
}

/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}

@import "~@/assets/css/talk/talk-records.less";
</style>