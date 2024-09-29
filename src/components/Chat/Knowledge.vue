<script setup>
import { ref, onMounted, nextTick } from 'vue'
import ChatCard from './ChatCard.vue'
import ChatInput from './ChatInput.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import { message } from 'ant-design-vue'
import showdown from 'showdown'
import { IArrowDown } from '../icons'
import {
  queryChatList,
  queryChatContentList,
  queryModelList,
  queryCollectModelList,
  queryChatCompletion
} from '../../api/embedding'

const curChat = ref(null)
const chatContentList = ref([])
const textarea = ref('')
const showLoading = ref(false)
const generating = ref(false)

const modelList = ref([])
const model = ref(null)
const showSelectModel = ref(false)

const converter = new showdown.Converter()

const getHtml = (content) => {
  return converter.makeHtml(content)
}

const scrollToBottom = () => {
  nextTick(() => {
    document
      .querySelector('#echo-content-root')
      .shadowRoot.querySelector('.chat-container').scrollTop = 999999
  })
}
const fetchChatList = async () => {
  if (!model.value) {
    console.log('model.value', model.value)
    return
  }
  try {
    const response = await queryChatList({
      model_id: model.value?._id
    })
    if (response && response.length) {
      curChat.value = response[0]
    }
  } catch (e) {
    message.error(e.message)
  }
}
const fetchChatContentList = async () => {
  if (!curChat.value) return
  try {
    const response = await queryChatContentList({
      chat_id: curChat.value._id
    })
    chatContentList.value = (response || []).map((item) => {
      return {
        ...item,
        content: getHtml(item.content)
      }
    })
    chatContentList.value.push({
      chat_id: curChat.value._id,
      content: '👋 你好，有什么可以帮助你？',
      item_type: 'reply',
      gmt_create: Date.now()
    })
    chatContentList.value.reverse()
  } catch (e) {
    message.error(e.message)
  }
}

const handleChangeTextarea = (content) => {
  textarea.value = content
}

const handleEnter = async () => {
  if (!model.value) {
    return message.error('请选择模型')
  }
  if (!textarea.value) {
    return message.error('请输入内容')
  }
  if (generating.value) {
    return message.error('会话中,请稍后再试!')
  }

  const content = textarea.value

  chatContentList.value.push({
    chat_id: curChat.value._id,
    content,
    item_type: 'intent',
    gmt_create: Date.now()
  })

  textarea.value = ''

  scrollToBottom()
  showLoading.value = true

  try {
    generating.value = true

    // chrome.runtime.sendMessage(
    //   {
    //     type: "get-sse",
    //     url: "/echo/embedding/chatCompletion",
    //     params: {
    //       text: content,
    //       chat_id: curChat.value._id,
    //       model_id: model.value?._id,
    //     },
    //     from: "knowledge",
    //   },
    //   () => {}
    // );

    // 发送消息
    const params = {
      text: content,
      chat_id: curChat.value._id,
      model_id: model.value?._id
    }
    await queryChatCompletion(params)

    chatContentList.value.push({
      chat_id: curChat.value._id,
      content: '',
      item_type: 'reply',
      gmt_create: Date.now()
    })
  } catch (e) {
    message.error(e.message)
    showLoading.value = false
  }
}
const fetchCollectModelList = async () => {
  try {
    const response = await queryCollectModelList()
    if (response && response.length) {
      modelList.value = modelList.value.concat(
        (response || []).map((item) => ({
          label: item.name,
          value: item._id,
          _id: item._id
        }))
      )
      if (!model.value) {
        model.value = modelList.value[0]
      }
    }
  } catch (e) {
    modelList.value = []
  }
}
const fetchModelList = async () => {
  try {
    const response = await queryModelList()
    if (response && response.length) {
      modelList.value = (response || []).map((item) => ({
        label: item.name,
        value: item._id,
        _id: item._id
      }))
      model.value = modelList.value[0]
    }
  } catch (e) {
    modelList.value = []
  }
  fetchCollectModelList()
}
const initData = async () => {
  await fetchModelList()
  await fetchChatList()
  await fetchChatContentList()
}

const handleChangeModel = async (item) => {
  model.value = { ...item }
  showSelectModel.value = false
  await fetchChatList()
  await fetchChatContentList()
  scrollToBottom()
}

const handleAddModel = () => {
  window.open('https://echo-ai.yunzhu.info/')
  showSelectModel.value = false
}

