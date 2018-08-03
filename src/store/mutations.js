/**
 * @description： 全局状态数据修改方法（同步）
 * @author: zhangchenle
 * @date: 2018-05-31
 */
export default {
  SET_USER_INFO: (state, data) => {
    state.userInfo = data || {}
  },
  SET_TOKEN: (state, token) => {
    state.token = token || ''
  }
}
