<template>
  <div>
    <el-dialog
      title="编辑采购计划"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="960px"
    >
      <div>
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>基本信息
          </div>
          <div class="form-item-content">
            <el-form ref="form" :model="formInline" :rules="rules" label-width="120px" size="small">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="采购计划名称" prop="planName">
                    <el-input v-model="formInline.planName" class="input-width"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="计划采购日期" prop="planBuyDate">
                    <el-date-picker
                      class="input-width"
                      v-model="formInline.planBuyDate"
                      type="date"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="采购金额(元)" prop="totalMoney">
                    <el-input v-model="formInline.totalMoney" disabled class="input-width"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="审批人" prop="checkManName">
                    <el-input
                      id="checkManNameTxtbox"
                      class="kz"
                      v-model="formInline.checkManName"
                      @focus="showOrgTree"
                      @blur="hideOrgTree"
                    ></el-input>

                    <!-- 组织机构用户树 -->
                    <div class="org-tree-wrap" ref="orgUserTree" v-show="visibleOrgTree">
                      <el-tree
                        ref="tree"
                        :data="orgTreeData"
                        default-expand-all
                        node-key="id"
                        :expand-on-click-node="false"
                        show-checkbox
                        :check-strictly="true"
                        :props="defaultProps"
                        @check-change="handleCheckChange"
                        @node-click="handleNodeClick"
                        :highlight-current="true"
                      >
                        <span class="span-ellipsis" slot-scope="{ node }">
                          <span :title="node.label">{{ node.label }}</span>
                        </span>
                      </el-tree>
                    </div>
                  </el-form-item>
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
            <div class="s" style="padding-left: 0">
              <el-button size="small" @click="addItem" class="newButtonColor listBTN">新增</el-button>
            </div>

            <el-table
              :data="tableData"
              :header-cell-style="{background:'#f1f1f1',color:'#000'}"
              stripe
              style="width: 100%"
            >
              <el-table-column type="index" width="50" align="center"></el-table-column>

              <el-table-column label="类型" prop="spareType" align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.spareType"
                    @change="getFact(scope.row, scope.$index)"
                    size="mini"
                    placeholder="全部"
                    class="selectWidth"
                  >
                    <el-option label="请选择" value></el-option>
                    <el-option
                      v-for="item in searchTypeOption"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="厂家" prop="factId" align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.factId"
                    @change="getModel(scope.row, scope.$index)"
                    size="mini"
                    placeholder="全部"
                    class="selectWidth"
                  >
                    <el-option label="请选择" value></el-option>
                    <el-option
                      v-for="item in scope.row.factOption"
                      :key="item.id"
                      :label="item.factName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="型号" prop="modelId" align="center">
                <template slot-scope="scope">
                  <el-select
                    size="mini"
                    v-model="scope.row.modelId"
                    placeholder="全部"
                    class="selectWidth"
                  >
                    <el-option label="请选择" value></el-option>
                    <el-option
                      v-for="item in scope.row.modelOption"
                      :key="item.id"
                      :label="item.modelName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="数量" prop="devNum" align="center">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    class="kz"
                    @input="calculateByNum(scope.row, scope.$index)"
                    v-model="scope.row.devNum"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column label="单位" prop="unit" align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.unit"
                    size="mini"
                    placeholder="请选择"
                    class="selectWidth"
                  >
                    <el-option label="请选择" value></el-option>
                    <el-option
                      v-for="item in spareUnitTypeOption"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="单价(元)" prop="unitPrice" align="center">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    class="kz"
                    @input="calculateByUnitPrice(scope.row, scope.$index)"
                    v-model="scope.row.unitPrice"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column label="总价(元)" prop="totalPrice" align="center">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    class="kz"
                    @input="calculateByTotalPrice(scope.row, scope.$index)"
                    v-model="scope.row.totalPrice"
                  ></el-input>
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
          <el-button type="primary" class="btn-long" @click="submit(1)" size="small">确认</el-button>
          <el-button type="primary" class="btn-long" @click="submit(2)" size="small">提交</el-button>
          <el-button size="small" class="btn-long" @click="cancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDict, DICTDATA } from "@/api/dict";
