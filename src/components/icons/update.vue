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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.333 2.667c0-.737.597-1.334 1.334-1.334h4.666a.667.667 0 0 1 0 1.334H2.667v10.666h10.666V8.667a.667.667 0 0 1 1.334 0v4.666c0 .737-.597 1.334-1.334 1.334H2.667a1.333 1.333 0 0 1-1.334-1.334V2.667Zm10.232-1.334c.177 0 .347.07.472.196l2.434 2.436c.26.26.26.682 0 .942l-6.894 6.898a.667.667 0 0 1-.471.195h-2.44A.667.667 0 0 1 4 11.333V8.907c0-.177.07-.347.195-.472l6.898-6.906a.667.667 0 0 1 .472-.196Zm0 1.61-6.232 6.24v1.484H6.83l6.227-6.231-1.492-1.493Z"
        fill="currentColor"></path>
    </g>
  </svg>
</template>
