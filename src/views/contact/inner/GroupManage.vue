<script lang="ts" setup>
import { fetchContactGroupList, fetchContactGroupSave } from '@/apis/api'
import { fetchApi } from '@/apis/request'
import { useInject } from '@/hooks'
import { Delete, Drag } from '@icon-park/vue-next'
import { VueDraggable } from 'vue-draggable-plus'

const emit = defineEmits(['close', 'relaod'])

interface Item {
  id: number
  sort: number
  name: string
  count: number
}

let index = 1
const { dialog } = useInject()
const isShow = ref(true)
const options = ref<Item[]>([])
const loading = ref(false)

const onMaskClick = () => {
  emit('close')
}

const onLoadData = async () => {
  let [err, data] = await fetchApi(fetchContactGroupList, {}, { loading })
  if (err) return

  let items = data?.items || []
  for (const item of items) {
    if (item.id) {
      options.value.push({
        id: item.id,
        name: item.name,
        sort: index++,
        count: item.count
      })
    }
  }

  if (!options.value.length) {
    options.value.push({ id: 0, name: '', sort: index++, count: 0 })
  }
}

const onSubmit = async () => {
  const [err] = await fetchApi(
    fetchContactGroupSave,
    {
      items: options.value
    },
    {
      successText: '已保存'
    }
  )
  if (err) return

  emit('relaod')
  emit('close')
}

const addOption = () => {
  options.value.push({ name: '', id: 0, sort: index++, count: 0 })
}

const delOption = (item: Item) => {
  const onPositiveClick = () => {
    options.value = options.value.filter((value) => value.sort != item.sort)
  }

  if (item.count === 0) return onPositiveClick()

  dialog.create({
    title: '温馨提示',
    content: `【${item.name}】分组下有${item.count}个好友，确定要删除吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: onPositiveClick,
    positiveButtonProps: {
      textColor: '#ffffff'
    }
  })
}

// 是否可提交
const isCanSubmit = computed(() => {
  return options.value.some((item: Item) => item.name.trim().length === 0)
})

onLoadData()
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    title="好友分组"
    class="modal-radius"
    style="max-width: 450px"
    :on-after-leave="onMaskClick"
  >
    <div class="options" v-loading="loading">
      <n-empty v-show="options.length == 0" description="暂未设置分组" style="margin-top: 20px" />

      <VueDraggable ref="el" v-model="options">
        <div class="option" v-for="item in options" :key="item.id">
          <n-icon size="20" class="handle" :component="Drag" />
          <n-input
            placeholder="请填写分组名称"
            v-model:value="item.name"
            :maxlength="20"
            style="margin: 0 10px"
          />
          <n-icon size="16" class="pointer" :component="Delete" @click="delOption(item)" />
        </div>
      </VueDraggable>
    </div>

    <template #footer>
      <div class="footer">
        <n-button text type="primary" :disabled="options.length >= 8" @click="addOption">
          添加分组
        </n-button>

        <div>
          <n-button type="tertiary" @click="isShow = false"> 取消 </n-button>
          <n-button
            type="primary"
            text-color="#ffffff"
            @click="onSubmit"
            class="mt-l15"
            :disabled="isCanSubmit"
          >
            保存
          </n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped>
.footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.options {
  width: 100%;
  min-height: 80px;

  .handle {
    cursor: move;
  }

  .option {
    margin: 8px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
  }
}
</style>
