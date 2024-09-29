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
    aria-hidden="true"
    focusable="false"
    role="img"
    class="octicon octicon-paper-airplane"
    viewBox="0 0 16 16"
    :width="width"
    :height="height"
    fill="currentColor"
    style="
      display: inline-block;
      user-select: none;
      vertical-align: text-bottom;
      overflow: visible;
    "
  >
    <path
      d="M.989 8 .064 2.68a1.342 1.342 0 0 1 1.85-1.462l13.402 5.744a1.13 1.13 0 0 1 0 2.076L1.913 14.782a1.343 1.343 0 0 1-1.85-1.463L.99 8Zm.603-5.288L2.38 7.25h4.87a.75.75 0 0 1 0 1.5H2.38l-.788 4.538L13.929 8Z"
    ></path>
  </svg>
</template>
