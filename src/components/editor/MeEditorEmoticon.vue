<template>
  <div>
    <el-container class="container">
      <el-header height="30px" class="no-padding header">
        <span v-text="showTitle"></span>
        <div class="addbtn" @click="systemEmojiBox = true">系统表情</div>
      </el-header>
      <el-main class="no-padding main lum-scrollbar">
        <input
          type="file"
          ref="fileCustomEmoji"
          accept="image/*"
          style="display: none"
          @change="customUploadEmoji"
        />

        <div class="emoticon" v-show="showEmoticonId == -1">
          <div class="title">QQ表情</div>
          <div
            class="emoticon-item"
            v-for="(item, i) in emoji.emoji1"
            @click="clickEmoticon(item, 1)"
          >
            <img
              :src="
                'https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/' +
                i +
                '.gif'
              "
            />
          </div>
          <div class="clear"></div>
          <div class="title">符号表情</div>
          <div
            class="emoticon-item symbol"
            v-for="(item, i) in emoji.emoji2"
            @click="clickEmoticon(item, 0)"
          >
            {{ item }}
          </div>
          <div class="clear"></div>
        </div>

        <div
          class="emoji-box"
          v-for="item in emojiItem.slice(1)"
          v-show="item.emoticon_id == showEmoticonId"
        >
          <div
            class="emoji-item custom-emoji"
            v-if="item.emoticon_id == 0"
            @click="$refs.fileCustomEmoji.click()"
          >
            <i class="el-icon-picture"></i>
            <span>自定义</span>
          </div>
          <div
            class="emoji-item"
            v-for="subitem in item.list"
            @click="clickImageEmoticon(subitem)"
          >
            <el-image :src="subitem.src" fit="cover"> </el-image>
          </div>
          <div class="clear"></div>
        </div>
      </el-main>
      <el-footer height="40px" class="no-padding footer">
        <div class="toolbar-items">
          <div
            class="toolbar-item prev-page"
            v-show="emojiItem.length > 13"
            @click="turnPage(1)"
          >
            <i class="el-icon-caret-left"></i>
          </div>
          <div
            class="toolbar-item"
            @click="triggerItem(item)"
            v-for="item in showItems"
          >
            <img :src="item.url" />
            <p class="title">{{ item.name }}</p>
          </div>
          <div
            class="toolbar-item next-page"
            v-show="emojiItem.length > 13 && showItems.length == 13"
            @click="turnPage(2)"
          >
            <i class="el-icon-caret-right"></i>
          </div>
        </div>
      </el-footer>
    </el-container>

    <me-editor-system-emoticon
      v-if="systemEmojiBox"
      @close="systemEmojiBox = false"
      @insert="addSystemEmoji"
      @remove="removeSystemEmoji"
    />
  </div>
</template>

<script>
import emoji from "@/assets/js/emoji";
import MeEditorSystemEmoticon from "@/components/editor/MeEditorSystemEmoticon";
import { ServeFindUserEmoticon, ServeUploadEmoticon } from "@/api/emoticon";

