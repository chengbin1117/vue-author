/**
*  @description： 移动滑块组件
*  @author： zhangchenle
*  @data:  2018.6.5
*/
<template>
  <div>
    <div class="ln">
      <div id="block"></div>
    </div>
    <input type='hidden' v-model="ncBlock.csessionid" name='csessionid'/>
    <input type='hidden' v-model="ncBlock.sig" name='sig'/>
    <input type='hidden' v-model="ncBlock.token" name='token'/>
    <input type='hidden' v-model="ncBlock.scene" name='scene'/>
  </div>
</template>

<script>

export default {
  name: 'Block',
  props: {
    ncBlock: {}
  },
  data() {
    return {}
  },
  methods: {
    // 初始化阿里云滑块
    initAliBlock() {
      let nc = new noCaptcha()
      let nc_appkey = "FFFF00000000017B0D9D"; // 应用标识,不可更改
      var u = navigator.userAgent;
		  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      // let nc_scene = "nc_login";// 场景,不可更改
      	var nc_scene = isiOS || isAndroid ? "nc_register_h5":"nc_login";
      let nc_token = [nc_appkey, new Date().getTime(), Math.random()].join(":");
      nc.init({
        renderTo: '#block', //渲染到该DOM ID指定的Div位置
        appkey: nc_appkey,
        scene: nc_scene,
        token: nc_token,
        // trans:{"key1":"code0"},//测试用，特殊nc_appkey时才生效，正式上线时请务必要删除；code0:通过;code100:点击验证码;code200:图形验证码;code300:恶意请求拦截处理
        callback: data => {
          //console.log(data)
          // 校验成功回调
          this.ncBlock.session = data.csessionid
          this.ncBlock.sig = data.sig
          this.ncBlock.token = nc_token
          this.ncBlock.scene = nc_scene
          // 发送短信
          this.send()
        }
      }); // 初始化滑块
    },
    // 发送短信
    send() {
      this.$emit('sendMsg')
    }
  },
  mounted () {
    this.initAliBlock() // 初始化滑块
  }
}
</script>

<style lang="less">
  .nc_wrapper {
    width: 100%!important;
  }
  .btn_slide {
    height: 100%!important;
  }
  .btn_ok {
    height: 100%!important;
  }
</style>
