import axios from 'axios'
import md5 from 'js-md5'
import config from './config'
import store from '@/store'
let Base64 = require('js-base64').Base64
import M from './cookies'
// const vm = this
let Rxports = {
  /**
   * 封装axios，减少学习成本，参数基本跟jq ajax一致
   * @param {String} type 请求的类型，默认post
   * @param {String} url 请求地址
   * @param {String} time 超时时间
   * @param {Object} data 请求参数
   * @param {String} dataType 预期服务器返回的数据类型，xml html json ...
   * @param {Object} headers 自定义请求headers
   * @param {Function} success 请求成功后，这里会有两个参数,服务器返回数据，返回状态，[data, res]
   * @param {Function} error 发送请求前
   * @param return
   */
  // 从localstorage中取token
  install (Vue, options) {
    // axios全局默认配置
    axios.defaults.baseURL = config.apiHost
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    axios.defaults.timeout = 10000
    // token请求方式
    Vue.prototype.ajax = function (opts) {
      if (!opts && typeof opts !== 'object') {
        console.error('ConfigError:', 'request options is not defined')
        return false
      }
      if (!opts.headers || typeof opts.headers !== 'object') opts.headers = {}
      //let token = localStorage.getItem('kg_desk_token') || ''
      let token = M.getCookie('token');
      // let token = '411541162382467072_bb9f23d790bd4beb86a043d94da81452'
      opts.headers.token = token
      opts.data = opts.data || {}
      this.postDataRequest(opts) // 加密opts.data
      if (!opts.url) {
        console.error('ConfigError:', 'request url is not defined')
        return false
      }
      // 发送请求
      axios({
        method: opts.type || 'post',
        url: opts.url,
        data: opts.data,
        headers: opts.headers,
        timeout: opts.time || 30000,
        responseType: opts.dataType || 'json'
      }).then(res => {
        if (res.status === 200) {
          // 登录失效处理, 跳转到登录页面
          if (res.data.code === '10004') {
            Vue.prototype.$message({
              type: 'error',
              message: res.data.message
            })
            setTimeout(()=>{
              store.dispatch('logtokenout')
            },1000)

            return
          }
          if (res.data.code === '10011') {
            Vue.prototype.$message({
              type: 'error',
              message: res.data.message
            })
            setTimeout(()=>{
              store.dispatch('logtokenout')
            },1000)
            return
          }
          // 成功回调
          if (opts.success && typeof opts.success === 'function') {
            opts.success(res.data)
          }
        } else {
          // 失败回调
          if (opts.error && typeof opts.success === 'function') {
            opts.error(res.error)
          } else {
            console.log(res.error)
          }
        }
      }).catch(error => {
        // 异常处理
        console.log('error', error)
      })
    }
    // 参数加密
    Vue.prototype.postDataRequest = function (opts) {
      var data = new FormData()
      if (opts.data === '') {
        data.append('data', '')
        data.append('sign', md5('' + opts.headers.token))
      } else {
        data.append('data', Base64.encode(JSON.stringify(opts.data)))
        data.append('sign', md5(Base64.encode(JSON.stringify(opts.data)) + opts.headers.token))
      }
      opts.data = data
    }
    Vue.prototype.noSignRequest = function (data) {
      let list = {
        'data': Base64.encode(JSON.stringify(data))
      }
      return list
    }
  }
}
export default Rxports
