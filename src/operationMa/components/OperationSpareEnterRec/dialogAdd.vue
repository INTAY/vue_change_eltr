<template>
  <div>
    <el-dialog
      title="备品备件入库"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      append-to-body
      width="1250px"
    >
      <div>
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>基本信息
          </div>
          <div class="form-item-content">
            <el-form ref="form" :model="formInline" :rules="rules" label-width="80px" size="small">
              <el-row>
                <el-col :span="7">
                  <el-form-item label="入库来源" prop>
                    <el-select
                      size="mini"
                      v-model="formInline.sourceTypeName"
                      @change="showBtn"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in sourceTypeData"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="16" style="display:flex;">
                  <el-form-item label="入库日期">
                    <el-date-picker
                      v-model="formInline.searchDate"
                      style="width: 220px"
                      size="mini"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerDate"
                      @change="timeQuantum"
                      class="time-top-3"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-select
                      v-if="isPurchase"
                      size="mini"
                      v-model="formInline.planId"
                      placeholder="请选择"
                      class="plan-select"
                      @change="getPlanId"
                    >
                      <el-option
                        v-for="item in planData"
                        :key="item.id"
                        :label="item.planName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <el-select
                      v-if="isService"
                      size="mini"
                      v-model="formInline.spareType"
                      placeholder="请选择"
                      class="plan-select"
                      @change="searchspareUsed"
                    >
                      <el-option
                        v-for="item in planData"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>备品备件
          </div>
          <div>
            <div class="s" ref="showBtn" >
              <el-button class="newButtonColor listBTN" size="small"  @click="addItem" >新 增</el-button>
              <el-button class="BatchDeleteColor listBTN" size="small"  @click="batchDel" >批量删除</el-button>
            </div>

            <el-table
              :data="tableData"
              ref="multipleTable"
              :header-cell-style="{background:'#f1f1f1',color:'#000'}"
              stripe
              @selection-change="handleSelectionChange"
              style="width: 100%"
              class="table-height-28"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="类型" prop align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.spareType"
                    @change="getFact(scope.row, scope.$index)"
                    size="mini"
                    placeholder="请选择"
                    class="selectWidth"
                    :disabled="sign"
                  >
                    <el-option
                      v-for="item in searchTypeOption"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="厂家" prop align="center" width="150">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.factName"
                    @change="getModel(scope.row, scope.$index)"
                    size="mini"
                    placeholder="请选择"
                    class="selectWidth"
                    :disabled="sign"
                  >
                    <el-option
                      v-for="item in scope.row.factOption"
                      :key="item.id"
                      :label="item.factName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="型号" prop align="center">
                <template slot-scope="scope">
                  <el-select
                    size="mini"
                    v-model="scope.row.modelName"
                    placeholder="请选择"
                    class="selectWidth"
                    :disabled="sign"
                  >
                    <el-option
                      v-for="item in scope.row.modelOption"
                      :key="item.id"
                      :label="item.modelName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="数量" prop align="center">
                <template slot-scope="scope">
                  <el-input-number  class="num-range" size="mini" controls-position="right" v-model="scope.row.devNum"  :min="1"  :disabled="sign"></el-input-number>
                </template>
              </el-table-column>

              <el-table-column label="单位" prop="unit" align="center" width="120">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.unit"
                    size="mini"
                    placeholder="请选择"
                    class="selectWidth"
                    :disabled="sign"
                  >
                    <el-option
                      v-for="item in spareUnitTypeOption"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="最小申领数" prop align="center">
                <!-- @input="calculateByNum(scope.row, scope.$index)" -->
                <template slot-scope="scope">
                  <el-input-number
                    class="num-range"
                    controls-position="right"
                    size="mini"
                    :min="1"
                    :max="scope.row.devNum"
                    v-show="scope.row.consumable == 0||!scope.row.consumable ? false:true"
                    v-model="scope.row.splitUnits"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="库房" prop align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.houseId"
                    size="mini"
                    placeholder="请选择"
                    class="selectWidth"
                    :disabled="sign"
                  >
                    <el-option
                      v-for="item in warehouseData"
                      :key="item.id"
                      :label="item.houseName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="采购单价(元)" prop align="center">
                <!--  @input="calculateByUnitPrice(scope.row, scope.$index)"-->
                <template slot-scope="scope">
                  <el-input type="number" class="kz" v-model="scope.row.unitPrice" :disabled="sign"></el-input>
                </template>
              </el-table-column>

              <el-table-column label="保质期" width="145" prop align="center">
                <template slot-scope="scope">
                  <el-date-picker
                    class="date-width"
                    v-model="scope.row.expireDate"
                    type="date"
                    placeholder="请选择"
                    clearable
                  ></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" align="center" width="50">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="removeRow(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button class="editorBTN btnSpace bouncedHold" @click="submit" size="small">确认</el-button>
          <el-button size="small" class="editorBTN cancelBTN" @click="cancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDict, DICTDATA, translatorDict } from "@/api/dict";
import {
  searchFactByType,
  searchModel
} from "@/api/operation/operationSpareStore";
import {
  queryListBuyPlan,
  getPlanDetail,
  warehouseQueryByList,
  addSpareImportRec,
  spareUsedQueryByList
} from "@/api/operation/OperationSpareEnterRec";
export default {
  data() {
    return {
      isPurchase: true,
      isService: false,
      sign: false,
      pickerDate: {

          shortcuts: [
            {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
           {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
      dialogFormVisible: false,
      formInline: {},
      sourceTypeData: [], // 入库类型
      searchTypeOption: [],
      spareUnitTypeOption: [],
      multipleSelection: [],
      tableData: [
        {
          spareType: "",
          factId: "",
          modelId: "",
          unit: "",
          splitUnits: "",
          houseId: "",
          unitPrice: "",
          expireDate: "",
          factOption: [],
          modelOption: []
        }
      ],
      rules: {
        planName: [
          { required: true, message: "请输入采购计划名称", trigger: "blur" }
        ],
        checkManName: [
          { required: true, message: "请选择审核人", trigger: "change, blur" }
        ]
      },
      planData: [],
      sourceTypeName: "",
      warehouseData: [] //库房
    };
  },
  created() {
    // 查询类型下拉框数据
    getDict(DICTDATA.SPARE_IMPORT_TYPE).then(res => {
      this.sourceTypeData = res;
    });

    // 查询类型下拉框数据
    getDict(DICTDATA.SPARE_SYSTEM).then(res => {
      this.searchTypeOption = res;
    });

    // 查询备品备件单位类型下拉框数据 438
    getDict(DICTDATA.SPARE_UNIT_TYPE).then(res => {
      this.spareUnitTypeOption = res;
    });
    this.warehouseQueryByList();
  },
  methods: {
    // 旧件查询
    searchspareUsed() {
      let params = {
        endTime: this.formInline.planBuyEndDate,
        startTime: this.formInline.planBuyStartDate,
        spareType: this.formInline.spareType
      };
      this.spareUsedQueryByList(params);
    },
    showBtn(value) {
      this.tableData = [];
      this.formInline.planId = "";
      this.formInline.sourceType = value;
      if (value == 2) {
        this.sign = true;
        this.isPurchase = false;
        this.isService = true;
        getDict(DICTDATA.SPARE_SYSTEM).then(res => {
          this.planData = res;
        });
        this.$refs.showBtn.style.display = "none";
        this.spareUsedQueryByList();
      } else {
        this.$refs.showBtn.style.display = "block";
        this.sign = false;
        this.isPurchase = true;
        this.isService = false;
        this.queryListBuyPlan(this.formInline);
      }
    },
    // 时间
    timeQuantum(e) {      
      this.formInline.planBuyStartDate = e[0];
      this.formInline.planBuyEndDate = e[1];
      this.queryListBuyPlan(this.formInline);
    },
    getPlanId(id) {
      this.formInline.sourceId = id;
      this.getPlanDetail(id);
    },
    // 根据条件查询采购计划信息列表
    queryListBuyPlan(params) {
      queryListBuyPlan(params).then(res => {
        this.planData = res.data;
      });
    },
    // 根据id获取采购内容
    getPlanDetail(planId) {
      getPlanDetail(planId).then(res => {
        let that = this;
        that.tableData = res.data;
        // console.log(that.tableData, "采购内容");
        that.tableData.splitUnits = Number(that.tableData.splitUnits);
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i]["sourceType"] = that.formInline.sourceType;
          this.tableData[i]["sourceId"] = that.formInline.sourceId;
          this.tableData[i].unit = translatorDict(
            DICTDATA.SPARE_UNIT_TYPE,
            Number(this.tableData[i].unit)
          );
          let isTrue = this.tableData[i].consumable;
          if (isTrue == 0) {
            that.tableData[i].splitUnits = 1;
          }
        }
      });
    },
    // 库房
    warehouseQueryByList() {
      warehouseQueryByList().then(res => {
        this.warehouseData = res.data;
        // console.log(this.warehouseData);
      });
    },
    // 旧件列表
    spareUsedQueryByList(params) {
      spareUsedQueryByList(params).then(res => {
        let that = this;
        that.tableData = res.data;
        // console.log(that.tableData.tab, "旧件内容");
        that.tableData.splitUnits = Number(that.tableData.splitUnits);
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i]["splitUnits"] = 0;
          this.tableData[i]["sourceType"] = that.formInline.sourceType;
          this.tableData[i]["sourceId"] = this.tableData[i].id;
          this.tableData[i].unit = translatorDict(
            DICTDATA.SPARE_UNIT_TYPE,
            Number(this.tableData[i].unit)
          );
        }
      });
    },
    /**
     * 根据类型获取厂家
     */
    getFact(row, index) {
      row.factOption = [];
      row.modelOption = [];
      row.factId = "";
      row.modelId = "";    
      if (row.spareType !== "") {
        searchFactByType({
          factType: row.spareType, // 类型
          kind: DICTDATA.SPARE_SYSTEM // 分类
        }).then(res => {
          row.factOption = res.data;
          row.factOption.factId = res.data.factId;
          this.$set(this.tableData, index, row);
        });
      } else {
        this.$set(this.tableData, index, row);
      }
    },
    /**
     * 根据类型、厂家，获取型号
     */
    getModel(row, index) {
      row.modelOption = [];
      row.modelId = "";
      
      if (row.factName !== "") {
        searchModel({
          devClass: DICTDATA.SPARE_SYSTEM, // 类别
          devMainType: row.spareType, // 类型
          factId: row.factName // 厂家
        }).then(res => {
          row.modelOption = res.data;
          row.consumable = row.modelOption[0].consumable
          this.$set(this.tableData, index, row);
        });
      } else {
        this.$set(this.tableData, index, row);
      }
    },
    /**
     * 新增一条
     */
    addItem() {
      let self = this;

      self.tableData.push({
        spareType: "",
        factId: "",
        modelId: "",
        unit: "",
        splitUnits: "",
        houseId: "",
        unitPrice: "",
        expireDate: ""
      });

    },
    // 选中的表格
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 批量删除
    batchDel() {
      // this.tableData.splice(rowIndex, 1);
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: "请选择要删除的选项！",
          type: "warning"
        });
      } else {
        this.$confirm("确定要删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          for (
            let i = this.$refs.multipleTable.selection.length - 1;
            i >= 0;
            i--
          ) {
            this.tableData.splice(
              this.$refs.multipleTable.selection[i].index - 1,
              1
            );
          }
        });
      }
    },
    /**
     * 删除单行
     */
    removeRow(rowIndex) {
      this.tableData.splice(rowIndex, 1);
    },
    /**
     * 保存
     */
    submit() {
      if (this.tableData.length == 0) {
        this.$message({
          message: "入库内容不能为空！",
          type: "warning"
        });
        return;
      } else {
        addSpareImportRec(this.tableData).then(res => {
          if (res.code !== "000000") {
            this.$message({
              message: res.mesg,
              type: "warning"
            });
          } else {
            this.$message({
              message: "保存成功！",
              type: "success"
            });
            this.dialogFormVisible = false;
            this.sign = true;
            this.formInit();
            this.$parent.$parent.$parent.$refs.crudForm.getDataInit();
          }
        });
      }
    },
    /**
     * 取消
     */
    cancel() {
      this.formInit();
      this.dialogFormVisible = false;
    },
    /**
     * 表单初始化
     */
    formInit() {
      this.formInline = {};
      this.tableData = [];
      // this.visibleOrgTree = false;
    },
    /**
    /**
     * 获取采购计划详情
     */
    getDetail(id) {
      getDetail(id).then(res => {
        this.formInline = res.data;
        for (var i in res.data.spareBuyPlanDetailVos) {
          res.data.spareBuyPlanDetailVos[i].unit = Number(
            res.data.spareBuyPlanDetailVos[i].unit
          );
        }
        this.tableData = res.data.spareBuyPlanDetailVos;
      });
    },
    // 单位格式化
    unitFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.SPARE_UNIT_TYPE, cellValue);
      } else {
        return "";
      }
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
    box-sizing: border-box;
    .time-top-3 {
      margin-top: 3.5px;
    }
    .plan-select {
      margin-left: -75px;
    }
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
      margin-top: -3px;
    }
  }
}
.table-height-28 {
  /deep/ .el-input--medium .el-input__inner {
    height: 28px;
    line-height: 28px;
  }
  /deep/ .el-input--medium .el-input__icon {
    line-height: 28px;
  }
  /deep/ .el-input--prefix .el-input__inner {
    padding-left: 15px;
  }
  .date-width {
    width: 140px;
  }
}
.push {
  color: #fff;
  width: 120px;
  height: 32px;
}
.m-b-10 {
  margin-bottom: 10px;
}

.input-width {
  width: 180px;
}
.btn-long {
  width: 200px !important;
}
>>> .num-range{
width: 102px;
}
</style>
