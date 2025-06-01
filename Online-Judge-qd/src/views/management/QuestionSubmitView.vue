<template>
  <a-card>
    <div style="display: flex; align-items: center; margin-bottom: 10px">
      <a-select v-model="options" :style="{ width: '120px' }" placeholder="查询条件">
        <a-option>提交ID</a-option>
        <a-option>题目ID</a-option>
        <a-option>用户ID</a-option>
      </a-select>
      <a-input-search v-model="searchData" @click="search" :style="{ width: '320px' }" placeholder="请输入数据"
        search-button />

      <a-button type="dashed" @click="reset"> 重置 </a-button>
    </div>
    <a-table :columns="columns" row-key="id" :data="dataSource" column-resizable :bordered="{ cell: true }"
      :pagination="false" :row-selection="rowSelection" v-model:selectedKeys="selectedKeys">
      <template #id="{ record }">
        <a-trigger class="ellipsis" position="top" auto-fit-position :unmount-on-close="false">
          <div>{{ record.id }}</div>
          <template #content>
            <div class="demo-basic">
              {{ record.id }}
            </div>
          </template>
        </a-trigger>
      </template>
      <template #title="{ record }">
        <div class="ellipsis">
          <a-trigger position="top" auto-fit-position :unmount-on-close="false">
            <div>{{ record.title }}</div>
            <template #content>
              <div class="demo-basic">
                {{ record.title }}
              </div>
            </template>
          </a-trigger>
        </div>
      </template>
      <template #tags="{ record }">
        <a-tag :color="getRandomColor()" v-for="(item, index) in JSON.parse(record.tags)" :key="index" bordered>{{ item
          }}</a-tag>
      </template>
      <template #language="{ record }">
        <a-tag :color="record.language === 'java'
            ? '#FFB800'
            : record.language === 'python'
              ? '#165DFF'
              : getRandomColor()
          " bordered>{{ record.language }}</a-tag>
      </template>
      <template #status="{ record }">
        <a-tag :color="record.status === 0
            ? '#86909C'
            : record.status === 1
              ? '#165DFF'
              : record.status === 2
                ? '#00B42A'
                : '#F53F3F'
          " bordered>
          {{
            record.status === 0
              ? '待判题'
              : record.status === 1
                ? '判题中'
                : record.status === 2
                  ? '成功'
                  : '失败'
          }}
        </a-tag>
      </template>
      <template #options="{ record }">
        <!-- 新增操作按钮 -->
        <div style="width: 50%; display: flex; align-items: center; justify-content: space-around">
          <a-button size="small" @click="showDetail(record)" type="outline">
            <template #icon>
              <icon-edit />
            </template>
            查看详情
          </a-button>
        </div>
      </template>
    </a-table>

    <a-pagination style="justify-content: center; margin-top: 10px" v-model:page-size="pageSize"
      :page-size-options="pageSizes" @change="change" :total="pagination.total" show-total show-jumper show-page-size />
  </a-card>

  <!-- 添加右侧抽屉 -->
  <a-drawer v-model:visible="drawerVisible" width="600" title="提交记录详情" unmount-on-close :footer="false"
    :mask-closable="true" :escToClose="true">
    <div v-if="currentRecord" class="drawer-content">
      <a-descriptions bordered :column="1" size="large">
        <a-descriptions-item label="提交ID">{{ currentRecord.id }}</a-descriptions-item>
        <a-descriptions-item label="题目ID">{{ currentRecord.questionId }}</a-descriptions-item>
        <a-descriptions-item label="用户ID">{{ currentRecord.userId }}</a-descriptions-item>
        <a-descriptions-item label="提交语言">{{ currentRecord.language }}</a-descriptions-item>
        <a-descriptions-item label="提交状态">
          <a-tag :color="currentRecord.status === 0
              ? '#86909C'
              : currentRecord.status === 1
                ? '#165DFF'
                : currentRecord.status === 2
                  ? '#00B42A'
                  : '#F53F3F'
            " bordered>
            {{
              currentRecord.status === 0
                ? '待判题'
                : currentRecord.status === 1
                  ? '判题中'
                  : currentRecord.status === 2
                    ? '成功'
                    : '失败'
            }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="提交时间">
          {{ formatTime(currentRecord.createTime) }}
        </a-descriptions-item>
        <a-descriptions-item v-if="judgeInfo && judgeInfo.length > 0" label="测试用例通过情况">
          {{ getPassedCount(currentRecord.judgeInfo) + '/' + judgeInfo.length }}
        </a-descriptions-item>
        <a-descriptions-item v-if="judgeInfo && judgeInfo.length > 0" label="最大执行时间">
          {{ getMaxExecutionTime(currentRecord.judgeInfo) }}ms
        </a-descriptions-item>
      </a-descriptions>

      <div class="code-section">
        <h3>提交的代码</h3>
        <div class="code-header">
          <a-button type="text" size="small" @click="copyCode" class="copy-button">
            <template #icon><icon-copy /></template>
            复制代码
          </a-button>
        </div>
        <a-card>
          <pre class="code-block"><code>{{ currentRecord.code }}</code></pre>
        </a-card>
      </div>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import { IconDownload, IconEdit, IconDoubleDown, IconDelete, IconCopy } from '@arco-design/web-vue/es/icon'
import {
  AiControllerService,
  QuestionControllerService,
  QuestionSubmitControllerService,
  UserControllerService,
} from '@/generated'
import { Message } from '@arco-design/web-vue'
import router from '@/router'
const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})
const pagination = reactive({
  total: 0,
})
const AIvisible = ref(false)
const pageSize = ref(5)
const pageSizes = ref([5, 10, 20, 30, 50])
const questionType = ref()
const questionDaf = ref()
const questionCount = ref(1)
const searchData = ref('')
const visible = ref(false)
const options = ref()
const selectedKeys = ref<number[]>([])
const columns = ref([
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    slotName: 'id',
    width: 120,
  },
  {
    title: '语言',
    dataIndex: 'language',
    key: 'language',
    slotName: 'language',
    width: 120,
    minWidth: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    slotName: 'status',
    width: 120,
    minWidth: 120,
  },
  {
    title: '题目ID',
    dataIndex: 'questionId',
    key: 'questionId',
    width: 210,
    minWidth: 180,
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
    key: 'userId',
    slotName: 'userId',
    width: 210,
    minWidth: 180,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    slotName: 'createTime',
    width: 240,
  },
  {
    title: '操作',
    slotName: 'options',
  },
])
// 封装 Question 类型
interface QuestionListVo {
  id: string
  name: string
  tags: string[]
  completionRate: number
  submitNum: number
}
interface QuestionRequest {
  type: number
  sort?: number
  page: number
  size: number
  id?: number
  filter?: number
  tags?: string
  search?: string
}
const data = ref<QuestionListVo[] | undefined>(undefined)
const dataSource = ref([])
const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// 用户信息
const userInfo = ref()
watch(pageSize, () => {
  questionList()
})

