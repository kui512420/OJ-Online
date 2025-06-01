<template>
  <div class="wapper">
    <!-- 顶部导航栏，包含返回竞赛、交卷按钮等 -->
    <div class="top-nav">
      <a-space>
        <a-button type="primary" @click="backToCompetition">
          <template #icon>
            <icon-left />
          </template>
          返回竞赛
        </a-button>
        <a-tag>竞赛： {{ competitionDetail.name || '加载中...' }}</a-tag>
        <a-tag v-if="competitionDetail.endTime">截止时间： {{ formatTime(competitionDetail.endTime) }}</a-tag>
        <a-tag v-if="endCountdown > 0">倒计时： {{ formattedCountdown }}</a-tag>
        <a-tag color="red" v-else>比赛已结束</a-tag>
      </a-space>
      <a-space>
        <a-button
          v-if="endCountdown > 0 && competitionDetail.status !== 2"
          type="primary"
          status="warning"
          @click="submitCompetition"
        >
          <template #icon>
            <icon-check-circle />
          </template>
          交卷
        </a-button>
      </a-space>
    </div>

    <a-split
      :style="{
        height: 'calc(90vh - 60px)',
        width: '100%',
        minWidth: '500px',
        border: '1px solid var(--color-border)',
      }"
      v-model:size="size"
      min="80px"
    >
      <template #first>
        <a-typography-paragraph>
          <div>
            <a-tabs @tab-click="getData" default-active-key="1" size="large">
              <a-tab-pane key="1" title="题目">
                <a-list>
                  <template #header v-if="info">
                    <div class="question-header">
                      <div class="question-title">
                        <span>{{ info?.title }}</span>
                        <a-tag color="blue">第 {{ currentQuestionIndex + 1 }} / {{ totalQuestions }} 题</a-tag>
                      </div>
                      <div class="question-nav">
                        <a-button
                          type="outline"
                          @click="previousQuestion"
                          :disabled="currentQuestionIndex <= 0"
                        >
                          <template #icon>
                            <icon-left />
                          </template>
                          上一题
                        </a-button>
                        <a-button
                          type="outline"
                          @click="nextQuestion"
                          :disabled="currentQuestionIndex >= totalQuestions - 1"
                        >
                          下一题
                          <template #icon>
                            <icon-right />
                          </template>
                        </a-button>
                      </div>
                    </div>
                  </template>
                  <a-list-item>
                    <div v-if="info">
                      <h3>判题规则</h3>
                      <div class="rule">
                        <div>时间限制 {{ getJudgeConfig('timeLimit') }}ms</div>
                        <div>
                          内存限制 {{ getJudgeConfig('memoryLimit') }}kb
                        </div>
                      </div>
                    </div>
                    <div v-if="info">
                      <h2>问题描述</h2>
                      <div class="markdown-content">
                        <VMdPreview :text="info?.content || '暂无描述'"></VMdPreview>
                      </div>
                    </div>
                    <div v-if="info && getJudgeCase().length > 0">
                      <h2>输入格式</h2>
                      {{ getJudgeCase()[0]?.input || '暂无输入格式' }}
                    </div>
                    <div v-if="info && getJudgeCase().length > 0">
                      <h2>输出格式</h2>
                      {{ getJudgeCase()[0]?.output || '暂无输出格式' }}
                    </div>
                  </a-list-item>
                </a-list>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-typography-paragraph>
      </template>
      <template #second>
        <a-typography-paragraph>
          <CodeEditorComponent
            ref="codeEditorRef"
            :question-id="currentQuestionId"
            competition-mode="true"
            :competition-id="competitionId"
            :hide-debug="true"
            :hide-submit-button="true"
            @submission-created="handleSubmissionCreated"
          />
        </a-typography-paragraph>
      </template>
    </a-split>

    <!-- 底部题目导航 -->
    <div class="question-navigator">
      <a-space>
        <span>题目导航：</span>
        <a-button-group>
          <a-button
            v-for="(q, index) in questionsList"
            :key="q.id"
            :type="currentQuestionIndex === index ? 'primary' : 'outline'"
            :status="getQuestionStatus(q.id)"
            @click="goToQuestion(index)"
          >
            {{ index + 1 }}
          </a-button>
        </a-button-group>
      </a-space>
    </div>

    <!-- 交卷确认对话框 -->
    <a-modal
      :visible="submitModalVisible"
      @cancel="submitModalVisible = false"
      @before-ok="handleSubmitConfirm"
      title="确认交卷"
    >
      <p>您确定要交卷吗？交卷后将无法再次修改。</p>
      <p>已完成题目：{{ completedQuestions.length }} / {{ totalQuestions }}</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CodeEditorComponent from '@/components/CodeEditorComponent.vue'
