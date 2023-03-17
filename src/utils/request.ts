import type { AxiosError, AxiosRequestConfig } from 'axios'
import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000, // 请求超时时间
})

export type RequestError = AxiosError<{
  message?: string
  result?: any
  errorMessage?: string
}>

// 异常拦截处理器
const errorHandler = (error: RequestError): Promise<any> => {
  if (error.response) {
    const { data = {}, status, statusText } = error.response
    // 403 无权限
    if (status === 403) {

    }
    // 401 未登录/未授权
    if (status === 401 && data.result && data.result.isLogin) {

      // 如果你需要直接跳转登录页面
      // location.replace(loginRoutePath)
    }
  }
  return Promise.reject(error)
}

// 请求拦截器
const requestHandler = (config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
  return config
}

// Add a request interceptor
request.interceptors.request.use(requestHandler, errorHandler)

// 响应拦截器
const responseHandler = (response: { data: any }) => {
  return response.data
}

// Add a response interceptor
request.interceptors.response.use(responseHandler, errorHandler)

export default request
