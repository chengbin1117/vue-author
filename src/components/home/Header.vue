/**
*  @description： 作者端header组件
*  @author： zhangchenle
*  @data:  2018.6.1
*/
<template>
  <div class="header">
    <div class="boss">
      <div class="box">
        <div class="logo"  @click="toHome">
        </div>
        <div class="setting"  @mouseleave="closeLogout">
          <div class="notice">
            <i class="iconfont icon-tongzhi" @click="moreNotice"></i>
          </div>
          <div class="photo">
            <div class="img" :style="{background: 'url(' + getUserPhoto + ') no-repeat right center/34px 34px'}" @mouseenter="showLogoutWin" >
              <img src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/img/v1.png" class="realAuthedTag" v-if=" getvipTag === 1"/>
            </div>
          </div>
          <span class="username" @mouseenter="showLogoutWin" >{{getUserName}}</span>
          <span class="certified">{{getIdentityTag}}</span>
          <div v-if="showLogout" class="logout" @click="loginout">退出登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import config from '@/assets/js/config'
import M from '@/assets/js/cookies'
export default {
  name: 'Header',
  data(){
    return {
      showLogout: false,
      defaultPhotoUrl: config.defaultPhotoUrl,
      realAuthedTag: 0, //实名认证
      vipTag: 0, //大V标签
      src:config.mainNameHost
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
    // 获取用户标签认证
    getIdentityTag() {
      let userInfo = this.userInfo || {}
      return userInfo.identityTag || "未认证专栏"
    },
    //获取实名认证
    getrealAuthedTag() {
      let userInfo = this.userInfo || {}
      return userInfo.realAuthedTag
    },
    //获取大V
    getvipTag() {
      let userInfo = this.userInfo || {}
      return userInfo.vipTag
    },
  },
  methods: {
    ...mapActions(['logout']),
    // 跳转首页
    loginout(){
      this.logout();
      // console.log(1)
      //  localStorage.clear();
      //  window.location.href = "/";
      //  localStorage.setItem("kg_loginout",2)
      // const that = this;
      //  const list = {
      //   token: M.getCookie('token')
      // };
      // this.ajax({
      //   type: "post",
      //   url: "/login/logOut",
      //   data: list,
      //   success: function(data) {
      //     localStorage.clear();
      //     M.delCookie('token');  //清除token
      //     M.delCookie('realnameAuthed');  //清除realnameAuthed
      //     M.delCookie('userId');  //清除userId
      //     M.delCookie('userMobile');  //清除userMobile
      //     M.delCookie('atskMobile');  //清除atskMobile
      //     M.delCookie('userName');  //清除userName
      //     M.delCookie('userRole');  //清除userRole
      //     M.delCookie('loginBonusStatus');  //清除loginBonusStatus
      //     M.delCookie('mobileArea');  //清除mobileArea
      //     window.location.href = "/";
      //     if (data.code == 10000) {

      //     } else {
      //       that.$message({
      //         message: data.message,
      //         type: "error"
      //       });
      //     }
      //   }
      // });
    },
    toHome() {
      this.$router.push('/index')
    },
    // 跳转通知页
    moreNotice() {
      this.$router.push('moreNotice')
    },
    // 显示退出登录窗口
    showLogoutWin() {
      if(!this.$store.state.token) {
        this.logout()
      }else {
        // this.showLogout = false
        this.showLogout = !this.showLogout
      }
    },
    closeLogout() {
      this.showLogout = false
        // this.showLogout = !this.showLogout
    },
  },
  mounted(){

  },
  created(){
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
    .boss{
      box-shadow: 0px 2px 4px rgba(183,182,182,0.1);
      width: 100%;
      .box {
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 1200px;
        height: 72px;
        line-height: 72px;
        .logo {
          background-size: 100% 100%;
          width: 175px;
          height: 43px;
          background-image: url(./../../assets/img/kg_author_logo_blue.png);
          background-size: 100% 100%;
          cursor: pointer;
        }
        .setting {
          padding-left: 75px;
          position: relative;
          font-family: MicrosoftYaHei;
          color:rgba(35,130,234,1);
          font-size: 12px;
          .logout {
            cursor: pointer;
            position: absolute;
            left: 50px;
            top: 100%;
            height: 40px;
            width: 100px;
            color: #333333;
            line-height: 40px;
            font-size: 14px;
            text-align: center;
            background: #fff;
            border: 1px solid #E6E6E6;
            &:after {
              content: '';
              position: absolute;
              bottom: 34px;
              left: 45px;
              width: 10px;
              height: 10px;
              background: #fff;
              border-left: 1px solid #E6E6E6;
              border-top: 1px solid #E6E6E6;
              transform: matrix(1, 1, -1, 1, 0, 0)
            }
            &:hover {
              color:rgba(35,130,234,1);
            }
          }
          .notice {
            position: absolute;
            top: 2px;
            right: 92%;
            i {
              color: rgba(128, 128, 128, .3);
              font-size: 40px;
              margin-right: 40px;
              cursor: pointer;
            }
          }
          .photo {
            position: absolute;
            top: 20px;
            left: 0;
            height: 34px;
            width: 55px;
            border-left: 1px solid #E6E6E6;
            .img {
              cursor: pointer;
              position: absolute;
              right: 0;
              top: 0;
              height: 100%;
              width: 34px;
              border-radius: 50%;
              .realAuthedTag{
                position: absolute;
                right: 0;
                bottom: 0;
                width:10px;
                height:10px;
              }
            }
          }
          .username {
            cursor: pointer;
            font-size: 14px;
            color: #333333;
          }
          .certified {
            margin-left: 20px;
            padding: 4px 6px;
            border: 1px solid #2382EA;
            border-radius: 12px;
          }
        }
      }
    }
  }
</style>

