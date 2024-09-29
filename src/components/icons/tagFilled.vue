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
    style="min-width: 16px; min-height: 16px"
  >
    <g>
      <path
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke="currentColor"
        d="M4.125 7.875 2.25 9.75"
        data-follow-stroke="#3872E0"
      ></path>
      <path
        fill="#3872E0"
        d="M1.61 5.341a.375.375 0 0 1 .03-.557 2.95 2.95 0 0 1 1.105-.575 2.519 2.519 0 0 1 1.355.018c.147.044.23.085.23.085L7.254 1.39a.375.375 0 0 1 .53 0l2.845 2.845a.375.375 0 0 1 0 .53L7.706 7.687c.03.06.055.119.078.178.188.487.154.968.026 1.391l-.001.004a3.647 3.647 0 0 1-.577 1.1.374.374 0 0 1-.565.04L1.61 5.34Z"
        clip-rule="evenodd"
        fill-rule="evenodd"
        data-follow-fill="#3872E0"
      ></path>
    </g>
  </svg>
</template>
