<script setup lang="ts">
import { Add, Find } from '@icon-park/vue-next'
import { useInject } from '@/hooks/index.ts'
const { toShowUserInfo } = useInject()

const emit = defineEmits(['addContact'])
const props = defineProps<{
  members: any[]
}>()

const search = ref(false)
const keyword = ref('')

const filters = computed(() => {
  if (!keyword.value) return props.members
  const keywordLower = keyword.value.toLowerCase()
  return props.members.filter((member) => member.nickname.toLowerCase().includes(keywordLower))
})

const closeSerch = () => {
  search.value = false
  keyword.value = ''
}
</script>

<template>
  <section class="el-container is-vertical">
    <header class="el-header border-bottom title">
      <span v-if="!search" style="display: flex; align-items: center; gap: 5px">
        <n-icon :component="Find" :size="18" class="pointer" @click="search = true" />
        群成员({{ members.length }})
      </span>
      <span v-else>
        <n-input-group size="small">
          <n-input size="small" v-model:value="keyword" :style="{ width: 'auto' }" />
          <n-button size="small" type="primary" ghost @click="closeSerch">取消</n-button>
        </n-input-group>
      </span>

      <span v-if="!search">
        <n-icon :component="Add" :size="18" class="pointer" @click="emit('addContact')" />
      </span>
    </header>

    <main class="el-main" style="padding: 0 10px">
      <div v-for="item in filters" @click="toShowUserInfo(item.id)">
        <div class="member-item pointer">
          <div class="avatar">
            <im-avatar :src="item.avatar" :size="18" :font-size="12" :username="item.nickname" />
          </div>

          <div class="nickname text-ellipsis">
            {{ item.nickname }}
          </div>
        </div>
      </div>
    </main>
  </section>
</template>

<style lang="less" scoped>
.title {
  height: 38px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  justify-content: space-between;
}

.member-item {
  display: flex;
  margin: 10px 0;

  gap: 5px;
  align-items: center;
  width: 100%;

  .avatar,
  .nickname {
    display: flex;
    align-items: center;
  }

  .nickname {
    font-size: 13px;
  }

  &:hover {
    color: var(--im-primary-color);
  }
}
</style>
