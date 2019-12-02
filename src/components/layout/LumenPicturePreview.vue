<template>
  <div class="lumen-picture-preview">
    <!-- 这是聊天图片预览插件 -->
    <div class="editor-image-preview">
      <div class="image-preview-box">
        <img src="http://47.105.180.123:5000/chatimg/20191201/EEq9Kq1tzGK8bnyv16kcxNflwd8XiQDs2Q1tyyTN.jpeg">
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    name: "lumen-picture-preview",
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style scoped>
  .editor-image-preview {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .image-preview-box {
    position: absolute;
    max-width: 90%;
    max-height: 95%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgb(0, 0, 0, .3);
    width: fit-content;
    margin: auto;
  }

  .image-preview-box img{
    max-width: 90%;
    max-height: 90%;
  }

</style>
