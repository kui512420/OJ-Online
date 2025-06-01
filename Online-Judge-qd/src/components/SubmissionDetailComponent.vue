<template>
  <div class="submission-detail-container">
    <a-result v-if="!submissionDetail" status="info" title="请选择一条提交记录查看详情" subtitle="点击左侧的提交记录可以查看详细信息">
    </a-result>
    <div v-else class="detail-content">
      <a-descriptions :title="'提交详情 #' + submissionDetail.id" bordered :column="1">
        <a-descriptions-item label="提交时间">
          {{ new Date(submissionDetail.createTime).toLocaleString() }}
        </a-descriptions-item>
        <a-descriptions-item label="编程语言">
          {{ submissionDetail.language }}
        </a-descriptions-item>
        <a-descriptions-item label="判题状态">
          <a-tag :color="getStatusColor(submissionDetail.status)">
            {{ getStatusText(submissionDetail.status) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item v-if="judgeInfo && judgeInfo.length > 0" label="测试用例通过情况">
          {{ getPassedCount(submissionDetail.judgeInfo) + '/' + judgeInfo.length }}
        </a-descriptions-item>
        <a-descriptions-item v-if="judgeInfo && judgeInfo.length > 0" label="最大执行时间">
          {{ getMaxTime(submissionDetail.judgeInfo) }}ms
        </a-descriptions-item>
      </a-descriptions>

      <div class="code-section">
        <h3>提交的代码</h3>
        <div class="code-header">
          <a-button type="text" size="small" @click="copyCode" class="copy-button">
            <template #icon><icon-copy /></template>
            复制代码
          </a-button>
        </div>
        <div class="code-container">
          <pre><code>{{ submissionDetail.code }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconCopy } from '@arco-design/web-vue/es/icon'

const props = defineProps({
  submissionDetail: {
    type: Object,
    default: null,
  },
})

const judgeInfo = computed(() => {
  if (!props.submissionDetail || !props.submissionDetail.judgeInfo) return []
  try {
    return JSON.parse(props.submissionDetail.judgeInfo)
  } catch (error) {
    console.error('解析判题信息失败:', error)
    return []
  }
})

const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return '待判题'
    case 1:
      return '判题中'
    case 2:
      return '通过'
    case 3:
      return '未通过'
    default:
      return '未知'
  }
}

const getStatusColor = (status: number) => {
  switch (status) {
    case 0:
      return 'blue'
    case 1:
      return 'orange'
    case 2:
      return 'green'
    case 3:
      return 'red'
    default:
      return 'gray'
  }
}

const getMaxTime = (judgeInfo: string) => {
  try {
    const info = JSON.parse(judgeInfo)
    return Math.max(...info.map((item: any) => item.time))
  } catch (error) {
    return 0
  }
}

const getPassedCount = (judgeInfo: string) => {
  try {
    const info = JSON.parse(judgeInfo)
    return info.filter((item: any) => item.passed === 2).length
  } catch (error) {
    return 0
  }
}

const copyCode = () => {
  if (props.submissionDetail?.code) {
    navigator.clipboard
      .writeText(props.submissionDetail.code)
      .then(() => {
        Message.success('代码已复制到剪贴板')
      })
      .catch(() => {
        Message.error('复制失败，请重试')
      })
  }
}
</script>

<style scoped>
.submission-detail-container {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.code-section {
  margin-top: 20px;
}

.code-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.copy-button {
  color: #666;
}

.copy-button:hover {
  color: #165dff;
}

.code-container {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 16px;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
}

.code-container pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.test-cases {
  margin-top: 20px;
}

.test-case-detail {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.test-case-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.execution-time {
  color: #666;
  font-size: 14px;
}

.test-case-io {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.test-case-input,
.test-case-output,
.test-case-error {
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 10px;
}

.test-case-error {
  background-color: #fff2f0;
}

.test-case-io pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
