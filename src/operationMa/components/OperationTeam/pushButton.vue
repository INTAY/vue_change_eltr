<template>
  <div>
    <div class="s">
      <el-button size="small" class="push" @click="dialogFormVisible = true">新增运维组</el-button>
      <el-button size="small" class="push">批量删除</el-button>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.s {
  padding: 15px 40px;
  .push {
    color: white;
    background: #006080;
    width: 120px;
  }
}
</style>