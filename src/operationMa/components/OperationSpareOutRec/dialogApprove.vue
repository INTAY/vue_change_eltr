<template>
  <div>
    <!-- 弹出层 详情 -->
    <el-dialog
      title="出库申请单审批"
      :visible.sync="dialogFormVisible"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
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
            <span class="line"></span>审批说明
          </div>
          <div class="case-content">
            <el-input
              class="width-620"
              type="textarea"
              v-model="spareOutProForm.descr"
              :rows="2"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </div>

        <div class="dialog-form-option">
          <el-button type="primary" class="btn-long" @click="approve(4)" size="small">驳回</el-button>
          <el-button size="small" class="btn-long" @click="approve(3)">通过</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { approval } from "@/api/operation/operationSpareOutRec";
import { DICTDATA, getDict, translatorDict } from "@/api/dict";

export default {
  data() {
    return {
      dialogFormVisible: false,
      formInline: {},
      tableData: [],
      spareOutProForm: {}
    };
  },
  methods: {
    /**
     * 审批
     */
    approve(result) {
      // 出库申请单标识
      this.spareOutProForm.recId = this.formInline.id;
      // 状态
      this.spareOutProForm.state = result;
      approval(this.spareOutProForm).then(res => {
        if (res.code === "000000" && res.data) {
          this.$message({
            showClose: true,
            message: "审批成功！",
            type: "success"
          });
          this.dialogFormVisible = false;
          // 重新查询数据
          this.$parent.$refs.table.search({
            current: 1
          });
        } else {
          this.$message.error(res.mesg);
        }
      });
    },
    reject(){
      this.dialogFormVisible = false;
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
.dialog-form-option {
  text-align: center;

  .btn-long {
    width: 120px;
  }
}

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
</style>