<template>
<div class="di">
  <div class="block" >
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[20, 30, 40, 50]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="100">     
    </el-pagination>
  </div>  
  <div class="sx">
    <el-button size="mini">刷新</el-button>
  </div>
</div>

</template>
<script>
  export default {
    methods: {
      handleSizeChange(val) {
      },
      handleCurrentChange(val) {
      }
    },
    data() {
      return {
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4
      };
    }
  }
</script>

<style lang="scss" scoped>
.div {
  padding: 20px;
  
}
.block{
  margin-left:25% ;
  height: 41px;
}
.sx{
  margin-top:2px ;
}
.di{
  display: flex;
  width: 100%;
  background-color: #f7f7f7;
}
</style>
