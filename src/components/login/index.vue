/**
*  @description： 作者端登录组件
*  @author： zhangchenle
*  @data:  2018.6.1
*/
<template>
  <div class="login">
      <img src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/inlet/logo2.png"  class="only-logo" @click="toIndex">
    <Dialog v-if="showBlockMask" @close="close" :width="width">
        <div class="mask-title">验证</div>
        <Block  class="mask-block" @sendMsg="sendMsg" :ncBlock="ncBlock"></Block>
    </Dialog>
    <section class="box">
      <div class="title">登录</div>
      <template v-if="isAccountLogin">
        <div class="phone phone-account">
          <input type="number" v-model="userMobile"  placeholder="手机号" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')">
          <div class="error">{{accountError}}</div>
        </div>
        <div class="password">
          <input v-model="userPassword"  type="password" placeholder="密码" id="password">
          <div class="tips" @click="passwordHandler">忘记密码？</div>
          <div class="error">{{passwordError}}</div>
        </div>
      </template>
      <template v-if="!isAccountLogin">
        <div class="phone">
          <Prefix :prefix="mobileArea" @setMobileArea="setMobileArea"></Prefix>
          <input v-model="userMobile" type="number" placeholder="手机号" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')">
          <div class="error">{{mobileError}}</div>
        </div>
        <div class="password">
          <input type="number" autocomplete="off"  v-model="checkCode" placeholder="验证码">
          <div v-if="showCountdown" class="tips">{{time}}秒后重发</div>
          <div class="tips" @click="passwordHandler" v-else>获取验证码</div>
          <div class="error">{{checkCodeError}}</div>
        </div>
      </template>
      <el-button  class="btn-login" @click="login" :loading="loading">登录</el-button>
      <div class="btn-message" @click="changeLoginType">{{loginBtnText}}</div>
      <div class="register">还没账号？<span class="to-register" @click="toRegister">立即注册</span>
      </div>
    </section>
  </div>
</template>

<script>
import Prefix from "@/components/apply/Prefix";
import Dialog from "@/components/common/Dialog";
import Block from "@/components/common/Block";
import Verification from "@/assets/js/util/verification";
import { mapActions } from "vuex";

