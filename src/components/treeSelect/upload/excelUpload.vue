<template>
  <el-upload
    class="aniuEx"
    ref="upload"
    :on-success="handleImageSuccess"
    :multiple="false"
    accept=".xlsx"
    :action="importUrl"
    :headers="headers"
    :show-file-list="false"
    style="float: right">
    <el-button size="small" class="aniuEx">导入excel</el-button>
  </el-upload>
</template>

<script>
  import Vue from 'vue'

  const tonken = Vue.cookie.get('token');
  export default {
    props: {
      importUrl: {
        type: String,
        default: "",
      }
    },
    name: "excelUpload",
    data() {
      return{
        headers: {Authorization: "Bearer " + tonken},
      }
    },
    methods:{
      // 导入成功的回调
      handleImageSuccess(res, file, fileList) {
        if ("000000" === res.code) {
          this.$message.success(res.mesg)
        } else {
          this.$message.error(res.mesg)
        }
      }
    }
  }
</script>

<style scoped>
  .aniuEx {
    width: 120px;
    float: right;
  }
</style>