// 添加抽屉相关状态
const drawerVisible = ref(false)
const currentRecord = ref<any>(null)

// 计算处理判题信息
const judgeInfo = computed(() => {
  if (!currentRecord.value || !currentRecord.value.judgeInfo) return []
  try {
    return JSON.parse(currentRecord.value.judgeInfo)
  } catch (error) {
    console.error('解析判题信息失败:', error)
    return []
  }
})

// 显示详情抽屉
const showDetail = (record) => {
  currentRecord.value = record
  drawerVisible.value = true
}

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleString()
}

// 获取通过的测试用例数量
const getPassedCount = (judgeInfo) => {
  if (!judgeInfo) return 0
  try {
    const parsed = JSON.parse(judgeInfo)
    return parsed.filter(item => item.passed === 2).length
  } catch (error) {
    return 0
  }
}

// 获取最大执行时间
const getMaxExecutionTime = (judgeInfo) => {
  if (!judgeInfo) return 0
  try {
    const parsed = JSON.parse(judgeInfo)
    return Math.max(...parsed.map(item => item.time || 0))
  } catch (error) {
    return 0
  }
}

// 复制代码
const copyCode = () => {
  if (currentRecord.value?.code) {
    navigator.clipboard
      .writeText(currentRecord.value.code)
      .then(() => {
        Message.success('代码已复制到剪贴板')
      })
      .catch(() => {
        Message.error('复制失败，请重试')
      })
  }
}

