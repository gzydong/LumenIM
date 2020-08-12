<template>
  <div class="base-mask">
    <div class="container">
      <el-container class="hv100">
        <el-header class="padding0 header" height="50px">
          <span>选择头像</span>
          <i class="close-btn el-icon-close" v-on:click="$emit('close',0)"></i>
        </el-header>
        <el-main class="main">
          <el-container class="hv100">
            <el-aside width="400px">
              <div class="cropper-box">
                <vue-cropper ref="cropper" :img="option.img" :output-size="option.size" :output-type="option.outputType"
                  :info="true" :full="option.full" :fixed="fixed" :fixed-number="fixedNumber" :can-move="option.canMove"
                  :can-move-box="option.canMoveBox" :fixed-box="option.fixedBox" :original="option.original"
                  :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth"
                  :auto-crop-height="option.autoCropHeight" :center-box="option.centerBox" @real-time="realTime"
                  :high="option.high" mode="cover" />
                <input type="file" id="uploads" ref='fileInput' accept="image/png, image/jpeg, image/jpg"
                  style="display: none;" @change="uploadImg($event, 1)">
              </div>
              <div class="tools tools1">
                <el-button type="primary" size="small" icon="el-icon-upload" @click="clickUpload">上传图片</el-button>
                <el-button type="primary" size="small" icon="el-icon-refresh" @click="refreshCrop">刷新</el-button>
                <el-button type="primary" size="small" icon="el-icon-refresh-left" @click="rotateLeft">左转</el-button>
                <el-button type="primary" size="small" icon="el-icon-refresh-right" @click="rotateRight">右转</el-button>
              </div>
            </el-aside>
            <el-main class="padding0">
              <div class="cropper-box">
                <div class="preview-img">
                  <img v-if="cusPreviewsImg" :src="cusPreviewsImg">
                </div>
              </div>
              <div class="tools" style="text-align: center;">
                <el-button type="primary" size="small" @click="uploadService">保存</el-button>
              </div>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
  import {
    VueCropper
  } from 'vue-cropper'
  import {
    uploadFileStreamServ
  } from '@/api/upload';

  export default {
    name: 'avatar-cropper',
    components: {
      VueCropper
    },
    data() {
      return {
        cusPreviewsImg: '',
        previews: {},
        option: {
          img: '',
          size: 1,
          full: false,
          outputType: 'png',
          canMove: true,
          fixedBox: true,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 200,
          autoCropHeight: 150,
          centerBox: false,
          high: true
        },
        fixed: true,
        fixedNumber: [1, 1]
      }
    },
    methods: {
      clickUpload() {
        this.$refs.fileInput.click();
      },
      clearCrop() {
        if (!this.cusPreviewsImg) return false;
        this.$refs.cropper.clearCrop()
      },
      refreshCrop() {
        if (!this.cusPreviewsImg) return false;
        this.$refs.cropper.refresh();
      },
      rotateLeft() {
        if (!this.cusPreviewsImg) return false;
        this.$refs.cropper.rotateLeft()
      },
      rotateRight() {
        if (!this.cusPreviewsImg) return false;
        this.$refs.cropper.rotateRight()
      },
      // 实时预览函数
      realTime(data) {
        let that = this;
        this.$refs.cropper.getCropData((img) => {
          that.cusPreviewsImg = img;
        })
      },
      uploadImg(e, num) {
        let file = e.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }

        let reader = new FileReader()
        reader.onload = (e) => {
          let data;
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          if (num === 1) {
            this.option.img = data
          } else if (num === 2) {
            this.example2.img = data
          }
        }
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file)
      },

      //上传图片到服务器
      uploadService() {
        if (this.cusPreviewsImg == '') {
          return;
        }

        uploadFileStreamServ({
          fileStream: this.cusPreviewsImg
        }).then((res) => {
          if (res.code == 200) {
            this.$emit('close', 1, res.data.avatar);
          } else {
            alert('文件上传失败,请稍后再试...');
          }
        }).catch((err) => {
          alert('文件上传失败,请稍后再试...');
        });
      }
    }
  }

</script>

<style scoped>
  .base-mask {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    background-color: white;
    width: 800px;
    height: 550px;
    border-radius: 2px;
    overflow: hidden;
    box-shadow: 0 2px 8px 0 rgba(31, 35, 41, .2);
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

  .cropper-box {
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cropper-box .preview-img {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 0 4px #ccc;
  }

  .cropper-box .preview-img img{
    width: 100%;
    height: 100%;
  }

  .tools {
    height: 40px;
    margin-top: 20px;
  }

  .tools1 {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .tools>>>button {
    border-radius: 1px;
  }

</style>
