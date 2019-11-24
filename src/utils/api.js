import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import qs from 'qs';
import store from '../store'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_URL, // api的base_url
  timeout: 15000                  // 请求超时时间2
})
// request拦截器
service.interceptors.request.use(config => {
  if (config.method.toLocaleLowerCase() === 'post'
    || config.method.toLocaleLowerCase() === 'put'
    || config.method.toLocaleLowerCase() === 'delete') {

    config.data = qs.stringify(config.data)
  }
  return config
}, error => {
  // Do something with request error
  console.error(error) // for debug
  Promise.reject(error)
})
// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data.result;
    console.info(response.status)
    if (res.code == '20000') {
      return res;
    }
    if (res.code == '100') {
      return res.info;
    } else if (response.status == 403) {
      alert('aaa')
      Message({
        showClose: true,
        message: res.msg,
        type: 'error',
        duration: 500,
        onClose: () => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        }
      });
      return Promise.reject("未登录")
    } else {
      Message({
        message: res.msg,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(res)
    }
  },
  error => {
    console.error('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)
export default service

