<script setup>
import { SendOne, AddOne, PeoplePlusOne } from '@icon-park/vue-next'

const emit = defineEmits(['talk', 'join'])
defineProps({
  avatar: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    default: ''
  },
  gender: {
    type: Number,
    default: 0
  },
  motto: {
    type: String,
    default: ''
  },
  flag: {
    type: String,
    default: ''
  },
  isMember: {
    type: Boolean,
    default: false
  },
  isQiye: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="items-box">
    <div class="left-item">
      <im-avatar :src="avatar" :size="40" :username="username" />
    </div>

    <div class="right-item">
      <div class="username">
        <span class="text-ellipsis">
          {{ username || '-' }}
        </span>
        <span v-show="isQiye" class="badge">企业</span>
      </div>

      <div class="flags text-ellipsis">{{ motto || '...' }}</div>

      <div class="helper">
        <div class="status">{{ flag }}</div>
        <div class="tool">
          <n-icon
            :component="isMember ? SendOne : PeoplePlusOne"
            @click.stop="emit(isMember ? 'talk' : 'join')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.items-box {
  display: flex;
  min-width: 220px;
  min-height: 50px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;

  .left-item {
    width: 50px;
    flex-shrink: 0;

    .avatar {
      width: 40px;
      height: 40px;
      font-size: 16px;
      color: #ffffff;
      background-color: rgb(80 138 254);
      border-radius: 50%;
    }
  }

  .right-item {
    width: 100%;
    min-height: 40px;
    overflow: hidden;

    .username {
      width: 100%;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
    }

    .flags {
      width: 100%;
      height: 20px;
      font-size: 12px;
      color: #8f959e;
      margin-top: 3px;
    }

    .helper {
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 5px;
      .status {
        font-size: 12px;
        color: #8f959e;
      }
      .tool {
        &.disable {
          color: #d6d6d6;
          cursor: not-allowed;
        }

        padding-top: 3px;
      }
    }
  }

  &:hover {
    border-color: rgb(80 138 254);
    cursor: pointer;
  }

  &:nth-child(even) {
    .avatar {
      background-color: orange !important;
    }
  }
}
</style>
