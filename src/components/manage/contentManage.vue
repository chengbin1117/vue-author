/**
*  @description： 作者端内容管理
*  @author： 杨玉梅
*  @data:  2018.5.30
*/
<template>
    <div class="contentManage">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="文章" name="article"><articl-model/></el-tab-pane>
            <el-tab-pane label="视频" name="video"><video-model/></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import articlModel from './articlModel.vue'
import videoModel from './videoModel.vue'
export default {
    components: {articlModel, videoModel},
    data () {
        return {
            activeName: 'article'
        }
    },
    methods: {
        handleClick (e) {
            localStorage.setItem('kg_author_contentMange', e.name)
        }
    },
    mounted () {
        var activeName =localStorage.getItem('kg_author_contentMange');
        if (activeName) {
            this.activeName = activeName;
        }
    }
}
</script>

<style lang="less" scoped>
.contentManage{
    text-align: left;
}
</style>
<style lang="less">
.contentManage{
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



