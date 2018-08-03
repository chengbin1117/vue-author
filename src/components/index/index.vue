/**
*  @description： 作者端首页
*  @author： 杨玉梅
*  @data:  2018.5.30
*/
<template>
    <div class="index">
      <div class="top">
        <div class="baseData">
          <div>
            <p><router-link to ="fansData">粉丝总数</router-link></p>
            <router-link to ="fansData"><p>{{baseData.fansTotalNum}}</p></router-link>
          </div>
          <div>
            <p><router-link to ="income">昨日收益(TV)</router-link></p>
            <router-link to ="income"><p>{{baseData.amountYesterday	}}</p></router-link>
          </div>
          <div>
            <p><router-link to ="income">累计收益(TV)</router-link></p>
            <router-link to ="income"><p>{{baseData.amountTotal}}</p></router-link>
          </div>
        </div>
        <div class="publish">
          <router-link to="publishArticle"><el-button><i class="iconfont icon-bianji1"></i>发布文章</el-button></router-link>
          <router-link to="publishVideo"><el-button><i class="iconfont icon-if_ic_video_collecti"></i>发布视频</el-button></router-link>
        </div>
      </div>
      <div  v-if="noticeData.length != 0" class="noticeList">
        <div class="title" v-if="noticeData.length != 0">
          <span style="font-size: 18px;color: #2382ea;">公告</span>
          <router-link to="moreNotice" v-if="more > 8"><span>更多</span></router-link>
        </div>
<!--
        <ul class="list">
          <li v-for="(item, index) in noticeData.data" :key="index">
            <router-link :to="'noticeDetail?id='+item.id"><span>{{item.title}}</span></router-link>
            <span class="time">{{item.addTime}}</span>
          </li>
        </ul>-->

        <div class="content" v-if="noticeData.length != 0" v-for="(item, index) in noticeData" :key="index">
          <router-link :to="'noticeDetail?id='+item.id"> <p class="title">{{item.title}}</p></router-link>
          <p class="time">{{item.addTime}}</p>
        </div>
      </div>
<!--
      <div class="emptyBox" v-if="noticeData.total === 0"></div>
