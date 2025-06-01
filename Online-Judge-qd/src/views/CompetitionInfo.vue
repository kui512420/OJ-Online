<template>
  <div class="wapper">
    <a-breadcrumb>
      <template #separator>
        <icon-right />
      </template>
      <a-breadcrumb-item><router-link to="/competition">竞赛</router-link> </a-breadcrumb-item>
      <a-breadcrumb-item>{{ comDetail?.name ?? '加载中...' }}</a-breadcrumb-item>
    </a-breadcrumb>

    <a-card>
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div>
          <h3>{{ comDetail?.name ?? '加载中...' }}</h3>
          <p>
            {{ comDetail?.description ?? '加载中...' }}
          </p>
          <p>开赛时间：{{ comDetail?.startTime ?? '加载中...' }}</p>
          <p>结束时间：{{ comDetail?.endTime ?? '加载中...' }}</p>
          <p>比赛状态：
            <a-tag :color="getStatusColor(comDetail?.status)">{{ getStatusText(comDetail?.status) }}</a-tag>
          </p>
        </div>

        <div>
          <a-button type="primary" @click="startCompetition">
            {{ comDetail?.status === 2 ? '查询详情' : '立即参赛' }}
          </a-button>
        </div>
      </div>
    </a-card>
    <div>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" title="题目列表">
          <template #title>题目列表</template>
          <div class="question-list-container">
            <a-spin :loading="loading" style="width: 100%">
              <a-table :data="questionList" :bordered="false" :pagination="false">
                <template #columns>
                  <a-table-column title="题目名称" data-index="title">
                    <template #cell="{ record }">
                      <a @click="goToQuestion(record.id)">{{ record.title }}</a>
                    </template>
                  </a-table-column>
                  <a-table-column title="标签" data-index="tags">
                    <template #cell="{ record }">
                      <a-space>
                        <a-tag v-for="tag in parseTags(record.tags)" :key="tag" color="blue">{{
                          tag
                        }}</a-tag>
                      </a-space>
                    </template>
                  </a-table-column>
                  <a-table-column title="提交数" data-index="submitNum" :width="100" />
                  <a-table-column title="通过数" data-index="acceptedNum" :width="100" />
                </template>
              </a-table>
            </a-spin>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" title="排行榜">
          <template #title>排行榜</template>
          <div class="leaderboard-container">
            <a-spin :loading="leaderboardLoading">
              <div class="leaderboard-tools">
                <a-button type="primary" @click="refreshLeaderboard">
                  <template #icon><icon-refresh /></template>
                  刷新排行榜
                </a-button>
              </div>
              <a-table :data="leaderboardData" :bordered="false">
                <template #columns>
                  <a-table-column title="排名" data-index="rank" :width="80">
                    <template #cell="{ record }">
                      <div class="rank-column">
                        <span v-if="record.rank <= 3" class="trophy-icon">
                          <icon-trophy 
                            :style="{
                              color: getTrophyColor(record.rank), 
                              fontSize: '20px',
                              marginRight: '4px'
                            }" 
                          />
                        </span>
                        {{ record.rank }}
                      </div>
                    </template>
                  </a-table-column>
                  <a-table-column title="用户" :width="200">
                    <template #cell="{ record }">
                      <a-space>
                        <a-avatar :size="32" :image-url="record.userAvatar || '/default.png'" />
                        {{ record.userName || record.userAccount }}
                      </a-space>
                    </template>
                  </a-table-column>
                  <a-table-column title="得分" :width="120">
                    <template #cell="{ record }">
                      <a-tooltip content="得分 = 通过测试用例数 × 10（实时计算）">
                        {{ record.score }}
                      </a-tooltip>
                    </template>
                  </a-table-column>
                  <a-table-column title="提交数量" data-index="submitCount" :width="100" />
                  <a-table-column title="通过数量" data-index="acceptCount" :width="100" />
                  <a-table-column title="通过率" :width="100">
                    <template #cell="{ record }">
                      {{ record.submitCount ? ((record.acceptCount / record.submitCount) * 100).toFixed(2) : 0 }}%
                    </template>
                  </a-table-column>
                </template>
              </a-table>
            </a-spin>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3">
          <template #title>比赛评论</template>
          比赛评论
        </a-tab-pane>
        <a-tab-pane key="4">
          <template #title>比赛详情</template>
          比赛详情
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CompetitionControllerService, QuestionControllerService } from '@/generated'
import { IconRight, IconRefresh, IconCheck, IconTrophy } from '@arco-design/web-vue/es/icon'
import { onMounted, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { QuestionListVo } from '@/generated/models/QuestionListVo'
import type { PaginationProps } from '@arco-design/web-vue'
import { Message, Modal } from '@arco-design/web-vue'
import type { CompetitionLeaderboardVO } from '@/generated/models/CompetitionLeaderboardVO'

const comID = ref()
const comDetail = ref({})
const questionList = ref<QuestionListVo[]>([])
const loading = ref(false)
const router = useRouter()

// 排行榜数据
const leaderboardData = ref<CompetitionLeaderboardVO[]>([])
const leaderboardLoading = ref(false)

// 分页配置
const pagination = reactive<PaginationProps>({
  total: 0,
  current: 1,
  pageSize: 10,
  showTotal: true,
  showJumper: true,
})

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 0:
      return '未开始'
    case 1:
      return '进行中'
    case 2:
      return '已结束'
    default:
      return '未知状态'
  }
}

