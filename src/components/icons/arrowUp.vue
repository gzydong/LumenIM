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
  <svg
    :width="width"
    :height="height"
    fill="none"
    viewBox="0 0 32 32"
    style="min-width: 16px; min-height: 16px; transform: rotate(180deg)">
    <g>
      <path
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-width="3"
        stroke="#595959"
        d="M26.666 10.667 16 21.333 5.333 10.667"
        data-follow-stroke="#595959"></path>
    </g>
  </svg>
</template>
