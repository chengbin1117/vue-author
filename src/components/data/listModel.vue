/**
*  @description： 作者端粉丝数据-粉丝列表
*  @author： 余加鹏
*  @data:  2018.5.31
*/
<template>
  <div class="fanslist">
    <el-row>
      <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="menu">
          <span>我的粉丝({{totalNumber}})</span>
          <el-radio-group v-model="radio3" @change.native="getCurrentRow()">
            <el-radio label="全部"></el-radio>
            <el-radio label="专栏"></el-radio>
            <el-radio label="普通用户"></el-radio>
          </el-radio-group>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="content" v-if="list.length!=0" v-for="(item,index) in list" :key="index" v-loading="loading">
        <div class="headImg" >
          <div style="position: relative">
            <img  :src="item.avatar"  alt="" />
            <img v-if="item.realAuthedTag==1" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/img/v2.png" style="position: absolute;right: 4px;top: 50px;width: 12px;height: 12px;border-radius: 50%;overflow: hidden" />
            <img v-if="item.vipTag==1" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/img/v1.png" style="position: absolute;right: 4px;top: 50px;width: 12px;height: 12px;border-radius: 50%;overflow: hidden" />
          </div>
        </div>
        <div class="name">
          <div class="name-title">
            <span class="name-title-first">{{item.name}}</span>
            <span  class="name-title-last" v-if="item.identityTag!=''">{{item.identityTag}}</span>
            <span class="name-title-last" v-if="item.realAuthedTag==1">已实名</span>
          </div>
          <div class="name-content" >
            <span >{{item.intro}}</span>
          </div>
        </div>
        <div class="focus" v-if="item.identityTag!=''">
          <p class="focus-cancel" v-if="item.concernStatus==1" @click="focusIt(item.userId)">+关注</p>
          <p class="focus-span" v-if="item.concernStatus==2" @click="focusTogether(item.userId)" @mouseenter="over(index)" @mouseleave="out(index)">{{isshow==index?'取消关注':'互相关注'}}</p>
        </div>
      </el-col>
      <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class=" text-center" v-if="list.length==0"  >
        <el-row class="no-list"  v-if="list.length==0">
          <div class="no-list-img">
          </div>
          <div class="no-list-text">
            暂无数据
          </div>
        </el-row>
      </el-col>
    </el-row>
    <el-row v-if="list.length!=0">
      <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-pagination
          :page-size="pageSize"
          :current-page="currentPage"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total=total>
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import C from './../../assets/js/config.js'

  export default {
    data () {
      return {
        loading: true,
        list: [],
        total: 0,
//        fansNum: 80,
        currentPage: 1,
        pageSize: 10,
        totalNumber: 0,
        type: 0, // 0：全部，1：专栏，2：普通用户
        img: '',
        radio3: '全部',
        isshow: null,
        msg:'互相关注'
      }
    },
    created () {

    },
    mounted () {
      this.getFanList()
//    单独的获取粉丝总数
      this.getFansNum()
//    this.list = [
//      {
//        name: '千克财经',
//        name1: '天下财经专栏',
//        js: '这个人很懒什么也灭这个人很懒什么也灭',
//        gz: 1
//      }, {
//        name: '千克财经001',
//        name1: '天下财经专栏001',
//        js: '这个人很懒什么也灭这个人很懒什么也灭001',
//        gz: 0
//      }
//    ]
    },
    methods: {
      out (t) {
        this.isshow=null
//        t.target.innerText = '互相关注'
      },
      over (t) {
        this.isshow=t
//        t.target.innerText = '取消关注'
      },
//      点击取消关注的弹窗
    focusTogether (id) {
      const that = this
      this.$confirm('是否要取消关注?', '提示', {
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
        that.focusIt(id)
      }).catch(() => {

      })
    },
      //      点击取消互相关注
    focusTogetherSure (id) {
      const that = this;
      this.ajax({
        type: 'post',
        data: {
          concernUserId: id
        },
        url: '/fans/concernUser',
        success: (res) => {
          if (res.code === '10000') {
            if(res.responseBody.operation == 1) {
              that.$message.success('关注成功');
            }else {
              that.$message.success('取消关注成功');
            }
           // that.$message.success('取消关注成功');
           // that.getFanList()
          }else {
            that.$message.error(res.message);
          }
        }
      })
    },
      //      获取粉丝总数
      getFansNum () {
        this.ajax({
          type: 'post',
          url: '/fans/myFansCount',
          success: (res) => {
            if (res.code == 10000) {
              this.totalNumber=res.responseBody.myFansCount
            }else {
              this.$message.error(res.message);
            }
          }
        })
      },
      //      点击关注
      focusIt (id) {
        const that = this;
        this.ajax({
          type: 'post',
          data: {
            concernUserId: id
          },
          url: '/fans/concernUser',
          success(res) {
            if (res.code == 10000) {
              if(res.responseBody.operation == 1) {
                that.$message({
                  message: '关注成功',
                  type: 'success',
                  duration:1000
                });
              }else {
                that.$message({
                  message: '取消关注成功',
                  type: 'success',
                  duration:1000
                });
              }
              that.getFanList()
            }else {
              that.$message.error(res.message);
            }
          }
        })
      },
      //    tag切换
      getCurrentRow (e) {
        if (this.radio3 == '专栏') {
          this.type = 1
          this.getFanList()
        } else if (this.radio3 =='全部') {
          this.type = 0
          this.getFanList()
        } else {
          this.type = 2
          this.getFanList()
        }
      },
      //   粉丝列表
      getFanList () {
        let params = {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          type: this.type
        }
        this.ajax({
          type: 'post',
          data: params,
          url: '/fans/myFanslist',
          success: (res) => {
            if (res.code == 10000) {
              this.list = res.responseBody.data
              this.total=res.responseBody.totalNumber
              this.loading = false
              // 处理头像
              this.list.forEach(element => {
                if (element.avatar) {
                  if (element.avatar.indexOf("http") == -1) {
                    element.avatar = C.imgHost + element.avatar;
                  } else if (element.avatar.indexOf("http") != -1) {
                    return;
                  }
                } else {
                  element.avatar = "https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/author_default_avatar.png";
                }
              })
            } else {
              this.$message.error(res.message);
            }
          }
        })
      },
      handleCurrentChange(val) {
        this.currentPage=val
        this.getFanList()
      }
    }
  }
