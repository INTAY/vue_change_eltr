<template>
  <div class="paddingLeft">
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#f1f1f1',color:'#000'}"
      stripe
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="index" width="50" align="center"></el-table-column>

      <el-table-column type="selection" width="55" align="center"></el-table-column>

      <el-table-column label="工具标识" width="200" prop="id" align="center"></el-table-column>

      <el-table-column label="工具名称" show-overflow-tooltip prop="name" align="center"></el-table-column>

      <el-table-column label="类型" show-overflow-tooltip prop="mainTypeName" align="center"></el-table-column>

      <el-table-column label="厂家" show-overflow-tooltip prop="factName" align="center"></el-table-column>

      <el-table-column label="型号" show-overflow-tooltip prop="modelName" align="center"></el-table-column>

      <el-table-column label="出厂日期" width="100" prop="mfdTime" align="center" :formatter="formatDate"></el-table-column>

      <el-table-column label="投运日期" width="100" prop="applyTime" align="center" :formatter="formatDate"></el-table-column>

      <el-table-column label="保管人" show-overflow-tooltip prop="keeper" align="center"></el-table-column>

      <el-table-column label="状态" prop="statusName" align="center" width="50"></el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="detail(scope.row)" class="buleBTN" size="mini">详情</el-button>
          <el-button @click="modify(scope.row)" class="buleBTN" size="mini">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { search } from "../../../../api/operation/mtTool";

export default {
  data() {
    return {
      tableData: [],
      paramSearch: {},
      multipleSelection: []
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    /**
     * 查询
     */
    search(param) {
      var self = this;
      
      // 调用查询接口
      search(param)
        .then(res => {
          self.tableData = res.data.records;
          // 渲染分页控件数据
          let pageData = {
            total: res.data.total,
            current: res.data.current,
            pageSize: res.data.size
          };
          self.$parent.$refs.pageModule.pageData = pageData;
        })
        .catch(err => {});
    },
    /**
     * 修改
     */
    modify(row) {
      let dialogAdd = this.$parent.$refs.tableOperation.$refs.dialogAdd;
      dialogAdd.dialogFormVisible = true;
      dialogAdd.formInline = row;
      dialogAdd.searchFactByType();
      dialogAdd.formInline.factId = row.factId;
      dialogAdd.searchModel();
      dialogAdd.formInline.modelId = row.modelId;
      this.$forceUpdate();
    },
    /**
     * 详情
     */
    detail(row) {
      this.$parent.$refs.tableOperation.$refs.dialogDetail.dialogFormVisible = true;
      this.$parent.$refs.tableOperation.$refs.dialogDetail.formInline = row;
    },
    /**
     * 表格选中
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 格式化日期
     */
    formatDate(row, column) {
      let data = row[column.property];
      if (data == null) {
        return null;
      }
      let dt = new Date(data);
      return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    }
  }
};
</script>

<style lang="scss" scoped>
.paddingLeft {
  //全局布局
  padding: 0 20px;
  margin-bottom: 60px;
}
</style>