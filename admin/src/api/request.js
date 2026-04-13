import axios from 'axios'
import { ElMessage } from 'element-plus'

/** axios 实例：baseURL 通过 vite proxy 代理到后端 */
const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

/** 请求拦截：自动附加 token */
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/** 响应拦截：统一处理 code !== 0 和 401 */
http.interceptors.response.use(
  (res) => {
    const body = res.data
    if (body.code !== 0) {
      ElMessage.error(body.message || '请求失败')
      if (body.code === 401) {
        localStorage.removeItem('admin_token')
        window.location.hash = '#/login'
      }
      return Promise.reject(body)
    }
    return body.data
  },
  (err) => {
    const status = err.response?.status
    if (status === 401) {
      localStorage.removeItem('admin_token')
      window.location.hash = '#/login'
    }
    ElMessage.error(err.response?.data?.message || '网络异常')
    return Promise.reject(err)
  },
)

export default http