import {
  QuestionControllerService,
  QuestionSubmitControllerService,
  CompetitionControllerService
} from '@/generated'
import { Message, Modal } from '@arco-design/web-vue'
import { IconLeft, IconRight, IconCheckCircle } from '@arco-design/web-vue/es/icon'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import { OpenAPI } from '@/generated/core/OpenAPI'
import { request as __request } from '@/generated/core/request'

const route = useRoute()
const router = useRouter()
const competitionId = ref(route.params.competitionId as string)
const size = ref(0.35)
const info = ref()
const submitModalVisible = ref(false)
const competitionDetail = ref({})
const questionsList = ref([])
const currentQuestionIndex = ref(0)
const currentQuestionId = computed(() => {
  return questionsList.value[currentQuestionIndex.value]?.id || route.params.questionId
})
const totalQuestions = computed(() => questionsList.value.length)
const endCountdown = ref(0)
const formattedCountdown = computed(() => {
  if (endCountdown.value <= 0) return '已结束'

  const hours = Math.floor(endCountdown.value / 3600000)
  const minutes = Math.floor((endCountdown.value % 3600000) / 60000)
  const seconds = Math.floor((endCountdown.value % 60000) / 1000)

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 已完成的题目
const completedQuestions = computed(() => {
  return questionsList.value.filter(q =>
    submissionStatus.value[q.id] === 'success'
  )
})

// 提交状态 - 记录每道题的提交状态
const submissionStatus = ref({})

// 添加编辑器引用
const codeEditorRef = ref(null)

// 添加临时存储所有题目代码的对象
const questionCodeMap = ref({})

// 添加自动保存定时器
let autoSaveTimer = null

// 添加从localStorage加载保存的代码的函数
const loadSavedCodeFromLocalStorage = () => {
  try {
    const submissionKey = `competition_submission_${competitionId.value}`
    const savedData = localStorage.getItem(submissionKey)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      // 检查是否是当前竞赛的数据
      if (parsedData.competitionId === competitionId.value && parsedData.questionSubmissions) {
        questionCodeMap.value = parsedData.questionSubmissions
        console.log('从localStorage恢复了代码:', Object.keys(questionCodeMap.value).length, '道题')
      }
    }
  } catch (error) {
    console.error('从localStorage加载代码失败:', error)
  }
}

// 添加自动保存代码到localStorage的函数
const autoSaveCodeToLocalStorage = () => {
  try {
    // 先保存当前题目的代码
    saveCurrentQuestionCode()

    // 然后保存到localStorage
    const submissionKey = `competition_submission_${competitionId.value}`
    localStorage.setItem(submissionKey, JSON.stringify({
      competitionId: competitionId.value,
      questionSubmissions: questionCodeMap.value,
      lastSavedAt: new Date().toISOString()
    }))

    console.log('自动保存代码到localStorage成功')

    // 显示一个小型通知，不会打扰用户
    Message.success({
      content: '代码已自动保存',
      duration: 2000,
      position: 'bottom'
    })
  } catch (error) {
    console.error('自动保存代码到localStorage失败:', error)
    Message.error({
      content: '自动保存失败，请手动保存',
      duration: 3000,
      position: 'bottom'
    })
  }
}

// 启动自动保存定时器
const startAutoSaveTimer = () => {
  // 每30秒自动保存一次
  autoSaveTimer = setInterval(autoSaveCodeToLocalStorage, 30000)
}

// 格式化时间
const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 更新倒计时
const updateCountdown = () => {
  if (!competitionDetail.value.endTime) return

  const endTime = new Date(competitionDetail.value.endTime).getTime()
  const now = new Date().getTime()
  endCountdown.value = Math.max(0, endTime - now)
}

// 倒计时定时器
let countdownTimer
const startCountdown = () => {
  countdownTimer = setInterval(() => {
    updateCountdown()
    if (endCountdown.value <= 0) {
      clearInterval(countdownTimer)
      Message.warning('比赛已结束')
    }
  }, 1000)
}

// 获取竞赛详情
const fetchCompetitionDetail = async () => {
  try {
    console.log('获取竞赛详情，ID:', competitionId.value)
    const res = await CompetitionControllerService.getCompetitionDetail(String(competitionId.value))
    if (res.data) {
      competitionDetail.value = res.data
      updateCountdown()
      startCountdown()
    }
  } catch (error) {
    console.error('获取竞赛详情失败:', error)
    Message.error('获取竞赛详情失败: ' + (error.message || JSON.stringify(error)))
  }
}

// 获取竞赛题目列表
const fetchQuestionsList = async () => {
  try {
    console.log('获取竞赛题目列表，竞赛ID:', competitionId.value)
    const res = await CompetitionControllerService.getCompetitionQuestions(String(competitionId.value))
    if (res.data) {
      questionsList.value = res.data
      console.log('获取到题目列表:', questionsList.value)

      // 如果路由中包含题目ID，找到对应索引
      if (route.params.questionId) {
        const questionId = route.params.questionId
        console.log('路由中的题目ID:', questionId)
        const index = questionsList.value.findIndex(q => String(q.id) === String(questionId))
        if (index !== -1) {
          currentQuestionIndex.value = index
          console.log('当前题目索引:', currentQuestionIndex.value)
        }
      }

      // 获取当前题目信息
      fetchQuestionData()
    }
  } catch (error) {
    console.error('获取竞赛题目列表失败:', error)
    Message.error('获取竞赛题目列表失败: ' + (error.message || JSON.stringify(error)))
  }
}

// 获取题目数据
const fetchQuestionData = async () => {
  try {
    const questionId = currentQuestionId.value
    if (!questionId) {
      console.error('题目ID为空')
      return
    }

    console.log('正在获取题目数据，ID:', questionId)

    // 将ID作为字符串处理，避免大整数精度问题
    const res = await QuestionControllerService.questionInfo(String(questionId))
    console.log('题目数据获取成功:', res.data)

    if (res.data) {
      info.value = res.data
      // 打印关键信息进行调试
      console.log('题目内容:', info.value.content?.substring(0, 100))
      console.log('判题配置:', info.value.judgeConfig)
      console.log('判题用例:', info.value.judgeCase)

      // 恢复之前保存的代码（如果有）
      setTimeout(() => {
        if (codeEditorRef.value && questionCodeMap.value[questionId]) {
          const savedData = questionCodeMap.value[questionId]
          console.log(`恢复题目 ${questionId} 的代码, 语言: ${savedData.language}`)
          // 先设置语言
          codeEditorRef.value.selectedLanguage = savedData.language
          // 等待语言切换完成后再设置代码内容
          setTimeout(() => {
            if (codeEditorRef.value.editor) {
              codeEditorRef.value.editor.setValue(savedData.code)
            }
          }, 100)
        }
      }, 200) // 等待编辑器加载完成
    } else {
      Message.error('题目数据为空')
    }
  } catch (error) {
    console.error('获取题目数据失败:', error)
    Message.error('获取题目数据失败: ' + (error.message || error))
  }
}

// 获取题目提交状态
const fetchSubmissionStatus = async () => {
  try {
    // 为每道题获取最新的提交状态
    for (const question of questionsList.value) {
      const requestBody = {
        page: 1,
        size: 1,
        type: 3, // 自己的提交
        questionId: String(question.id),
        competitionId: String(competitionId.value)
      }

      const res = await QuestionSubmitControllerService.submitQuestionList(requestBody)
      if (res.data?.records && res.data.records.length > 0) {
        const submission = res.data.records[0]
        if (submission.status === 2) { // 假设2表示通过
          submissionStatus.value[question.id] = 'success'
        } else if (submission.status === 3) { // 假设3表示失败
          submissionStatus.value[question.id] = 'error'
        } else {
          submissionStatus.value[question.id] = 'warning'
        }
      } else {
        // 没有提交记录
        submissionStatus.value[question.id] = 'default'
      }
    }
  } catch (error) {
    console.error('获取提交状态失败:', error)
  }
}

// 生命周期钩子
onMounted(() => {
  // 先从localStorage加载保存的代码
  loadSavedCodeFromLocalStorage()

  fetchCompetitionDetail()
  fetchQuestionsList()

  // 启动自动保存定时器
  startAutoSaveTimer()
})

onUnmounted(() => {
  clearInterval(countdownTimer)
  // 清理自动保存定时器
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
  }

  // 在组件卸载前保存一次代码
  autoSaveCodeToLocalStorage()
})

