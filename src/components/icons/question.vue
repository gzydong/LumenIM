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
        d="M20.95 11.625a8.625 8.625 0 0 1-8.625 8.625H3.7v-8.625a8.625 8.625 0 0 1 17.25 0Z"
        data-follow-stroke="#000"></path>
      <path
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-width="1.5"
        stroke="currentColor"
        d="M12.325 13.62v-1.725a2.587 2.587 0 1 0-2.588-2.588"
        data-follow-stroke="#000"></path>
      <path
        fill="currentColor"
        d="M12.325 17.501a1.078 1.078 0 1 0 0-2.156 1.078 1.078 0 0 0 0 2.156Z"
        clip-rule="evenodd"
        fill-rule="evenodd"
        data-follow-fill="#000"></path>
    </g>
  </svg>
</template>
