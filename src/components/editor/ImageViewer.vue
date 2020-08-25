<template>
  <div class="base-mask animated fadeIn" v-if="show">
    <div class="container" v-outside="closeBox">
      <el-container class="hv100">
        <el-header class="padding0 header" height="50px">
          <span>发送图片</span>
          <i class="close-btn el-icon-close" @click="closeBox"></i>
        </el-header>

        <el-main class="padding0 mian">
          <img v-show="src" :src="src" />
          <div v-show="src" style="overflow: hidden;max-width: 80%;">
            <span class="filename">{{fileName}}</span>
            <br />
            <span class="size">{{fileSize}} KB</span>
          </div>
        </el-main>

        <el-footer class="footer" height="50px">
          <el-button type="primary" size="medium" :loading="loading" @click="uploadImage" class="btn">立即发送</el-button>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'image-viewer',
    model: {
      prop: 'show',
      event: 'close'
    },
    props: {
      show: Boolean,
      file: File,
    },
    watch: {
      file(nfile, ofile) {
        this.loadFile(nfile);
      }
    },
    data() {
      return {
        src: '',
        fileSize: '',
        fileName: '',
        loading: false,
      };
    },
    methods: {
      closeBox() {
        if (this.loading) {
          return false;
        }

        this.$emit('close', false);
      },
      loadFile(file) {
        let reader = new FileReader();
        this.fileSize = Math.ceil(file.size / 1024);
        this.fileName = file.name;
        reader.onload = () => {
          this.src = reader.result;
        };

        reader.readAsDataURL(file);
      },

      // 确认按钮事件
      uploadImage() {
        this.loading = true;
        this.$emit('confirm');
      }
    }
  };

</script>
<style scoped>
  .container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 450px;
    background-color: white;

    border-radius: 3px;
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

  .container .mian {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .container .mian img {
    max-width: 80%;
    max-height: 80%;
    border-radius: 3px;
    cursor: pointer;
  }

  .container .mian div {
    margin-top: 10px;
    text-align: center;
  }

  .container .mian div .filename {
    font-weight: 400;
  }

  .container .mian div .size {
    color: rgb(148, 140, 140);
    font-size: 12px;
  }

  .container .footer {
    height: 50px;
    background: rgba(247, 245, 245, .66);
    text-align: center;
    line-height: 50px;
  }

  .container .footer .btn {
    width: 150px;
    border-radius: 2px;
  }

</style>
