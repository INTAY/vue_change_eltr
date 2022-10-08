<template>
  <div>
    <div class="s">
      <el-button size="mini" class="newButtonColor listBTN" @click="openAddWin"
        >新增充电枪
      </el-button>
      <el-button
        size="mini"
        class="BatchDeleteColor listBTN"
        @click="deleteBatch"
        >批量删除
      </el-button>
      <excel-upload :import-url="importUrl" />
      <el-button
        size="mini"
        class="newButtonColor listBTN"
        style="float: right"
        @click="downloadExcelTem"
        >下载Excel模版
      </el-button>
    </div>
    <div>
      <div>
        <!-- 新增充电枪设备 -->
        <el-dialog
          title="新增充电枪"
          :modal-append-to-body="false"
          :close-on-click-modal="false"
          :visible.sync="addWin"
          width="950px"
          :before-close="handleClose"
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
                <selectVue
                  v-model="form.state"
                  :options-list="this.$parent.$refs.topform.devicesStatus"
                />
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
              <!-- <el-form-item label="行政区域" prop="region"> -->
              <el-form-item label="行政区域" prop="regId">
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
                <!-- <select-vue
                  :options-list="chargeDevices"
                  v-model="form.parentId"
                /> -->
                <el-select
                  size="mini"
                  value-key="value"
                  v-model="form.parentId"
                  class="kz"
                  @change="handleDevName"
                >
                  <el-option
                    v-for="item in devList"
                    :key="item.id"
                    :label="item.devName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
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
                    v-for="item in factorys"
                    :key="item.id"
                    :label="item.factName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>

            <div class="k">
              <el-form-item label="关联通信设备">
                <el-select
                  size="mini"
                  value-key="value"
                  v-model="form.commFacId"
                  class="kz"
                >
                  <el-option />
                </el-select>
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="通信地址号">
                <el-input class="kz" size="mini" v-model="form.commFacNo" />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="充电枪接口类型" prop="connectorType">
                <select-vue
                  :options-list="muzzleTypes"
                  v-model="form.connectorType"
                />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="可控等级" prop="ctrlLvl">
                <select-vue
                  :options-list="controllableGrade"
                  v-model="form.ctrlLvl"
                />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="负荷控制容量(kW)" prop="ctrlValue">
                <!-- <el-form-item label="负荷控制容量(kW)"> -->
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
              <el-form-item label="图片">
                <select-vue
                  :options-list="picUploadType"
                  :value="1"
                  :name="2"
                  v-model="form.picType"
                  @input="chooseImage"
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
                />
              </el-form-item>
            </div>
          </el-form>
          <div class="dialog-footer">
            <el-button
              size="small"
              @click="saveForm"
              class="editorBTN btnSpace bouncedHold"
              >确定
            </el-button>
            <el-button
              size="small"
              @click="resetForm"
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
import { DICTDATA, getDict } from "../../../../api/dict";
import picTable from "../../../../components/pagetable/picTable";
import singleimageupload from "../../../../components/upload/singleimageupload";
import selectVue from "../../../../components/selectVue";
import { addInfo, bDelete } from "../../../../api/property/chargeGun";
import excelUpload from "../../../../components/upload/excelUpload";
import request from "../../../../api/request";
import { connUrl } from "../../../../utils/downloadTemUrls";
import { getDetails } from "@/api/property/site";
import treeSelect from "../../../../components/treeSelect/treeSelect";
import { queryFactorys } from "../../../../api/system/production";
export default {
  data() {
    return {
      restaurants: [], //根据组织机构获取的站点信息集合
      addWin: false,
      imageUrl: "",
      importUrl: "",
      // 组织结构树
      orgsTree: [],
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
        staName: "",
      },
      factorys: [],
      rules: {
        orgId: [
          { required: true, message: "请选择组织机构", trigger: "change" },
        ],
        devName: [
          { required: true, message: "请输入充电枪名称", trigger: "blur" },
        ],
        devTypeName: [
          {
            required: true,
            message: "请选择所属充电站",
            trigger: ["change", "blur"],
          },
        ],
        connectorType: [
          { required: true, message: "请选择接口类型", trigger: "change" },
        ],
        staId: [
          {
            required: true,
            message: "请选择所属站点",
            trigger: ["blur", "change"],
          },
        ],
        parentId: [
          {
            required: true,
            message: "请选择充电设施",
            trigger: ["blur", "change"],
          },
        ],
        state: [{ required: true, message: "请选择状态", trigger: "change" }],
        ctrlLvl: [
          { required: true, message: "请选择可控等级", trigger: "change" },
        ],
        ctrlValue: [
          { required: true, message: "可控容量不可为空", trigger: "blur" },
        ],
        national: [
          { required: true, message: "请选择国际标准", trigger: "change" },
        ],
        regId: [
          { required: true, message: "所属区域不可为空", trigger: "change" },
        ],
        factId: [{ required: true, message: "请选择厂家", trigger: "change" }],
      },
      stations: [],
      modelTypes: [],
      paramsFact: {},
      paramsModel: {},
      picUploadType: [
        {
          value: 1,
          name: "图片本地上传",
        },
        {
          value: 2,
          name: "图片库选择",
        },
      ],
      checkModel: [],
      uploadWin: false,
      imagesWin: false,
      // 枪口类型
      muzzleTypes: [],
      // 可控等级
      controllableGrade: [],
      internationalStandard: [],
      params: {},
      chargeDevices: [],
      devList: [],
    };
  },
  components: {
    singleimageupload,
    picTable,
    selectVue,
    excelUpload,
    treeSelect,
  },
  created() {
    // 获取充电枪接口类型
    getDict(DICTDATA.MUZZLE_TYPE).then((res) => {
      this.muzzleTypes = res;
    });
    // 获取可控等级
    getDict(DICTDATA.CONTROLLABLE_GRADE).then((res) => {
      this.controllableGrade = res;
    });
    // 获取国际标准
    getDict(DICTDATA.INTERNATIONAL_STANDARD).then((res) => {
      this.internationalStandard = res;
    });
    this.importUrl = request.importExcelConnUrl();
    this.orgsTree = this.$parent.$refs.topform.orgsTree;
    this.queryFactorys(); // 获取厂家
  },
  methods: {
    changeFactory(value) {
      console.log(value, "厂家id");
    },

    // 获取组织id
    getValue(value) {
      // console.log(value, "获取组织id");
      this.form.staId = "";
      this.form.regId = "";
      this.form.parentId = "";
      this.form.orgId = value;
      getStationList({ orgId: value }).then((res) => {
        this.restaurants = res.data;
      });
    },
    openAddWin() {
      this.addWin = true;
      this.$refs.treeSelect.valueTitle = "";
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
        // console.log(res.data.records,"设施名称");
        this.devList = res.data.records;
      });
    },
    handleDevName(id) {
      console.log(id, "id");
      this.form.parentId = id;
    },
    //省市区三联框点击后触发
    handleChange(value) {
      this.form.regId = value[value.length - 1]; //取地区里最后一个值发给后端
    },
    // 图片选择方式
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
    // 新增
    saveForm() {
      this.form.picUrl = this.imageUrl;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.addWin = false;
          addInfo(this.form).then((res) => {
            if (res.code !== "000000") {
              this.$message({
                message: "保存失败",
                type: "warning",
              });
            } else {
              this.$message({
                message: "保存成功！",
                type: "success",
              });
              // 重新查询列表
              this.$parent.$refs.biaoge.queryList();
              this.$refs.treeSelect.valueTitle = "";
              this.$refs["form"].resetFields();
            }
          });
        }
      });
    },
    resetForm() {
      this.addWin = false;
      this.form = {};
      this.imageUrl = "";
      this.$refs.treeSelect.valueTitle = "";
      this.$refs["form"].resetFields();
    },
    handleClose() {
      this.addWin = false;
      this.form = {};
      this.imageUrl = "";
      this.$refs.treeSelect.valueTitle = "";
      this.$refs["form"].resetFields();
    },
    deleteBatch() {
      let arr = [];
      if (this.$parent.$refs.biaoge.SelectionArray.length === 0) {
        this.$message({
          message: "请至少选择一条数据!",
          type: "warning",
        });
        return false;
      }
      this.$parent.$refs.biaoge.SelectionArray.forEach((item) => {
        arr.push(item.id);
      });
      this.$confirm("确定删除吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        bDelete(arr).then((res) => {
          if (res.code === "000000" && res.data) {
            this.$message({
              showClose: true,
              message: "删除成功！",
              type: "success",
            });
            this.$parent.$refs.biaoge.queryList();
          }
        });
      });
    },
    //下载excel 模版
    downloadExcelTem() {
      let a = document.createElement("a");
      a.href = connUrl;
      a.click();
    },
    // 获取厂家
    queryFactorys() {
      queryFactorys({
        kind: 2015,
        factType: 2,
      }).then((res) => {
        this.factorys = res.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
//
.el-upload__tip1 {
  margin-left: 280px;
  margin-top: -47px;
  margin-bottom: 20px;
  color: red;
  font-size: 12px;
  white-space: nowrap;
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
  padding-left: 20px;
}

.kz {
  width: 280px;
  margin-right: 30px;
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
  margin-right: 20px;
}

//分配权限
.fp {
  display: flex;
  flex-wrap: wrap;
  margin-left: 90px;
}

//关联角色
.glf {
  margin-left: 85px;
}

.gl {
  width: 300px;
}

.glnt {
  margin-left: 80px;
  margin-top: 30px;
}

// 按钮

.s {
  padding: 10px 15px 0;
}

/deep/ .qwe .el-select .el-input__inner {
  width: 280px !important;
}

.aniupic {
  width: 140px !important;
  height: 120px !important;
}

//  新增按钮
</style>
