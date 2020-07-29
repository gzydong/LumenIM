<template>
  <!-- 头像裁剪组件 dome地址:https://codepen.io/xyxiao001/pen/wxwKGz -->
  <div class="base-mask">
    <div class="avatar-cropper animated fadeInDownBig">
      <div class="panel-header">
        <p>选择头像</p>
        <i class="iconfont icon-guanbi11" v-on:click="$emit('close',0)"></i>
      </div>

      <div class="panel-body">
        <div class="cus-columns">
          <div class="vue-cropper-box">
            <vue-cropper ref="cropper" :img="option.img" :output-size="option.size" :output-type="option.outputType"
              :info="true" :full="option.full" :fixed="fixed" :fixed-number="fixedNumber" :can-move="option.canMove"
              :can-move-box="option.canMoveBox" :fixed-box="option.fixedBox" :original="option.original"
              :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth"
              :auto-crop-height="option.autoCropHeight" :center-box="option.centerBox" @real-time="realTime"
              :high="option.high" mode="cover">
            </vue-cropper>
            <input type="file" id="uploads" ref='fileInput' accept="image/png, image/jpeg, image/gif, image/jpg"
              style="display: none;" @change="uploadImg($event, 1)">
          </div>
        </div>
        <div class="cus-columns">
          <div class="cropper-preview-box">
            <div class="preview-img">
              <img v-if="cusPreviewsImg" :src="cusPreviewsImg">
            </div>
          </div>

          <div class="cropper-fuc-toolbar">
            <span @click="clickUpload">上传</span>
            <span @click="refreshCrop">刷新</span>
            <span @click="rotateLeft">左转</span>
            <span @click="rotateRight">右转</span>
          </div>

          <div class="cropper-button">
            <button class="from-submit" @click="uploadService">保存图片</button>
          </div>
        </div>
      </div>
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
        var file = e.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        var reader = new FileReader()
        reader.onload = (e) => {
          let data
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
        let that = this;
        if (this.cusPreviewsImg == '') {
          return;
        }

        uploadFileStreamServ({
          'fileStream': this.cusPreviewsImg
        }).then((res) => {
          if (res.code == 200) {
            that.$emit('close', 1, res.data.avatar);
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

  .avatar-cropper {
    width: 650px;
    height: 455px;
    background: #FFFFFF;
    border-radius: 3px;
    overflow: hidden;
  }

  .avatar-cropper .panel-header {
    height: 45px;
    width: 100%;
    position: relative;
    box-shadow: 0 0 4px #ccc;
  }

  .avatar-cropper .panel-header i {
    position: absolute;
    right: 15px;
    top: 13px;
    font-size: 20px;
    cursor: pointer;
  }

  .avatar-cropper .panel-header p {
    height: 45px;
    line-height: 45px;
    text-indent: 15px;
  }

  .avatar-cropper .panel-body {
    height: calc(100% - 45px);
    width: 100%;
  }

  .cus-columns {
    float: left;
    height: 100%;
  }

  .cus-columns:nth-child(1) {
    width: 60%;
  }

  .cus-columns:nth-child(2) {
    width: 39%;
    border-left: 1px solid #f9f7f7;
    height: 100%;
  }

  .vue-cropper-box {
    width: 380px;
    height: 400px;
    margin: 5px;
  }

  .cropper-preview-box {
    border: 1px solid #fffdfd;
    margin-top: 50px;
    margin-bottom: 30px;
    text-align: center;
    color: #ccc;
    font-size: 14px;
  }

  .cropper-preview-box .preview-img {
    width: 135px;
    height: 135px;
    box-shadow: 0 0 11px #dfdfdf;
    margin: 0px auto;
    margin-bottom: 5px;
  }

  .cropper-preview-box .preview-img img {
    width: 135px;
    height: 135px;
  }

  .cropper-fuc-toolbar {
    margin-top: 100px;
    text-align: center;
  }

  .cropper-fuc-toolbar span {
    display: inline-block;
    background: #e1e1e1;
    margin: 5px;
    padding: 3px;
    width: 35px;
    text-align: center;
    cursor: pointer;
    color: #fff;
    border-radius: 3px;
    font-size: 12px;
  }

  .cropper-fuc-toolbar span:hover {
    background: #47e2ff;
  }

  .cropper-fuc-toolbar span:active {
    background: #00D7FF;
  }

  .cropper-button {
    text-align: center;
    margin-top: 30px;
  }

  #uploads {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 50px;
    opacity: 0;
    cursor: pointer;
  }

  .avatar-cropper .panel-footer {
    height: 45px;
    width: 100%;
    border-top: 1px solid #f2f2f2;
    text-align: center;
  }

  .from-submit {
    width: 240px;
    height: 35px;
    background: #31c9fe;
    margin: 4px auto;
    cursor: pointer;
    color: #fff;
    border-radius: 3px;
  }

  .from-submit:active {
    background: #8ce1ff;
  }

</style>
