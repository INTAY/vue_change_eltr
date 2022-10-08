<template>
  <div class="paddingLeft">
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#f1f1f1',color:'#000'}"
      stripe
      style="width: 100%"
    >
      <el-table-column type="index" width="50" align="center"></el-table-column>

      <el-table-column label="出库申请标识" width="200" prop="id" align="center"></el-table-column>

      <el-table-column label="出库申请名称" prop="recName" align="center"></el-table-column>


      <el-table-column label="状态" prop="state" :formatter="stateFormat" align="center"></el-table-column>

      <el-table-column
        width="200"
        label="申请时间"
        prop="checkTime"
        :formatter="formatDate"
        align="center"
      ></el-table-column>

      <el-table-column label="审批时间" prop="fillTime" :formatter="formatDate" align="center"></el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="detail(scope.row)" class="buleBTN" size="mini">详情</el-button>
          <el-button
            @click="approve(scope.row)"
            v-if="scope.row.state == 3||5 ? false:true"
            class="buleBTN"
            size="mini"
          >审批</el-button>
          <el-button
            @click="cancelled(scope.row)"
            v-if="scope.row.state == 4? true:false"
            class="redBTN"
            size="mini"
          >作废</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  queryByPage,
  getSpareExportRec,
  reject
} from "@/api/operation/operationSpareOutRec";
import { DICTDATA, getDict, translatorDict } from "@/api/dict";
export default {
  data() {
    return {
      tableData: [],
      paramSearch: {},
      tableWidth:''
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    /**
     * 修改
     */
  
    /**
     * 审批
     */
    approve(row) {
      let dialogApprove = this.$parent.$refs.dialogApprove;
      dialogApprove.dialogFormVisible = true;
      dialogApprove.formInline = JSON.parse(JSON.stringify(row));
      dialogApprove.formInline.state = translatorDict(
        DICTDATA.APPROVE_STATUS,
        Number(row.state)
      );
      // 查询出库申请单中的备品备件
      getSpareExportRec(row.id).then(res => {
        // 备品备件列表
        dialogApprove.tableData = res.data.spareInfoVos;
      });
    },
    // 作废
    cancelled(row) {
      // reject(row.id).then(res=>{

      // })
      this.$confirm("确认作废?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          reject(row.id).then(res => {
            if (res.code === "000000") {
              this.$message({
                showClose: true,
                message: "已作废！",
                type: "success"
              });

              // 重新查询数据
              this.search({
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
        .catch(() => {
          this.$message.error("作废失败");
        });
    },
    /**
     * 详情
     */
    detail(row) {
      console.log(row.state == 3);

      let dialogDetail = this.$parent.$refs.dialogDetail;
      dialogDetail.dialogFormVisible = true;
      dialogDetail.formInline = JSON.parse(JSON.stringify(row));
      dialogDetail.formInline.state = translatorDict(
        DICTDATA.APPROVE_STATUS,
        Number(row.state)
      );

      // 查询出库申请单中的备品备件
      getSpareExportRec(row.id).then(res => {
        // 备品备件列表
        dialogDetail.tableData = res.data.spareInfoVos;
        // 审批履历列表
        dialogDetail.spareOutPros = res.data.spareExportPros;
      });
    },
    search() {
      this.paramSearch = this.$parent.$refs.fillBar.formInline;

      // 处理日期
      if (this.paramSearch.searchDate && this.paramSearch.searchDate !== "") {
        this.paramSearch.startTime = this.paramSearch.searchDate[0];
        this.paramSearch.endTime = this.paramSearch.searchDate[1];
      } else {
        this.paramSearch.startTime = "";
        this.paramSearch.endTime = "";
      }

      queryByPage(this.paramSearch)
        .then(res => {
          // 渲染表格数据
          console.log(typeof res.data.records);
          console.log(typeof res.data);

          this.tableData = res.data.records;
          // 渲染分页控件数据
          let pageData = {
            total: res.data.total,
            current: res.data.current,
            pageSize: res.data.size
          };
          this.$parent.$refs.pageModule.pageData = pageData;
        })
        .catch(err => {});
    },
    // 状态格式化
    stateFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.APPROVE_STATUS, cellValue);
      } else {
        return "";
      }
    },

    // /**
    //  * 格式化日期
    //  */
    formatDate(row, column) {
      let time = row[column.property];
      let date = new Date(time);
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
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
