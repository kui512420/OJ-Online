<template>
  <a-card>
    <a-space direction="vertical" :size="16" fill>
      <a-row>
        <a-col :flex="1">
          <a-input v-model="searchName" placeholder="请输入标签名称" allow-clear>
            <template #prefix>
              <icon-search />
            </template>
          </a-input>
        </a-col>
        <a-col :flex="'86px'">
          <a-button type="primary" @click="handleSearch" style="height: 32px; margin-left: 8px"
            >搜索</a-button
          >
        </a-col>
        <a-col :flex="'86px'">
          <a-button type="primary" @click="showAddModal" style="height: 32px; margin-left: 8px"
            >新增标签</a-button
          >
        </a-col>
        <a-col :flex="'86px'">
          <a-button @click="handleReset" style="height: 32px; margin-left: 8px">重置</a-button>
        </a-col>
      </a-row>

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
        <template #name="{ record }">
          <span :style="{ color: getTagColor(record.name) }">{{ record.name }}</span>
        </template>
        <template #description="{ record }">
          {{ record.description }}
        </template>
        <template #createTime="{ record }">
          {{ formatTime(record.createTime) }}
        </template>
        <template #updateTime="{ record }">
          {{ formatTime(record.updateTime) }}
        </template>
        <template #operation="{ record }">
          <a-popconfirm content="确定删除该标签？" @ok="handleDelete(record.id)">
            <a-button type="text" status="danger">删除</a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-space>
    <a-modal
      v-model:visible="addModalVisible"
      title="新增标签"
      @ok="handleAdd"
      @cancel="addModalVisible = false"
    >
      <a-form :model="formData">
        <a-form-item field="name" label="标签名称">
          <a-input v-model="formData.name" placeholder="请输入标签名称" />
        </a-form-item>
        <a-form-item field="description" label="标签描述">
          <a-input v-model="formData.description" placeholder="请输入标签描述" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script setup>
import { ref } from 'vue'
import { IconSearch } from '@arco-design/web-vue/es/icon'
import { TagControllerService } from '@/generated'
import { Message } from '@arco-design/web-vue'

// 用于缓存标签颜色的Map
const tagColorMap = new Map()

// 生成随机颜色
const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// 获取或生成标签颜色
const getTagColor = (tagName) => {
  if (!tagColorMap.has(tagName)) {
    tagColorMap.set(tagName, getRandomColor())
  }
  return tagColorMap.get(tagName)
}

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    slotName: 'name',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    slotName: 'description',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    slotName: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    slotName: 'updateTime',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    slotName: 'operation',
  },
]

const dataSource = ref([])
const pageSize = ref(10)
const current = ref(1)
const total = ref(0)
const searchName = ref('')
const addModalVisible = ref(false)
const formData = ref({
  name: '',
  description: '',
})

const handleSearch = () => {
  current.value = 1
  getTagList2()
}

const handleReset = () => {
  searchName.value = ''
  current.value = 1
  getTagList()
}

const onPageChange = (page) => {
  current.value = page
  getTagList()
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString()
}
const showAddModal = () => {
  addModalVisible.value = true
}
TagControllerService.list().then((res) => {
  console.log(res)
})
const handleAdd = async () => {
  try {
    const res = await TagControllerService.tag(formData.value)
    if (res.code === 200) {
      Message.success('新增标签成功')
    } else {
      Message.error(res.message)
    }
    addModalVisible.value = false
    formData.value = { name: '', description: '' }
    getTagList()
  } catch (e) {
    console.error(e)
  }
}

const handleDelete = async (id) => {
  try {
    const res = await TagControllerService.del(id)
    if (res.code === 200) {
      Message.success('删除标签成功')
      getTagList()
    } else {
      Message.error(res.message)
    }
  } catch (e) {
    console.error(e)
    Message.error('删除标签失败')
  }
}
const getTagList2 = async () => {
  try {
    const res = await TagControllerService.list({
      tag: searchName.value,
      type: 1,
      count: pageSize.value,
      page: current.value,
    })
    if (res.code === 200) {
      dataSource.value = res.data.records
      total.value = res.data.total
    } else {
      Message.error(res.message)
    }
  } catch (e) {
    console.error(e)
    Message.error('获取标签列表失败')
  }
}
const getTagList = async () => {
  try {
    const res = await TagControllerService.list({
      tag: searchName.value,
      type: 0,
      count: pageSize.value,
      page: current.value,
    })
    if (res.code === 200) {
      dataSource.value = res.data.records
      total.value = res.data.total
    } else {
      Message.error(res.message)
    }
  } catch (e) {
    console.error(e)
    Message.error('获取标签列表失败')
  }
}

getTagList()
</script>
