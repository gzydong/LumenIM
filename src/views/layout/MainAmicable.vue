<template>
  <div id="amicable">
    <div class="logo animated fadeIn">
      <img width="200" src="/static/image/friends-contact.png">
      <p>
        <img :src="list[idx].src" width="15">
        <span v-text="list[idx].text"></span>
      </p>
    </div>
  </div>
</template>

<script type="application/javascript">
  export default {
    name: "amicable",
    data() {
      return {
        idx: 0,
        list: [{
            src: 'https://g.alicdn.com/dingding/desktop-assets/1.1.1/img/nocontent/1f31e.png',
            text: '早上好，今天请继续加油！'
          },
          {
            src: 'https://g.alicdn.com/dingding/desktop-assets/1.1.1/img/nocontent/2615.png',
            text: '下午好，喝杯茶吧，让精神抖擞起来。'
          },
          {
            src: 'https://g.alicdn.com/dingding/desktop-assets/1.1.1/img/nocontent/1f31b.png',
            text: ' 晚上好，请注意休息。'
          },
        ]
      }
    },
    created() {
      let hours = new Date().getHours();
      if (hours > 6 && hours < 12) {
        this.idx = 0;
      } else if (hours < 18) {
        this.idx = 1;
      } else {
        this.idx = 2;
      }
    }
  };

</script>

<style scoped>
  #amicable {
    height: 100%;
    width: 100%;
    position: relative;
  }

  #amicable .logo {
    width: 300px;
    height: 200px;
    margin: auto;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: center;
    font-size: 14px;
    color: #a9a1a1;
    font-family: "Times New Roman", Georgia, Serif;
    font-style: italic;
  }

</style>
