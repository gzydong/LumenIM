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
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-width="1.5"
        stroke="currentColor"
        d="M21.75 20.25 16.5 9.75l-5.25 10.5M12.75 17.25h7.5M8.25 3v2.25M2.25 5.25h12M11.25 5.25a9 9 0 0 1-9 9"
        data-follow-stroke="#000"></path>
      <path
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-width="1.5"
        stroke="currentColor"
        d="M5.763 8.25a9.004 9.004 0 0 0 8.486 5.997"
        data-follow-stroke="#000"></path>
    </g>
  </svg>
</template>
