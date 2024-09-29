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
  <svg :width="width" :height="height" fill="none" viewBox="0 0 32 32" style="min-width: 16px; min-height: 16px">
    <g>
      <path
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-width="1.5"
        stroke="currentColor"
        d="m27 26-5-10-5 10M18.428 23.143h7.143M5 18h9M5 23h9M5.006 8h21M5.006 13h21"
        data-follow-stroke="#000"></path>
    </g>
  </svg>
</template>
