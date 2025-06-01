<template>
  <div class="Wapper">
    <ParticleBackground />
    <a-affix>
      <a-button size="large" @click="goIndexPage" class="back-button">
        <template #icon>
          <icon-arrow-left />
        </template>
      </a-button>
    </a-affix>
    <div class="content-wrapper">
      <div class="content">
        <template v-if="route.path == '/user/login'">
          <UserLoginView></UserLoginView>
        </template>
        <template v-else>
          <UseRegisterView></UseRegisterView>
        </template>
      </div>
      <div class="footer">
        <a href="https://kuikui.space" target="_blank">猿分享 by 魁魁</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserLoginView from '@/views/user/UserLoginView.vue'
import UseRegisterView from '@/views/user/UserRegisterView.vue'
import ParticleBackground from '@/components/ParticleBackground.vue'
import { IconArrowLeft } from '@arco-design/web-vue/es/icon'
import { useRoute } from 'vue-router'
import router from '@/router/index'
import { computed } from 'vue'
const route = useRoute()
const goIndexPage = () => {
  router.push('/')
}

const title = computed(() => {
  return route.path === '/user/register' ? '注册' : '登录'
})
</script>
<style scoped>
.header {
  text-align: center;
  margin-top: 30px;
}

.header img {
  width: 60px;
  height: 60px;
}

.Wapper {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  z-index: 1;
}

.back-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #00f5ff;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(0, 245, 255, 0.1);
  border-color: #00f5ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 245, 255, 0.3);
}

.content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 0;
}

.footer {
  flex-shrink: 0;
  text-align: center;
  padding: 15px;
  color: rgba(255, 255, 255, 0.7);
}

.footer a {
  color: #00f5ff;
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer a:hover {
  color: #ffffff;
  text-shadow: 0 0 10px #00f5ff;
}
</style>
