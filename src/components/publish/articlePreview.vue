/**
*  @description： 文章预览页
*  @author： 余加鹏
*  @data:  2018.5.31
*/
<template>
  <div class="previewArticle">
      <div class="context" >
        <p class="p-title">{{articleTitle}}</p>
        <div class="name" v-if = "articleType === '1'"><p>原创</p></div>
         <div class="name" v-if = "articleType ==='2'">
          <p>转载</p>
          <p class="name-p">本文来源：</p> <p>{{articleSource}}</p>
          <a class="name-p">阅读原文</a>
         </div>
        <p class="hx"></p>
        <div class="articleDec">{{articleDec}}</div>
        <div v-html=articleText class="article">
        </div>
        <p class="hx1"></p>
        <img src="" alt="">
        <!--<img v-if="this.articleHasImage==true" :src=this.imgUrl+this.articleImage alt="" style="padding-bottom: 20px;display: block">-->
        <p class="statement">
          声明：千氪财经登载此文出于传递更多信息之目的，并不意味着赞同其观点或证实其描述。文章内容仅供参考，不构成投资建议，投资者据此操作，风险自担。
        </p>
        <div class="tag" v-if = "tags.length != 0">
          <div v-for = "(item,key) in tags" :key = "key" >{{item}}</div>
        </div>
      </div>
  </div>
</template>
<script>
  import C from "./../../assets/js/config.js";

  export default {
  data() {
    return {
      dialogVisible: false,
      articleTitle: "",
      articleText: "",
      articleDec: "",
      tagsnames: "",
      articleType: "",
      articleSource: "",
      articleImage: "",
      articleLink: "",
      textarea:'',
      tags: [],
      imgUrl: C.imgHost
    };
  },
  mounted() {
    var id = this.$route.query.id;
    if (id === undefined) {
      this.getDetiles();
    } else {
      this.getArtilce(id);
    }
  },
  methods: {
    getDetiles() {
        console.log(localStorage.getItem("atricle_text"),'--------------')
      this.articleTitle = localStorage.getItem("atricle_title");
      this.articleText = localStorage.getItem("atricle_text");
      this.tagsnames = localStorage.getItem("article_tags");
      this.articleDec = localStorage.getItem("atricle_dec");
      this.articleType = localStorage.getItem("article_type");
      this.articleSource = localStorage.getItem("atricle_source");
      this.articleLink = localStorage.getItem("atricle_link");
      if (this.tagsnames !== "") {
        this.tags = this.tagsnames.split(",");
      }
    },
    getArtilce(id) {
      let data = {
        articleId: id
      };
      const _this = this;
      this.ajax({
        url: "/release/getArticleContent",
        data,
        success(data) {
          if (data.code === "10000") {
            var res = data.responseBody.data;
            _this.articleTitle = res.articleTitle;
            _this.articleText = res.articleText;
            _this.articleType = res.articleType+'';
            _this.articleDec = res.articleDescription

            let tagArr = [];
            if (res.articleTagnames != null) {
              tagArr = res.articleTagnames.split(",");
              for (var i in tagArr) {
                _this.tags[i] = tagArr[i];
              }
            }

            if (res.articleType === 2) {
              _this.articleSource =
                res.articleSource == null ? "" : res.articleSource + "";
              _this.articleLink =
                res.articleLink == null ? "" : res.articleLink + "";
            }
          } else {
            _this.$message({
              type: "error",
              message: res.message
            });
          }
        },
        catch(error) {}
      });
    }
  }
};
</script>

<style lang="less">
.article {
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: rgba(51, 51, 51, 1);

  p {
    line-height: 30px;
    margin-bottom: 44px;
  }
  .ql-align-center {
    text-align: center;
  }
  .ql-align-right {
    text-align: right;
  }
  .ql-align-justify {
    text-align: justify;
  }
  img {
    max-width: 100%;
    display: inline-block;
  }
  h1,
  h2,
  h3,
  h4 {
    margin-bottom: 44px;
  }
}
.previewArticle {
  overflow: hidden;
  .context {
    width: 50%;
    padding: 20px;
    margin: 0 auto;
    .p-title {
      font-weight: Bold;
      font-size: 30px;
      font-family: MicrosoftYaHei-Bold;
      color: rgba(51, 51, 51, 1);
      text-align: center;
      padding: 20px 0;
    }
    .articleDec {
      font-size: 14px;
      font-family: MicrosoftYaHei-Bold;
      color: #999;
      margin-bottom: 30px
    }
    .name {
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(155, 155, 155, 1);
      display: flex;
      .name-p {
        margin-left: 10px;
      }
      .name-last {
        flex: 1;
        text-align: right;
      }
    }
    .hx {
      border: 1px dashed #e6e6e6;
      margin: 14px 0 29px 0;
      width: 100%;
      height: 1px;
    }
    .hx1 {
      border: 1px dashed #e6e6e6;
      margin: 30px 0 30px 0;
      width: 100%;
      height: 1px;
    }

    img {
      display: inline-block;
      max-width: 100%;
      margin: 0 auto;
    }
    .indent {
      margin: 20px 0;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 1);
    }
    .statement {
      /*padding-top: 30px;*/
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(102, 102, 102, 1);
    }
    .tag {
      margin: 30px 0;
      div {
        display: inline-block;
        border: 1px solid #ebebeb;
        padding: 6px 8px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(116, 116, 116, 1);
        margin-right: 10px;
        cursor: pointer;
        border-radius: 4px;
        &:hover {
          background-color: #2382ea;
          color: #fff;
        }
      }
      .left {
        margin-left: 10px;
      }
    }
  }
}
</style>
