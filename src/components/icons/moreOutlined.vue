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
    focusable="false"
    class=""
    data-icon="more"
    :width="width"
    :height="height"
    fill="currentColor"
    aria-hidden="true"
    viewBox="64 64 896 896"
  >
    <path
      d="M456 231a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0z"
    ></path>
  </svg>
</template>