</script>
<style lang="less" scoped>
  .common{
    font-family: 'MicrosoftYaHei';
    font-size: 14px;
    color: #333333;
    display: inline-block;
  }
  .active{
    display: inline-block;
    text-align: center;
    background:rgba(35,130,234,1);
    border-radius:10px;
    color: #FFFFFF;
    height:22px;
    line-height: 22px;
  }
  .fanslist{
    border-radius:10px;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 30px;
    margin-bottom: 100px;
    box-shadow:-2px 0px 4px  rgba(183,182,182,0.1) ,2px 0px 4px  rgba(183,182,182,0.1) ,0px 2px 4px  rgba(183,182,182,0.1) ,0px -2px 4px  rgba(183,182,182,0.1)  ;    .title{
    padding: 20px 0;
    .titil-earn{
      cursor: pointer;
    }
    .titil-time{
      cursor: pointer;
    }
  }
    /*width: 970px;*/
    padding: 30px 30px 50px 30px;
    .content{
      display: -webkit-box; /* 老版本语法（ Safari, iOS, Android browser, older WebKit browsers） */
      display: -moz-box;/* 老版本火狐语法 */
      display: -ms-flexbox; /* 混合版本语法: IE 10 */
      /* 新语法 */
      display: -webkit-flex;
      display: flex;
      /* 老版本方法 */
      -webkit-box-align: center;
      -moz-box-align: center;
      -ms-flex-align:center; /* 混合语法 */
      /* 新版本语法 */
      -webkit-align-items: center;
      -moz-align-items: center;
      align-items: center;

      -webkit-box-pack: justify;
      -moz-box-pack: justify;
      -ms-flex-pack: justify;
      /* 新版本语法 */
      -webkit-justify-content: flex-start;
      -moz-justify-content: flex-start;
      justify-content: flex-start;
      padding: 30px 30px 30px 60px;
      border-bottom: 1px solid #E6E6E6;
      overflow: hidden;
      .headImg{
        img{
          display: block;
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
      }
      .name{
        margin-left: 16px;
        width: 638px;
        .name-title{
          margin-bottom: 14px;
          text-align: left;
          .name-title-first{
            font-size:16px;
            font-family:MicrosoftYaHei;
            color:rgba(51,51,51,1);
            line-height:0px;
          }
          .name-title-last{
            display: inline-block;
            text-align: center;
            margin-left: 10px;
            /*width: 118px;*/
            /*height: 24px;*/
            /*line-height: 24px;*/
            border-radius:12px;
            border: 1px solid #2382EA;
            color: rgba(35,130,234,1);
            font-size: 12px;
            padding: 4px 6px;
          }
        }
        .name-content{
          text-align: left;
        }
      }
      .focus{
        text-align: center;
        -webkit-box-flex: 1;
        -moz-box-flex: 1;
        /* 新语法 */
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        display: -webkit-box; /* 老版本语法（ Safari, iOS, Android browser, older WebKit browsers） */
        display: -moz-box;/* 老版本火狐语法 */
        display: -ms-flexbox; /* 混合版本语法: IE 10 */
        /* 新语法 */
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: justify;
        -moz-box-pack: justify;
        -ms-flex-pack: justify;
        /* 新版本语法 */
        -webkit-justify-content: flex-end;
        -moz-justify-content: flex-end;
        justify-content: flex-end;
        justify-content: flex-end;
        .focus-span{
          width: 97px;
          height: 34px;
          font-size:14px;
          font-family:MicrosoftYaHei;
          color:#2382EA;
          background:#ECF5FF;
          border-radius:17px;
          line-height: 34px;
          &:hover{
            background:#ECF5FF;
            cursor: pointer;
            color: black;
          }
        }
        .focus-cancel{
          width: 97px;
          height: 34px;
          font-size:14px;
          font-family:MicrosoftYaHei;
          color:#2382EA;
          background:rgba(236,245,255,1);
          border-radius:17px;
          line-height: 34px;
          &:hover{
            background:#2382EA;
            cursor: pointer;
            color: #FFFFFF;
          }
        }
      }
    }
    .el-pagination{
      float: right;
      color:rgba(51,51,51,1);
      margin-top: 40px;
    }
    .menu{
      display: -webkit-box; /* 老版本语法（ Safari, iOS, Android browser, older WebKit browsers） */
      display: -moz-box;/* 老版本火狐语法 */
      display: -ms-flexbox; /* 混合版本语法: IE 10 */
      /* 新语法 */
      display: -webkit-flex;
      display: flex;
      -webkit-box-align: center;
      -moz-box-align: center;
      -ms-flex-align:center; /* 混合语法 */
      /* 新版本语法 */
      -webkit-align-items: center;
      -moz-align-items: center;
      align-items: center;
      -webkit-box-pack: justify;
      -moz-box-pack: justify;
      -ms-flex-pack: justify;
      /* 新版本语法 */
      -webkit-justify-content: flex-start;
      -moz-justify-content: flex-start;
      justify-content: flex-start;
      padding-bottom: 30px;
      border-bottom: 1px solid rgba(230,230,230,1);
      span{
        margin-right: 65px;
      }

    }
    .text-center{
      padding: 30px 30px 30px 60px;
      text-align: center;
      border-bottom: 1px solid #E6E6E6;

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
  .menu{
    .el-radio__input{
      .el-radio__inner{display: none;}
    }
    .el-radio-group{
      .is-checked{
        .el-radio__label {
          background-color: #2382EA;
          color: #fff;
          padding:10px 11px;
          display: inline-block;
          height:22px;
          border-radius:11px;
          text-align:center;
          line-height:2px;
        }
      }
    }
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
