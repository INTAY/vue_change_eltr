<template>
  <div class="bread">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="cont">
      <el-breadcrumb-item v-for="(item,index) in data" :key="index">
        <span :class="{current: index == (data.length-1)}">{{item}}</span>
      </el-breadcrumb-item>
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
  width: 100%;
  height: 45px;
  border-bottom: 1px solid #e6e6e6;
  box-sizing: border-box;
  .cont{
    padding-top:10px;
  }
}

</style>
