<template>
  <management-layouts>
    <a-card title="竞赛管理" class="competition-table">
      <div class="table-header">
        <div>
          <a-input-search v-model="searchValue" placeholder="搜索竞赛名称" style="width: 300px" @search="fetchCompetitions" />
          <a-button style="margin-left: 10px" @click="resetSearch">
            <template #icon>
              <icon-refresh />
            </template>
            重置
          </a-button>
        </div>
        <a-button type="primary" @click="showModal('add')"> <icon-plus /> 新建竞赛 </a-button>
      </div>

      <a-table :columns="columns" :data="competitionList" :pagination="pagination" @page-change="handlePageChange"
        :loading="loading">
        <template #status="{ record }">
          <a-tag :color="statusColor[record.status as 0 | 1 | 2]">
            {{ statusMap[record.status as 0 | 1 | 2] }}
          </a-tag>
        </template>

        <template #operations="{ record }">
          <a-button type="text" @click="showModal('edit', record)"> <icon-edit /> 编辑 </a-button>
          <a-popconfirm content="确定删除该竞赛？" @ok="handleDelete(record.id!)">
            <a-button type="text" status="danger"> <icon-delete /> 删除 </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑弹窗 -->
    <a-modal v-model:visible="modalVisible" :title="modalType === 'add' ? '新建竞赛' : '编辑竞赛'" @ok="handleSubmit"
      @cancel="resetForm">
      <a-form :model="formData">
        <a-form-item label="竞赛名称">
          <a-input v-model="formData.name" />
        </a-form-item>
        <a-form-item label="开始时间">
          <a-date-picker v-model="formData.startTime" show-time format="YYYY-MM-DD HH:mm:ss" />
        </a-form-item>
        <a-form-item label="结束时间">
          <a-date-picker v-model="formData.endTime" show-time format="YYYY-MM-DD HH:mm:ss" />
        </a-form-item>
        <a-form-item label="竞赛描述">
          <a-textarea v-model="formData.description" />
        </a-form-item>
        <a-form-item label="竞赛题目">
          <a-select v-model="formData.questionIds" multiple :loading="questionLoading">
            <a-option v-for="item in questionOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-option>
            <template #empty>
              <div style="text-align: center; padding: 10px">
                {{ questionLoading ? '加载中...' : '暂无题目数据' }}
              </div>
            </template>
          </a-select>
        </a-form-item>
      </a-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <a-button @click="resetFormFields">重置表单</a-button>
          <a-button @click="modalVisible = false">取消</a-button>
          <a-button type="primary" @click="handleSubmit">确定</a-button>
        </div>
      </template>
    </a-modal>
  </management-layouts>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import axios from 'axios'
import { CompetitionControllerService } from '@/generated/services/CompetitionControllerService'
import { QuestionControllerService } from '@/generated/services/QuestionControllerService'
import type { CompetitionVO } from '@/generated/models/CompetitionVO'
import type { CompetitionAddRequest } from '@/generated/models/CompetitionAddRequest'
import type { CompetitionRequest } from '@/generated/models/CompetitionRequest'
import type { QuestionRequest } from '@/generated/models/QuestionRequest'
import type { QuestionListVo } from '@/generated/models/QuestionListVo'
import type { BaseResponseLong } from '@/generated/models/BaseResponseLong'
import { IconPlus, IconEdit, IconDelete, IconRefresh } from '@arco-design/web-vue/es/icon'

const searchValue = ref('')
const modalVisible = ref(false)
const modalType = ref('add')
const loading = ref(false)
const questionLoading = ref(false)
const questionOptions = ref<{ label: string; value: number }[]>([])

interface FormData {
  id?: number
  name: string
  startTime: string | Date
  endTime: string | Date
  description: string
  questionIds: number[]
  scores?: number[]
  status?: number
}

const formData = reactive<FormData>({
  name: '',
  startTime: '',
  endTime: '',
  description: '',
  questionIds: [],
  scores: [],
})

const statusMap: Record<0 | 1 | 2, string> = {
  0: '未开始',
  1: '进行中',
  2: '已结束',
}

const statusColor: Record<0 | 1 | 2, string> = {
  0: 'blue',
  1: 'green',
  2: 'gray',
}

const columns = [
  { title: '竞赛名称', dataIndex: 'name' },
  { title: '创建人', dataIndex: 'creatorName' },
  { title: '开始时间', dataIndex: 'startTime' },
  { title: '结束时间', dataIndex: 'endTime' },
  { title: '状态', slotName: 'status' },
  { title: '操作', slotName: 'operations' },
]

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showPageSize: true,
})

const competitionList = ref<CompetitionVO[]>([])

