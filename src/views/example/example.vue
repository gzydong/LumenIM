<template>
  <div>
    <!-- <Draggable
      class="draggable-ul"
      animation="300"
      :list="demandList"
      itemKey="name"
    >
      <template #item="{ element }">
        <div class="cursor-move draggable-li">
          <span class="ml-2">{{ element.name }}</span>
        </div>
      </template>
    </Draggable> -->

    <div class="ids" v-loading="true" @click="to"></div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import Draggable from 'vuedraggable'

const demandList = reactive([
  { name: '预约表单页面，能填写预约相关信息', id: 1 },
  { name: '促销活动页面，包含促销广告展示', id: 2 },
  { name: '商品列表，需要一个到货提醒功能', id: 3 },
  { name: '商品需要一个评价功能', id: 4 },
  { name: '商品图片需要提供放大镜', id: 5 },
  { name: '订单需要提供删除到回收站', id: 6 },
  { name: '用户头像上传，需要支持裁剪', id: 7 },
  { name: '据说Vue3.2发布了，setup啥时候支持？', id: 8 },
])

function copyInfo(sets) {
  let imgDiv = document.createElement('div')
  imgDiv.id = '__imgDiv'
  imgDiv.setAttribute('style', 'z-index: -1;position: fixed;')
  let child = ''
  if (sets.txts) {
    if (typeof sets.txts === 'string') {
      child += `<span>${sets.txts}</span>`
    } else {
      sets.txts.forEach(item => {
        child += `<span>${item}</span>`
      })
    }
  }
  if (sets.imgs) {
    if (typeof sets.imgs === 'string') {
      sets.imgs =
        sets.imgs.indexOf('https') > -1
          ? sets.imgs.replace('https', 'http')
          : sets.imgs
      child += `<img src="${sets.imgs}" />`
    } else {
      sets.imgs.forEach(item => {
        item = item.indexOf('https') > -1 ? item.replace('https', 'http') : item
        child += `<img src="${item}" />`
      })
    }
  }
  imgDiv.innerHTML = child
  document.body.insertBefore(imgDiv, document.body.lastChild)
  let dom = document.getElementById('__imgDiv')
  console.log(dom)
  if (window.getSelection) {
    //chrome等主流浏览器
    let selection = window.getSelection()
    let range = document.createRange()
    range.selectNodeContents(dom)
    selection.removeAllRanges()
    selection.addRange(range)
  } else if (document.body.createTextRange) {
    //ie
    let range = document.body.createTextRange()
    range.moveToElementText(dom)
    range.select()
  }
  document.execCommand('copy')
  window.getSelection().removeAllRanges()
  imgDiv.parentNode.removeChild(imgDiv)
}

const to = () => {
  copyInfo({
    txts: '请复制我',
    imgs: [
      'https://img.shop.wusehaowu.com/20210407/da46894987254688af008a95ad121da9.png',
      'https://t00img.yangkeduo.com/goods/images/2021-02-27/1e5bc93f957fefabc13d994a9f379dda.jpeg',
    ],
  })
}
</script>

<style lang="less" scoped>
.ids {
  width: 300px;
  height: 300px;
}

.draggable-ul {
  width: 100%;
  overflow: hidden;
  margin-top: -16px;

  .draggable-li {
    width: 100%;
    padding: 16px 10px;
    color: #333;
    border-bottom: 1px solid #efeff5;
  }
}
</style>
