<template>
  <div class="loading-content">
    <div class="ant-spin ant-spin-spinning">
      <span class="ant-spin-dot ant-spin-dot-spin">
        <i class="ant-spin-dot-item"></i>
        <i class="ant-spin-dot-item"></i>
        <i class="ant-spin-dot-item"></i>
        <i class="ant-spin-dot-item"></i>
      </span>
      <div class="ant-spin-text" style="color: #9b9b9b; margin-top: 8px">加载中...</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.loading-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  background: var(--im-bg-color);
  z-index: 1000;
  position: absolute;
  left: 0;
  top: 0;

  p {
    margin-top: 10px;
    color: rgb(194 194 194);
  }
}

.ant-spin {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: #000000d9;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: 'tnum';
  position: absolute;
  display: none;
  color: #1890ff;
  text-align: center;
  vertical-align: middle;
  opacity: 0;
  transition: transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
}
.ant-spin-spinning {
  position: static;
  display: inline-block;
  opacity: 1;
}
.ant-spin-container {
  position: relative;
  transition: opacity 0.3s;
}
.ant-spin-container:after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  display: none;
  width: 100%;
  height: 100%;
  background: #fff;
  opacity: 0;
  transition: all 0.3s;
  content: '';
  pointer-events: none;
}
.ant-spin-blur {
  clear: both;
  opacity: 0.5;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  pointer-events: none;
}
.ant-spin-blur:after {
  opacity: 0.4;
  pointer-events: auto;
}
.ant-spin-tip {
  color: #00000073;
}
.ant-spin-dot {
  position: relative;
  display: inline-block;
  font-size: 20px;
  width: 1em;
  height: 1em;
}
.ant-spin-dot-item {
  position: absolute;
  display: block;
  width: 9px;
  height: 9px;
  background-color: #1890ff;
  border-radius: 100%;
  transform: scale(0.75);
  transform-origin: 50% 50%;
  opacity: 0.3;
  animation: antSpinMove 1s infinite linear alternate;
}
.ant-spin-dot-item:nth-child(1) {
  top: 0;
  left: 0;
}
.ant-spin-dot-item:nth-child(2) {
  top: 0;
  right: 0;
  animation-delay: 0.4s;
}
.ant-spin-dot-item:nth-child(3) {
  right: 0;
  bottom: 0;
  animation-delay: 0.8s;
}
.ant-spin-dot-item:nth-child(4) {
  bottom: 0;
  left: 0;
  animation-delay: 1.2s;
}
.ant-spin-dot-spin {
  transform: rotate(45deg);
  animation: antRotate 1.2s infinite linear;
}
.ant-spin-sm .ant-spin-dot {
  font-size: 14px;
}
.ant-spin-sm .ant-spin-dot i {
  width: 6px;
  height: 6px;
}
.ant-spin-lg .ant-spin-dot {
  font-size: 32px;
}
.ant-spin-lg .ant-spin-dot i {
  width: 14px;
  height: 14px;
}
.ant-spin.ant-spin-show-text .ant-spin-text {
  display: block;
}

@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  .ant-spin-blur {
    background: #fff;
    opacity: 0.5;
  }
}
.ant-spin-rtl {
  direction: rtl;
}
.ant-spin-rtl .ant-spin-dot-spin {
  transform: rotate(-45deg);
  animation-name: antRotateRtl;
}
@keyframes antSpinMove {
  to {
    opacity: 1;
  }
}
@keyframes antRotate {
  to {
    transform: rotate(405deg);
  }
}
</style>
