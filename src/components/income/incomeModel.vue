/**
*  @description： 作者端收益管理-收益分析
*  @author： 余加鹏
*  @data:  2018.5.31
*/
<template>
  <div class="incomeModel">
    <el-row type="flex"  class="income">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" :span="6">
        <div class="income-today ">
          <div class="title">
              <span class="re">今日收益（TV）<i class="iconfont icon-if__QuestionMark_  income-today-question" >
               <div class="detail-head-content">
                      今日收益可能存在一定延时
                </div>
              </i>
              </span>
          </div>
          <div class="num">{{todaySum}}</div>
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" :span="6">
        <div class="income-today">
          <div class="title">昨日收益（TV）
          </div>
          <div class="num">{{yesToDaySum}}</div>
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" :span="6">
        <div class="income-today">
          <div  class="title">7日收益（TV）</div>
          <div class="num">{{day7Sum}}</div>
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" :span="6">
        <div class="income-today total">
          <div class="title">累计收益（TV）</div>
          <div class="num">{{sum}}</div>
        </div>
      </el-col>
    </el-row>
    <!--图表-->
    <el-row type="flex" class="echarts-sec">
      <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="title-echart">
          <div>整体收益（单位：TV）</div>
          <div class="title-echart-div">
            <el-radio-group v-model="radio4" @change.native="getCurrentRowDay()">
              <el-radio label="7日"></el-radio>
              <el-radio label="30日"></el-radio>
            </el-radio-group>
          </div>
        </div>
        <div id="myChart" ></div>
      </el-col>
    </el-row>
    <!--每日明细-->
    <el-row   class="detail-box" >
      <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="detail-title">
          <div class="detail-title-text">每日明细（单位：TV）</div>
          <div class="detail-title-day">
            <el-radio-group v-model="radio3" @change.native="getCurrentRow()">
              <el-radio label="7日"></el-radio>
              <el-radio label="30日"></el-radio>
            </el-radio-group>
          </div>
        </div>
      </el-col>
      <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-row type="flex"  justify="space-around" align="middle" class="detail-head">
          <el-col :span="4" >
            <p>日期</p>
          </el-col>
          <el-col :span="4">
            <p>发文收益</p>
          </el-col>
          <el-col :span="4">
            <p>打赏</p>
          </el-col>
          <el-col :span="4">
            <p>额外奖励</p>
          </el-col>
          <el-col :span="4" >
            <div class="detail-head-tip ">
                <span class="re">广告收益<i class="iconfont icon-if__QuestionMark_  detail-head-question" >
               <div class="detail-head-content">
                      文章中投放广告即可获取收益，
                  功能将于近期上线
                </div>
              </i></span>
            </div>
          </el-col>
          <el-col :span="4">
            <p>小计</p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-loading="loading">
        <!--循环的东西-->
        <el-row class="detail-content" type="flex"  justify="space-around" align="middle" v-if="list.length!=0" v-for="(item,index) in list" :key="index"  >
          <el-col :span="4">
            <!--<p>{{new Date(item.date_time).getFullYear() + '-' + (new Date(item.date_time).getMonth() + 1) + '-' + new Date(item.date_time).getDate()}}</p>-->
            <p>{{item.date_time}}</p>
          </el-col>
          <el-col :span="4">
            <p>{{item.post_earning}}</p>
          </el-col>
          <el-col :span="4">
            <p>{{item.give_award_earning}}</p>
          </el-col>
          <el-col :span="4">
            <p>{{item.extra_earning}}</p>
          </el-col>
          <el-col :span="4">
            <p>{{item.advertising_earning}}</p>
          </el-col>
          <el-col :span="4">
            <p>{{item.sum}}</p>
          </el-col>
        </el-row>
        <el-row class="no-list"  v-if="list.length==0">
          <div class="no-list-img">
          </div>
          <div class="no-list-text">
            暂无数据
          </div>
        </el-row>
      </el-col>
    </el-row>
    <div class="show" v-if="isShow==1" @click="getTenOrder"></div>
    <el-dialog
      :visible.sync="dialogVisible"
    >
      <div class="close" @click="dialogVisible=false">X</div>
      <div class="diaboss">
        <div class="title ">
          <img class=" img" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/title@3x.png" alt="">
          <img class=" sidai-img" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/sidai@3x.png" alt="">
        </div>
        <div class="time ">
          <p>时间：{{start_time}}-{{end_time}}</p>
        </div>
        <div class="ten" v-if="this.orderBy.length!==0">
          <!--三个皇冠-->
          <div class="ten-first">
            <div class="re" style="margin-right: 30px" v-if="orderBy[1]">
              <div class="re" style="width: 80px;height: 80px;margin: 0 auto">
                <img class="touxiang"  v-if="orderBy[1].column_avatar"  :src=orderBy[1].column_avatar alt="" >
                <img class="silver"  src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/no2@3x.png" alt="" >
              </div>
              <p class="title" v-if="orderBy[1].column_name">{{orderBy[1].column_name}}</p>
              <p class="red" v-if="orderBy[1].total_sum">{{orderBy[1].total_sum}}TV</p>
            </div>
            <div class="re" v-if="orderBy[0]">
              <div class="re" style="width: 128px;height:128px;margin: 0 auto" >
                <img class="gold"  v-if="orderBy[0].column_avatar"  :src=orderBy[0].column_avatar alt="" >
                <img class="gold-ab" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/no1@3x.png" alt="" >
              </div>
              <p class="title" v-if="orderBy[0].column_name">{{orderBy[0].column_name}}</p>
              <p class="red" v-if="orderBy[0].total_sum">{{orderBy[0].total_sum}}TV</p>
            </div>
            <div class="re" style="margin-left: 30px" v-if="orderBy[2]">
              <div class="re" style="width: 80px;height: 80px;margin: 0 auto"  >
                <img class="touxiang"  v-if="orderBy[2].column_avatar"  :src=orderBy[2].column_avatar alt="" >
                <img class="silver"  src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/no3@3x.png" alt="" >
              </div>
              <p class="title" v-if="orderBy[2].column_name">{{orderBy[2].column_name}}</p>
              <p class="red" v-if="orderBy[2].total_sum">{{orderBy[2].total_sum}}TV</p>
            </div>
          </div>
          <!--4-10-->
          <div class="four" v-if="fourTen.length!==0" v-for="(item,index) in fourTen" :key="index">
            <img v-if="index==0" class="first-img" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/4@3x.png" alt="">
            <img v-if="index==1" class="first-img" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/5@3x.png" alt="">
            <img v-if="index==2" class="first-img" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/6@3x.png" alt="">
            <img v-if="index==3" class="first-img" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/7@3x.png" alt="">
            <img v-if="index==4" class="first-img" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/8@3x.png" alt="">
            <img v-if="index==5" class="first-img" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/9@3x.png" alt="">
            <img v-if="index==6" class="ten-img" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/10@3x.png" alt="">
            <div v-if="index!=6">
              <div v-if="item.column_avatar">
                <img v-if="index!=6&&item.column_avatar" class="touxiang" :src=item.column_avatar alt="" >
              </div>
            </div>
            <div v-if="index==6">
              <div v-if="item.column_avatar">
                <img v-if="index==6&&item.column_avatar" class="ten-touxiang" :src=item.column_avatar alt="" >
              </div>
            </div>
            <span class="left" v-if="item.column_name">{{item.column_name}}</span>
            <span class="last-span" v-if="item.total_sum">{{item.total_sum}}</span>
          </div>
        </div>
        <div class="strategy">
          <div class="left-large"></div>
          <div class="left-small"></div>
          <div class="right-small"></div>
          <div class="right-large"></div>
          <div class="title">
            <img  src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/title-two@3x.png" alt="" >
          </div>
          <div class="content">
            <div class="sanguo">
              <img class="one-three" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/left@3x.png" alt="">
              <img class="sec" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/one@3x.png" alt="">
              <img class="one-three" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/right@3x.png" alt="">
            </div>
            <p >发文审核通过可获得基础奖励</p>
            <div class="sanguo">
              <img class="one-three" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/left@3x.png" alt="">
              <img class="sec" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/two@3x.png" alt="">
              <img class="one-three" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/right@3x.png" alt="">
            </div>
            <p >单篇文章发布7天内，将根据文章的</p>
            <p >APP阅读与分享情况以一定比例进行奖励发放</p>
            <div class="sanguo">
              <img class="one-three" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/left@3x.png" alt="">
              <img class="sec" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/three@3x.png" alt="">
              <img class="one-three" src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/right@3x.png" alt="">
            </div>
            <p >优质文章有机会获得额外奖励</p>
          </div>
        </div>
        <div class="last">
          <img src="https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/wallet@3x.png" alt="">
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import C from "./../../assets/js/config.js";
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
        radio3: '7日',
        radio4: '7日',
        day: 7,
        echartsDay: 7,
        listData: [],
        freeze: '',
        todaySum: '0.000',
        yesToDaySum: '0.000',
        day7Sum: '0.000',
        sum: '0.000',
        isShow: '', // 是否显示
        dialogVisible: false, // 是否显示
        orderBy: [], // 10大排行榜
        fourTen: [], // 10大排行榜
        start_time: '', // 排行榜开始时间
        end_time: '', // 排行榜开始时间
        list: [], // 列表
        echartsData: [] // 列表
      }
    },
    mounted () {

      // 获取收益
      this.getEarnings()
      // 获取收益详情
      this.getEarnDetail()
      // 获取Echarts数据
      this.getEchartsDay()
      // 是否显示收益排行榜接口
      this.getShow()
    },
    methods: {
      //    tag切换
      getCurrentRow () {
        if (this.radio3 == '7日') {
          this.day = 7
          this.getEarnDetail()
        } else {
          this.day = 30
          this.getEarnDetail()
        }
      },
      //    Echarts的天数切换
      getCurrentRowDay () {
        if (this.radio4 == '7日') {
          this.echartsDay = 7
          this.getEchartsDay()
        } else {
          this.echartsDay = 30
          this.getEchartsDay()
        }
      },
      drawLine (list) {
        let res = []
        let x = []
        let sourceData=[]
        if(list!= undefined){
          list.forEach(function (el,index) {
            x.push(el.date_time)
            res.push(el.sum)
            sourceData.push(el)
          })
        }
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          title: {
            text: '收益趋势',
            textStyle: {
              color: '#333333',
              fontSize: 12,
              fontWeight:'normal'
            }
          },
          tooltip: {
            backgroundColor:'rgba(255,255,255,1)',//通过设置rgba调节背景颜色与透明度
            color:'black',
            borderWidth:'1',
            borderColor:'#E6E6E6',
            trigger: 'axis',
            formatter: function (params) {
              let time=params[0].name
              for(var i=0;i<sourceData.length;i++){
                if(time==sourceData[i].date_time){
                  params=[]
                  params.push(sourceData[i])
                }
              }
              return `<div style="color: black">${params[0].date_time}</div><span style="width: 5px;height: 5px;border-radius:50%;margin-right: 5px;background-color: #2382EA;display: inline-block"></span><span style="color: black">发文收益：</span><span style="color: black">${params[0].post_earning}</span>
<div><span style="width: 5px;height: 5px;border-radius:50%;margin-right: 5px;background-color: #2382EA;display: inline-block"></span><span style="color: black">打赏：</span><span style="color: black">${params[0].give_award_earning}</span></div>
<div><span style="width: 5px;height: 5px;border-radius:50%;margin-right: 5px;background-color: #2382EA;display: inline-block"></span><span style="color: black">额外奖励：</span><span style="color: black">${params[0].extra_earning}</span></div>
     <div><span style="width: 5px;height: 5px;border-radius:50%;margin-right: 5px;background-color: #2382EA;display: inline-block"></span><span style="color: black">广告收益：</span><span style="color: black">${params[0].advertising_earning}</span></div>
   `
            }
          },
//        legend: {
//          data: ['7日', '30日']
//        },
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
            data: x,
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
            /* axisLabel:{
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
//              symbol: "arrow",//默认空心元，看你自己喜欢哪个样式，看官网去试一下
//              symbolSize:16,//设置圆点大小
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#2985EB', // 这是小圆点的颜色
                  lineStyle: {
                    color: '#2985EB'// 这是线的颜色
                  }
                }
              },
              data: res
            }
          ]
        })
      },
      /* 获取收益概览 */
      getEarnings () {
        this.ajax({
          type: 'post',
          url: '/earnings/getEarningsSummary',
          success: (res) => {
            if (res.code == 10000) {
              let data = res.responseBody
              this.freeze = data.freeze_amount
              this.todaySum = data.todaySum
              this.yesToDaySum = data.yesToDaySum
              this.day7Sum = data.day7Sum
              this.sum = data.sum
            } else {
              this.$message.error(res.message);
            }
          }
        })
      },
      /* 获取收益详情 */
      getEarnDetail () {
        let params = {
          day: this.day,
          sort_type:'desc'
        }
        this.ajax({
          type: 'post',
          data: params,
          url: '/earnings/getEarningsDetail',
          success: (res) => {
            if (res.code == 10000) {
              this.list = res.responseBody.data
              this.loading = false
              this.list.forEach(element => {
                let year=new Date(element.date_time).getFullYear()
                let month=(new Date(element.date_time).getMonth()+1)
                let day=(new Date(element.date_time).getDate())
                if (month < 10) {
                  month = '0'+month
                }
                if (day <10){
                  day = '0'+ day
                }
                element.date_time = year + '-' + month + '-' + day
              })
            }else {
              this.$message.error(res.message);
            }
          }
        })
      },
      /* 获取echarts上天数点击事件（接口都一样的） */
      getEchartsDay () {
        let params = {
          day: this.echartsDay,
          sort_type:'asc'
        }
        this.ajax({
          type: 'post',
          data: params,
          url: '/earnings/getEarningsDetail',
          success: (res) => {
            if (res.code == 10000) {
              this.echartsData = res.responseBody.data
              this.echartsData.forEach(element => {
                let year=new Date(element.date_time).getFullYear()
                let month=(new Date(element.date_time).getMonth()+1)
                let day=(new Date(element.date_time).getDate())
                if (month < 10) {
                  month = '0'+month
                }
                if (day <10){
                  day = '0'+ day
                }
                element.date_time = year + '-' + month + '-' + day
              })
              this.drawLine(this.echartsData)// 陈宫后画图
            }else {
              this.$message.error(res.message);
            }
          }
        })
      },
      /* 是否显示收益排行榜接口 */
      getShow () {
        this.ajax({
          type: 'post',
          url: '/earnings/getPopUpSet',
          success: (res) => {
            if (res.code == 10000) {
              this.isShow = res.responseBody.show
            }else {
              this.$message.error(res.message);
            }
          }
        })
      },
      /* 收益排行榜接口 */
      getTenOrder () {
        this.fourTen = []
        this.dialogVisible = true
        this.ajax({
          type: 'post',
          url: '/earnings/getPopUpDetail',
          success: (res) => {
            if (res.code == 10000) {
              this.orderBy = res.responseBody.data
              this.start_time = res.responseBody.start_time
              this.end_time = res.responseBody.end_time
              this.orderBy.forEach(element => {
                if (element.column_avatar == null || element.column_avatar.length == 0) {
                  // 没有返回图片
                  let ramNum = Math.random() * 32
                  ramNum = Math.ceil(ramNum)
                  element.column_avatar =
                    "https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180327/aticle" +
                    ramNum +
                    ".png"
                } else {
                  element.column_avatar = C.imgHost + element.column_avatar
                }
              })
              for(let i=3;i<this.orderBy.length;i++){
                this.fourTen.push(this.orderBy[i])

              }
            }else {
              this.$message.error(res.message);
            }
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .inline{
    display: inline-block;
  }
  .re{
    position: relative;
  }
  .text-right{
    text-align: right;
  }
  .flex-basic{
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
  }
  .border{
    border: 1px solid red;
  }
  .today{
    font-size:16px;
    font-family:MicrosoftYaHei;
    color:rgba(116,116,116,1);
  }
  .moeny{
    font-size:30px;
    font-family:Poppins-Medium;
    color:rgba(51,51,51,1);
    margin-top: 26px;
  }
  .common{
    font-size: 14px;
    font-family: 'MicrosoftYaHei';
  }
  .border-all{
    /*width:970px;*/
    background:rgba(255,255,255,1);
    border-radius:10px;
  }
  .cold{
    .text-right;
    .common;
    color: #747474;
    padding-bottom: 12px;
  }
  /*收益*/
  .income{
    text-align: center;
    padding: 57px 0px;
    border-radius:10px;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 30px;
    box-shadow:-2px 0px 4px  rgba(183,182,182,0.1) ,2px 0px 4px  rgba(183,182,182,0.1) ,0px 2px 4px  rgba(183,182,182,0.1) ,0px -2px 4px  rgba(183,182,182,0.1)  ;
    .income-today{
      border-right: 1px solid #E6E6E6;
      position: relative;
      .title{
        font-size:16px;
        font-family:MicrosoftYaHei;
        color:rgba(116,116,116,1);
      }
      .num{
        font-size:30px;
        font-family:Poppins-Medium;
        color:rgba(51,51,51,1);
        margin-top: 26px;
      }
      .income-today-question{
        width: 12px;
        height: 12px;
        cursor: pointer;
        color: #9B9B9B;
        position: absolute;
        top: -12px;
        right: -12px;
        &:hover .detail-head-content{
          display: block;
        }
        .detail-head-content{
          display: none;
          width: 184px;
          padding: 11px 7px;
          position: absolute;
          top: -54px;
          right: -84px;
          font-size: 12px;
          background-color: #F9F9F9;
          text-align: left;
        }
        .detail-head-content:before{
          content:"";
          border:13px solid #F9F9F9;
          border-bottom-color:transparent;
          border-right-color:transparent;
          border-left-color:transparent;
          width:0px;
          height:0px;
          position:absolute;
          left:82px;
          top:100%;
        }
      }
    }
    .re{
      position: relative;
    }
    .total{
      border-right: none;
    }
  }
  .echarts-sec{
    background:rgba(255,255,255,1);
    border-radius:10px;
    margin-left: 5px;
    margin-right: 5px;
    box-shadow:-2px 0px 4px  rgba(183,182,182,0.1) ,2px 0px 4px  rgba(183,182,182,0.1) ,0px 2px 4px  rgba(183,182,182,0.1) ,0px -2px 4px  rgba(183,182,182,0.1)  ;
    margin-top: 36px;
    #myChart{
      height: 591px;
      margin-bottom: 32px;
      padding: 30px 31px 50px 30px;
    }
  }
  /*每日明细*/
  .detail-box{
    margin-top: 36px;
    margin-bottom: 153px;
    background:rgba(255,255,255,1);
    border-radius:10px;
    margin-left: 5px;
    margin-right: 5px;
    box-shadow:-2px 0px 4px  rgba(183,182,182,0.1) ,2px 0px 4px  rgba(183,182,182,0.1) ,0px 2px 4px  rgba(183,182,182,0.1) ,0px -2px 4px  rgba(183,182,182,0.1)  ;
    padding: 30px 31px 50px 30px;
    .detail-title{
      margin-bottom: 30px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      .detail-title-text{
        font-size:14px;
        font-family:MicrosoftYaHei;
        color:rgba(35,130,234,1);
      }
      .detail-title-day{
        font-size:14px;
        font-family:MicrosoftYaHei;
        color:rgba(51,51,51,1);
      }
    }
    .detail-head{
      text-align: center;
      padding: 23px 0px;
      background-color: #F9F9F9;
      p{
        font-size:14px;
        font-family:MicrosoftYaHei;
        color:rgba(51,51,51,1);
      }
      .detail-head-tip{
        position: relative;
        .detail-head-question{
          width: 12px;
          height: 12px;
          cursor: pointer;
          color: #9B9B9B;
          position: absolute;
          top: -18px;
          right: -6px;
          &:hover .detail-head-content{
            display: block;
          }
        }
        .detail-head-content{
          display: none;
          text-align: left;
          width: 184px;
          padding: 11px 7px;
          position: absolute;
          top: -75px;
          right: -84px;
          font-size: 12px;
          background-color: #F9F9F9;
        }
        .detail-head-content:before{
          content:"";
          border:13px solid #F9F9F9;
          border-bottom-color:transparent;
          border-right-color:transparent;
          border-left-color:transparent;
          width:0px;
          height:0px;
          position:absolute;
          left:82px;
          top:100%;
        }
      }
    }
    .detail-content{
      text-align: center;
      padding: 34px 0;
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
    .el-pagination{
      display: flex;
      justify-content: flex-end;
      color:rgba(51,51,51,1);
      margin-top: 40px;
    }
  }
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
  .show{
    width: 98px;
    height: 146px;
    position: fixed;
    bottom: 100px;
    right: 44px;
    background-image: url("https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/Benefit-analysis/icon@3x.png");
    background-repeat: no-repeat;
    background-size: cover;
  }
  .diaboss{
    background: -webkit-linear-gradient(#62A3FF, #5377C1); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#62A3FF, #5377C1); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#62A3FF, #5377C1); /* Firefox 3.6 - 15 */
    background: linear-gradient(#62A3FF, #5377C1); /* 标准的语法 */
    overflow: hidden;
    padding-top: 60px;
    .title{
      position: relative;
      .img{
        width: 80%;
        height: auto;
        margin: 0 auto;
        display: block;
        /*position: relative;*/
      }
      .sidai-img{
        position: absolute;
        top: 0;
        left: 0;
        width: 53px;
        height: 29px;
        margin-left: 26px;
        margin-top: -29px;
      }
    }
    .time{
      padding: 29px 0;
      p{
        font-size:20px;
        font-family:MicrosoftYaHei;
        color:rgba(255,255,255,1);
        text-align: center;
      }
    }
    .ten{
      width: 540px;
      margin: 0 auto;
      border-radius: 20px;
      background-color: #E3F2F7;
      padding: 50px 60px;
      .ten-first{
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: 40px;
        .touxiang{
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: block;
          margin: 0 auto;
        }
        .silver{
          position: absolute;
          top: -23px;
          right: 23px;
          width: 35px;
          height: 27px
        }
        .title{
          padding-top: 20px;
          text-align: center;
          font-size:16px;
          font-family:MicrosoftYaHei;
          color:rgba(83,119,193,1);
        }
        .red{
          padding-top: 12px;
          text-align: center;
          font-size:14px;
          font-family:MicrosoftYaHei-Bold;
          color:rgba(255,116,142,1);
        }
        /*冠军图*/
        .gold{
          width: 128px;
          height: 128px;
          border-radius: 50%;
          display: block
        }
        .gold-ab{
          position: absolute;
          top: -33px;
          right: 40px;
          width: 51px;
          height: 37px
        }
      }
      .four{
        .first-img{
          width: 7px;
          height: 12px;
        }
        .ten-img{
          width: 17px;
          height: 13px;
        }
        border-bottom: 1px solid #AAC1FC;
        padding:8px 0px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img{
          display: inline-block;
        }
        .touxiang{
          display: inline-block;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-left: 20px
        }
        .ten-touxiang{
          display: inline-block;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-left: 10px
        }
        .left{
          margin-left: 10px;
          font-size:14px;
          font-family:MicrosoftYaHei;
          color:rgba(83,119,193,1);
        }
        .last-span{
          flex: 1;
          text-align: right;
          font-size:14px;
          font-family:MicrosoftYaHei-Bold;
          color:rgba(255,116,142,1);
        }
      }
    }
    .strategy{
      width: 540px;
      margin: 0 auto;
      border-radius: 20px;
      background-color: #E3F2F7;
      padding: 50px 60px;
      margin-top: 54px;
      position: relative;
      .title{
        width: 300px;
        height: 52px;
        border-radius: 26px;
        background: -webkit-linear-gradient(#6683FB, #7491FB,#62A0FF); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(#6683FB, #7491FB,#62A0FF); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(#6683FB, #7491FB,#62A0FF); /* Firefox 3.6 - 15 */
        background: linear-gradient(#6683FB, #7491FB,#62A0FF); /* 标准的语法 */
        position: absolute;
        top: -26px;
        right: 120px;
        padding: 12px 0;
        img{
          display: block;
          margin: 0 auto;
          width: 134px;
          height: 27px;
        }
      }
      .content{
        p{
          text-align: center;
          font-size:16px;
          font-family:MicrosoftYaHei;
          color:rgba(83,119,193,1)
        }
        .sanguo{
          text-align: center;
          padding: 40px 0 31px 0;
          .one-three{
            width: 43px;
            height: 12px;
          }
          .sec{
            width: 73px;
            height: 21px;
          }
        }
      }
      .left-large{
        position: absolute;
        width: 17px;
        height: 17px;
        border-radius: 50%;
        top: -26px;
        left: 88px;
        background: linear-gradient(#6683FB,#7491FB,#62A0FF);
      }
      .left-small{
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        top: -41px;
        left: 73px;
        background: linear-gradient(#6683FB,#7491FB,#62A0FF);
      }
      .right-large{
        position: absolute;
        width: 17px;
        height: 17px;
        border-radius: 50%;
        top: -26px;
        right: 88px;
        background: linear-gradient(#6683FB,#7491FB,#62A0FF);
      }
      .right-small{
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        top: -41px;
        right: 73px;
        background: linear-gradient(#6683FB,#7491FB,#62A0FF);
      }
    }
    .last{
      padding: 30px 0 10px 0;
      /*width: 540px;*/
      /*margin: 0 auto;*/
      img{
        width: 525px;
        height: 212px;
        margin: 0 auto;
        display: block;
        z-index: 6;
      }

    }
  }
  .close{
    width: 36px;
    height: 36px;
    border-radius: 50%;
    text-align:center;
    line-height: 36px;
    background-color: #FF748E;
    font-size:16px;
    font-family:MicrosoftYaHei;
    color:rgba(255,255,255,1);
    position: absolute;
    top: -18px;
    right: -18px;
    cursor: pointer;
  }
</style>
<style lang="less">
  .detail-title{
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
  .el-dialog__body{
    padding:  0px;
  }
  .el-dialog__header{
    display: none;
  }
  .el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 2px;
    background-color: #e4e7ed;
    z-index: 1;
  }
  @media screen and (min-width:1366px){
    .el-dialog {
      position: relative;
      margin: 0 auto 50px;
      background: #fff;
      border-radius: 2px;
      -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3);
      box-shadow: 0 1px 3px rgba(0,0,0,.3);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 570px;
    }
  }
  @media screen and (min-width:1024px) and (max-width:1366px){
    .el-dialog {
      position: relative;
      margin: 0 auto 50px;
      background: #fff;
      border-radius: 2px;
      -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3);
      box-shadow: 0 1px 3px rgba(0,0,0,.3);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 570px;
    }
  }
</style>
