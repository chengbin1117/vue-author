/**
 * @description： 全局状态数据修改方法（异步）
 * @author: zhangchenle
 * @date: 2018-05-31
 */
import Vue from 'vue'
import router from '@/router'
import M from '../assets/js/cookies'

export default {
  // 退出登录
  logtokenout ({ commit }) {
    commit('SET_USER_INFO', null) // 清空用户信息
    commit('SET_TOKEN', '') // 清空token
    localStorage.clear() // 清除token缓存
    M.delCookie('token');  //清除token
    M.delCookie('realnameAuthed');  //清除realnameAuthed
    M.delCookie('userId');  //清除userId
    M.delCookie('userMobile');  //清除userMobile
    M.delCookie('atskMobile');  //清除atskMobile
    M.delCookie('userName');  //清除userName
    M.delCookie('userRole');  //清除userRole
    M.delCookie('loginBonusStatus');  //清除loginBonusStatus
    M.delCookie('mobileArea');  //清除mobileArea
    location.href = '/' // 跳转到登录页面
  },
  logout ({ commit }) {
    let data = {
      'token':M.getCookie('token')
    }
    Vue.prototype.ajax({
      url: '/login/logOut',
      data,
      success: data => {
        if (data.code === '10000') {
          commit('SET_USER_INFO', null) // 清空用户信息
          commit('SET_TOKEN', '') // 清空token
          localStorage.clear() // 清除token缓存
          M.delCookie('token');  //清除token
          M.delCookie('realnameAuthed');  //清除realnameAuthed
          M.delCookie('userId');  //清除userId
          M.delCookie('userMobile');  //清除userMobile
          M.delCookie('atskMobile');  //清除atskMobile
          M.delCookie('userName');  //清除userName
          M.delCookie('userRole');  //清除userRole
          M.delCookie('loginBonusStatus');  //清除loginBonusStatus
          M.delCookie('mobileArea');  //清除mobileArea
          location.href = '/' // 跳转到登录页面
        }
      }
    })

  },
  logproout ({ commit }) {
    let data = {
      'token':M.getCookie('token')
    }
    Vue.prototype.ajax({
      url: '/login/logOut',
      data,
      success: data => {
        if (data.code === '10000') {
          commit('SET_USER_INFO', null) // 清空用户信息
          commit('SET_TOKEN', '') // 清空token
          localStorage.clear() // 清除token缓存
          M.delCookie('token');  //清除token
          M.delCookie('realnameAuthed');  //清除realnameAuthed
          M.delCookie('userId');  //清除userId
          M.delCookie('userMobile');  //清除userMobile
          M.delCookie('atskMobile');  //清除atskMobile
          M.delCookie('userName');  //清除userName
          M.delCookie('userRole');  //清除userRole
          M.delCookie('loginBonusStatus');  //清除loginBonusStatus
          M.delCookie('mobileArea');  //清除mobileArea
          router.push('/login') // 跳转到登录页面
        }
      }
    })

  },
  // 账号密码登录
  accountLogin ({ commit }, params) {
    let from = params.from;
    let data = {
      userMobile: params.userMobile,
      userPassword: params.userPassword,
    }
    let loading = params.that.loading;
    loading = true; //加载。。。

    Vue.prototype.ajax({
      url: '/login/checkLogin',
      data,
      success: data => {
        if (data.code === '10000') {
          loading = false; //关闭加载。。。

          let token = data.responseBody.data.token
          let userId = data.responseBody.data.userId
          let userMobile = data.responseBody.data.userMobile
          let atskMobile = data.responseBody.data.atskMobile
          let mobileArea = data.responseBody.data.mobileArea
          let userRole = data.responseBody.data.userRole
          let userName = data.responseBody.data.userName
          let loginBonusStatus = data.responseBody.data.loginBonusStatus
          commit('SET_TOKEN', token) // 设置token
          M.setCookie('token',token);
          M.setCookie('userId',userId);
          M.setCookie('userMobile',userMobile);
          M.setCookie('atskMobile',atskMobile);
          M.setCookie('mobileArea',mobileArea);
          M.setCookie('atskMobile',atskMobile);
          M.setCookie('userRole',userRole);
          M.setCookie('userName',userName);
          M.setCookie('loginBonusStatus',loginBonusStatus);
          Vue.prototype.ajax({
            url: '/login/getUserInfo',
            success (data) {
              if (data.code === '10000') {
                let userInfo = data.responseBody
                userInfo.avatar = data.responseBody.inmagelink
                commit('SET_USER_INFO', userInfo) // 设置用户信息
                if (userInfo.userRole === 1) {
                  // 普通用户,访问非申请专栏相关页面，跳转到申请专栏引导
                  if (from === 'register') {
                    router.push('/apply') // 注册成功,普通用户进入专栏申请页
                  } else {
                    router.push('/guide') // 账密登录成功,普通用户进入专栏导航页
                  }
                } else {
                  // 专栏用户，非home子页面跳转到home主页,home页面不拦截
                    router.push('/')

                }
              } else {
                // 查询失败跳转登录页面
                  M.delCookie('token');  //清除token
                  M.delCookie('realnameAuthed');  //清除realnameAuthed
                  M.delCookie('userId');  //清除userId
                  M.delCookie('userMobile');  //清除userMobile
                  M.delCookie('atskMobile');  //清除atskMobile
                  M.delCookie('userName');  //清除userName
                  M.delCookie('userRole');  //清除userRole
                  M.delCookie('loginBonusStatus');  //清除loginBonusStatus
                  M.delCookie('mobileArea');  //清除mobileArea
                  router.push('/login')

              }
            }
          })
        } else {
          loading = false; //关闭加载。。。
          // 账密登录失败,提示错误信息
          Vue.prototype.$message({
            type: 'error',
            message: data.message
          })
        }
      }
    })
  },
  // 短信登录
  mobileLogin ({ commit }, data) {
    Vue.prototype.ajax({
      url: '/login/mobileLogin',
      data,
      success: data => {
        if (data.code === '10000') {
          let token = data.responseBody.data.token
          let userId = data.responseBody.data.userId
          let userMobile = data.responseBody.data.userMobile
          let atskMobile = data.responseBody.data.atskMobile
          let mobileArea = data.responseBody.data.mobileArea
          let userRole = data.responseBody.data.userRole
          let userName = data.responseBody.data.userName
          let loginBonusStatus = data.responseBody.data.loginBonusStatus
          commit('SET_TOKEN', token) // 设置token
          M.setCookie('token',token);
          M.setCookie('userId',userId);
          M.setCookie('userMobile',userMobile);
          M.setCookie('atskMobile',atskMobile);
          M.setCookie('mobileArea',mobileArea);
          M.setCookie('atskMobile',atskMobile);
          M.setCookie('userRole',userRole);
          M.setCookie('userName',userName);
          M.setCookie('loginBonusStatus',loginBonusStatus);
          Vue.prototype.ajax({
            url: '/login/getUserInfo',
            success (data) {
              if (data.code === '10000') {
                let userInfo = data.responseBody
                userInfo.avatar = data.responseBody.inmagelink
                commit('SET_USER_INFO', userInfo) // 设置用户信息
                if (userInfo.userRole === 1) {
                  // 普通用户,访问非申请专栏相关页面，跳转到申请专栏引导
                  if (from === 'register') {
                    router.push('/apply') // 注册成功,普通用户进入专栏申请页
                  } else {
                    router.push('/guide') // 账密登录成功,普通用户进入专栏导航页
                  }
                } else {
                  // 专栏用户，非home子页面跳转到home主页,home页面不拦截
                    router.push('/')

                }
              } else {
                // 查询失败跳转登录页面
                  M.delCookie('token');  //清除token
                  M.delCookie('realnameAuthed');  //清除realnameAuthed
                  M.delCookie('userId');  //清除userId
                  M.delCookie('userMobile');  //清除userMobile
                  M.delCookie('atskMobile');  //清除atskMobile
                  M.delCookie('userName');  //清除userName
                  M.delCookie('userRole');  //清除userRole
                  M.delCookie('loginBonusStatus');  //清除loginBonusStatus
                  M.delCookie('mobileArea');  //清除mobileArea
                  router.push('/login')

              }
            }
          })
        } else {

          // 账密登录失败,提示错误信息
          Vue.prototype.$message({
            type: 'error',
            message: data.message
          })
        }
      }
    })
  }
}
