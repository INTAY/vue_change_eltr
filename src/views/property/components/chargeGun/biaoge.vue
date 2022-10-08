<template>
  <div>
    <div id="table-wrap">
      <!-- 表格 -->
      <el-table
        :data="
          tableData.filter(
            (data) =>
              !search || data.name.toLowerCase().includes(search.toLowerCase())
          )
        "
        stripe
        v-loading="loading"
        :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
        style="width: auto"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
        ref="tableDataRef"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          v-if="colData[0].istrue"
          label="编号"
          prop="id"
          sortable="custom"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="colData[1].istrue"
          label="充电枪名称"
          prop="devName"
          sortable="custom"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="colData[2].istrue"
          label="所属充电站"
          prop="staName"
          sortable="custom"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="colData[3].istrue"
          label="所属充电设施"
          prop="parentName"
          sortable="custom"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="colData[4].istrue"
          label="组织机构"
          prop="orgName"
          sortable="custom"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="colData[5].istrue"
          label="行政区域"
          prop="regId"
          sortable="custom"
          show-overflow-tooltip
          :formatter="regFormat"
        />
        <el-table-column
          v-if="colData[6].istrue"
          label="状态"
          prop="state"
          :formatter="statusFormat"
          sortable="custom"
        />

        <el-table-column
          v-if="colData[7].istrue"
          label="枪头接口类型"
          prop="connectorType"
          sortable="custom"
          :formatter="connectorTypeFormat"
        />
        <el-table-column
          v-if="colData[8].istrue"
          label="关联通讯设备"
          sortable="custom"
          prop="commFacId"
        />
        <el-table-column
          v-if="colData[9].istrue"
          label="通讯地址号"
          sortable="custom"
          prop="commFacNo"
        />
        <el-table-column
          v-if="colData[10].istrue"
          label="负荷控制容量"
          sortable="custom"
          prop="ctrlValue"
        />
        <el-table-column
          v-if="colData[11].istrue"
          label="国际标准"
          sortable="custom"
          prop="national"
          :formatter="nationalFormat"
        />
        <el-table-column
          v-if="colData[12].istrue"
          label="资产编号"
          sortable="custom"
          prop="assetNo"
        />
        <el-table-column
          v-if="colData[13].istrue"
          label="第三方资产编号"
          sortable="custom"
          prop="sourceId"
        />
        <el-table-column
          v-if="colData[14].istrue"
          label="生产厂家"
          sortable="custom"
          prop="factName"
        />
        <el-table-column fixed="right" width="180" label="操作">
          <template slot-scope="scope">
            <el-button @click="openDetail(scope.row)" class="common-btn"
              >详情
            </el-button>
            <el-button class="common-btn" @click="handleEdit(scope.row)"
              >修改
            </el-button>
            <el-button class="delete-btn" @click="handleDelete(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column width="40" fixed="right">
          <template slot="header">
            <el-popover
              placement="bottom"
              min-width="80"
              trigger="click"
              popper-class="col-setting-popover"
            >
              <el-button
                slot="reference"
                size="small"
                type="text"
                icon="el-icon-setting"
                style="padding: 0; border-color: #f1f1f1"
              ></el-button>
              <div class="col-setting-title">展示列设置</div>
              <el-checkbox-group
                v-model="colOptions"
                :min="1"
                class="col-setting-group"
              >
                <el-checkbox v-for="item in colSelect" :label="item" :key="item"
                  >{{ item }}
                </el-checkbox>
              </el-checkbox-group>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-wrap-fixed" id="page-wrap-fixed">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageData.pageSize"
        :total="pageData.total"
        :current-page="pageData.current"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper, slot"
      >
        <span class="el-pagination__jump page-option-wrap">
          <a
            class="el-icon-refresh page-option-icon"
            href="javascript:;"
            @click="refresh"
            title="刷新"
          >
            <!-- <img src="/static/img/7.png" /> -->
          </a>
          <i class="split-line"></i>
          <a
            class="el-icon-upload2 page-option-icon"
            href="javascript:;"
            @click="exportTable"
            title="导出"
          >
            <!-- <img src="/static/img/8.png" /> -->
          </a>
        </span>
      </el-pagination>
    </div>

    <div>
      <div></div>
      <!-- 详情-->
      <div>
        <el-dialog
          title="详情"
          :visible.sync="detailWin"
          top="15vh"
          style="left: 170px"
          class="xqyy"
          width="1200px"
          :modal-append-to-body="false"
        >
          <div class="xqye">
            <div class="tu">
              <el-card
                shadow="never"
                style="width: 180px; height: 180px; margin-left: -15%"
                :body-style="{ padding: '0px' }"
              >
                <img
                  :src="imageUrl"
                  alt
                  style="height: 180px; width: 180px; text-align: center"
                />
              </el-card>
            </div>
            <el-form
              :inline="true"
              :model="detailForm"
              label-width="120px"
              class="demo-form-inline xqy"
              style="width: auto"
            >
              <el-row class="y h">
                <el-col :span="12" class="k">
                  <el-form-item label="充电枪名称:">
                    <span>{{ detailForm.devName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="k">
                  <el-form-item label="充电枪编号:">
                    <span>{{ detailForm.id }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="h">
                <el-col :span="12" class="k">
                  <el-form-item label="所属机构:">
                    <span>{{ detailForm.orgName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="k">
                  <el-form-item label="状态:">
                    <span>{{ detailForm.state }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="y h">
                <el-col :span="12" class="k">
                  <el-form-item label="行政区域:">
                    <span>{{ detailForm.regId }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="k">
                  <el-form-item label="所属充电站:">
                    <span>{{ detailForm.staName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="h">
                <el-col :span="12" class="k">
                  <el-form-item label="所属充电设施:">
                    <span>{{ detailForm.parentName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="k">
                  <el-form-item label="枪头接口类型:">
                    <span>{{ detailForm.connectorType }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="y h">
                <el-col :span="12" class="k">
                  <el-form-item label="关联通讯设备:">
                    <span>{{ detailForm.commFacId }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="k">
                  <el-form-item label="通讯地址号:">
                    <span>{{ detailForm.commFacNo }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="h">
                <el-col :span="12" class="k">
                  <el-form-item label="可控等级:" class="b">
                    <span>{{ detailForm.ctrlLvl }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="k">
                  <el-form-item label="负荷控制容量:" class="b">
                    <span>{{ detailForm.ctrlValue }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="y h">
                <el-col :span="12" class="k">
                  <el-form-item label="国际标准:">
                    <span>{{ detailForm.national }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="k">
                  <el-form-item label="生产厂家:">
                    <span>{{ detailForm.factName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="h">
                <el-col :span="12" class="k">
                  <el-form-item label="资产编号:">
                    <span>{{ detailForm.assetNo }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="k">
                  <el-form-item label="第三方资产编号:">
                    <span>{{ detailForm.sourceId }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-dialog>
      </div>
      <!-- 修改 -->
      <div>
        <el-dialog
          title="修改充电枪"
          :visible.sync="modifyWin"
          width="950px"
          :modal-append-to-body="false"
        >
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="140px"
            size="small"
            class="qw qwe"
          >
            <div class="k">
              <el-form-item label="充电枪名称" prop="devName">
                <el-input size="mini" v-model="form.devName" class="kz" />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="状态" prop="state">
                <!-- <selectVue
                  v-model="form.state"
                  :options-list="devicesStatus"
                  class="kz"
                /> -->
                <el-select v-model="form.state" clearable placeholder="请选择">
                  <el-option
                    v-for="item in devicesStatus"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="组织机构" prop="orgId">
                <tree-select
                  ref="treeSelect"
                  v-model="form.orgId"
                  :props="orgDefaultProps"
                  :options="orgsTree"
                  :clearable="isClearable"
                  :accordion="isAccordion"
                  @getValue="getValue($event)"
                  class="kz"
                />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="所属充电站" prop="staId">
                <el-select
                  v-model="form.staId"
                  @change="getStaId"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in restaurants"
                    :key="item.id"
                    :label="item.staName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="k">
              <el-form-item label="行政区域" prop="region">
                <!-- <el-input
                  size="mini"
                  readonly
                  class="kz"
                  v-model="form.region"
                /> -->
                <el-cascader
                  v-model="form.regId"
                  size="mini"
                  :options="this.$parent.$refs.topform.areas"
                  :props="regProps"
                  clearable
                  @change="handleChange"
                  class="kz"
                />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="充电设施" prop="parentId">
                <select-vue
                  :options-list="chargeDevices"
                  v-model="form.parentId"
                  class="kz"
                />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="生产厂家" prop="factId">
                <el-select
                  size="mini"
                  v-model="form.factId"
                  value-key="id"
                  class="kz"
                  @change="changeFactory"
                >
                  <el-option
                    v-for="item in this.$parent.$refs.operateTable.factorys"
                    :key="item.id"
                    :label="item.factName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>

            <div class="k">
              <el-form-item label="关联通信设备" prop="devType">
                <el-select size="mini" value-key="value" class="kz">
                  <el-option />
                </el-select>
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="通信地址号" prop="devType">
                <el-input type="number" class="kz" size="mini" />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="充电枪接口类型" prop="connectorType">
                <select-vue
                  :options-list="muzzleTypes"
                  class="kz"
                  v-model="form.connectorType"
                />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="可控等级" prop="ctrlLvl">
                <select-vue
                  :options-list="controllableGrade"
                  class="kz"
                  v-model="form.ctrlLvl"
                />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="负荷控制容量(kW)" prop="ctrlValue">
                <el-input
                  size="mini"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  placeholder="负荷控制容量"
                  v-model="form.ctrlValue"
                  class="kz"
                />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="资产编号">
                <el-input
                  size="mini"
                  placeholder="资产编号"
                  v-model="form.assetNo"
                  class="kz"
                />
              </el-form-item>
            </div>

            <div class="k">
              <el-form-item label="第三方资产编号" prop="sourceId">
                <el-input
                  size="mini"
                  placeholder="第三方资产编号"
                  v-model="form.sourceId"
                  class="kz"
                />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="图片" prop="picType">
                <select-vue
                  :options-list="this.$parent.$refs.operateTable.picUploadType"
                  v-model="form.picType"
                  @input="chooseImage"
                  class="kz"
                />
                <el-image
                  class="kz aniupic"
                  :src="imageUrl"
                  placeholder="暂无图片"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-form-item>
              <div slot="tip" class="el-upload__tip1">
                (只能上传jpg/png/gif文件，2MB以内)
              </div>
            </div>
            <div class="k">
              <el-form-item label="国际标准" prop="national">
                <select-vue
                  :options-list="internationalStandard"
                  :filterable="true"
                  v-model="form.national"
                  class="kz"
                />
              </el-form-item>
            </div>
          </el-form>
          <div class="dialog-footer">
            <el-button
              size="small"
              @click="saveForm('form')"
              class="editorBTN btnSpace bouncedHold"
              >确定
            </el-button>
            <el-button
              size="small"
              @click="modifyWin = false"
              class="editorBTN cancelBTN"
              >取消
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <!-- 图片本地上传 -->
    <div>
      <el-dialog
        title="图片本地上传"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        top="30vh"
        :modal="true"
        :visible.sync="uploadWin"
        width="880px"
        class="dialogClass"
      >
        <singleimageupload ref="singleimageupload" />
      </el-dialog>
    </div>
    <!-- 图片列表选取 -->
    <div>
      <el-dialog
        title="图片列表"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        top="20vh"
        :modal="true"
        :visible.sync="imagesWin"
        width="880px"
        class="dialogClass"
      >
        <picTable ref="picTable" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getStationList, queryByPage } from "../../../../api/property/charge";
import {
  getRegNameByCode,
  packageDataToMap,
  packageOrgToMap,
  regName,
} from "../../../../utils/area";
import { DICTDATA, getDict, translatorDict } from "../../../../api/dict";
import {
  deleteById,
  modifyInfo,
  queryInfoList,
} from "../../../../api/property/chargeGun";
import picTable from "../../../../components/pagetable/picTable";
import singleimageupload from "../../../../components/upload/singleimageupload";
import selectVue from "../../../../components/selectVue";
import { getDetails, queryByConditions } from "../../../../api/property/site";
import treeSelect from "../../../../components/treeSelect/treeSelect";

export default {
  name: "biaoge",
  data() {
    return {
      restaurants: [], // 站列表
      orgsTree: [], //树
      orgDefaultProps: {
        value: "id",
        label: "name",
        children: "children",
      },
      regProps: {
        checkStrictly: true,
        label: "name",
        children: "children",
        value: "id",
      },

      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      colData: [
        { title: "编号", istrue: true },
        { title: "充电枪名称", istrue: true },
        { title: "所属充电站", istrue: true },
        { title: "所属充电设施", istrue: true },
        { title: "组织机构", istrue: true },
        { title: "行政区域", istrue: true },
        { title: "状态", istrue: true },
        { title: "枪头接口类型", istrue: true },
        { title: "关联通讯设备", istrue: true },
        { title: "通讯地址号", istrue: true },
        { title: "负荷控制容量", istrue: true },
        { title: "国际标准", istrue: true },
        { title: "资产编号", istrue: true },
        { title: "第三方资产编号", istrue: true },
        { title: "生产厂家", istrue: true },
      ],
      colOptions: [],
      colSelect: [],
      fuzhi: false,
      modifyWin: false,
      form: {
        //资产编号
        assetNo: "",
        //关联通讯设备
        commFacId: "",
        //通讯地址号
        commFacNo: "",
        //接口类型：字典类型225
        connectorType: "",
        //可控等级：刚性、柔性、不可控
        ctrlLvl: "",
        // 负荷孔子容量
        ctrlValue: "",
        //充电枪名称
        devName: "",
        //枪头类型
        devType: "",
        //国标类型
        national: "",
        orgId: "",
        //充电设施标识
        parentId: "",
        picUrl: "",
        regId: "",
        sourceId: "",
        staId: "",
        state: "",
        orgName: "",
        region: "",
        parentName: "",
        stationName: "",
      },
      rules: {
        staId: [
          {
            required: true,
            message: "请选择所属充电站",
            trigger: ["blur", "change"],
          },
        ],
        devName: [
          {
            required: true,
            message: "请输入充电设施名称",
            trigger: ["blur", "change"],
          },
        ],
        devTypeName: [
          { required: true, message: "请选择所属充电站", trigger: "change" },
        ],
        connectorType: [
          { required: true, message: "请选择接口类型", trigger: "change" },
        ],
        stationName: [
          { required: true, message: "请选择所属站点", trigger: "change" },
        ],
        parentId: [
          { required: true, message: "请选择充电设施", trigger: "change" },
        ],
        state: [{ required: true, message: "请选择状态", trigger: "change" }],
        ctrlLvl: [
          { required: true, message: "请选择可控等级", trigger: "change" },
        ],
        ctrlValue: [
          { required: true, message: "可控容量不可为空", trigger: "change" },
        ],
        national: [
          { required: true, message: "请选择国际标准", trigger: "change" },
        ],
        orgId: [
          { required: true, essage: "组织机构不可为空", trigger: "change" },
        ],
        regId: [{ required: true, message: "区域不能为空", trigger: "change" }],
      },
      detailForm: {
        connectorType: "",
        devName: "",
        sourceId: "",
        assetNo: "",
        national: "",
        ctrlValue: "",
        ctrlLvl: "",
        commFacNo: "",
        commFacId: "",
        stationName: "",
        parentName: "",
        id: "",
        regName: "",
        regId: "",
        orgId: "",
        orgName: "",
        state: "",
      },
      checkValue: "",
      factorys: [],
      modelTypes: [],
      paramsFact: {},
      paramsModel: {},
      uploadWin: false,
      imagesWin: false,
      detailWin: false,
      tableData: [],
      //分页
      pageData: {
        total: 0,
        current: 1,
        pageSize: 20,
      },
      imageUrl: "",
      search: "",
      chargeDevices: [],
      params: {},
      checkModel: [],
      devicesStatus: [],
      controllableGrade: [],
      internationalStandard: [],
      muzzleTypes: [],
      SelectionArray: [],
      valueCon: "",
      loading: false,
    };
  },
  mounted() {
    let elementResizeDetectorMaker = require("element-resize-detector");
    let tableWidth = document.getElementById("table-wrap");
    let pageWidth = document.getElementById("page-wrap-fixed");
    let erd = elementResizeDetectorMaker();
    erd.listenTo(tableWidth, function (element) {
      pageWidth.style.width = element.offsetWidth + "px";
    });
  },
  created() {
    this.queryList();
    // // 获取设备状态
    getDict(DICTDATA.INFRASTRUCTURE_STATUS).then((res) => {
      this.devicesStatus = res;
      console.log(res, "res");
    });
    // 获取可控等级
    getDict(DICTDATA.CONTROLLABLE_GRADE).then((res) => {
      this.controllableGrade = res;
    });
    // 获取国际标准
    getDict(DICTDATA.INTERNATIONAL_STANDARD).then((res) => {
      this.internationalStandard = res;
    });
    // 枪口类型
    getDict(DICTDATA.MUZZLE_TYPE).then((res) => {
      this.muzzleTypes = res;
    });
    this.orgsTree = this.$parent.$refs.topform.orgsTree;
    let _this = this;
    for (let i = 0; i < _this.colData.length; i++) {
      _this.colSelect.push(_this.colData[i].title);
      if (_this.colSelect.length > 7) {
        continue;
      }
      _this.colOptions.push(_this.colData[i].title);
    }
  },
  watch: {
    colOptions(valArr) {
      var arr = this.colSelect.filter((i) => valArr.indexOf(i) < 0);
      this.colData.filter((i) => {
        if (arr.indexOf(i.title) != -1) {
          i.istrue = false;
          this.$nextTick(() => {
            this.$refs.tableDataRef.doLayout();
          });
        } else {
          i.istrue = true;
          this.$nextTick(() => {
            this.$refs.tableDataRef.doLayout();
          });
        }
      });
    },
  },
  components: { picTable, singleimageupload, selectVue, treeSelect },
  methods: {
    changeFactory(value) {
      console.log(value, "厂家id");
    },

    // 获取表格数据
    queryList(params) {
      this.loading = true;
      queryInfoList(params).then((res) => {
        this.loading = false;
        this.tableData = res.data.records;
        this.pageData = {
          total: res.data.total,
          current: res.data.current,
          pageSize: res.data.size,
        };
      });
    },
    // 获取orgID
    getValue(value) {
      this.form.staName = "";
      this.form.region = "";
      this.form.parentId = "";
      this.form.orgId = value;
      getStationList({ orgId: value }).then((res) => {
        this.restaurants = res.data;
      });
    },
    //省市区三联框点击后触发
    handleChange(value) {
      this.form.regId = value[value.length - 1]; //取地区里最后一个值发给后端
    },

    // 表格==区域格式化
    regFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        const code = cellValue;
        return getRegNameByCode(code);
      } else {
        return "";
      }
    },
    statusFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.INFRASTRUCTURE_STATUS, cellValue);
      } else {
        return "";
      }
    },
    nationalFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.INTERNATIONAL_STANDARD, cellValue);
      } else {
        return "";
      }
    }, //

    connectorTypeFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.MUZZLE_TYPE, cellValue);
      } else {
        return "";
      }
    },

    // 复选获取值
    handleSelectionChange(val) {
      this.SelectionArray = val;
    },
    // 分页点击事件
    handleSizeChange(val) {
      let formInline = this.$parent.$refs.topform.form;
      this.pageData.pageSize = val;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      this.queryList(formInline);
    },
    handleCurrentChange(val) {
      let formInline = this.$parent.$refs.topform.form;
      this.pageData.current = val;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      this.queryList(formInline);
    },
    refresh() {
      let formInline = this.$parent.$refs.topform.form;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      this.queryList(formInline);
    },
    // 详情页打开
    openDetail(row) {
      this.detailWin = true;
      this.detailForm = JSON.parse(JSON.stringify(row));
      this.imageUrl = row.picUrl;
      // 字典翻译
      this.detailForm.state = translatorDict(
        DICTDATA.INFRASTRUCTURE_STATUS,
        Number(row.state)
      );
      this.detailForm.national = translatorDict(
        DICTDATA.INTERNATIONAL_STANDARD,
        Number(row.national)
      );
      this.detailForm.ctrlLvl = translatorDict(
        DICTDATA.CONTROLLABLE_GRADE,
        Number(row.ctrlLvl)
      );
      this.detailForm.connectorType = translatorDict(
        DICTDATA.MUZZLE_TYPE,
        Number(row.connectorType)
      );
      // 区域翻译
      const code = row.regId;
      packageDataToMap(code);
      this.detailForm.regId = regName;
      if (row.optTime !== null) {
        this.detailForm.optTime = row.optTime.substring(0, 10);
      }
    },
    // 修改弹框
    handleEdit(row) {
      this.modifyWin = true;
      this.form = JSON.parse(JSON.stringify(row));
      if (row.orgId !== null && row.orgId !== undefined) {
        let object = {};
        object.orgId = row.orgId;
        queryByConditions(object).then((res) => {
          this.restaurants = res.data;
        });
      }
      const code = row.regId;
      packageDataToMap(code);
      this.form.region = regName;
      this.imageUrl = row.picUrl;
      const orgCode = row.orgId;
      this.form.orgName = packageOrgToMap(orgCode);
      this.params.staId = row.staId;
      this.chargeDevices = [];
      queryByPage(this.params).then((res) => {
        for (let i = 0; i < res.data.records.length; i++) {
          let selectValue = {};
          selectValue.value = res.data.records[i].id;
          selectValue.name = res.data.records[i].devName;
          this.chargeDevices.push(selectValue);
        }
      });
    },
    // 图片选取方式
    chooseImage(value) {
      if (value == "") {
        this.imageUrl = "";
      }

      if (this.checkModel.length !== 0) {
        this.checkModel = [];
      }
      if (value === 1) {
        this.uploadWin = true;
      } else {
        this.uploadWin = false;
      }
      if (value === 2) {
        this.imagesWin = true;
      } else {
        this.imagesWin = false;
      }
    },
    saveForm(form) {
      this.form.picUrl = this.imageUrl;
      this.$refs[form].validate((valid) => {
        if (valid) {
          modifyInfo(this.form)
            .then((res) => {
              this.$message({
                message: res.mesg,
                type: "success",
              });
              this.$parent.$refs.biaoge.queryList();
              this.modifyWin = false;
            })
            .catch((res) => {
              this.$message({
                message: res.mesg,
                type: "error",
              });
            });
        }
      });
    },
    // 根据站点id获取区域设施信息
    getStaId(id) {
      this.form.staId = id;
      // console.log(id, "站点id");
      getDetails(id).then((res) => {
        // console.log(res, "res");
        this.form.region = res.data.regName;
        this.form.regId = res.data.regId;
        this.$forceUpdate();
      });

      queryByPage({ staId: id, size: 999 }).then((res) => {
        for (let i = 0; i < res.data.records.length; i++) {
          let selectValue = {};
          selectValue.value = res.data.records[i].id;
          selectValue.name = res.data.records[i].devName;
          this.chargeDevices.push(selectValue);
        }
      });
    },

    handleDelete(row) {
      this.$confirm("确定删除吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      }).then(() => {
        deleteById(row.id)
          .then((res) => {
            if (res.code === "000000") {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.queryList();
            } else {
              this.$message.error("删除失败");
            }
          })
          .catch((err) => {
            this.$message.error("删除失败");
          });
      });
    },
    // 导出数据
    exportTable() {
      // this.queryList(this.$parent.$refs.topform.form);
      this.$parent.$refs.topform.exportAssetConn();
    },

    // 后台排序
    sortChange(column) {
      this.$parent.$refs.topform.form.headers = [];
      this.$parent.$refs.topform.form.values = [];
      let formInline = this.$parent.$refs.topform.form;
      formInline.sortColumn = column.prop;
      if (column.order === "ascending") {
        formInline.order = "asc";
      } else {
        formInline.order = "desc";
      }
      this.queryList(formInline);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-form--inline .el-form-item {
  white-space: nowrap;
}

.el-upload__tip1 {
  margin-left: 280px;
  margin-top: -47px;
  margin-bottom: 20px;
  color: red;
  font-size: 12px;
  white-space: nowrap;
}

#table-wrap {
  width: 100%;
  padding: 0 15px 45px;
}

.srk {
  width: 200px;
}

.s {
  padding: 20px 0;
}

// 二级
// 详情
.xqye {
  display: flex;
  margin: 0px 0px 20px 50px;
}

.xqy {
  // display: flex;
  width: 650px;
}

.tu {
  width: 210px;
  height: 210px;
}

.xq {
  display: flex;
  flex-wrap: wrap;
  margin-left: 10px;
  width: 600px;
}

.a {
  width: 250px;
}

.c {
  width: 500px;
}

.y {
  width: 800px;
  background: #f5f5f5;
}

.h {
  width: 800px;
  height: 40px;
  display: flex;
}

.xqy {
  margin: 0px 0px 30px 0px;
}

//新增用户

.bz {
  width: 175px;
}

.dw {
  margin-right: 125px;
  display: flex;
}

.dw span {
  margin-top: 8px;
  margin-left: 5px;
}

.dw1 {
  padding-right: 4px;
}

.qw {
  width: 1000px;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding-left: 30px;
}

.yz {
  width: 600px;
}

.sexy {
  display: flex;
  margin-top: 8px;
}

.yx {
  margin-left: 110px;
}

.gsxz {
  display: flex;
}

.gs {
  width: 130px;
}

.danw {
  margin: 0px 0px 20px 5px;
}

.k {
  width: 400px;
}

/deep/ #app {
  font-family: "Microsoft YaHei";
}

/deep/ .el-table {
  padding-right: 15px;
}

/deep/ .has-gutter {
  background: #f0f0f0 !important;
}

/deep/ .el-table tr {
  background-color: transparent;
}

img {
  display: inline-block;
  vertical-align: middle;
}

.kz {
  width: 280px;
  margin-right: 30px;
}

/deep/ .qwe .el-select .el-input__inner {
  width: 280px !important;
}

.aniupic {
  width: 140px !important;
  height: 120px !important;
}
</style>
