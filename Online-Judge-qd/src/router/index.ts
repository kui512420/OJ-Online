import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import routes from './routes'
import Message from '@arco-design/web-vue/es/message'
import AccessEnum from '@/access/accessEnum'
import { useUserStore } from '@/stores/userStore'
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})
router.beforeEach((to, from, next) => {
  const useStore = useUserStore()
  useStore.login().then((res) => {
    console.log(res)
  })
  // 检查是否为移动端访问 questionView
  if (to.path.startsWith('/questionView')) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
    if (isMobile) {
      Message.warning('请使用电脑端做题哦')
      next('/')
      return
    }
  }
  // 允许正常跳转
  next()
})

router.afterEach((to, from, failure) => {
  const userStore = useUserStore()
  // 检查是否需要管理员权限
  if (to.meta.access === AccessEnum.ADMIN && userStore.user.userRole !== AccessEnum.ADMIN) {
    Message.warning('您无权限访问该页面哦~')
    router.push('/')
    return
  }
})
export default router
