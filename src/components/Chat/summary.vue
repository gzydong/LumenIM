<script setup>
import { ref, onMounted, nextTick } from "vue";
import ChatCard from "./summaryCard.vue";
import ChatInput from "./ChatInput.vue";
import More from "./More.vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { message } from "ant-design-vue";
import showdown from "showdown";
import { IClose, IPlus, IHistory, IEdit, IArrowDown } from "../icons";
import {
  queryChatList,
  queryChatContentList,
  createChat,
  queryPlugins,
  updateChatAiPlugin,
} from "../../api/openAI";
import { fetchShortCutDetail } from "../../api/shortCut";
import {
  queryChatCompletion
} from '../../api/embedding'

const historyVisible = ref(false);
const historys = ref([]);
const onlineChatList = ref([]);
const curChat = ref(null);
const curOnlineChat = ref(null);
const chatContentList = ref([]);
const chatContentTotal = ref(0);
const chatContentParam = ref({
  page: 0,
  size: 20,
});
const chatContentLoading = ref(false);
const textareaContent = ref("");
const showLoading = ref(false);
const generating = ref(false);
const plugins = ref([]);
const usePlugin = ref([]);
const selectionText = ref("");

const converter = new showdown.Converter();

const getHtml = (content) => {
  return converter.makeHtml(content);
};

const scrollToBottom = () => {
  nextTick(() => {
    document
      .querySelector("#echo-content-root")
      .shadowRoot.querySelector(".chat-container").scrollTop = 999999;
  });
};
const fetchPluginList = async () => {
  try {
    const response = await queryPlugins();
    plugins.value = response;
  } catch (e) {
    plugins.value = [];
  }
};
const fetchChatList = async () => {
  try {
    const response = await queryChatList();
    historys.value = response.filter((item) => !item.short_cut_id);
    if (response && response.length) {
      curChat.value = response[0];
      usePlugin.value = curChat.value.plugins || [];
      chatContentParam.value.page = 0;
      chatContentList.value = [];
    }
  } catch (e) {
    message.error(e.message);
  }
};
const fetchOnlineChatList = async () => {
  try {
    const response = await queryChatList();
    onlineChatList.value = response;
    if (response && response.length) {
      curOnlineChat.value = response[0];
    }
  } catch (e) {
    message.error(e.message);
  }
};
const fetchChatContentList = async () => {
  if (!curChat.value) return;
  if (chatContentLoading.value) return;
  try {
    chatContentLoading.value = true;
    const response = await queryChatContentList({
      chat_id: curChat.value._id,
      page: chatContentParam.value.page,
      size: chatContentParam.value.size,
    });
    chatContentList.value = chatContentList.value.reverse().concat(
      (response.items || []).map((item) => {
        return {
          ...item,
          content: getHtml(item.content),
        };
      })
    );
    chatContentTotal.value = response.total || 0;
    chatContentList.value = chatContentList.value.reverse();
    chatContentLoading.value = false;
  } catch (e) {
    message.error(e.message);
    chatContentLoading.value = false;
  }
};

const handleMore = async () => {
  if (chatContentLoading.value) return;
  chatContentParam.value.page += 1;
  await fetchChatContentList();
};

const showHistoryDrawer = () => {
  historyVisible.value = true;
};
const handleChangeChat = async (item) => {
  curChat.value = item;
  historyVisible.value = false;
  chatContentParam.value.page = 0;
  chatContentList.value = [];
  await fetchChatContentList();
  scrollToBottom();
};

const handleChangeTextarea = (content) => {
  textareaContent.value = content;
};

