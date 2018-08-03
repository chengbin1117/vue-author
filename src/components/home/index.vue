/**
*  @description： 作者端应用组件
*  @author： zhangchenle
*  @data:  2018.6.1
*/
<template>
  <div class="container">
    <Header></Header>
    <div class="main">
      <SideBar></SideBar>
      <Main></Main>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/home/Header.vue'
import SideBar from '@/components/home/SideBar.vue'
import Main from '@/components/home/Main.vue'
import Footer from '@/components/home/Footer.vue'

export default {
  name: 'App',
  components: { Header, SideBar, Main, Footer }
}
</script>

<style lang="less" scoped>
  .mask{
    width:100%;
    height:100%;
    position: fixed;
    top:0px;
    background:rgba(0,0,0,0.7)
  }
  .inviteModal{
    width:880px;
    height:830px;
    background:#fff;
    position: absolute;
    top:0px;
    left:0px;
    right:0px;
    bottom:0px;
    margin:auto;
  }
.container {
  padding-top: 72px;
  padding-bottom: 100px;
  position: relative;
  min-height: 100%;
  .main {
    margin: 0 auto;
    padding-left: 194px;
    padding-bottom: 100px;
    position: relative;
    width: 1200px;
    min-height: 100%;
  }
}
</style>
