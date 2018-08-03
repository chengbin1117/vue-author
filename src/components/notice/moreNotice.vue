/**
*  @description： 作者端更多公告
*  @author： 杨玉梅
*  @data:  2018.5.30
*/
<template>
    <div class="moreNotice">
        <p v-if="noticeData.total != 0"><span>标题</span><span>时间</span></p>
        <ul>
            <li v-if="noticeData.total != 0" v-for="(item, index) in noticeData.data" :key="index">
                <router-link :to="'noticeDetail?id='+item.id"><span>{{item.title}}</span></router-link>
                <span class="time">{{item.addTime}}</span>
            </li>
        </ul>
        <!--<div class="emptyBox" v-if="noticeData.total === 0"></div>-->
        <div class="no-list"  v-if="noticeData.total == 0">
        <div class="no-list-img">
        </div>
        <div class="no-list-text">
          暂无数据
        </div>
      </div>
        <el-pagination
        :page-size="10"
        :pager-count="5"
        layout="prev, pager, next"
        :current-page ="params.currentPage"
        @current-change="pageChange"
        :total="noticeData.total"
        v-if="noticeData.total!=0">
        </el-pagination>
    </div>
</template>
<script>
export default {
  data() {
    return {
      params: {
        currentPage: 1,
        pageSize: 10
      },
      noticeData: {}
    };
  },
  methods: {
    getNotices() {
      var vm = this;
      vm.ajax({
        type: "post",
        url: "/notice/getNoticeInfo",
        data: this.params,
        success: function(data) {
          if (data.code == 10000) vm.noticeData = data.responseBody;
        }
      });
    },
    pageChange(e) {
        this.params.currentPage = e;
        this.getNotices()
    }
  },
  created() {
    this.getNotices();
  }
};
</script>
<style lang="less" scoped>
.moreNotice {
  overflow: hidden;
  text-align: left;
  padding: 30px;
  font-family: "MicrosoftYaHei";
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  box-shadow:-2px 0px 4px  rgba(183,182,182,0.1) ,2px 0px 4px  rgba(183,182,182,0.1) ,0px 2px 4px  rgba(183,182,182,0.1) ,0px -2px 4px  rgba(183,182,182,0.1)  ;    .title{
  padding: 20px 0;
  .titil-earn{
    cursor: pointer;
  }
  .titil-time{
    cursor: pointer;
  }
}

  // box-shadow:0px 20px 10px rgba(183,182,182,0.1);
  p {
    font-size: 14px;
    color: rgba(155, 155, 155, 1);
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(230, 230, 230, 1);
    span {
      &:last-child {
        float: right;
        margin-right: 50px;
      }
    }
  }
  ul {
    li {
      padding: 28px 0;
      border-bottom: 1px solid rgba(230, 230, 230, 1);
      span {
        &:first-child {
          display: inline-block;
          width: 760px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 16px;
          color: rgba(51, 51, 51, 1);
          &:hover {
            cursor: pointer;
            color: #2382ea;
          }
        }
      }
      .time {
        color: #9b9b9b;
        float: right;
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
<style lang="less">
.el-pagination {
  float: right;
  margin-top: 40px;
  color: rgba(51, 51, 51, 1);
}
.moreNotice {
  .el-pager li {
    font-size: 12px;
  }
}
</style>



