import axios from 'axios'
import qs from 'qs'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://58.119.112.12:11010'
})

// request拦截器
service.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  config['headers']['Content-Type'] = 'application/x-www-form-urlencoded'
  // config.headers['token'] = '87330f8714214b548758ed1b1a44a18b'
  if (config.method === 'POST' || config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
},

error => {
  // 对请求错误做些什么
  console.info(error)
  return Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
