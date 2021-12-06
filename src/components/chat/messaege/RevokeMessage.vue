<template>
  <div class="revoke-message">
    <div class="content">
      <span v-if="$store.state.user.uid == item.user_id">
        你撤回了一条消息 | {{ sendTime(item.created_at) }}
      </span>
      <span v-else-if="item.talk_type == 1">
        对方撤回了一条消息 | {{ sendTime(item.created_at) }}
      </span>
      <span v-else>
        "{{ item.nickname }}" 撤回了一条消息 | {{ sendTime(item.created_at) }}
      </span>
    </div>
  </div>
</template>
<script>
import { formateTime as sendTime } from '@/utils/functions'

export default {
  name: 'RevokeMessage',
  props: {
    item: {
      type: Object,
    },
  },
  methods: {
    sendTime,
  },
}
</script>
<style lang="less" scoped>
.revoke-message {
  display: flex;
  justify-content: center;

  .content {
    margin: 10px auto;
    background-color: #f5f5f5;
    font-size: 11px;
    line-height: 30px;
    padding: 0 8px;
    word-break: break-all;
    word-wrap: break-word;
    color: #979191;
    user-select: none;
    font-weight: 300;
    display: inline-block;
    border-radius: 3px;

    span {
      margin: 0 5px;
    }

    a {
      color: #939596;
      cursor: pointer;
      font-size: 12px;
      font-weight: 400;

      &:hover {
        color: black;
      }
    }
  }
}
</style>
