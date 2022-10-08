<template>
  <div class="bread">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="item in data" :key="item">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props:['data'],
  mounted() {},
  destroyed() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.bread {
  height: 30px;
  border-bottom: 1px solid #e6e6e6;
  box-sizing: border-box;
}
</style>
