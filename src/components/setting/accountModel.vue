<template>
    <div class="accountSetting">
        <div class="blockbox">
            <div v-if="data.mobIle">
                <p>{{data.userMobile}}</p>
                <p>绑定手机</p>
                <el-button @click="showNotice" type="primary">修改</el-button>
                <i class="iconfont icon-shouji"></i>
            </div>
            <div v-else>
                <p>暂未绑定手机号</p>
                <p>绑定手机</p>
                <el-button @click="showNotice" type="primary">去绑定</el-button>
                <i class="iconfont icon-shouji"></i>
            </div>
            <!--  -->
            <div>
                <p v-if="data.setPassword">已设置</p>
                <p v-else>未设置</p>
                <p>登录密码</p>
                <el-button  v-if="data.setPassword" @click="showNotice" type="primary">修改</el-button>
                <el-button  v-else @click="showNotice" type="primary">去设置</el-button>
                <i class="iconfont icon-mima"></i>
            </div>
        </div>
        <div class="blockbox">
            <div v-if="data.realnameAuthed">
                <p>已认证</p>
                <p>实名认证</p>
                <el-button @click="showNotice" type="primary">查看</el-button>
                <i class="iconfont icon-shimingrenzheng2shurushenfenzhenghaofuzhi"></i>
            </div>
            <div v-else>
                <p>未认证</p>
                <p>实名认证</p>
                <el-button @click="showNotice" type="primary">去认证</el-button>
                <i class="iconfont icon-shimingrenzheng2shurushenfenzhenghaofuzhi"></i>
            </div>
            <div v-if="data.tradepasswordSet">
                <p>已设置</p>
                <p>交易密码</p>
                <el-button @click="showNotice" type="primary">修改</el-button>
                <i class="iconfont icon-zhifu"></i>
            </div>
            <div v-else>
                <p>未设置</p>
                <p>交易密码</p>
                <el-button @click="showNotice" type="primary">去设置</el-button>
                <i class="iconfont icon-zhifu"></i>
            </div>
        </div>
    </div>
</template>

<script>
import C from "./../../assets/js/config.js";
export default {
  data () {
      return {
          data: {
              realnameAuthed: 1, // 默认已实名认证
              mobIle: 1, // 默认已绑定手机号
              setPassword: 1, // 默认已设置密码
              tradepasswordSet: 1, // 默认已设置交易密码
          }
      }
  },
  methods: {
    showNotice() {
      this.$alert(`<p>请前往KG.com操作</p>`, "提示", {
        dangerouslyUseHTMLString: true,
        customClass: 'settingAccountDialog',
        confirmButtonText: '确认前往'
      }).then(() => {
         window.open(C.mainNameHost+'/personal#account')
        }).catch(() => {

        });;
    },
    getPersonDeatail () {
      var vm = this;
      this.ajax({
        type: 'post',
        // data:this.params,
        url: '/set/getAccountSet',
        success: function (data) {
          if(data.code == 10000) {
            vm.data = data.responseBody
            // console.log('vmm', vm.data)
          }
        }
      })
    },
  },
  created () {
    this.getPersonDeatail()
  }
};
</script>
<style lang="less" scoped>
.accountSetting{
    overflow: hidden;
    text-align: left;
    .blockbox{
        width: 100%;
        div {
            font-family:'MicrosoftYaHei';
            position: relative;
            float: left;
            width: 45%;
            height: 200px;
            padding: 32px 36px 36px 99px;
            background:rgba(255,255,255,1);
            border-radius:10px;
            box-shadow:0px 20px 10px rgba(183,182,182,0.1);
            margin-right: 37px;
            margin-bottom: 36px;
            p{
                &:first-child{
                    font-size:24px;
                    color:rgba(51,51,51,1);
                }
                &:nth-child(2) {
                    font-size: 14px;
                    color:rgba(102,102,102,1);
                    margin-top: 15px;
                    margin-bottom: 30px;
                }
            }
            .el-button--primary{float: right;width: 120px;}
            .iconfont {
                font-size: 36px;
                position: absolute;
                top: 37px;
                left: 37px;
            }
        }
    }


}
</style>
<style lang="less">
.settingAccountDialog{
    text-align:center;
    width:400px;
    height: 205px;
    .el-message-box__header{
        border-bottom:1px solid rgba(235,235,235,1);
    }
    .el-message-box__title{position: relative;}
    .el-message-box__title::after{
        content: '';
        background:#2382EA;
        display: inline-block;
        position: absolute;
        width:68px;
        height:2px;
        bottom: -11px;
        left: 150px;
    }
    p{
        margin: 25px 0;
        font-size:14px;
        font-family:'MicrosoftYaHei';
        color:rgba(51,51,51,1);
    }
    .el-message-box__btns{
        text-align:center;
        .el-button{
            width: 150px;
            height: 40px;
        }
    }
}
</style>

