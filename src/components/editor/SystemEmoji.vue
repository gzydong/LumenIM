<template>
  <div class="base-mask">
    <div class="container" v-outside="closeBox">
      <el-container class="hv100">
        <el-header class="padding0 header" height="50px">
          <span>系统表情</span>
          <i class="close-btn el-icon-close" @click="closeBox"></i>
        </el-header>

        <el-main class="padding0 mian lm-scrollbar">
          <ul>
            <li v-for="(item,i) in items">
              <div class="pkg-avatar">
                <el-image :src="item.url" style="width: 50px;height: 50px;border-radius: 3px;" fit="cover" :lazy="true">
                </el-image>
              </div>
              <div class="pkg-info" v-text="item.name"></div>
              <div class="pkg-status">
                <button class="add-emoji" v-if="item.status == 0" @click="useEmoticon(i,item)">添加</button>
                <button class="remove-emoji" v-else @click="removeEmoticon(i,item)">移除</button>
              </div>
            </li>
          </ul>
        </el-main>

        <el-footer class="footer" height="50px">
          <el-button type="primary" size="medium" class="btn" @click="closeBox">关闭窗口</el-button>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
  import {
    findSysEmoticonServ,
    setUserEmoticonServ
  } from "@/api/emoticon";

  export default {
    name: 'image-viewer',
    data() {
      return {
        items: []
      };
    },
    created() {
      this.loadSysEmoticon();
    },
    methods: {
      closeBox() {
        this.$emit('close');
      },

      // 获取系统表情包列表
      loadSysEmoticon() {
        findSysEmoticonServ().then(res => {
          if (res.code == 200) {
            this.items = res.data;
          }
        });
      },

      // 添加表情包
      useEmoticon(idx, item) {
        setUserEmoticonServ({
          emoticon_id: item.id,
          type: 1
        }).then(res => {
          if (res.code == 200) {
            this.items[idx].status = 1;
            this.$emit('insert', res.data);
          }
        });
      },

      // 移出表情包
      removeEmoticon(i, item) {
        setUserEmoticonServ({
          emoticon_id: item.id,
          type: 2
        }).then(res => {
          if (res.code == 200) {
            this.items[i].status = 0;
            this.$emit('remove', item.id);
          }
        });
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
    width: 350px;
    height: 500px;
    background-color: white;
  }

  .container .header {
    height: 50px;
    line-height: 50px;
    position: relative;
    text-indent: 10px;
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
    height: 480px;
    overflow-y: auto;
  }

  .container .mian li {
    display: flex;
    cursor: pointer;
    height: 68px;
    align-items: center;
    border-bottom: 1px solid #e6e5e6;
    padding-left: 5px;
  }

  .container .mian li .pkg-avatar {
    flex-shrink: 0;
  }

  .container .mian .pkg-avatar img {
    width: 50px;
    height: 50px;
    border-radius: 3px;
  }

  .container .mian .pkg-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 14px;
    margin-right: 14px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    width: 200px;
    color: #615d5d;
  }

  .container .mian .pkg-status {
    flex-shrink: 0;
  }

  .container .mian .pkg-status button {
    font-size: 12px;
    text-align: center;
    line-height: 28px;
    border-radius: 4px;
    width: 50px;
    cursor: pointer;
  }

  .container .mian .pkg-status .add-emoji {
    background-color: #38adff;
    color: white;
  }

  .container .mian .pkg-status .add-emoji:active {
    font-size: 14px;
    background-color: #18a0ff;
  }

  .container .mian .pkg-status .remove-emoji {
    background-color: #d1d1d1;
    color: white;
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
