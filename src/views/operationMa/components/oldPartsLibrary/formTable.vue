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

      <el-table-column type="selection" width="55" align="center" />

      <el-table-column label="旧件编号" prop="id" align="center"></el-table-column>

      <el-table-column label="旧件类型" :formatter="typeFormat" prop="spareType" align="center"></el-table-column>

      <el-table-column label="旧件型号" prop="modelId" align="center"></el-table-column>

      <el-table-column label="单位" prop="unit" align="center"></el-table-column>

      <el-table-column label="状态" :formatter="stateFormat" prop="state" align="center"></el-table-column>

      <el-table-column label="旧件入库时间" :formatter="dateFormat" prop="spareImportTime" align="center"></el-table-column>

      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button class="buleBTN" size="mini" @click="getDetail(scope.row)">详情</el-button>
          <el-button
            class="buleBTN widthBTN"
            size="mini"
            @click="serviceConfirm(scope.row)"
            v-if="scope.row.state==1"
          >维修确认</el-button>
          <el-button
            size="mini"
            @click="serviceConfirm(scope.row)"
            v-if="scope.row.state!=1"
            disabled="disabled"
            class="buleBTN widthBTN"
          >维修确认</el-button>
          <el-button @click="scrap(scope.row)" class="redBTN" size="mini" v-if="scope.row.state==1">报废</el-button>
          <el-button
            @click="scrap(scope.row)"
            
            size="mini"
            v-if="scope.row.state!=1"
            disabled="disabled"
            class="redBTN"
          >报废</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center append-to-body>
      <p class="dialog-p">确定报废吗？</p>
      <textarea v-model="faultScrap"></textarea>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmScrap">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryPage,
  updateOk,
  scrapSpare,
} from "@/api/operation/oldPartsLibrary";
import { DICTDATA, translatorDict } from "@/api/dict";
export default {
  data() {
    return {
      isStop: false,
      isStart: false,
      tableData: [],
      pageData: {
        total: 0,
        current: 1,
        size: 10,
      },
      centerDialogVisible: false,
      faultScrap: "",
      multipleSelection: [],
      argsList: {},
    };
  },
  mounted() {
    this.queryPage({});
  },
  methods: {
    dateFormat(row, column) {
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
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    stateFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.OLD_PARTS_LIBRARY, cellValue);
      } else {
        return "";
      }
    },
    typeFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.SPARE_SYSTEM, cellValue);
      } else {
        return "";
      }
    },
    queryPage(param) {
      queryPage(param).then((res) => {
        if (res.code === "000000") {
          this.tableData = res.data.records;
          // 渲染分页控件数据
          this.pageData = {
            total: res.data.total,
            current: res.data.current,
            pageSize: res.data.size,
          };
          this.$parent.$refs.pageModule.pageData = this.pageData;
        } else {
          this.$message({
            type: "warning",
            message: `查询失败，${res.data}！`,
          });
        }
      });
    },
    getDetail(arg) {
      let dialogDetail = this.$parent.$refs.dialogDetail;
      dialogDetail.formInline = {};
      dialogDetail.dialogDetailVisible = true;
      dialogDetail.getDetail(arg.id);
    },
    serviceConfirm(arg) {
      this.$confirm("确定已修复吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateOk(arg.id).then((res) => {
            if (res.code == "000000") {
              this.queryPage(this.$parent.$refs.fillBar.formInline);
              this.$message({
                type: "success",
                message: "修复成功!",
              });
            } else {
              this.$message({
                type: "warning",
                message: `修改失败，${res.data}！`,
              });
            }
          });
        })
        .catch(() => {});
    },
    confirmScrap() {
      scrapSpare(this.argsList.id, { scrapDesc: this.faultScrap }).then(
        (res) => {
          if (res.code == "000000") {
            this.queryPage(this.$parent.$refs.fillBar.formInline);
            this.centerDialogVisible = false;
            this.$message({
              type: "success",
              message: "报废成功!",
            });
          } else {
            this.$message({
              type: "warning",
              message: `报废失败，${res.data}！`,
            });
          }
        }
      );
    },
    scrap(arg) {
      this.argsList = {};
      this.centerDialogVisible = true;
      this.argsList = arg;
      this.faultScrap = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.paddingLeft {
  //全局布局
  padding-left: 20px;
}
textarea {
  width: 100%;
  min-height: 100px;
}
.dialog-p {
  text-align: center;
}
.disable-label {
  color: #c0c0c0 !important;
}
</style>
