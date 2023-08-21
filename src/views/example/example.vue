<template>
  <div class="Drag2">
    <div class="box" ref="box">
      <div class="left">
        <!--左侧div内容-->
      </div>
      <div class="resize" title="左右侧边栏">⋮</div>
      <div class="mid">
        <!--右侧div内容-->
 
        <div class="topBox">
          <!--右上div内容-->
        </div>
        <div title="上下侧边栏" class="move">⋯</div>
        <div class="downBox">
          <!--右下div内容-->
        </div>
      </div>
    </div>
  </div>
</template>
 
 
<script setup lang="ts">
import { onMounted, ref } from "vue";
 
onMounted(() => {
  dragControllerLR();
  dragControllerUD();
});
// 左右拖动事件
function dragControllerLR() {
  var resize = document.getElementsByClassName("resize");
  var left = document.getElementsByClassName("left");
  var mid = document.getElementsByClassName("mid");
  var box = document.getElementsByClassName("box");
  console.log(document.getElementsByClassName("resize"));
  for (let i = 0; i < resize.length; i++) {
    // 鼠标按下事件
    resize[i].onmousedown = function (e) {
      //颜色改变提醒
      resize[i].style.background = "#818181";
      var startX = e.clientX;
      resize[i].left = resize[i].offsetLeft;
      // 鼠标拖动事件
      document.onmousemove = function (e) {
        var endX = e.clientX;
        var moveLen = resize[i].left + (endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
        var maxT = box[i].clientWidth - resize[i].offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
 
        if (moveLen < 50) moveLen = 50; // 左边区域的最小宽度为50px
        if (moveLen > maxT - 150) moveLen = maxT - 150; //右边区域最小宽度为150px
 
        resize[i].style.left = moveLen; // 设置左侧区域的宽度
 
        for (let j = 0; j < left.length; j++) {
          left[j].style.width = moveLen + "px";
          mid[j].style.width = box[i].clientWidth - moveLen - 10 + "px";
        }
      };
      // 鼠标松开事件
      // eslint-disable-next-line no-unused-vars
      document.onmouseup = function (evt) {
        //颜色恢复
        resize[i].style.background = "#d6d6d6";
        document.onmousemove = null;
        document.onmouseup = null;
        resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
      };
      resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
      return false;
    };
  }
}
// 上下拖动事件
function dragControllerUD() {
  var resize = document.getElementsByClassName("move");
  var topBox = document.getElementsByClassName("topBox");
  var downBox = document.getElementsByClassName("downBox");
  var box = document.getElementsByClassName("mid");
  console.log(document.getElementsByClassName("move"));
  for (let i = 0; i < resize.length; i++) {
    // 鼠标按下事件
    resize[i].onmousedown = function (e) {
      console.log(resize[i].top);
      //颜色改变提醒
      resize[i].style.background = "#818181";
      var startY = e.clientY;
      resize[i].top = resize[i].offsetTop;
      // 鼠标拖动事件
      document.onmousemove = function (e) {
        var endY = e.clientY;
        var moveLen = resize[i].top + (endY - startY); // （endY - startY）=移动的距离。resize[i].top+移动的距离=上边区域最后的高度
        var maxT = box[i].clientHeight - resize[i].offsetHeight; // 容器高度 - 上边区域的高度 = 下边区域的高度
 
        if (moveLen < 50) moveLen = 50; // 上边区域的最小高度为50px
        if (moveLen > maxT - 150) moveLen = maxT - 150; //下边区域最小高度为150px
 
        resize[i].style.top = moveLen; // 设置上边区域的高度
 
        for (let j = 0; j < topBox.length; j++) {
          topBox[j].style.height = moveLen + "px";
          downBox[j].style.height = box[i].clientHeight - moveLen - 10 + "px";
        }
      };
      // 鼠标松开事件
      document.onmouseup = function () {
        //颜色恢复
        resize[i].style.background = "#d6d6d6";
        document.onmousemove = null;
        document.onmouseup = null;
        resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
      };
      resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
      return false;
    };
  }
}
</script>
<style>
/* 拖拽相关样式 */
 
/*包围div样式*/
.box {
  width: 100vh;
  height: calc(98vh - 10px);
  margin: 1% 0px;
  overflow: hidden;
  box-shadow: -1px 9px 10px 3px rgba(0, 0, 0, 0.11);
}
/*左侧div样式*/
.left {
  width: calc(32% - 10px); /*左侧初始化宽度*/
  height: 100%;
  background: #71ad88;
  float: left;
}
/* 拖拽区div样式 */
.resize {
  cursor: w-resize;
  float: left;
  position: relative;
  top: 45%;
  background-color: #d6d6d6;
  border-radius: 5px;
  margin-top: -10px;
  width: 10px;
  height: 50px;
  background-size: cover;
  background-position: center;
  /*z-index: 99999;*/
  font-size: 32px;
  color: white;
}
 
/*拖拽区鼠标悬停样式*/
.move:hover {
  color: #444444;
}
/*右侧div'样式*/
.mid {
  float: left;
  width: 68%; /*右侧初始化宽度*/
  height: 100%;
  background: #f3f3f3;
  box-shadow: -1px 4px 5px 3px rgba(0, 0, 0, 0.11);
  /*上方div'样式*/
  .topBox {
    height: 60%;
    background-color: #3ff53f;
    display: flex;
  }
  /*下方div'样式*/
  .downBox {
    height: calc(40% - 10px);
    background-color: #f0fd35;
    display: flex;
  }
  /* 拖拽区div样式 */
  .move {
    cursor: s-resize;
    width: 50px;
    height: 10px;
    background-color: #d6d6d6;
    margin: 0 auto;
    border-radius: 5px;
    text-align: center;
    line-height: 3px;
    font-size: 32px;
    color: white;
  }
  /*拖拽区鼠标悬停样式*/
  .move:hover {
    color: #444444;
  }
}
</style>
 