/**
 *  @description： 路由管理
 *  @author： zhangchenle
 *  @data:  2018.6.1
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import M from '@/assets/js/cookies'
if (process.env.NODE_ENV === 'development') {
  Vue.use(VueRouter)
}

const vueRouter = new VueRouter({
  // mode: 'history',
  routes: [
    // 登录页
    {
      path: '/404',
      name: '404',
      component: resolve => require(['@/components/error/404'], resolve)
    },
    // 登录页
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/components/login'], resolve)
    },
    // 注册页
    {
      path: '/register',
      name: 'register',
      component: resolve => require(['@/components/register'], resolve)
    },
    // 忘记密码页
    {
      path: '/forget',
      name: 'forget',
      component: resolve => require(['@/components/forget'], resolve)
    },
    // 申请专栏引导页
    {
      path: '/guide',
      name: 'apply.guide',
      component: resolve => require(['@/components/apply/guide'], resolve)
    },
    // 申请专栏主页(选择类型页)
    {
      path: '/apply',
      name: 'apply',
      component: resolve => require(['@/components/apply'], resolve)
    },
    // 申请专栏个人、媒体、组织、企业等认证页
    {
      path: '/personal',
      name: 'apply.personal',
      component: resolve => require(['@/components/apply/personal'], resolve)
    },
    // 申请专栏进度页
    {
      path: '/progress',
      name: 'apply.progress',
      component: resolve => require(['@/components/apply/progress'], resolve)
    },
    // 视频预览页
    {
      path: '/videoPreview',
      name: 'home.videoPreview',
      component: resolve => require(['@/components/publish/videoPreview'], resolve)
    },
    // 文章预览页
    {
      path: '/articlePreview',
      name: 'home.articlePreview',
      component: resolve => require(['@/components/publish/articlePreview'], resolve)
    },
    // 作者端登录后home页
    {
      path: '/',
      component: resolve => require(['@/components/home'], resolve),
      children: [
        // 首页
        {
          path: '',
          name: 'home.index',
          component: resolve => require(['@/components/index'], resolve)
        },
        {
          path: 'index',
          redirect: '/'
        },
        {
          path: 'setting',
          name: 'home.columnSetting',
          component: resolve => require(['@/components/setting/columnSetting'], resolve)
        },
        {
          path: 'income',
          name: 'home.income',
          component: resolve => require(['@/components/income/incomeManager'], resolve)
        },
        {
          path: 'fansData',
          name: 'home.fansData',
          component: resolve => require(['@/components/data/fansData'], resolve)
        },
        {
          path: 'contentManage',
          name: 'home.contentManage',
          component: resolve => require(['@/components/manage/contentManage'], resolve)
        },
        {
          path: 'commentMange',
          name: 'home.commentMange',
          component: resolve => require(['@/components/manage/commentMange'], resolve)
        },
        {
          path: 'publishArticle',
          name: 'home.publishArticle',
          component: resolve => require(['@/components/publish/publishArticle'], resolve)
        },
        {
          path: 'publishVideo',
          name: 'home.publishVideo',
          component: resolve => require(['@/components/publish/publishVideo'], resolve)
        },
        {
          path: 'editorArticle',
          name: 'home.editorArticle',
          component: resolve => require(['@/components/editor/editorArticle'], resolve)
        },
        {
          path: 'editorVideo',
          name: 'home.editorVideo',
          component: resolve => require(['@/components/editor/editorVideo'], resolve)
        },
        {
          path: 'moreNotice',
          name: 'home.moreNotice',
          component: resolve => require(['@/components/notice/moreNotice'], resolve)
        },
        {
          path: 'noticeDetail',
          name: 'home.noticeDetail',
          component: resolve => require(['@/components/notice/noticeDetail'], resolve)
        }
      ]
    }
  ]
})
vueRouter.beforeEach(function (to, from, next) {
  // 未匹配到任何页面, 跳转到404页面
  if (to.matched.length === 0) {
    vueRouter.push('/404')
  }
  if (to.path === '/404') {
    next()
    return
  }
  let token = store.state.token
  if (token) {
    // 登录状态

    let userInfo = store.state.userInfo
    if (userInfo) {
      // 存在用户信息
      let userRole = store.state.userInfo.userRole

      if (userRole === 1) {
        // 普通用户,访问非申请专栏相关页面，跳转到申请专栏引导页
        if (!to.name.startsWith('apply')) {
          vueRouter.push('/guide')
        }
        next()
      } else {
        // 专栏用户，非home子页面跳转到home主页,home页面不拦截
        if (!to.name.startsWith('home')) {
          location.href = './'
          M.delCookie('token') // 清除token
          M.delCookie('realnameAuthed') // 清除realnameAuthed
          M.delCookie('userId') // 清除userId
          M.delCookie('userMobile') // 清除userMobile
          M.delCookie('atskMobile') // 清除atskMobile
          M.delCookie('userName') // 清除userName
          M.delCookie('userRole') // 清除userRole
          M.delCookie('loginBonusStatus') // 清除loginBonusStatus
          M.delCookie('mobileArea') // 清除mobileArea
        }
        next()
      }
    } else {
      // 不存在用户信息，查询用户信息
      Vue.prototype.ajax({
        url: '/login/getUserInfo',
        success (data) {
          if (data.code === '10000') {
            let userInfo = data.responseBody
            userInfo.avatar = data.responseBody.inmagelink
            store.commit('SET_USER_INFO', userInfo) // 设置用户信息
            if (userInfo.userRole === 1) {
              // 普通用户,访问非申请专栏相关页面，跳转到申请专栏引导页
              if (!to.name.startsWith('apply')) {
                vueRouter.push('/guide')
              }
            } else {
              // 专栏用户，非home子页面跳转到home主页,home页面不拦截
              if (!to.name.startsWith('home')) {
                vueRouter.push('/')
              }
            }
          } else {
            // 查询失败跳转登录页面
            if (to.path !== '/login') {
              M.delCookie('token') // 清除token
              M.delCookie('realnameAuthed') // 清除 realnameAuthed
              M.delCookie('userId') // 清除 userId
              M.delCookie('userMobile') // 清除 userMobile
              M.delCookie('atskMobile') // 清除 atskMobile
              M.delCookie('userName') // 清除userName
              M.delCookie('userRole') // 清除userRole
              M.delCookie('loginBonusStatus') // 清除loginBonusStatus
              M.delCookie('mobileArea') // 清除mobileArea
              vueRouter.push('/login')
            }
          }
          next()
        },
        error (msg) {
          // 异常跳转登录页面
          if (to.path !== '/login') {
            M.delCookie('token') // 清除token
            M.delCookie('realnameAuthed') // 清除realnameAuthed
            M.delCookie('userId') // 清除userId
            M.delCookie('userMobile') // 清除userMobile
            M.delCookie('atskMobile') // 清除atskMobile
            M.delCookie('userName') // 清除userName
            M.delCookie('userRole') // 清除userRole
            M.delCookie('loginBonusStatus') // 清除loginBonusStatus
            M.delCookie('mobileArea') // 清除mobileArea
            vueRouter.push('/login')
          }
          next()
        }
      })
    }
  } else {
    // 未登录状态，除注册页面和忘记密码页面外，都跳转到登录页面
    if (to.path !== '/login' && to.path !== '/register' && to.path !== '/forget') {
      M.delCookie('token') // 清除token
      M.delCookie('realnameAuthed') // 清除realnameAuthed
      M.delCookie('userId') // 清除userId
      M.delCookie('userMobile') // 清除userMobile
      M.delCookie('atskMobile') // 清除atskMobile
      M.delCookie('userName') // 清除userName
      M.delCookie('userRole') // 清除userRole
      M.delCookie('loginBonusStatus') // 清除loginBonusStatus
      M.delCookie('mobileArea') // 清除mobileArea
      location.href = '/'
    }
    next()
  }
})

export default vueRouter
