<template>
  <div>
    <el-dialog
      title="编辑运维任务"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="1150px"
    >
      <div>
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>基本信息
          </div>
          <div class="form-item-content">
            <el-form ref="form" :model="formInline" :rules="rules" label-width="140px" size="small">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="任务名称" prop="taskName">
                    <el-input v-model="formInline.taskName" placeholder="请输入任务名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="任务类型" prop="taskType">
                    <el-select v-model="formInline.taskType" size="mini" placeholder="请选择">
                      <el-option label="请选择" value></el-option>
                      <el-option
                        v-for="item in taskTypeOption"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="组织机构" prop="orgName">
                    <el-input
                      id="orgNameTxtbox"
                      v-model="formInline.orgName"
                      @focus="showOrgTree"
                      placeholder="请选择组织机构"
                    ></el-input>

                    <!-- 组织机构树 -->
                    <div class="org-tree-wrap" ref="orgTree" v-show="visibleOrgTree">
                      <el-tree
                        ref="orgTree"
                        :data="orgTreeData"
                        default-expand-all
                        node-key="id"
                        :expand-on-click-node="false"
                        show-checkbox
                        :check-strictly="true"
                        :props="orgTreeProps"
                        @check-change="orgTreeHandleCheckChange"
                        @node-click="orgTreeHandleNodeClick"
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

              <el-row>
                <el-col :span="8">
                  <el-form-item label="审批人" prop="checkManName">
                    <el-input
                      id="checkManNameTxtbox"
                      v-model="formInline.checkManName"
                      placeholder="请选择审批人"
                      @focus="showOrgUserTree"
                    ></el-input>

                    <!-- 组织机构用户树 -->
                    <div class="org-tree-wrap" ref="orgUserTree" v-show="visibleOrgUserTree">
                      <el-tree
                        ref="orgUserTree"
                        :data="orgUserTreeData"
                        default-expand-all
                        node-key="id"
                        :expand-on-click-node="false"
                        show-checkbox
                        :check-strictly="true"
                        :props="orgUserTreeProps"
                        @check-change="orgUserTreeHandleCheckChange"
                        @node-click="orgUserTreeHandleNodeClick"
                        :highlight-current="true"
                      >
                        <span class="span-ellipsis" slot-scope="{ node }">
                          <span :title="node.label">{{ node.label }}</span>
                        </span>
                      </el-tree>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="周期" prop="period">
                    <el-select v-model="formInline.period" placeholder="请选择" size="mini">
                      <el-option
                        v-for="item in cycleTimes"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="频次" prop="freq">
                    <el-input size="mini" v-model="formInline.freq" placeholder="请输入频次" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item label="间隔时间(天/小时)" prop="intervalDays">
                    <el-input size="mini" v-model="formInline.intervalDays" placeholder="请输入间隔时间"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="执行时间" prop="startEndDate">
                    <el-date-picker
                      v-model="formInline.startEndDate"
                      :pickerOptions="pickerOptions"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      format="yyyy-MM-dd HH:mm"
                      clearable
                      end-placeholder="结束日期"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>运维方案
            <el-select
              v-model="formInline.inspId"
              size="mini"
              placeholder="请选择"
              @change="inspChange"
            >
              <el-option
                v-for="item in devopsSchemes"
                :key="item.id"
                :label="item.inspName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>

          <div class="form-item-content case-info">
            <el-form label-width="120px" size="small">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="运维方案名称：">
                    <a href="javascript:void(0)" type="primary">
                      <span v-text="devopsSchemesCurrent.inspName"></span>
                    </a>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="描述：">
                    <p class="caseDesc" v-text="devopsSchemesCurrent.descr"></p>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>

          <div></div>
        </div>

        <!-- 运维设备 -->
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>运维设备
            <el-select
              size="mini"
              placeholder="请选择"
              v-model="formInline.taskObjType"
              @change="$forceUpdate()"
            >
              <el-option
                v-for="item in devopsDevicesTarget"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="form-item-content case-info">
            <div class="dev-wrap">
              <!-- 选站点 -->
              <div class="single station" v-show="formInline.taskObjType == 1">
                <div class="search-wrap">
                  <el-form :inline="true" :model="formStationSearch">
                    <el-form-item label="站点名称">
                      <el-input
                        size="mini"
                        v-model="formStationSearch.staName"
                        placeholder="请输入站点名称"
                      />
                    </el-form-item>

                    <el-form-item label="站点类型">
                      <el-select
                        size="mini"
                        placeholder="全部"
                        v-model="formStationSearch.staType"
                        clearable
                      >
                        <el-option
                          v-for="item in siteTypes"
                          :key="item.value"
                          :value="item.value"
                          :label="item.name"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="区域">
                      <el-cascader
                        v-model="formStationSearch.regId"
                        :options="areas"
                        :props="props"
                        size="mini"
                        clearable
                        @change="handleChange_formStationSearchRegId"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        size="mini"
                        class="newButtonColor SearchBTN"
                        @click="searchStation"
                      >查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="item-sel">
                  <div class="left">
                    <div class="title">待选站点</div>
                    <div class="cont">
                      <el-table
                        :data="tableDataStationUnsel"
                        stripe
                        @selection-change="handleSelectionChangeStationUnSel"
                      >
                        <el-table-column type="selection" width="45" />
                        <el-table-column :show-overflow-tooltip="true" label="站点名称" prop="staName" />
                        <el-table-column
                          :show-overflow-tooltip="true"
                          label="所属区域"
                          prop="regId"
                          :formatter="getAreaName"
                        />
                        <el-table-column :show-overflow-tooltip="true" label="详细地址" prop="addr" />
                      </el-table>
                    </div>
                  </div>

                  <div class="middle">
                    <div>
                      <el-button class="move" @click="moveRightStation" title="添加" />
                    </div>
                  </div>

                  <div class="right">
                    <div class="title">
                      已选站点
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        style="float: right; height:30px;width:50px;margin-right: 20px;margin-top: 2px"
                        @click="removeRowsClick"
                      />
                    </div>
                    <div class="cont">
                      <el-table
                        :data="tableDataStationSel"
                        stripe
                        style="width: 100%"
                        @selection-change="handleSelectionChangeStationSel"
                      >
                        <el-table-column type="selection" width="45" />
                        <el-table-column :show-overflow-tooltip="true" label="站点名称" prop="staName" />
                        <el-table-column
                          :show-overflow-tooltip="true"
                          label="所属区域"
                          prop="regId"
                          :formatter="getAreaName"
                        />
                        <el-table-column :show-overflow-tooltip="true" label="详细地址" prop="addr" />
                      </el-table>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 选充电桩 -->
              <div class="single charge" v-show="formInline.taskObjType == 2">
                <div class="search-wrap">
                  <el-form :inline="true" :model="formChargeSearch">
                    <el-form-item label="区域">
                      <el-cascader
                        v-model="formChargeSearch.regId"
                        :options="areas"
                        :props="props"
                        size="mini"
                        clearable
                        @change="handleChange_formChargeSearchRegId"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button size="mini" type="primary" @click="searchCharge">查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="item-sel">
                  <div class="left">
                    <div class="title">待选充电桩</div>
                    <div class="cont">
                      <el-table
                        :data="tableDataChargeUnsel"
                        stripe
                        @selection-change="handleSelectionChangeChargeUnSel"
                      >
                        <el-table-column type="selection" width="45" />
                        <el-table-column :show-overflow-tooltip="true" label="桩编号" prop="id" />
                        <el-table-column :show-overflow-tooltip="true" label="桩名称" prop="devName" />
                        <el-table-column
                          :show-overflow-tooltip="true"
                          label="功率(kW)"
                          prop="ratePower"
                        />
                      </el-table>
                    </div>
                  </div>

                  <div class="middle">
                    <div>
                      <el-button class="move" @click="moveRightCharge" title="添加" />
                    </div>
                  </div>

                  <div class="right">
                    <div class="title">
                      已选充电桩
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        @click="removeRowsClickCharge"
                        size="mini"
                        style="float: right; height:30px;width:50px;margin-right: 20px;margin-top: 2px"
                      />
                    </div>
                    <div class="cont">
                      <el-table
                        :data="tableDataChargeSel"
                        stripe
                        style="width: 100%"
                        @selection-change="handleSelectionChangeChargeSel"
                      >
                        <el-table-column type="selection" width="45" />
                        <el-table-column :show-overflow-tooltip="true" label="桩编号" prop="id" />
                        <el-table-column :show-overflow-tooltip="true" label="桩名称" prop="devName" />
                        <el-table-column
                          :show-overflow-tooltip="true"
                          label="功率(kW)"
                          prop="ratePower"
                        />
                      </el-table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <el-button class="editorBTN btnSpace bouncedHold" @click="submit(1)" size="small">确认</el-button>
          <el-button class="editorBTN btnSpace bouncedHold" @click="submit(2)" size="small">提交</el-button>
          <el-button class="editorBTN cancelBTN" @click="cancel" size="small">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDict, DICTDATA } from "@/api/dict";
