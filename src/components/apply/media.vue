/**
*  @description： 作者端申请媒体专栏资料填写组件
*  @author： zhangchenle
*  @data:  2018.6.2
*/
<template>
  <div class="media">
    <Header></Header>
    <div class="main">
      <Steps :steps="steps"></Steps>
      <div class="box">
        <ColumnInfo></ColumnInfo>
        <OperatorInfo class="operator-info" :type="'media'"></OperatorInfo>
        <OtherInfo :type="'media'"></OtherInfo>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/apply/Header'
import Steps from '@/components/apply/Steps'
import ColumnInfo from '@/components/apply/ColumnInfo'
import OperatorInfo from '@/components/apply/OperatorInfo'
import OtherInfo from '@/components/apply/OtherInfo'
import Footer from '@/components/home/Footer'

export default {
  name: 'Media',
  components: { Header, Steps, ColumnInfo, OperatorInfo, OtherInfo, Footer },
  data() {
    return {
      // 步骤
      steps: [{
        stepno: '1', // 步骤序号
        title: '注册账号', // 步骤标题
        active: true // 步骤是否激活（已进行）
      },{
        stepno: '2',
        title: '选择类型',
        active: true
      },{
        stepno: '3',
        title: '填写资料',
        active: true
      }]
    }
  }
}
</script>

<style lang="less" scoped>
  .media {
    padding-top: 72px;
    padding-bottom: 100px;
    position: relative;
    min-height: 100%;
    .main {
      margin: 62px auto 100px;
      width: 1200px;
      padding-bottom: 100px;
      position: relative;
      min-height: 100%;
      .box {
        margin: 60px auto 0;
        width: 520px;
        .operator-info {
          margin-top: 75px;
        }
      }
    }
 }
</style>
