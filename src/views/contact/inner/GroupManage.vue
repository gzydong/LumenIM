<script lang="ts" setup>
import Draggable from 'vuedraggable'
import { reactive, computed, ref } from 'vue'
import { NModal, NInput } from 'naive-ui'
import { Drag, Delete } from '@icon-park/vue-next'
import { ServeContactGroupSave, ServeContactGroupList } from '@/api/contact'
import { toApi } from '@/api'
import { useInject } from '@/hooks'

const emit = defineEmits(['close', 'relaod'])

interface Item {
  id: number
  index: number
  name: string
  count: number
}

let index = 1
const { dialog } = useInject()
const isShow = ref(true)
const options = reactive<Item[]>([])

const onMaskClick = () => {
  emit('close')
}

const onLoadData = async () => {
  let { code, data } = await toApi(ServeContactGroupList)

  if (code != 200) return

  let items = data.items || []
  for (const item of items) {
    if (item.id) {
      options.push({
        id: item.id,
        name: item.name,
        index: index++,
        count: item.count
      })
    }
  }

  if (!options.length) {
    options.push({ id: 0, name: '', index: index++, count: 0 })
  }
}

const onSubmit = async () => {
  const { code } = await toApi(
    ServeContactGroupSave,
    {
      items: options
    },
    {
      showMessageText: '已保存'
    }
  )

  if (code == 200) {
    emit('relaod')
    emit('close')
  }
}

const addOption = () => {
  options.push({ name: '', id: 0, index: index++, count: 0 })
}

const delOption = (item: Item) => {
  let fn = () => {
    let i = options.findIndex((value) => value.index == item.index)
    if (i >= 0) {
      options.length > 0 && options.splice(i, 1)
    }
  }

  if (item.count > 0) {
    return dialog.create({
      title: '温馨提示',
      content: `【${item.name}】分组下有${item.count}个好友，确定要删除吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: fn
    })
  }

  fn()
}

// 是否可提交
const isCanSubmit = computed(() => {
  return options.some((item: Item) => item.name.trim().length === 0)
})

onLoadData()
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    title="好友分组管理"
    size="huge"
    :bordered="false"
    class="modal-radius"
    style="max-width: 450px"
    :on-after-leave="onMaskClick"
  >
    <div class="options">
      <n-empty v-show="options.length == 0" description="暂未设置分组" style="margin-top: 20px" />

      <Draggable
        class="draggable-ul"
        animation="300"
        :list="options"
        itemKey="index"
        handle=".handle"
      >
        <template #item="{ element }">
          <div class="option">
            <n-icon size="20" class="handle" :component="Drag" />
            <n-input
              placeholder="必填"
              v-model:value="element.name"
              :maxlength="20"
              style="margin: 0 10px"
            />
            <n-icon size="16" class="pointer" :component="Delete" @click="delOption(element)" />
          </div>
        </template>
      </Draggable>
    </div>

    <template #footer>
      <div class="footer">
        <n-button text type="primary" @click="addOption" v-if="options.length < 6">
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
