<template>
  <div>
    <div class="s">
      <el-button size="small" class="aniu" @click="addBtn">新增配变</el-button>
      <el-button size="small" class="aniu" @click="checkDel">批量删除</el-button>
      <!-- <excel-upload :import-url="importUrl"/>-->
      <!-- <el-button size="small" class="aniu" plain style="float: right;margin-right: -0.97%" @click="downloadExcelTem">
        下载Excel模版
      </el-button> -->
    </div>

    <div>
      <el-dialog
        :title="title"
        :visible.sync="dialogFormVisible"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="950px"
      >
        <el-form
          ref="form"
          :model="sizeForm"
          :rules="rules"
          label-width="110px"
          size="mini"
          class="qw"
        >
          <div class="k">
            <el-form-item label="配变名称" prop="devName">
              <el-input v-model="sizeForm.devName" class="kz"></el-input>
            </el-form-item>
          </div>

          <div class="K">
            <el-form-item label="组织机构" prop="orgId">
              <tree-select
                class="kz"
                ref="treeSelect"
                v-model="sizeForm.orgId"
                :props="orgDefaultProps"
                :options="orgTreeData"
                :clearable="isClearable"
                :accordion="isAccordion"
                @getValue="getValue($event)"
              />
            </el-form-item>
          </div>

          <div class="k">
            <el-form-item label="行政区域" prop="regId" class="ww">
              <el-cascader
                v-model="sizeForm.regId"
                size="mini"
                :options="regTreeData"
                :props="defaultProps"
                clearable
                @change="handleChange"
                class="kz"
              ></el-cascader>
            </el-form-item>
          </div>
          <div class="k">
            <el-form-item label="状态" prop="state">
              <el-select v-model="sizeForm .state" placeholder="请选择状态" class="kz">
                <el-option
                  v-for="item in unitDate"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="k">
            <el-form-item label="设备类型" class="a" prop="devType">
              <el-select
                @change="changeModelClick"
                v-model="sizeForm.devType"
                value-key="value"
                placeholder="全部"
                class="kz"
              >
                <el-option
                  v-for="item in devType"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="k">
            <el-form-item label="生产厂家" prop="factName">
              <el-select
                size="mini"
                @change="changeFactory"
                v-model="sizeForm.factName"
                value-key="value"
                class="kz"
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
            <el-form-item label="设备型号" prop="modelId">
              <el-select
                size="mini"
                v-model="sizeForm.modelName"
                @change="changeDeviceModel"
                class="kz"
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
            <el-form-item label="关联线路">
              <el-select v-model="sizeForm.lineId" multiple placeholder="请选择关联线路" class="kz">
                <el-option
                  value-key="value"
                  v-for="item in lineData"
                  :key="item.id"
                  :label="item.devName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="k">
            <el-form-item label="所属台区">
              <el-autocomplete
                ref="autoComplete"
                v-model="sizeForm.areaName"
                :fetch-suggestions="querySearchAsyncArea"
                placeholder="请输入检索关键字"
                @select="handleSelectArea"
                clearable
                class="kz"
              />
            </el-form-item>
          </div>

          <div class="k">
            <el-form-item label="所属园区">
              <el-autocomplete
                ref="autoComplete"
                v-model="sizeForm.zoneName"
                :fetch-suggestions="querySearchAsyncZone"
                placeholder="请输入检索关键字"
                @select="handleSelectZone"
                clearable
                class="kz"
              />
            </el-form-item>
          </div>

          <div class="k">
            <el-form-item label="电压等级" class="a">
              <el-select v-model="sizeForm.volType" placeholder="全部" class="kz">
                <el-option
                  v-for="item in voltageDate"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="k">
            <el-form-item label="额定负载(KW)">
              <el-input v-model="sizeForm.ratedLoad" class="kz"></el-input>
            </el-form-item>
          </div>
          <div class="k">
            <el-form-item label="关联通讯设备">
              <el-select v-model="sizeForm.commFacId" placeholder="全部" class="kz">
                <el-option
                  v-for="item in rtuAddrData"
                  :key="item.id"
                  :label="item.rtuName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="k">
            <el-form-item label="通讯地址号">
              <el-select v-model="sizeForm.commFacNo" placeholder="全部" class="kz">
                <el-option v-for="item in rtuAddrData" :key="item.id" :value="item.rtuAddr"></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="k">
            <el-form-item label="资产编号">
              <el-input v-model="sizeForm.assetNo" class="kz"></el-input>
            </el-form-item>
          </div>
          <div class="k">
            <el-form-item label="第三方资产编号">
              <el-input v-model="sizeForm.thirdPartyAssetNo" class="kz"></el-input>
            </el-form-item>
          </div>
          <div class="k">
            <el-form-item label="出厂日期">
              <el-date-picker
                size="mini"
                v-model="sizeForm .mfdTime"
                type="date"
                placeholder="请选择出厂日期"
                class="kz"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="k">
            <el-form-item label="投运日期">
              <el-date-picker
                size="mini"
                v-model="sizeForm .optTime"
                type="date"
                placeholder="请选择投运日期"
                class="kz"
              ></el-date-picker>
            </el-form-item>
          </div>

          <div class="k kp">
            <!-- 图片上传方式 -->
            <el-form-item label="上传图片" class="selectClass" label-width="100px">
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
            </el-form-item>
            <el-form-item>
              <el-image class="kz aniupic" :src="imageUrl"></el-image>
            </el-form-item>
            <div slot="tip" class="el-upload__tip">(只能上传jpg/png/gif文件,2MB以内)</div>
            <!-- 图片上传方式end -->
          </div>
        </el-form>

        <div class="nn">
          <el-button size="small" @click="save" class="bouncedHold  editorBTN btnSpace">保存</el-button>
          <el-button size="small" @click="cancel" class="cancelBTN  editorBTN">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 图片系统上传imageListWin -->
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

    <!-- 图片系统上产end -->
    <!-- 图片本地上传对话框uploadWin -->
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
        <singleimageupload />
      </el-dialog>
    </div>
    <!-- 图片本地上传end -->
  </div>
