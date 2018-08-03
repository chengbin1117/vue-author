/**
*  @description： 作者端专栏设置
*  @author： 杨玉梅
*  @data:  2018.5.30
*  @尽量不用子路由引入，在搜狗浏览器兼容模式容易出问题。
*/
<template>
    <div class="columnSetting">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="信息设置" name="setting"><setting-model/></el-tab-pane>
            <el-tab-pane label="账户与安全" name="account"><account-model/></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import settingModel from './settingModel.vue'
import accountModel from './accountModel.vue'
  export default {
    components: {settingModel, accountModel},
    data() {
      return {
        activeName: 'setting'
      }
    },
    methods: {
        handleClick (e) {
            localStorage.setItem('kg_author_setting', e.name)
        }
    },
    mounted () {
        var activeName =localStorage.getItem('kg_author_setting');
        if (activeName) {
            this.activeName = activeName;
        }
    }
  }
</script>
<style >
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
</style>
