/**
*  @description： 作者端-个人信息
*  @author： 杨玉梅
*  @data:  2018.6.1
*/
<template>
    <div class="settingModel">
        <p v-if="data.roleId == 2">专栏类别：<i class="iconfont icon-person"></i><span>个人</span></p>
        <p v-if="data.roleId == 3">专栏类别：<i class="iconfont icon-media"></i><span>媒体</span></p>
        <p v-if="data.roleId == 4">专栏类别：<i class="iconfont icon-company"></i><span>企业</span></p>
        <p v-if="data.roleId == 5">专栏类别：<i class="iconfont icon-association"></i><span>其他组织</span></p>
        <div class="ueserIcon">
            <span>专栏头像：</span>
            <img :src="data.columnAvatar" alt="">
            <el-button type="primary" @click = 'avatarVisible = true'>更换头像</el-button>
          <span>不超过2M,支持jpg、png、jpeg等</span>
        </div>
        <p class="setName">
            <span>专栏名称：</span>
            <span>{{data.columnName}}</span>
        </p>
        <p>
            <span>专栏介绍：</span>
            <span>{{data.columnIntro}}</span>
        </p>
        <p>
            <span>所在地区：</span>
            <span>{{data.columnCountry + data.columnProvince + data.columnCity}}</span>
        </p>
        <p v-if="data.roleId ===4">
            <span>企业名称：</span>
            <span>{{data.companyName}}</span>
        </p>
        <p v-if="data.roleId ==5 ||data.roleId ==3">
            <span style="margin-right:75px">组织机构名称：</span>
            <span>{{data.companyName}}</span>
        </p>
        <p class="qiyeImg" v-if="data.roleId ===4">
            <span>企业营业执照扫描件：</span>
            <img :src="data.licensePic" alt="企业营业执照扫描件" class="burl">
            <i class="iconfont icon-gou"></i>
            <!--<span class="idmask licensePic">企业营业执照扫描件已审核通过</span>-->
        </p>
        <p class="qiyeImg" v-if="data.roleId ==5 ||data.roleId ==3">
            <span>组织机构营业执照扫描件：</span>
            <img :src="data.licensePic" alt="组织机构营业执照扫描件" class="burl">
            <i class="iconfont icon-gou"></i>
            <!--<span class="idmask licensePic">组织机构执照扫描件已审核通过</span>-->
        </p>
        <p class="managerRealName" v-if="data.roleId === 2 || data.roleId === 3">
            <span>管理员真实姓名：</span>
            <span>{{data.realName}}</span>
        </p>
        <p  class="managerRealName" v-if="data.roleId ===4 || data.roleId=== 5">
            <span>管理员真实姓名：</span>
            <span>{{data.realName}}</span>
        </p>
        <p class="managerID" v-if="data.roleId === 2 || data.roleId === 3">
            <span>管理员身份证号：</span>
            <span>{{data.idcard}}</span>
        </p>
        <p  class="managerID" v-if="data.roleId ===4 || data.roleId=== 5">
            <span>管理员身份证号：</span>
            <span>{{data.idcard}}</span>
        </p>
        <p class="operatorImg" v-if="data.roleId ===2 || data.roleId=== 3">
            <span>管理员身份证扫描件：</span>
            <img :src="data.idcardBack" alt="管理员身份证扫描件" class="burl">
            <i class="iconfont icon-gou"></i>
            <!--<span class="idmask">身份证正反面扫描件已审核通过</span>-->
        </p>
        <p class="operatorImg" v-if="data.roleId ===4 || data.roleId=== 5">
            <span>管理员身份证扫描件：</span>
            <img :src="data.idcardBack" alt="管理员身份证扫描件背部" class="burl">
            <i class="iconfont icon-gou"></i>
            <!--<span class="idmask">身份证正反面扫描件已审核通过</span>-->
        </p>
        <p class="otherLink">
            <span>专栏主页：</span>
            <a style="margin-left: 30px" target="_blank" :href="data.kgAuthorIndexUrl" >{{data.kgAuthorIndexUrl}}</a>
        </p>
        <p v-if = "data.otherPic != ''">
            <span>其他资质：</span>
            <span>你上传的各类资质已通过审核</span>
            <!-- <img v-for="(item, index) in data.otherPicList" :key="index"  class="otherPic" :src="imgHost+item" alt="其他资质">
            <span style="margin-left:103px" v-if="data.otherPicList === ''">暂无</span> -->
        </p>
         <avatar-modal @imgUpload="imgUpload" :visible = "avatarVisible" :cancel = "cancelAvatar" :roleId = "roleId" :initSrc = "data.columnAvatar" :fromthird = "fromthird"/>
    </div>
