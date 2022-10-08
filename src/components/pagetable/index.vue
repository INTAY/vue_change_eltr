<template>
  <div>
    <el-table
      ref="pagetable"
      :data="data"
      :height="height"
      :max-height="maxHeight"
      :stripe="stripe"
      style="width: 100%; margin-bottom: 42px;padding: 0 10px;"
      @selection-change="handleSelectionChange"
    >
      <slot></slot>
    </el-table>
    <div class="di hidden-sm-and-down">
      <el-pagination
        style="margin-left:-450px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="layout"
        :total="total">
      </el-pagination>
      <el-button-group>
        <el-button class="refresh_" size="mini" icon="el-icon-refresh" @click="handleRefresh"></el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
export default {
  name: 'ElPageTable',
  props: {
    data: {
      default() {
        return [];
      },
      type: Array
    },
    height: [String, Number],
    maxHeight: [String, Number],
    stripe: {
      default() {
        return true;
      },
      type: Boolean
    },
    size: {
      default() {
        return "mini";
      },
      type: String
    },
    border: {
      default() {
        return true;
      },
      type: Boolean
    },
    currentPage: {
      default() {
        return 1;
      },
      type: Number
    },
    pageSizes: {
      default() {
        return [20, 40, 60, 80, 100];
      },
      type: Array
    },
    pageSize: {
      default() {
        return 10;
      },
      type: Number
    },
    layout: {
      default() {
        return 'total, sizes, prev, pager, next, jumper';
      },
      type: String
    },
    total: {
      default() {
        return 0;
      },
      type: Number
    }
  },
  data: function() {
    return {
    };
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('size-change', val);
    },
    handleCurrentChange(val) {
      this.$emit('current-change', val);
    },
    handleRefresh(){
      this.$emit('refresh-data');
    },
    handleSelectionChange(val){
      this.$emit('selection-change', val);
    }
  },
  created() {
  },
  mounted() {},
  // 注销window.onresize事件
  beforeRouteLeave(to, from, next) {
    //离开组件的时候触发
  }
};
</script>

<style lang="scss" scoped>
  .di {
  	z-index: 9;
    position: fixed;
    width: 100%;
    bottom: 0px;
    background: #f7f7f7;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    line-height: 25px;
    border-top: 1px solid #bcbcbc;
  }
  .refresh_{
  	border-color: #f3f3f3;
  	height: 28px;
  	width: 40px;
  	margin-left: 10px;
  	box-sizing: border-box;
  	padding-left: 12px;
  }
</style>
