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
    <el-button size="mini" @click="exportFun">导出</el-button>
  </div>
</template>

<script>
import { exportMonitorData } from '@/api/platform/generalOverview';
import moment from 'moment';

export default {
  data() {
    return {
      pageData: {
        total: 0,
        current: 1,
        size: 0
      },
      exportData: {
        headers: [],
        values: [],
      },
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
      this.$parent.$refs.formTable.queryPage(formInline);
    },
    /**
     * 每页条数变化
     */
    handleSizeChange(val) {
      let formInline = this.$parent.$refs.fillBar.formInline;
      this.pageData.size = val;
      formInline.size = this.pageData.size;
      formInline.current = this.pageData.current;
      this.$parent.$refs.formTable.queryPage(formInline);
    },
    /**
     * 点击某页
     */
    handleCurrentChange(val) {
      let formInline = this.$parent.$refs.fillBar.formInline;
      this.pageData.current = val;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      this.$parent.$refs.formTable.queryPage(formInline);
      // formInline.current = '1'
    },
    exportFun() {
      if (this.$parent.$refs.formTable.tableData.length == 0) {
        this.$message({
          showClose: true,
          message: '表格数据0条不可导出',
          type: 'warning'
        });
        return 
      }
      //   当前选择的table列
      let nowColList = this.$parent.$refs.formTable.$refs.tableSour.layout.store.states.columns
      //  选择的查询条件
      let seclectFormLine = this.$parent.$refs.fillBar.formInline
      //  置空
      seclectFormLine.headers = [];
      seclectFormLine.values = [];
      //  掐头去尾 去undefind
      let filerList = nowColList.slice(1,nowColList.length-1).filter( (item,index,arr) => {
        if (item.property != undefined) {
          return arr
        }
      })
      //  格式化
      filerList.forEach(item => {
        seclectFormLine.headers.push(item.label)
        seclectFormLine.values.push(item.property)
      });

      if (seclectFormLine.pushTime && seclectFormLine.pushTime.length > 0) {
          seclectFormLine.pushEnd = moment(seclectFormLine.pushTime[1]).format('YYYY-MM-DD');
          seclectFormLine.pushStart = moment(seclectFormLine.pushTime[0]).format('YYYY-MM-DD');
      }
      if (seclectFormLine.getTime && seclectFormLine.getTime.length > 0) {
          seclectFormLine.receiveEnd = moment(seclectFormLine.getTime[1]).format('YYYY-MM-DD');
          seclectFormLine.receiveStart = moment(seclectFormLine.getTime[1]).format('YYYY-MM-DD');
      }
      delete seclectFormLine.pushTime
      delete seclectFormLine.getTime
      if(!nowColList.sortCol) {
        seclectFormLine.sortCol= "push_time"
        seclectFormLine.sortType= -1
      }
      exportMonitorData(seclectFormLine).then((res) => {
        if(res.code === '000000') {
          window.open(res.data)
        }
      })
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
