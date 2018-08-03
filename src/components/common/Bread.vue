/**
*  @description： 顶部面包削组件
*  @author： guokang
*  @data:  2018.6.11
*/
<template>
  <div class="mask">
        {{name}}
  </div>
</template>

<script>
export default {
  name: "Bread",
  data() {
    return {};
  },
  props: {
    name: {}
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.mask {
  width: 60px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: rgba(102, 102, 102, 1);
  border-bottom: 2px solid #2382EA;
  padding-bottom:14px;
  margin-bottom: 14px;
}
</style>
