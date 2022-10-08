<template>
  <div>
    <div class="s">
      <el-button class="newButtonColor btnSpace listBTN" @click="addDialogFormVisible">新增站点</el-button>
      <el-button class="BatchDeleteColor listBTN" @click="batchDelete">批量删除</el-button>
    </div>

    <!-- 新增站点 -->
    <el-dialog
      title="新增站点"
      :visible.sync="DialogFormVisible"
      width="950px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="110px"
        size="mini"
        class="qw add-css"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="站点名称" prop="staName">
              <el-input size="mini" v-model="form.staName" placeholder="请输入站点名称" class="kz"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织机构" class="a" prop="orgId">
              <tree-select
                ref="treeSelect"
                v-model="form.orgId"
                :props="orgDefaultProps"
                :options="orgTreeData"
                :clearable="isClearable"
                :accordion="isAccordion"
                @getValue="getValue($event)"
                class="kz"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 2排 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="state">
              <el-select size="mini" v-model="form.state" placeholder="请选择状态" class="kz">
                <el-option value>全部</el-option>
                <el-option
                  v-for="item in status"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="站点类型" prop="staType">
              <el-select size="mini" v-model="form.staType" placeholder="请选择站类型" class="kz">
                <el-option value>全部</el-option>
                <el-option
                  v-for="item in type"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 3排 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="能源类型" prop="engType">
              <el-select size="mini" v-model="form.engType" placeholder="请选择能源类型" class="kz">
                <el-option value>全部</el-option>
                <el-option
                  v-for="item in energyType"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建设场所类型" prop="buildType">
              <el-select size="mini" v-model="form.buildType" placeholder="请选择建设场所类型" class="kz">
                <el-option value>全部</el-option>
                <el-option
                  v-for="item in constructionType"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 四排 -->

        <!-- 五排 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="行政区域" prop="regId">
              <el-cascader
                class="kz"
                v-model="form.regId"
                size="mini"
                :options="regTreeData"
                :props="defaultProps"
                clearable
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="投运时间">
              <el-date-picker
                size="mini"
                v-model="form.optTime"
                type="date"
                format="yyyy-MM-dd "
                value-format="yyyy-MM-dd "
                placeholder="请选择投运时间"
                class="kz"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 6排 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属台区">
              <el-autocomplete
                ref="autoComplete"
                v-model="form.areaName"
                :fetch-suggestions="querySearchAsyncArea"
                placeholder="请输入检索关键字"
                @select="handleSelectArea"
                clearable
                class="kz"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属园区">
              <el-autocomplete
                ref="autoComplete"
                v-model="form.zoneName"
                :fetch-suggestions="querySearchAsyncZone"
                placeholder="请输入检索关键字"
                @select="handleSelectZone"
                clearable
                class="kz"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 6排 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="占地面积(平方)">
              <el-input size="mini" v-model="form.floorArea" placeholder="请输入站地面积" class="kz"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="地址">
              <el-input size="mini" v-model="form.addr" placeholder="请输入详细地址" class="kz">
                <el-button
                  slot="append"
                  style="width:65px"
                  @click="showAddGardenMap"
                  icon="el-icon-map-location"
                  placeholder="请输入详细地址"
                ></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="经度">
              <el-input size="mini" v-model="form.lng" placeholder="请输入经度" class="kz"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度">
              <el-input size="mini" v-model="form.lat" placeholder="请输入纬度" class="kz"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 7排 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="配变容量(kw)">
              <el-input size="mini" v-model="form.transCap" placeholder="请输入配变容量" class="kz"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业时间">
              <el-input size="mini" v-model="form.busHours" placeholder="请输入营业时间" class="kz"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 8排 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人">
              <el-input size="mini" v-model="form.link" placeholder="请输入联系人" class="kz"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话">
              <el-input size="mini" v-model="form.tel" placeholder="请输入联系电话" class="kz"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 9排 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务电话">
              <el-input size="mini" v-model="form.svrTel" placeholder="请输入服务电话" class="kz"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停车信息描述">
              <el-input size="mini" v-model="form.parkInfo" placeholder="请输入停车信息描述" class="kz"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 10排 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="停车费用描述">
              <el-input size="mini" v-model="form.parkFee" placeholder="请输入停车费用描述" class="kz"></el-input>
            </el-form-item>
            <el-col :span="12">
              <el-form-item label="充电费用描述">
                <el-input size="mini" v-model="form.eleFee" placeholder="请输入充电费用描述" class="kz"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <!-- 11排 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务费用描述">
              <el-input size="mini" v-model="form.svrFee" placeholder="请输入停车费用描述" class="kz"></el-input>
            </el-form-item>
            <el-col :span="12">
              <el-form-item label="支付方式描述">
                <el-input size="mini" v-model="form.payment" placeholder="请输入支付方式描述" class="kz"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="kp">
            <!-- 图片上传方式 -->
            <el-form-item label="上传图片">
              <el-select
                size="mini"
                class="kz"
                placeholder="请选择图片上传方式"
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

            <el-image
              class="kz aniupic"
              :src="imageUrl"
              style="width: 140px; height: 120px;  border-radius:5px 5px 5px;margin-left:18%;"
            ></el-image>
          </el-col>
          <el-col class="kp pic_tip">(只能上传jpg/png/gif文件，2MB以内)</el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="简介">
              <el-input type="textarea" v-model="form.descr" style="width: 705px;margin-top:10px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="nn">
        <el-button size="small" @click="save" class="bouncedHold  editorBTN btnSpace">确定</el-button>
        <el-button size="small" @click="quxiao" class="cancelBTN  editorBTN">取消</el-button>
      </div>
    </el-dialog>
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
      <addGardenMap v-if="sign" @map-confirm="handleMapConfirm" ref="addGardenMap" />
    </div>
    <!-- 图片本地上传end -->
  </div>
