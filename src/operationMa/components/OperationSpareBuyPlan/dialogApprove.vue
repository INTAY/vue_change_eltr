<template>
  <div>
    <el-dialog
      title="审批采购计划"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="dialogDetailVisible"
      width="1000px"
    >
      <div>
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>基本信息
          </div>
          <div class="form-item-content">
            <el-form ref="form" label-width="120px" size="small">
              <el-row>
                <el-col :span="8">
                  <el-form-item :show-overflow-tooltip="true" label="采购计划名称：">{{formInline.planName}}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="状态：">{{stateFormat(formInline.state)}}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="采购金额：">{{formInline.totalMoney}}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="计划采购日期：">{{formatDate(formInline.planBuyDate)}}</el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="审批人：">{{formInline.checkManName}}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="审批时间：">{{formatDateTime(formInline.handleTime)}}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="填报人：">{{formInline.fillManName}}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="填报时间：">{{formatDateTime(formInline.fillTime)}}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="采购计划来源：">{{originFormat(formInline.sourceType)}}</el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>采购内容
          </div>
          <div>
            <el-table
              :data="tableData"
              :header-cell-style="{background:'#f1f1f1',color:'#000'}"
              stripe
              style="width: 100%"
            >
              <el-table-column type="index" width="50" align="center"></el-table-column>
              <el-table-column label="类型" show-overflow-tooltip :formatter="typeFormat" prop="spareType" align="center"></el-table-column>
              <el-table-column label="厂家" show-overflow-tooltip prop="factName" align="center"></el-table-column>
              <el-table-column label="型号" show-overflow-tooltip prop="modelName" align="center"></el-table-column>
              <el-table-column label="数量" prop="devNum" align="center"></el-table-column>
              <el-table-column label="单位" prop="unit" align="center"></el-table-column>
              <el-table-column label="单价(元)" prop="unitPrice" align="center"></el-table-column>
              <el-table-column label="总价(元)" prop="totalPrice" align="center"></el-table-column>
            </el-table>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>审批说明
          </div>
          <div>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="formInline.description"
            ></el-input>
          </div>
        </div>

        <div class="dialog-footer">
          <el-button size="small" class="btn-long" @click="reject" type="primary">驳回</el-button>
          <el-button size="small" class="btn-long" @click="pass" type="primary">通过</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { DICTDATA, translatorDict } from "@/api/dict";
import { getDetail, approval } from "@/api/operation/operationSpareBuyPlan";
export default {
  data() {
    return {
      dialogDetailVisible: false,
      formInline: {},
      tableData: []
    };
  },
  mounted() {},
  methods: {
    /**
     * 翻译“状态”字典
     */
    stateFormat(value) {
      if (value !== "") {
        return translatorDict(DICTDATA.APPROVE_STATUS, value);
      } else {
        return "";
      }
    },
    /**
     * 翻译“来源”字典
     */
    originFormat(value) {
      if (value !== "") {
        return translatorDict(DICTDATA.SPARE_BUY_PLAN_ORIGIN, value);
      } else {
        return "";
      }
    },
    /**
     * 翻译“备品备件类型”字典
     */
    typeFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.SPARE_SYSTEM, cellValue);
      } else {
        return "";
      }
    },
    /**
     * 驳回
     */
    reject() {
      this.$confirm("确定要驳回吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const data = await approval({
            planId: this.formInline.id,
            descr: this.formInline.description,
            state: 4
          });

          if (data.code === "000000" && data.data) {
            this.$message({
              type: "success",
              message: "驳回成功!"
            });

            this.dialogDetailVisible = false;
            // 重新查询列表
            this.$parent.$refs.tableComp.queryPage({
              current: 1
            });
          } else {
            this.$message.error(data.mesg);
          }
        })
        .catch(() => {});
    },
    /**
     * 通过
     */
    pass() {
      this.$confirm("确定要审批通过吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const data = await approval({
            planId: this.formInline.id,
            descr: this.formInline.description,
            state: 2
          });

          if (data.code === "000000" && data.data) {
            this.$message({
              type: "success",
              message: "审批通过!"
            });

            this.dialogDetailVisible = false;
            // 重新查询列表
            this.$parent.$refs.tableComp.queryPage({
              current: 1
            });
          } else {
            this.$message.error(data.mesg);
          }
        })
        .catch(() => {});
    },
    /**
     * 获取采购计划详情
     */
    getDetail(id) {
      getDetail(id).then(res => {
        this.formInline = res.data;
        this.tableData = res.data.spareBuyPlanDetailVos;
      });
    },
    /**
     * 格式化日期
     */
    formatDate(data) {
      if (data == null) {
        return null;
      }
      let dt = new Date(data);
      return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    },
    /**
     * 格式化日期
     */
    formatDateTime(str) {
      if (str == null) {
        return "";
      }
      let dt = new Date(str);
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

.case-content {
  border: 1px solid #eaeaea;
  border-radius: 4px;
  height: 300px;
  overflow-y: auto;
}
</style>