export default {
  name: "Login",
  components: { Prefix, Dialog, Block },
  data() {
    return {
      // 发送短信验证码需要的滑块参数
      width: '400px',
      ncBlock: {
        platform: "3",
        session: "",
        sig: "",
        token: "",
        scene: ""
      },
      mobileArea: "86", // 手机前缀
      userMobile: "", // 手机号码
      userPassword: "", // 密码
      checkCode: "", // 验证码
      valiDation: "2",
      isAccountLogin: true, // 是否是账号密码登录
      showBlockMask: false, // 是否显示滑块
      showCountdown: false, // 是否显示倒计时
      time: 90, // 倒计时的时间
      accountError: "", // 账号错误提示
      mobileError: "", // 手机错误提示
      passwordError: "", // 密码错误提示
      checkCodeError: "", // 验证码错误提示
      loading:false,
    };
  },
    computed: {
    // 登录方式按钮提示文本
    loginBtnText() {
      if (!this.isAccountLogin) return "账号密码登录";
      return "短信快捷登录";
    }
  },
  // 输入监听
  watch: {
    // 手机号码输入监听
    userMobile(newValue, oldValue) {
      if (!newValue) {
        this.accountError = "请输入手机号";
        this.mobileError = "请输入手机号";
      } else {
        if (Verification.validatePhone(newValue)) {
          this.accountError = "";
          if (this.mobileArea === "86") {
            if (Verification.validateChinaPhone(newValue)) {
              this.mobileError = "";
            } else {
              this.mobileError = "您输入的手机号有误";
            }
          } else {
            this.mobileError = "";
          }
        } else {
          this.accountError = "您输入的手机号有误";
          this.mobileError = "您输入的手机号有误";
        }
      }
    },
    // 密码输入监听
    userPassword(newValue, oldValue) {
      if (!newValue) {
        this.passwordError = "请输入密码"
      } else if (newValue) {
          if(newValue.length<6||newValue.length>20){
            this.passwordError = "密码长度6-20位,支持数字、英文、符号"
          }else {
            this.passwordError = ""
          }

      }
    },
    // 验证码输入监听
    checkCode(newValue, oldValue) {
      if (!newValue) {
        this.checkCodeError = "请输入验证码";
      } else {
        this.checkCodeError = "";
      }
    },
  },
  methods: {
    ...mapActions(["accountLogin", "mobileLogin"]),
    // 设置电话号码地区前缀
    setMobileArea(mobileArea) {
      this.mobileArea = mobileArea;
      if (this.mobileArea === "86") {
        if (Verification.validateChinaPhone(this.userMobile)) {
          this.mobileError = "";
        } else {
          this.mobileError = "请输入正确的手机号码";
        }
      } else {
        if (Verification.validatePhone(this.userMobile)) {
          this.mobileError = "";
        } else {
          this.mobileError = "请输入正确的手机号码";
        }
      }
    },
    close() {
      // 隐藏验证码滑块
      this.showBlockMask = false;
    },
    // 显示倒计时
    startCountdown() {
      this.showCountdown = true;
      let timer = setInterval(() => {
        this.time--;
        if (this.time == 0) {
          this.showCountdown = false;
          this.time = 90;
          clearInterval(timer);
        }
      }, 1000);
    },
    // 重置滑块
    resetBlock() {
      this.ncBlock.session = "";
      this.ncBlock.sig = "";
      this.ncBlock.token = "";
      this.ncBlock.scene = "";
    },
    // 发送短信
    sendMsg() {
      let that = this;
      let data = Object.assign(
        {
          verIfy: this.userMobile,
          mobileArea: this.mobileArea,
          valiDation: this.valiDation
        },
        this.ncBlock
      );
      that.close(); // 关闭蒙层
      that.startCountdown(); // 开始倒计时
      that.resetBlock(); // 重置滑块
      this.ajax({
        url: "/common/sendSmsCode",
        data,
        success(data) {
          if (data.code === "10000") {
            // 发送短信成功
          } else {
            // 发送短信失败
            this.$message({
              type: "error",
              message: "发送短信失败"
            });
          }
        }
      });
    },
    // 登录
    login() {
      let errorFlag = false;
      if (this.isAccountLogin) {
        // 账密登录
        if (this.userMobile === "") {
          this.accountError = "请输入手机号";
          errorFlag = true;
        }
        if (this.userPassword === "") {
          this.passwordError = "请输入密码";
          errorFlag = true;
        }
        if (this.accountError || this.passwordError) {
          errorFlag = true;
        }
        if (errorFlag) return;
        this.accountLogin({
          userMobile: this.userMobile,
          userPassword: this.userPassword,
          from:'login',
          that:this,
        });
      } else {
        // 短信登录
        if (this.userMobile === "") {
          this.mobileError = "请输入手机号";
          errorFlag = true;
        }
        if (this.checkCode === "") {
          this.checkCodeError = "请输入验证码";
          errorFlag = true;
        }
        if (this.mobileError || this.checkCodeError) {
          errorFlag = true;
        }
        if (errorFlag) return;
        this.mobileLogin({
          userMobile: this.userMobile,
          code: this.checkCode,
          from:'login'
        });
      }
    },
    // 切换登录方式
    changeLoginType() {
      this.isAccountLogin = !this.isAccountLogin;
    },
    // 忘记密码或获取验证码
    passwordHandler() {
      if (!this.isAccountLogin) {
        // 显示验证码滑块
        if (!this.userMobile) {
          this.mobileError = "请输入手机号";
        } else {
          if (!this.mobileError) {
            this.showBlockMask = true;
          }
        }
      } else {
        // 忘记密码
        this.$router.push("/forget");
      }
    },
    // 到注册页面
    toRegister() {
      this.$router.push("/register");
    },
    toIndex () {
      window.location.href = '/'
    }
  },
  created () {
    // 回车实现登陆
    // var vm = this;
    // document.onkeydown = function (e) {
    //    var ev = document.all ? window.event : e;
    //    if(ev.keyCode==13) {
    //      vm.login()
    //    }
    // }

  },
  mounted() {
    var vm = this;
    var password = document.getElementById('password');
    password.onkeypress=function(event){
      if(event.which === 13) {
          //点击回车要执行的事件
          vm.login()
          }
      };
  }
};
</script>

