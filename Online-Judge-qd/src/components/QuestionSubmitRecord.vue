<template>
  <div>
    <div v-if="!props.list || props.list.length === 0" class="no-data">暂无提交记录</div>
    <div v-else>
      <a-card
        v-for="(item, index) in props.list"
        :key="index"
        class="submit-card"
        :class="{ 'selected-card': selectedSubmission && selectedSubmission.id === item.id }"
        @click="selectSubmission(item)"
      >
        <div class="submit-info">
          <span class="time">提交时间：{{ new Date(item.createTime).toLocaleString() }}</span>
          <span class="language">语言：{{ item.language }}</span>
          <span :class="['status', getStatusClass(item.status)]">
            状态：{{ getStatusText(item.status) }}
          </span>
          <span class="memory" v-if="item.judgeInfo && isValidJudgeInfo(item.judgeInfo)">
            耗时：{{ getMaxTime(item.judgeInfo) }}ms
          </span>
          <span class="memory" v-if="item.judgeInfo && isValidJudgeInfo(item.judgeInfo)">
            {{ getPassedCount(item.judgeInfo) + '/' + getJudgeInfoLength(item.judgeInfo) }}
          </span>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
const props = defineProps(['list'])
const emit = defineEmits(['select-submission'])

const selectedSubmission = ref(null)

const selectSubmission = (submission) => {
  selectedSubmission.value = submission
  emit('select-submission', submission)
}

const isValidJudgeInfo = (judgeInfo: string): boolean => {
  try {
    const info = JSON.parse(judgeInfo)
    return Array.isArray(info) && info.length > 0
  } catch (error) {
    return false
  }
}

const getJudgeInfoLength = (judgeInfo: string): number => {
  try {
    const info = JSON.parse(judgeInfo)
    return Array.isArray(info) ? info.length : 0
  } catch (error) {
    return 0
  }
}

const getStatusClass = (status: number) => {
  switch (status) {
    case 0:
      return 'waiting'
    case 1:
      return 'running'
    case 2:
      return 'success'
    case 3:
      return 'failed'
    default:
      return ''
  }
}

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
</script>

<style scoped>
.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
}

.submit-card {
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.selected-card {
  border: 2px solid var(--color-primary);
}

.submit-info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.status {
  font-weight: bold;
}

.status.waiting {
  color: #808080;
}

.status.running {
  color: #2196f3;
}

.status.success {
  color: #4caf50;
}

.status.failed {
  color: #f44336;
}
</style>
