<script setup>
import { reactive, computed, ref } from 'vue'
import { NModal, NForm, NFormItem, NInput } from 'naive-ui'
import { ArrowDown, ArrowUp, DeleteMode } from '@icon-park/vue-next'

const emit = defineEmits(['close', 'submit'])

const isShow = ref(true)
const model = reactive({
  mode: 0,
  anonymous: 0,
  title: '',
  options: [
    {
      value: '同事',
    },
    {
      value: '研发小组',
    },
  ],
})

const onMaskClick = () => {
  emit('close')
}

const onSubmit = () => {
  let data = {
    title: model.title,
    mode: model.mode,
    anonymous: model.anonymous,
    options: model.options.map(item => item.value),
  }

  emit('submit', data)
}

const addOption = () => {
  model.options.push({ value: '' })
}

const delOption = index => {
  model.options.length > 1 && model.options.splice(index, 1)
}

// 是否可提交
const isCanSubmit = computed(() => {
  return model.options.some(item => item.value.trim().length === 0)
})
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
      <n-form-item label="分组选项" :required="true">
        <div class="options">
          <div v-for="(option, i) in model.options" class="option">
            <n-input placeholder="分组名必填" v-model:value="option.value">
            </n-input>

            <div class="btn flex-center">
              <n-icon
                size="20"
                class="pointer"
                :component="DeleteMode"
                @click="delOption(i)"
              />
              <n-icon class="pointer" size="20" :component="ArrowUp" />
              <n-icon class="pointer" size="20" :component="ArrowDown" />
            </div>
          </div>

          <n-button
            text
            type="primary"
            @click="addOption"
            v-if="model.options.length < 6"
          >
            +添加分组
          </n-button>
        </div>
      </n-form-item>
    </n-form>

    <template #footer>
      <div style="width: 100%; text-align: right">
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
    </template>
  </n-modal>
</template>

<style lang="less" scoped>
.options {
  width: 100%;

  .option {
    margin: 8px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;

    .btn {
      width: 90px;
      height: 30px;
      margin-left: 10px;
      display: none;
      justify-content: space-between;
      transition: all 1s;
      .pointer {
        &:hover {
          color: red;
        }
      }
    }

    &:hover {
      .btn {
        display: inline-flex;
      }
    }
  }
}
</style>
