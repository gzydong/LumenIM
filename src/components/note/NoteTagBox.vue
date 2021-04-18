<template>
  <div class="tag-manage">
    <div class="title">
      <span>已选择</span>
    </div>

    <div class="tag-groups">
      <p
        v-for="(tag, i) in tags"
        v-show="tag.isSelectd"
        :key="i"
        class="tag-item"
      >
        <span>{{ tag.name }}</span>
        <i class="el-icon-close" @click="setNoteTag(i, 1)" />
      </p>
    </div>

    <div class="title">
      <span>标签栏</span>
    </div>

    <div class="tag-groups">
      <p
        v-for="(tag, i) in tags"
        :key="i"
        class="tag-item"
        :class="{ active: tag.isSelectd }"
        @click="setNoteTag(i, 2)"
      >
        <span>{{ tag.name }}</span>
      </p>
    </div>

    <el-button
      v-show="!isInput"
      type="primary"
      class="addbtn"
      @click="isInput = !isInput"
      >+ 添加标签
    </el-button>

    <div class="tag-input" v-show="isInput">
      <input
        ref="editTaginput"
        type="text"
        placeholder="回车保存..."
        v-model.trim="tagText"
        @keyup.enter="saveTagEvent"
      />

      <el-button type="primary" size="small" @click="isInput = false"
        >取消编辑
      </el-button>
    </div>
  </div>
</template>
<script>
import { ServeUpdateArticleTag, ServeEditArticleTag } from '@/api/article'
export default {
  props: {
    id: Number,
    tagsList: Array,
  },
  data() {
    return {
      tags: [],
      isInput: false,
      tagText: '',
    }
  },
  methods: {
    // 设置笔记标签事件
    setNoteTag(i, type) {
      this.tags[i].isSelectd = type == 1 ? false : !this.tags[i].isSelectd

      ServeUpdateArticleTag({
        article_id: this.id,
        tags: this.getSelectTags(),
      })
    },

    // 获取选中的标签ids
    getSelectTags() {
      let ids = []
      for (let item of this.tags) {
        if (item.isSelectd) ids.push(item.id)
      }

      return ids
    },

    // 保存标签事件
    saveTagEvent() {
      let tag_name = this.tagText

      ServeEditArticleTag({
        tag_id: 0,
        tag_name,
      }).then(res => {
        if (res.code == 200) {
          let tag = {
            id: res.data.id,
            name: tag_name,
            icon: 'icon-dian',
            count: 0,
            isEdit: false,
            isDefault: 0,
            isActive: false,
          }

          this.tags.push({
            id: tag.id,
            name: tag.name,
            isSelectd: false,
          })

          this.tagText = ''
          this.isInput = false
          this.$emit('create', tag)
        }
      })
    },
  },
  created() {
    this.tags = this.tagsList
  },
}
</script>
<style lang="less" scoped>
.tag-manage {
  .title {
    height: 20px;
    line-height: 20px;
    font-size: 13px;
    color: #ccc;
    border-bottom: 1px solid #f0e9e9;
    padding-bottom: 5px;
    position: relative;
  }

  .tag-groups {
    padding: 8px 8px 8px 0;
    cursor: pointer;

    .tag-item {
      display: inline-block;
      height: 25px;
      line-height: 25px;
      padding: 0 10px;
      font-size: 12px;
      box-sizing: border-box;
      white-space: nowrap;
      margin: 0 3px 5px 0;
      color: #409eff;
      background: rgba(64, 158, 255, 0.1);
      border-radius: 1px;

      i {
        cursor: pointer;
        margin-left: 5px;
      }

      &.active {
        background: #70b5fb;
        color: #ffffff;
      }
    }
  }

  .addbtn {
    height: 33px;
    width: 100%;
    margin-top: 20px;
    line-height: 9px;
    border-radius: 3px;
  }

  .tag-input {
    margin-top: 20px;
    min-height: 30px;
    display: flex;
    align-items: center;

    input {
      width: 200px;
      height: 30px;
      border: 1px solid #66b1ff;
      padding: 0 5px;
      border-radius: 3px;
      margin-right: 5px;

      &::-webkit-input-placeholder {
        font-size: 13px;
        color: #ccc;
      }
    }
  }
}
</style>
