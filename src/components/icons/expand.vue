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
    data-v-eb6f0115=""
    :width="width"
    :height="height"
    fill="none"
    viewBox="0 0 16 16"
    style="min-width: 16px; min-height: 16px">
    <g data-v-eb6f0115="">
      <path
        data-v-eb6f0115=""
        data-follow-stroke="#637381"
        d="M10 3h3v3m-3.5.5L13 3"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"></path>
      <path
        data-v-eb6f0115=""
        data-follow-stroke="#37404A"
        d="M6 13H3v-3m3.5-.5L3 13"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"></path>
    </g>
  </svg>
</template>
