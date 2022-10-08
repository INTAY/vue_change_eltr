<template>
  <div>
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#f1f1f1',color:'#000'}"
      stripe
      @selection-change="handleSelectionChange"
      style="width: 100%; margin-bottom: 58px;"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>

      <el-table-column label="名称" width="200" show-overflow-tooltip prop="planName" align="left"></el-table-column>

      <el-table-column label="状态" width="100" :formatter="stateFormat" prop="state" align="center"></el-table-column>

      <el-table-column label="采购金额(元)" width="120" prop="totalMoney" align="center"></el-table-column>

      <el-table-column
        label="计划采购日期"
        :formatter="formatDate"
        width="120"
        prop="planBuyDate"
        align="center"
      ></el-table-column>

      <el-table-column label="填报人" prop="fillManName" align="center"></el-table-column>

      <el-table-column
        label="填报时间"
        :formatter="formatDateTime"
        width="150"
        prop="fillTime"
        align="center"
      ></el-table-column>

      <el-table-column label="来源" width="100" :formatter="originFormat" prop="sourceType" align="center"></el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="detail(scope.row)" class="buleBTN" size="mini">详情</el-button>
          <el-button @click="modify(scope.row)" class="buleBTN" size="mini">修改</el-button>
          <el-button @click="approve(scope.row)" class="buleBTN" size="mini">审批</el-button>
          <el-button @click="remove(scope.row)" class="redBTN" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagenation-wrap">
      <el-pagination
        style="display: inline-block"
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
  </div>
</template>

<script>
import { DICTDATA, translatorDict } from "@/api/dict";
import {
  queryByPage,
  remove
} from "@/api/operation/operationSpareBuyPlan";
export default {
  data() {
    return {
      param: {},
      tableData: [],
      multipleSelection: [],
      pageData: {
        total: 0,
        current: 1,
        size: 10
      }
    };
  },
  created() {
    this.queryPage({});
  },
  methods: {
    /**
     * 修改
     */
    modify(row) {
      let dialogAdd = this.$parent.$refs.dialogAdd;
      dialogAdd.dialogFormVisible = true;
      dialogAdd.getDetail(row.id);
    },
    /**
     * 翻译“状态”字典
     */
    stateFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.APPROVE_STATUS, cellValue);
      } else {
        return "";
      }
    },
    /**
     * 翻译“来源”字典
     */
    originFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.SPARE_BUY_PLAN_ORIGIN, cellValue);
      } else {
        return "";
      }
    },
    /**
     * 详情
     */
    detail(row) {
      let dialogDetail = this.$parent.$refs.dialogDetail;
      dialogDetail.dialogDetailVisible = true;
      dialogDetail.getDetail(row.id);
    },
    /**
     * 查询
     */
    queryPage(param) {
      this.param = param;
      // 处理日期
      if (this.param.searchDate && this.param.searchDate !== "") {
        this.param.planBuyStartDate = this.param.searchDate[0];
        this.param.planBuyEndDate = this.param.searchDate[1];
      } else {
        this.param.planBuyStartDate = "";
        this.param.planBuyEndDate = "";
      }

      queryByPage(param).then(res => {
        this.tableData = res.data.records;

        // 分页
        this.pageData = {
          total: res.data.total,
          current: res.data.current,
          size: res.data.size
        };
      });
    },
    /**
     * 审批
     */
    approve(row) {
      let dialogApprove = this.$parent.$refs.dialogApprove;
      dialogApprove.dialogDetailVisible = true;
      dialogApprove.getDetail(row.id);
    },
    /**
     * 删除
     */
    remove(row) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: ""
      })
        .then(() => {
          remove(row.id).then(res => {
            if (res.code === "000000") {
              this.$message({
                showClose: true,
                message: "删除成功！",
                type: "success"
              });

              // 重新查询数据
              this.queryPage({
                current: 1
              });
            } else {
              this.$message({
                message: res.mesg,
                type: "warning"
              });
            }
          });
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 每条页数变化
     */
    handleSizeChange(val) {
      this.pageData.size = val;
      this.pageData.current = 1;
      this.param.size = this.pageData.size;
      this.param.current = this.pageData.current;
      this.queryPage(this.param);
    },
    /**
     * 点击某页
     */
    handleCurrentChange(val) {
      this.pageData.current = val;
      this.param.size = this.pageData.size;
      this.param.current = this.pageData.current;
      this.queryPage(this.param);
    },
    refresh() {},
    /**
     * 格式化日期
     */
    formatDateTime(row, column) {
      let data = row[column.property];
      if (data == null) {
        return "";
      }
      let dt = new Date(data);
      return (
        dt.getFullYear() +
        "-" +
        (dt.getMonth() + 1) +
        "-" +
        dt.getDate() +
        " " +
        dt.getHours() +
        ":" +
        dt.getMinutes() +
        ":" +
        dt.getSeconds()
      );
    },
    formatDate(row, column) {
      let data = row[column.property];
      if (data == null) {
        return "";
      }
      let dt = new Date(data);
      return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    }
  }
};
</script>

<style lang="scss" scoped>
.pagenation-wrap {
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