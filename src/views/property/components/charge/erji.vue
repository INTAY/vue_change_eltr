<template>
  <div>
    <div class="s">
      <el-button
        size="mini"
        class="listBTN newButtonColor"
        @click="addWin = true"
        >新增充电桩
      </el-button>
      <el-button
        size="mini"
        class="listBTN BatchDeleteColor"
        @click="deleteBatch"
        >批量删除
      </el-button>
      <excel-upload :import-url="importUrl" />
      <el-button
        size="mini"
        class="listBTN newButtonColor"
        style="float: right"
        @click="downloadExcelTem"
        >下载Excel模版
      </el-button>
    </div>
    <div>
      <div>
        <!-- 新增充电设备 -->
        <el-dialog
          title="新增充电桩"
          :modal-append-to-body="false"
          :close-on-click-modal="false"
          :visible.sync="addWin"
          width="1020px"
          :before-close="handleClose"
        >
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="110px"
            size="small"
            class="qw"
          >
            <div class="k">
              <el-form-item label="充电枪名称" prop="devName">
                <el-input size="mini" v-model="form.devName" class="kz" />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="状态" prop="state">
                <el-select size="mini" v-model="form.state" class="kz">
                  <el-option
                    v-for="item in this.$parent.$refs.topform.devicesStatus"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
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
                  class="kz"
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
              <el-form-item label="行政区域" class="a" prop="regId">
                <el-cascader
                  v-model="form.regId"
                  size="mini"
                  :options="this.$parent.$refs.topform.areas"
                  :props="props"
                  clearable
                  @change="handleChange"
                  class="kz"
                />
              </el-form-item>

              <!-- <el-form-item label="行政区域">
                <el-input
                  size="mini"
                  v-model="form.region"
                  readonly
                  class="kz"
                />
              </el-form-item> -->
            </div>

            <div class="k">
              <el-form-item label="能量补给类型" prop="engSupType">
                <el-select
                  size="mini"
                  class="kz"
                  v-model="form.engSupType"
                  clearable
                >
                  <el-option
                    v-for="item in energys"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <!-- <el-form-item label="上级设备">
                <el-input
                  readonly
                  placeholder="保留，暂不填"
                  disabled
                  class="kz"
                />
              </el-form-item> -->
            </div>

            <div class="k">
              <el-form-item label="额定功率(KW)" prop="ratePower">
                <el-input
                  size="mini"
                  v-model="form.ratePower"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  placeholder="额定功率"
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
                    v-for="item in factorys"
                    :key="item.id"
                    :label="item.factName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="设备型号">
                <el-select
                  size="mini"
                  v-model="form.modelType"
                  value-key="id"
                  class="kz"
                  @change="changeDeviceModel"
                >
                  <el-option
                    v-for="item in modelTypes"
                    :key="item.id"
                    :label="item.modelName"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="资产编号" prop="assetNo">
                <el-input
                  size="mini"
                  v-model="form.assetNo"
                  placeholder
                  class="kz"
                />
              </el-form-item>
            </div>

            <div class="k">
              <el-form-item label="三方资产编号" prop="sourceId">
                <el-input
                  size="mini"
                  v-model="form.sourceId"
                  placeholder
                  class="kz"
                />
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="出厂日期" prop="mfdTime">
                <el-date-picker
                  size="mini"
                  v-model="form.mfdTime"
                  type="date"
                  placeholder="请选择出厂日期"
                  class="kz"
                  :picker-options="mfdTimePicker"
                />
              </el-form-item>
            </div>

            <div class="k">
              <el-form-item label="投运日期" prop="optTime">
                <el-date-picker
                  size="mini"
                  v-model="form.optTime"
                  type="date"
                  placeholder="请选择投运日期"
                  class="kz"
                  :picker-options="optTimePicker"
                />
              </el-form-item>
            </div>

            <div class="k">
              <el-form-item label="是否有序" prop="isOrder">
                <el-radio v-model="form.isOrder" label="0">否</el-radio>
                <el-radio v-model="form.isOrder" label="1">是</el-radio>
              </el-form-item>
            </div>
            <div class="k">
              <el-form-item label="图片">
                <el-select
                  size="mini"
                  class="kz"
                  clearable
                  @change="chooseImage"
                  v-model="checkValue"
                >
                  <el-option
                    v-for="item in picUploadType"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
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
            <!-- <div class="k">
             
            </div> -->
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
import {
  batchDelete,
  getStationList,
  saveData,
} from "../../../../api/property/charge";
import { DICTDATA, getDict } from "../../../../api/dict";
import { queryFactorys } from "../../../../api/system/production";
import { queryModelList } from "../../../../api/system/type";
import picTable from "../../../../components/pagetable/picTable";
import singleimageupload from "../../../../components/upload/singleimageupload";
import request from "../../../../api/request";
import { stakeUrl } from "../../../../utils/downloadTemUrls";
import excelUpload from "../../../../components/upload/excelUpload";
import Vue from "vue";
import { getDetails } from "../../../../api/property/site";
import treeSelect from "../../../../components/treeSelect/treeSelect";

