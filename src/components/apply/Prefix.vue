/**
*  @description： 电话号码地区编码选择组件
*  @author： zhangchenle
*  @data:  2018.6.4
*/
<template>
  <el-dropdown class="prefix" trigger="click" placement="bottom-start" @command="commandHandler">
    <div class="text">{{'+' + prefix}}</div>
    <el-dropdown-menu slot="dropdown">
      <el-scrollbar>
        <el-dropdown-item v-for="(item, index) in prefixList" class="item" :command="item" :key="'prefix' + index">
          <span class="code">{{'+' + item.code}}</span>
          <span class="countryname">{{item.countryname}}</span>
        </el-dropdown-item>
      </el-scrollbar>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import prefixList from '@/assets/js/phone'

export default {
  name: 'Prefix',
  props: {
    prefix: {}
  },
  data() {
    return {
      // 手机前缀集合
      prefixList: [...prefixList]
    }
  },
  methods: {
    // 点击dropdown子菜单
    commandHandler(item) {
      this.$emit('setMobileArea', item.code)
    },
  }
}
</script>

<style lang="less" scoped>
  .prefix {
    position: absolute;
    left: 0;
    top: 0;
    width: 67px;
    height: 100%;
    .text {
      cursor: pointer;
      padding-left: 13px;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      z-index: 2;
    }
    &:hover {
      color: #2382EA;
      &::after {
        top: 17px;
        right: 6px;
        border-top: 6px solid #2382EA;
      }
    }
    &::after {
      content: "";
      position: absolute;
      top: 17px;
      right: 6px;
      border-top: 6px solid #9B9B9B;
      border-right: 3px solid transparent;
      border-left: 3px solid transparent;
    }
  }
  .el-dropdown-menu {
    height: 200px;
    .el-scrollbar {
      height: 100%;
    }
    .item {
      display: flex;
      justify-content: space-between;
      padding: 0 5px;
      height: 30px;
      line-height: 30px;
      &:hover {
        background: #f5f7fa;
      }
    }
  }
</style>
<style lang="less">
  .el-scrollbar__wrap {
    overflow: hidden;
    overflow-y: auto;
  }
</style>
