<script lang="ts" setup>
import { reactive, computed, ref } from 'vue'
import { NModal, NForm, NFormItem, NInput, NRadioGroup, NSpace, NRadio } from 'naive-ui'
import { Delete } from '@icon-park/vue-next'
const emit = defineEmits(['close', 'submit'])

const isShow = ref(true)
const model = reactive({
  mode: 0,
  anonymous: 0,
  title: '',
  options: [{ value: '' }, { value: '' }, { value: '' }]
})

const onMaskClick = () => {
  emit('close')
}

const onSubmit = () => {
  let data = {
    title: model.title,
    mode: model.mode,
    anonymous: model.anonymous,
    options: model.options.map((item) => item.value)
  }

  emit('submit', data)
}

const addOption = () => {
  model.options.push({ value: '' })
}

const delOption = (index: number) => {
  model.options.length > 2 && model.options.splice(index, 1)
}

// 是否可提交
const isCanSubmit = computed(() => {
  return (
    model.title.trim().length == 0 || model.options.some((item) => item.value.trim().length === 0)
  )
})
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    title="发起投票"
    class="modal-radius"
    :style="{ maxWidth: '450px' }"
    :on-after-leave="onMaskClick"
  >
    <n-form>
      <n-form-item label="投票方式" :required="true">
        <n-radio-group v-model:value="model.anonymous">
          <n-space>
            <n-radio :value="0"> 公开投票 </n-radio>
            <n-radio :value="1"> 匿名投票 </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item label="选择方式" :required="true">
        <n-radio-group v-model:value="model.mode">
          <n-space>
            <n-radio :value="0"> 单选 </n-radio>
            <n-radio :value="1"> 多选 </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item label="投票主题" :required="true">
        <n-input placeholder="请输入投票主题，最多50字" v-model:value="model.title" />
      </n-form-item>

      <n-form-item label="投票选项" :required="true">
        <div class="options">
          <div v-for="(option, i) in model.options" :key="i" class="option">
            <n-input placeholder="&nbsp;请输入选项内容" v-model:value="option.value">
              <template #prefix>
                <span style="color: #ccc"> {{ String.fromCharCode(65 + i) }}. </span>
              </template>
            </n-input>

            <div class="btn flex-center pointer" @click="delOption(i)">
              <n-icon size="16" :component="Delete" />
            </div>
          </div>

          <n-button text type="primary" @click="addOption" v-if="model.options.length < 6">
            添加选项
          </n-button>
        </div>
      </n-form-item>
    </n-form>

    <template #footer>
      <div style="width: 100%; text-align: right">
        <n-button type="tertiary" @click="isShow = false"> 取消 </n-button>
        <n-button type="primary" @click="onSubmit" class="mt-l15" :disabled="isCanSubmit">
          发起投票
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

    .btn {
      width: 30px;
      height: 30px;
      margin-left: 3px;
    }

    &:hover {
      color: red;
    }
  }
}
</style>
