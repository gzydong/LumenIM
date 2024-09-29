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
    viewBox="0 0 10 11"
    style="min-width: 14px; min-height: 14px"
  >
    <g>
      <path
        data-follow-stroke="currentColor"
        d="m4.992 2.062.035 3.285-.035 3.575"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        data-follow-fill="currentColor"
        d="m1.563 5.492 3.284.035 3.575-.035"
        fill="currentColor"
      ></path>
      <path
        data-follow-stroke="currentColor"
        d="m1.563 5.492 3.284.035 3.575-.035"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </g>
  </svg>
</template>
