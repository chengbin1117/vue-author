/**
*  @description： 作者端左侧栏
*  @author： zhangchenle
*  @data:  2018.6.1
*/
<template>
  <div class="sidebar">
    <div class="menu" @click="removelocalStorage">
      <div v-for="(item, index) in menuList" :key="'menu' + index">
        <router-link v-if="item.path" :to="item.path">
          <div class="item item-title" :class="'iconfont ' + item.icon">
            <span>{{item.title}}</span>
          </div>
        </router-link>
        <div v-else class="item item-title" :class="'iconfont ' + item.icon">
          <span>{{item.title}}</span>
        </div>
        <div v-for="(child, index) in item.children" :key="'child' + index">
          <router-link :to="child.path">
            <div class="item item-sub">
              <span>{{child.title}}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <img v-if="show == 1" @click="showInvite" class="inviteNew" src="../../assets/img/invite.png"/>
       <el-dialog
                class = 'inviteModal'
                :visible="inviteVisible"
                width="880px"
                height = "830px"
                :lock-scroll = "true"
                :before-close = "closeModal"
                center>
                <div>
                  <img src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/img/authorinvite.png"/>
                </div>
                <div class="inviteMain">
                  <p class='code_tit'>
                    <span class='tit'>专属邀请链接</span>
                    <span class='code_link'>{{inviteUrl +'?code=' + inviteCode}}</span>
                  </p>
                  <p class='code_tit invite_c'>
                    <span class='tit'>你的邀请码</span>
                    <span class="invite_code">{{inviteCode}}</span>
                  </p>
                  <p class='copy'>复制上方链接分享给好友，好友在电脑端通过链接注册即可成为你的邀新用户。</p>
                  <p class='copy'>你也可以分享你的邀请码给好友，好友在mp.kg.com注册时填写你的邀请码成功注册后同样可以成为你的邀新用户。</p>
                  <div class="explain">
                    <p class='tit'>活动说明：</p>
                    <p>1. 作者邀请好友申请专栏，申请成功后7日内发布一篇文章则可获得邀请奖励。</p>
                    <p>2. 被邀请者在成为专栏日起7日以内发布文章的数量越多，邀请者则可根据发文数获得发文奖励，被邀请者也可获得平台发文收益。</p>
                    <p>3. 被邀请者在注册过程中需绑定邀请码才算邀新成功，邀请码可通过邀请链接自动填充或手动输入的形式。</p>
                    <p>4. 活动时间为8月1日上午9:00至8月31日晚上22:00。</p>
                    <p class='tit award'>活动奖励：</p>
                    <p>1. 作者成功邀请好友对应奖励（X为1周内邀请人数）：1≤X≤5，奖励7000氪金/人；6≤X≤10，奖励9000氪金/人；11≤X≤20，奖励15000氪金/人；21≤X≤30，奖励20000氪金/人；31≤X≤50，奖励30000氪金/人，51≤X，奖励50000氪金/人。（每周一次统计结算） </p>
                    <p>2. 被邀请者成功发布文章后邀请者可获得的奖励：1篇文章奖励3元，2或3篇文章奖励5元，4-6篇文章奖励10元，7篇文章以上奖励20元。（两周一次统计结算）</p>
                  </div>
                </div>
        </el-dialog>
  </div>
</template>

<script>

