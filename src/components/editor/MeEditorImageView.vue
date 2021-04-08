<template>
  <div v-if="show" class="lum-dialog-mask animated fadeIn">
    <el-container class="lum-dialog-box" v-outside="closeBox">
      <el-header class="no-padding header" height="50px">
        <p>发送图片</p>
        <p class="tools">
          <i class="el-icon-close" @click="closeBox" />
        </p>
      </el-header>

      <el-main class="no-padding mian">
        <img v-show="src" :src="src" />
        <div v-show="src">
          <span class="filename">{{ fileName }}</span>
          <br />
          <span class="size">{{ fileSize }} KB</span>
        </div>
      </el-main>

      <el-footer class="footer" height="50px">
        <el-button
          class="btn"
          type="primary"
          size="medium"
          :loading="loading"
          @click="uploadImage"
          >立即发送
        </el-button>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'MeEditorImageView',
  model: {
    prop: 'show',
    event: 'close',
  },
  props: {
    show: Boolean,
    file: File,
  },
  watch: {
    file(file) {
      this.loadFile(file)
    },
  },
  data() {
    return {
      src: '',
      fileSize: '',
      fileName: '',
      loading: false,
    }
  },
  methods: {
    closeBox() {
      if (this.loading) {
        return false
      }

      this.$emit('close', false)
    },
    loadFile(file) {
      let reader = new FileReader()
      this.fileSize = Math.ceil(file.size / 1024)
      this.fileName = file.name
      reader.onload = () => {
        this.src = reader.result
      }

      reader.readAsDataURL(file)
    },

    // 确认按钮事件
    uploadImage() {
      this.loading = true
      this.$emit('confirm')
    },
  },
}
</script>
<style lang="less" scoped>
.lum-dialog-box {
  width: 500px;
  max-width: 500px;
  height: 450px;

  .mian {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    img {
      max-width: 80%;
      max-height: 80%;
      border-radius: 3px;
      cursor: pointer;
      box-shadow: 0 0 8px #e0dbdb;
    }

    div {
      margin-top: 10px;
      text-align: center;
      overflow: hidden;
      max-width: 80%;

      .filename {
        font-weight: 400;
      }

      .size {
        color: rgb(148, 140, 140);
        font-size: 12px;
      }
    }
  }

  .footer {
    height: 50px;
    background: rgba(247, 245, 245, 0.66);
    text-align: center;
    line-height: 50px;

    .btn {
      width: 150px;
      border-radius: 2px;
    }
  }
}
</style>
