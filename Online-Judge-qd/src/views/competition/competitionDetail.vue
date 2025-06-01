<template>
  <div class="competition-detail-container">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    
    <div v-else class="competition-info">
      <h1>{{ competition.title }}</h1>
      
      <div class="competition-meta">
        <div class="meta-item">
          <span class="meta-label">开始时间：</span>
          <span>{{ formatDateTime(competition.startTime) }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">结束时间：</span>
          <span>{{ formatDateTime(competition.endTime) }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">状态：</span>
          <el-tag :type="getStatusType(competition.status)">
            {{ getStatusText(competition.status) }}
          </el-tag>
        </div>
        <div class="meta-item">
          <span class="meta-label">参与人数：</span>
          <span>{{ competition.participantCount }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">题目数量：</span>
          <span>{{ competition.questionCount }}</span>
        </div>
      </div>
      
      <div class="competition-description">
        <h2>竞赛描述</h2>
        <div v-html="competition.description"></div>
      </div>
      
      <div class="competition-actions">
        <el-button 
          v-if="competition.status === 1" 
          type="primary" 
          @click="goToQuestions">
          开始答题
        </el-button>
        
        <el-button 
          v-if="competition.status === 1 && !isSubmitted" 
          type="success" 
          @click="handleSubmitPaper"
          :loading="submitting">
          交卷
        </el-button>
        
        <el-button 
          v-if="isSubmitted" 
          type="info" 
          disabled>
          已交卷
        </el-button>
      </div>
      
      <!-- 排行榜 -->
      <div class="leaderboard-section">
        <h2>实时排行榜</h2>
        <el-table :data="leaderboard" stripe style="width: 100%">
          <el-table-column prop="rank" label="排名" width="80" />
          <el-table-column label="用户" width="200">
            <template #default="scope">
              <div class="user-info">
                <el-avatar :size="30" :src="scope.row.userAvatar || defaultAvatar" />
                <span>{{ scope.row.userName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="得分" width="100">
            <template #default="scope">
              <el-tooltip
                content="得分 = 通过测试用例数 × 10（实时计算）"
                placement="top"
                effect="light"
              >
                <span>{{ scope.row.score }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="submitCount" label="提交数" width="100" />
          <el-table-column prop="acceptCount" label="通过数" width="100" />
          <el-table-column label="参与时间" width="180">
            <template #default="scope">
              {{ formatDateTime(scope.row.joinTime) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { 
  competitionControllerGetCompetitionDetail, 
  competitionControllerGetCompetitionLeaderboard,
  competitionControllerSubmitPaper
} from '@/generated';
import type { CompetitionVO, CompetitionLeaderboardVO } from '@/generated';
import { formatDateTime } from '@/utils/format';

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const submitting = ref(false);
const competition = ref<CompetitionVO>({} as CompetitionVO);
const leaderboard = ref<CompetitionLeaderboardVO[]>([]);
const isSubmitted = ref(false);
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';

// 获取竞赛详情
const getCompetitionDetail = async () => {
  try {
    loading.value = true;
    const competitionId = route.params.id as string;
    const res = await competitionControllerGetCompetitionDetail(competitionId);
    if (res.code === 0 && res.data) {
      competition.value = res.data;
      
      // 检查用户是否已参与并交卷
      await checkSubmissionStatus();
    } else {
      ElMessage.error(res.message || '获取竞赛详情失败');
    }
  } catch (error) {
    console.error('获取竞赛详情失败', error);
    ElMessage.error('获取竞赛详情失败');
  } finally {
    loading.value = false;
  }
};

// 检查用户提交状态
const checkSubmissionStatus = async () => {
  try {
    // 获取排行榜数据中的自己记录，检查是否已交卷
    await getLeaderboard();
    
    // 在排行榜中查找当前用户
    const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userInLeaderboard = leaderboard.value.find(item => item.userId === currentUser.id);
    
    // 如果在排行榜中找到自己，且已提交，则设置已交卷状态
    if (userInLeaderboard && userInLeaderboard.isSubmitted) {
      isSubmitted.value = true;
    }
  } catch (error) {
    console.error('检查提交状态失败', error);
  }
};

// 获取排行榜
const getLeaderboard = async () => {
  try {
    const competitionId = route.params.id as string;
    const res = await competitionControllerGetCompetitionLeaderboard(competitionId);
    if (res.code === 0 && res.data) {
      leaderboard.value = res.data;
    }
  } catch (error) {
    console.error('获取排行榜失败', error);
  }
};

// 跳转到题目页面
const goToQuestions = () => {
  router.push(`/competition/questions/${route.params.id}`);
};

// 获取状态样式
const getStatusType = (status: number | undefined) => {
  if (!status && status !== 0) return 'info';
  const statusMap: Record<number, string> = {
    0: 'info',    // 未开始
    1: 'success', // 进行中
    2: 'danger'   // 已结束
  };
  return statusMap[status] || 'info';
};

// 获取状态文本
const getStatusText = (status: number | undefined) => {
  if (!status && status !== 0) return '未知';
  const statusMap: Record<number, string> = {
    0: '未开始',
    1: '进行中',
    2: '已结束'
  };
  return statusMap[status] || '未知';
};

// 交卷按钮点击处理
const handleSubmitPaper = async () => {
  try {
    submitting.value = true;
    const confirmResult = await ElMessageBox.confirm(
      '确定要交卷吗？交卷后将不能再提交和修改答案。', 
      '交卷确认',
      {
        confirmButtonText: '确定交卷',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    if (confirmResult === 'confirm') {
      const res = await competitionControllerSubmitPaper(route.params.id as string);
      if (res.code === 0) {
        ElMessage.success('交卷成功！');
        // 刷新排行榜
        await getLeaderboard();
        // 标记为已提交状态
        isSubmitted.value = true;
      } else {
        ElMessage.error(res.message || '交卷失败');
      }
    }
  } catch (error: any) {
    if (error?.message !== 'cancel') {
      ElMessage.error('交卷失败: ' + (error?.message || '未知错误'));
    }
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  await getCompetitionDetail();
  await getLeaderboard();
});
</script>

<style scoped>
.competition-detail-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-container {
  padding: 40px;
}

.competition-info h1 {
  margin-bottom: 20px;
  color: #303133;
}

.competition-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-label {
  font-weight: bold;
  margin-right: 5px;
  color: #606266;
}

.competition-description {
  margin-bottom: 30px;
}

.competition-description h2 {
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #303133;
}

.competition-actions {
  margin-bottom: 30px;
  display: flex;
  gap: 15px;
}

.leaderboard-section {
  margin-top: 30px;
}

.leaderboard-section h2 {
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #303133;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style> 