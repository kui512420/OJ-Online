<template>
  <div class="wapper">
    <div class="item-bigImg">
      <div class="item-bigImg-txt">
        <div><h1>kuikui·算法赛</h1></div>
        <div>战魂重燃，战友召集！创造属于你的编程传奇！</div>
      </div>
    </div>
    <div class="item-content">
      <a-menu
        :style="{ width: '200px', borderRadius: '4px' }"
        :default-selected-keys="['1']"
        @menu-item-click="handleMenuClick"
      >
        <a-menu-item key="1">
          <template #icon><icon-apps></icon-apps></template>
          全部竞赛
        </a-menu-item>
        <a-menu-item key="2">
          <template #icon><icon-apps></icon-apps></template>
          报名中
        </a-menu-item>
        <a-menu-item key="3">
          <template #icon><icon-apps></icon-apps></template>
          进行中
        </a-menu-item>
        <a-menu-item key="4">
          <template #icon><icon-apps></icon-apps></template>
          已结束
        </a-menu-item>
      </a-menu>
      <div class="item">
        <div v-if="loading" class="loading-container">
          <a-spin />
        </div>
        <div v-else-if="competitions.length === 0" class="empty-container">
          <a-empty description="暂无竞赛数据" />
        </div>
        <div v-else class="competition-list">
          <CompetitionCardVue
            v-for="item in competitions"
            :key="item.id"
            :competition="item"
            class="competition-card"
          ></CompetitionCardVue>
        </div>
        <div class="pagination-container">
          <a-pagination
            v-model:current="pagination.current"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            show-total
            show-page-size
            @change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import CompetitionCardVue from '../components/CompetitionCard.vue'
import type { CompetitionVO } from '@/generated/models/CompetitionVO'
import { CompetitionControllerService } from '@/generated/services/CompetitionControllerService'
import type { CompetitionRequest } from '@/generated/models/CompetitionRequest'
import { Message } from '@arco-design/web-vue'

const competitions = ref<CompetitionVO[]>([])
const loading = ref(false)

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showPageSize: true,
})

// 竞赛状态筛选
const competitionStatus = ref<number | undefined>(undefined)

// 获取竞赛列表
const fetchCompetitions = async () => {
  loading.value = true
  try {
    const params: CompetitionRequest = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      status: competitionStatus.value,
    }
    const res = await CompetitionControllerService.listCompetitions(params)
    if (res.data) {
      competitions.value = res.data.records || []
      pagination.total = res.data.total || 0
    }
  } catch (error) {
    console.error('获取竞赛数据失败', error)
    Message.error('获取竞赛数据失败')
  } finally {
    loading.value = false
  }
}

// 处理页码变化
const handlePageChange = (current: number) => {
  pagination.current = current
  fetchCompetitions()
}

// 处理每页条数变化
const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1 // 重置到第一页
  fetchCompetitions()
}

// 处理菜单点击
const handleMenuClick = (key: string) => {
  switch (key) {
    case '1': // 全部竞赛
      competitionStatus.value = undefined
      break
    case '2': // 报名中
      competitionStatus.value = 0 // 未开始
      break
    case '3': // 进行中
      competitionStatus.value = 1 // 进行中
      break
    case '4': // 已结束
      competitionStatus.value = 2 // 已结束
      break
  }
  pagination.current = 1 // 重置到第一页
  fetchCompetitions()
}

onMounted(() => {
  fetchCompetitions()
})
</script>
<style scoped>
.item-bigImg-txt {
  margin: 0 auto;
  padding-top: 30px;
}
.wapper {
  margin: 0 auto;
}
.item-content {
  display: flex;
  flex-direction: row;
}
.item {
  margin-left: 20px;
  margin-top: 50px;
  flex-grow: 3;
}
.item-bigImg {
  width: 100%;
  text-align: center;
  color: aliceblue;
  margin: 0 auto;
  height: 150px;
  background: url('https://static.shiyanlou.com/algorithm-competition/1702369389670-算法赛背景2.png');
  background-size: cover;
  background-repeat: no-repeat;
}

.competition-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.competition-card {
  margin-bottom: 16px;
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}
</style>