// 处理代码提交
const handleSubmissionCreated = (requestBody) => {
  // 确保竞赛ID以字符串形式传递
  const finalRequest = {
    ...requestBody,
    competitionId: String(competitionId.value)
  }

  QuestionSubmitControllerService.submitQuestion(finalRequest).then((res) => {
    if (res.code == 200) {
      Message.success('提交成功，等待判题')

      // 刷新提交状态
      setTimeout(() => {
        fetchSubmissionStatus()
      }, 1000)
    }
  })
}

// 获取提交记录数据
const getData = (e) => {
  if (e == 3) {
    const requestBody = {
      page: currentPage.value,
      size: pageSize.value,
      type: 3,
      questionId: String(currentQuestionId.value),
      competitionId: String(competitionId.value)
    }
    QuestionSubmitControllerService.submitQuestionList(requestBody)
      .then((res) => {
        if (res.code === 200 && res.data) {
          recordInfo.value = res.data.records
          total.value = res.data.total
          unreadSubmissions.value = 0
        } else {
          recordInfo.value = []
          total.value = 0
        }
      })
      .catch((error) => {
        console.error('获取提交记录失败:', error)
        recordInfo.value = []
        total.value = 0
      })
  }
}

// 处理提交记录选择
const handleSubmissionSelect = (submission) => {
  selectedSubmission.value = submission
}