</template>
<script>
import { queryData } from "@/api/system/picture"; //查询列表和删除选项
import { batchDelete, addStation, getOrgTree } from "@/api/property/site";
import singleimageupload from "@/components/upload/singleimageupload";
import picTable from "@/components/pagetable/picTable";
import addGardenMap from "@/views/property/components/map/addGardenMap";
import { picUrl } from "@/components/upload/picUpload";
import imgUrl from "../../../../assets/image/from图片.png";
import treeSelect from "@/components/treeSelect/treeSelect";
import {
  getQueryByPageStage,
  getQueryByPageGarden,
} from "@/api/property/transformer";
import { packageDataToMap, regName, getRegNameByCode } from "@/utils/area";
import request from "../../../../api/request";
import { PvUrl, stationUrl } from "../../../../utils/downloadTemUrls";
import excelUpload from "../../../../components/upload/excelUpload";
import { getStationNameByRegId } from "../../../../api/property/site";
export default {
  data() {
    return {
      sign: false,
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
      imageListWin: false,
      uploadWin: false,
      imagesWin: false,
      checkValue: "",
      imageUrl: "",
      checkModel: [],
      fileList: [],
      currentPage: 1,
      pageSize: 20,
      total: 40,

      //本地图片上传
      DialogFormVisible: false,
      orgTreeData: [],
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      orgDefaultProps: {
        value: "id",
        label: "name",
        children: "children",
      },
      form: {
        addr: "",
        lng: "",
        lat: "",
        areaId: "",
        zoneId: "",
      },
      rules: {
        staName: [
          { required: true, message: "请输入站点名称", trigger: "blur" },
        ],
        orgId: [{ required: true, message: "请选择组织机构", trigger: "blur" }],
        state: [{ required: true, message: "请选择状态", trigger: "blur" }],
        staType: [
          { required: true, message: "请选择站点类型", trigger: "change" },
        ],
        engType: [
          { required: true, message: "请选择能源类型", trigger: "change" },
        ],
        buildType: [
          { required: true, message: "请选择建设场所类型", trigger: "change" },
        ],
        regId: [
          { required: true, message: "请选择行政区域", trigger: "change" },
        ],
      },
      regTreeData: [],
      defaultProps: {
        checkStrictly: true,
        children: "children",
        value: "id",
        label: "name",
      },
      status: [], // 基础设施状态
      type: [], // 站类型
      energyType: [], // 能源类型
      constructionType: [], //建设场所类型224
      gardenData: [],
      stageData: [],
      params: {},
      importUrl: "",
    };
  },
  components: {
    singleimageupload,
    picTable,
    addGardenMap,
    treeSelect,
    excelUpload,
  },
  created() {
    this.importUrl = request.importExcelStationUrl();
  },
  methods: {
    //下载excel 模版
    downloadExcelTem() {
      let a = document.createElement("a");
      a.href = stationUrl;
      a.click();
    },
    // 上传图片下拉框点击事件,不同的选择跳不同的页面
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

    setData() {
      this.regTreeData = this.$parent.$parent.regTreeData;
      this.status = this.$parent.$parent.status;
      this.type = this.$parent.$parent.type;
      this.energyType = this.$parent.$parent.energyType;
      this.constructionType = this.$parent.$parent.constructionType;
      this.orgTreeData = this.$parent.$parent.orgTreeData;
    },
    getValue(value) {
      this.form.orgId = value;
    },

    //省市区三联框点击后触发
    handleChange(value) {
      this.form.regId = value[value.length - 1]; //取地区里最后一个值发给后端
    },
    // 远程搜索台区列表
    querySearchAsyncArea(queStr, cb) {
      if (queStr !== "") {
        this.params.areaName = queStr;
        getQueryByPageStage(this.params).then((res) => {
          for (let i of res.data.records) {
            i.value = i.areaName;
          }
          let results = res.data.records;
          cb(results);
        });
      }
    },
    handleSelectArea(item) {
      this.form.areaId = item.id;
    },
    // 园区
    querySearchAsyncZone(queStr, cb) {
      if (queStr !== "") {
        this.params.zoneName = queStr;
        // 获取园区信息
        getQueryByPageGarden(this.params).then((res) => {
          for (let i of res.data.records) {
            i.value = i.zoneName;
          }
          let results = res.data.records;
          cb(results);
        });
      }
    },
    handleSelectZone(item) {
      this.form.zoneId = item.id;
    },
    // 显示新增dialog 显示不同图片
    addDialogFormVisible() {
      this.sign = true;
      this.imageUrl = imgUrl;
      this.DialogFormVisible = true;
      if (this.checkValue !== "") {
        this.checkValue = "";
      }
      this.imageUrl = imgUrl;
      this.$refs.treeSelect.valueTitle = "";
      this.$refs["form"].resetFields();
    },
    // 保存
    save() {
      if (this.checkValue === "") {
        this.$message.error("请选择图片上传方式!");
        return false;
      }
      this.form.picUrl = this.imageUrl;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.DialogFormVisible = false;
          addStation(this.form)
            .then((res) => {
              this.$message({
                message: "添加成功",
                type: "success",
              });
             this.$parent.$parent.$refs.crudForm.getDataInit();
              this.form = {};
            })
            .catch((err) => {
              this.$message.error("添加失败");
              this.$parent.$parent.$refs.crudForm.getDataInit();
            });
        } else {
          return false;
        }
      });
    },
    // 点击取消
    quxiao() {
      this.DialogFormVisible = false;
      this.$refs.treeSelect.valueTitle = "";
      this.form = {};
    },

    // 批量删除
    batchDelete() {
      let multipleSelection = this.$parent.$parent.$refs.crudForm
        .multipleSelection;
      if (multipleSelection.length === 0) {
        this.$message({
          message: "请选择要删除的数据！",
          type: "warning",
        });
      } else {
        this.$confirm("确定要删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let ids = [];
          for (let i in multipleSelection) {
            ids.push(multipleSelection[i].id);
          }

          batchDelete(ids).then((res) => {
            if (res.code === "000000" && res.data) {
              this.$message({
                showClose: true,
                message: "删除成功！",
                type: "success",
              });
              this.$parent.$parent.$refs.crudForm.getDataInit();
            }
          });
        });
      }
    },
    resetForm(form) {
      this.$refs[form].resetFields();
    },
    // 地址地图
    showAddGardenMap() {
      this.sign = true;
      this.$refs.addGardenMap.open({
        lng: 118.77807441,
        lat: 32.0572355,
      });
    },
    //地图选点确定处理
    handleMapConfirm(addres) {
      this.form.addr = addres.Pkeyword;
      this.form.lng = addres.lng;
      this.form.lat = addres.lat;
    },
  },
};
</script>
<style lang="scss" scoped>
.fenye {
  margin-left: 10%;
  display: flex;
}
//分页器
.pageStyle {
  width: 100%;
  background-color: #f7f7f7;
  bottom: 10px;
  margin-bottom: 2%;
}

