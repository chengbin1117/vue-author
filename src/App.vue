/**
*  @description： 作者端应用组件
*  @author： zhangchenle
*  @data:  2018.6.1
*/
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style lang="less" scoped>
  #app {
    position: relative;
    height: 100%;
  }
</style>
