/**
*  @description： 作者端粉丝数据
*  @author： 杨玉梅
*  @data:  2018.5.30
*/
<template>
    <div class="fansData">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基础数据" name="baseData"><base-model /></el-tab-pane>
            <el-tab-pane label="粉丝列表" name="fansList"><list-model /></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import baseModel from './baseModel.vue'
import listModel from './listModel.vue'
export default {
  components: {baseModel, listModel},
  data () {
    return {
      activeName: 'baseData'
    }
  },
  methods: {
    handleClick(e) {
      localStorage.setItem('kg_author_fansData', e.name)
    }
  },
  mounted () {
    var activeName = localStorage.getItem('kg_author_fansData')
    if (activeName) {
      this.activeName = activeName
    }
  }
}
</script>
<style lang="less">
  .fansData{
    .el-tabs__header{
      margin: 0 0 0px;
    }
    .el-tabs__nav-wrap::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0%;
      height: 2px;
      background-color: #e4e7ed;
      z-index: 1;
    }
  }
</style>

