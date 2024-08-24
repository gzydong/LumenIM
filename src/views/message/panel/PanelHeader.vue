<script lang="ts" setup>
import { NPopover } from 'naive-ui'
import { PeoplePlusOne, MenuUnfoldOne, MenuFoldOne, MoreTwo } from '@icon-park/vue-next'
import { useDialogueStore } from '@/store'

defineProps({
  talkMode: {
    type: Number,
    default: 1
  },
  username: {
    type: String,
    default: ''
  },
  online: {
    type: Boolean,
    default: false
  },
  keyboard: {
    type: Boolean,
    default: false
  },
  num: {
    type: Number,
    default: 0
  }
})

const dialogueStore = useDialogueStore()
const emit = defineEmits(['evnet'])

const onSetMenu = () => {
  dialogueStore.isShowSessionMenu = !dialogueStore.isShowSessionMenu
}
</script>

<template>
  <header class="el-header box-header">
    <div class="menu bdr-r pointer" @click="onSetMenu">
      <n-icon
        :component="dialogueStore.isShowSessionMenu ? MenuUnfoldOne : MenuFoldOne"
        :size="22"
      />
    </div>

    <div class="module left-module">
      <span class="tag" :class="{ red: talkMode == 1 }">
        {{ talkMode == 1 ? '好友' : '群聊' }}
      </span>
      <span class="online online-status" v-show="online"></span>
      <span class="nickname">{{ username }}</span>
      <span class="keyboard" v-show="keyboard">对方正在输入...</span>
      <span class="num" v-show="talkMode == 2 && num">({{ num }})</span>
    </div>

    <div class="module right-module">
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon
            :component="PeoplePlusOne"
            :size="18"
            class="icon"
            @click="emit('evnet', 'add-group')"
          />
        </template>
        {{ talkMode == 1 ? '发起群聊' : '邀请好友' }}
      </n-popover>

      <n-popover trigger="hover">
        <template #trigger>
          <n-icon
            v-show="talkMode == 2"
            :component="MoreTwo"
            :size="18"
            class="icon"
            @click="emit('evnet', 'group')"
          />
        </template>
        更多
      </n-popover>
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
  position: relative;

  .menu {
    width: 50px;
    position: absolute;
    display: flex;
    align-items: center;
    left: 0;
    justify-content: center;
  }

  .module {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .left-module {
    padding-right: 5px;
    padding-left: 50px;

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

    .keyboard {
      animation: inputfade 1s infinite;
      -webkit-animation: inputfade 1s infinite;
      margin-left: 5px;
      font-size: 12px;
    }

    .online {
      margin-left: 10px;
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
</style>
