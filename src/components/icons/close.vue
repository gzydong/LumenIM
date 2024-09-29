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
  <svg :width="width" :height="height" fill="none" viewBox="0 0 18 18" style="min-width: 20px; min-height: 20px">
    <g data-v-c1c2358d="">
      <path
        data-v-c1c2358d=""
        data-follow-fill="currentColor"
        d="m10.052 8.996 3.221-3.214a.752.752 0 0 0-1.063-1.064L8.996 7.94 5.783 4.72a.752.752 0 1 0-1.064 1.063L7.94 8.996l-3.22 3.213a.75.75 0 0 0 0 1.064.75.75 0 0 0 1.063 0l3.213-3.221 3.214 3.22a.749.749 0 0 0 1.063 0 .75.75 0 0 0 0-1.063l-3.22-3.213Z"
        fill="currentColor"></path>
    </g>
  </svg>
</template>
