<template>
  <a-card>
    <div class="top">
      <a-card
        :header-style="{ textAlign: 'center' }"
        :style="{ width: '360px', textAlign: 'center' }"
        title="用户数量"
      >
        <a-statistic :value="userCount" :value-from="0" animation></a-statistic>
      </a-card>
      <a-card
        :header-style="{ textAlign: 'center' }"
        :style="{ width: '360px', textAlign: 'center' }"
        title="题库数量"
      >
        <a-statistic :value="questionCount" :value-from="0" animation></a-statistic>
      </a-card>
      <a-card
        :header-style="{ textAlign: 'center' }"
        :style="{ width: '360px', textAlign: 'center' }"
        title="日志数量"
      >
        <a-statistic :value="logCount" :value-from="0" animation></a-statistic>
      </a-card>
    </div>
    <div style="display: flex; justify-content: space-around; margin-top: 20px">
      <a-card
        :header-style="{ textAlign: 'center' }"
        :style="{ width: '360px', textAlign: 'center' }"
        title="Deepseek API余额"
      >
        <a-spin :loading="apiBalanceLoading">
          <div v-if="apiBalance.is_available">
            <a-statistic
              title="总余额"
              :value="parseFloat(apiBalance.total_balance)"
              :precision="2"
              :value-from="0"
              animation
            >
              <template #suffix>{{ apiBalance.currency }}</template>
            </a-statistic>
            <div style="margin-top: 20px; text-align: center;">
              <a-button type="primary" @click="fetchApiBalance">
                刷新余额
              </a-button>
            </div>
          </div>
          <a-result
            v-else
            status="warning"
            title="API余额不足"
            sub-title="请及时充值以确保服务正常运行"
          >
            <template #extra>
              <a-button type="primary">充值</a-button>
              <a-button @click="fetchApiBalance" style="margin-left: 10px;">刷新</a-button>
            </template>
          </a-result>
        </a-spin>
      </a-card>
      <a-card style="width: 360px" title="刷题数据统计">
        <EchartsPie :chartData="pieChartData" title="刷题数据统计" subtitle="各题目类型分布"></EchartsPie>
      </a-card>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EchartsPie from '@/components/echarts/EchartsPie.vue'
import { UserControllerService } from '@/generated/services/UserControllerService'
import { QuestionControllerService } from '@/generated/services/QuestionControllerService'
import { LoginLogControllerService } from '@/generated/services/LoginLogControllerService'
import { QuestionSubmitControllerService } from '@/generated/services/QuestionSubmitControllerService'
import { TagControllerService } from '@/generated/services/TagControllerService'
import { StatisticsControllerService } from '@/generated/services/StatisticsControllerService'
import { AiControllerService } from '@/generated/services/AiControllerService'
import { Message } from '@arco-design/web-vue'

// 统计数据
const userCount = ref(0)
const questionCount = ref(0)
const logCount = ref(0)
const pieChartData = ref([
  { value: 30, name: '算法' },
  { value: 25, name: '数据结构' },
  { value: 20, name: '数学' },
  { value: 15, name: '字符串' },
  { value: 10, name: '图论' }
])

// API余额数据
const apiBalanceLoading = ref(false)
const apiBalance = ref({
  is_available: true,
  total_balance: '0.00',
  granted_balance: '0.00',
  topped_up_balance: '0.00',
  currency: 'CNY'
})

// 获取API余额
const fetchApiBalance = async () => {
  apiBalanceLoading.value = true
  try {
    const response = await AiControllerService.getApiBalance()
    if (response.code === 0 || response.code === 200) {
      const balanceData = response.data
      if (balanceData && balanceData.is_available !== undefined) {
        apiBalance.value.is_available = Boolean(balanceData.is_available)
        
        // 如果有余额信息
        if (balanceData.balance_infos && balanceData.balance_infos.length > 0) {
          const info = balanceData.balance_infos[0]
          apiBalance.value.total_balance = info.total_balance || '0.00'
          apiBalance.value.granted_balance = info.granted_balance || '0.00'
          apiBalance.value.topped_up_balance = info.topped_up_balance || '0.00'
          apiBalance.value.currency = info.currency || 'CNY'
        }
      }
    } else {
      Message.error('获取API余额失败')
    }
  } catch (error) {
    console.error('获取API余额失败:', error)
    Message.error('获取API余额失败')
  } finally {
    apiBalanceLoading.value = false
  }
}

