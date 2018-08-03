/**
*  @description： 移动滑块组件
*  @author： zhangchenle
*  @data:  2018.6.5
*/
<template>
  <div class="mask">
    <div class="mask-box" :style="{width:width}">
      <div class="close iconfont icon-guanbi" title="关闭" @click="close"></div>
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Dialog',
  data() {
    return {
    }
  },
  props:{
    width:{}
  },
  methods: {
    close() {
      this.$emit('close')
    }
  },
  
}
</script>

<style lang="less" scoped>
.mask {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background:rgba(0, 0, 0, .3);
  z-index: 1999;
  .mask-box {
    position: relative;
    margin: 0 auto;
    // padding: 21px 35px 21px;
    width: 100%;
    background: #fff;
    border-radius: 4px;
    box-shadow: 20px 17px 43px rgba(229,227,227,0.27);
    .close {
      position: absolute;
      top: 26px;
      right: 22px;
      width: 13px;
      height: 13px;
      line-height: 13px;
      font-size: 14px;
      text-align: center;
      color: #9B9B9B;
      &:hover {
        cursor: pointer;
        font-size: 16px;
      }
    }
  }
}
</style>
