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
        d="M16.5 3v9l-3-2.25-3 2.25V3M4.5 20.25V21H18"
        data-follow-stroke="#000"></path>
      <path
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-width="1.5"
        stroke="currentColor"
        d="M4.5 20.25A2.25 2.25 0 0 1 6.75 18H19.5V3H6.75A2.25 2.25 0 0 0 4.5 5.25v15Z"
        data-follow-stroke="#000"></path>
    </g>
  </svg>
</template>