.el-upload__tip {
  margin-left: 3px;
  display: inline-block;
  margin-top: 120px;
  white-space: nowrap;
}
//按钮
.aniu {
  color: white !important;
  background: #006080 !important;
  width: 120px;
}
.s {
  padding: 10px 17px 0;
}
.el-button {
  color: #006080;
}
// 二级
.qw {
  width: 1000px;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding-left: 25px;
}
.nn {
 display: flex;
 justify-content:center;
}

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
.ntd {
  color: white !important;
  background: #006080;
  width: 200px;
  margin-right: 30px;
  margin-left: 70px;
}
.ntx {
  color: #006080;
  width: 200px;
}
.kz {
  width: 280px;
  margin-right: 30px;
}
.dq {
  width: 90px;
}
.tup {
  width: 105px;
  height: 102px;
}
.ya {
  width: 674px;
  height: 70px;
  background: #006080;
  margin-left: 32px;
}
.xzcs2 {
  width: 600px;
}
.k {
  width: 450px;
}
// 图片
.tp {
  width: 800px;
}
.ws {
  width: 70px;
  height: 70px;
}
.tpsc {
  display: flex;
}
.ani {
  margin-top: 40px;
  margin-right: 10px;
  font-size: 12px;
}
.tpscwz {
  margin-top: 40px;
  color: red;
  font-size: 12px;
}
.selectClass {
  margin-left: 2%;
}
.tup1 {
  display: flex;
  flex-wrap: wrap;
}
.demo-image__preview {
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 5px 5px 5px;
  margin-left: 3%;
}
/deep/ .el-form-item__label {
  color: #606266;
}

/deep/ .kp .el-form-item__label:before {
  content: "*";
  color: red;
  height: 32px;
  margin-right: 3px;
  font-size: 15px;
}
/deep/ .el-select-tree .el-input.is-active .el-input__inner {
  border-color: #00607f !important;
}
.pic_tip {
  margin-left: 41%;
  color: red;
  font-size: 12px;
  margin-top: -20px;
}
</style>
