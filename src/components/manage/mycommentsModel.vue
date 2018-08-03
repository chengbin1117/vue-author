/**
*  @description： 作者端-内容管理-我的评论
*  @author： 杨玉梅
*  @data:  2018.5.30
*/
<template>
    <div class="mycomments">
        <div class="mycomment" v-for="(item, index) in data.data" :key="index">
            <p>{{item.commentDesc}}</p>
            <p @click="toArtcleDetail(item.articleId)">《{{item.articleTitle}}》</p>
            <p>
                <span>{{item.showTime}}</span>
                <!-- <span><i class="iconfont icon-if__QuestionMark_"></i></span> -->
                <span @click="deleteComments(item.commentId, index)"><i class="iconfont icon-shanchu"></i>删除</span>
                <span class="disBlock" v-show="!item.displayStatus"><i class="iconfont icon-if__QuestionMark_"></i>被隐藏<span class="disnone">也许是您的评论内容不太适合展示出来，如有疑问，请联系客服。</span> <div class="disnone triangle_border_down"></div></span>
            </p>
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
        :page-size="data.pageSize"
        @current-change="pageChange"
        layout="prev, pager, next"
        :total="data.totalNumber">
        </el-pagination>
    </div>
</template>
<script>
import C from "./../../assets/js/config.js";
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
      this.params.currentPage = e;
      this.getMyComments();
    },
    //跳转到文章
    toArtcleDetail(id) {
      window.open(C.mainNameHost+'/detail/list.html?id='+Base64.encode(id))
    },
    getMyComments() {
      var vm = this;
      this.ajax({
        type: "post",
        data: this.params,
        url: "/manage/getCommentAll",
        success: function(data) {
          if (data.code == 10000) {
            vm.data = data.responseBody;
            vm.data.data.forEach(element => {
              var showTime = vm.dateFormat(element.commentDate);
              element.showTime = showTime;
              if (element.commentUserAvatar) {
                if (element.commentUserAvatar.indexOf("http") == -1) {
                  console.log("C.imgUrl.development", C.imgHost);
                  element.commentUserAvatar =
                    C.imgHost + element.commentUserAvatar;
                } else if (element.commentUserAvatar.indexOf("http") != -1) {
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
    },
    deleteComments(id, index) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        customClass: "applySuccessBox",
        cancelButtonClass: "cancelButtonClass",
        confirmButtonClass: "confirmButtonClass",
        showClose: false,
        lockScroll: false,
        center: true
      }).then(() => {
        this.deleteCommentsSure(id,index)
      }).catch(() => {

      });
    },
    deleteCommentsSure(id, index) {
      var vm = this;
      this.ajax({
        type: "post",
        data: { commentId: id },
        url: "/manage/deleteComment",
        success: function(data) {
          vm.$message({
            showClose: false,
            type:'success',
            duration: 2000,
            message: "删除评论成功"
          });

          vm.getMyComments(); //删除后重新渲染列表
          // setTimeout(function() {
          //   vm.data.data.splice(index, 1);
          // }, 2100);
        }
      });
    }
  },
  created() {
    this.getMyComments();
  }
};
</script>

<style lang="less" scoped>
.mycomments {
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
  .mycomment {
    padding: 30px 0;
    border-bottom: 1px solid rgba(230, 230, 230, 1);
    p {
      &:first-child {
        font-size: 16px;
        color: #333;
        margin-bottom: 16px;
      }
      &:nth-child(2) {
        font-size: 14px;
        cursor: pointer;
        color: #2382ea;
        margin-bottom: 18px;
      }
      &:nth-child(3) {
        span {
          &:first-child {
            font-size: 12px;
            color: #9b9b9b;
          }
          &:nth-child(2) {
            font-size: 14px;
            color: #fc5a5d;
            cursor: pointer;
            float: right;
            .iconfont {
              margin-right: 6px;
            }
          }
          &:nth-child(3) {
            float: right;
            color: #9b9b9b;
            margin-right: 40px;
            position: relative;
            .iconfont {
              margin-right: 6px;
            }
            span {
              position: absolute;
              font-size: 12px;
              color: rgba(155, 155, 155, 1);
              display: inline-block;
              width: 234px;
              padding: 12px;
              // height: 64px;
              left: -75px;
              top: -65px;
              background-color: rgba(243, 243, 243, 1);
            }
          }
        }
      }
      .disnone {
        display: none !important;
      }
      .disBlock {
        &:hover {
          .disnone {
            display: block !important;
          }
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
      padding-top:30px ;
      font-size:14px;
      font-family:MicrosoftYaHei;
      color:rgba(51,51,51,1);
    }
  }
}
</style>
<style lang="less">
.mycomments {
  .el-pagination {
    float: right;
    margin-top: 40px;
  }
}
.triangle_border_down {
  width: 0;
  height: 0;
  border-width: 8px 8px 0;
  border-style: solid;
  border-color: rgba(243, 243, 243, 1) transparent transparent; /*灰 透明 透明 */
  position: absolute;
  top: -10px;
}
.applySuccessBox {
  .el-message-box__header {
    border-bottom: 1px solid #e1e0e1;
    padding-top: 20px;
    .el-message-box__title {
      font-size: 18px;
      font-family: "微软雅黑";
      color: rgba(51, 51, 51, 1);
      padding-bottom: 10px;
    }
  }
  .el-message-box__message {
    margin: 30px 0;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(102, 102, 102, 1);
  }
  .el-message-box__btns button {
    font-family: MicrosoftYaHei;
    border-radius: 4px;
    font-size: 14px;
  }
  .confirmButtonClass {
    width: 120px;
    height: 40px;
    background: rgba(35, 130, 234, 1);
    color: #fff;
  }
  .cancelButtonClass {
    width: 120px;
    height: 40px;
    background: rgba(255, 255, 255, 1);
    color: rgba(51, 51, 51, 1);
  }
}
</style>
