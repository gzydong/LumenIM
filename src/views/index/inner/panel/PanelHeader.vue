<script setup>
import { NDropdown } from 'naive-ui'
import { More } from '@icon-park/vue-next'

defineProps({
  type: {
    type: Number,
    default: 1,
  },
  username: {
    type: String,
    default: '',
  },
  online: {
    type: Boolean,
    default: false,
  },
  keyboard: {
    type: Boolean,
    default: false,
  },
  num: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['evnet'])

const onEvent = key => {
  emit('evnet', key)
}
</script>

<template>
  <header class="el-header box-header bdr-b">
    <div class="module left-module">
      <span class="tag" :class="{ red: type == 1 }">
        {{ type == 1 ? '好友' : '群组' }}
      </span>
      <span class="nickname">{{ username }}</span>
      <span class="num" v-show="type == 2 && num">({{ num }})</span>
    </div>

    <div class="module center-module" v-if="type == 1">
      <p class="online">
        <span class="online-status" v-show="online"></span>
        <span>{{ online ? '在线' : '离线' }}</span>
      </p>
      <p class="keyboard-status" v-show="keyboard">对方正在输入 ...</p>
    </div>

    <div class="module right-module">
      <n-dropdown
        trigger="hover"
        :show-arrow="true"
        :options="[
          {
            label: '群信息',
            key: 'group',
            disabled: type == 1,
          },
          {
            label: '群公告',
            key: 'notice',
            disabled: type == 1,
          },
        ]"
        placement="bottom-end"
        @select="onEvent"
      >
        <n-icon :size="30" class="icon" :component="More" />
      </n-dropdown>
    </div>
  </header>
</template>

<style lang="less" scoped>
.box-header {
  height: 60px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  -webkit-app-region: drag;

  .module {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .left-module {
    padding-right: 5px;
    width: 200px;

    .tag {
      background: rgb(81 139 254);
      height: 18px;
      line-height: 18px;
      padding: 1px 3px;
      font-size: 10px;
      color: white;
      border-radius: 3px;
      margin-right: 8px;
      flex-shrink: 0;

      &.red {
        background: #f97348;
      }
    }

    .nickname {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .center-module {
    flex-direction: column;
    justify-content: center;

    .online {
      color: #cccccc;
      font-weight: 300;
      font-size: 15px;
      width: 50px;
      text-align: center;

      &.color {
        color: #1890ff;
      }

      .online-status {
        position: relative;
        top: -1px;
        display: inline-block;
        width: 6px;
        height: 6px;
        vertical-align: middle;
        border-radius: 50%;
        position: relative;
        background-color: #1890ff;
        margin-right: 5px;

        &:after {
          position: absolute;
          top: -1px;
          left: -1px;
          width: 100%;
          height: 100%;
          border: 1px solid #1890ff;
          border-radius: 50%;
          -webkit-animation: antStatusProcessing 1.2s ease-in-out infinite;
          animation: antStatusProcessing 1.2s ease-in-out infinite;
          content: '';
        }
      }
    }

    .keyboard-status {
      height: 20px;
      line-height: 18px;
      font-size: 10px;
      animation: inputfade 600ms infinite;
      -webkit-animation: inputfade 600ms infinite;
    }
  }

  .right-module {
    width: 200px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    p {
      cursor: pointer;
      margin: 0 8px;
      font-size: 20px;
      color: #828f95;
      &:active i {
        font-size: 26px;
        transform: scale(1.3);
        transition: ease 0.5s;
        color: red;
      }
    }

    .icon {
      cursor: pointer;
      margin: 0 8px;
    }
  }
}

/* css 动画 */
@keyframes inputfade {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  to {
    opacity: 1;
  }
}

@-webkit-keyframes inputfade {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  to {
    opacity: 1;
  }
}

@-webkit-keyframes antStatusProcessing {
  0% {
    -webkit-transform: scale(0.8);
    transform: scale(0.8);
    opacity: 0.5;
  }

  to {
    -webkit-transform: scale(2.4);
    transform: scale(2.4);
    opacity: 0;
  }
}

@keyframes antStatusProcessing {
  0% {
    -webkit-transform: scale(0.8);
    transform: scale(0.8);
    opacity: 0.5;
  }

  to {
    -webkit-transform: scale(2.4);
    transform: scale(2.4);
    opacity: 0;
  }
}

.tag {
  background: rgb(81 139 254);
  height: 18px;
  line-height: 18px;
  padding: 1px 3px;
  font-size: 10px;
  color: white;
  border-radius: 3px;
  margin-right: 8px;
  flex-shrink: 0;

  &.red-color {
    background: #f97348;
  }
}
</style>
