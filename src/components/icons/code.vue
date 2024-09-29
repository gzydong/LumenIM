<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  width: {
    type: [Number, String],
    default: 18,
  },
  height: {
    type: [Number, String],
    default: 18,
  },
});
</script>
<template>
  <svg :width="width" :height="height" fill="none" viewBox="0 0 24 24" style="min-width: 16px; min-height: 16px">
    <g>
      <path
        fill="currentColor"
        d="M7.8 19.2H7A1.2 1.2 0 0 1 5.8 18v-4.1a1.8 1.8 0 0 0-1.236-1.71L3.987 12l.577-.19A1.8 1.8 0 0 0 5.8 10.1V6A1.2 1.2 0 0 1 7 4.8h.8V3.2H7A2.8 2.8 0 0 0 4.2 6v3.7a1.7 1.7 0 0 1-1.7 1.7h-.3v1.2h.3a1.7 1.7 0 0 1 1.7 1.7V18A2.8 2.8 0 0 0 7 20.8h.8v-1.6ZM16.2 19.2h.8a1.2 1.2 0 0 0 1.2-1.2v-4.1a1.8 1.8 0 0 1 1.236-1.71l.577-.19-.577-.19A1.8 1.8 0 0 1 18.2 10.1V6A1.2 1.2 0 0 0 17 4.8h-.8V3.2h.8A2.8 2.8 0 0 1 19.8 6v3.7a1.701 1.701 0 0 0 1.7 1.7h.3v1.2h-.3a1.7 1.7 0 0 0-1.7 1.7V18a2.8 2.8 0 0 1-2.8 2.8h-.8v-1.6Z"
        clip-rule="evenodd"
        fill-rule="evenodd"
        data-follow-fill="#09121F"></path>
    </g>
  </svg>
</template>