// 获取状态颜色
const getStatusColor = (status) => {
  switch (status) {
    case 0:
      return 'blue'
    case 1:
      return 'green'
    case 2:
      return 'red'
    default:
      return 'gray'
  }
}

// 获取竞赛题目列表
const fetchQuestionList = async (page = 1) => {
  loading.value = true
  try {
    // 直接通过竞赛ID获取题目列表
    const res = await CompetitionControllerService.getCompetitionQuestions(comID.value)

    if (res.data && Array.isArray(res.data)) {
      // 获取到题目列表后，设置分页信息
      const startIndex = (page - 1) * pagination.pageSize
      const endIndex = Math.min(startIndex + pagination.pageSize, res.data.length)

      questionList.value = res.data.slice(startIndex, endIndex)
      pagination.total = res.data.length
    } else if (res.data && res.data.records) {
      questionList.value = res.data.records
      pagination.total = res.data.total || 0
    }
  } catch (error) {
    console.error('获取题目列表失败', error)
  } finally {
    loading.value = false
  }
}

// 获取排行榜数据
const fetchLeaderboard = async () => {
  leaderboardLoading.value = true
  try {
    const res = await CompetitionControllerService.getCompetitionLeaderboard(comID.value)
    if (res.data) {
      leaderboardData.value = res.data
    }
  } catch (error) {
    console.error('获取排行榜失败', error)
    Message.error('获取排行榜数据失败')
  } finally {
    leaderboardLoading.value = false
  }
}

// 刷新排行榜
const refreshLeaderboard = () => {
  fetchLeaderboard()
}

// 获取奖杯颜色
const getTrophyColor = (rank: number) => {
  switch (rank) {
    case 1:
      return '#FFD700' // 金色
    case 2:
      return '#C0C0C0' // 银色
    case 3:
      return '#CD7F32' // 铜色
    default:
      return ''
  }
}

// 交卷
const handleSubmitPaper = () => {
  Modal.confirm({
    title: '确认交卷',
    content: '确定要交卷吗？交卷后将无法再次提交答案。',
    okText: '确认交卷',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await CompetitionControllerService.submitPaper(comID.value)
        if (res.data === true) {
          Message.success('交卷成功')
          // 刷新排行榜
          fetchLeaderboard()
        } else {
          Message.error(res.message || '交卷失败')
        }
      } catch (error) {
        console.error('交卷失败', error)
        Message.error('交卷失败，请稍后再试')
      }
    }
  })
}

// 页码变化
const onPageChange = (page: number) => {
  pagination.current = page
  fetchQuestionList(page)
}

// 解析标签
const parseTags = (tags: string | undefined) => {
  if (!tags) return []
  try {
    return JSON.parse(tags)
  } catch {
    return tags.split(',')
  }
}

// 跳转到题目详情
const goToQuestion = (id: number) => {
  router.push(`/competitionQuestion/${comID.value}/${id}`)
}

// 开始竞赛
const startCompetition = () => {
  // 检查竞赛状态
  if (comDetail.value.status === 1) { // 进行中
    // 先调用参赛接口
    CompetitionControllerService.joinCompetition(comID.value)
      .then((res) => {
        if (res.data === true) {
          Message.success('参与成功')
          // 参与成功，如果有题目列表，进入第一题
          if (questionList.value && questionList.value.length > 0) {
            router.push(`/competitionQuestion/${comID.value}/${questionList.value[0].id}`)
          } else {
            // 没有题目时提示
            Message.warning('该竞赛暂无题目')
          }
        } else {
          // 参与失败
          Message.error(res.message || '参赛失败')
        }
      })
      .catch((error) => {
        console.error('参赛失败', error)
        Message.error('参赛失败，请稍后再试')
      })
  } else if (comDetail.value.status === 0) { // 未开始
    Message.warning('竞赛尚未开始')
  } else if (comDetail.value.status === 2) { // 已结束
    // 直接进入查看详情页面
    if (questionList.value && questionList.value.length > 0) {
      router.push(`/competitionQuestion/${comID.value}/${questionList.value[0].id}`)
    } else {
      Message.warning('该竞赛暂无题目')
    }
  } else {
    router.push(`/competitionQuestion/${comID.value}`)
  }
}

onMounted(() => {
  const route = useRoute()
  comID.value = route.params.id
  CompetitionControllerService.getCompetitionDetail(comID.value).then((res) => {
    comDetail.value = res.data
    // 获取竞赛题目列表
    fetchQuestionList()
    // 获取排行榜数据
    fetchLeaderboard()
  })
})
</script>

<style scoped>
.wapper {
  width: 80vh;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .wapper {
    width: 100%;
    padding: 0 10px;
  }

  .a-card {
    width: 100% !important;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 18px;
  }

  p {
    font-size: 14px;
  }
}

.leaderboard-container {
  padding: 16px;
}

.leaderboard-tools {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.rank-column {
  display: flex;
  align-items: center;
}

.trophy-icon {
  display: inline-flex;
  align-items: center;
}
</style>
