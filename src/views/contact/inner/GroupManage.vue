<script setup lang="ts">
import Draggable from 'vuedraggable'
import { reactive, computed, ref } from 'vue'
import { NModal, NForm, NFormItem, NInput } from 'naive-ui'
import { Drag, Delete } from '@icon-park/vue-next'
import { ServeContactGroupSave, ServeContactGroupList } from '@/api/contacts'

const emit = defineEmits(['close', 'relaod'])

interface Item {
  id: number
  index: number
  name: string
}

let index = 1
const isShow = ref(true)
const options = reactive<Item[]>([])

const onMaskClick = () => {
  emit('close')
}

const onLoadData = async () => {
  let { code, data } = await ServeContactGroupList()

  if (code != 200) return

  let items = data.items || []
  for (const item of items) {
    if (item.id) {
      options.push({
        id: item.id,
        name: item.name,
        index: index++,
      })
    }
  }

  if (!options.length) {
    options.push({ id: 0, name: '', index: index++ })
  }
}

const onSubmit = () => {
  ServeContactGroupSave({
    items: options,
  }).then(({ code, message }) => {
    if (code == 200) {
      window['$message'].success('保存成功')
      emit('relaod')
      emit('close')
    } else {
      window['$message'].error(message)
    }
  })
}

const addOption = () => {
  options.push({ name: '', id: 0, index: index++ })
}

const delOption = (item: Item) => {
  let i = options.findIndex(value => value.index == item.index)
  if (i >= 0) {
    options.length > 0 && options.splice(i, 1)
  }
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
    title="联系人分组"
    size="huge"
    :bordered="false"
    style="max-width: 450px; border-radius: 10px"
    :on-after-leave="onMaskClick"
  >
    <n-form>
      <n-form-item label="选项">
        <div class="options">
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
                  placeholder="分组名必填"
                  v-model:value="element.name"
                  :maxlength="20"
                  style="margin: 0 10px"
                />
                <n-icon
                  size="20"
                  class="pointer"
                  :component="Delete"
                  @click="delOption(element)"
                />
              </div>
            </template>
          </Draggable>
        </div>
      </n-form-item>
    </n-form>

    <template #footer>
      <div class="footer" style="">
        <div>
          <n-button
            text
            type="primary"
            @click="addOption"
            v-if="options.length < 6"
          >
            +添加分组
          </n-button>
        </div>

        <div>
          <n-button type="tertiary" @click="isShow = false"> 取消 </n-button>
          <n-button
            type="primary"
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
