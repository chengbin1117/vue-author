/**
*  @description： 作者端选择申请的专栏类型组件
*  @author： zhangchenle
*  @data:  2018.6.2
*/
<template>
  <div class="apply">
    <Header></Header>
    <div class="main">
      <Steps :steps="steps"></Steps>
      <div class="types">
        <div :class="['content', {selected: type.selected}]" v-for="(type, index) in types"  :key="'type' + index" @click="select(type)">
          <div class="item iconfont" :class="[type.icon]">
            <!-- <div class="icon-selected iconfont icon-gou"></div> -->
            <div class="title">{{type.title}}</div>
            <div class="description">{{type.description}}</div>
          </div>
        </div>
      </div>

      <div class="btn-commit" @click="commit">提交</div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/apply/Header'
import Steps from '@/components/apply/Steps'
import Footer from '@/components/home/Footer'

export default {
  name: 'Apply',
  components: { Header, Steps, Footer },
  data() {
    return {
      // 步骤
      steps: [{
        stepno: '1', // 步骤序号
        title: '注册账号', // 步骤标题
        active: true // 步骤是否激活（已进行）
      },{
        stepno: '2',
        title: '选择类型',
        active: true
      },{
        stepno: '3',
        title: '填写资料',
        active: false
      }],
      // 申请专栏的类型
      types: [{
        path: "/personal", // 路由路径
        title: "个人", // 名称
        icon: "icon-person", // 图标
        description: "适合财经/金融/区块链领域专家、意见领袖、评论家及自媒体人士申请", // 描述
        selected: false, // 是否选中
        id:'2',
      },{
        path: "/personal",
        title: "媒体",
        icon: "icon-media",
        description: "适合财经类报纸，杂志，电视，电台，通讯社或其他以生产内容为主的组织机构",
        selected: false,
        id:'3',
      },{
        path: "/personal",
        title: "企业",
        icon: "icon-company",
        description: "适合企业、公司，分支机构，企业相关品牌，产品与服务等",
        selected: false,
        id:'4',
      },{
        path: "/personal",
        title: "组织",
        icon: "icon-association",
        description: "适合各类公共场馆、公益机构、学校、社团、民间组织等机构团体",
        selected: false,
        id:'5',
      }],
      selected: {} // 选中的类型
    }
  },
  mounted() {
    this.getProgress() //拦截登陆用户
    this.getSelectedType()

  },
  methods: {
    // 获取选中的类型
    getSelectedType() {

      this.types.forEach(type => {
        if(type.selected) this.selected = type
      })
    },
    // 选择类型
    select(item) {
      this.types.forEach(type => {
        type.selected = false
      })
      item.selected = true
      this.selected = item
    },
    // 提交类型选择
    commit() {
      this.$router.push({path:this.selected.path,query:{id:this.selected.id}})
    },
    // 获取申请进度信息
    getProgress() {
      this.ajax({
        url: "/column/checkProfile",
        success: data => {
          if(data.code === "10000") {
            let auditStatus = data.responseBody.auditStatus
            if (auditStatus === 2){}
            else this.$router.push('/')
          } else if(data.code === "20011"){
            // 未申请专栏的普通用户(不用处理)
          } else {
            this.$message({
              type: 'error',
              message: data.message
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .apply {
    padding-top: 72px;
    padding-bottom: 100px;
    position: relative;
    min-height: 100%;
    .main {
      margin: 62px auto 0;
      width: 1200px;
      padding-bottom: 100px;
      position: relative;
      min-height: 100%;
      .types {
        margin-top: 85px;
        display: flex;
        justify-content: center;
        .item {
          cursor: pointer;
          padding-top:17px;
          margin-left: 76px;
          margin-top: 44px;
          // margin-right: 110px;
          position: relative;
          height: 76px;
          // line-height: 120px;
          width: 76px;
          text-align: center;
          border: 2px solid #E6E6E6;
          color: #666666;
          border-radius: 50%;
          .icon-selected {
            display: none;
            position: absolute;
            top: 6px;
            right: -2px;
            height: 30px;
            line-height: 30px;
            width: 30px;
            background: #2382EA;
            border-radius: 50%;
            color: #fff;
            text-align: center;
            &::before {
              font-size: 16px;
            }
          }
          .title {
            position: absolute;
            top: 85px;
            width: 100%;
            text-align: center;
            font-size: 18px;
            font-family: PingFangSC;
            color:rgba(102,102,102,1);
          }
          &::before {
            font-size: 38px;
          }

        }
        .item:last-child {
          margin-right: 0;
        }
        .selected {
          // border: 1px solid #EBEBEB;
          background:#F2F4F7;
          color: #2382EA;
          .icon-selected {
            display: block;
          }
        }
      }
      .description {
        /* margin-top: 85px; */
        text-align: center;
        position: absolute;
        /* width: 177px; */
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #666666;
        width: 177px;
        left: -50px;
        top: 135px;
      }
      .btn-commit {
        margin: 50px auto 0;
        width: 170px;
        height: 40px;
        line-height: 40px;
        background: #2382EA;
        color: #fff;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          background: rgba(35,130,234,.7);
        }
      }
    }
  }
  .content{
    cursor: pointer;
    width:240px;
    height:280px;
    border:1px solid #EBEBEB;
    border-radius: 10px;
    margin-right:20px;
  }
  .content:hover{
    background:#F2F4F7;
        .item{
      border-color:#2382EA!important;
    }
    .iconfont {
        &::before {
          color:#2382EA;
        }
     }
  }
  .selected{
    cursor: pointer;
    .item{
      border-color:#2382EA!important;
    }
    .iconfont {
        &::before {
          color:#2382EA;
        }
     }
  }
</style>
