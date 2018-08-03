/**
 * @description： 全局状态数据（组件私有数据不要存储在vux里面）
 * @author: zhangchenle
 * @date: 2018-05-31
 */
import M from '../assets/js/cookies'

//
// console.log('token',token)
 //let token = localStorage.getItem('kg_desk_token') || ''

let token = M.getCookie('token')||''
export default {
  userInfo: null, // 用户信息
  token: token // token
}
