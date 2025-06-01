<template>
  <div class="comment-section">
    <!-- 评论输入框 -->
    <div class="comment-input">
      <a-textarea
        v-model="commentContent"
        placeholder="请输入您的评论..."
        :auto-size="{ minRows: 3, maxRows: 5 }"
      />
      <a-button type="primary" @click="submitComment" style="margin-top: 10px"> 发表评论 </a-button>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <a-list :data="comments">
        <template #header>
          <div class="comment-header">
            <span>全部评论</span>
            <span>{{ total }} 条</span>
          </div>
        </template>
        <template #item="{ item }">
          <a-list-item class="comment-item">
            <div class="comment-user">
              <a-avatar :size="40">{{ item.userName?.charAt(0) }}</a-avatar>
              <div class="user-info">
                <div class="username">{{ item.userName }}</div>
                <div class="comment-time">{{ formatDate(item.createTime) }}</div>
              </div>
            </div>
            <div class="comment-content">{{ item.content }}</div>
            <div class="comment-actions">
              <span @click="likeComment(item)"> <icon-thumb-up /> {{ item.likes }} </span>
              <span @click="replyToComment(item)"> <icon-message /> 回复 </span>
            </div>
          </a-list-item>
        </template>
      </a-list>
      <div class="pagination">
        <a-pagination
          v-model:current="currentPage"
          :total="total"
          :page-size="pageSize"
          @change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconThumbUp, IconMessage } from '@arco-design/web-vue/es/icon'

const commentContent = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const comments = ref([])

// 提交评论
const submitComment = async () => {
  if (!commentContent.value.trim()) {
    Message.warning('评论内容不能为空')
    return
  }
  // TODO: 调用后端API提交评论
  Message.success('评论成功')
  commentContent.value = ''
  fetchComments()
}

// 获取评论列表
const fetchComments = async () => {
  // TODO: 调用后端API获取评论列表
  comments.value = [
    {
      id: 1,
      userName: '用户A',
      content: '这是一条测试评论',
      createTime: new Date(),
      likes: 0,
    },
  ]
  total.value = comments.value.length
}

// 点赞评论
const likeComment = (comment) => {
  // TODO: 调用后端API进行点赞
  comment.likes++
}

// 回复评论
const replyToComment = (comment) => {
  commentContent.value = `@${comment.userName} `
}

// 处理分页
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchComments()
}

// 格式化日期
const formatDate = (date: Date) => {
  return new Date(date).toLocaleString()
}

// 初始化加载评论
fetchComments()
</script>

<style scoped>
.comment-section {
  padding: 20px;
}

.comment-input {
  margin-bottom: 20px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.comment-item {
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}

.comment-user {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
}

.user-info {
  margin-left: 12px;
}

.username {
  font-weight: bold;
  margin-bottom: 4px;
}

.comment-time {
  font-size: 12px;
  color: var(--color-text-3);
}

.comment-content {
  margin: 8px 0;
  line-height: 1.5;
}

.comment-actions {
  display: flex;
  gap: 16px;
  color: var(--color-text-3);
}

.comment-actions span {
  cursor: pointer;
}

.comment-actions span:hover {
  color: var(--color-primary);
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
