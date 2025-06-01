<template>
  <a-card style="width: 100%">
    <div style="display: flex; align-items: center; margin-bottom: 10px">
      <a-select v-model="options" :style="{ width: '120px' }" placeholder="查询条件">
        <a-option>ID</a-option>
        <a-option>标题</a-option>
        <a-option>标签列表</a-option>
      </a-select>
      <a-input-search
        v-model="searchData"
        @click="search"
        :style="{ width: '320px' }"
        placeholder="请输入数据"
        search-button
      />
      <a-button status="warning" @click="exportFile">
        <template #icon>
          <icon-download></icon-download>
        </template>
        导出
      </a-button>

      <a-popconfirm @ok="delArr" content="确定删除?">
        <a-button type="primary" status="danger"> 批量删除 </a-button>
      </a-popconfirm>
      <a-button type="dashed" @click="reset"> 重置 </a-button>
    </div>
    <a-table
      :columns="columns"
      row-key="id"
      :data="dataSource"
      column-resizable
      :bordered="{ cell: true }"
      :pagination="false"
      :row-selection="rowSelection"
      v-model:selectedKeys="selectedKeys"
    >
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
        <a-tag
          :color="getRandomColor()"
          v-for="(item, index) in JSON.parse(record.tags)"
          :key="index"
          bordered
          >{{ item }}</a-tag
        >
      </template>
      <template #options="{ record }">
        <!-- 新增操作按钮 -->
        <div style="width: 50%; display: flex; align-items: center; justify-content: space-around">
          <a-button size="small" @click="edit(record)" type="outline">
            <template #icon>
              <icon-edit />
            </template>
            编辑
          </a-button>
          <a-popconfirm @ok="del(record)" content="确定删除?">
            <a-button size="small" type="outline" status="danger" style="margin: 0 5px">
              <template #icon>
                <icon-delete />
              </template>
              删除
            </a-button>
          </a-popconfirm>

          <a-dropdown position="bottom">
            <a-button type="dashed" size="small">
              <template #icon>
                <icon-double-down />
              </template>
              更多操作
            </a-button>
            <template #content>
              <a-doption
                ><a-button type="primary" shape="round" @click="updateUserRole(record.id, 'ban')"
                  >下架</a-button
                ></a-doption
              >
              <a-doption
                ><a-button type="primary" shape="round" @click="updateUserRole(record.id, 'user')"
                  >上架</a-button
                ></a-doption
              >
            </template>
          </a-dropdown>
        </div>
      </template>
    </a-table>

    <a-pagination
      style="justify-content: center; margin-top: 10px"
      v-model:page-size="pageSize"
      :page-size-options="pageSizes"
      @change="change"
      :total="pagination.total"
      show-total
      show-jumper
      show-page-size
    />

    <a-drawer
      :width="440"
      v-if="userInfo"
      ok-text="保存"
      :hide-cancel="true"
      :visible="visible"
      @cancel="handleCancel"
      unmountOnClose
    >
      <template #title> 用户信息 </template>
      <div
        style="height: 100vh; display: flex; flex-direction: column; justify-content: space-between"
      >
        <div class="info-item">
          <div>id:</div>
          <a-input
            disabled
            v-model="userInfo.id"
            :style="{ width: '320px' }"
            default-value="content"
            placeholder="Please enter something"
            allow-clear
          />
        </div>
        <div class="info-item">
          <div>账号:</div>
          <a-input
            disabled
            v-model="userInfo.userAccount"
            :style="{ width: '320px' }"
            default-value="content"
            placeholder="Please enter something"
            allow-clear
          />
        </div>
        <div class="info-item">
          <div>密码:</div>
          <a-input
            v-model="userInfo.userPassword"
            :style="{ width: '320px' }"
            default-value="content"
            placeholder="Please enter something"
            allow-clear
          />
        </div>
        <div class="info-item">
          <div>名称:</div>
          <a-input
            v-model="userInfo.userName"
            :style="{ width: '320px' }"
            default-value="content"
            placeholder="Please enter something"
            allow-clear
          />
        </div>
        <div class="info-item">
          <div>头像:</div>
          <a-upload :show-file-list="false">
            <template #upload-button>
              <a-avatar>
                <img alt="avatar" style="width: 100%; height: 100%" :src="userInfo.userAvatar" />
              </a-avatar>
            </template>
          </a-upload>
        </div>
        <div class="info-item">
          <div>邮箱:</div>
          <a-input
            :style="{ width: '320px' }"
            v-model="userInfo.email"
            default-value="content"
            placeholder="Please enter something"
            allow-clear
          />
        </div>
        <div class="info-item">
          <div>角色:</div>
          <a-radio v-model="userInfo.userRole" value="user">普通用户</a-radio>
          <a-radio v-model="userInfo.userRole" value="admin">管理员</a-radio>
          <a-radio v-model="userInfo.userRole" value="ban">禁用</a-radio>
        </div>
        <div class="info-item">
          <div>注册时间:</div>
          <a-input
            disabled
            v-model="userInfo.createTime"
            :style="{ width: '320px' }"
            default-value="content"
            placeholder="Please enter something"
            allow-clear
          />
        </div>
        <div class="info-item">
          <div>最新登录时间:</div>
          <a-input
            disabled
            v-model="userInfo.updateTime"
            :style="{ width: '320px' }"
            default-value="content"
            placeholder="Please enter something"
            allow-clear
          />
        </div>
      </div>
    </a-drawer>
  </a-card>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { IconDownload, IconEdit, IconDoubleDown, IconDelete } from '@arco-design/web-vue/es/icon'
