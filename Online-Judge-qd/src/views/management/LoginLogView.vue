<template>
  <a-card>
    <div class="search-area" style="margin-bottom: 16px">
      <a-space>
        <a-input
          v-model="searchParams.userAccount"
          placeholder="请输入用户账号"
          allow-clear
          style="width: 200px"
        />
        <a-input
          v-model="searchParams.ipAddress"
          placeholder="请输入IP地址"
          allow-clear
          style="width: 200px"
        />
        <a-range-picker v-model="searchParams.timeRange" style="width: 300px" />
        <a-button type="primary" @click="handleSearch">搜索</a-button>
        <a-button @click="handleReset">重置</a-button>
      </a-space>
    </div>
    <a-table
      :columns="columns"
      :data="dataSource"
      :pagination="{
        showTotal: true,
        pageSize: pageSize,
        current: current,
        total: total,
      }"
      @page-change="onPageChange"
    >
      <template #userAccount="{ record }">
        {{ record.user }}
      </template>
      <template #loginTime="{ record }">
        {{ record.loginTime }}
      </template>
      <template #ipAddress="{ record }">
        {{ record.ip }}
      </template>
      <template #userAgent="{ record }">
        {{ record.device }}
      </template>
      <template #errorMsg="{ record }">
        <a-tag :color="record.errorMsg == '登录成功' ? 'green' : 'red'">
          {{ record.errorMsg }}
        </a-tag>
      </template>
    </a-table>
  </a-card>
</template>

<script setup>
import { LoginLogControllerService } from '@/generated'
import { ref, onMounted } from 'vue'

const searchParams = ref({
  userAccount: '',
  ipAddress: '',
  timeRange: null,
})

const columns = [
  {
    title: '用户账号',
    dataIndex: 'user',
    key: 'user',
    slotName: 'user',
  },
  {
    title: '登录时间',
    dataIndex: 'loginTime',
    key: 'loginTime',
    slotName: 'loginTime',
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    key: 'ip',
    slotName: 'ip',
  },
  {
    title: '设备信息',
    dataIndex: 'device',
    key: 'device',
    slotName: 'device',
  },
  {
    title: '提示信息',
    dataIndex: 'errorMsg',
    key: 'errorMsg',
    slotName: 'errorMsg',
  },
]

const dataSource = ref([])
const pageSize = ref(10)
const current = ref(1)
const total = ref(0)

const onPageChange = (page) => {
  current.value = page
  getLoginLogList()
}

const getLoginLogList = async () => {
  try {
    const params = {
      current: current.value,
      pageSize: pageSize.value,
      userAccount: searchParams.value.userAccount,
      ip: searchParams.value.ipAddress,
      startTime: searchParams.value.timeRange?.[0],
      endTime: searchParams.value.timeRange?.[1],
    }
    const res = await LoginLogControllerService.getLoginLogList(params)
    dataSource.value = res.data.records
    // 处理返回的登录日志数据，将其赋值给 dataSource.value
    total.value = res.data.total
  } catch (error) {
    console.error('获取登录日志失败:', error)
  }
}

const handleSearch = () => {
  current.value = 1
  getLoginLogList()
}

const handleReset = () => {
  searchParams.value = {
    userAccount: '',
    ipAddress: '',
    timeRange: null,
  }
  current.value = 1
  getLoginLogList()
}

onMounted(() => {
  getLoginLogList()
})
</script>
