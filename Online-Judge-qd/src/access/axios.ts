import axios from 'axios'
import { Message } from '@arco-design/web-vue'
import router from '@/router'
const service = axios.create({
  url: 'http://oj.kuikui.space',
  withCredentials: true,
})

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    config.headers['AccessToken'] = localStorage.getItem('AccessToken')
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 获取当前路由信息
    const currentRoute = router.currentRoute.value.path

    // 对响应数据做点什么
    // 这里可以根据业务需求添加不同的处理逻辑
    switch (response.data.code) {
      case 40000: // 未登录
        switch (currentRoute) {
          case '/user/login':
          case '/user/register':
          case '/':
            break
          default:
            Message.info('请先登录')
            router.push('/user/login')
        }
        return response.data
      case 40300: // 登录过期或账号被禁用
        if (response.data.message && response.data.message.includes('禁用')) {
          Message.error({
            content: '您的账号已被禁用，请联系管理员',
            duration: 5000
          })
        } else {
          Message.info('账号已过期，请重新登录')
        }
        localStorage.removeItem('AccessToken')
        router.push('/user/login')
        return response.data
      // 你可以根据实际情况添加更多的响应码处理
      default:
        return response
    }
  },
  function (error) {
    // 处理响应错误
    return Promise.reject(error)
  },
)

export default service