<style lang="less" scoped>
@media (min-width: 768px){
  .login {
    position: relative;
    height: 100%;
    background: #ccc;
    background-image: url("https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/authorBg.png");
    background-repeat: no-repeat;
    background-size: cover;
    .box {
      padding: 36px 50px 0;
      position: absolute;
      top: 50%;
      margin-top: -213px;
      right: 23.646%;
      height: 427px;
      width: 400px;
      background: #fff;
      box-shadow: 20px 17px 43px rgba(229, 227, 227, 0.27);
      .title {
        font-size: 24px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        text-align: center;
      }
      .phone {
        position: relative;
        margin-top: 45px;
        padding: 0 13px 0 67px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #333;
        border-bottom: 1px solid #ebebeb;
        input {
          width: 100%;
          height: 100%;
          border: none;
          transform: translateY(-2px);
          &:-webkit-autofill {
            background-color: #fff!important;
            background-image: none!important;
            color: #000;
          }
        }

      }
      .phone-account {
        padding-left: 13px;
      }
      .password {
        position: relative;
        margin-top: 20px;
        padding: 0 93px 0 13px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #333;
        border-bottom: 1px solid #ebebeb;
        input {
          width: 100%;
          height: 100%;
          border: none;
          transform: translateY(-2px);
        }
        .tips {
          padding-right: 13px;
          cursor: pointer;
          font-size: 12px;
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 93px;
          color: #2382ea;
          text-align: right;
          &:hover {
            color: rgba(35, 130, 234, 0.7);
          }
        }
        .countdown {
          position: absolute;
          right: 0;
          top: 0;
          width: 93px;
          height: 100%;
          z-index: 1;
          background: #2382ea;
          color: #fff;
          text-align: center;
          border-radius: 4px;
        }
      }
      .error {
        padding: 0 13px;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 25px;
        line-height: 25px;
        color: #fc5a5d;
        font-size: 12px;
      }
      .btn-login {
        width:100%;
        margin-top: 35px;
        height: 40px;
        // line-height: 40px;
        background: #2382ea;
        color: #fff;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          background: rgba(35, 130, 234, 0.7);
        }
      }
      .btn-message {
        margin-top: 18px;
        height: 40px;
        line-height: 40px;
        color: #2382ea;
        border: 1px solid #2382ea;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          color: rgba(35, 130, 234, 0.7);
          border: 1px solid rgba(35, 130, 234, 0.7);
        }
      }
      .register {
        margin-top: 35px;
        text-align: center;
        color: #666666;
        font-size: 14px;
        .to-register {
          cursor: pointer;
          margin-left: 5px;
          color: #2382ea;
          &:hover {
            color: rgba(35, 130, 234, 0.7);
          }
        }
      }
    }
    .mask-title {
      font-size: 20px;
      font-family: MicrosoftYaHei;
      color:rgba(51,51,51,1);
      text-align: center;
      height:60px;
      line-height:60px;
      border-bottom: 1px solid #E1E0E1;
    }
    .mask-block {
      margin:30px 30px;
    }
    .only-logo{
      z-index: 6;
      height: 35px;
      width: 135px;
      position: absolute;
      left: 99px;
      top: 30px;
      cursor: pointer;
    }
  }
}
@media (max-width: 768px){
  .login {
    position: relative;
    height: 100%;
    background: #ccc;
    background-image: url("https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/login-bg@3x.png");
    background-repeat: no-repeat;
    background-size: cover;
    .box {
      padding: 36px 30px 0;
      position: absolute;
      height: 427px;
      width: 300px;
      top: 50%;
      margin-top: -150px;
      right: 50%;
      margin-right: -150px;
      background: #fff;
      /*box-shadow: 20px 17px 43px rgba(229, 227, 227, 0.27);*/
      box-shadow:-2px 0px 30px rgba(204, 204, 204, 0.19),2px 0px 30px  rgba(204, 204, 204, 0.19) ,0px 2px 43px  rgba(204, 204, 204, 0.19) ,0px -2px 43px  rgba(204, 204, 204, 0.19)  ;
      .title {
        font-size: 24px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        text-align: center;
      }
      .phone {
        position: relative;
        margin-top: 45px;
        padding: 0 13px 0 67px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #333;
        border-bottom: 1px solid #ebebeb;
        input {
          width: 100%;
          height: 100%;
          border: none;
          transform: translateY(-2px);
          &:-webkit-autofill {
            background-color: #fff!important;
            background-image: none!important;
            color: #000;
          }
        }

      }
      .phone-account {
        padding-left: 13px;
      }
      .password {
        position: relative;
        margin-top: 20px;
        padding: 0 93px 0 13px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #333;
        border-bottom: 1px solid #ebebeb;
        input {
          width: 100%;
          height: 100%;
          border: none;
          transform: translateY(-2px);
        }
        .tips {
          padding-right: 13px;
          cursor: pointer;
          font-size: 12px;
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 93px;
          color: #2382ea;
          text-align: right;
          &:hover {
            color: rgba(35, 130, 234, 0.7);
          }
        }
        .countdown {
          position: absolute;
          right: 0;
          top: 0;
          width: 93px;
          height: 100%;
          z-index: 1;
          background: #2382ea;
          color: #fff;
          text-align: center;
          border-radius: 4px;
        }
      }
      .error {
        padding: 0 13px;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 25px;
        line-height: 25px;
        color: #fc5a5d;
        font-size: 12px;
      }
      .btn-login {
        width:100%;
        margin-top: 35px;
        height: 40px;
        // line-height: 40px;
        background: #2382ea;
        color: #fff;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          background: rgba(35, 130, 234, 0.7);
        }
      }
      .btn-message {
        margin-top: 18px;
        height: 40px;
        line-height: 40px;
        color: #2382ea;
        border: 1px solid #2382ea;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          color: rgba(35, 130, 234, 0.7);
          border: 1px solid rgba(35, 130, 234, 0.7);
        }
      }
      .register {
        margin-top: 35px;
        text-align: center;
        color: #666666;
        font-size: 14px;
        .to-register {
          cursor: pointer;
          margin-left: 5px;
          color: #2382ea;
          &:hover {
            color: rgba(35, 130, 234, 0.7);
          }
        }
      }
    }
    .mask-title {
      font-size: 20px;
      font-family: MicrosoftYaHei;
      color:rgba(51,51,51,1);
      text-align: center;
      height:60px;
      line-height:60px;
      border-bottom: 1px solid #E1E0E1;
    }
    .mask-block {
      margin:30px 30px;
    }
    .only-logo{
      z-index: 6;
      height: 43px;
      width: 166px;
      position: absolute;
      left: 99px;
      top: 28px;
      cursor: pointer;
    }
  }
}
</style>