</template>
<script>
import {
  addDatas,
  checkDelete,
  getOrgTree,
  modiData
} from "@/api/property/transformer";
import singleimageupload from "@/components/upload/singleimageupload";
import picTable from "@/components/pagetable/picTable";
import { picUrl } from "@/components/upload/picUpload";
import imgUrl from "../../../../assets/image/from图片.png";
import { DICTDATA, getDict, translatorDict } from "@/api/dict";
import { queryFactorys } from "@/api/system/production";
import { queryModelList, cx } from "@/api/system/type";
import treeSelect from "@/components/treeSelect/treeSelect";
import {
  getQueryByPageStage,
  getQueryByPageGarden
} from "@/api/property/transformer";
import { getSite } from "@/api/property/photovoltaic";
export default {
  data() {
    return {
      title: "",
      rules: {
        devName: [
          { required: true, message: "请输入配变名称", trigger: "blur" }
        ],
        orgId: [{ required: true, message: "请选择组织机构", trigger: "blur" }],
        regId: [
          { required: true, message: "请选择行政区域", trigger: "change" }
        ],
        state: [{ required: true, message: "请选择状态", trigger: "change" }],
        devType: [
          { required: true, message: "请选择设备类型", trigger: "change" }
        ],
        factName: [
          { required: true, message: "请选择生产厂家", trigger: "change" }
        ],
        modelId: [
          { required: true, message: "请选择设备型号", trigger: "change" }
        ]
      },

      dialogFormVisible: false,
      sizeForm: {
        modelId: "",
        lineId: null
      },
      state: [],
      picUploadType: [
        {
          value: 1,
          name: "图片本地上传"
        },
        {
          value: 2,
          name: "图片库选择"
        }
      ],
      uploadWin: false,
      imagesWin: false,
      imageUrl: imgUrl,
      checkValue: "",
      checkModel: [],
      visibleOrgTree: false, // tree
      orgTreeData: [],
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      orgDefaultProps: {
        value: "id",
        label: "name",
        children: "children"
      },
      regTreeData: [], // tree
      defaultProps: {
        checkStrictly: true,
        children: "children",
        value: "id",
        label: "name"
      },
      devType: [], //设备类型
      paramsFact: {},
      paramsModel: {},
      factorys: [],
      modelTypes: [], //生产厂家
      stageData: [],
      rtuAddrData: [], //通讯地址号
      unitDate: [], // 设备状态
      voltageDate: [], //电压等级231
      lineData: [], //线路
      submitDate: {
        devClass: 2011
      }, //查询数据
      params: {},
    };
  },
  created() {
    getOrgTree().then(res => {
      this.orgTreeData = res.data;
    });
  },
  components: {
    singleimageupload,
    picTable,
    treeSelect,
  },
  methods: {

    setData() {
      this.regTreeData = this.$parent.$parent.$refs.topform.regTreeData;
      this.devType = this.$parent.$parent.devType;
      this.rtuAddrData = this.$parent.$parent.rtuAddrData;
      this.unitDate = this.$parent.$parent.unitDate;
      this.voltageDate = this.$parent.$parent.voltageDate;
      this.lineData = this.$parent.$parent.lineData;
    },
    getValue(value) {
      this.sizeForm.orgId = value;
    },

    addBtn() {
      this.sizeForm = {};
      this.title = "新增配变";
      this.dialogFormVisible = true;
      if (this.checkValue != "") {
        this.checkValue = "";
      }
      this.imageUrl = imgUrl;
      this.$refs.treeSelect.valueTitle = "";
      this.$refs["form"].resetFields();
    },
    save() {
      this.sizeForm.picUrl = this.imageUrl;
      this.sizeForm.lineId = JSON.stringify(this.sizeForm.lineId);
      this.sizeForm.lineId = this.sizeForm.lineId.replace(/\"/g, "");
      this.sizeForm.lineId = this.sizeForm.lineId.replace("[", "");
      this.sizeForm.lineId = this.sizeForm.lineId.replace("]", "");
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.sizeForm.id && this.sizeForm.id !== "") {
            modiData(this.sizeForm).then(res => {
              if (res.code !== "000000") {
                this.$message({
                  message: res.mesg,
                  type: "warning"
                });
              } else {
                this.$message({
                  message: "修改成功！",
                  type: "success"
                });
                this.dialogFormVisible = false;
                // 重新查询列表
                this.$parent.$parent.$refs.crudForm.getDataInit();
              }
            });
          } else {
            if (!this.checkValue) {
              this.$message.error("请选择图片上传方式!");
              return false;
            }

            addDatas(this.sizeForm).then(res => {
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

                // 重新查询列表
                this.$parent.$parent.$refs.crudForm.getDataInit();
              }
            });
          }
        }
      });
    },
    // 取消
    cancel() {
      this.$refs["form"].resetFields();
      this.$refs.treeSelect.valueTitle = "";
      this.dialogFormVisible = false;
      this.imageUrl = imgUrl;
      this.sizeForm = {};
    },
    // 批量删除
    checkDel() {
      let multipleSelection = this.$parent.$parent.$refs.crudForm
        .multipleSelection;
      if (multipleSelection.length === 0) {
        this.$message({
          message: "请选择要删除的数据！",
          type: "warning"
        });
      } else {
        this.$confirm("确定要删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let ids = [];
          for (let i in multipleSelection) {
            ids.push(multipleSelection[i].id);
          }
          checkDelete(ids).then(res => {
            if (res.code === "000000" && res.data) {
              this.$message({
                showClose: true,
                message: "删除成功！",
                type: "success"
              });
              this.$parent.$parent.$refs.crudForm.getDataInit();
            }
          });
        });
      }
    },
    //省市区三联框点击后触发
    handleChange(value) {
      this.sizeForm.regId = value[value.length - 1]; //取地区里最后一个值发给后端
    },
    // 下拉框点击事件,不同的选择跳不同的页面
    chooseImage() {
      this.fileList = [];
      if (this.checkModel.length != 0) {
        this.checkModel = [];
      }
      if (this.checkValue == 1) {
        this.uploadWin = true;
      } else {
        this.uploadWin = false;
      }
      if (this.checkValue == 2) {
        this.imagesWin = true;
      } else {
        this.imagesWin = false;
      }
    },
    /**
     * 根据分类、类型，获取厂家下拉框数据
     */
    changeModelClick(value) {
      this.paramsFact.kind = 2011;
      this.paramsFact.factType = value;
      queryFactorys(this.paramsFact).then(res => {
        this.factorys = res.data;
      });
    },
    //生产厂家
    changeFactory(value) {
      this.sizeForm.factId = value;
      this.paramsModel.factId = value;
      queryModelList(this.paramsModel).then(res => {
        this.modelTypes = res.data;
      });
    },
    changeDeviceModel(value) {
      this.sizeForm.modelName = value.modelName;
      this.sizeForm.modelId = value.id;
    },
    // 远程搜索台区列表
    querySearchAsyncArea(queStr, cb) {
      if (queStr !== "") {
        this.params.areaName = queStr;
        getQueryByPageStage(this.params).then(res => {
          for (let i of res.data.records) {
            i.value = i.areaName;
          }
          let results = res.data.records;
          cb(results);
        });
      }
    },
    handleSelectArea(item) {
      this.sizeForm.areaId = item.id;
    },

    // 园区
    querySearchAsyncZone(queStr, cb) {
      if (queStr !== "") {
        this.params.zoneName = queStr;
        // 获取园区信息
        getQueryByPageGarden(this.params).then(res => {
          for (let i of res.data.records) {
            i.value = i.zoneName;
          }
          let results = res.data.records;
          cb(results);
        });
      }
    },
    handleSelectZone(item) {
      this.sizeForm.zoneId = item.id;
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-input--prefix .el-input__inner {
  padding-left: 15px;
}
.el-upload__tip {
  margin-left: 245px;
  margin-top: -47px;
  margin-bottom: 20px;
  color: red;
  font-size: 12px;
  white-space: nowrap;
}

.aniupic {
  width: 140px !important;
  height: 120px !important;
  margin-left: -8px;
}

.nn {
 display: flex;
 justify-content:center;
}

.bz {
  width: 175px;
}
.dw {
  display: flex;
}
.dw span {
  margin-top: 8px;
  margin-left: 5px;
}
.dw1 {
  padding-right: 4px;
}
.ntd {
  color: white !important;
  background: #006080 !important;
  width: 200px;
  margin-left: 70px;
  margin-right: 20px;
}
.ntx {
  color: #006080 !important;
  width: 200px;
}
.qw {
  width: 1000px;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding-left: 25px;
}
.kz {
  width: 280px;
  margin-right: 30px;
}
.dq {
  width: 90px;
}
.ww {
  margin-right: 42px;
}
.k {
  width: 450px;
  margin-right: 10px;
}
.aniu {
  color: white !important;
  background: #006080 !important;
  width: 120px;
}
.anniu {
  color: #006080 !important;
  width: 120px;
}

.el-button {
  color: #006080;
}
/deep/ .k .el-form-item__label {
  color: #606266;
}
.kp {
  margin-left: 10px;
}

/deep/ .kp .el-form-item__label:before {
  content: "*";
  color: #ff4949;
  height: 32px;
  margin-right: 3px;
  font-size: 14px;
}
/deep/ .el-select-tree .el-input.is-active .el-input__inner {
  border-color: #00607f !important;
}
</style>
