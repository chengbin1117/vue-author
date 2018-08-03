/**
*  @description： 作者端-内容管理-评论管理
*  @author： 杨玉梅
*  @data:  2018.5.30
*/
<template>
    <div class="comments">
        <div class="comment" v-for="(item, index) in data.data" :key="index">
            <p>
                <span>{{item.commentUserName}}</span>
                <span>评论了你的文章</span>
                <span @click="toArtcleDetail(item.articleId)">《{{item.articleTitle}}》</span>
            </p>
            <p>{{item.commentDesc}}</p>
            <p>{{item.showTime}}</p>
            <img :src="item.commentUserAvatar" class="userIcon">
        </div>
         <div class="no-list"  v-if="data.totalNumber === 0">
        <div class="no-list-img">
        </div>
        <div class="no-list-text">
          暂无数据
        </div>
      </div>
        <el-pagination
          v-if="data.totalNumber !== 0"
        :page-size="params.pageSize"
        @current-change="pageChange"
        layout="prev, pager, next"
        :total="data.totalNumber">
        </el-pagination>
        <!-- <iframe id="child" src="https://.kg.com/detail/list.html" style="display:none"></iframe> -->
    </div>
</template>
<script>
import C from "./../../assets/js/config.js"
export default {
  data() {
    return {
      data: {
        pageSize: 10,
        totalNumber: 9
      },
      params: {
        currentPage: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    pageChange(e) {
      this.params.currentPage =e;
      this.getComments()
    },
    //跳转到文章
    toArtcleDetail(id) {
//      https://test.kg.com/detail/list.html?id=NDU5NzEzOTIyMTE1NzAyNzg0
//      https://test.kg.com/article/458993630556893184
//     window.open(C.mainNameHost+'/detail/list.html?id='+id)
      window.open(C.mainNameHost+'/article/'+id)
    },
    getComments() {
      var vm = this;
      this.ajax({
        type: "post",
        data: this.params,
        url: "/manage/getArticleCommentsForAuthor",
        success: function(data) {
          if (data.code == 10000) {
            vm.data = data.responseBody;
            vm.data.data.forEach(element => {
              var showTime = vm.dateFormat(element.commentDate);
              element.showTime = showTime;
              if (element.commentUserAvatar) {
                if (element.commentUserAvatar.indexOf("http") == -1) {
                  element.commentUserAvatar =
                    C.imgHost + element.commentUserAvatar;
                } else if (element.commentUserAvatar.indexOf("http") != -1) {
                  console.log("C.imgUrl.development1111", C.imgHost);
                  return;
                }
              } else {
                element.commentUserAvatar =
                  "https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/author_default_avatar.png";
              }
            });
          }
        }
      });
    }
  },
  created() {
    this.getComments();
  }
};
</script>

<style lang="less" scoped>
.comments {
  padding: 8px 29px;
  margin-top: 30px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow:-2px 0px 4px  rgba(183,182,182,0.1) ,2px 0px 4px  rgba(183,182,182,0.1) ,0px 2px 4px  rgba(183,182,182,0.1) ,0px -2px 4px  rgba(183,182,182,0.1)  ;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 100px;
  font-family: "MicrosoftYaHei";
  text-align: left;
  .comment {
    padding: 30px 0 23px 76px;
    border-bottom: 1px solid rgba(230, 230, 230, 1);
    position: relative;
    p {
      &:first-child {
        font-size: 14px;
        margin-bottom: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 72%;
        span {
          &:first-child {
            font-family: "MicrosoftYaHei-Bold";
            color: #333333;
            font-weight: bold;
          }
          &:nth-child(2) {
            color: #9b9b9b;
          }
          &:nth-child(3) {
            &:hover {
              cursor: pointer;
              color: #4f9ff6;
            }
          }
        }
      }
      &:nth-child(2) {
        font-size: 16px;
        color: #333333;
        margin-bottom: 24px;
      }
      &:nth-child(3) {
        font-size: 12px;
        color: #9b9b9b;
      }
    }
    .userIcon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      position: absolute;
      top: 24px;
      left: 0;
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
      padding-top:30px ;
      font-size:14px;
      font-family:MicrosoftYaHei;
      color:rgba(51,51,51,1);
    }
  }
}
</style>
<style lang="less">
.comments {
  .el-pagination {
    float: right;
    margin-top: 40px;
  }
}
</style>
