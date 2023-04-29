<script setup>
import { ArrowUp, ArrowDown, CloseRemind } from '@icon-park/vue-next'
import Xtime from '@/components/base/Xtime.vue'
import { defAvatar } from '@/constant/default'
import { removeTags } from '@/utils/functions'

const emit = defineEmits(['tab-talk', 'top-talk'])

defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  avatar: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    default: '',
  },
  active: {
    type: Boolean,
    default: '',
  },
})
</script>

<template>
  <div
    class="talk pointer"
    :class="{ actived: active }"
    @click="emit('tab-talk', data)"
  >
    <div class="avatar-box">
      <n-avatar v-if="avatar" :src="avatar" :fallback-src="defAvatar" />
      <n-avatar v-else :style="{ color: 'white', backgroundColor: '#508afe' }">
        {{ username && username.substring(0, 1) }}
      </n-avatar>

      <div class="top-mask" @click.stop="emit('top-talk', data)">
        <n-icon :component="data.is_top == 1 ? ArrowDown : ArrowUp" />
      </div>
    </div>

    <div class="content-box">
      <div class="header">
        <div class="title">
          <span class="nickname">{{ username }}</span>
          <span class="badge top" v-show="data.is_top">TOP</span>
          <span class="badge roboot" v-show="data.is_robot">BOT</span>
          <span class="badge group" v-show="data.talk_type == 2">群组</span>
          <span class="disturb" v-show="data.is_disturb">
            <n-icon :component="CloseRemind" />
          </span>
        </div>
        <div class="datetime"><Xtime :time="data.updated_at" /></div>
      </div>

      <div class="content">
        <div class="text">
          <template v-if="!active && data.draft_text">
            <span class="draft">[草稿]</span>
            <span>{{ removeTags(data.draft_text) }}</span>
          </template>
          <template v-else>
            <span
              class="online"
              v-show="
                data.is_robot == 0 && data.talk_type == 1 && data.is_online == 1
              "
              >[在线]</span
            >
            <span>{{ removeTags(data.msg_text) }}</span>
          </template>
        </div>
        <div class="unread" v-show="data.unread_num">
          <span class="badge">
            {{ data.unread_num > 99 ? '99+' : data.unread_num }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.talk .mention {
  color: #8f959e;
}
</style>
<style lang="less" scoped>
.talk {
  padding: 8px 10px 8px 5px;
  height: 50px;
  display: flex;
  align-items: center;
  transition: 0.2s ease-in;
  margin: 5px 2px 5px 5px;
  border-radius: 5px;

  .avatar-box {
    height: 34px;
    width: 34px;
    background-color: #508afe;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: white;
    user-select: none;
    transition: ease 1s;
    position: relative;
    overflow: hidden;

    .top-mask {
      width: 100%;
      height: 100%;
      background-color: rgba(22, 25, 29, 0.6);
      position: absolute;
      top: 0;
      left: 0;
      color: white;
      display: none;
      align-items: center;
      justify-content: center;
    }

    &:hover .top-mask {
      display: flex;
    }
  }

  .content-box {
    height: 40px;
    display: flex;
    align-content: center;
    flex-direction: column;
    flex: 1 1;
    margin-left: 10px;
    overflow: hidden;

    .header {
      width: 100%;
      height: 20px;
      display: flex;
      align-items: center;

      .title {
        color: #1f2329;
        font-size: 14px;
        line-height: 20px;
        flex: 1 1;
        display: flex;
        overflow: hidden;
        .nickname {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 3px;
        }
      }

      .datetime {
        color: #8f959e;
        font-size: 12px;
        margin-left: 10px;
        user-select: none;
      }
    }

    .content {
      width: 100%;
      height: 20px;
      display: flex;
      align-items: center;

      .text {
        font-weight: 300;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        color: #8f959e;
        flex: 1 auto;

        .draft {
          color: red;
          padding-right: 3px;
        }
        .online {
          color: #8bc34a;
          padding-right: 3px;
        }
      }

      .unread {
        color: #8f959e;
        font-size: 12px;
        user-select: none;

        .badge {
          background-color: #f44336;
          color: #ffffff;
          border-radius: 3px;
          transform-origin: right;
        }
      }
    }
  }

  &:hover,
  &.actived {
    background-color: #ececec;
  }

  &.actived {
    .avatar-box {
      border-radius: 5px;
    }
  }
}

.badge {
  &.top {
    color: red !important;
    background-color: #ffdddd !important;
  }

  &.roboot {
    color: #dc9b04 !important;
    background-color: #faf1d1 !important;
  }

  &.group {
    color: #3370ff !important;
    background-color: #e1eaff !important;
  }
}

.disturb {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
}
</style>
