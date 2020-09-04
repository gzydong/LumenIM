<template>
  <div>
    <div class="container animated bounceInUp" v-outside="closeBox" v-if="show">
      <el-container class="hv100">
        <el-header class="padding0 header" height="50px">
          <span>上传管理 <span v-show="total">({{successNum}}/{{total}})</span></span>
          <i class="close-btn el-icon-close" @click="closeBox"></i>
        </el-header>

        <el-main class="padding0 mian lm-scrollbar">
          <div class="empty-data" v-show="total == 0">
            <svg-icon icon-class="not-data" />
            <p>暂无上传文件</p>
          </div>
          <div class="file-item" v-for="file in items" v-show="!file.isDelete">
            <div class="file-header">
              <div class="type-icon">{{file.ext}}</div>
              <el-tooltip :content="file.filename" placement="top-start">
                <div class="filename">{{file.filename}}</div>
              </el-tooltip>

              <div class="status">
                <span v-if="file.status == 0">等待上传</span>
                <span v-else-if="file.status == 1" style="color: #66b1ff;">正在上传...</span>
                <span v-else-if="file.status == 2" style="color: #67c23a;">已完成</span>
                <span v-else style="color: red;">网络异常</span>
              </div>
            </div>
            <div class="file-mian">
              <div class="progress">
                <el-progress type="dashboard" :percentage="file.progress" :width="50" :color="colors"></el-progress>
                <span class="name">上传进度</span>
              </div>
              <div class="detail">
                <p>文件类型：<span>{{file.filetype}}</span></p>
                <p>文件大小：<span>{{file.filesize}}</span></p>
                <p>上传时间：<span>{{file.datetime}}</span></p>
              </div>
            </div>
            <div class="file-means" v-show="file.status == 2 || file.status == 3">
              <div class="btns" @click="removeFile(file.hashName)">删除</div>
              <div class="btns" v-show="file.status == 3" @click="triggerUpload(file.hashName)">继续上传</div>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';

  import {
    Progress
  } from 'element-ui';
  Vue.use(Progress);

  import {
    findFileSplitInfoServ,
    fileSubareaUploadServ
  } from "@/api/upload";

  import {
    formateSize,
    getFileExt,
    parseTime
  } from "@/utils/functions";

  import {
    sendFileServ
  } from "@/api/chat";

  export default {
    name: 'files-manager',
    model: {
      prop: 'show',
      event: 'close'
    },
    props: {
      show: Boolean
    },
    data() {
      return {
        colors: [{
            color: '#f56c6c',
            percentage: 20
          },
          {
            color: '#e6a23c',
            percentage: 40
          },
          {
            color: '#5cb87a',
            percentage: 60
          },
          {
            color: '#1989fa',
            percentage: 80
          },
          {
            color: '#11ce65',
            percentage: 100
          }
        ],

        items: [],
      };
    },
    computed: {
      total() {
        return this.items.filter((item, index) => {
          return item.isDelete == false;
        }).length;
      },
      successNum() {
        return this.items.filter((item, index) => {
          return item.isDelete == false && item.status == 2;
        }).length;
      }
    },
    methods: {
      closeBox() {
        this.$emit('close', false);
      },

      upload(file) {
        findFileSplitInfoServ({
          file_name: file.name,
          file_size: file.size
        }).then(res => {
          if (res.code == 200) {
            let hashName = res.data.hash_name;
            let splitSize = res.data.split_size

            this.items.unshift({
              hashName: hashName,
              originalFile: file,
              filename: file.name,
              status: 0, // 文件上传状态 0:等待上传 1:上传中 2:上传完成 3:网络异常
              progress: 0,
              filesize: formateSize(file.size),
              filetype: file.type || '未知',
              datetime: parseTime(new Date(), '{m}-{d} {h}:{i}'),
              ext: getFileExt(file.name),
              forms: this.fileSlice(file, hashName, splitSize),
              successNum: 0,
              isDelete: false,
            });

            this.triggerUpload(hashName);
          }
        });
      },

      // 处理拆分上传文件
      fileSlice(file, hash, eachSize) {
        const ext = getFileExt(file.name);
        const splitNum = Math.ceil(file.size / eachSize); // 分片总数
        const forms = [];

        // 处理每个分片的上传操作
        for (let i = 0; i < splitNum; i++) {
          let start = i * eachSize;
          let end = Math.min(file.size, start + eachSize);

          // 构建表单
          const form = new FormData();
          form.append('file', file.slice(start, end));
          form.append('name', file.name);
          form.append('hash', hash);
          form.append('ext', ext);
          form.append('size', file.size);
          form.append('split_index', i);
          form.append('split_num', splitNum);
          forms.push(form);
        }

        return forms;
      },

      // 触发上传文件
      triggerUpload(hashName) {
        let $index = this.getFileIndex(hashName);
        if ($index < 0) {
          return;
        }

        if (this.items[$index].isDelte) {
          return;
        }

        let i = this.items[$index].successNum;
        let form = this.items[$index].forms[i];
        let length = this.items[$index].forms.length;
        this.items[$index].status = 1;
        fileSubareaUploadServ(form).then(res => {
          if (res.code == 200) {
            $index = this.getFileIndex(hashName);
            this.items[$index].successNum++;
            this.items[$index].progress = Math.floor((this.items[$index].successNum / length) * 100);
            if (this.items[$index].successNum == length) {
              this.items[$index].status = 2;
              if (res.data.is_file_merge) {
                sendFileServ({
                  hash_name: res.data.hash,
                  receive_id: this.$root.message.receiveId,
                  source: this.$root.message.source,
                });
              }
            } else {
              this.triggerUpload(hashName);
            }
          } else {
            this.items[$index].status = 3;
          }
        }).catch(err => {
          $index = this.getFileIndex(hashName);
          this.items[$index].status = 3;
        });
      },

      //获取分片文件数组索引
      getFileIndex(hashName) {
        return this.items.findIndex(item => {
          return item.hashName == hashName;
        });
      },

      removeFile(hashName) {
        let index = this.getFileIndex(hashName);
        this.items[index].isDelete = true;
      },

      clear() {
        this.items = [];
      }
    }
  };

