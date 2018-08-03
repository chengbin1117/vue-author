/**
*  @description： 作者端内容管理
*  @author： 杨玉梅
*  @data:  2018.5.30
*/
<template>
    <div class="commentMange">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="文章评论" name="comments"><comments-model/></el-tab-pane>
            <el-tab-pane label="我的评论" name="mycomments"><mycomments-model/></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import commentsModel from './commentsModel.vue'
import mycommentsModel from './mycommentsModel.vue'
export default {
    components: {commentsModel, mycommentsModel},
    data () {
        return {
            activeName: 'comments'
        }
    },
    methods: {
        handleClick (e) {
            localStorage.setItem('kg_author_commentMange', e.name)
        }
    },
    mounted () {
        var activeName =localStorage.getItem('kg_author_commentMange');
        if (activeName) {
            this.activeName = activeName;
        }
    }
}
</script>
<style lang="less">
.commentMange{
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
