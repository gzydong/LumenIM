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
        d="M12 15a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
        data-follow-stroke="#000"></path>
      <path
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-width="1.5"
        stroke="currentColor"
        d="M5.98 18.691a6.753 6.753 0 0 1 12.038 0M18.75 6.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM18.75 3.75V2.625M17.45 4.5l-.973-.563M17.45 6l-.973.563M18.75 6.75v1.125M20.049 6l.974.563M20.049 4.5l.974-.563"
        data-follow-stroke="#000"></path>
      <path
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-width="1.5"
        stroke="currentColor"
        d="M20.936 10.922a9 9 0 1 1-8.1-7.884"
        data-follow-stroke="#000"></path>
    </g>
  </svg>
</template>
