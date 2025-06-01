<template>
  <div class="theme-switch">
    <a-dropdown trigger="click" @select="handleThemeChange">
      <a-button type="text" class="theme-button">
        <template #icon>
          <icon-moon-fill v-if="useStore.isDark" />
          <icon-sun-fill v-else />
        </template>
      </a-button>
      <template #content>
        <a-doption value="light">
          <template #icon><icon-sun-fill /></template>
          浅色模式
        </a-doption>
        <a-doption value="dark">
          <template #icon><icon-moon-fill /></template>
          深色模式
        </a-doption>
        <a-doption value="system">
          <template #icon><icon-computer /></template>
          跟随系统
        </a-doption>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { IconSunFill, IconMoonFill, IconComputer } from '@arco-design/web-vue/es/icon'
import { useUserStore } from '@/stores/userStore'

const useStore = useUserStore()

const handleThemeChange = (value: string) => {
  useStore.setThemeMode(value as 'light' | 'dark' | 'system')
}
</script>

<style scoped>
.theme-switch {
  display: flex;
  align-items: center;
}

.theme-button {
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.theme-button:hover {
  background-color: var(--color-background-soft);
}

:deep(.arco-dropdown-option) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
