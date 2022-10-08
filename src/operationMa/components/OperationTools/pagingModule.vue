<template>
  <div class="di">
    <el-pagination style="display: inline-block"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageData.current"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageData.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
      ></el-pagination>
    <el-button size="mini" @click="refresh">刷新</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageData: {
        total: 0,
        current: 1,
        size: 10
      }
    };
  },
  methods: {
    /**
     * 刷新
     */
    refresh() {
      let formInline = this.$parent.$refs.fillBar.formInline;
      formInline.size = this.pageData.size;
      formInline.current = this.pageData.current;
      this.$parent.$refs.table.search(formInline);
    },
    /**
     * 每页条数变化
     */
    handleSizeChange(val) {
      let formInline = this.$parent.$refs.fillBar.formInline;
      this.pageData.size = val;
      formInline.size = this.pageData.size;
      formInline.current = this.pageData.current;
      this.$parent.$refs.table.search(formInline);
    },
    /**
     * 点击某页
     */
    handleCurrentChange(val) {
      let formInline = this.$parent.$refs.fillBar.formInline;
      this.pageData.current = val;
      formInline.size = this.pageData.size;
      formInline.current = this.pageData.current;
      this.$parent.$refs.table.search(formInline);
    }
  }
};
</script>

<style lang="scss" scoped>
.block {
  display: inline-block;
}

.di {
  position: fixed;
  bottom: 0px;
  background: #f7f7f7;
  z-index: 999;
  text-align: center;
  left: 220px;
  right: 0;
  padding: 10px 0;
  line-height: 25px;
}
</style>