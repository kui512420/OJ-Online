<template>
  <div class="wapper">
    <a-split
      :style="{
        height: '90vh',
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
                    {{ info?.title }}
                  </template>
                  <a-list-item>
                    <div v-if="info">
                      <h3>判题规则</h3>
                      <div class="rule">
                        <div>时间限制 {{ info.judgeConfig ? JSON.parse(info.judgeConfig).timeLimit : '' }}ms</div>
                        <div>
                          内存限制 {{ info.judgeConfig ? JSON.parse(info.judgeConfig).memoryLimit : '' }}kb
                        </div>
                      </div>
                    </div>
                    <div v-if="info">
                      <h2>问题描述</h2>
                      <v-md-preview :text="info?.content"></v-md-preview>
                    </div>

                  </a-list-item>
                </a-list>
              </a-tab-pane>
              <a-tab-pane key="2" title="评论">
                <CommentComponent />
              </a-tab-pane>
              <a-tab-pane key="3">
                <template #title>
                  <a-badge :count="unreadSubmissions" :animation="true"> 提交记录 </a-badge>
                </template>
                <QuestionSubmitRecord
                  :list="recordInfo"
                  @select-submission="handleSubmissionSelect"
                ></QuestionSubmitRecord>
                <a-pagination
                  :total="total"
                  :current="currentPage"
                  :page-size="pageSize"
                  @change="handlePageChange"
                />
              </a-tab-pane>
              <a-tab-pane key="4">
                <template #title>AI小助手</template>
                <AiComponent></AiComponent>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-typography-paragraph>
      </template>
      <template #second>
        <a-typography-paragraph v-if="!selectedSubmission">
          <CodeEditorComponent
            :question-id="route.params.id"
            @submission-created="handleSubmissionCreated"
          />
        </a-typography-paragraph>
        <SubmissionDetailComponent v-else :submission-detail="selectedSubmission" />
        <div v-if="selectedSubmission" class="back-button-container">
          <a-button type="primary" @click="backToEditor">返回编辑器</a-button>
        </div>
      </template>
    </a-split>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import QuestionSubmitRecord from './QuestionSubmitRecord.vue'
import AiComponent from './AiComponent.vue'
import CommentComponent from './CommentComponent.vue'
import SubmissionDetailComponent from './SubmissionDetailComponent.vue'
import CodeEditorComponent from './CodeEditorComponent.vue'
import { QuestionControllerService, QuestionSubmitControllerService } from '@/generated'
import { Message } from '@arco-design/web-vue'

const route = useRoute()
const size = ref(0.35)
const info = ref()
const recordInfo = ref()
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(50)
const unreadSubmissions = ref(0)
const selectedSubmission = ref(null)

// 获取题目数据
const fetchData = async () => {
  try {
    const res = await QuestionControllerService.questionInfo(BigInt(route.params.id))
    if (res && res.data) {
      info.value = res.data
    } else {
      console.error('Failed to fetch data: No data returned')
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

const refTimeout = setInterval(() => {
  getData(3)
}, 3000)

// 生命周期钩子
onMounted(() => {
  fetchData()
})

onUnmounted(() => {
  clearInterval(refTimeout)
})

// 处理代码提交
const handleSubmissionCreated = (requestBody) => {
  console.log(requestBody)
  QuestionSubmitControllerService.submitQuestion(requestBody).then((res) => {
    if (res.code == 200) {
      Message.success('提交成功，等待判题')
      unreadSubmissions.value += 1
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
      questionId: route.params.id,
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

const handlePageChange = (page: number) => {
  currentPage.value = page
  getData(3)
}
</script>

<style scoped>
.wapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
</style>