import {
  searchFactByType,
  searchModel
} from "@/api/operation/operationSpareStore";
import {
  add,
  getOrgUserTree,
  getDetail,
  modify
} from "@/api/operation/operationSpareBuyPlan";
export default {
  data() {
    return {
      visibleOrgTree: false,
      orgTreeData: [],
      defaultProps: {
        children: "children",
        label: "name",
        disabled(data, node) {
          return data.serviceType !== 2;
        }
      },
      dialogFormVisible: false,
      formInline: {},
      searchTypeOption: [],
      spareUnitTypeOption: [],
      tableData: [
        {
          modelId: "",
          devNum: "",
          totalPrice: "",
          spareType: "",
          unit: "",
          unitPrice: "",
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
      }
    };
  },
  created() {
    // 查询类型下拉框数据
    getDict(DICTDATA.SPARE_SYSTEM).then(res => {
      this.searchTypeOption = res;
    });

    // 查询备品备件单位类型下拉框数据
    getDict(DICTDATA.SPARE_UNIT_TYPE).then(res => {
      this.spareUnitTypeOption = res;
    });

    var self = this;
    // 点击其他地方隐藏组织机构用户树
    document.addEventListener("click", e => {
      if (
        self.$refs.orgUserTree &&
        !self.$refs.orgUserTree.contains(e.target) &&
        e.target.id != "checkManNameTxtbox"
      ) {
        self.visibleOrgTree = false;
      }
    });
  },
  methods: {
    /**
     * 根据数量，计算总价
     */
    calculateByNum(row, index) {
      row.totalPrice = (row.devNum * row.unitPrice).toFixed(2);
      this.$set(this.tableData, index, row);
      this.calculateTotalMoney();
    },
    /**
     * 根据单价，计算总价
     */
    calculateByUnitPrice(row, index) {
      row.totalPrice = (row.devNum * row.unitPrice).toFixed(2);
      this.$set(this.tableData, index, row);
      this.calculateTotalMoney();
    },
    /**
     * 根据总价，计算单价
     */
    calculateByTotalPrice(row, index) {
      row.unitPrice = (row.totalPrice / row.devNum).toFixed(2);
      this.$set(this.tableData, index, row);
      this.calculateTotalMoney();
    },
    /**
     * 根据所有行的总价，计算采购计划总金额
     */
    calculateTotalMoney() {
      let totalMoney = 0;
      this.tableData.map(item => {
        totalMoney += Number(item.totalPrice);
      });
      this.formInline.totalMoney = totalMoney;
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

      if (row.factId !== "") {
        searchModel({
          devClass: DICTDATA.SPARE_SYSTEM, // 类别
          devMainType: row.spareType, // 类型
          factId: row.factId // 厂家
        }).then(res => {
          row.modelOption = res.data;
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
      var self = this;

      self.tableData.push({
        factId: "",
        modelId: "",
        devNum: "",
        spareType: "",
        totalPrice: "",
        unit: "",
        unitPrice: ""
      });
    },
    /**
     * 删除单行
     */
    removeRow(rowIndex) {
      this.tableData.splice(rowIndex, 1);
    },
    /**
     * 提交
     */
    submit(state) {
      // 校验表单
      this.$refs["form"].validate(async valid => {
        if (valid) {
          if (this.tableData.length === 0) {
            this.$message({
              message: "采购内容不得为空！",
              type: "warning"
            });
            return;
          }

          let param = this.formInline;
          param.sourceType = 1; // 采购计划来源: 字典431 1-人工录入 2-app录入
          param.spareBuyPlanDetailForms = this.tableData;
          param.state = state; // 状态

          let res = null, msg = "";
          if (this.formInline.id && this.formInline.id !== "") {
            res = await modify(param);
            msg = "修改";
          } else {
            res = await add(param);
            msg = "保存";
          }
          if (res.code !== "000000") {
            this.$message({
              message: res.mesg,
              type: "warning"
            });
          } else {
            this.$message({
              message: msg + "成功！",
              type: "success"
            });
            this.dialogFormVisible = false;

            // 重新查询列表
            this.$parent.$refs.tableComp.queryPage({
              current: 1
            });
          }
        } else {
          return false;
        }
      });
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
      this.visibleOrgTree = false;
    },
    /**
     * 组织机构用户树选中
     */
    handleNodeClick(data) {
      // 类型为用户
      if (data.serviceType === 2) {
        this.formInline.checkManName = data.name;
        this.formInline.checkManId = data.id;
        this.$refs.tree.setCheckedNodes([data]);
        this.visibleOrgTree = false;

        // 校验表单
        this.$refs["form"].validateField("checkManName");
      }
    },
    handleCheckChange(data, checked, node) {
      if (checked == true) {
        this.formInline.checkManName = data.name;
        this.formInline.checkManId = data.id;
        this.$refs.tree.setCheckedNodes([data]);
        this.visibleOrgTree = false;

        // 校验表单
        this.$refs["form"].validateField("checkManName");
      }
    },
    /**
     * 选择组织机构文本框聚焦
     */
    showOrgTree() {
      this.visibleOrgTree = true;
      // 获取组织机构用户树接口调用
      this.getOrgTree();
    },
    /**
     * 选择组织机构文本框失焦
     */
    hideOrgTree() {
      //this.visibleOrgTree = false;
    },
    /**
     * 获取组织机构用户树接口调用
     * 该接口的参数未确定，目前无参，获取所有组织机构，后面考虑数据权限时再确定参数
     */
    getOrgTree() {
      if (this.orgTreeData && this.orgTreeData.length < 1) {
        getOrgUserTree("-1").then(res => {
          this.orgTreeData = [res.data];
        });
      }
    },
    /**
     * 获取采购计划详情
     */
    getDetail(id) {
      getDetail(id).then(res => {
        this.formInline = res.data;
        for (var i in res.data.spareBuyPlanDetailVos) {
          res.data.spareBuyPlanDetailVos[i].unit = Number(res.data.spareBuyPlanDetailVos[i].unit);
        }
        this.tableData = res.data.spareBuyPlanDetailVos;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.org-tree-wrap {
  height: 200px;
  overflow-y: auto;
  overflow-x: auto;
  position: absolute;
  left: 0;
  top: 33px;
  right: 0;
  z-index: 2;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
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

.push {
  color: #fff;
  background: #006080;
  width: 120px;
}
.m-b-10 {
  margin-bottom: 10px;
}

.input-width {
  width: 180px;
}
</style>
