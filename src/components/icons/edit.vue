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
        d="M12.75 6 18 11.25M20.25 20.25H9l-5.202-5.202"
        data-follow-stroke="#000"></path>
      <path
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-width="1.5"
        stroke="currentColor"
        d="M9 20.25H4.5a.75.75 0 0 1-.75-.75v-4.19a.75.75 0 0 1 .22-.53L15.22 3.53a.75.75 0 0 1 1.06 0l4.19 4.19a.75.75 0 0 1 0 1.06L9 20.25Z"
        data-follow-stroke="#000"></path>
    </g>
  </svg>
</template>
