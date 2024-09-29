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
  <svg :width="width" :height="height" fill="none" viewBox="0 0 16 16" style="min-width: 16px; min-height: 16px">
    <g>
      <path
        data-follow-fill="currentColor"
        d="M4.667 4.667V2a.667.667 0 0 1 .666-.667H14a.667.667 0 0 1 .667.667v8.667a.667.667 0 0 1-.667.666h-2.667v2.662a.67.67 0 0 1-.671.672H2.005a.67.67 0 0 1-.672-.672l.002-8.657c0-.37.3-.671.672-.671h2.66Zm1.333 0h4.662a.67.67 0 0 1 .671.671V10h2V2.667H6v2ZM2.669 6l-.002 7.333H10V6H2.669Z"
        fill="currentColor"></path>
    </g>
  </svg>
</template>