// 获取当前用户的访问令牌
const getAccessToken = (): string | undefined => {
  const token = localStorage.getItem('AccessToken') || sessionStorage.getItem('AccessToken')
  return token || undefined // Return undefined instead of null to match expected type
}

onMounted(() => {
  fetchCompetitions()
})

const fetchCompetitions = async () => {
  loading.value = true
  try {
    const params: CompetitionRequest = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      name: searchValue.value || undefined,
    }

    const res = await CompetitionControllerService.listCompetitions(params)
    if (res.data) {
      competitionList.value = res.data.records || []
      pagination.total = res.data.total || 0
    }
  } catch (error) {
    Message.error('获取竞赛列表失败')
  } finally {
    loading.value = false
  }
}

const showModal = async (type: string, record?: CompetitionVO) => {
  modalType.value = type
  modalVisible.value = true

  // 加载题目列表
  await fetchQuestionList()

  if (type === 'add') {
    resetForm()
  } else if (type === 'edit' && record) {
    formData.id = record.id
    formData.name = record.name || ''
    formData.startTime = record.startTime || ''
    formData.endTime = record.endTime || ''
    formData.description = record.description || ''

    // 加载该竞赛关联的题目
    try {
      const res = await CompetitionControllerService.getCompetitionQuestions(record.id!)
      if (res.data) {
        // 从返回的题目列表中提取题目ID
        formData.questionIds = res.data.map(question => question.id!) || []
      }
    } catch (error) {
      console.error('获取竞赛题目列表失败', error)
      Message.error('获取竞赛题目列表失败')
    }
  }
}

