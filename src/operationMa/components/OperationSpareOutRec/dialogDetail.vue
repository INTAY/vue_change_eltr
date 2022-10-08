<template>
  <div>
    <!-- 弹出层 详情 -->
    <el-dialog
      title="出库申请单详情"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      class="yw"
      width="1200px"
    >
      <div>
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>基本信息
          </div>
          <div class="form-item-content">
            <el-form ref="form" label-width="120px" size="small">
              <el-row>
                <el-col :span="9">
                  <el-form-item label="出库申请名称：">{{formInline.recName}}</el-form-item>
                </el-col>

                <el-col :span="9">
                  <el-form-item label="出库申请编号：">{{formInline.id}}</el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="状态：">{{formInline.state}}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="9">
                  <el-form-item label="申请人：">{{formInline.checkManName}}</el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="申请时间：">{{formatDate(formInline.checkTime)}}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="描述：">{{formInline.descr}}</el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>备品备件
          </div>
          <div class="case-content">
            <el-table
              :data="tableData"
              :header-cell-style="{background:'#f1f1f1',color:'#000'}"
              stripe
              style="width: 100%"
            >
              <el-table-column
                label="备品备件类型"
                :show-overflow-tooltip="true"
                prop="spareType"
                :formatter="spareFormat"
                align="center"
              ></el-table-column>

              <el-table-column
                label="备品备件厂家"
                :show-overflow-tooltip="true"
                prop="factName"
                align="left"
              ></el-table-column>

              <el-table-column
                label="备品备件型号"
                :show-overflow-tooltip="true"
                prop="modelName"
                align="left"
              ></el-table-column>
              <el-table-column label="数量" align="center" prop="spareNum"></el-table-column>
              <el-table-column label="单位" align="center" prop="unit"></el-table-column>
              <el-table-column
                label="库房"
                :show-overflow-tooltip="true"
                prop="houseName"
                align="center"
              ></el-table-column>
              <el-table-column label="易耗品" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.consumable == 0">易耗品</span>
                  <span v-if="scope.row.consumable == 1">非易耗品</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                label="资产编号"
                :show-overflow-tooltip="true"
                prop="assetNo"
                align="left"
              ></el-table-column>
              <el-table-column
                label="保质期"
                :show-overflow-tooltip="true"
                prop="expireDate"
                align="left"
              ></el-table-column>
            </el-table>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>审批履历
          </div>
          <div class="case-content">
            <el-table
              :data="spareOutPros"
              :header-cell-style="{background:'#f1f1f1',color:'#000'}"
              stripe
              style="width: 100%"
            >
              <el-table-column
                label="处理时间"
                :show-overflow-tooltip="true"
                prop="handleTime"
                :formatter="formatDateRow"
                align="center"
              ></el-table-column>

              <el-table-column
                label="处理人"
                :show-overflow-tooltip="true"
                prop="handleManName"
                align="center"
              ></el-table-column>
              <el-table-column
                label="描述"
                :show-overflow-tooltip="true"
                prop="descr"
                align="center"
              ></el-table-column>

              <el-table-column
                label="出库申请状态"
                :show-overflow-tooltip="true"
                prop="state"
                :formatter="stateFormat"
                align="center"
              ></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { DICTDATA,  translatorDict } from "@/api/dict";
export default {
  data() {
    return {
      dialogFormVisible: false,
      formInline: {},
      tableData: [],
      spareOutPros: []
    };
  },
  methods: {
        // 通用审批状态 字典71
    stateFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.APPROVE_STATUS, cellValue);
      } else {
        return "";
      }
    },

    /**
     * 格式化日期
     */
    formatDate(data) {
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
            // 类型格式化
    spareFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.SPARE_SYSTEM, cellValue);
      } else {
        return "";
      }
    },

    /**
     * 格式化日期
     */
    formatDateRow(row, column) {
      let data = row[column.property];
      if (data == null) {
        return null;
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
    }
  }
};
</script>

<style lang="scss" scoped>
.s {
  padding: 15px 40px;
  .push {
    color: #fff;
    background: #006080;
    width: 120px;
  }
  .buttonColor {
    color: #006080;
    width: 120px;
  }
}

.form-item {
  margin-bottom: 10px;

  .form-item-content {
    background-color: #fcfcfc;
    border: 1px solid #eee;
    padding: 15px 15px 0;
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
}
/deep/ .el-form-item__label {
  color: #909090;
}
/deep/ .el-form-item--small .el-form-item__content{
  color: #303133;
}
</style>