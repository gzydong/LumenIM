<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { NModal, NInput, NPopselect } from 'naive-ui'
import { options } from '@/constant/highlight.js'

const emit = defineEmits(['close', 'on-submit'])

const isShowBox = ref(true)

const model = reactive({
  lang: '',
  code: ''
})

const langText = computed(() => {
  let data = options.find((item) => {
    return item.value == model.lang
  })

  return data ? data.label : '请选择语言类型'
})

const isCanSubmit = computed(() => {
  return !(model.lang && model.code)
})

const onMaskClick = () => {
  emit('close')
}

const onSubmit = () => {
  let data = {
    lang: model.lang,
    code: model.code
  }

  if (model.lang == 'json') {
    try {
      data.code = JSON.stringify(JSON.parse(model.code), null, 2)
    } catch (error) {
      data.code = model.code
    }
  }

  emit('on-submit', data)
}
</script>

<template>
  <n-modal
    v-model:show="isShowBox"
    preset="card"
    title="代码消息"
    class="modal-radius"
    style="max-width: 800px; height: 600px"
    :on-after-leave="onMaskClick"
    :segmented="{
      content: true
    }"
    :mask-closable="false"
  >
    <div class="preview" id="add-content">
      <div class="popselect">
        <span>语言类型:</span>

        <n-popselect v-model:value="model.lang" :options="options" size="medium" scrollable>
          <n-button text type="primary">
            {{ langText }}
          </n-button>
        </n-popselect>
      </div>

      <n-input
        type="textarea"
        :maxlength="65535"
        show-count
        style="height: 380px"
        placeholder="请输入..."
        v-model:value="model.code"
      >
        <template #count="{ value }">
          {{ value.length }}
        </template>
      </n-input>
    </div>
    <template #footer>
      <div class="footer">
        <div>
          <n-button type="tertiary" @click="isShowBox = false"> 取消 </n-button>
          <n-button type="primary" class="mt-l15" @click="onSubmit" :disabled="isCanSubmit">
            发送
          </n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped>
.preview {
  width: 100%;
  padding: 5px;
  overflow: hidden;
  border-radius: 10px;
}

.popselect {
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;

  span {
    margin-right: 10px;
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
