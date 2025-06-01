<template>
  <div class="chat-container">
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
        <div class="message-content" v-html="renderMarkdown(message.content)"></div>
      </div>
    </div>
    <div class="chat-input">
      <textarea v-model="userInput" @keydown.enter.prevent="sendMessage" placeholder="输入消息..." rows="3"></textarea>
      <button @click="sendMessage" :disabled="isLoading">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

interface HighlightResult {
  value: string
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const result = hljs.highlight(str, { language: lang }) as HighlightResult
        return result.value
      } catch (__) { }
    }
    return '' // 使用默认的转义
  },
})

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<Message[]>([])
const userInput = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const renderMarkdown = (content: string) => {
  return md.render(content)
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    requestAnimationFrame(() => {
      const container = messagesContainer.value
      if (container) {
        const scrollHeight = container.scrollHeight
        const currentScroll = container.scrollTop
        const targetScroll = scrollHeight - container.clientHeight

        // 如果已经接近底部，直接滚动到底
        if (targetScroll - currentScroll < 100) {
          container.scrollTop = scrollHeight
        } else {
          // 否则使用平滑滚动
          container.scrollTo({
            top: scrollHeight,
            behavior: 'smooth',
          })
        }
      }
    })
  }
}

// 移除未使用的模拟流式响应函数

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: userInput.value,
  })

  // 添加AI消息占位
  messages.value.push({
    role: 'assistant',
    content: '',
  })

  isLoading.value = true
  const currentMessage = userInput.value
  userInput.value = ''
  await scrollToBottom()

  try {
    // 显示加载状态
    const lastMessage = messages.value[messages.value.length - 1]
    lastMessage.content = '正在思考...'
    await scrollToBottom()

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        Accesstoken: localStorage.getItem('AccessToken') || '',
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(currentMessage),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    let accumulatedContent = ''
    const reader = response.body?.getReader()

    if (!reader) {
      throw new Error('Failed to get response reader')
    }

    const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true })

    let buffer = '' // 用于存储未完成的数据片段

    while (true) {
      const result = await reader.read()
      if (result.done) break

      // 将新数据添加到缓冲区
      buffer += decoder.decode(result.value, { stream: true })

      // 查找完整的数据行
      const lines = buffer.split('\n')
      // 保留最后一个可能不完整的行
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const jsonStr = line.slice(5).trim()
            if (!jsonStr) continue

            const data = JSON.parse(jsonStr) // Parse JSON once per line
            let text = ''

            // 检查多种可能的响应格式
            if (typeof data.result?.output?.content === 'string') {
              text = data.result.output.content
            } else if (data.results && Array.isArray(data.results) && data.results.length > 0 && typeof data.results[0]?.output?.content === 'string') {
              text = data.results[0].output.content
            } else if (typeof data.result?.output?.text === 'string') { // Existing fallback
              text = data.result.output.text
            } else if (typeof data.text === 'string') { // Existing fallback
              text = data.text
            } else if (typeof data.content === 'string') { // Existing fallback
              text = data.content
            } else if (typeof data.message === 'string') { // Existing fallback
              text = data.message
            }
            // Note: The case `else if (typeof data === 'string')` was removed
            // as if JSON.parse(jsonStr) succeeds and data is an object,
            // `typeof data === 'string'` would be false.
            // If jsonStr itself is not a valid JSON and meant to be used as raw text,
            // that would be caught by the outer catch (e) or a more specific jsonError catch if we re-introduce it.
            // For now, if JSON.parse fails, the line is skipped and an error is logged.

            // 只有当文本不为空时才累积内容
            if (text.trim()) {
              accumulatedContent += text
              // 更新消息内容，确保markdown渲染
              lastMessage.content = accumulatedContent
              await scrollToBottom()
            }

            // 检查是否是最后一条消息
            // The data object is already parsed, use it directly.
            if (data.result?.metadata?.finishReason === 'STOP') {
              // Stop processing further lines in this chunk.
              // The outer while loop will break if reader.read() is done.
              break
            }
          } catch (e) {
            console.error('Error processing SSE data:', e, line)
          }
        }
      }
    }

    // 处理最后可能剩余的数据
    if (buffer.trim()) {
      try {
        const text = buffer.trim()
        if (text.startsWith('data:')) {
          const jsonStr = text.slice(5).trim()
          if (jsonStr) {
            accumulatedContent += jsonStr
            lastMessage.content = accumulatedContent
            await scrollToBottom()
          }
        }
      } catch (e) {
        console.error('Error processing final buffer:', e)
      }
    }

    // 确保最后一次滚动到底部
    await scrollToBottom()

    // 如果累积内容为空，设置一个默认回复
    if (!accumulatedContent.trim()) {

      const lastMessage = messages.value[messages.value.length - 1]
      lastMessage.content = '抱歉，我没有收到完整的回复。请再试一次。'
    }
  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    messages.value[messages.value.length - 1].content =
      `抱歉，发生了错误：${errorMessage}。请稍后重试。`
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 20px;
  max-width: 80%;
}

.message.user {
  margin-left: auto;
}

.message-content {
  padding: 12px 16px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message.user .message-content {
  background: #007aff;
  color: white;
}

.message.assistant .message-content {
  background: white;
}

.chat-input {
  display: flex;
  gap: 10px;
}

textarea {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
}

button {
  padding: 0 20px;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #0056b3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

:deep(pre) {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
}

:deep(code) {
  font-family: 'Fira Code', monospace;
}

:deep(p) {
  margin: 8px 0;
}

:deep(ul),
:deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}
</style>