const handleEnter = async () => {
  if (!textareaContent.value) {
    return message.error("请输入内容");
  }
  if (generating.value) {
    return message.error("会话中,请稍后再试!");
  }
  const content = textareaContent.value;
  if (selectionText.value) {
    chatContentList.value.push({
      chat_id: curChat.value._id,
      content: selectionText.value,
      gmt_create: Date.now(),
      gmt_update: Date.now(),
      item_type: "intent",
      userid: curChat.value.userid,
      _id: Date.now(),
    });
  }
  chatContentList.value.push({
    chat_id: curChat.value._id,
    content,
    gmt_create: Date.now(),
    gmt_update: Date.now(),
    item_type: "intent",
    userid: curChat.value.userid,
    _id: Date.now(),
  });
  textareaContent.value = "";
  scrollToBottom();
  showLoading.value = true;

  try {
    let prompt = "";
    if (curChat.value.short_cut_id) {
      const shortCut = await fetchShortCutDetail({
        id: curChat.value.short_cut_id,
      });
      prompt = shortCut.prompt || "";
    }
    generating.value = true;

    // chrome.runtime.sendMessage(
    //   {
    //     type: "get-sse",
    //     url: "/echo/openai/chatCompletion",
    //     params: {
    //       prompt,
    //       content,
    //       shortCutId: curChat.value.short_cut_id,
    //       chat_id: curChat.value._id,
    //       chat_title: curChat.value.title,
    //       selection_text: selectionText.value,
    //       stream: true,
    //     },
    //     from: "chat",
    //   },
    //   () => {}
    // );
    const params = {
          prompt,
          content,
          shortCutId: curChat.value.short_cut_id,
          chat_id: curChat.value._id,
          chat_title: curChat.value.title,
          selection_text: selectionText.value,
          stream: true,
        }
    await queryChatCompletion(params)
    
    await fetchChatContentList();

    chatContentList.value.push({
      chat_id: curChat.value._id,
      content: "",
      gmt_create: Date.now(),
      gmt_update: Date.now(),
      item_type: "reply",
      userid: curChat.value.userid,
      _id: Date.now(),
    });
    selectionText.value = "";
  } catch (e) {
    message.error(e.message);
    showLoading.value = false;
  }
};

const handleNewChat = async () => {
  await createChat();
  await fetchChatList();
  await fetchChatContentList();
};
const initData = async () => {
  await fetchChatList();
  await fetchChatContentList();
  await fetchOnlineChatList();
  await fetchPluginList();
};
const handleClickSuggestion = (item) => {
  textareaContent.value = item;
};
const handleClearSection = () => {
  selectionText.value = "";
};
// const getPopupContainer = () => {
//   return document
//     .querySelector("#echo-content-root")
//     .shadowRoot.querySelector(".plugin-container");
// };

// const handleSelectPlugin = async (value, option) => {
//   const result = await updateChatAiPlugin({
//     id: curChat.value._id,
//     plugins: value,
//   });
//   return result;
// };

