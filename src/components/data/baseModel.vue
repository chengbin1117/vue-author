/**
*  @description： 作者端粉丝数据-基础数据
*  @author： 余家鹏
*  @data:  2018.5.31
*/
<template>
    <div class="baseData">
      <el-row type="flex" justify="space-around" class="top">
        <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" :span="7" >
          <div>
            <p>昨日新增粉丝</p>
            <p>{{fansNumYesterday}}</p>
          </div>
        </el-col>
        <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" :span="7" >
          <div>
            <p>今日新增粉丝</p>
            <p>{{fansNumToday}}</p>
          </div>
        </el-col>
        <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" :span="7">
          <div>
            <p>粉丝总人数</p>
            <p>{{fansTotalNum}}</p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="tip">
            <p>*数据可能有延误，请刷新页面查看最新数据</p>
          </div>
        </el-col>
      </el-row>
      <!--图表-->
      <el-row type="flex" class="echart-boss">
        <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="title-echart">
            <div>粉丝人数</div>
            <div class="title-echart-div">
              <el-radio-group v-model="radio3" @change.native="getCurrentRow()">
                <el-radio label="7日"></el-radio>
                <el-radio label="14日"></el-radio>
                <el-radio label="30日"></el-radio>
              </el-radio-group>
            </div>
          </div>
          <div id="myChart" ></div>
        </el-col>
      </el-row>
      <el-row  class="listData">
        <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div>
            <p class="title">数据列表</p>
          </div>
        </el-col>
        <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-row type="flex"  align="middle" class="head">
            <el-col :span="8" >
              <p>时间</p>
            </el-col>
            <el-col :span="8">
              <p>新增粉丝</p>
            </el-col>
            <el-col :span="8">
              <p>粉丝总人数</p>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24"  v-loading="loading">
          <!--循环的东西-->
          <el-row class="list" type="flex"  align="middle" v-if="listData.length!=0" v-for="(item,index) in listData" :key="index">
            <el-col :span="8">
              <p>{{item.day}}</p>
            </el-col>
            <el-col :span="8">
              <p>{{item.fansNew}}</p>
            </el-col>
            <el-col :span="8">
              <p>{{item.fansTotal}}</p>
            </el-col>
          </el-row>
          <el-row class="no-list"  v-if="listData.length==0">
            <div class="no-list-img">
            </div>
            <div class="no-list-text">
              暂无数据
            </div>
          </el-row>
        </el-col>
        <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="listData.length!=0">
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :page-count="pageCount"
            layout="prev, pager, next"
            :total=total>
          </el-pagination>
        </el-col>
      </el-row>
    </div>
</template>
<script>
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data () {
    return {
      loading: true,
      listData: [],//数据列表
      currentPage:1,
      pageSize:10,
      pageCount:1,
      total:0,
      fansNumToday:'0',//今日粉丝
      fansNumYesterday:'0',//昨日粉丝
      fansTotalNum:'0',//粉丝宗苏
      echas:[],//图标的数组
      radio3: '7日',
      day: 7
    }
  },
  mounted () {
  //      获取列表
    this.getList()
  //    获取粉丝人数
    this.getFansNum()
  //    获取图表信息
    this.getEcharts()
  },
  methods: {
    drawLine (source) {
      var arr=[]
      var time=[]
      for (let i = 0; i < source.length; i++) {
        arr.push(source[i].fansNew)
        time.push(source[i].day)
      }
  //      time = time.reverse()
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart'))
      var o = {
        title: {
          text: '新增粉丝',
          textStyle: {
            fontSize: 12,
            fontFamily:'MicrosoftYaHei',
            color:'#333333',
            fontWeight:'normal'
          }
        },
        tooltip: {
        /*  trigger: 'axis',// 触发类型 这个时条形图和折线图的
          axisPointer: {
            type: 'cross',//移入圆点时，十字线显示
            label: {
              color:'black',//移入圆点时，X Y轴的字体颜色醒目
              backgroundColor: '#6a7985'//移入圆点时，X Y轴的背景颜色醒目
            },
          },
          backgroundColor:'#eb2334',//hover时显示的东西的背景图*/
          backgroundColor:'rgba(255,255,255,1)',//通过设置rgba调节背景颜色与透明度
          color:'black',
          borderWidth:'1',
          borderColor:'#E6E6E6',
          trigger: 'axis',
          formatter: function (params) {
//              console.log(params,'***********')
            return `<div style="color: black">${params[0].name}</div><span style="width: 5px;height: 5px;border-radius:50%;margin-right: 5px;background-color: #2382EA;display: inline-block"></span><span style="color: black">新增粉丝：</span><span style="color: black">${params[0].value}</span>`
          }
        },
        grid: {
          left: '3%',
          right: '8%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: time,
          axisLine:{
            lineStyle:{
              color:'#E6E6E6',
            }
          },
          axisLabel: {
            textStyle: {
              color: '#B7B6B6',//坐标值得具体的颜色

            }
          }
          /*axisLabel:{
            interval:0,//横轴信息全部显示
            rotate:-30,//-30度角倾斜显示
          }*/
        },
        yAxis: {
          type: 'value',
          axisLine:{
            lineStyle:{
              color:'#E6E6E6',
            }
          },
          minInterval: 1
        },
        series: [
          {
            type:'line',//line时tooltip的trigger就不写或者默认设置
            showSymbol: true,
            itemStyle: {
                normal: {
                    color: '#2382EA',
                  lineStyel:{
                    color: '#2382EA',
                  }
                }
            },
            data:arr
          },
        ],

      }
      myChart.setOption(o)
    },
  //    数据列表
    getList () {
        let params={
          currentPage:this.currentPage,
          pageSize:this.pageSize
        }
      this.ajax({
        type: "post",
        data: params,
        url: "/fans/fansTimeList",
        success: (res)=> {
          if(res.code==10000){
            this.listData=res.responseBody.data
            this.total=res.responseBody.totalNumber
            this.pageCount=res.responseBody.totalPage
            this.loading = false
          }else {
            this.$message.error(res.message);
          }
        }
      })
    },
  //    获取粉丝人数昨天今天总数
    getFansNum (){
      this.ajax({
        type: "post",
        url: "/fans/yesterdayIndicatorsData",
        success: (res) =>{
            if(res.code==10000){
              this.total=res.responseBody.totalNumber
              this.fansNumToday=res.responseBody.fansNumToday
              this.fansNumYesterday=res.responseBody.fansNumYesterday
              this.fansTotalNum=res.responseBody.fansTotalNum
            }else {
              this.$message.error(res.message);
            }
        }
      });
    },
  //    获取图表
    getEcharts (){
        let params={
          days : this.day
        }
      this.ajax({
        type: "post",
        data:params,
        url: "/fans/fansTimeListChart",
        success: (res) =>{
          if(res.code==10000){
              this.echas=res.responseBody
            this.drawLine(this.echas)
          }else {
            this.$message.error(res.message)
          }
        }
      });
    },
    //    tag切换
    getCurrentRow (e) {
      if (this.radio3 == '7日') {
        this.day = 7
        this.getEcharts()
      } else if (this.radio3 =='14日') {
        this.day = 14
        this.getEcharts()
      } else {
        this.day = 30
        this.getEcharts()
      }
    },
  //    分页切换
    handleCurrentChange (val) {
      this.currentPage = val
      this.getList()
    }
  }
  }