onMounted(async () => {
  await initData()
  scrollToBottom()

  // 监听实时消息
  // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //   const { from, text, finish_reason } = request || {};
  //   if (from !== "knowledge") return;
  //   if (text) {
  //     chatContentList.value[chatContentList.value.length - 1].content += text;
  //     scrollToBottom();
  //   }
  //   showLoading.value = false;
  //   if (finish_reason === "stop") {
  //     generating.value = false;
  //   }
  //   sendResponse(true);
  //   return true;
  // });
})
</script>
<template>
  <div style="height: calc(100vh - 90px)">
    <div class="chat-wrapper" style="display: flex">
      <div class="chat chat_light">
        <div class="chat-box">
          <div class="wrapper">
            <ChatCard
              :list="chatContentList"
              :showLoading="showLoading"
              :showSuggestions="false"
            ></ChatCard>
          </div>
          <div class="input-panel">
            <div class="toolbar">
              <div class="lt">
                <div
                  class="btn echo-btn toolbar-btn outline primary-outline-button small-button model-container"
                  style="font-weight: normal"
                  @click="showSelectModel = !showSelectModel"
                >
                  <div class="flex">
                    <span class="model-name" v-if="model">{{ model ? model.label : '' }}</span>
                    <span class="model-name model-name-placeholder" v-else>请选择</span>
                    <IArrowDown :width="8" />
                  </div>
                  <div class="model-list" v-if="showSelectModel">
                    <div class="model-item" @click.stop="handleAddModel" style="color: #3872e0">
                      +新增模型
                    </div>
                    <div
                      class="model-item"
                      v-for="item in modelList"
                      :key="item.value"
                      @click.stop="handleChangeModel(item)"
                    >
                      {{ item.label }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ChatInput
              :textarea-content="textarea"
              @enter="handleEnter"
              @update:textareaContent="handleChangeTextarea"
            ></ChatInput>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.chat-wrapper {
  visibility: visible;
  position: relative;
  height: 100%;
}
.chat {
  visibility: visible;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0;
  display: flex;
  flex-direction: column;
  text-align: left;
}
.chat .chat-box {
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.chat .chat-box .wrapper {
  height: 100%;
  position: relative;
  box-sizing: border-box;
}

.chat .chat-box .input-panel {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 16px;
  z-index: 501;
  /* background: #f4f6f8; */
  border-top: 1px solid rgba(145, 158, 171, 0.05);
}
.chat .chat-box .input-panel .toolbar {
  height: 37px;
  display: flex;
  align-items: center;
  position: relative;
}
.chat .chat-box .input-panel .toolbar .lt {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
}
.echo-btn {
  box-sizing: border-box;
  padding: 0 15px;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  white-space: nowrap;
}
.primary-button.btn {
  background: #3872e0;
  border: 1px solid #3872e0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  height: 36px;
  font-weight: 700;
  font-size: 14px;
  justify-content: center;
  color: #fff;
  line-height: 24px;
}
.echo-btn.small-button {
  display: flex;
  align-items: center;
  height: 24px;
  font-size: 12px;
  padding: 0 8px;
  font-weight: 400;
}
.chat .chat-box .input-panel .toolbar .lt .toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  height: 26px;
  padding: 0 6px;
  border-radius: 4px;
}

.chat .input-panel .toolbar .lt .toolbar-btn.outline {
  border: 1px solid rgba(56, 114, 224, 0.48);
}
.primary-outline-button.btn {
  background: #ffffff;
  border: 1px solid rgba(56, 114, 224, 0.48);
  border-radius: 6px;
  align-items: center;
  height: 36px;
  display: flex;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: #3872e0;
  line-height: 24px;
}

.chat .input-container .input-msg-content {
  flex: 1;
  position: relative;
}
.textarea {
  visibility: visible;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  font-family:
    Courier New,
    Courier,
    monospace;
}
.textarea .mirror-node {
  width: 100%;
  min-height: 32px;
  pointer-events: none;
  box-sizing: border-box;
  padding: 2px;
  visibility: hidden;
}
.textarea textarea {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  font-size: 14px;
  overflow: hidden auto;
  box-shadow: none;
  background-color: #fff;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Helvetica,
    Arial,
    sans-serif,
    'Apple Color Emoji',
    'Segoe UI Emoji';
  color: #212b36;
  outline: none;
}

.model-container {
  position: relative;
}
.model-list {
  position: absolute;
  min-width: 200px;
  max-width: 300px;
  max-height: 250px;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  background: #fff;
  box-shadow: 0 8px 16px #919eab29;
  border-radius: 5px;
  z-index: 900;
  border: 1px solid #e5e8eb;
  bottom: 30px;
  left: 0;
}
.model-item {
  cursor: pointer;
  font-size: 13px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  padding: 0 8px;
  background: #fff;
  color: #333;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.model-item:hover {
  background-color: #3366ff14;
}
.model-name {
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 80px;
}
.model-name-placeholder {
  color: #919eab;
}
.flex {
  display: flex;
  align-items: center;
}
</style>
