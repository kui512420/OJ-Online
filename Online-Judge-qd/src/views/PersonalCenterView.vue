<template>
  <div class="personal-center-container">
    <!-- 左侧个人信息 -->
    <div class="left-section">
      <a-card title="个人中心" :bordered="true">
        <a-upload :custom-request="upload" :show-file-list="false">
          <template #upload-button>
            <a-avatar>
              <img alt="avatar" style="width: 100%; height: 100%"
                :src="userInfo.userAvatar || '/src/assets/logo.png'" />
            </a-avatar>
          </template>
        </a-upload>
        <p>
          ID: <span style="padding-left: 10px">{{ userInfo.id }}</span>
        </p>
        <a-divider />
        <p>基本信息</p>
        <a-divider dashed />
        <span>
          <h3>名称：{{ userInfo.userName || '未命名' }}</h3>
          <span>加入OJ时间：{{ formatTimestamp(userInfo.createTime) }}</span>
          <div style="margin-top: 10px">邮箱：{{ userInfo.email }}</div>
          <div style="margin-top: 10px">个人介绍：{{ userInfo.userProfile ?? '未填写' }}</div>
        </span>
        <div style="margin-top: 10px">
          <a-input :style="{ width: '220px' }" default-value="" placeholder="修改名称" v-model="userInfo.userName"
            allow-clear />
          <a-button type="primary" @click="saveUserName">保存</a-button>
        </div>
        <div style="margin-top: 10px">
          <a-input :style="{ width: '220px' }" default-value="" placeholder="修改个人简介" v-model="userInfo.userProfile"
            allow-clear />
          <a-button type="primary" @click="saveUserProfile">保存</a-button>
        </div>
        <a-divider />
        <p>修改密码</p>
        <a-divider dashed />
        <div style="margin-top: 10px">
          <a-input-password :style="{ width: '220px' }" v-model="usrePassword" placeholder="旧密码" allow-clear />
        </div>
        <div style="margin-top: 10px">
          <a-input-password :style="{ width: '220px' }" v-model="newUserPassword" placeholder="新密码" allow-clear />
        </div>

        <div style="margin-top: 10px; display: flex">
          <a-input :style="{ width: '220px' }" v-model="code" placeholder="邮箱验证码" allow-clear />
          <SendButton :email="userInfo.email"></SendButton>
        </div>
        <div style="margin-top: 10px">
          <a-button type="primary" @click="saveUserPassowrd">修改</a-button>
        </div>
      </a-card>
    </div>

    <!-- 右侧提交记录 -->
    <div class="right-section">
      <a-card title="提交记录" :bordered="true">
        <a-table :data="submissionList" :pagination="false" :loading="loading" class="submission-table">
          <template #columns>
            <a-table-column title="ID" data-index="id"></a-table-column>
            <a-table-column title="题目ID" data-index="questionId">
              <template #cell="{ record }">
                <a class="question-link" @click="goToQuestion(record.questionId)">{{ record.questionId }}</a>
              </template>
            </a-table-column>
            <a-table-column title="语言" data-index="language"></a-table-column>
            <a-table-column title="状态" data-index="status">
              <template #cell="{ record }">
                <a-tag :color="getStatusColor(record.status)">
                  {{ getStatusText(record.status) }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="提交时间" data-index="createTime">
              <template #cell="{ record }">
                {{ formatTimestamp(record.createTime) }}
              </template>
            </a-table-column>
          </template>
        </a-table>
        <div class="pagination-container">
          <a-pagination v-model:current="currentPage" :total="total" :page-size="pageSize" @change="handlePageChange"
            show-total show-jumper />
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import SendButton from '@/components/email/SendButton.vue'
import { FilleControllerService, UserControllerService, QuestionSubmitControllerService } from '@/generated'
import type { QuestionSubmit } from '@/generated/models/QuestionSubmit'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import Message from '@arco-design/web-vue/es/message'
import message from '@arco-design/web-vue/es/message'

import { ref, onMounted } from 'vue'
const userSotre = useUserStore()
const userInfo = ref({
  id: '',
  userName: '',
  email: '',
  userProfile: '',
  createTime: '',
  userAvatar: '',
})
const code = ref('')
const usrePassword = ref('')
const newUserPassword = ref('')

// 提交记录相关数据
const submissionList = ref<QuestionSubmit[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const formatTimestamp = (input: string | number) => {
  const date = new Date(input)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 刷新token
const refreshToken = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('AccessToken')
    if (token) {
      UserControllerService.refreshToken(token).then((res) => {
        if (res.data) {
          localStorage.setItem('AccessToken', res.data)
          resolve()
        } else {
          // Token刷新失败或未返回数据，也应视为一种完成状态，但可能需要错误处理
          console.error('Refresh token failed or no data returned.')
          reject(new Error('Refresh token failed'))
        }
      }).catch(err => {
        console.error('Error during refreshToken API call:', err)
        reject(err)
      })
    } else {
      // 没有token，直接reject或resolve，视业务逻辑而定
      console.warn('No AccessToken found to refresh.')
      reject(new Error('No AccessToken to refresh'))
    }
  })
}