export default {
  name: "MeEditorEmoticon",
  components: {
    MeEditorSystemEmoticon,
  },
  computed: {
    showItems() {
      let start = (this.page - 1) * this.pageSize;
      let end = start + this.pageSize;
      return this.emojiItem.slice(start, end);
    },
    pageTotal() {
      return this.emojiItem.length / this.pageSize;
    },
  },
  data() {
    return {
      emoji: emoji,

      // 系统表情包套弹出窗
      systemEmojiBox: false,

      showEmoticonId: -1,
      showTitle: "QQ表情/符号表情",

      page: 1,
      pageSize: 13,

      // 表情包列表
      emojiItem: [
        {
          emoticon_id: -1,
          name: "QQ表情/符号表情",
          url: require("@/assets/image/icon_face.png"),
          list: [],
        },
        {
          emoticon_id: 0,
          name: "我的收藏",
          url: require("@/assets/image/icon_heart.png"),
          list: [],
        },
      ],
    };
  },
  created() {
    this.loadUserEmoji();
  },
  methods: {
    // 表情包导航翻页
    turnPage(type) {
      if (type == 1) {
        if (this.page == 1) return false;
        this.page--;
      } else {
        if (this.page >= this.pageTotal) return false;
        this.page++;
      }
    },

    //加载用户表情包
    loadUserEmoji() {
      ServeFindUserEmoticon().then((res) => {
        if (res.code == 200) {
          this.emojiItem = this.emojiItem.slice(0, 2);

          this.emojiItem.push(...res.data.sys_emoticon);

          this.emojiItem[1].list = [];
          this.emojiItem[1].list.push(...res.data.collect_emoticon);
        }
      });
    },

    // 点击表情包导航
    triggerItem(item) {
      this.showEmoticonId = item.emoticon_id;
      this.showTitle = item.name;
    },

    // 添加系统表情回调方法
    addSystemEmoji(data) {
      this.emojiItem.push(data);
    },
    // 移除系统表情回调方法
    removeSystemEmoji(value) {
      this.$delete(
        this.emojiItem,
        this.emojiItem.findIndex(function (val, key) {
          return val.emoticon_id == value;
        })
      );
    },

    // 选中表情
    clickEmoticon(emoji, type) {
      let text = type == 1 ? `[${emoji}]` : emoji;
      this.callback({
        type: 1,
        value: text,
      });
    },

    // 发送图片表情包
    clickImageEmoticon(item) {
      this.callback({
        type: 2,
        value: item.media_id,
      });
    },

    callback(data) {
      this.$emit("selected", data);
    },

    // 自定义上传表情
    customUploadEmoji(e) {
      if (e.target.files.length == 0) {
        return false;
      }

      let file = e.target.files[0];
      let fileData = new FormData();
      fileData.append("emoticon", file);
      ServeUploadEmoticon(fileData)
        .then((res) => {
          if (res.code == 200) {
            this.emojiItem[1].list.push(res.data);
          }
        })
        .catch((err) => {
          this.$notify.error({
            message: "网络异常请稍后再试...",
            duration: 3000,
          });
        });
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  height: 300px;
  width: 500px;
  background-color: white;

  .header {
    line-height: 30px;
    font-size: 13px;
    font-weight: 400;
    padding-left: 5px;
    user-select: none;
    position: relative;
    border-bottom: 1px solid #fbf5f5;

    .addbtn {
      position: absolute;
      right: 10px;
      top: 1px;
      color: #409eff;
      cursor: pointer;
    }
  }

  .footer {
    background-color: #eff1f7;

    .toolbar-items {
      width: 100%;
      height: 40px;
      line-height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .toolbar-item {
        height: 30px;
        width: 30px;
        margin: 0 2px;
        background-color: #fff;
        display: inline-block;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        img {
          width: 20px;
          height: 20px;
        }

        .title {
          display: none;
          position: absolute;
          top: -25px;
          left: 0px;
          height: 20px;
          line-height: 20px;
          background: #353434;
          color: white;
          min-width: 30px;
          font-size: 10px;
          padding-left: 5px;
          padding-right: 5px;
          border-radius: 2px;
          white-space: pre;
          text-align: center;
        }

        &:hover .title {
          display: block;
        }
      }
    }
  }
}

.container .footer .toolbar-items .prev-page:active i,
.container .footer .toolbar-items .next-page:active i {
  transform: scale(1.2);
}

.emoji-box,
.emoticon {
  width: 100%;
}

.emoticon {
  .title {
    width: 50%;
    height: 25px;
    line-height: 25px;
    color: #ccc;
    font-weight: 400;
    padding-left: 3px;
    font-size: 12px;
  }

  .emoticon-item {
    width: 30px;
    height: 30px;
    margin: 2px;
    float: left;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      transform: scale(1.3);
    }
  }

  .symbol {
    font-size: 22px;
  }
}

.emoji-box {
  .emoji-item {
    width: 67px;
    height: 67px;
    margin: 2px;
    background-color: #eff1f7;
    float: left;
    cursor: pointer;
    transition: ease-in 0.3s;
  }

  .custom-emoji {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 10px;

    i {
      font-size: 30px;
      margin-bottom: 3px;
    }

    &:active {
      color: #409eff;
    }
  }
}

/deep/ .el-image {
  width: 100%;
  height: 100%;
  transition: ease-in 0.3s;
}

.emoji-box .emoji-item:hover .el-image,
.emoji-box .emoji-item:hover {
  border-radius: 10px;
}
</style>
