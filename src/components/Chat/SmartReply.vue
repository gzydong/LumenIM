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
import { useDialogueStore } from '@/store'
import { WarningOutlined } from '@vicons/antd'
import { NButton, NTag, NAlert, NIcon } from 'naive-ui'

const dialogueStore = useDialogueStore()

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

const sendMessage = (message) => {
    // TODO: 实现发送消息的逻辑
    console.log('发送消息:', message)
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
    <div class="smart-reply-wrapper">
        <div v-if="dialogueStore.smartReply?.replayMessage && dialogueStore.smartReply?.receiverId === dialogueStore.talk.receiver_id" 
             class="smart-reply-container">
            <div class="reply-card">
                <!-- 主回复内容 -->
                <div class="main-reply-section">
                    <div class="section-title">建议回复</div>
                    <div class="main-reply">
                        <div class="reply-content">
                            {{ dialogueStore.smartReply.replayMessage.message.replyMessage }}
                        </div>
                        <n-button size="small" type="primary" 
                                  @click="sendMessage(dialogueStore.smartReply.replayMessage.message.replyMessage)">
                            发送
                        </n-button>
                    </div>
                </div>

                <!-- 推荐回复列表 -->
                <div class="recommend-section">
                    <div class="section-title">其他推荐</div>
                    <div class="recommend-list">
                        <div v-for="(item, index) in dialogueStore.smartReply.replayMessage.message.otherRecommendReply"
                             :key="index"
                             class="recommend-item">
                            <div class="recommend-content">
                                <n-tag size="small" type="success" class="recommend-tag">
                                    推荐{{ index + 1 }}
                                </n-tag>
                                <span class="recommend-text">{{ item }}</span>
                            </div>
                            <n-button size="small" type="primary" ghost @click="sendMessage(item)">
                                发送
                            </n-button>
                        </div>
                    </div>
                </div>

                <!-- 时间线摘要 -->
                <div class="timeline-section">
                    <div class="section-title">操作时间线</div>
                    <div class="timeline-list">
                        <div v-for="(item, index) in dialogueStore.smartReply.replayMessage.message.chatSummaryAndTips.timeLineSummary"
                             :key="index"
                             class="timeline-item">
                            {{ item }}
                        </div>
                    </div>
                </div>

                <!-- 警告信息 -->
                <div v-if="dialogueStore.smartReply.replayMessage.message.chatSummaryAndTips.conflictWarning" 
                     class="warning-section">
                    <n-alert type="warning">
                        <span class="warning-text">
                            {{ dialogueStore.smartReply.replayMessage.message.chatSummaryAndTips.conflictWarning }}
                        </span>
                    </n-alert>
                </div>

                <!-- 待确认事项 -->
                <div class="confirm-section">
                    <div class="section-title">待确认事项</div>
                    <div class="confirm-list">
                        <div v-for="(item, index) in dialogueStore.smartReply.replayMessage.message.chatSummaryAndTips.pendingConfirmation"
                             :key="index"
                             class="confirm-item">
                            <n-tag size="small" round>{{ item }}</n-tag>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="empty-state">
            暂无智能回复
        </div>
    </div>
</template>
<style scoped>
.smart-reply-wrapper {
    height: calc(100vh - 99px);
    overflow-y: auto;
    padding: 16px;
    background: #f9fafb;
}

.smart-reply-container {
    height: 100%;
}

.reply-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    padding: 16px;
}

.section-title {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 12px;
}

/* 主回复部分 */
.main-reply-section {
    margin-bottom: 24px;
}

.main-reply {
    background: #f3f4f6;
    border-radius: 6px;
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.reply-content {
    flex: 1;
    font-size: 14px;
    color: #374151;
    line-height: 1.5;
}

/* 推荐回复列表 */
.recommend-section {
    margin-bottom: 24px;
}

.recommend-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.recommend-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #f9fafb;
    border-radius: 6px;
}

.recommend-content {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.recommend-text {
    font-size: 13px;
    color: #374151;
}

/* 时间线部分 */
.timeline-section {
    margin-bottom: 24px;
}

.timeline-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.timeline-item {
    font-size: 13px;
    color: #6b7280;
    padding: 8px 12px;
    background: #f9fafb;
    border-radius: 6px;
}

/* 警告部分 */
.warning-section {
    margin-bottom: 24px;
}

.warning-text {
    font-size: 13px;
}

/* 待确认事项 */
.confirm-section {
    margin-bottom: 16px;
}

.confirm-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.empty-state {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 14px;
}

:deep(.n-button) {
    font-size: 13px;
}

:deep(.n-tag) {
    font-size: 12px;
}
</style>
