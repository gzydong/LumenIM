<script setup>
import { ref, computed, reactive } from 'vue'
import { NSpace, NEmpty } from 'naive-ui'
import { Search, Plus } from '@icon-park/vue-next'
import NoticeEditor from './NoticeEditor.vue'
import { ServeGetGroupNotices } from '@/api/group'

const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
})

const keywords = ref('')
const batchDelete = ref(false)
const items = ref([])
const editor = reactive({
  isShow: false,
  id: 0,
  gid: 0,
  title: '',
  content: '',
})

const filterCheck = computed(() => {
  return items.value.filter(item => item.is_delete)
})

const filterSearch = computed(() => {
  if (!keywords.value.length) {
    return items.value
  }

  return items.value.filter(item => {
    return item.title.match(keywords.value) != null
  })
})

const onLoadData = () => {
  ServeGetGroupNotices({
    group_id: props.id,
  }).then(res => {
    if (res.code == 200) {
      items.value = res.data.items || []
    }
  })
}

const onBatchDelete = () => {
  if (!filterCheck.value.length) {
    return
  }

  let ids = filterCheck.value.map(item => item.user_id).join(',')
}

const onRowClick = item => {
  if (batchDelete.value == true) {
  } else {
    editor.id = item.id
    editor.gid = props.id
    editor.title = item.title
    editor.content = item.content
    editor.isShow = true
  }
}

const onAdd = () => {
  editor.id = 0
  editor.gid = props.id
  editor.title = ''
  editor.content = ''
  editor.isShow = true
}

const onCancelDelete = () => {
  items.value.forEach(item => {
    item.is_delete = false
  })

  batchDelete.value = false
}

const onEditorSuccess = () => {
  editor.isShow = false
  onLoadData()
}

onLoadData()
</script>
<template>
  <section class="section el-container is-vertical height100">
    <header class="el-header header bdr-b">
      <p>公告管理({{ filterSearch.length }})</p>
      <div>
        <n-space>
          <n-input
            placeholder="搜索"
            v-model:value.trim="keywords"
            clearable
            style="width: 200px"
            round
          >
            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>

          <n-button circle @click="onAdd">
            <template #icon>
              <plus theme="outline" size="21" fill="#333" :strokeWidth="2" />
            </template>
          </n-button>
        </n-space>
      </div>
    </header>

    <main v-if="filterSearch.length === 0" class="el-main main flex-center">
      <n-empty size="200" description="暂无相关数据">
        <template #icon>
          <img src="@/assets/image/no-data.svg" alt="" />
        </template>
      </n-empty>
    </main>

    <main v-else class="el-main main">
      <div
        class="member-item bdr-b"
        v-for="item in filterSearch"
        @click="onRowClick(item)"
      >
        <div class="content pointer o-hidden">
          <div class="item-title">
            <p class="nickname text-ellipsis">
              <span>{{ item.title }}</span>
            </p>
            <p>
              <span class="date">{{ item.updated_at }}</span>
            </p>
          </div>
          <div class="item-text text-ellipsis">
            {{ item.content }}
          </div>
        </div>
      </div>
    </main>

    <footer class="el-footer footer bdr-t" v-show="batchDelete">
      <div class="tips">已选({{ filterCheck.length }})</div>
      <div>
        <n-space>
          <n-button type="primary" ghost size="small" @click="onCancelDelete">
            取消
          </n-button>
          <n-button type="error" size="small" @click="onBatchDelete">
            删除
          </n-button>
        </n-space>
      </div>
    </footer>
  </section>

  <NoticeEditor
    v-if="editor.isShow"
    :id="editor.id"
    :gid="editor.gid"
    :title="editor.title"
    :content="editor.content"
    @success="onEditorSuccess"
    @close="editor.isShow = false"
  />
</template>
<style lang="less" scoped>
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}

.main {
  padding: 0 15px;
  box-sizing: border-box;
}

.member-item {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  user-select: none;
  padding: 5px 0 15px 0;

  .content {
    width: 100%;
    height: inherit;

    .item-title {
      height: 30px;
      width: inherit;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 500;

      .date {
        color: #989898;
        font-size: 12px;
      }
    }

    .item-text {
      width: inherit;
      height: 20px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
    }
  }

  &:hover {
    .item-title {
      color: #2196f3;
    }
  }
}

.footer {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  background-color: #fdf9f9;
  border-bottom-right-radius: 15px;

  .tips {
    font-size: 16px;
  }
}
</style>
