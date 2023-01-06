<script setup>
import { onMounted } from 'vue'
import { textReplaceEmoji } from '@/utils/emojis'
import { textReplaceLink } from '@/utils/strings'
import { modal } from '@/utils/common'
import UserCardModal from '@/components/user/UserCardModal.vue'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  float: {
    type: String,
    default: 'right',
  },
  arrow: {
    type: Boolean,
    default: true,
  },
})

const lickColor = props.float == 'right' ? '#ffffff' : 'rgb(9 149 208)'

const textContent = textReplaceLink(props.content, lickColor)

onMounted(() => {
  document.querySelectorAll('.text-message .mention').forEach(el => {
    el.onclick = e => {
      if (e.target.dataset.atid > 0) {
        modal(UserCardModal, {
          uid: parseInt(e.target.dataset.atid),
        })
      }
    }
  })
})
</script>
<template>
  <div
    class="text-message"
    :class="{
      left: float == 'left',
      right: float == 'right',
    }"
  >
    <pre v-html="textReplaceEmoji(textContent)" />
  </div>
</template>
<style lang="less" scoped>
.text-message {
  position: relative;
  min-width: 30px;
  min-height: 30px;
  border-radius: 3px;
  padding: 3px;
  color: rgb(13, 26, 38);
  background: #eff0f1;

  &.right {
    color: #fff;
    background: #1ebafc;
  }

  pre {
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 14px;
    padding: 3px 10px;
    font-family: 'Microsoft YaHei';
    line-height: 25px;

    :deep(.emoji) {
      vertical-align: text-bottom;
      margin: 0 5px;
    }

    img {
      vertical-align: text-bottom;
    }
  }
}
</style>