import C from "./../../assets/js/config.js";
export default {
  name: 'SideBar',
  data(){
    return {
      inviteCode:'', //邀请码
      inviteUrl:C.inviteUrl, // 邀新地址
      inviteVisible:false, //邀新弹窗
      show:0,//活动是否显示
      // 菜单栏配置项
      menuList: [
        {
          title: '首页', // 菜单标题
          path: "/", // 菜单跳转的路由
          icon: "icon-shouye",// 菜单图标
          children: [] // 二级菜单
        },
        {
          title: '发布',
          icon: "icon-fabu",
          children: [
            {
              title: '发布文章',
              path: "/publishArticle"
            },
            {
              title: '发布视频',
              path: "/publishVideo"
            }
          ]
        },
        {
          title: '管理',
          icon: "icon-icon-system-fn-administration",
          children: [
            {
              title: '内容管理',
              path: "/contentManage"
            },
            {
              title: '评论管理',
              path: "/commentMange"
            }
          ]
        },
        {
          title: '数据',
          icon: "icon-shuju",
          children: [
            {
              title: '粉丝数据',
              path: "/fansData"
            }
          ]
        },
        {
          title: '收益',
          icon: "icon-shouyi",
          children: [
            {
              title: '收益管理',
              path: "/income"
            }
          ]
        },
        {
          title: '设置',
          icon: "icon-shezhi",
          children: [
            {
              title: '专栏设置',
              path: "/setting"
            }
          ]
        }
      ]
    }
  },
  mounted(){
    const that = this;
                      this.ajax({
                      url: "/activity/showColumnsInviteActivity",
                      success(data) {
                        if (data.code === "10000") {
                          that.show = data.responseBody.show
                          if(that.show == 1){
                             if(localStorage.getItem('inviteVisible') == 0 || !localStorage.getItem('inviteVisible')){
                               that.inviteVisible = true
                               localStorage.setItem('inviteVisible',0)
                             }else{
                                that.inviteVisible = false
                                localStorage.setItem('inviteVisible',1)
                             }
                          }else{
                            that.inviteVisible = false
                            localStorage.setItem('inviteVisible',1)
                          }
                        } else {
                          that.$message({
                            type: "error",
                            message: data.message
                          });
                        }
                      }
                    });
      this.ajax({
        url: "/login/getInviteCode",
        success(data) {
          if (data.code === "10000") {
            // this.startTime = data.responseBody.startTime
            // this.endTime = data.responseBody.endTime
            that.inviteCode = data.responseBody
          } else {
            that.$message({
              type: "error",
              message: data.message
            });
          }
        }
      });
      // /login/getInviteCode
  },
  methods: {
    closeModal(){
       this.inviteVisible = false;
       localStorage.setItem('inviteVisible',1)
    },
    showInvite(){
      this.inviteVisible = true;
    },
    removelocalStorage(){
      localStorage.setItem('kg_author_commentMange', '')
      localStorage.setItem('kg_author_contentMange', '')
      localStorage.setItem('kg_author_setting', '')
      localStorage.setItem('kg_author_fansData', '')
      localStorage.setItem('kg_author_incomeManager', '')
    }
  }
}
</script>
<style>
  .inviteModal .el-dialog {
    height:830px!important;
    margin-top:8vh!important;
    border-radius: 4px;
  }
  .inviteModal .el-dialog__body{
    padding:0px;
  }
  .inviteModal .el-dialog__header{
    padding:0px
  }
  .inviteModal .el-dialog__header{
    display: inline-block;
  }
  .inviteModal .el-dialog__headerbtn .el-dialog__close{
    color:#fff;
    width:14px;
    height:14px;
  }
  .inviteModal img{
    border-radius: 4px;
    margin-top:-16px;
  }
</style>
<style lang="less" scoped>
  .inviteMain{
    margin-top:15px;
    padding:0px 30px;
    .code_link{
      display: inline-block;
      width:680px;
      height:40px;
      line-height: 40px;
      color:#DF705C;
      font-size:20px;
      padding-left:13px;
      border:1px solid #e6e6e6;
    }
    .code_tit{
      margin-bottom:30px
    }
    .invite_c{
      margin-bottom:22px;
    }
    .tit{
      display: inline-block;
      color:#000;
      font-size:18px;
      font-weight: bold;
      width:110px;
      margin-right:20px;
    }
    .invite_code{
      display: inline-block;
      width:88px;
      height:26px;
      line-height: 26px;
      background:#ececec;
      text-align: center;
      font-size:18px;
      color:#000;
      border-radius: 4px;
    }
    .copy{
      color:#646464;
      line-height: 30px;
    }
    .explain{
      width:820px;
      height:344px;
      border:1px solid #F2D9D6;
      background:#FFF8F7;
      padding:16px 35px;
      margin-top:30px;
      border-radius: 4px;
      p{
        color:#85362a;
        font-size:14px;
        line-height: 24px;
      }
      .tit{
        color:#cb250c;
        font-weight: bold;
      }
      .award{
        margin-top:20px;
      }
    }

  }
  .inviteNew{
    display: inline-block;
    width:140px;
    height:138px;
    margin-left: 88px;
    margin-top: 10px;
    cursor: pointer;
  }
  .sidebar {
    position: absolute;
    left: 0;
    top: 0;
    width: 194px;
    .menu {
      margin: 36px 4px 0 4px;
      padding-top: 36px;
      border-radius: 10px;
      border: 0;
      box-shadow: 0px 2px 4px rgba(183,182,182,0.1), 2px 0px 4px rgba(183,182,182,0.1), 0px -2px 4px rgba(183,182,182,0.1), -2px 0px 4px rgba(183,182,182,0.1);
      a {
        &:hover {
          text-decoration: none;
        }
      }
      .item, .item-title {
        position: relative;
        height: 42px;
        line-height: 42px;
        text-align: left;
        color: #333333;
        padding-left: 65px!important;
        span {
          font-size: 14px;
        }
      }
      .item-title {
        color: #666666;
        &::before {
          position: absolute;
          top: 0px;
          left: 30px;
        }
      }
      .item-sub:hover {
        color: #2382EA!important;
      }
      .icon-shouye {
        span:hover {
          color: #2382EA;
        }
        &::before {
          left: 27px;
          font-size: 22px;
          color: #666666;
        }
      }
      .router-link-exact-active .item {
        color: #2382EA!important;
      }
    }
  }

</style>
