/**
*  @description： 作者端注册、申请专栏等进入home页之前的Header组件
*  @author： zhangchenle
*  @data:  2018.6.4
*/
<template>
  <div class="header">
    <div class="box">
      <div class="title">
        <img @click="toIndex" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/inlet/logo2.png" alt=""  class="logo">
      </div>
    </div>
  </div>
</template>
<script>
import M from '@/assets/js/cookies'
export default {
  data () {
    return {
    }
  },
  methods: {
    toIndex () {
      M.delCookie('token');  //清除token
      M.delCookie('realnameAuthed');  //清除realnameAuthed
      M.delCookie('userId');  //清除userId
      M.delCookie('userMobile');  //清除userMobile
      M.delCookie('atskMobile');  //清除atskMobile
      M.delCookie('userName');  //清除userName
      M.delCookie('userRole');  //清除userRole
      M.delCookie('loginBonusStatus');  //清除loginBonusStatus
      M.delCookie('mobileArea');  //清除mobileArea
      window.location.href = '/'
    }
  }
}
</script>
<style lang="less" scoped>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 1000;
    .box {
      width: 100%;
      height: 72px;
      line-height: 72px;
      box-shadow: 0px 2px 4px rgba(183,182,182,0.1);
      .title {
        margin: 0 auto;
        width: 1200px;
        font-size: 24px;
        font-family: MicrosoftYaHei-Bold;
        color:rgba(0,0,0,1);
        font-weight: bold;
        .logo{
          height: 43px;
          width: 166px;
          margin-left: 20px;
          cursor: pointer;
        }
      }
    }
  }
</style>