import { getOrgTree, getOrgUserTree } from "@/api/commonApi";
import { getAreaSelectData, getRegNameByCode } from "@/utils/area";
import { queryList } from "@/api/operation/inspectScheme";
import {
  operationQueryStationList,
  save,
  operationQueryDevList,
  modify,
} from "@/api/operation/inspectTask";

export default {
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now();
        },
      },
      tableDataChargeSel: [],
      tableDataChargeUnsel: [],
      visibleOrgUserTree: false,
      cycleTimes: [],
      taskTypeOption: [],
      devopsDevicesTarget: [],
      devopsSchemesCurrent: {},
      devopsSchemes: [],
      tableDataStationUnsel: [],
      visibleOrgTree: false,
      tableDataUnSave: [],
      areas: [],
      formStationSearch: {},
      formChargeSearch: {},
      orgTreeData: [],
      orgUserTreeData: [],
      tableDataStationSel: [],
      siteTypes: [],
      tableDataSelected: [],
      orgUserTreeProps: {
        children: "children",
        label: "name",
        disabled(data, node) {
          return data.serviceType !== 2;
        },
      },
      orgTreeProps: {
        children: "children",
        label: "name",
      },
      dialogFormVisible: false,
      formInline: {
        intervalDays: "1",
        freq: "1",
      },
      tableDataChargeSelected: [],
      props: {
        checkStrictly: true,
        children: "children",
        value: "id",
        label: "name",
      },
      searchTypeOption: [],
      spareUnitTypeOption: [],
      tableDataUnSaveCharge: [],
      tableData: [
        {
          modelId: "",
          devNum: "",
          totalPrice: "",
          spareType: "",
          unit: "",
          unitPrice: "",
          factOption: [],
          modelOption: [],
        },
      ],
      rules: {
        taskName: [
          {
            required: true,
            message: "请输入任务名称",
            trigger: "change, blur",
          },
        ],
        taskType: [
          {
            required: true,
            message: "请选择任务类型",
            trigger: "change, blur",
          },
        ],
        orgName: [
          {
            required: true,
            message: "请选择组织机构",
            trigger: "change, blur",
          },
        ],
        checkManName: [
          { required: true, message: "请选择审核人", trigger: "change, blur" },
        ],
        period: [
          { required: true, message: "请选择周期", trigger: "change, blur" },
        ],
        freq: [
          { required: true, message: "请输入频次", trigger: "change, blur" },
        ],
        intervalDays: [
          {
            required: true,
            message: "请输入间隔时间",
            trigger: "change, blur",
          },
        ],
        startEndDate: [
          {
            required: true,
            message: "请选择执行时间",
            trigger: "change, blur",
          },
        ],
      },
    };
  },
  created() {
    var self = this;
    // 点击其他地方隐藏组织机构用户树、组织机构树
    document.addEventListener("click", (e) => {
      if (
        self.$refs.orgUserTree &&
        !self.$refs.orgUserTree.contains(e.target) &&
        e.target.id != "orgNameTxtbox"
      ) {
        self.visibleOrgTree = false;
      }

      if (
        self.$refs.orgTree &&
        !self.$refs.orgTree.contains(e.target) &&
        e.target.id != "checkManNameTxtbox"
      ) {
        self.visibleOrgUserTree = false;
      }
    });
  },
  methods: {
    handleSelectionChangeChargeSel(value) {
      this.tableDataUnSaveCharge = value;
    },
    removeRowsClickCharge() {
      for (let i in this.tableDataUnSaveCharge) {
        for (let j in this.tableDataChargeSel) {
          if (
            this.tableDataUnSaveCharge[i].id === this.tableDataChargeSel[j].id
          ) {
            this.tableDataChargeSel.splice(j, 1);
            break;
          }
        }
      }
    },
    moveRightCharge() {
      // 判断是否有已添加过的
      for (let i in this.tableDataChargeSelected) {
        let tmp = false;
        for (let j in this.tableDataChargeSel) {
          if (
            this.tableDataChargeSelected[i].id === this.tableDataChargeSel[j].id
          ) {
            tmp = true;
            break;
          }
        }
        if (!tmp) {
          this.tableDataChargeSel.push(this.tableDataChargeSelected[i]);
        }
      }
    },
    handleSelectionChangeChargeUnSel(value) {
      this.tableDataChargeSelected = value;
    },
    handleChange_formChargeSearchRegId(value) {
      this.formChargeSearch.regId = value[value.length - 1];
    },
    /**
     * 根据条件查询充电桩
     */
    searchCharge() {
      operationQueryDevList(this.formChargeSearch).then((res) => {
        this.tableDataChargeUnsel = res.data;
      });
    },
    /**
     * 提交/保存
     */
    submit(type) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.formInline.inspId === "") {
            this.$message({
              message: "请选择运维方案！",
              type: "warning",
            });
            return;
          }
          let inspectObjForms = [];

          // 运维对象类型为站点
          if (this.formInline.taskObjType === 1) {
            if (this.tableDataStationSel.length === 0) {
              this.$message({
                message: "请选择要运维的设备！",
                type: "warning",
              });
              return;
            }

            for (let i in this.tableDataStationSel) {
              inspectObjForms.push({
                staId: this.tableDataStationSel[i].id,
              });
            }
          }
          // 运维对象类型为充电桩
          let objTmp = {};
          if (this.formInline.taskObjType === 2) {
            if (this.tableDataChargeSel.length === 0) {
              this.$message({
                message: "请选择要运维的设备！",
                type: "warning",
              });
              return;
            }

            for (let i in this.tableDataChargeSel) {
              if (objTmp[this.tableDataChargeSel[i].staId] === undefined) {
                objTmp[this.tableDataChargeSel[i].staId] = [];
                objTmp[this.tableDataChargeSel[i].staId].push(
                  this.tableDataChargeSel[i]
                );
              } else {
                objTmp[this.tableDataChargeSel[i].staId].push(
                  this.tableDataChargeSel[i]
                );
              }
            }

            for (let i in objTmp) {
              inspectObjForms.push({
                staId: i,
                objInfo: JSON.stringify(objTmp[i]),
              });
            }
          }

          this.formInline.freq = Number(this.formInline.freq);
          // 处理执行时间范围
          this.formInline.startDate = this.formInline.startEndDate[0];
          this.formInline.endDate = this.formInline.startEndDate[1];

          let param = Object.assign(
            this.formInline,
            { state: type },
            { inspectObjForms: inspectObjForms }
          );

          let msg = "";
          if (type === 1) {
            msg = "保存";
          }
          if (type === 2) {
            msg = "提交";
          }

          if (param.id !== "") {
            modify(param).then((res) => {
              if (res.data && res.code === "000000") {
                this.$message({
                  message: msg + "成功",
                  type: "success",
                });
                // 关闭弹出层
                this.dialogFormVisible = false;
                // 重新查询数据
                this.$parent.getDataInit();
              } else {
                this.$message.error(msg + "失败");
              }
            });
          } else {
            save(param).then((res) => {
              if (res.data && res.code === "000000") {
                this.$message({
                  message: msg + "成功",
                  type: "success",
                });
                // 关闭弹出层
                this.dialogFormVisible = false;
                // 重新查询数据
                this.$parent.getDataInit();
              } else {
                this.$message.error(msg + "失败");
              }
            });
          }
        }
      });
    },
    handleSelectionChangeStationUnSel(values) {
      this.tableDataSelected = values;
    },
    handleSelectionChangeStationSel(values) {
      this.tableDataUnSave = values;
    },
    /**
     * 翻译所属区域名称
     */
    getAreaName(row, column, cellValue, index) {
      return getRegNameByCode(cellValue);
    },
    /**
     * 根据查询条件分页查询站点
     */
    searchStation() {
      operationQueryStationList(this.formStationSearch).then((res) => {
        this.tableDataStationUnsel = res.data;
      });
    },
    /**
     * 删除已选
     */
    removeRowsClick() {
      for (let i in this.tableDataUnSave) {
        for (let j in this.tableDataStationSel) {
          if (this.tableDataUnSave[i].id === this.tableDataStationSel[j].id) {
            this.tableDataStationSel.splice(j, 1);
            break;
          }
        }
      }
    },
    cancel() {
      this.dialogFormVisible = false;
    },
    /**
     * 显示修改运维任务弹出层
     */
    showModifyDialog(obj) {
      this.formInline = obj;
      this.dialogFormVisible = true;
      this.init();
      if (this.formInline.taskObjType === 1) {
        this.tableDataStationSel = this.formInline.assetStations;
      }
      if (this.formInline.taskObjType === 2) {
        this.tableDataChargeSel = this.formInline.assetStakes;
      }
    },
    /**
     * 显示新增运维任务弹出层
     */
    showDialog() {
      this.formInline = {};
      this.dialogFormVisible = true;
      this.init();
    },
    init() {
      // 获取运维任务类型字典
      getDict(DICTDATA.DEVOPS_TASK_TYPE).then((res) => {
        this.taskTypeOption = res;
      });
      // 获取周期字典
      getDict(DICTDATA.CYCLE_TIME).then((res) => {
        this.cycleTimes = res;
      });
      // 获取运维设备对象类型字典
      getDict(DICTDATA.DEVOPS_DEVICES_TARGET).then((res) => {
        this.devopsDevicesTarget = res;
        this.formInline.taskObjType = this.devopsDevicesTarget[0].value;
      });
      // 获取站点类型字典
      getDict(DICTDATA.SITE_TYPE).then((res) => {
        this.siteTypes = res;
      });
      // 获取区域数据
      getAreaSelectData().then((res) => {
        this.areas = res;
      });

      this.visibleOrgTree = false;
      this.visibleOrgUserTree = false;

      // 查询运维预案选择下拉
      this.queryListInspectScheme();
    },
    /**
     * 查询运维预案选择下拉
     */
    queryListInspectScheme() {
      queryList().then((res) => {
        this.devopsSchemes = res.data;
        if (this.formInline && res.data.length > 0) {
          this.formInline.inspId = res.data[0].id;
          this.devopsSchemesCurrent = res.data[0];
        }
      });
    },
    /**
     * 添加到已选站点
     */
    moveRightStation() {
      // 判断是否有已添加过的
      for (let i in this.tableDataSelected) {
        let tmp = false;
        for (let j in this.tableDataStationSel) {
          if (this.tableDataSelected[i].id === this.tableDataStationSel[j].id) {
            tmp = true;
            break;
          }
        }
        if (!tmp) {
          this.tableDataStationSel.push(this.tableDataSelected[i]);
        }
      }
    },
    handleChange_formStationSearchRegId(value) {
      this.formStationSearch.regId = value[value.length - 1];
    },
    /**
     * 运维预案选择框
     */
    inspChange(id) {
      this.devopsSchemesCurrent = this.devopsSchemes.find((item) => {
        return item.id === id;
      });
    },
    showOrgTree() {
      this.visibleOrgTree = true;
      if (this.orgTreeData && this.orgTreeData.length < 1) {
        getOrgTree("-1").then((res) => {
          this.orgTreeData = res.data;
        });
      }
    },
    orgTreeHandleCheckChange(data, checked, node) {
      if (checked == true) {
        this.formInline.orgName = data.name;
        this.formInline.orgId = data.id;
        this.visibleOrgTree = false;

        // 校验表单
        this.$refs["form"].validateField("orgName");
      }
    },
    orgTreeHandleNodeClick(data) {
      this.formInline.orgName = data.name;
      this.formInline.orgId = data.id;
      this.visibleOrgTree = false;

      // 校验表单
      this.$refs["form"].validateField("orgName");
    },
    showOrgUserTree() {
      this.visibleOrgUserTree = true;
      if (this.orgUserTreeData && this.orgUserTreeData.length < 1) {
        getOrgUserTree("-1").then((res) => {
          this.orgUserTreeData = [res.data];
        });
      }
    },
    orgUserTreeHandleCheckChange(data, checked, node) {
      if (checked == true) {
        this.formInline.checkManName = data.name;
        this.formInline.checkManId = data.id;
        this.visibleOrgUserTree = false;

        // 校验表单
        this.$refs["form"].validateField("checkManName");
      }
    },
    orgUserTreeHandleNodeClick(data) {
      // 类型为用户
      if (data.serviceType === 2) {
        this.formInline.checkManName = data.name;
        this.formInline.checkManId = data.id;
        this.visibleOrgUserTree = false;

        // 校验表单
        this.$refs["form"].validateField("checkManName");
      }
    },
  },
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