// 获取题目标签统计数据
const fetchQuestionTagStats = async () => {
  try {
    // 首先尝试使用TagControllerService的热门标签接口
    const popularTagsResponse = await TagControllerService.getPopularTags(5)
      .catch(() => {
        console.log('TagController热门标签接口调用失败，尝试备用方案')
        return { code: -1 }
      })
    
    if ((popularTagsResponse.code === 0 || popularTagsResponse.code === 200) && popularTagsResponse.data) {
      const popularTags = popularTagsResponse.data || []
      
      // 如果有热门标签数据，转换为图表数据格式
      if (popularTags.length > 0) {
        const chartData = popularTags.map(tag => ({
          value: tag.value || 0, // 使用真实的使用次数
          name: tag.name || '未知标签'
        }))
        
        pieChartData.value = chartData
        console.log('成功获取热门标签统计数据:', chartData)
        return // 成功获取数据，直接返回
      }
    }
    
    // 备用方案：尝试调用QuestionControllerService的前4个热门标签接口
    const top4TagsResponse = await QuestionControllerService.getTop4PopularTags()
      .catch(() => {
        console.log('QuestionController热门标签接口也失败')
        return { code: -1 }
      })
    
    if ((top4TagsResponse.code === 0 || top4TagsResponse.code === 200) && top4TagsResponse.data) {
      const top4Tags = top4TagsResponse.data || []
      
      if (top4Tags.length > 0) {
        const chartData = top4Tags.map(tag => ({
          value: tag.count || 0, // 使用真实的数量
          name: tag.tagName || '未知标签'
        }))
        
        pieChartData.value = chartData
        console.log('成功获取前4热门标签统计数据:', chartData)
        return // 成功获取数据，直接返回
      }
    }
    
    console.log('所有标签统计接口都失败，使用默认数据')
    
  } catch (error) {
    console.error('获取标签统计数据失败:', error)
    // 默认数据已在ref中初始化
  }
}

// 获取统计数据
const fetchStatistics = async () => {
  try {
    // 使用统一的统计接口获取所有数据
    const statisticsResponse = await StatisticsControllerService.getSystemStatistics()
      .catch(err => {
        console.error('获取系统统计数据失败:', err)
        return { code: -1 }
      })
    
    if (statisticsResponse.code === 0 || statisticsResponse.code === 200) {
      // 从响应中获取各项统计数据
      userCount.value = statisticsResponse.data.userCount || 0
      questionCount.value = statisticsResponse.data.questionCount || 0
      logCount.value = statisticsResponse.data.logCount || 0
      
      console.log('成功获取统计数据:', statisticsResponse.data)
    } else {
      
      // 如果统一接口失败，尝试单独获取各项数据
      try {
        // 获取用户数量
        const userCountRes = await StatisticsControllerService.getUserCount()
        if (userCountRes.code === 0 || userCountRes.code === 200) {
          userCount.value = userCountRes.data || 0
        }
        
        // 获取题目数量 
        const questionCountRes = await StatisticsControllerService.getQuestionCount()
        if (questionCountRes.code === 0 || questionCountRes.code === 200) {
          questionCount.value = questionCountRes.data || 0
        }
        
        // 获取日志数量
        const logCountRes = await StatisticsControllerService.getLogCount()
        if (logCountRes.code === 0 || logCountRes.code === 200) {
          logCount.value = logCountRes.data || 0
        }
      } catch (err) {
        console.error('单独获取统计数据失败:', err)
        // 使用默认值
        userCount.value = 100
        questionCount.value = 50
        logCount.value = 200
      }
    }
    
    // 获取题目标签统计
    await fetchQuestionTagStats()
  } catch (error) {
    console.error('获取统计数据失败:', error)
    Message.error('获取统计数据失败')
    
    // 使用默认值
    userCount.value = 100
    questionCount.value = 50
    logCount.value = 200
    
    // 获取题目标签统计
    await fetchQuestionTagStats()
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchStatistics()
  fetchApiBalance()
})
</script>
<style scoped>
.top {
  display: flex;
  justify-content: space-around;
}
</style>