// 返回编辑器
const backToEditor = () => {
  selectedSubmission.value = null
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  getData(3)
}

// 获取题目状态
const getQuestionStatus = (questionId) => {
  return submissionStatus.value[questionId] || 'default'
}

// 保存当前题目的代码
const saveCurrentQuestionCode = () => {
  if (codeEditorRef.value && currentQuestionId.value) {
    questionCodeMap.value[currentQuestionId.value] = {
      code: codeEditorRef.value.getEditorValue(),
      language: codeEditorRef.value.selectedLanguage,
      questionId: currentQuestionId.value
    }
  }
}

// 上一题
const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    // 保存当前题目的代码
    saveCurrentQuestionCode()

    // 保存到localStorage
    autoSaveCodeToLocalStorage()

    currentQuestionIndex.value--
    fetchQuestionData()
  }
}

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < questionsList.value.length - 1) {
    // 保存当前题目的代码
    saveCurrentQuestionCode()

    // 保存到localStorage
    autoSaveCodeToLocalStorage()

    currentQuestionIndex.value++
    fetchQuestionData()
  }
}

// 跳转到指定题目
const goToQuestion = (index) => {
  // 保存当前题目的代码
  saveCurrentQuestionCode()

  // 保存到localStorage
  autoSaveCodeToLocalStorage()

  currentQuestionIndex.value = index
  fetchQuestionData()
}

// 返回竞赛
const backToCompetition = () => {
  router.push(`/competitionInfo/${competitionId.value}`)
}

// 打开交卷确认框
const submitCompetition = () => {
  submitModalVisible.value = true
}

// 处理交卷确认
const handleSubmitConfirm = async (done) => {
  try {
    // 保存当前题目的代码
    saveCurrentQuestionCode()

    // 准备提交数据
    const submissionData = {
      competitionId: competitionId.value,
      questionSubmissions: questionCodeMap.value,
      lastSavedAt: new Date().toISOString()
    }

    // 保存到localStorage
    const submissionKey = `competition_submission_${competitionId.value}`
    localStorage.setItem(submissionKey, JSON.stringify(submissionData))

    // 在控制台打印保存的数据
    console.log('保存的提交数据:', JSON.parse(localStorage.getItem(submissionKey)))

    // 调用API提交竞赛答案，同时发送代码数据
    const result = await CompetitionControllerService.submitPaper(
      competitionId.value,
      localStorage.getItem('accessToken') || undefined,
      submissionData
    )

    if (result.data === true) {
      Message.success('交卷成功！')
      router.push(`/competitionInfo/${competitionId.value}`)
    } else {
      throw new Error(result.message || '交卷失败')
    }
  } catch (error) {
    console.error('交卷失败:', error)
    Message.error('交卷失败，请重试: ' + (error.message || error))
  } finally {
    done()
  }
}

// 获取判题规则
const getJudgeConfig = (key) => {
  try {
    const config = JSON.parse(info.value?.judgeConfig || '{}')
    return config[key] || '未知'
  } catch (error) {
    console.error('解析判题配置失败:', error)
    return '未知'
  }
}

// 获取判题用例
const getJudgeCase = () => {
  try {
    return JSON.parse(info.value?.judgeCase || '[]')
  } catch (error) {
    console.error('解析判题用例失败:', error)
    return []
  }
}
</script>

<style scoped>
.wapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
  height: 60px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.question-title {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.question-nav {
  display: flex;
  gap: 10px;
}

.rule {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.back-button-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.question-navigator {
  padding: 15px;
  background-color: var(--color-bg-2);
  border-top: 1px solid var(--color-border);
}

.markdown-content {
  padding: 10px;
  border-radius: 4px;
  background-color: var(--color-bg-1);
}

.markdown-content :deep(.github-markdown-body) {
  background-color: transparent;
}
</style>