</template>
<script>
import avatarModal from "./avatarModal";
import C from "./../../assets/js/config.js";
// 2 个人、3 媒体、4 企业、5 其他组织
// 个人和媒体展示的东西一样
export default {
  components: { avatarModal },
  data() {
    return {
      labelPosition: "right",
      data: {
        columnName: "- -",
        columnAvatar: 'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/author_default_avatar.png',
        columnIntro:
          "这是我的专栏！这是我的专栏！这是我的专栏！这是我的专栏！这是我的专栏！",
        addr: "四川省成都市",
        company: "成都天下传媒公司",
        realName: "--",
        idcard: "610*************26",
        kgAuthorIndexUrl: "http://www.kg.com/343434.html",
        otherPic: '',
        roleId: 2// 2 个人、3 媒体、4 企业、5 其他组织
      },
      avatarVisible: false,
      roleId:"0",
      fromthird:null,
      imgHost: '',
      otherPicList:[],
    };
  },
  methods: {
    imgUpload (...data) {
      this.avatarVisible = false;
      this.data.columnAvatar = data[1]
    },
    getPersonDeatail () {
      var vm = this;
      this.ajax({
        type: 'post',
        url: '/set/getColumnInfo',
        success: function (data) {
          if(data.code == 10000) {
            vm.data = data.responseBody;
            vm.data.otherPicList = [];
            if (vm.data.columnAvatar) { // 设置了头像
              if (vm.data.columnAvatar.indexOf("http") == -1) { // 放到OSS
                  vm.data.columnAvatar = C.imgHost + vm.data.columnAvatar;
              }
            }
            else { // 没设置头像，显示默认头像
              vm.data.columnAvatar = "https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/author_default_avatar.png";
            }
            vm.data.idcardFront = C.imgHost + vm.data.idcardFront;
            vm.data.idcardBack = C.imgHost + vm.data.idcardBack;
            vm.data.idcardPic = C.imgHost + vm.data.idcardPic;
            vm.data.licensePic = C.imgHost + vm.data.licensePic;
            if(vm.data.otherPic && vm.data.otherPic.length !=0){
              vm.data.otherPicList = vm.data.otherPic.split(',')
            }
//            console.log(vm.data.otherPicList )
          }
        }
      })
    },
    showEditorAvatar() {
      this.avatarVisible = true;
      this.initSrc = this.data.columnAvatar;
    },
    cancelAvatar() {
      this.avatarVisible = false;
    }
  },
  mounted () {
    this.imgHost = C.imgHost;
  },
  created () {

    this.getPersonDeatail()
  }
};
</script>
<style lang="less" scoped>
.settingModel {
  text-align: left;
  padding-top: 36px;
  padding-right: 36px;
  padding-left: 36px;
  padding-bottom: 36px;
  margin-bottom: 100px;

  box-shadow:-2px 0px 4px  rgba(183,182,182,0.1) ,2px 0px 4px  rgba(183,182,182,0.1) ,0px 2px 4px  rgba(183,182,182,0.1) ,0px -2px 4px  rgba(183,182,182,0.1)  ;
  margin-left: 5px;
  border-radius:10px;
  margin-top: 30px;

  margin-right: 5px;
  font-family: "MicrosoftYaHei";
  .setName{
    margin-bottom: 62px;
    span {
      &:first-child {
        margin-right: 100px;
      }
    }
  }
  .otherLink{
    margin-bottom: 62px;
    span {
      &:first-child {
        margin-right: 72px;
      }
    }
    a {
      /*margin-left: 30px;*/
    }
  }
  p {
    &:first-child {
      text-align: right;
      color: #666666;
      font-size: 14px;
      i,
      span {
        color: #2382ea;
        font-size: 13px;
      }
      span {
        padding-left: 4px;
      }
    }
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6),
    &:nth-child(7),
    &:nth-child(12)
    {
      margin-bottom: 62px;
      span {
        &:first-child {
          margin-right: 100px;
        }
      }
    }
    &:nth-child(8) {
      margin-bottom: 62px;
      span {
        &:first-child {
          margin-right: 74px;
        }
      }
    }
    &:nth-child(9) {
      margin-bottom: 62px;
      span {
        &:first-child {
          margin-right: 72px;
        }
      }
    }
    &:nth-child(10) {
      margin-bottom: 62px;
      span {
        &:first-child {
          margin-right: 100px;
        }
      }
      a {
        color: #333;
        &:hover {
          text-decoration: none;
          color: #2382ea;
        }
      }
    }
    &:nth-child(12) {
      margin-bottom: 62px;
      span {
        &:first-child {
          margin-right: 100px;
        }
      }
      a {
        color: #333;
        &:hover {
          text-decoration: none;
          color: #2382ea;
        }
      }
    }
  }
  .qiyeImg{
      position: relative;
      margin-bottom: 184px !important;
      img {
        position: absolute;
        width: 100px;
        height: 160px;
        left: 175px;
        border: 1px solid #3cbc98;
      }
      .iconfont {
        position: absolute;
        color: #fff;
        background-color: #3cbc98;
        height: 20px;
        width: 20px;
        text-align: center;
        line-height: 20px;
        border-radius: 50%;
        font-size: 18px;
        left: 260px;
        top: -10px;
        z-index: 10;
      }
      .licensePic{
        display: block;
        position: absolute;
        width: 100px;
        height: 160px;
        left: 175px;
        background-color: rgba(1, 1, 1, 0.5);
        top: 0;
        word-break: break-all;
        color: #Fff;
        line-height: 25px;
        padding-top: 50px;
      }
  }
  .otherPic{
    width: 98px;
    height: 60px;
    margin-right: 30px;
  }
  .ueserIcon {
    position: relative;
    span {
      &:first-child {
        position: absolute;
        top: 13px;
      }
      &:last-child {
        color: #666666;
        font-size: 12px;
        padding-left: 14px;
      }
    }
    img {
      width: 100px;
      height: 99px;
      margin-left: 175px;
      margin-bottom: 86px;
      display: inline-block;
    }
    .el-button {
      position: absolute;
      left: 175px;
      top: 107px;
      height: 28px;
      width: 100px;
      padding: 0;
      border-radius: 0;
      background-color: rgba(35,130,234,1);
      border-color: rgba(35,130,234,1);
      &:hover {
        background-color: rgba(79,159,246,1);
        border-color: rgba(79,159,246,1);
      }
    }
  }
  .operatorImg{
      margin-bottom: 82px;
      position: relative;
      img {
        position: absolute;
        width: 98px;
        height: 60px;
        left: 175px;
        border: 1px solid #3cbc98;
        &:nth-child(3) {
          left: 303px;
        }
        &:nth-child(4) {
          left: 431px;
        }
      }
      .iconfont {
        position: absolute;
        color: #fff;
        background-color: #3cbc98;
        height: 20px;
        width: 20px;
        text-align: center;
        line-height: 20px;
        border-radius: 50%;
        font-size: 18px;
        left: 260px;
        top: -10px;
        z-index: 10;
        &:nth-child(6) {
          left: 390px;
        }
        &:nth-child(7) {
          left: 515px;
        }
      }
      .idmask{
        display: inline-block;
        position: absolute;
        width: 98px;
        height: 60px;
        left: 175px;
        text-align: center;
        line-height: 30px;
        word-break: break-all;
        background-color: rgba(1,1,1,0.5);
        color: #fff;
        &:nth-child(9){
          left: 303px;
        }
        &:nth-child(10) {
          left: 431px;
        }
      }
    .burl{
      /*filter: url(blur.svg#blur); !* FireFox, Chrome, Opera *!*/
      -webkit-filter: blur(1px); /* Chrome, Opera */
      -moz-filter: blur(1px);
      -ms-filter: blur(1px);
      filter: blur(1px);
      filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=1, MakeShadow=false); /* IE6~IE9 */
    }

  }
  .managerRealName{
    span{
      margin-right: 60px !important;
    }
  }
  .managerID{
    span{
      margin-right: 60px !important;
    }
  }
}
</style>
