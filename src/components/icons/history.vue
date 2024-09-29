<script setup>
import { defineProps } from "vue";

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
    viewBox="0 0 12 12"
    style="min-width: 15px; min-height: 15px"
  >
    <g>
      <path
        data-follow-stroke="currentColor"
        d="M6 3.75V6m1.949 1.125L6 6m2.633-1.326h1.875V2.8"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        data-follow-stroke="currentColor"
        d="M8.917 8.917a4.125 4.125 0 1 1 0-5.834l1.59 1.591"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </g>
  </svg>
</template>
