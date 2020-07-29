<template>
  <div class="base-mask animated fadeIn" v-show="isShow">
    <div class="container" v-outside="close">
      <el-container class="hv100">
        <el-header class="padding0 header" height="50px">
          <span>会话记录 ({{records.length}})</span>
          <i class="close-btn el-icon-close" @click="close"></i>
        </el-header>

        <el-main class="padding0 mian lumen-scrollbar">
          <div v-if="loadStatus == 0" class="loading">
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

          <div v-else class="message-group" v-for="(record,i) in records">
            <div class="avatar-box">
              <img :src="record.avatar" :onerror="$store.state.user.detaultAvatar" />
            </div>
            <div class="contnet-box">
              <div class="message-header">
                <span
                  :class="{'color-blue':uid == record.user_id}">{{record.nickname_remarks?record.nickname_remarks:record.nickname}}</span>
                <span> {{record.send_time}}</span>
              </div>

              <div v-if="record.msg_type == 1" class="content-message">
                <pre class="text-message" v-html="record.content"></pre>
              </div>

              <div v-else-if="record.msg_type == 2 && record.file_type == 1" class="img-message">
                <el-image :lazy="true" fit="cover" :style="getImgStyle(record.file_url)" :src="record.file_url"
                  @click="catImages(record.file_url)">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                  <div slot="placeholder" class="image-slot">
                    图片加载中
                    <span class="dot">...</span>
                  </div>
                </el-image>
              </div>

              <div v-else-if="record.msg_type == 2 && record.file_type == 3" class="file-message">
                <div class="file-icon">{{record.file_suffix.toUpperCase()}}</div>
                <div class="file-info">
                  <p>{{record.file_original_name}}</p>
                  <p>
                    {{renderSize(record.file_size)}}
                    <span>该文件永久保存</span>
                  </p>
                </div>
                <div class="file-tool">
                  <i class="iconfont icon-download" @click="download(record.id)"></i>
                </div>
              </div>
              <div v-else class="other-message">未知消息类型</div>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
  import {
    getForwardRecordsServ
  } from "@/api/chat";
  import {
    formateSize,
    download,
    imgZoom
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
        getForwardRecordsServ({
          records_id: this.records_id
        }).then(res => {
          if (res.code == 200) {
            this.records = res.data.rows;
            this.loadStatus = 1;
          }
        }).catch(err => {
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
      }
    }
  };

</script>
<style scoped>
  .base-mask {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    width: 500px;
    height: 600px;
    border-radius: 3px;
    overflow: hidden;
    box-shadow: 0 2px 8px 0 rgba(31, 35, 41, .2);
    background-color: white;
  }

  .container .header {
    height: 50px;
    line-height: 50px;
    position: relative;
    text-indent: 20px;
    border-bottom: 1px solid #f5eeee;
  }

  .container .header .close-btn {
    position: absolute;
    right: 20px;
    top: 15px;
    font-size: 20px;
    cursor: pointer;
  }

  .container .loading {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .container .loading p {
    font-size: 13px;
    margin-top: 10px;
    color: #e2dfdf;
  }



  .message-group {
    min-height: 30px;
    display: flex;
    margin-bottom: 15px;
    flex-direction: row;
    padding: 3px 5px 3px 0;
  }

  .message-group .avatar-box {
    width: 50px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
  }

  .message-group .avatar-box img {
    height: 30px;
    width: 30px;
    margin-top: 10px;
    border-radius: 3px;
    cursor: pointer;
  }

  .message-group .contnet-box {
    flex: auto;
  }

  .message-group .contnet-box .message-header {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: #a09a9a;
    position: relative;
  }

  .message-group .contnet-box .content-message .text-message {
    background: #f5f5f5;
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 13px;
    padding: 5px;
    font-family: "微软雅黑";
    line-height: 20px;
    border-radius: 2px;
  }

  .message-group .contnet-box .img-message img {
    max-width: 120px !important;
    min-width: 20px !important;
    border: 1px solid white;
    cursor: pointer;
  }

  .message-group .contnet-box .img-message .el-image {
    cursor: pointer;
    border-radius: 3px;
  }

  .message-group .contnet-box .img-message img:hover {
    border-color: #409eff;
  }

  .message-group .contnet-box .file-message {
    width: 290px;
    height: 50px;
    box-shadow: 0 0 10px #e4e1e1;
    display: flex;
    padding: 5px;
    background: white;
  }

  .message-group .contnet-box .file-message .file-icon {
    width: 50px;
    height: 50px;
    background: #49a4ff;
    line-height: 50px;
    text-align: center;
    color: white;
    font-size: 12px;
    border-radius: 3px;
  }

  .message-group .contnet-box .file-message .file-info {
    width: 200px;
  }

  .message-group .contnet-box .file-message .file-info p {
    padding-left: 5px;
    font-size: 14px;
    height: 25px;
    line-height: 25px;
  }

  .message-group .contnet-box .file-message .file-info p:first-child {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rebeccapurple;
  }

  .message-group .contnet-box .file-message .file-info p:last-child {
    color: #9a9393;
    font-size: 12px;
  }

  .message-group .contnet-box .file-message .file-tool {
    width: 30px;
    position: relative;
  }

  .message-group .contnet-box .file-message .file-tool i {
    position: absolute;
    top: 16px;
    left: 12px;
    cursor: pointer;
    font-size: 22px;
    color: #2196f3;
  }

  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background: #f5f5f5;
    color: #cccccc;
    font-size: 12px;
    font-weight: 100;
  }

</style>
