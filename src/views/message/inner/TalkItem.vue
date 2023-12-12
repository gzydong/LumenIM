<script lang="ts" setup>
import { ArrowUp, ArrowDown, CloseRemind } from '@icon-park/vue-next'
import Xtime from '@/components/base/Xtime.vue'
import { ISession } from '@/types/chat'

const emit = defineEmits(['tab-talk', 'top-talk'])

defineProps<{
  data: ISession
  avatar: String
  username: String
  active: Boolean
}>()
</script>

<template>
  <div class="talk pointer" :class="{ actived: active }" @click="emit('tab-talk', data)">
    <div class="avatar-box">
      <im-avatar :src="avatar" :size="34" :username="data.name" />
      <div class="top-mask" @click.stop="emit('top-talk', data)">
        <n-icon :component="data.is_top == 1 ? ArrowDown : ArrowUp" />
      </div>
    </div>

    <div class="content-box">
      <div class="header">
        <div class="title">
          <span class="nickname">{{ username }}</span>
          <span class="badge top" v-show="data.is_top">顶</span>
          <span class="badge roboot" v-show="data.is_robot">助</span>
          <span class="badge group" v-show="data.talk_type == 2">群</span>
        </div>
        <div class="datetime"><Xtime :time="data.updated_at" /></div>
      </div>

      <div class="content">
        <div class="text">
          <template v-if="!active && data.draft_text">
            <span class="draft">[草稿]</span>
            <span class="detail" v-html="data.draft_text" />
          </template>
          <template v-else>
            <span class="online" v-show="data.talk_type == 1 && data.is_online == 1"> [在线] </span>
            <span class="detail" v-html="data.msg_text" />
          </template>
        </div>

        <div class="tip">
          <div v-if="data.is_disturb" class="disturb">
            <n-icon :component="CloseRemind" />
          </div>

          <div v-else class="unread" v-show="data.unread_num">
            <span class="badge">
              {{ data.unread_num > 99 ? '99+' : data.unread_num }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.talk {
  padding: 8px 10px 8px 5px;
  height: 50px;
  display: flex;
  align-items: center;
  transition: 0.2s ease-in;
  margin: 0px 2px 5px 5px;
  border-radius: 5px;

  .avatar-box {
    height: 34px;
    width: 34px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
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
      color: #ffffff;
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
          margin-right: 5px;
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
      justify-content: space-between;

      .text {
        overflow: hidden;
        font-weight: 300;
        font-size: 12px;
        color: #8f959e;
        display: flex;

        .draft {
          color: red;
          padding-right: 3px;
          flex-shrink: 0;
        }

        .online {
          color: #8bc34a;
          padding-right: 3px;
          flex-shrink: 0;
        }

        .detail {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .tip {
        height: inherit;
        display: flex;
        padding-left: 5px;
        align-items: center;

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

        .disturb {
          color: #8f959e;
          font-size: 12px;
          user-select: none;
        }
      }
    }
  }

  --actived-bg: #ececec;

  &:hover,
  &.actived {
    background-color: var(--actived-bg);
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

html[theme-mode='dark'] {
  .talk {
    --actived-bg: rgb(44, 44, 50);

    .nickname {
      color: #ffffff;
    }
  }

  .disturb {
    color: #ffffff;
  }
}
</style>