onMounted(async () => {
  await initData();
  scrollToBottom();
  
  // 监听实时消息
  // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //   const { from, text, finish_reason } = request || {};
  //   if (from !== "chat") return;
  //   if (text) {
  //     chatContentList.value[chatContentList.value.length - 1].content += text;
  //   }
  //   showLoading.value = false;
  //   if (finish_reason === "stop") {
  //     if (!curChat.value?._id) {
  //       setTimeout(async () => {
  //         await fetchChatList();
  //         await fetchChatContentList();
  //         generating.value = false;
  //       }, 1000);
  //     } else {
  //       generating.value = false;
  //     }
  //   }
  //   sendResponse(true);
  //   return true;
  // });
  document.addEventListener("selectionchange", (event) => {
    try {
      const selection = document.getSelection();
      const text = selection.toString();
      // const oRange = selection.getRangeAt(0); //get the text range
      // const oRect = oRange.getBoundingClientRect();
      if (text) {
        selectionText.value = text;
      }
      // console.log(oRect, text);
    } catch (e) { /* empty */ }
  });
});
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
              :select-text="selectionText"
              @suggest="handleClickSuggestion"
              @clearSection="handleClearSection"
            >
              <template v-slot:more>
                <More
                  v-if="
                    chatContentTotal >
                    (chatContentParam.page + 1) * chatContentParam.size
                  "
                  @click="handleMore"
                ></More>
              </template>
            </ChatCard>
          </div>
          <div class="input-panel">
            <div class="toolbar">
              <div class="lt">
                <div
                  class="btn echo-btn toolbar-btn primary-button small-button"
                  style="font-weight: normal"
                  @click="handleNewChat"
                >
                  <IPlus :width="14" :height="14"></IPlus><span>新会话</span>
                </div>
                <div
                  class="btn echo-btn toolbar-btn outline primary-outline-button small-button"
                  style="font-weight: normal"
                  @click="showHistoryDrawer"
                >
                  <IHistory width="15" height="15"></IHistory>
                  <span>会话记录</span>
                </div>
              </div>
            </div>
            <ChatInput
              :textareaContent="textareaContent"
              @update:textareaContent="handleChangeTextarea"
              @enter="handleEnter"
            ></ChatInput>
          </div>
        </div>
      </div>
    </div>

    <div
      class="drawer"
      :class="{ show: historyVisible }"
      style="height: 80%; max-height: 680px"
    >
      <div class="drawer-header">
        <div class="drawer-title">会话历史记录</div>
        <IClose
          class="drawer-close"
          width="24"
          height="24"
          @click="historyVisible = false"
        ></IClose>
      </div>
      <div class="drawer-body">
        <div class="conv-history-drawer">
          <div class="conv-list">
            <div>
              <div class="conv-item-wrapper">
                <div
                  class="conv-item"
                  v-for="item in historys"
                  :key="item._id"
                  @click="handleChangeChat(item)"
                >
                  <div class="conv-item-header">
                    <span class="title">
                      <span class="title-text">
                        <span class="">{{ item.title || "新会话" }}</span>
                      </span>
                      <span class="edit">
                        <IEdit width="16" height="16"></IEdit>
                      </span>
                    </span>
                    <span class="date">{{
                      dayjs(item.gmt_update).toNow()
                    }}</span>
                  </div>
                  <div class="conv-item-content">
                    <span class="conv-item-content-text">{{
                      item.last_message
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-mask" v-show="historyVisible">
      <div class="drawer-close-area" @click="historyVisible = false"></div>
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
  font-family: Courier New, Courier, monospace;
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
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  color: #212b36;
  outline: none;
}

.drawer-container {
  height: 100%;
  width: 100%;
  position: absolute;
}
.drawer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -6px 20px -4px #919eab26;
  filter: drop-shadow(0px 0px 2px rgba(145, 158, 171, 0.2));
  z-index: 802;
  transition: transform 0.2s ease-in-out;
  transform: translateY(150%);
}
.drawer.show {
  transform: translateY(0);
}
.drawer .drawer-header {
  position: relative;
  display: flex;
  align-items: center;
  height: 56px;
  justify-content: center;
}
.drawer .drawer-header .drawer-title {
  font-size: 16px;
  color: #0d1117;
  font-weight: 600;
}
.drawer .drawer-header .drawer-close {
  opacity: 0.45;
  position: absolute;
  right: 12px;
  top: 16px;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
}
.drawer .drawer-body {
  flex: 1;
  min-height: 0px;
  position: relative;
  overflow-y: overlay !important;
}
.conv-history-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.conv-history-drawer .conv-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0px;
  overflow-y: overlay !important;
}
.conv-history-drawer .conv-list .conv-item-wrapper {
  padding: 0 16px;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
}
.conv-history-drawer .conv-list .conv-item {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.conv-history-drawer .conv-item .conv-item-header {
  display: flex;
  align-items: center;
  height: 18px;
  min-height: 18px;
  justify-content: space-between;
  gap: 8px;
}
.conv-history-drawer .conv-item .conv-item-header .title {
  color: #0d1117;
  font-size: 14px;
  font-weight: 600;
  flex: 1;
  min-width: 0px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  justify-content: flex-start;
}
.conv-history-drawer .conv-item .conv-item-header .title-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.conv-history-drawer .conv-item-header .title .edit {
  opacity: 0;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  width: 16px;
  height: 16px;
  margin-left: 5px;
  color: #a6a6a6;
}
.conv-history-drawer .conv-item-header .date {
  font-weight: 400;
  font-size: 13px;
  color: #00000040;
}
.conv-history-drawer .conv-item-content {
  display: flex;
  align-items: center;
  line-height: 16px;
  justify-content: space-between;
  gap: 8px;
  color: #595959;
}
.conv-history-drawer .conv-item-content-text {
  font-weight: 500;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.drawer-mask {
  z-index: 801;
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}
.drawer-close-area {
  z-index: 800;
  position: absolute;
  inset: 10px;
  background-color: transparent;
}

.model-container {
  position: relative;
}
.model-list {
  position: absolute;
  min-width: 165px;
  max-width: 220px;
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
  height: 32px;
  line-height: 32px;
  box-sizing: border-box;
  padding: 0 5px;
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
.flex {
  display: flex;
  align-items: center;
}
:deep(.ant-select-selection-overflow) {
  font-size: 12px;
}
</style>