-->
      <div class="no-list"  v-if="noticeData.length == 0">
        <div class="no-list-img">
        </div>
        <div class="no-list-text">
          暂无数据
        </div>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      params: {
        currentPage:1,
        pageSize:10
      },
      noticeData: [],
      baseData: {
        fansTotalNum:0,
        amountYesterday:'0.000',
        amountTotal:'0.000'
      },
      more: '',
      inviteShow:true
    }
  },
  methods: {
    getNoticeData () {
      var vm = this;
      this.ajax({
        type: 'post',
        url: '/notice/getNoticeInfo',
        data: this.params,
        success: function (data) {
        if(data.code == 10000) {
            vm.more=data.responseBody.total
            if(data.responseBody.data.length<8){
              vm.noticeData = data.responseBody.data;
            }else {
              for(let i=0;i<8;i++){
                vm.noticeData.push(data.responseBody.data[i])
              }
            }

        }
        }
      })
    },
    getBaseData () {
      var vm = this;
      this.ajax({
        type: 'post',
        url: '/index/getDataStatistics',
        success: function (data) {
          if(data.code == 10000) {
            vm.baseData.fansTotalNum = data.responseBody.fansTotalNum;
            vm.baseData.amountYesterday = data.responseBody.amountYesterday;
            vm.baseData.amountTotal = data.responseBody.amountTotal;

          }
        }
      })
    }
  },
  created () {
    this.getNoticeData()
    this.getBaseData()
  }
}
</script>
<style lang="less" scoped>
.index {
  font-family:'MicrosoftYaHei';
  margin-left: 36px;
  .top{
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    .baseData{

      display: flex;
      justify-content: space-around;
      background:rgba(255,255,255,1);
      border-radius:10px;
      /*margin-left: 5px;*/
      margin-right: 5px;
      box-shadow:-2px 0px 4px  rgba(183,182,182,0.1) ,2px 0px 4px  rgba(183,182,182,0.1) ,0px 2px 4px  rgba(183,182,182,0.1) ,0px -2px 4px  rgba(183,182,182,0.1)  ;    .title{
      padding: 20px 0;
      .titil-earn{
        cursor: pointer;
      }
      .titil-time{
        cursor: pointer;
      }
    }
      /*border: 1px solid rgba(183,182,182,0.1);*/
      padding: 28px 0;
      width: 100%;
      justify-content: space-around;
      text-align: center;
      div {
        border-right: 1px solid #E6E6E6;
        margin-top: 13px;
        width: 33%;
        text-align: center;
        &:last-child{
          border-right: none;
        }
        p{
          &:first-child {
          font-size:16px;
          font-family:'MicrosoftYaHei';
          color:rgba(116,116,116,1);
          a{
            color: rgba(116,116,116,1);
            &:hover {
              color: #2382EA;
            }
          }
          margin-bottom: 26px;
          }
          &:last-child {
            font-size:30px;
            font-family:'Poppins-Medium';
            color:rgba(51,51,51,1);
          }
          &:hover {
            color: #2382EA;
          }
        }
      }
    }
    .publish{
      margin-left: 40px;
      display: inline-flex;
      flex-direction: column;
      justify-content: space-between;
      .iconfont{
        font-size: 22px;
        margin-right: 7px;
      }
      .el-button{
        width:226px;
        height:84px;
        color: #fff;
        background-color: rgba(35,130,234,1);
        border-color: rgba(35,130,234,1);
        &:hover {
          background-color: rgba(35,130,234,0.7);
          border-color: rgba(35,130,234,0.7);
        }
        border-radius:10px;
        span {
          font-size:16px;
          font-family:'MicrosoftYaHei';
          color:rgba(255,255,255,1);
        }
      }
    }
  }
  .noticeList{
    min-height: 470px;
    padding: 30px 30px 36px 30px;
    background:rgba(255,255,255,1);
    border-radius:10px;
    box-shadow:-2px 0px 4px  rgba(183,182,182,0.1) ,2px 0px 4px  rgba(183,182,182,0.1) ,0px 2px 4px  rgba(183,182,182,0.1) ,0px -2px 4px  rgba(183,182,182,0.1)  ;
    text-align: left;
    .title{
      display:flex;
      justify-content: space-between;
      span{
        font-family:MicrosoftYaHei;
        color:rgba(35,130,234,1);
        &:first-child{
          font-size:18px;
        }
        &:last-child {
          font-size:12px;
          float: right;
        }
      }
    }
    .list {
      margin-top: 30px;
      li {
        margin-bottom: 30px;
        span{
          &:first-child {
            display: inline-block;
            width: 760px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            font-size:16px;
            color:rgba(51,51,51,1);
            &:hover{
              cursor: pointer;
              color: #2382EA;
            }
          }
        }
        .time{
          float: right;
          font-size:14px;
          color:rgba(155,155,155,1);
          line-height: 25px;
        }
      }
    }
    .content{
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .time{
      font-size:14px;
      color:rgba(155,155,155,1);
        font-family:MicrosoftYaHei;
        cursor: pointer;
    }
      .title{
        font-size:16px;
        font-family:MicrosoftYaHei;
        color:rgba(51,51,51,1);
        &:hover{
          color: #2382EA;
        }
      }
    }
  }
  .no-list{
    padding: 152px 0px 230px 0px;
    font-size: 14px;
    font-family: 'MicrosoftYaHei';
    color: #333333;
    .no-list-img{
      height: 157px;
      width: 151px;
      margin: 0 auto;
      background-image: url("https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/dataNull.png");
      background-size: 100% 100%;
    }
    .no-list-text{
      text-align: center;
      padding-top:67px ;
      font-size:14px;
      font-family:MicrosoftYaHei;
      color:rgba(51,51,51,1);
    }
  }
}
</style>
