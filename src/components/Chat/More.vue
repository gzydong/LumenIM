<script setup></script>
<template>
  <div class="more">
    <span class="icon">
      <svg
        width="16"
        height="16"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        data-v-ea893728=""
      >
        <path
          fill="currentColor"
          d="m488.832 344.32-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872 319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0z"
        ></path>
      </svg>
    </span>
    <span class="text">点击加载更多</span>
  </div>
</template>
<style scoped>
.more {
  height: 30px;
  width: 100%;
  position: relative;
  text-align: center;
  line-height: 1;
  cursor: pointer;
  top: -10px;
}
.icon {
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.text {
  display: block;
  font-size: 12px;
}
</style>
