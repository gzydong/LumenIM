<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { NModal, NImage } from 'naive-ui'
import { CalendarThirty, Undo, Delete, ToBottom } from '@icon-park/vue-next'
import Loading from '@/components/base/Loading.vue'
import {
  ServeGetArticleList,
  ServeForeverDeleteArticle,
  ServeRecoverArticle,
  ServeGetRecoverAnnexList,
  ServeDownloadAnnex as onDownload,
  ServeForeverDeleteAnnex,
  ServeRecoverArticleAnnex
} from '@/api/article'

const emit = defineEmits(['close'])

const isShow = ref(true)

interface IState {
  note: {
    loading: boolean
    items: {
      abstract: string
      class_id: number
      class_name: string
      created_at: string
      id: number
      image: string
      is_asterisk: number
      status: number
      tags_id: string
      title: string
      updated_at: string
    }[]
  }
  annex: {
    loading: boolean
    items: {
      id: number
      article_id: number
      title: string
      original_name: string
      day: number
    }[]
  }
}

const state = reactive<IState>({
  note: {
    loading: false,
    items: []
  },
  annex: {
    loading: false,
    items: []
  }
})

const tabIndex = ref(1)

const onMaskClick = () => {
  emit('close')
}

const triggerType = (index: number) => {
  tabIndex.value = index
}

// 加载笔记列表
const loadNoteList = () => {
  state.note.loading = true
  ServeGetArticleList({
    page: 1,
    find_type: 5
  })
    .then((res) => {
      state.note.items = res.data.items
    })
    .finally(() => {
      state.note.loading = false
    })
}

const loadAnnexList = () => {
  state.annex.loading = true
  ServeGetRecoverAnnexList()
    .then((res) => {
      if (res.code == 200) {
        state.annex.items = res.data.items || []
      }
    })
    .finally(() => {
      state.annex.loading = false
    })
}

// 永久删除笔记
const onDeleteArticle = (index: number, id: number) => {
  ServeForeverDeleteArticle({
    article_id: id
  }).then((res) => {
    if (res.code == 200) {
      state.note.items.splice(index, 1)
    }
  })
}

// 恢复已删除笔记
const onRecoverArticle = (index: number, id: number) => {
  ServeRecoverArticle({
    article_id: id
  }).then((res) => {
    if (res.code == 200) {
      state.note.items.splice(index, 1)
    }
  })
}

const onRecoverAnnex = (index: number, id: number) => {
  ServeRecoverArticleAnnex({
    annex_id: id
  }).then((res) => {
    if (res.code == 200) {
      state.annex.items.splice(index, 1)
    }
  })
}
const onDeleteAnnex = (index: number, id: number) => {
  ServeForeverDeleteAnnex({
    annex_id: id
  }).then((res) => {
    if (res.code == 200) {
      state.annex.items.splice(index, 1)
    }
  })
}

