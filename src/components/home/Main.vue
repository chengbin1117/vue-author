/**
*  @description： 作者端main组件
*  @author： zhangchenle
*  @data:  2018.6.1
*/
<template>
  <div class="content">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'Main'
}
</script>

<style lang="less" scoped>
  .content {
    padding: 36px 0 36px 36px;
    overflow: visible;
    min-height: 750px;
  }
</style>
