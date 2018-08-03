/**
*  @description： 作者端收益管理-文章分析
*  @author： 杨玉梅
*  @data:  2018.5.31
*/
<template>
    <div class="articelModel">
      <el-row type="flex" justify="end" class="title">
        <div class="order-by">
          <el-radio-group v-model="radio3" @change.native="getCurrentRow()">
            <el-radio label="按发布时间排序"></el-radio>
            <el-radio label="按收益排序"></el-radio>
          </el-radio-group>
        </div>
      </el-row>
      <el-row>
          <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-table
              v-loading="loading"
              :data="tableData"
              style="width: 100%;text-align: center">
              <el-table-column
                prop="date_time"
                label="日期"
              >
              </el-table-column>
              <el-table-column
                prop="article_title"
                label="标题"
              >
              </el-table-column>
              <el-table-column
                prop="post_earning"
                label="发文收益">
              </el-table-column>
              <el-table-column
              prop="advertising_earning"
              label="打赏">
            </el-table-column>
              <el-table-column
                prop="extra_earning"
                label="额外奖励"
              >
              </el-table-column>
              <el-table-column
                prop="give_award_earning"
                label="广告收益"
                >
              </el-table-column>
              <el-table-column
                prop="sum"
                label="小计"
                >
              </el-table-column>
            </el-table>
          </el-col>
        <!--<el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-row type="flex"  justify="space-around" align="middle" class="detail-head">
            <el-col :span="3" >
              <p>日期</p>
            </el-col>
            <el-col :span="3">
              <p>标题</p>
            </el-col>
            <el-col :span="3">
              <p>发文收益</p>
            </el-col>
            <el-col :span="3">
            <p>打赏奖励</p>
          </el-col>
            <el-col :span="3">
              <p>额外奖励</p>
            </el-col>
            <el-col :span="3" >
              <p>广告收益</p>
            </el-col>
            <el-col :span="3">
              <p>小计</p>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          &lt;!&ndash;循环的东西&ndash;&gt;
          <el-row class="detail-content" type="flex"  justify="space-around" align="middle" v-for="(item,index) in tableData" :key="index">
            <el-col :span="3">
              <p>{{item.date_time}}</p>
            </el-col>
            <el-col :span="3">
              <p>{{item.article_title}}</p>
            </el-col>
            <el-col :span="3">
              <p>{{item.post_earning}}</p>
            </el-col>
            <el-col :span="3">
              <p>{{item.give_award_earning}}</p>
            </el-col>
            <el-col :span="3">
              <p>{{item.extra_earning}}</p>
            </el-col>
            <el-col :span="3">
              <p>{{item.advertising_earning}}</p>
            </el-col>
            <el-col :span="3">
              <p>{{item.sum}}</p>
            </el-col>
          </el-row>
          <el-row class="no-list"  v-if="tableData.length==0">
            <div class="no-list-img">
            </div>
            <div class="no-list-text">
              暂无数据
            </div>
          </el-row>
        </el-col>-->
      </el-row>
      <el-row v-if="tableData.length!=0">
        <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :current-page="currentPage"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>

        </el-col>
      </el-row>
    </div>
</template>
<script>
export default {
  data () {
    return {
      radio3: '按发布时间排序',
      type: 'date_time desc', // 默认收益排序
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      tableData: []
    }
  },
  methods: {
    //    tag切换
    getCurrentRow () {
      if (this.radio3 == '按收益排序') {
        this.type = 'sum desc'
        this.currentPage = 1
        this.getTableList()
      } else {
        this.type = 'date_time desc'
        this.currentPage = 1
        this.getTableList()
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableList()
    },
    //    列表请求
    getTableList () {
      let params = {
        sort_type: this.type,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      this.ajax({
        type: 'post',
        data: params,
        url: '/earnings/getArticleDetail',
        success: (res) => {
          if (res.code == 10000) {
            this.tableData = res.responseBody.data
            this.total = res.responseBody.total
            this.loading = false
          }else {
            this.$message.error(res.message)
          }
        }
      })
    }

  },
  mounted () {
    this.getTableList()
  }
}
</script>
<style lang="less">
  .articelModel{
    .el-table th>.cell{
      text-align: center;
      font-weight: normal;
    }
    .order-by{
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
    .el-table th{
        white-space: nowrap;
        overflow: hidden;
        user-select: none;
        text-align: center;
        background-color: #F9F9F9;
        padding: 23px 0px;
      }
    .el-table__row td{
      padding: 34px 0px;
    }
  }
</style>
<style lang="less" scoped>
  .articelModel{
    padding: 57px 30px;
    border-radius:10px;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 30px;
    margin-bottom: 100px;
    box-shadow:-2px 0px 4px  rgba(183,182,182,0.1) ,2px 0px 4px  rgba(183,182,182,0.1) ,0px 2px 4px  rgba(183,182,182,0.1) ,0px -2px 4px  rgba(183,182,182,0.1)  ;
    .title{
      padding: 20px 0;
      .titil-earn{
        cursor: pointer;
      }
      .titil-time{
        cursor: pointer;
      }
    }
    .el-pagination{
      float: right;
      color:rgba(51,51,51,1);
      padding-top: 40px;
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
  }
</style>