// const tonken = Vue.cookie.get("token");
export default {
  data() {
    return {
      restaurants: [], //根据组织机构获取的站点信息集合
      orgsTree: [], //组织机构
      areas: [], // 地区数据
      addWin: false,
      imageUrl: "",
      importUrl: "",
      // headers: { Authorization: "Bearer " + tonken },
      props: {
        checkStrictly: true,
        label: "name",
        children: "children",
        value: "id",
      },
      form: {
        isOrder: "0",
        devName: "",
        engSupType: "",
        assetNo: "",
        orgId: "",
        regId: "",
        staId: "",
        siteName: "",
        parentId: "",
        modelId: "",
        modelName: "",
        modelType: "",
        factId: "",
        sourceId: "",
        ratePower: "",
        picUrl: "",
        state: "",
        mfdTime: "",
        optTime: "",
        region: "",
        orgName: "",
      },
      rules: {
        isOrder: [
          { required: true, message: "请选择有序选项", trigger: "blur" },
        ],
        devName: [
          {
            required: true,
            message: "请输入充电枪名称",
            trigger: "blur",
          },
        ],
        ratePower: [
          { required: true, message: "请输入额定功率", trigger: "blur" },
        ],
        assetNo: [
          { required: true, message: "请输入资产编号", trigger: "blur" },
        ],
        sourceId: [
          { required: true, message: "请输入第三方资产编号", trigger: "blur" },
        ],

        engSupType: [
          { required: true, message: "请选择能源补给类型", trigger: "change" },
        ],
        staId: [{ required: true, message: "请选择所属站点", trigger: "blur" }],
        modelType: [
          { required: true, message: "请选择设备型号", trigger: "change" },
        ],
        factId: [{ required: true, message: "请选择厂家", trigger: "change" }],
        state: [{ required: true, message: "请选择状态", trigger: "change" }],
        mfdTime: [
          { required: true, message: "请选择出厂日期", trigger: "change" },
        ],
        optTime: [
          { required: true, message: "请选择投运日期", trigger: "change" },
        ],
        orgId: [
          { required: true, message: "组织机构不能为空", trigger: "change" },
        ],
        regId: [{ required: true, message: "区域不能为空", trigger: "change" }],
      },
      orgDefaultProps: {
        value: "id",
        label: "name",
        children: "children",
      },
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      mfdTimePicker: {
        disabledDate: (time) => {
          let endDateVal = this.form.optTime;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        },
      },
      optTimePicker: {
        disabledDate: (time) => {
          let beginDateVal = this.form.mfdTime;
          if (beginDateVal) {
            return (
              time.getTime() <
              new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            );
          }
        },
      },
      stations: [],
      checkValue: "",
      deviceTypes: [],
      factorys: [],
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
      energys: [],
      checkModel: [],
      uploadWin: false,
      imagesWin: false,
      state: "",
      params: {},
      ids: [],
    };
  },
  components: { singleimageupload, picTable, excelUpload, treeSelect },
  mounted() {
    this.getModelTypes();
    this.orgsTree = this.$parent.$refs.topform.orgsTree;
    getDict(DICTDATA.ENERGY_SUPPLY_TYPE).then((res) => {
      this.energys = res;
    });
    this.queryFactorys(); // 获取厂家
    this.importUrl = request.importExcelStakeUrl();
  },
  methods: {
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
    // 根据站点id获取区域设施信息
    getStaId(id) {
      this.form.staId = id;
      getDetails(id).then((res) => {
        this.form.regId = res.data.regId;
        this.$forceUpdate();
      });
    },
    //省市区三联框点击后触发
    handleChange(value) {
      this.form.regId = value[value.length - 1]; //取地区里最后一个值发给后端
    },

    // 获取设备类型数据
    getModelTypes() {
      getDict(DICTDATA.CHARGE_TYPE).then((res) => {
        this.deviceTypes = res;
      });
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
    changeFactory(value) {
      this.paramsModel.factId = value;
      queryModelList(this.paramsModel).then((res) => {
        this.modelTypes = res.data;
      });
    },
    changeDeviceModel(value) {
      this.form.modelName = value.modelName;
      this.form.modelId = value.id;
    },
    // 图片选择方式
    chooseImage(value) {
      if (value === "") {
        this.imageUrl = "";
      }

      if (this.checkModel.length !== 0) {
        this.checkModel = [];
      }
      if (this.checkValue === 1) {
        this.uploadWin = true;
      } else {
        this.uploadWin = false;
      }
      if (this.checkValue === 2) {
        this.imagesWin = true;
      } else {
        this.imagesWin = false;
      }
    },
    saveForm() {
      this.form.isOrder = Number(this.form.isOrder);
      // console.log( this.form.isOrder,"isOrder");
      this.form.picUrl = this.imageUrl;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.addWin = false;
          saveData(this.form)
            .then((res) => {
              if (res.data === true) {
                this.$message({
                  message: res.mesg,
                  type: "success",
                });
              }
              this.$parent.$refs.biaoge.queryList();
              this.form = {};
              this.$refs.treeSelect.valueTitle = "";
              this.$refs["form"].resetFields();
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
        batchDelete(arr).then((res) => {
          if (res.code === "000000" && res.data) {
            this.$message({
              showClose: true,
              message: "删除成功！",
              type: "success",
            });
            this.$parent.$refs.biaoge.queryList();
          }
        });
        // batchDelete(arr)
        //   .then((res) => {
        //     this.$message({
        //       message: res.mesg,
        //       type: "success",
        //     });
        //   })
        //   .catch((res) => {
        //     this.$message({
        //       message: res.mesg,
        //       type: "error",
        //     });
        //   });
        // this.$parent.$refs.biaoge.queryList();
      });
    },
    //下载excel 模版
    downloadExcelTem() {
      let a = document.createElement("a");
      a.href = stakeUrl;
      a.click();
    },
  },
};
</script>
<style lang="scss" scoped>
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
  padding-left: 80px;
}

.kz {
  width: 260px;
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

.aniuEx {
  width: 120px;
}

.s {
  padding: 10px 15px 0;
  border-top: 1px solid #eeeeee;
}

.el-upload__tip1 {
  margin-left: 252px;
  margin-top: -47px;
  margin-bottom: 20px;
  color: red;
  font-size: 12px;
  white-space: nowrap;
}
</style>
