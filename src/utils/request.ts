import axios from 'axios'
import { ElMessage } from 'element-plus'
import pinia from '@/store/store'
import { useMainStore } from '@store'
import router from '@router'

const mainStore = useMainStore(pinia)

const service = axios.create({
  baseURL: mainStore.server,
  timeout: 5000,
})

service.interceptors.request.use(
  function (config: any) {
    if (localStorage.getItem('token')) {
      config.headers['Authorization'] = localStorage.getItem('token')
    }
    if (mainStore.token != null) {
      config.headers['Authorization'] = mainStore.token
    }
    if (config.method == 'get' || config.method == 'GET') {
      if (config.data) {
        config.params = config.data
      }
    }
    return config
  },
  function (error) {
    ElMessage({
      message: 'The request failed to send!',
    })
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response): any => {
    const { data: res } = response
    if (res.code == 200) {
      return res
    }
    if (res.code == 401) {
      ElMessage({
        message: '认证身份过期，请重新登录！',
        type: 'error',
        duration: 5 * 1000,
      })
      router.replace('/login')
      setTimeout(() => {
        location.reload()
      }, 1000)
    }
    return res
  },
  (error) => {
    console.log('err' + error)
    if (error.message.indexOf('timeout') != -1) {
      ElMessage({
        message: '请求超时,请重试！',
        type: 'error',
        duration: 5 * 1000,
      })
    } else {
      ElMessage({
        message: error.message,
        type: 'error',
        duration: 5 * 1000,
      })
    }
    return Promise.reject(error)
  }
)
export default service