.s {
  padding: 15px 40px;

  .push {
    color: white;
    background: #006080;
    width: 120px;
  }
}

.kz {
  width: 200px;
  margin-right: 120px;
}

.el-button--small.btn-long {
  padding: 9px 40px;
}

.el-button--small.btn-middle {
  padding: 9px 20px;
}

.el-button--primary {
  background-color: #00607f;
  border-color: #00607f;
  color: #fff;
}

.el-button--primary:hover {
  background-color: #00607f;
  border-color: #00607f;
  color: #fff;
}

.case-info {
  padding: 5px !important;
}

.case-info .el-form-item--mini.el-form-item,
.case-info .el-form-item--small.el-form-item {
  margin-bottom: 0;
}

.form-item {
  margin-bottom: 10px;

  .form-item-content {
    background-color: #fcfcfc;
    border: 1px solid #eee;
    padding: 15px 15px 0;
  }

  .item-sel .left[data-v-9dd3591a] {
    width: 510px;
    float: left;
    border: 1px solid #eaeaea;
    border-radius: 4px;
  }

  .item-sel .right[data-v-9dd3591a] {
    width: 509px;
    float: left;
    border: 1px solid #eaeaea;
    border-radius: 4px;
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

.caseDesc {
  margin: 0;
}

.item-sel {
  overflow: hidden;

  .left {
    width: 490px;
    float: left;
    border: 1px solid #eaeaea;
    border-radius: 4px;

    .title {
      background-color: #f1f1f1;
      color: #00607f;
      height: 35px;
      line-height: 35px;
      padding-left: 10px;
      font-weight: bold;
    }

    .cont {
      height: 300px;
      padding: 10px;
      overflow-y: auto;
    }
  }

  .middle {
    width: 75px;
    height: 300px;
    float: left;
    text-align: center;
    padding-top: 60px;
  }

  .right {
    width: 490px;
    float: left;
    border: 1px solid #eaeaea;
    border-radius: 4px;

    .title {
      background-color: #f1f1f1;
      color: #00607f;
      height: 35px;
      line-height: 35px;
      padding-left: 10px;
      font-weight: bold;
    }

    .cont {
      height: 300px;
      padding: 10px;
      overflow-y: auto;
    }
  }
}

.move {
  width: 45px;
  height: 45px;
  background: #24b3ca url(../../../../assets/image/arrow-right.png) no-repeat
    center center;
  background-size: 26px;
  border: 0;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  outline: none;
}

.block {
  background-color: #f7f7f7;
}

.searchColor {
  color: white !important;
  background: #006080 !important;
  width: 50px;
  height: 25px;
}
</style>
