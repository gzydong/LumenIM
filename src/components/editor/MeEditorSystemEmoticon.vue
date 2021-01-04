<template>
  <div class="base-mask">
    <div class="container" v-outside="closeBox">
      <el-container class="hv100">
        <el-header class="padding0 header" height="50px">
          <span>系统表情</span>
          <i class="el-icon-close" @click="closeBox"></i>
        </el-header>

        <el-main class="padding0 mian lm-scrollbar">
          <ul>
            <li v-for="(item, i) in items" class="no-select">
              <div class="pkg-avatar">
                <el-image :src="item.url" fit="cover" :lazy="true"> </el-image>
              </div>
              <div class="pkg-info" v-text="item.name"></div>
              <div class="pkg-status">
                <button
                  class="add-emoji"
                  v-if="item.status == 0"
                  @click="useEmoticon(i, item)"
                >
                  添加
                </button>
                <button
                  class="remove-emoji"
                  v-else
                  @click="removeEmoticon(i, item)"
                >
                  移除
                </button>
              </div>
            </li>
          </ul>
        </el-main>

        <el-footer class="footer" height="50px">
          <el-button type="primary" size="medium" class="btn" @click="closeBox"
            >关闭窗口</el-button
          >
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
import { ServeFindSysEmoticon, ServeSetUserEmoticon } from "@/api/emoticon";

export default {
  name: "me-editor-system-emoticon",
  data() {
    return {
      items: [],
    };
  },
  created() {
    this.loadSysEmoticon();
  },
  methods: {
    closeBox() {
      this.$emit("close");
    },

    // 获取系统表情包列表
    loadSysEmoticon() {
      ServeFindSysEmoticon().then((res) => {
        if (res.code == 200) {
          this.items = res.data;
        }
      });
    },

    // 添加表情包
    useEmoticon(idx, item) {
      ServeSetUserEmoticon({
        emoticon_id: item.id,
        type: 1,
      }).then((res) => {
        if (res.code == 200) {
          this.items[idx].status = 1;
          this.$emit("insert", res.data);
        }
      });
    },

    // 移出表情包
    removeEmoticon(i, item) {
      ServeSetUserEmoticon({
        emoticon_id: item.id,
        type: 2,
      }).then((res) => {
        if (res.code == 200) {
          this.items[i].status = 0;
          this.$emit("remove", item.id);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 2px 8px 0 rgba(31, 35, 41, 0.2);

  .header {
    height: 50px;
    line-height: 50px;
    position: relative;
    text-indent: 10px;
    border-bottom: 1px solid #f5eeee;
    i {
      position: absolute;
      right: 20px;
      top: 15px;
      font-size: 20px;
      cursor: pointer;
    }
  }

  .mian {
    height: 480px;
    overflow-y: auto;

    li {
      display: flex;
      cursor: pointer;
      height: 68px;
      align-items: center;
      border-bottom: 1px solid #fbf2fb;
      padding-left: 5px;

      .pkg-avatar {
        flex-shrink: 0;

        .el-image {
          width: 50px;
          height: 50px;
          border-radius: 3px;
        }
      }

      .pkg-info {
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

      .pkg-status {
        flex-shrink: 0;

        button {
          font-size: 12px;
          text-align: center;
          line-height: 28px;
          border-radius: 20px;
          width: 50px;
          cursor: pointer;
        }

        .add-emoji {
          background-color: #38adff;
          color: white;

          &:active {
            font-size: 14px;
            background-color: #18a0ff;
          }
        }

        .remove-emoji {
          background-color: #d1d1d1;
          color: white;
        }
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
