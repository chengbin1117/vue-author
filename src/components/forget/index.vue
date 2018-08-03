/**
*  @description： 作者端忘记密码组件
*  @author： zhangchenle
*  @data:  2018.6.2
*/
<template>
  <div class="forget">
    <Dialog v-if="showBlockMask" @close="close" :width="width" >
      <div class="mask-title">验证</div>
      <Block  class="mask-block" @sendMsg="sendMsg" :ncBlock="ncBlock"></Block>
    </Dialog>
    <Header></Header>
    <div class="main">
      <div class="box">
        <div class="title">找回密码</div>
        <div class="phone">
          <Prefix :prefix="mobileArea" @setMobileArea="setMobileArea"></Prefix>
          <input v-model="userMobile" type="number" placeholder="手机号" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')">
          <div class="error">{{mobileError}}</div>
        </div>
        <div class="password">
          <input v-model="checkCode" type="number" placeholder="短信验证码">
          <div v-if="showCountdown" class="tips">{{time}}秒后重发</div>
          <div class="tips" @click="getCheckCode" v-else>获取验证码</div>
          <div class="error">{{checkCodeError}}</div>
        </div>
        <div class="password">
          <input v-model="password" type="password" placeholder="新密码">
          <div class="error">{{passwordError}}</div>
        </div>
        <div class="password">
          <input v-model="confirmPassword" type="password" placeholder="确认密码">
          <div class="error">{{confirmPasswordError}}</div>
        </div>
        <div class="btn-confirm" @click="confirm">确认</div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Dialog from "@/components/common/Dialog"
import Block from "@/components/common/Block"
import Header from '@/components/apply/Header'
import Prefix from '@/components/apply/Prefix'
import Footer from '@/components/home/Footer.vue'
import Common from '@/assets/js/common'
import Verification from "@/assets/js/util/verification"

