/**
*  @description： 作者端申请专栏引导页组件
*  @author： zhangchenle
*  @data:  2018.6.2
*/
<template>
  <div class="guide">
    <img src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/inlet/logo2.png"  class="only-logo" @click="toIndex">
    <div class="box">
      <div class="title">你已登录千氪账号</div>
      <div class="userinfo">
        <div class="photo" :style="{background: 'url(' + getUserPhoto + ') no-repeat center/100px 100px'}"></div>
        <div class="username">{{getUserName}}</div>
      </div>
      <div class="tips" :class="{fail: applyRole !== '1' && auditStatus === 2}">{{tipsText}}</div>
      <div class="btn-forward" @click="forward">{{forwardText}}</div>
      <div class="btn-change" @click="changeAccount">使用其他账号</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import config from '@/assets/js/config'
import M from '@/assets/js/cookies'
export default {
  name: 'Guide',
  data() {
    return {
      defaultPhotoUrl: config.defaultPhotoUrl,
      applyRole: null,
      auditStatus: null
    }
  },
  computed: {
    ...mapState(['userInfo']),
    // 获取用户头像
    getUserPhoto() {
      let userInfo = this.userInfo || {}
      let avatar = userInfo.avatar || ''
      if (!avatar) return this.defaultPhotoUrl
      if (avatar.startsWith('http')) return avatar
      return config.imgHost + avatar;
    },
    // 获取用户姓名
    getUserName() {
      let userInfo = this.userInfo || {}
      return userInfo.userName || "未登录"
    },
    tipsText() {
      if(this.applyRole !== '1') {
        if(this.auditStatus === 0) {
          return "该账号专栏审核中"
        }
        if(this.auditStatus === 2){
          return "该账号专栏审核失败"
        }
      }
      return "该账号还未申请专栏"
    },
    forwardText() {
      if(this.applyRole && this.applyRole !== '1') {
        return "查看审核详情"
      }
      return "申请专栏，成为千氪作者"
    }
  },
  methods: {
    ...mapActions(['logproout']),
    // 申请专栏或查看申请进度
    forward() {
      if(this.applyRole && this.applyRole !== '1') {
        // 查看申请进度
        this.$router.push('/progress')
      }else {
        // 申请专栏
        this.$router.push('/apply')
      }
    },
    // 切换账号
    changeAccount() {
      this.logproout()
      // const that = this;
      //  const list = {
      //   token:M.getCookie('token')
      // };
      // this.ajax({
      //   type: "post",
      //   url: "/login/logOut",
      //   data: list,
      //   success: function(data) {
      //     if (data.code == 10000) {
      //       localStorage.clear();
      //       M.delCookie('token');  //清除token
      //       M.delCookie('realnameAuthed');  //清除realnameAuthed
      //       M.delCookie('userId');  //清除userId
      //       M.delCookie('userMobile');  //清除userMobile
      //       M.delCookie('atskMobile');  //清除atskMobile
      //       M.delCookie('userName');  //清除userName
      //       M.delCookie('userRole');  //清除userRole
      //       M.delCookie('loginBonusStatus');  //清除loginBonusStatus
      //       M.delCookie('mobileArea');  //清除mobileArea
      //       that.$router.push('/login');  //到登陆页
      //     } else {
      //       that.$message({
      //         message: data.message,
      //         type: "error"
      //       });
      //     }
      //   }
      // });
    },
    // 获取申请进度信息
    getProgress() {
      this.ajax({
        url: "/column/checkProfile",
        success: data => {
          if(data.code === "10000") {
            this.applyRole = data.responseBody.applyRole
            this.auditStatus = data.responseBody.auditStatus
          } else if(data.code === "20011"){
            // 未申请专栏的普通用户(不用处理)
          } else {
            this.$message({
              type: 'error',
              message: data.message
            })
          }
        }
      })
    },
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
  },
  mounted() {
    this.getProgress()
  }
}
</script>

<style lang="less" scoped>
  .guide {
    position: relative;
    background: #ccc;
    background-image: url("https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/authorBg.png");
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
    .only-logo{
      z-index: 6;
      height: 43px;
      width: 166px;
      position: absolute;
      left: 99px;
      top: 38px;
      cursor: pointer;
    }
    .box {
      padding: 36px 50px 0;
      position: absolute;
      top: 29.074%;
      right: 23.646%;
      height: 427px;
      width: 400px;
      background: #fff;
      box-shadow: 20px 17px 43px rgba(229,227,227,0.27);
      .title {
        text-align: center;
        color: #333333;
        font-size: 24px;
        font-family: MicrosoftYaHei;
      }
      .userinfo {
        position: relative;
        margin-top: 35px;
        width: 100%;
        height: 100px;
        text-align: center;
        .photo {
          margin: 0 auto;
          width: 100px;
          height: 100%;
          border-radius: 50%;
        }
        .username {
          position: absolute;
          top: 115px;
          width: 100%;
        }
      }
      .tips {
        margin-top: 50px;
        text-align: center;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color:rgba(116,116,116,1);
      }
      .fail {
        color: #FC5A5D;
      }
      .btn-forward {
        margin-top: 35px;
        height: 40px;
        line-height: 40px;
        background: #2382EA;
        color: #fff;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          background: rgba(35,130,234,.7);
        }
      }
      .btn-change {
        margin-top: 18px;
        height: 40px;
        line-height: 40px;
        color: #2382EA;
        border: 1px solid #2382EA;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          color: rgba(35,130,234,.7);
          border: 1px solid rgba(35,130,234,.7);
        }
      }
    }
    .only-logo{
      z-index: 6;
      height: 43px;
      width: 166px;
      position: absolute;
      left: 99px;
      top: 38px;
    }

  }
</style>
