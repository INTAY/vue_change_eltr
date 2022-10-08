<template>
  <div class="di">
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[20, 30, 40, 50]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="100"
      ></el-pagination>
    </div>
    <div class="sx">
      <el-button size="mini">刷新</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style lang="scss" scoped>

.block {
  margin-left: 25%;
  height: 41px;
  padding-top: 10px;
}
.sx {
  margin-left: 8px;
  padding-top: 10px;
}
.di {
  display: flex;
  width: 100%;
  background-color: #f7f7f7;
}
</style>