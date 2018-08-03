/**
*  @description： 作者端footer组件
*  @author： zhangchenle
*  @data:  2018.6.1
*/
<template>
  <div class="footer">
    <div class="box">
      <div class="about">
        <a class="item" v-for="(item, index) in aboutList" :href="item.url" :key="'about' + index">{{item.name}}</a>
      </div>
      <div class="copyright">
        <div class="item" v-for="(item, index) in copyrightList" :key="'copyright' + index">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Footer',
  data(){
    return {
      // 关于我们链接配置
      aboutList: [
        {
          name: 'KG.com',
          url: 'https://www.kg.com/index/list.html'
        },
        {
          name: '关于我们',
          url: 'https://www.kg.com/about/list.html'
        },
        {
          name: '联系我们',
          url: 'https://www.kg.com/about_contact/list.html'
        },
        {
          name: '版权说明',
          url: 'https://www.kg.com/about_state/list.html'
        },
        {
          name: '专栏申请协议',
          url: 'https://www.kg.com/about_column/list.html'
        }
      ],
      // 版权信息配置
      copyrightList: ['蜀ICP备18000636号-1', '举报电话：028-86056123', '举报邮箱：maxin@kg.com']
    }
  }
}
</script>

<style lang="less" scoped>
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    .box {
      margin: 0 auto;
      width: 1200px;
      .about {
        display: flex;
        justify-content: center;
        margin-bottom: 15px;
      }
      .copyright {
        display: flex;
        justify-content: center;
        margin-bottom: 29px;
      }
      .item {
          margin: 0 5px;
          color:rgba(155,155,155,1);
      }
    }
  }
</style>
