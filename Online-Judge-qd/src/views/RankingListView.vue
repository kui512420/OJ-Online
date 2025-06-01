<template>
  <div class="ranking-container">
    <a-card class="ranking-card">
      <template #title>
        <div class="card-title">
          <span>用户排行榜</span>
          <a-space>
            <a-select v-model="sortBy" style="width: 120px" placeholder="排序方式">
              <a-option value="solved">解题数量</a-option>
              <a-option value="rate">通过率</a-option>
              <a-option value="submitted">提交数量</a-option>
            </a-select>
            <span style="font-size: 12px; color: #666">数据每30分钟更新</span>
          </a-space>
        </div>
      </template>
      <a-table
        :data="rankingData"
        :pagination="pagination"
        @page-change="onPageChange"
        :loading="loading"
      >
        <template #columns>
          <a-table-column title="排名" align="center">
            <template #cell="{ rowIndex }">
              <div class="rank-column">
                <span v-if="isTopThree(rowIndex)" class="trophy-icon">
                  <icon-trophy
                    :style="{
                      color: getTrophyColor(rowIndex),
                      fontSize: '20px',
                      marginRight: '8px'
                    }"
                  />
                </span>
                {{ (pagination.current - 1) * pagination.pageSize + rowIndex + 1 }}
              </div>
            </template>
          </a-table-column>
          <a-table-column title="用户" align="center">
            <template #cell="{ record }">
              <a-space>
                <a-avatar :size="32" :image-url="record.userAvatar || '/default.png'" />
                {{ record.userName }}
              </a-space>
            </template>
          </a-table-column>
          <a-table-column title="通过数量" data-index="acceptCount" align="center" sortable />
          <a-table-column title="提交数量" data-index="submitCount" align="center" />
          <a-table-column title="通过率" align="center">
            <template #cell="{ record }">
              {{ record.submitCount ? ((record.acceptCount / record.submitCount) * 100).toFixed(2) : 0 }}%
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { UserControllerService } from '../generated/services/UserControllerService'
import type { UserRank } from '../generated/models/UserRank'
import { Message } from '@arco-design/web-vue'
import { IconTrophy } from '@arco-design/web-vue/es/icon'

const sortBy = ref('solved')
const rankingData = ref<UserRank[]>([])
const loading = ref(false)

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
})

// 检查是否为前三名
const isTopThree = (rowIndex: number) => {
  const rank = (pagination.value.current - 1) * pagination.value.pageSize + rowIndex + 1
  return pagination.value.current === 1 && rank <= 3
}

// 获取奖杯颜色
const getTrophyColor = (rowIndex: number) => {
  const rank = (pagination.value.current - 1) * pagination.value.pageSize + rowIndex + 1
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

const fetchRankingData = async () => {
  loading.value = true
  try {
    let response
    switch (sortBy.value) {
      case 'solved':
        response = await UserControllerService.getTopUsersByAcceptCount(
          pagination.value.current,
          pagination.value.pageSize
        )
        break
      case 'rate':
        response = await UserControllerService.getTopUsersByAcceptRate(
          pagination.value.current,
          pagination.value.pageSize
        )
        break
      default:
        response = await UserControllerService.getTopUsersBySubmitCount(
          pagination.value.current,
          pagination.value.pageSize
        )
    }

    if (response.data) {
      rankingData.value = response.data.records || []
      pagination.value.total = response.data.total || 0
    }
  } catch (error) {
    Message.error('获取排行榜数据失败')
    console.error('Failed to fetch ranking data:', error)
  } finally {
    loading.value = false
  }
}

const onPageChange = (current: number) => {
  pagination.value.current = current
  fetchRankingData()
}

watch(sortBy, () => {
  pagination.value.current = 1
  fetchRankingData()
})

onMounted(() => {
  fetchRankingData()
})
</script>

<style scoped>
.ranking-container {
  padding: 20px;
}

.ranking-card {
  background: var(--color-bg-2);
  border-radius: 4px;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rank-column {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trophy-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
