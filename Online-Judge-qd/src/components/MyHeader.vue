<template>
  <div>
    <template v-if="useStore.user.userRole !== 'notLogin'">
      <a-dropdown @select="handleSelect" trigger="hover">
        <a-avatar>
          <img alt="avatar" :src="useStore.user.userAvatar || '/src/assets/logo.png'" />
        </a-avatar>
        <template #content>
          <a-doption @click="toPersonCenter">个人中心</a-doption>
          <a-doption @click="loginOUt">退出登录</a-doption>
        </template>
      </a-dropdown>
    </template>
    <template v-else>
      <a-button @click="goLoginPage">登录</a-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import router from '@/router/index'
import { Message } from '@arco-design/web-vue'
import { UserControllerService } from '@/generated'
const useStore = useUserStore()
const toPersonCenter = () => {
  router.push('/personalCenter')
}
const loginOUt = () => {
  useStore.user.userRole = 'notLogin'
  UserControllerService.outLogin(localStorage.getItem('AccessToken'))
    .then((res) => {
      Message.success(res.message)
    })
    .finally(() => {
      localStorage.removeItem('AccessToken')
    })

  Message.success('退出登录')
}

const goLoginPage = () => {
  router.push('user/login')
}
const handleSelect = (event: string) => {
  console.log(event)
}
</script>
<style scoped></style>
