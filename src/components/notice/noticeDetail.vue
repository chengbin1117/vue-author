/**
*  @description： 作者端公告详情
*  @author： 杨玉梅
*  @data:  2018.5.31
*/
<template>
    <div class="noticeDetail">
        <p>{{noticeData.title}}</p>
        <p>{{noticeData.addTime}}</p>
        <div class="detail" v-html="noticeData.info">

        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      params: {
        id: ""
      },
      noticeData: {}
    };
  },
  methods: {
    getNoticeDetail() {
      var vm = this;
      vm.ajax({
        type: "post",
        url: "/notice/getNoticeById",
        data: this.params,
        success: function(data) {
//            console.log(data.responseBody)
          if (data.code == 10000) vm.noticeData = data.responseBody;
        }
      });
    }
  },
  created() {
    this.params.id = window.location.href.split("id=")[1];
    this.getNoticeDetail();
  }
};
</script>

<style lang="less" scoped>
.noticeDetail {
  text-align: left;
  padding: 30px;
  font-family: "MicrosoftYaHei";
  border-radius:10px;
  box-shadow: 0px 2px 4px rgba(183,182,182,0.1), 2px 0px 4px rgba(183,182,182,0.1), 0px -2px 4px rgba(183,182,182,0.1), -2px 0px 4px rgba(183,182,182,0.1);
  p {
    &:first-child {
      font-family: "MicrosoftYaHei-Bold";
      font-size: 22px;
      color: rgba(51, 51, 51, 1);
      font-weight: bold;
    }
    &:nth-child(2) {
      padding: 15px 0 30px 0;
      color: #9b9b9b;
      color: rgba(155, 155, 155, 1);
      font-size: 14px;
    }
  }

}
</style>
<style lang="less">
  .detail {
    font-family:MicrosoftYaHei;
    p {
      font-size: 16px;
      font-weight: normal;
      color:rgba(51,51,51,1);
      line-height:24px;
      margin-bottom:30px;
    }
    img{
      border-radius:4px;
      display: inline-block;
    }
    h1,h2,h3,h4,h5 {
      margin-bottom:30px;
    }
  }
</style>
<style lang="less">
.noticeDetail {
    img {
      display: inline-block;
    }
}

</style>

