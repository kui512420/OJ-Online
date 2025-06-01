<template>
  <div class="">
    <div class="page-one">
      <div class="title title-up">
        <h1 class="title-size">KUIKUI OJ</h1>
      </div>
      <div class="content-up">
        <div class="desc">专注于算法竞赛的在线评测系统</div>
        <div class="desc-add">为编程爱好者提供专业的算法训练平台</div>
        <div class="btn-group">
          <a-button @click="goQuestionBank" type="primary" status="success" class="btn-item">
            <template #icon>
              <icon-code />
            </template>
            <template #default>开始刷题</template>
          </a-button>

          <a-button @click="goCompetition" type="primary" class="btn-item">
            <template #icon>
              <icon-trophy />
            </template>
            <template #default>参加比赛</template>
          </a-button>

          <a-button @click="goRankingList" type="primary" class="btn-item">
            <template #icon>
              <icon-bar-chart />
            </template>
            <template #default>查看排名</template>
          </a-button>
        </div>
      </div>
    </div>

    <div class="page-two">
      <div>
        <h3 class="title-size-two">功能特色</h3>
        <a-carousel
          :style="{
            width: '60%',
            height: '320px',
            margin: '0 auto',
          }"
          :auto-play="true"
          trigger="hover"
          indicator-class=""
          animation-name="fade"
          show-arrow="never"
          indicator-position="outer"
        >
          <a-carousel-item v-for="(item, index) in images" :key="index">
            <div class="image-container">
              <div>
                <h2>{{ item.title }}</h2>
                <div>{{ item.desc }}</div>
                <ul>
                  <li v-for="(item2, index2) in item.list" :key="index2">{{ item2 }}</li>
                </ul>
                <div class="link">
                  <router-link :to="item.link">
                    {{ item.linkName }}
                    <span class="link-icon">
                      <icon-double-right />
                    </span>
                  </router-link>
                </div>
              </div>
              <a-image :src="item.img" fit="contain" class="fun-img" />
            </div>
          </a-carousel-item>
        </a-carousel>
      </div>
    </div>

    <div class="page-three">
      <h3 class="title-size-two">核心特性</h3>
      <div class="card-wapper" :class="{ toUp: isAn }">
        <div class="card-cast">
          <div class="card-cast-icon">⚡️</div>
          <div class="card-cast-title"><b>高性能评测</b></div>
          <div>采用分布式评测系统</div>
          <ul class="card-cast-list">
            <li>毫秒级响应</li>
            <li>实时评测反馈</li>
            <li>支持多语言评测</li>
            <li>沙箱隔离技术</li>
          </ul>
        </div>
        <div class="card-cast">
          <div class="card-cast-icon">🏆</div>
          <div class="card-cast-title"><b>专业比赛</b></div>
          <div>支持多种比赛模式</div>
          <ul class="card-cast-list">
            <li>ACM/ICPC 赛制</li>
            <li>OI 赛制</li>
            <li>IOI 赛制</li>
            <li>自定义赛制</li>
          </ul>
        </div>
        <div class="card-cast">
          <div class="card-cast-icon">📊</div>
          <div class="card-cast-title"><b>数据分析</b></div>
          <div>全方位能力评估</div>
          <ul class="card-cast-list">
            <li>解题分析</li>
            <li>能力雷达图</li>
            <li>进度追踪</li>
            <li>排名趋势</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import router from '@/router/index'
import { IconCode, IconTrophy, IconBarChart, IconDoubleRight } from '@arco-design/web-vue/es/icon'
const images = [
  {
    img: 'https://publicqn.saikr.com/saikr-oj/files_675aaad54d0f0.png',
    title: '智能评测系统',
    desc: '强大的评测引擎支持多种编程语言，毫秒级响应',
    list: ['支持 C/C++、Java、Python 等多种语言', '实时评测反馈', '详细的错误分析'],
    link: '/questionBank',
    linkName: '开始刷题',
  },
  {
    img: 'https://publicqn.saikr.com/saikr-oj/files_675aaad54d0f0.png',
    title: '个性化学习',
    desc: '智能推荐系统，为你定制专属学习计划',
    list: ['题目难度分级', '个性化推荐', '学习进度追踪'],
    link: '/rankingList',
    linkName: '查看排行榜',
  },
]
const scrollHeight = ref(0)
const isAn = ref(false)
const handleScroll = () => {
  scrollHeight.value = window.scrollY
  if (scrollHeight.value > 420) {
    isAn.value = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
const goQuestionBank = () => {
  router.push('/questionBank')
}
const goRankingList = () => {
  router.push('/rankingList')
}
const goCompetition = () => {
  router.push('/competition')
}
</script>

<style scoped>
.card-wapper {
  display: flex;
  justify-content: space-around;
  gap: 30px;
}

.toUp {
  animation: slide-up 0.8s ease-out;
}

.card-cast {
  text-align: center;
  padding: 30px 60px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e5e5e5;
}

.card-cast:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.dark .card-cast {
  background: #2a2a2a;
  border-color: #4a4a4a;
  color: #e5e5e5;
}

.dark .card-cast:hover {
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.1);
}

.card-cast-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.card-cast-list li {
  padding: 8px;
  border-bottom: 1px solid #eeeeee;
}

.card-cast-title {
  font-size: 20px;
  padding: 20px;
}

.card-cast-icon {
  font-size: 40px;
  padding: 20px;
}

.link a {
  text-decoration: none;
  color: #22bfa7;
}

.link {
  text-decoration: none;
}

.link-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
}

.link:hover .link-icon {
  transition: transform 0.8s ease;
  transform: translateX(15px);
}

.fun-img {
  width: 40%;
}

:v-deep .arco-image-img {
  width: 100% !important;
  height: 100% !important;
}

:v-deep .arco-carousel-indicator-wrapper-bottom {
  background: #fff;
}

.title {
  margin: 0 auto;
  padding: 5px;
  width: 250px;
  border-bottom: 10px solid black;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-group {
  width: 50%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
}

.page-one {
  height: 600px;
  text-align: center;
}

.page-three {
  width: 70%;
  margin: 0 auto;
}

.desc-add {
  padding: 40px;
  font-size: 18px;
}

.desc {
  color: #333;
  font-size: 30px;
  padding: 20px;
}
.dark .desc {
  color: #eeeeee;
}

.title-size {
  font-size: 40px;
}

.title-size-two {
  font-size: 30px;
  text-align: center;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .card-wapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .card-cast {
    padding: 20px 30px;
  }

  .title {
    width: 200px;
    border-bottom-width: 8px;
  }

  .fun-img {
    width: 100%;
  }

  .image-container {
    display: flex;
    flex-direction: column;
  }

  .desc {
    font-size: 24px;
  }

  .desc-add {
    font-size: 12px;
  }

  .title-size {
    font-size: 32px;
  }

  .btn-group {
    width: 80%;

    flex-direction: column;
    align-items: center;
  }

  .btn-group .btn-item {
    margin-bottom: 10px;
  }
}

.title-up {
  animation: slide-up 0.5s ease-out;
}

.content-up {
  animation: slide-up 0.8s ease-out;
}
</style>
