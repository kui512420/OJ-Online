import { ref } from 'vue'
import { defineStore } from 'pinia'
import AccessEnum from '@/access/accessEnum'
import { UserControllerService } from '@/generated'

export type ThemeMode = 'light' | 'dark' | 'system'

export const useUserStore = defineStore('user', () => {
  const user = ref({
    id: '',
    userAccount: '',
    userRole: AccessEnum.NOT_LOGIN,
    userName: '',
    email: '',
    userAvatar: '',
    userProfile: '',
    createTime: '',
  })

  // 主题相关状态
  const themeMode = ref<ThemeMode>((localStorage.getItem('themeMode') as ThemeMode) || 'system')
  const isDark = ref(false)

  // 获取系统主题
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // 更新主题状态
  const updateTheme = () => {
    if (themeMode.value === 'system') {
      isDark.value = getSystemTheme()
    } else {
      isDark.value = themeMode.value === 'dark'
    }

    // 更新HTML属性
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      document.body.setAttribute('arco-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.removeAttribute('arco-theme')
    }
  }

  // 设置主题模式
  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode
    localStorage.setItem('themeMode', mode)
    updateTheme()
  }

  // 初始化主题
  const initTheme = () => {
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (themeMode.value === 'system') {
        updateTheme()
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // 初始更新主题
    updateTheme()

    // 清理函数
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }

  const login = async () => {
    await UserControllerService.getLogin().then((res) => {
      user.value.id = String(res.data?.id ?? '')
      user.value.userName = String(res.data?.userName ?? '')
      user.value.email = String(res.data?.email ?? '')
      user.value.userProfile = String(res.data?.userProfile ?? '')
      user.value.createTime = String(res.data?.createTime ?? '')
      user.value.userAvatar = String(res.data?.userAvatar ?? '')
      user.value.userAccount = String(res.data?.userAccount ?? '')
      user.value.userRole = String(res.data?.userRole ?? AccessEnum.NOT_LOGIN)
    })
  }
  return {
    user,
    themeMode,
    isDark,
    setThemeMode,
    initTheme,
    login,
  }
})