</script>
<style scoped>
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
  }

  .file-item .file-header {
    height: 45px;
    /* background-color: #66b1ff; */
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    border-bottom: 1px solid #f7f4f4;
  }

  .file-item .file-header .type-icon {
    height: 35px;
    width: 35px;
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

  .file-item .file-header .filename {
    margin-left: 10px;
    font-size: 14px;
    width: 65%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-item .file-header .status {
    position: absolute;
    right: 14px;
    top: 12px;
    font-size: 13px;
    color: #6b6868;
    font-weight: 200;
  }

  .file-item .file-mian {
    padding: 8px;
    display: flex;
    flex-direction: row;
  }

  .file-item .file-mian .progress {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    background: #f9f6f6;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
  }

  .file-item .file-mian .progress .name {
    font-size: 12px;
    color: #ada8a8;
    font-weight: 300;
  }

  .file-item .file-mian .detail {
    flex: auto;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    justify-content: center;
    align-items: flex-start;
    font-size: 13px;

  }

  .file-item .file-mian .detail p {
    margin: 3px;
    color: #ada8a8;
  }

  .file-item .file-mian .detail p span {
    color: #595a5a;
    font-weight: 500;
  }

  .file-item .file-means {
    width: 96.5%;
    height: 35px;
    border-top: 1px dashed rgb(234, 227, 227);
    margin: 3px auto;
    padding-top: 5px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .file-item .file-means .btns {
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
  }

  .file-item .file-means .btns:active {
    box-shadow: 0 0 5px #eae5e5;
    font-size: 13px;
  }

  .empty-data {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 50%;
  }

  .empty-data svg {
    font-size: 50px;
  }

  .empty-data p {
    margin-top: 30px;
    color: #cccccc;
    font-size: 10px;
  }

</style>
