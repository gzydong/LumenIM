<template>
  <div id="lumen-search">
    <div class="lumen-search">
      <i class="lumen-icon-sousuo iconfont icon-sousuo"></i>
      <input type="text" ref="lumenSearchInput" :placeholder="placeholder" v-model="search" @change="change" class="lumen-search-input"
        :class="{'lumen-bg-white':search?true:false}">
      <i class="lumen-icon-open iconfont icon-jia" @click="open"></i>
      <i class="lumen-icon-clear iconfont icon-RectangleCopy" v-show="search" @click="clear"></i>
    </div>
  </div>
</template>

<script type="application/javascript">
  export default {
    name: "lumen-search",
    props: {
      placeholder: {
        type: String,
        default: '搜索关键词'
      }
    },
    data() {
      return {
        search: '',
      }
    },
    methods: {
      change() {
        this.$emit('search-change', this.search)
      },
      clear() {
        this.search = '';
        this.$refs.lumenSearchInput.focus();
      },
      open() {
        this.$emit('click-open');
      }
    }
  };
</script>

<style scoped>
  .lumen-search {
    position: relative;
    height: 60px;
    background: #e8e8e8;
  }

  .lumen-search .lumen-search-input {
    width: 150px;
    height: 27px;
    line-height: 27px;
    font-size: 12px;
    border-radius: 5px;
    padding-right: 20px;
    padding-left: 24px;
    background-color: #dcd9d8;
    position: absolute;
    top: 18px;
    left: 10px;
  }

  .lumen-search .lumen-search-input:focus,
  .lumen-bg-white {
    background-color: white !important;
  }

  .lumen-search .lumen-icon-sousuo {
    position: absolute;
    top: 22px;
    left: 15px;
    color: #858484;
    z-index: 55;
  }

  .lumen-search .lumen-icon-open {
    width: 27px;
    line-height: 27px;
    text-align: center;
    position: absolute;
    right: 8px;
    top: 18px;
    border-radius: 3px;
    color: #858484;
    background-color: #dcd9d8;
    cursor: pointer;
    font-size: 12px;
  }

  .lumen-search .lumen-icon-open:active {
    background: white;
  }

  .lumen-search .lumen-icon-clear {
    width: 15px;
    height: 15px;
    line-height: 15px;
    text-align: center;
    position: absolute;
    right: 50px;
    top: 25px;
    border-radius: 3px;
    color: #858484;
    cursor: pointer;
  }
</style>
