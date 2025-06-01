<script setup lang="ts">
import BasicLayouts from '@/layouts/BasicLayouts.vue'
import UserLayouts from '@/layouts/UserLayouts.vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { onMounted, watch } from 'vue'

const router = useRoute()
const useStore = useUserStore()

// 初始化主题
onMounted(() => {
  useStore.initTheme()
})

// 监听主题变化
watch(() => useStore.isDark, (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark')
    document.body.setAttribute('arco-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.body.removeAttribute('arco-theme')
  }
}, { immediate: true })
</script>

<template>
  <div id="app" :class="{ 'theme-transition': true, 'dark': useStore.isDark }">
    <template v-if="router.path.startsWith('/user')">
      <UserLayouts></UserLayouts>
    </template>
    <template v-else-if="router.path.startsWith('/management')">
      <router-view></router-view>
    </template>
    <template v-else>
      <BasicLayouts></BasicLayouts>
    </template>
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
}

.theme-transition {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.theme-transition * {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* 确保暗黑模式样式正确应用 */
:root.dark {
  color-scheme: dark;
}

:root.dark body {
  background-color: var(--color-background);
  color: var(--color-text);
}

:root.dark #app {
  background-color: var(--color-background);
  color: var(--color-text);
}
</style>
