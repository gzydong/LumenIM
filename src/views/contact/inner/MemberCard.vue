<script setup>
import { Male, Female, ShareThree } from '@icon-park/vue-next'
import { defAvatar } from '@/constant/default'
const emit = defineEmits(['to-talk'])

defineProps({
  avatar: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    default: '',
  },
  gender: {
    type: Number,
    default: 0,
  },
  motto: {
    type: String,
    default: '',
  },
  flag: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="items-box pointer">
    <div class="left-item">
      <div v-if="avatar" class="avatar flex-center">
        <n-avatar :src="avatar" :size="40" round :fallback-src="defAvatar" />
      </div>
      <div v-else class="avatar flex-center">
        {{ username.substring(0, 1) }}
      </div>
    </div>

    <div class="right-item">
      <div class="username">
        <span class="text-ellipsis">
          {{ username || '-' }}
        </span>

        <div v-if="gender > 0">
          <n-icon v-if="gender == 2" :component="Female" color="#ff5722" />
          <n-icon v-else :component="Male" color="#508afe" />
        </div>
      </div>

      <div class="flags text-ellipsis">{{ motto || '...' }}</div>

      <div class="helper">
        <div class="status">{{ flag }}</div>
        <div class="tool">
          <n-icon :component="ShareThree" @click.stop="emit('to-talk')" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.items-box {
  display: flex;
  width: 100%;
  min-height: 50px;
  border: 1px solid #efefef;
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
  }

  &:nth-child(even) {
    .avatar {
      background-color: orange !important;
    }
  }
}
</style>
