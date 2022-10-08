<template>
  <div class="paddingLeft">
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#f1f1f1',color:'#000'}"
      stripe
      style="width: 100%"
    >
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="工单编号" prop="id" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="openDetailWin(scope.row.id)">{{ scope.row.id }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="站点名称" prop="staName" align="center" />
      <el-table-column label="工单状态" :formatter="sheetstateFormat" prop="state" align="center" />
      <el-table-column label="工单类型" :formatter="sheetType" prop="sheetType" align="center" />
      <el-table-column label="工单级别" :formatter="sheetLevelFormat" prop="sheetLevel" align="center" />
      <el-table-column label="运维班组" prop="groupName" align="center" />
      <el-table-column label="工单来源" :formatter="wrokSheetCome" prop="sourceType" align="center" />
      <el-table-column label="关联工单" prop="parentId" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="openDetailWin(scope.row.parentId)">{{ scope.row.parentId }}</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            class="buleBTN"
            size="mini"
            @click="sendOrder(scope.row)"
            v-if="scope.row.state==1"
          >派单</el-button>
          <el-button
            size="mini"
            @click="sendOrder(scope.row)"
            v-if="scope.row.state!=1"
            disabled="disabled"
            class="disable-label buleBTN"
          >派单</el-button>

          <el-button
            @click="getFinish(scope.row)"
            class="buleBTN"
            size="mini"
            v-if="scope.row.state==5"
          >办结</el-button>
          <el-button
            size="mini"
            @click="getFinish(scope.row)"
            v-if="scope.row.state!=5"
            disabled="disabled"
            class="disable-label buleBTN"
          >办结</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <!-- 配件更换记录 -->
      <el-dialog
        title="配件更换记录"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :visible.sync="fittingsChangeWin"
      >
        <el-table
          :data="fittingsData"
          stripe
          :header-cell-style="{background:'#f1f1f1',color:'#000'}"
          highlight-current-row
        >
          <el-table-column type="index" width="50" />
          <el-table-column label="设备类型" :formatter="sheetTypeFormat" prop="state" align="center" />
          <el-table-column label="故障标识" prop="alarmId" align="center" />
          <el-table-column label="描述" prop="descr" align="center" />
          <el-table-column label="发生时间" prop="generaTime" align="center" />
        </el-table>
      </el-dialog>
      <!-- 办结弹窗 -->
      <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center append-to-body>
        <p class="dialog-p">确定办结吗？</p>
        <textarea v-model="faultScrap"></textarea>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmScrap">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 派单 -->
      <el-dialog
        title="派单"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :visible.sync="postOrderDialog"
        class="yw"
        width="1150px"
        top="18vh"
        style="left:80px"
      >
        <el-form :inline="true" class="demo-form-inline" :model="exampleData">
          <div class="form-item" style="width: 100%">
            <div class="form-item-title">
              <span class="line" />基本信息
            </div>
            <div class="form-item-content">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="工单编号:">
                    <span v-text="exampleData.id" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="工单类型:">
                    <span>{{typeFormat(exampleData.sheetType)}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="工单状态:">
                    <span>{{stateFormat(exampleData.state)}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="工单级别:">
                    <span>{{levelFormat(exampleData.sheetLevel)}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="计划完成时间:" style="width: 120%">
                    <span v-text="dateFormat(exampleData.planFinishTime)" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="工单来源:">
                    <span>{{sourceFormat(exampleData.sourceType)}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="联系人:">
                    <span v-text="exampleData.linkMan" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="联系电话:">
                    <span v-text="exampleData.tel" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="站点名称:" style="width: 120%">
                    <span v-text="exampleData.staName" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="所属区域:" style="width: 120%">
                    <span v-text="exampleData.regId" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="创建人:">
                    <span v-text="exampleData.createManName" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="创建时间:">
                    <span v-text="dateFormat(exampleData.createTime)" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="站点地址:">
                    <span v-text="exampleData.addr" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <br />
            <div class="form-item-title">
              <span class="line" />设备
            </div>
            <div class="form-item-content">
              <el-table
                :data="tableDeviceData"
                stripe
                :header-cell-style="{background:'#f1f1f1',color:'#000'}"
              >
                <el-table-column type="index" width="50" />
                <el-table-column label="设备编号" prop="devId" align="center" />
                <el-table-column label="设备名称" prop="devName" align="center" />
                <el-table-column
                  label="设备类型"
                  :formatter="sheetTypeFormat"
                  prop="state"
                  align="center"
                />
                <el-table-column label="故障标识" prop="alarmId" align="center" />
                <el-table-column label="描述" prop="descr" align="center" />
                <el-table-column
                  label="发生时间"
                  :formatter="dateTableFormat"
                  prop="generaTime"
                  align="center"
                />
              </el-table>
            </div>
            <br />
            <div class="form-item-title">
              <span class="line" />运维人员
            </div>
            <div class="form-item-content">
              <span>选择运维人员</span>
              <el-select v-model="human" filterable placeholder="请选择">
                <el-option
                  v-for="item in humanOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </el-form>
        <br />
        <div class="dialog-footer">
          <el-button type="primary" class="btn-long" size="small" @click="saveForm">确认</el-button>
          <el-button
            size="small"
            class="btn-long"
            style="margin-left: 38%"
            @click="postOrderDialog = false"
          >取消</el-button>
          
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  queryByPage,
  dispatchById,
  confirmedById,
  getDetails,
  queryUser,
} from "../../../../api/operation/orderManage";
import { DICTDATA, translatorDict } from "@/api/dict";
export default {
  data() {
    return {
      orderDetailWin: false,
      fittingsChangeWin: false,
      centerDialogVisible: false,
      cancleWin: false,
      postOrderDialog: false,
      pageData: {
        total: 0,
        current: 1,
        size: 10,
      },
      exampleData: {},
      tableData: [],
      // 配件更换记录数据
      fittingsData: [],
      faultScrap: "",
      argsList: {},
      tableDeviceData: [],
      exampleData: {},
      humanOptions: [],
      human: "",
      orgId: JSON.parse(sessionStorage.getItem("user")).orgId,
      getSendOrderRow: {},
    };
  },
  mounted() {
    this.queryPage({});
  },
  methods: {
    dateFormat(time) {
      if (!time) return;
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
    dateTableFormat(row, column) {
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
    levelFormat(value) {
      if (value !== "") {
        return translatorDict(DICTDATA.ORDER_LEVEL, value);
      } else {
        return "";
      }
    },
    sourceFormat(value) {
      if (value !== "") {
        return translatorDict(DICTDATA.ORDER_SOURCE, value);
      } else {
        return "";
      }
    },
    queryPage(param) {
      queryByPage(param).then((res) => {
        this.tableData = res.data.records;

        // 渲染分页控件数据
        this.pageData = {
          total: res.data.total,
          current: res.data.current,
          pageSize: res.data.size,
        };
        this.$parent.$refs.pageModule.pageData = this.pageData;
      });
    },
    stateFormat(value) {
      if (value !== "") {
        return translatorDict(DICTDATA.ORDER_STATUS, value);
      } else {
        return "";
      }
    },
    sheetstateFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.ORDER_STATUS, cellValue);
      } else {
        return "";
      }
    },
    typeFormat(value) {
      if (value !== "") {
        return translatorDict(DICTDATA.ORDER_TYPE, value);
      } else {
        return "";
      }
    },
    sheetTypeFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.DEVICE_TYPE, cellValue);
      } else {
        return "";
      }
    },
    sheetLevelFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.ORDER_LEVEL, cellValue);
      } else {
        return "";
      }
    },
    wrokSheetCome(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.ORDER_SOURCE, cellValue);
      } else {
        return "";
      }
    },
    sheetType(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.ORDER_TYPE, cellValue);
      } else {
        return "";
      }
    },
    sendOrder(row) {
      this.getSendOrderRow = {};
      getDetails(row.id).then((res) => {
        this.exampleData = res.data.workSheetDetailVo;
        this.tableDeviceData = res.data.workSheetDevVos;
      });
      queryUser({ orgId: this.orgId }).then((res) => {
        if (res.code === "000000") {
          this.humanOptions = res.data.records;
        }
      });
      this.postOrderDialog = true;
      this.getSendOrderRow = row;
    },
    getFinish(row) {
      this.argsList = {};
      this.centerDialogVisible = true;
      this.argsList = row;
      this.faultScrap = "";
    },
    confirmScrap() {
      confirmedById({ suggest: this.faultScrap, id: this.argsList.id }).then(
        (res) => {
          if (res.code == "000000") {
            this.$message({
              type: "success",
              message: "办结成功!",
            });
          } else {
            this.$message({
              type: "warning",
              message: `办结失败，${res.data}`,
            });
          }
        }
      );
    },
    openDetailWin(arg) {
      let dialogDetail = this.$parent.$refs.dialogDetail;
      dialogDetail.orderDetailWin = true;
      dialogDetail.getDetail(arg);
    },
    // 配件更换记录弹框
    openFittingsWin() {
      this.fittingsChangeWin = true;
    },
    saveForm() {
      let params = {
        id: this.getSendOrderRow.id,
        receiveManId: this.human,
      };
      dispatchById(params).then((res) => {
        if (res.code == "000000") {
          this.$message({
            type: "success",
            message: "派单成功!",
          });
          this.queryPage({});
          this.postOrderDialog = false;
        } else {
          this.$message({
            type: "warning",
            message: `派单失败，${res.data}`,
          });
        }
      });
      this.human = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.paddingLeft {
  //全局布局
  padding-left: 20px;
}

/deep/ .el-table {
  background-color: #f2f2f2;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.form-item-title {
  font-size: 16px;
  line-height: 30px;
  color: #434343;
  margin-bottom: 5px;
  .line {
    display: inline-block;
    vertical-align: middle;
    width: 4px;
    height: 14px;
    margin-right: 10px;
    background-color: #24b3ca;
    border-radius: 4px;
  }
}

td.el-table__expanded-cell {
  background-color: #f2f2f2;
}
textarea {
  width: 100%;
  min-height: 100px;
}
.dialog-p {
  text-align: center;
}
.form-item-content {
  background-color: #fcfcfc;
  border: 1px solid #eee;
  padding: 15px;
}
.disable-label {
  color: #c0c0c0 !important;
}
</style>