import { QuestionControllerService, UserControllerService } from '@/generated'
import axios from 'axios'
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

const pageSize = ref(5)
const pageSizes = ref([5, 10, 20, 30, 50])

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
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    slotName: 'title',
    width: 120,
    minWidth: 120,
  },
  {
    title: '标签列表',
    dataIndex: 'tags',
    key: 'tags',
    slotName: 'tags',
    width: 120,
    minWidth: 120,
  },
  {
    title: '提交人数',
    dataIndex: 'submitNum',
    key: 'submitNum',
    width: 140,
    minWidth: 100,
  },
  {
    title: '通过人数',
    dataIndex: 'acceptedNum',
    key: 'acceptedNum',
    slotName: 'acceptedNum',
    width: 140,
    minWidth: 70,
  },
  {
    title: '创建用户 id',
    dataIndex: 'userId',
    key: 'userId',
    slotName: 'userId',
    width: 170,
    minWidth: 70,
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
const exportFile = () => {
  axios
    .post('/api/question/export', null, {
      responseType: 'blob',
    })
    .then((response) => {
      const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = '题目.xls'
      a.click()
      window.URL.revokeObjectURL(url)
    })
    .catch(() => {
      Message.error('导出失败' + error)
    })
}

// 用户信息
const userInfo = ref()
watch(pageSize, () => {
  questionList()
})
const edit = (item) => {
  router.push('/management/question/edit/' + item.id)
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
  QuestionControllerService.questions({
    findType: 0,
    pageNow: e,
    pageSize: pageSize.value,
  }).then((res) => {
    dataSource.value = res.data!.records
    pagination.total = res.data!.total
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
    findType: 0,
    pageNow: 1,
    pageSize: pageSize.value,
  }
  QuestionControllerService.questions(requestBody).then((res) => {
    if (res.code == 200) {
      dataSource.value = res.data?.records
      pagination.total = res.data?.total ?? 0
    }
  })
}
const search = () => {
  if (searchData.value !== '') {
    if (options.value == 'ID') {
      const question = {
        id: searchData.value,
        findType: 1,
        pageNow: 1,
        pageSize: pageSize.value,
      }

      QuestionControllerService.questions(question)
        .then((res) => {
          if (res.code == 200) {
            dataSource.value = res.data?.records
            pagination.total = res.data?.total ?? 0
          }
        })
        .catch((e) => {
          Message.warning('参数异常')
        })
    } else if (options.value == '标题') {
      const question = {
        questionName: searchData.value,
        findType: 2,
        pageNow: 1,
        pageSize: pageSize.value,
      }
      QuestionControllerService.questions(question)
        .then((res) => {
          if (res.code == 200) {
            dataSource.value = res.data?.records
            pagination.total = res.data?.total ?? 0
          }
        })
        .catch((e) => {
          Message.warning('参数异常')
        })
    } else if (options.value == '标签列表') {
      const question = {
        tags: [searchData.value],
        findType: 3,
        pageNow: 1,
        pageSize: pageSize.value,
      }
      QuestionControllerService.questions(question)
        .then((res) => {
          if (res.code == 200) {
            dataSource.value = res.data?.records
            pagination.total = res.data?.total ?? 0
          }
        })
        .catch((e) => {
          Message.warning('参数异常')
        })
    } else {
    }
  }
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

.arco-spin {
  width: 100%;
  display: block;
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
</style>