export default {
  name: 'Forget',
  components: { Dialog, Block, Header, Prefix, Footer },
  data(){
    return {
      // 发送短信验证码需要的滑块参数
      width: '400px',
      ncBlock: {
        platform: "3",
        session: '',
        sig: '',
        token: '',
        scene: ''
      },
      mobileArea: '86', // 手机前缀
      userMobile: '', // 手机号码
      checkCode: '', // 短信验证码
      password: '', //新密码
      confirmPassword: '', //确认密码
      showCountdown: false, // 是否显示倒计时
      time: 90, // 倒计时的时间
      showBlockMask: false, // 是否显示滑块
      showBlockMask: false, // 是否显示滑块
      mobileError: '', // 手机错误提示
      checkCodeError: '', // 验证码错误提示
      nicknameError: '', // 昵称错误提示
      passwordError: '', // 密码错误提示
      confirmPasswordError: '' // 确认密码错误提示
    }
  },
  // 输入监听
  watch: {
    // 手机号码输入监听
    userMobile(newValue, oldValue){
      if(!newValue) {
        this.mobileError = "请输入手机号"
      } else {
        if(this.mobileArea === '86') {
          if(Verification.validateChinaPhone(newValue)) {
            this.mobileError = ''
          }else {
            this.mobileError = '请输入正确的手机号码'
          }
        } else {
          if(Verification.validatePhone(newValue)) {
            this.mobileError = ''
          } else {
            this.mobileError = '请输入正确的手机号码'
          }
        }
      }
    },
    // 验证码输入监听
    checkCode(newValue, oldValue){
      if(!newValue) {
        this.checkCodeError = '请输入正确的验证码'
      } else {
        this.checkCodeError = ''
      }
    },
    // 密码输入监听
    password(newValue, oldValue){
      if(!newValue) {
        this.passwordError = '请设置密码'
      } else if(newValue.length<6||newValue.length>20){
          this.passwordError = '密码长度6-20位，支持数字、英文、符号'
      }else {
        this.passwordError = ''
        this.confirmPasswordError = ''
      }
    },
    // 密码确认输入监听
    confirmPassword(newValue, oldValue){
      if(!newValue) {
        this.confirmPasswordError = '请设置密码'
      } else {
        if(newValue !== this.password) {
          this.confirmPasswordError = '两次输入的密码不一致'
        }else {
          this.passwordError = ''
          this.confirmPasswordError = ''
        }
      }
    },
  },
  methods: {
    // 设置电话号码地区前缀
    setMobileArea(mobileArea) {
      this.mobileArea = mobileArea
      if(this.mobileArea === '86') {
        if(Verification.validateChinaPhone(this.userMobile)) {
          this.mobileError = ''
        }else {
          this.mobileError = '请输入正确的手机号码'
        }
      } else {
        if(Verification.validatePhone(this.userMobile)) {
          this.mobileError = ''
        } else {
          this.mobileError = '请输入正确的手机号码'
        }
      }
    },
    // 获取验证码
    getCheckCode() {
      // 显示验证码滑块
      if(!this.userMobile){
        this.mobileError = '请输入手机号'
      }else {
        if(!this.mobileError) {
          this.showBlockMask = true;
        }
      }
    },
    close() {
      // 隐藏验证码滑块
      this.showBlockMask = false;
    },
    // 显示倒计时
    startCountdown() {
      this.showCountdown = true
      let timer = setInterval(() => {
        this.time--;
        if(this.time==0) {
          this.showCountdown = false
          this.time = 90;
          clearInterval(timer)
        }
      }, 1000)
    },
    // 重置滑块
    resetBlock() {
      this.ncBlock.session = ''
      this.ncBlock.sig = ''
      this.ncBlock.token = ''
      this.ncBlock.scene = ''
    },
    // 发送短信
    sendMsg() {
      let that = this
      let data = Object.assign({
        verIfy: this.userMobile,
        mobileArea: this.mobileArea,
        valiDation: this.valiDation
      }, this.ncBlock)
      that.close() // 关闭蒙层
      that.startCountdown() // 开始倒计时
      that.resetBlock() // 重置滑块
      this.ajax({
        url: "/common/sendSmsCode",
        data,
        success(data) {
          if(data.code === "10000") {
            // 发送短信成功
          } else {
            // 发送短信失败
            this.$message({
              type: 'error',
              message: "发送短信失败"
            })
          }
        }
      })
    },
    // 确认
    confirm() {
      let errorFlag = false;
      if (this.userMobile === '') {
        this.mobileError = '请输入手机号'
        errorFlag = true
      }
      if (this.checkCode === '') {
        this.checkCodeError = '请输入正确的验证码'
        errorFlag = true
      }
      if (this.password === '') {
        this.passwordError = '请设置密码'
        errorFlag = true
      }
      if (this.confirmPassword === '') {
        this.confirmPasswordError = '请设置密码'
        errorFlag = true
      }
      if(this.mobileError || this.checkCodeError || this.passwordError || this.confirmPasswordError) {
        errorFlag = true
      }
      if(errorFlag) return
      let data = {
        verIfy: this.userMobile,
        code: this.checkCode,
        newPwd: this.password,
        confirmPassword: this.confirmPassword
      }
      this.ajax({
        url: '/login/chckCodePwd',
        data,
        success: data => {
          if(data.code === "10000") {
            this.$message({
              type: 'success',
              message: '恭喜你，密码设置成功！'
            })
            setTimeout(() => {
              this.$router.push('/login') // 注册成功，跳转到登录页面
            }, 1000)
          } else {
            // 发送短信失败
            this.$message({
              type: 'error',
              message: data.message
            })
          }
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
  .forget {
    padding-top: 72px;
    padding-bottom: 100px;
    position: relative;
    min-height: 100%;
    .main {
      margin: 62px auto 0;
      padding-bottom: 100px;
      position: relative;
      width: 1200px;
      min-height: 100%;
      .box {
        margin: 60px auto 0;
        width: 300px;
        vertical-align: middle;
        .title {
          text-align: center;
          color: #333333;
          font-size: 24px;
          font-family: MicrosoftYaHei;
        }
        .phone {
          position: relative;
          margin-top: 45px;
          padding: 0 13px 0 67px;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          color: #333;
          border-bottom: 1px solid #EBEBEB;
          input {
            width: 100%;
            height: 100%;
            border: none;
            transform: translateY(-2px)
          }
        }
        .password {
          position: relative;
          margin-top: 20px;
          padding: 0 93px 0 13px;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          color: #333;
          border-bottom: 1px solid #EBEBEB;
          input {
            width: 100%;
            height: 100%;
            border: none;
            transform: translateY(-2px)
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
            color: #2382EA;
            text-align: right;
            &:hover {
              color: rgba(35,130,234,.7);
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
          color: #FC5A5D;
          font-size: 12px;
        }
      }
      .btn-confirm {
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
  }
</style>
