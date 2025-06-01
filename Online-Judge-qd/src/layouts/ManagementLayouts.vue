<template>
  <a-layout class="layout-demo">
    <a-layout-sider hide-trigger collapsible :collapsed="collapsed">
      <div class="logo" @click="router.push('/')">
        <div v-if="!collapsed" class="logo-wrapper">
          <img src="@/assets/logo.png" alt="logo" />
          <div class="title">KUIKUI OJ</div>
        </div>
        <div v-else class="logo-wrapper-collapsed">
          <img src="@/assets/logo.png" alt="logo" />
        </div>
      </div>
      <a-menu
        :defaultOpenKeys="['0_1', '0_3']"
        :selectedKeys="[activeMenuKey]"
        :style="{ width: '100%' }"
        @menuItemClick="handleMenuItemClick"
      >
        <a-menu-item key="0_1">
          <IconHome />
          首页
        </a-menu-item>

        <a-menu-item key="0_2">
          <icon-user />
          用户管理
        </a-menu-item>

        <a-sub-menu key="0_3">
          <template #title>
            <icon-code />
            题目管理
          </template>
          <a-menu-item key="0_3_1">
            题目列表
          </a-menu-item>
          <a-menu-item key="0_3_2">
            添加题目
          </a-menu-item>
        </a-sub-menu>

        <a-menu-item key="0_4">
          <icon-history />
          提交记录管理
        </a-menu-item>
        <a-menu-item key="0_5">
          <icon-info />
          标签管理
        </a-menu-item>
        <a-menu-item key="0_6">
          <icon-trophy />
          竞赛管理
        </a-menu-item>
        <a-menu-item key="0_7">
          <IconCalendar />
          日志管理
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="padding-left: 20px" class="header">
        <a-button shape="round" @click="onCollapse">
          <IconCaretRight v-if="collapsed" />
          <IconCaretLeft v-else />
        </a-button>
        <div style="display: flex; align-items: center">
          <a-tooltip content="切换黑夜白天模式" position="bottom">
            <ThemeSwitch></ThemeSwitch>
          </a-tooltip>
          <a-tooltip content="全屏" position="bottom">
            <a-button
              shape="round"
              class="fullscreen-btn"
              @click="toggleFullscreen"
              style="margin: 0 10px"
            >
              <div><IconFullscreenExit v-if="isFullscreen" /> <IconFullscreen v-else /></div>
            </a-button>
          </a-tooltip>
          <a-tooltip content="自定义主题" position="bottom">
            <a-button
              shape="round"
              class="fullscreen-btn"
              @click="toggleDrawer"
              style="margin: 0 10px"
            >
              <icon-apps />
            </a-button>
          </a-tooltip>
          <a-drawer :visible="drawerVisible" @cancel="toggleDrawer" width="300px" placement="right">
            <template #title> 主题设置 </template>
            <div style="padding: 20px">
              <p>内容区域背景颜色</p>
              <a-color-picker
                v-model="contentBgColor"
                show-history
                show-preset
                @change="handleBgColorChange"
              />
            </div>
          </a-drawer>
          <MyHeader style="margin-left: 10px"></MyHeader>
        </div>
      </a-layout-header>
      <a-layout style="padding: 0 24px; margin-top: 20px">
        <a-layout-header>
          <a-breadcrumb :style="{ marginBottom: '20px' }">
            <a-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
              {{ item }}
            </a-breadcrumb-item>
          </a-breadcrumb>
          <a-tabs
            type="card-gutter"
            :editable="true"
            :show-add-button="false"
            @delete="handleDelete"
            v-model:active-key="activeKey"
            @change="handleTabChange"
          >
            <template #extra>
              <a-button type="text" size="small" @click="clearAllTabs">
                <template #icon><icon-delete /></template>
                清空标签页
              </a-button>
            </template>
            <a-tab-pane
              style="background-color: #fff"
              v-for="item of indexStore.tabs"
              :key="item.key"
              :title="item.title"
              :closable="item.key !== '0_1'"
            >
              <router-view></router-view>
            </a-tab-pane>
          </a-tabs>
        </a-layout-header>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IconHome,
  IconUser,
  IconCaretRight,
  IconCaretLeft,
  IconCode,
  IconTrophy,
  IconCalendar,
  IconInfo,
  IconHistory,
  IconDelete,
  IconApps,
  IconFullscreen,
  IconFullscreenExit,
} from '@arco-design/web-vue/es/icon'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import MyHeader from '@/components/MyHeader.vue'
import { useIndexStore } from '@/stores/indexStore'