</script>
<style lang="less" scoped>
  .border{
    border: 1px solid red;
  }
  .border-all{
    /*width:970px;*/
    background:rgba(255,255,255,1);
    border-radius:10px;
    box-shadow:0px 20px 10px rgba(183,182,182,0.1);
  }
  .baseData {
    margin-top: 15px;
    font-family:'MicrosoftYaHei';
    width: 970px;
    .top{
      border-radius:10px;
      box-shadow:-2px 0px 4px  rgba(183,182,182,0.1) ,2px 0px 4px  rgba(183,182,182,0.1) ,0px 2px 4px  rgba(183,182,182,0.1) ,0px -2px 4px  rgba(183,182,182,0.1)  ;
      padding: 57px 0px;
      background:rgba(255,255,255,1);
      margin-left: 5px;
      margin-right: 5px;
      margin-top: 30px;
      text-align: center;
      div {
        flex: 1;
        border-right: 1px solid #E6E6E6;
        &:last-child{
          border-right: none;
        }
        p{
          &:first-child {
            font-size:16px;
            font-family:'MicrosoftYaHei';
            color:#747474;
            padding-bottom: 27px;
          }
          &:last-child {
            font-size:30px;
            font-family:'Poppins-Medium';
            color:#333333;
          }
        }
      }
    }
    .tip{
      margin-top: 20px;
      p{
        text-align: right;
        font-family: 'MicrosoftYaHei';
        color: #9B9B9B;
        font-size: 12px;
      }
    }
    .echart-boss{
      background:rgba(255,255,255,1);
      border-radius:10px;
      margin-left: 5px;
      margin-right: 5px;
      margin-top: 30px;
      box-shadow:-2px 0px 4px  rgba(183,182,182,0.1) ,2px 0px 4px  rgba(183,182,182,0.1) ,0px 2px 4px  rgba(183,182,182,0.1) ,0px -2px 4px  rgba(183,182,182,0.1)  ;

      .title-echart{
        padding: 30px 30px 0 30px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        div:first-child{
          color: #2382EA;
          font-size:14px;
          font-family:MicrosoftYaHei;
        }
        .title-echart-div{
          flex: 1;
          display: flex;
          justify-content: flex-end;
          /* span{
             font-size:14px;
             font-family:MicrosoftYaHei;
             margin-right: 40px;
           }
           span:last-child{
             margin-right: 0;
           }*/
        }
      }
      #myChart{
        height: 591px;
        padding: 30px 31px 50px 30px;
      }
    }

    .listData{
      margin-top: 30px;
      background:rgba(255,255,255,1);
      border-radius:10px;
      box-shadow:-2px 0px 4px  rgba(183,182,182,0.1) ,2px 0px 4px  rgba(183,182,182,0.1) ,0px 2px 4px  rgba(183,182,182,0.1) ,0px -2px 4px  rgba(183,182,182,0.1)  ;
      margin-bottom: 100px;
      overflow: hidden;
      text-align: center;
      margin-left: 5px;
      margin-right: 5px;

      padding: 30px 29px 50px 29px;
        .title{
          text-align: left;
          padding-bottom: 30px;
          color: #2382EA;
          font-family: 'MicrosoftYaHei';
          font-size: 14px;
        }
        .head{
          height:61px;
          background:rgba(249,249,249,1);
          font-family: 'MicrosoftYaHei';
          color: #333333;
          font-size: 14px;
        }
        .list{
          padding: 24px 0;
          font-size: 14px;
          font-family: 'MicrosoftYaHei';
          color: #333333;
          border-bottom: 1px solid rgba(230,230,230,1);
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
        .el-pagination{
          float: right;
          color:rgba(51,51,51,1);
          margin-top: 40px;
      }
    }
  }
</style>
<style lang="less">
  .title-echart{
    .el-radio__input{
      .el-radio__inner{display: none;}
    }
    .el-radio-group{
      .is-checked{
        .el-radio__label {
          color: #2382EA;
          display: inline-block;
          height:22px;
          text-align:center;
          line-height:2px;
        }
      }
    }
  }
</style>
