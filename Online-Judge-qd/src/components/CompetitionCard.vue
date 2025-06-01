<template>
  <div>
    <a-card class="custom-card">
      <div class="card-content">
        <div>
          <h2>{{ props.competition.name }}</h2>
          <div>发布人：{{ props.competition.creatorName }}</div>
          <div>比赛时间：{{ props.competition.startTime }} - {{ props.competition.endTime }}</div>
          <a-tag :color="getStatusColor()">{{ getStatusText() }}</a-tag>
        </div>

        <div class="card-content-right">
          <div class="card-content-right-icon" @click="shareCompetition">
            <icon-share-internal />
            分享
          </div>
          <a-button type="primary" shape="round" @click="goToCompetitionInfo(props.competition.id)"
            >查看详情</a-button
          >
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { IconShareInternal } from '@arco-design/web-vue/es/icon'
import { useRouter } from 'vue-router'
import type { CompetitionVO } from '@/generated/models/CompetitionVO'
import { Message } from '@arco-design/web-vue'

const props = defineProps<{
  competition: CompetitionVO
}>()
const router = useRouter()

const goToCompetitionInfo = (id: number | undefined) => {
  if (id) {
    router.push('/competitionInfo/' + id)
  }
}

const shareCompetition = () => {
  if (props.competition.id) {
    // 获取当前网站的域名和协议
    const origin = window.location.origin
    // 创建分享链接
    const shareUrl = `${origin}/#/competitionInfo/${props.competition.id}`
    
    // 复制到剪贴板
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        Message.success('链接已复制到剪贴板')
      })
      .catch(err => {
        console.error('复制失败:', err)
        Message.error('复制链接失败')
      })
  }
}

const getStatusText = () => {
  const now = new Date().getTime()
  const startTime = new Date(props.competition.startTime).getTime()
  const endTime = new Date(props.competition.endTime).getTime()

  if (now < startTime) {
    return '未开始'
  } else if (now > endTime) {
    return '已结束'
  } else {
    return '进行中'
  }
}

const getStatusColor = () => {
  const status = getStatusText()
  switch (status) {
    case '未开始':
      return 'blue'
    case '进行中':
      return 'green'
    case '已结束':
      return 'red'
    default:
      return 'default'
  }
}
</script>

<style scoped>
.custom-card {
  transition: all 0.3s ease;
}
.card-content-right-icon {
  margin-right: 5px;
  cursor: pointer;
}
.card-content-right-icon:hover {
  color: aqua;
}
.card-content-right {
  display: flex;
  align-items: center;
}
.card-content {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}
.custom-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-20px);
}
</style>
