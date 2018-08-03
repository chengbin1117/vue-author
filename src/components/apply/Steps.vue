/**
*  @description： 申请专栏步骤组件
*  @author： zhangchenle
*  @data:  2018.6.4
*/
<template>
  <div class="steps">
    <div v-for="(item, index) in steps" class="item" :class="{active: item.active, }" :key="'step' + index">
      <span>{{item.title}}</span>
      <div class="stepno">{{item.stepno}}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Steps',
  props: {
    steps: {}
  }
}
</script>

<style lang="less" scoped>
  .steps {
    padding: 20px 0;
    display: flex;
    justify-content: center;
    height: 80px;
    .item {
      margin-right: 20px;
      padding-left: 190px;
      position: relative;
      line-height: 40px;
      text-align: right;
      .stepno {
        position: absolute;
        left: 130px;
        top: 0;
        width: 40px;
        height: 40px;
        text-align: center;
        color: #fff;
        font-size: 24px;
        background: #E6E6E6;
        border-radius: 50%;
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 20px;
        width: 110px;
        border: 1px dashed #E6E6E6;
      }
    }
    .item-first {
      padding-left: 60px;
      &::before {
        display: none;
      }
      .stepno {
        left: 0;
      }
    }
    .active {
      color: #2382EA;
      .stepno {
        background: #2382EA;
      }
      &::before {
        border: 1px dashed #2382EA;
      }
    }
  }
</style>