onMounted(() => {
  loadNoteList()
  loadAnnexList()
})
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    title="回收站管理"
    class="modal-radius"
    style="max-width: 750px"
    :on-after-leave="onMaskClick"
    :segmented="{
      content: true
    }"
    :header-style="{
      padding: '20px 15px'
    }"
    :content-style="{
      padding: 0
    }"
  >
    <section class="main-box el-container is-vertical o-hidden">
      <header class="el-header bdr-b header" style="height: 50px">
        <div class="type-items">
          <span :class="{ active: tabIndex == 1 }" @click="triggerType(1)"> 笔记列表 </span>
          <span :class="{ active: tabIndex == 2 }" @click="triggerType(2)"> 附件列表 </span>
        </div>
        <div style="display: flex; align-items: center">
          <n-icon :size="20" class="pointer" :component="CalendarThirty" />
        </div>
      </header>

      <!-- 笔记列表 -->
      <main
        v-if="tabIndex == 1"
        class="el-main me-scrollbar me-scrollbar-thumb"
        :class="{
          'flex-center': state.note.items.length == 0,
          'main-bag': state.note.items.length > 0
        }"
      >
        <template v-if="state.note.loading">
          <Loading />
        </template>
        <template v-else-if="state.note.items.length === 0">
          <n-empty size="200" description="暂无相关数据">
            <template #icon>
              <img src="@/assets/image/no-data.svg" alt="" />
            </template>
          </n-empty>
        </template>
        <template v-else>
          <div class="article" v-for="(note, index) in state.note.items" :key="note.id">
            <div class="at-header">
              <div class="at-name">
                <span class="text-ellipsis">{{ note.title }}</span>
              </div>
              <div class="at-tool">
                <div class="tip">剩余15天</div>
                <div class="icons">
                  <n-icon
                    :size="18"
                    color="#03a9f4"
                    class="pointer"
                    :component="Undo"
                    @click="onRecoverArticle(index, note.id)"
                  />
                  <n-icon
                    :size="18"
                    color="red"
                    class="pointer"
                    :component="Delete"
                    @click="onDeleteArticle(index, note.id)"
                  />
                </div>
              </div>
            </div>

            <div class="at-body pointer">
              <div class="content">
                <div class="datetime">
                  <span>{{ note.created_at.substr(0, 10) }}</span>
                  <span>{{ note.class_name }}</span>
                </div>
                <div class="abstract">
                  {{ note.abstract.replace(/[\r\n]/g, '').replace(/(<([^>]+)>)/gi, '') }}
                </div>
              </div>

              <div class="image" v-show="note.image">
                <n-image
                  width="56"
                  height="56"
                  preview-disabled
                  style="border-radius: 2px"
                  :src="note.image"
                  fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                />
              </div>
            </div>
          </div>
        </template>
      </main>

      <main
        v-else
        class="el-main me-scrollbar"
        :class="{
          'flex-center': state.annex.items.length == 0,
          'main-bag': state.annex.items.length > 0
        }"
      >
        <template v-if="state.annex.loading">
          <Loading />
        </template>

        <template v-else-if="state.annex.items.length == 0">
          <n-empty size="200" description="暂无相关数据">
            <template #icon>
              <img src="@/assets/image/no-data.svg" alt="" />
            </template>
          </n-empty>
        </template>

        <template v-else>
          <div class="article" v-for="(annex, index) in state.annex.items" :key="annex.id">
            <div class="at-header">
              <div class="at-name">
                <span class="text-ellipsis">{{ annex.original_name }}</span>
              </div>
              <div class="at-tool">
                <div class="tip">剩余{{ annex.day }}天</div>
                <div class="icons">
                  <n-icon
                    :size="18"
                    color="#03a9f4"
                    class="pointer"
                    :component="ToBottom"
                    @click="onDownload(annex.id)"
                  />
                  <n-icon
                    :size="18"
                    color="#03a9f4"
                    class="pointer"
                    :component="Undo"
                    @click="onRecoverAnnex(index, annex.id)"
                  />
                  <n-icon
                    :size="18"
                    color="red"
                    class="pointer"
                    :component="Delete"
                    @click="onDeleteAnnex(index, annex.id)"
                  />
                </div>
              </div>
            </div>

            <div class="at-body pointer">
              <div class="content">
                <div class="abstract">所属笔记： {{ annex.title }}</div>
              </div>
            </div>
          </div>
        </template>
      </main>

      <footer class="el-footer footer">移动至回收站的笔记及附件，将在 30 天后自动清除。</footer>
    </section>
  </n-modal>
</template>

<style lang="less" scoped>
.main-box {
  height: 550px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px 0 5px;

    .type-items {
      line-height: 40px;
      user-select: none;

      .active {
        color: #03a9f4;
        font-weight: 500;
      }

      span {
        height: 40px;
        width: 45px;
        margin: 0 10px;
        font-size: 13px;
        font-weight: 400;
        cursor: pointer;
      }
    }
  }

  .main-bag {
    background: #f5f5f5;
  }

  .footer {
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    color: #a7afbc;
    font-size: 12px;
    font-weight: 400;
  }
}

.article {
  min-height: 50px;
  padding: 8px;
  position: relative;
  background: #ffffff;
  margin: 15px 10px;
  border-radius: 5px;

  .at-header {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .at-name {
      color: #1f2329;
      font-size: 14px;
      line-height: 20px;
      flex: 1 1;
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    .at-tool {
      width: 70px;
      display: flex;
      justify-content: flex-end;

      .icons {
        display: none;
      }
    }
  }

  .at-body {
    display: flex;
    align-items: center;

    .content {
      flex-grow: 1;

      .datetime {
        display: flex;
        align-items: center;
        padding-top: 4px;
        font-size: 10px;
        color: #a7afbc;
        font-weight: 300;
        line-height: 1.6;

        span {
          margin-right: 15px;
        }
      }

      .abstract {
        display: -webkit-box;
        flex-grow: 1;
        max-height: 42px;
        font-size: 12px;
        color: #b5b5b5;
        line-height: 1.6;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-word;
        overflow: hidden;
      }
    }

    .image {
      width: 56px;
      height: 56px;
      flex-grow: 0;
      flex-shrink: 0;
      margin-left: 15px;
      cursor: pointer;
    }
  }

  &:hover {
    .at-tool .tip {
      display: none;
    }

    .at-tool .icons {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      i {
        margin-left: 12px;
      }
    }
  }
}
</style>
