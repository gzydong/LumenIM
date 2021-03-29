<template>
  <div class="test-page">
    <!-- <visit-card-message /> -->


  </div>
</template>

<script>

export default {
  name: "TestPage",

  data() {
    return {
      list:[
        {name:'111'},
        {name:'222'},
        {name:'333'},
      ]
    };
  },
  created() {},
  methods: {
    onEvent(value) {
      console.log(value);
    },
  },
};
</script>
<style lang="less" scoped>
.test-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