const router = useRouter()
const route = useRoute()
const collapsed = ref(false)
const activeKey = ref('0_1')
const activeMenuKey = ref('0_1')
const indexStore = useIndexStore()

// 路径与菜单键的映射
const pathToMenuKeyMap: Record<string, string> = {
  '/management/index': '0_1',
  '/management/user': '0_2',
  '/management/question': '0_3_1',
  '/management/question/put': '0_3_2',
  '/management/questionSubmit': '0_4',
  '/management/tag': '0_5',
  '/management/competition': '0_6',
  '/management/loginLog': '0_7'
}

// 菜单键与路径的映射
const menuKeyToPathMap: Record<string, string> = {
  '0_1': '/management/index',
  '0_2': '/management/user',
  '0_3_1': '/management/question',
  '0_3_2': '/management/question/put',
  '0_4': '/management/questionSubmit',
  '0_5': '/management/tag',
  '0_6': '/management/competition',
  '0_7': '/management/loginLog'
}

// 根据当前路由路径获取菜单键
const getMenuKeyFromPath = (path: string): string => {
  return pathToMenuKeyMap[path] || '0_1'
}

// 初始化方法，确保页面刷新时菜单状态和标签页同步
const initializePageState = () => {
  const path = route.path
  const menuKey = getMenuKeyFromPath(path)
  
  // 设置菜单激活状态
  activeKey.value = menuKey
  activeMenuKey.value = menuKey

  // 如果当前路径对应的标签页不存在，创建它
  const existingTab = indexStore.tabs.find(tab => tab.path === path)
  if (!existingTab && path !== '/management/index') {
    // 获取路由元数据中的标题或使用默认标题
    const title = route.meta?.title || '未命名页面'
    addTab(title.toString(), path, menuKey)
  }
}

// 组件挂载时初始化页面状态
onMounted(() => {
  initializePageState()
})

const breadcrumbList = computed(() => {
  const matched = route.matched
  return matched.map((item) => item.meta?.title || item.name)
})

const onCollapse = () => {
  collapsed.value = !collapsed.value
}

// 添加标签页
const addTab = (title: string, path: string, key?: string) => {
  const tabKey = key || path // 使用path作为key或自定义key

  // 如果标签页已存在，则激活它
  const existingTab = indexStore.tabs.find((tab) => tab.key === tabKey)
  if (existingTab) {
    activeKey.value = tabKey
    activeMenuKey.value = tabKey
    router.push(path)
    return
  }

  // 添加新标签页
  indexStore.tabs.push({
    key: tabKey,
    title,
    path,
  })

  // 激活新标签页
  activeKey.value = tabKey
  activeMenuKey.value = tabKey
  router.push(path)
}

// 处理菜单项点击
const handleMenuItemClick = (key: string) => {
  activeMenuKey.value = key
  activeKey.value = key
  
  // 使用映射表获取对应的路径
  const path = menuKeyToPathMap[key] || '/management/index'
  
  // 查找是否已有对应的标签页
  const existingTab = indexStore.tabs.find((tab) => tab.key === key)
  if (existingTab) {
    router.push(existingTab.path)
  } else {
    // 获取路径对应的标题
    let title = '未命名页面'
    switch (key) {
      case '0_1':
        title = '首页'
        break
      case '0_2':
        title = '用户管理'
        break
      case '0_3_1':
        title = '题目列表'
        break
      case '0_3_2':
        title = '添加题目'
        break
      case '0_4':
        title = '提交记录管理'
        break
      case '0_5':
        title = '标签管理'
        break
      case '0_6':
        title = '竞赛管理'
        break
      case '0_7':
        title = '日志管理'
        break
      default:
        title = '未命名页面'
    }
    // 创建新标签页并导航
    addTab(title, path, key)
  }
}

// 处理标签页切换
const handleTabChange = (key: string) => {
  const tab = indexStore.tabs.find((t) => t.key === key)
  if (tab) {
    activeKey.value = key
    activeMenuKey.value = key
    router.push(tab.path)
  }
}

