<template>
  <div class="aa">
    <el-form
      :inline="true"
      :model="formInline"
      size="small"
      label-width="100px"
      class="demo-form-inline"
    >
      <div class="yi">
        <el-form-item label="字典标识:">
          <span>{{formInline.id}}</span>
        </el-form-item>
        <el-form-item label="字典名称:">
          <span>{{formInline.name}}</span>
        </el-form-item>
        <el-form-item label="字典码:">
          <span>{{formInline.value}}</span>
        </el-form-item>
        <el-form-item label="排序:">
          <span>{{formInline.sortNo}}</span>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "tf",
    data() {
      return {
        formInline: {}
      };
    },
    methods: {}
  };
</script>
<style lang="scss" scoped>
  * {
    list-style: none;
  }

  .aa {
    background: #fcfcfc;
  }

  .yi {
    padding-top: 15px;
    display: flex;
    flex-wrap: wrap;
  }

  .a {
    width: 500px;
  }
</style>