const fetchQuestionList = async () => {
  questionLoading.value = true
  try {
    // 创建查询参数
    const params: QuestionRequest = {
      pageNow: 1,
      findType: 0,
      pageSize: 100, // 假设最多获取100题
    }

    const res = await QuestionControllerService.questions(params)

    if (res.data && res.data.records) {
      questionOptions.value = res.data.records.map((question: QuestionListVo) => ({
        label: question.title || '未命名题目',
        value: question.id || 0,
      }))
    }
  } catch (error) {
    console.error('获取题目列表失败', error)
    Message.error('获取题目列表失败')
  } finally {
    questionLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    // 确保日期格式正确
    let startTimeFormatted: string | undefined = undefined
    let endTimeFormatted: string | undefined = undefined

    // 检查日期格式，确保是字符串
    if (formData.startTime) {
      if (typeof formData.startTime === 'object' && formData.startTime instanceof Date) {
        // 使用符合后端LocalDateTime的格式 (yyyy-MM-ddTHH:mm:ss)
        const year = formData.startTime.getFullYear()
        const month = String(formData.startTime.getMonth() + 1).padStart(2, '0')
        const day = String(formData.startTime.getDate()).padStart(2, '0')
        const hours = String(formData.startTime.getHours()).padStart(2, '0')
        const minutes = String(formData.startTime.getMinutes()).padStart(2, '0')
        const seconds = String(formData.startTime.getSeconds()).padStart(2, '0')
        startTimeFormatted = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
      } else if (typeof formData.startTime === 'string') {
        // 确保是有效的日期字符串
        const startDate = new Date(formData.startTime)
        if (!isNaN(startDate.getTime())) {
          const year = startDate.getFullYear()
          const month = String(startDate.getMonth() + 1).padStart(2, '0')
          const day = String(startDate.getDate()).padStart(2, '0')
          const hours = String(startDate.getHours()).padStart(2, '0')
          const minutes = String(startDate.getMinutes()).padStart(2, '0')
          const seconds = String(startDate.getSeconds()).padStart(2, '0')
          startTimeFormatted = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
        }
      }
    }

    if (formData.endTime) {
      if (typeof formData.endTime === 'object' && formData.endTime instanceof Date) {
        // 使用符合后端LocalDateTime的格式 (yyyy-MM-ddTHH:mm:ss)
        const year = formData.endTime.getFullYear()
        const month = String(formData.endTime.getMonth() + 1).padStart(2, '0')
        const day = String(formData.endTime.getDate()).padStart(2, '0')
        const hours = String(formData.endTime.getHours()).padStart(2, '0')
        const minutes = String(formData.endTime.getMinutes()).padStart(2, '0')
        const seconds = String(formData.endTime.getSeconds()).padStart(2, '0')
        endTimeFormatted = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
      } else if (typeof formData.endTime === 'string') {
        // 确保是有效的日期字符串
        const endDate = new Date(formData.endTime)
        if (!isNaN(endDate.getTime())) {
          const year = endDate.getFullYear()
          const month = String(endDate.getMonth() + 1).padStart(2, '0')
          const day = String(endDate.getDate()).padStart(2, '0')
          const hours = String(endDate.getHours()).padStart(2, '0')
          const minutes = String(endDate.getMinutes()).padStart(2, '0')
          const seconds = String(endDate.getSeconds()).padStart(2, '0')
          endTimeFormatted = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
        }
      }
    }

    // 验证必填字段
    if (!formData.name || !startTimeFormatted || !endTimeFormatted) {
      Message.warning('请填写竞赛名称、开始时间和结束时间')
      return
    }

    // 获取访问令牌
    const accessToken = getAccessToken()

    if (!accessToken) {
      Message.error('未登录或登录已过期，请重新登录')
      return
    }

    const request: CompetitionAddRequest = {
      name: formData.name,
      startTime: startTimeFormatted,
      endTime: endTimeFormatted,
      description: formData.description,
      questionIds: formData.questionIds.length > 0 ? formData.questionIds : undefined,
      scores: formData.questionIds.length > 0 ? formData.questionIds.map(() => 100) : undefined,
    }

    // 调试日志
    console.log('竞赛请求数据:', JSON.stringify(request))

    if (modalType.value === 'add') {
      // 使用一个变量存储完成状态，防止重复提交
      let isSubmitted = false

      try {
        // 首先尝试使用生成的服务
        const res = await CompetitionControllerService.addCompetition(request, accessToken)
        isSubmitted = true

        Message.success('添加竞赛成功')
        resetForm()
        fetchCompetitions()
        modalVisible.value = false
      } catch (error: any) {
        console.error('添加竞赛请求错误:', error)
        // 如果前面的请求失败，尝试直接使用axios发送请求
        if (!isSubmitted) {
          try {
            // 直接使用Axios发送请求作为备选方案
            const directRes = await CompetitionControllerService.addCompetition(
              request,
              accessToken,
            )

            console.log('直接请求响应:', directRes)

            if (directRes && directRes.code === 0) {
              Message.success('添加竞赛成功')
              resetForm()
              fetchCompetitions()
              modalVisible.value = false
              return
            }

            Message.error(directRes && directRes.message ? directRes.message : '添加竞赛失败')
          } catch (axiosError) {
            console.error('备选请求失败:', axiosError)
            Message.error('添加竞赛失败，请检查网络连接')
          }
        }
      }
    } else {
      // 编辑竞赛
      try {
        // 构建更新请求
        const updateRequest = {
          id: formData.id,
          name: formData.name,
          startTime: startTimeFormatted,
          endTime: endTimeFormatted,
          description: formData.description,
          questionIds: formData.questionIds.length > 0 ? formData.questionIds : undefined,
          scores: formData.questionIds.length > 0 ? formData.questionIds.map(() => 100) : undefined,
        };

        // 使用axios直接发送更新请求，因为没有生成的服务方法
        const response = await axios.post('/api/competition/edit', updateRequest, {
          headers: {
            'Accesstoken': accessToken
          }
        });

        Message.success('编辑竞赛成功');
        fetchCompetitions();
        modalVisible.value = false;
      } catch (error) {
        console.error('编辑竞赛失败', error);
        Message.error('编辑竞赛失败');
      }
    }
  } catch (error) {
    console.error(modalType.value === 'add' ? '添加竞赛失败' : '编辑竞赛失败', error)
    Message.error(modalType.value === 'add' ? '添加竞赛失败' : '编辑竞赛失败')
  }
}

const resetForm = () => {
  formData.id = undefined
  formData.name = ''
  formData.startTime = ''
  formData.endTime = ''
  formData.description = ''
  formData.questionIds = []
  formData.scores = []
}

// 重置表单字段，保留id
const resetFormFields = () => {
  if (modalType.value === 'add') {
    resetForm()
  } else {
    // 编辑模式下保留id，其他清空
    const id = formData.id
    resetForm()
    formData.id = id
  }
}

const handlePageChange = (page: number) => {
  pagination.current = page
  fetchCompetitions()
}

const handleDelete = async (id: number) => {
  try {
    const accessToken = getAccessToken()
    if (!accessToken) {
      Message.error('未登录或登录已过期，请重新登录')
      return
    }

    const res = await CompetitionControllerService.deleteCompetition(id, accessToken)
    Message.success('删除竞赛成功')
    fetchCompetitions()
  } catch (error) {
    console.error('删除竞赛失败', error)
    Message.error('删除竞赛失败')
  }
}

// 重置搜索条件
const resetSearch = () => {
  searchValue.value = ''
  pagination.current = 1
  fetchCompetitions()
}
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
