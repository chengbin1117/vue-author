/**
*  @description： 作者端申请专栏进度组件
*  @author： zhangchenle
*  @data:  2018.6.2
*/
<template>
  <div class="progress">
    <Header></Header>
    <div class="main">
      <div class="title">申请进度</div>
      <div class="box">
        <div class="item">
          <div class="item-title">申请类型</div>
          <div class="item-content">{{applyType}}</div>
        </div>
        <div class="item">
          <div class="item-title">提交时间</div>
          <div class="item-content">{{applyColumnTime}}</div>
        </div>
        <div class="item">
          <div class="item-title">审核状态</div>
          <div class="item-content">{{status}}</div>
        </div>
      </div>
      <div v-if="auditStatus === 2" class="reason">不通过原因:{{refuseReason}}</div>
      <div class="tips">有疑问？<span>联系客服：028-86056123</span></div>
      <div v-if="auditStatus === 2" class="btn-resubmit" @click="resubmit">重新提交申请</div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/apply/Header'
import Footer from '@/components/home/Footer'

export default {
  name: 'Progress',
  components: { Header, Footer },
  data() {
    return {
      applyRole: '',
      applyColumnTime: '',
      auditStatus: null,
      refuseReason: ''
    }
  },
  computed: {
    applyType(){
      if(this.applyRole  === '2') return '个人'
      if(this.applyRole  === '3') return '媒体'
      if(this.applyRole  === '4') return '企业'
      if(this.applyRole  === '5') return '组织'
      return ''
    },
    status() {
      if(this.auditStatus  === 0) return '审核中'
      if(this.auditStatus  === 2) return '未通过'
      return ''
    }
  },
  methods: {
    // 重新提交申请
    resubmit() {
      this.$router.push('/apply')
    },
    // 获取申请进度信息
    getProgress() {
      this.ajax({
        url: "/column/checkProfile",
        success: data => {
          if(data.code === "10000") {
            this.applyColumnTime = data.responseBody.applyColumnTime
            this.applyRole = data.responseBody.applyRole
            this.auditStatus = data.responseBody.auditStatus
            this.refuseReason = data.responseBody.refuseReason
          } else if(data.code === "20011"){
            this.$router.push('/apply')
          } else {
            this.$message({
              type: 'error',
              message: data.message
            })
          }
        }
      })
    }
  },
  mounted() {
    this.getProgress()
  }
}
</script>

<style lang="less" scoped>
  .progress {
    padding-top: 72px;
    padding-bottom: 100px;
    position: relative;
    min-height: 100%;
    .main {
      margin: 160px auto 0;
      width: 1200px;
      padding-bottom: 100px;
      position: relative;
      min-height: 100%;
      .title {
        padding-left: 20px;
        position: relative;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color:rgba(51,51,51,1);
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 6px;
          height: 8px;
          width: 8px;
          background: #EBEBEB;
          border-radius: 50%;
        }
      }
      .box {
        margin-top: 50px;
        display: flex;
        .item {
          padding: 20px 0 25px;
          flex-grow: 1;
          text-align: center;
          border-left: 1px solid #E6E6E6;
          .item-title {
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color:rgba(102,102,102,1);
          }
          .item-content {
            margin-top: 35px;
            font-size: 24px;
            font-family: MicrosoftYaHei;
            color:rgba(51,51,51,1);
          }
          &:first-child {
            border-left: none;
          }

        }
      }
      .reason, .tips {
        margin-top: 50px;
        text-align: center;
        color: #666666;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        span {
          color: #2382EA;
        }
      }
      .reason {
        color: #FC5A5D;
      }
      .btn-resubmit {
        margin: 90px auto 0;
        width: 170px;
        height: 40px;
        line-height: 40px;
        background:rgba(35,130,234,1);
        color: #fff;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          background: rgba(35,130,234, .7);
        }
      }
    }
  }
</style>
