<script setup lang="ts">
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import '@/assets/css/editor-mention.less'
import { ref, onMounted, onUnmounted } from 'vue'
import Quill from 'quill'
import { Mention, MentionBlot } from 'quill-mention'

import { defaultOptions } from './const'
import { mergeOptions } from './util'

import EmojiBlot from './formats/emoji'
import QuoteBlot from './formats/quote'

Quill.register({ 'blots/mention': MentionBlot, 'modules/mention': Mention })
Quill.register('formats/emoji', EmojiBlot)
Quill.register('formats/quote', QuoteBlot)

defineExpose({
  getQuill
})

const emit = defineEmits(['ready', 'change', 'blur', 'focus'])

const model = defineModel()

const { options } = defineProps({
  options: {
    type: Object,
    required: false,
    default: () => ({})
  }
})

const editor = ref(null)

let quill: Quill | null = null

function getQuill(): Quill | null {
  return quill
}

const initialize = () => {
  if (!editor.value) return

  quill = new Quill(editor.value, mergeOptions(defaultOptions, options))

  quill.on('selection-change', (range) => {
    emit(!range ? 'blur' : 'focus', quill)
  })

  quill.on('text-change', () => {
    if (!editor.value) return

    let text = quill?.getText().replace(/\n+$/, '')

    // @ts-ignore
    let html = editor.value?.children[0].innerHTML

    if (html === '<p><br></p>') html = ''

    model.value = html

    emit('change', { html, text, quill })
  })

  emit('ready', quill)
}

onMounted(() => {
  initialize()
})

onUnmounted(() => {
  quill = null
})
</script>

<template>
  <section class="quill-editor">
    <section ref="editor" />
  </section>
</template>

<style scoped></style>
