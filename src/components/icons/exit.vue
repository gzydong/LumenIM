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
    viewBox="0 0 16 17"
    style="min-width: 18px; min-height: 18px"
  >
    <g>
      <path
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke-width="1.5"
        stroke="rgba(89, 89, 89, 1)"
        d="M10.876 5.875 13.5 8.5l-2.624 2.625M6.5 8.5h6.998M6.5 14H3a.5.5 0 0 1-.5-.5v-10A.5.5 0 0 1 3 3h3.5"
        data-follow-stroke="#595959"
      ></path>
    </g>
  </svg>
</template>