// 修改edit方法为查看详情
const edit = (item) => {
  showDetail(item)
}

const updateUserRole = (item, role) => {
  UserControllerService.putUserRole(item, role).then((res) => {
    if (res.code == 200) {
      Message.success('修改成功！')
      questionList()
    }
  })
}
const del = (item) => {
  QuestionControllerService.deleteQuestion(item.id).then((res) => {
    if (res.code == 200) {
      Message.success('删除成功！')
      questionList()
    }
  })
}
const delArr = () => {
  QuestionControllerService.deleteQuestions(selectedKeys.value).then((res) => {
    if (res.code == 200) {
      Message.success('删除成功！')
      selectedKeys.value = []
      questionList()
    }
  })
}
const change = (e) => {
  const requestBody: QuestionRequest = {
    type: 0,
    page: e,
    size: pageSize.value,
  }
  QuestionSubmitControllerService.submitQuestionList(requestBody).then((res) => {
    if (res.code == 200) {
      dataSource.value = res.data?.records
      pagination.total = res.data?.total ?? 0
    }
  })
}
const handleCancel = () => {
  visible.value = false
}
const reset = () => {
  questionList()
  options.value = ''
  searchData.value = ''
}
const questionList = () => {
  const requestBody: QuestionRequest = {
    type: 0,
    page: 1,
    size: pageSize.value,
  }
  QuestionSubmitControllerService.submitQuestionList(requestBody).then((res) => {
    if (res.code == 200) {
      dataSource.value = res.data?.records
      pagination.total = res.data?.total ?? 0
    }
  })
}
const search = () => {
  if (searchData.value !== '') {
    const requestBody: QuestionRequest = {
      type: 0,
      page: 1,
      size: pageSize.value,
    }

    if (options.value === '提交ID') {
      requestBody.id = parseInt(searchData.value)
      requestBody.type = 1
    } else if (options.value === '题目ID') {
      requestBody.questionId = parseInt(searchData.value)
      requestBody.type = 2
    } else if (options.value === '用户ID') {
      requestBody.userId = parseInt(searchData.value)
      requestBody.type = 3
    }

    QuestionSubmitControllerService.submitQuestionList(requestBody)
      .then((res) => {
        if (res.code == 200) {
          dataSource.value = res.data?.records
          pagination.total = res.data?.total ?? 0
        }
      })
      .catch(() => {
        Message.warning('参数异常')
      })
  }
}
const handleOk = () => {
  AiControllerService.ai({
    questionCount: questionCount.value + '',
    questionType: questionType.value,
    questionDifficulty: questionDaf.value,
  }).then((res) => {
    console.log(JSON.parse(JSON.stringify(res)))
  })
}
questionList()
</script>
<style scoped>
.demo-basic {
  padding: 10px;
  display: block;
  height: auto;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  white-space: normal;
  width: 200px;
  overflow-wrap: break-word;
  /* 使用 break-word 确保长单词换行 */
  word-break: break-all;
  /* 强制文本在边界处断开 */
  overflow: visible;
  /* 确保内容可见 */
}

.ellipsis {
  width: 100%;
  max-width: 200px;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item div {
  margin-right: 5px;
}

/* 添加抽屉相关样式 */
.drawer-content {
  padding: 16px 0;
}

.code-section {
  margin-top: 24px;
}

.code-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.code-block {
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 4px;
  font-family: Consolas, Monaco, 'Andale Mono', monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

.test-cases-section {
  margin-top: 24px;
}

.test-case-detail {
  padding: 8px;
}

.test-result {
  margin-bottom: 8px;
}

.test-info p {
  margin: 4px 0;
}
</style>
