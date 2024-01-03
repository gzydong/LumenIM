<script setup>
import { reactive, computed, onMounted, ref } from 'vue'
import { NCheckbox, NProgress } from 'naive-ui'
import { ServeConfirmVoteHandle } from '@/api/chat'
import { useUserStore } from '@/store'

const props = defineProps({
  extra: Object,
  data: Object
})

const extra = ref(props.extra)
const userStore = useUserStore()
const mode = extra.value.detail.answer_mode
const state = reactive({ options: [] })

// 是否可提交
const isCanSubmit = computed(() => {
  return state.options.some((item) => item.is_checked)
})

// 是否已投票
const isVoted = computed(() => {
  return extra.value.vote_users.some((item) => item == userStore.uid)
})

/**
 * 设置投票选项
 */
function setOptions(options) {
  for (const option of options) {
    state.options.push({
      key: option.key,
      value: option.value,
      is_checked: false,
      num: 0,
      progress: 0
    })
  }
}

/**
 * 更新统计信息
 *
 * @param {*} data
 */
function updateStatistics(data) {
  let count = data.count

  state.options.forEach((option) => {
    option.num = data.options[option.key]

    if (count > 0) {
      option.progress = (data.options[option.key] / count) * 100
    }
  })
}

/**
 * 选择投票
 *
 * @param {*} data
 * @param {*} option
 */
function change(data, option) {
  if (mode == 0) {
    state.options.forEach((option) => (option.is_checked = false))
  }

  option.is_checked = data
}

/**
 * 表单提交
 */
const onSubmit = () => {
  if (!isCanSubmit.value) return

  let items = []

  state.options.forEach((item) => {
    item.is_checked && items.push(item.key)
  })

  ServeConfirmVoteHandle({
    msg_id: props.data.msg_id,
    options: items.join(',')
  }).then((res) => {
    if (res.code == 200) {
      updateStatistics(res.data)
      extra.value.vote_users.push(userStore.uid)
      extra.value.detail.answered_num++
    }
  })
}

onMounted(() => {
  setOptions(extra.value.detail.answer_option)
  updateStatistics(extra.value.statistics)
})
</script>

<template>
  <section class="im-message-vote">
    <div class="vote-from">
      <div class="vheader">
        <p style="font-weight: bold">
          {{ mode == 1 ? '[多选投票]' : '[单选投票]' }}
        </p>
        <p>{{ extra.detail.title }}</p>
      </div>

      <template v-if="isVoted">
        <div class="vbody">
          <div class="vote-view" v-for="option in state.options" :key="option.key">
            <p class="vote-option">{{ option.key }}、 {{ option.value }}</p>
            <p class="vote-census">{{ option.num }} 票 {{ option.progress }}%</p>
            <p class="vote-progress">
              <n-progress
                type="line"
                :height="5"
                :show-indicator="false"
                :percentage="parseInt(option.progress)"
                color="#1890ff"
              />
            </p>
          </div>
        </div>
        <div class="vfooter vote-view">
          <p>应参与人数：{{ extra.detail.answer_num }} 人</p>
          <p>实际参与人数：{{ extra.detail.answered_num }} 人</p>
        </div>
      </template>
      <template v-else>
        <div class="vbody">
          <div
            class="option"
            :class="{ radio: mode == 0 }"
            v-for="option in state.options"
            :key="option.key"
          >
            <p class="checkbox">
              <n-checkbox
                v-model:checked="option.is_checked"
                @update:checked="change(option.is_checked, option)"
              />
            </p>
            <p class="text" @click="change(!option.is_checked, option)">
              {{ option.key }}、{{ option.value }}
            </p>
          </div>
        </div>
        <div class="vfooter">
          <n-button plain round @click="onSubmit">
            {{ isCanSubmit ? '立即投票' : '请选择进行投票' }}
          </n-button>
        </div>
      </template>
    </div>
  </section>
</template>

<style lang="less" scoped>
.im-message-vote {
  width: 300px;
  min-height: 150px;
  border: 1px solid var(--border-color);
  box-sizing: border-box;
  border-radius: 10px;
  overflow: hidden;

  .vote-from {
    width: 100%;

    .vheader {
      min-height: 50px;
      background: #4e83fd;
      padding: 15px;
      position: relative;

      p {
        margin: 3px 0;
        &:first-child {
          color: rgb(245, 237, 237);
          font-size: 13px;
          margin-bottom: 8px;
        }

        &:last-child {
          color: white;
        }
      }

      &::before {
        content: '投票';
        position: absolute;
        font-size: 60px;
        color: white;
        opacity: 0.1;
        top: -5px;
        right: 10px;
      }
    }

    .vbody {
      min-height: 80px;
      width: 100%;
      padding: 5px 15px;
      box-sizing: border-box;

      .option {
        margin: 14px 0px;
        font-size: 13px;
        display: flex;
        flex-direction: row;

        .text {
          margin-left: 10px;
          cursor: pointer;
          line-height: 26px;
        }

        &.radio {
          :deep(.n-checkbox-box) {
            border-radius: 50%;
            margin-top: 2px;
          }
        }
      }

      margin-bottom: 10px;
    }

    .vfooter {
      height: 55px;
      text-align: center;
      box-sizing: border-box;

      .n-button {
        width: 90%;
        font-weight: 400;
      }

      &.vote-view {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding-left: 15px;

        p {
          border-left: 2px solid #2196f3;
          padding-left: 5px;
        }
      }
    }
  }

  .vote-view {
    width: 100%;
    min-height: 30px;
    margin: 15px 0;
    box-sizing: border-box;

    > p {
      margin: 6px 0px;
      font-size: 13px;
    }

    .vote-option {
      min-height: 20px;
      line-height: 20px;
    }

    .vote-census {
      height: 20px;
      line-height: 20px;
    }
  }
}
</style>