// 处理删除标签页
const handleDelete = (key: string) => {
  const index = indexStore.tabs.findIndex((tab) => tab.key === key)
  if (index !== -1) {
    indexStore.tabs.splice(index, 1)

    // 如果删除的是当前激活的标签页，则激活前一个标签页
    if (activeKey.value === key) {
      activeKey.value = indexStore.tabs[Math.max(0, index - 1)]?.key || ''
      if (indexStore.tabs.length > 0) {
        router.push(indexStore.tabs.find((tab) => tab.key === activeKey.value)?.path || '/')
      }
    }
  }
}

// 清空所有标签页（除了首页）
const clearAllTabs = () => {
  // 保留首页标签页
  indexStore.tabs = indexStore.tabs.filter((tab) => tab.key === '0_1')
  // 激活首页标签页
  activeKey.value = '0_1'
  // 跳转到首页
  router.push('/management/index')
}

// 监听路由变化，确保标签页同步
watch(
  () => route.path,
  (newPath) => {
    const menuKey = getMenuKeyFromPath(newPath)
    
    // 更新菜单激活状态
    activeMenuKey.value = menuKey
    
    const tab = indexStore.tabs.find((t) => t.path === newPath)
    if (tab) {
      activeKey.value = tab.key
    } else {
      // 如果标签页不存在但路径有效，创建新标签页
      if (menuKey && newPath !== '/management/index') {
        const title = route.meta?.title || '未命名页面'
        addTab(title.toString(), newPath, menuKey)
      }
    }
  },
  { immediate: true },
)

const isFullscreen = ref(false)
const drawerVisible = ref(false)
const contentBgColor = ref('')

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const toggleDrawer = () => {
  drawerVisible.value = !drawerVisible.value
}

const handleBgColorChange = (color: string) => {
  document.documentElement.style.setProperty('--color-bg-3', color)
  document.querySelector('.arco-layout')?.setAttribute('style', `background: ${color}`)
}
</script>

<style scoped>
.layout-demo {
  height: 100%;
  background-color: var(--color-fill-2);
  border: 1px solid var(--color-border);
}
.layout-demo :deep(.arco-layout-sider) .logo {
  height: 32px;
  margin: 12px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
}

.logo-wrapper img {
  width: 30px;
  height: 30px;
}

.logo-wrapper-collapsed {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.logo-wrapper-collapsed img {
  width: 30px;
  height: 30px;
}

.title {
  margin-left: 12px;
  color: var(--color-text);
  font-weight: bold;
  transition: color 0.3s ease;
}

/* 深色模式下的标题样式 */
:root.dark .title {
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.layout-demo :deep(.arco-layout-sider-children) {
  /* 保留原有样式 */
  height: 100vh;
  background: var(--color-background);
  border: 1px solid var(--color-border);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  height: 100%;
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.layout-demo :deep(.arco-layout-header) {
  height: 64px;
  line-height: 64px;
  background: var(--color-background-soft);
}

.layout-demo :deep(.arco-layout-footer) {
  height: 48px;
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  line-height: 48px;
}

.layout-demo :deep(.arco-layout-content) {
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  background: var(--color-background);
  padding: 24px;
  min-height: calc(100vh - 64px - 48px - 32px);
  overflow: auto;
}

.layout-demo :deep(.arco-layout-footer) {
  height: 48px;
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  line-height: 48px;
  text-align: center;
  background: var(--color-background-soft);
}

.layout-demo :deep(.arco-layout-footer),
.layout-demo :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: var(--color-text-2);
  font-size: 14px;
  text-align: left;
}

/* 暗色模式下的标签页样式 */
:root.dark .layout-demo :deep(.arco-tabs-content) {
  background-color: var(--color-background);
}

:root.dark .layout-demo :deep(.arco-tabs-nav-tab) {
  background-color: var(--color-background-soft);
}

:root.dark .layout-demo :deep(.arco-tabs-header) {
  border-bottom: 1px solid var(--color-border);
}

:root.dark .layout-demo :deep(.arco-tabs-tab) {
  color: var(--color-text);
  background-color: var(--color-background-soft);
}

:root.dark .layout-demo :deep(.arco-tabs-tab-active) {
  color: var(--color-primary);
  background-color: var(--color-background);
}

@media (max-width: 768px) {
  .layout-demo {
    flex-direction: column;
  }

  .layout-demo :deep(.arco-layout-sider) {
    width: 100% !important;
    max-width: 100% !important;
  }

  .header {
    padding: 5px;
  }

  .layout-demo :deep(.arco-menu) {
    width: 100%;
  }

  .layout-demo :deep(.arco-layout-content) {
    padding: 10px;
  }
}
</style>