// 获取个人页面信息
const getInfos = () => {
  userInfo.value.createTime = formatTimestamp(userSotre.user.createTime)
  userInfo.value.userName = userSotre.user.userName
  userInfo.value.email = userSotre.user.email
  userInfo.value.userProfile = userSotre.user.userProfile
  userInfo.value.id = userSotre.user.id
  userInfo.value.userAvatar = userSotre.user.userAvatar
}

// 修改名称
const saveUserName = async () => {
  const token = localStorage.getItem('AccessToken') || '';
  try {
    const res = await UserControllerService.setUerName(userInfo.value.userName, token);

    if (res.code == 200) {
      message.success('名称保存成功！');
      await refreshToken();
      userSotre.user.userName = userInfo.value.userName;
    } else if (res.message) {
      message.error(res.message);
    } else {
      message.error('名称保存操作失败');
    }
  } catch (error) {
    console.error('Error in saveUserName:', error);
    message.error('处理保存名称请求时发生错误');
  }
};

// 修改个人介绍
const saveUserProfile = async () => {
  const token = localStorage.getItem('AccessToken') || '';
  try {
    const res = await UserControllerService.setUserProfile(userInfo.value.userProfile, token);

    if (res.code == 200) {
      message.success('个人简介保存成功！');
      await refreshToken();
      userSotre.user.userProfile = userInfo.value.userProfile;
    } else if (res.message) {
      message.error(res.message);
    } else {
      message.error('个人简介保存操作失败');
    }
  } catch (error) {
    console.error('Error in saveUserProfile:', error);
    message.error('处理保存个人简介请求时发生错误');
  }
};

// 修改密码
const saveUserPassowrd = () => {
  UserControllerService.setUserPassword({
    usrePassword: usrePassword.value,
    newUserPassword: newUserPassword.value,
    email: userInfo.value.email,
    code: code.value,
  }).then((res) => {
    if (res.code == 200) {
      router.push('/')
      localStorage.removeItem('AccessToken')
      localStorage.removeItem('RefreshToken')
      Message.success('修改密码成功,请重新登录')
    } else if (res.message) {
      Message.error(res.message)
    } else {
      Message.error('操作失败')
    }
  })
}

// 上传头像
const upload = async (option: any) => {
  const { fileItem } = option
  // 创建 FormData 对象
  const formData = new FormData()
  // 将文件添加到 FormData 中
  formData.append('file', fileItem.file)
  const fileFromFormData = formData.get('file') as Blob
  const requestBody: { file: Blob } = { file: fileFromFormData }
  try {
    await FilleControllerService.uploadFile('', requestBody)
    Message.success('头像更新成功！')
    await refreshToken()
    setTimeout(() => {
      window.location.reload() // 考虑是否有更好的方式更新头像而不是刷新整个页面
    }, 1000)
  } catch (err) {
    Message.error('头像更新失败！')
    console.error('Error in upload:', err)
  }
}

// 获取提交状态对应的文本
const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '待判题',
    1: '判题中',
    2: '通过',
    3: '失败',
  }
  return statusMap[status] || '未知状态'
}

// 获取提交状态对应的颜色
const getStatusColor = (status: number) => {
  const colorMap: Record<number, string> = {
    0: 'blue',
    1: 'orange',
    2: 'green',
    3: 'red',
  }
  return colorMap[status] || 'gray'
}

// 获取用户提交记录
const getSubmissionList = () => {
  loading.value = true
  const token = localStorage.getItem('AccessToken') || ''

  QuestionSubmitControllerService.getAllUserSubmissions(
    currentPage.value,
    pageSize.value,
    token
  )
    .then((res) => {
      if (res.code === 200 && res.data) {
        submissionList.value = res.data.records || []
        total.value = res.data.total || 0
      } else {
        Message.error(res.message || '获取提交记录失败')
      }
    })
    .catch((err) => {
      Message.error('获取提交记录失败')
      console.error(err)
    })
    .finally(() => {
      loading.value = false
    })
}

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  getSubmissionList()
}

// 跳转到对应题目页面
const goToQuestion = (questionId: string | number) => {
  router.push(`/questionView/${questionId}`)
}

onMounted(() => {
  getInfos()
  getSubmissionList()
})
</script>

<style scoped>
.personal-center-container {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.left-section {
  flex: 0 0 350px;
}

.right-section {
  flex: 1;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.submission-table {
  width: 100%;
}

.question-link {
  color: #165dff;
  cursor: pointer;
  text-decoration: underline;
}

.question-link:hover {
  color: #0040c9;
}

@media (max-width: 768px) {
  .personal-center-container {
    flex-direction: column;
  }

  .left-section {
    flex: 1 1 auto;
  }
}
</style>
