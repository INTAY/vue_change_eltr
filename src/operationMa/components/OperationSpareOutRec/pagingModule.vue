<template>
       <div class="page-wrap-fixed" id="page-wrap-fixed">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pageData.size"
          :total="pageData.total"
          :current-page="pageData.current"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper, slot"
        >
          <span class="el-pagination__jump page-option-wrap">
            <a class="page-option-icon" href="javascript:;" @click="refresh" title="刷新">
              <img src="/static/img/7.png" />
            </a>
            <i class="split-line"></i>
            <a class="page-option-icon" href="javascript:;" @click="exportTable" title="导出">
              <img src="/static/img/8.png" />
            </a>
          </span>
        </el-pagination>
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
    mounted() {
    let elementResizeDetectorMaker = require("element-resize-detector");
    let tableWidth =  this.$parent.$refs.tableOperation.nowWidth;
    let pageWidth = document.getElementById("page-wrap-fixed");
    let erd = elementResizeDetectorMaker();
    erd.listenTo(tableWidth, function(element) {
      pageWidth.style.width = element.offsetWidth + "px";
    });
  },

  methods: {
    /**
     * 每页条数变化
     */
    handleSizeChange(val) {
      this.$parent.$refs.table.search({
        size: val
      });
    },
    /**
     * 点击某页
     */
    handleCurrentChange(val) {
      this.$parent.$refs.table.search({
        current: val
      });
    },
    // 刷新
    refresh() {
       this.$parent.$refs.table.search({
        current: 1
      });
    },
    exportTable() {}
  }
};
</script>

<style lang="scss" scoped>

</style>