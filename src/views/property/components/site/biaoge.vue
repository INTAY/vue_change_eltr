<template>
  <div>
    <div>
      <div>
        <el-dialog
          title="站点详情"
          :visible.sync="xiangqing"
          class="xqyy"
          width="1050px"
          append-to-body
          :modal-append-to-body="false"
        >
          <!--  查看大图 -->
          <el-dialog
            :visible.sync="picDialogVisible"
            width="50%"
            append-to-body
            :modal-append-to-body="false"
          >
            <img :src="form.picUrl" style="width:100%;height;100%" alt />
          </el-dialog>

          <div class="xqye">
            <div class="tu">
              <img @click="picDialogVisible =true" style="cursor: pointer;" :src="form.picUrl" alt />
            </div>
            <el-form :inline="true" :model="form" class="demo-form-inline xqy">
              <el-row type="flex" justify="start" align="middle" class="rowbg2">
                <el-col :span="12">
                  <el-form-item label="站点名称">{{form.staName}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="站点编号">{{form.id}}</el-form-item>
                </el-col>
              </el-row>

              <el-row type="flex" justify="start" align="middle" class="rowbg">
                <el-col :span="12">
                  <el-form-item label="组织机构">{{form.orgName}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="状态">{{form.state}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg2">
                <el-col :span="12">
                  <el-form-item label="站点类型">{{form.staType }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="能源类型">{{form.engType}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg">
                <el-col :span="12">
                  <el-form-item label="建设场所">{{form.buildType}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="行政区域">{{form.regName}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg2">
                <el-col :span="12">
                  <el-form-item label="所属台区">{{form.areaName}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="所属园区">{{form.zoneName}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg">
                <el-col :span="12">
                  <el-form-item label="占地面积">{{form.floorArea}}</el-form-item>
                  <el-form-item label="㎡"></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="地址">{{form.addr}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg2">
                <el-col :span="12">
                  <el-form-item label="经度">{{form.lng}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="纬度">{{form.lat}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg">
                <el-col :span="12">
                  <el-form-item label="配变容量">{{form.transCap}}</el-form-item>
                  <el-form-item label="kW"></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="营业时间">{{form.busHours}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg2">
                <el-col :span="12">
                  <el-form-item label="联系人">{{form.link}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话">{{form.tel}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg">
                <el-col :span="12">
                  <el-form-item label="服务电话">{{form.svrTel}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="投运时间">{{formatDate(form.optTime)}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg2">
                <el-col :span="12">
                  <el-form-item label="停车信息描述">{{form.parkInfo}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="停车费用描述">{{form.parkFee}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg">
                <el-col :span="12">
                  <el-form-item label="充电费用描述">{{form.eleFee}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="服务费用描述">{{form.svrFee}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg2">
                <el-col :span="12">
                  <el-form-item label="支付方式描述">{{form.payment}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg">
                <el-col>
                  <el-form-item label="描述">{{form.descr}}</el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-dialog>
      </div>
      <div>
        <!-- 修改站点 -->
        <el-dialog
          title="修改站点"
          :visible.sync="dialogFormVisible"
          width="950px"
          :modal-append-to-body="false"
          :close-on-click-modal="false"
        >
          <el-form
            ref="form"
            :rules="rules"
            :model="form"
            label-width="110px"
            size="small"
            class="qw"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="站点名称" prop="staName">
                  <el-input size="mini" v-model="form.staName" placeholder="请输入站点名称" class="kz"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属机构" prop="orgId">
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
                    <el-option
                      v-for="item in state"
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
                    <el-option
                      v-for="item in staType"
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
                    <el-option
                      v-for="item in engType"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="建设场所类型" prop="buildType">
                  <el-select
                    size="mini"
                    v-model="form.buildType"
                    placeholder="请选择建设场所类型"
                    class="kz"
                  >
                    <el-option
                      v-for="item in buildType"
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
                    size="small"
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
                <el-form-item label="站地面积(平方)">
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
                  <el-input
                    type="textarea"
                    v-model="form.descr"
                    style="width: 705px;margin-top:10px;"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="nn">
            <el-button size="small" @click="save" class="bouncedHold  editorBTN btnSpace">保存</el-button>
            <el-button size="small" @click="quxg" class="cancelBTN  editorBTN">取消</el-button>
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
        <addGardenMap v-if="sign" @map-confirm="handleMapConfirm" ref="addGardenMap" />
      </div>
      <!-- 图片本地上传end -->
    </div>
  </div>
</template>
<style lang="scss" scoped>
.srk {
  width: 200px;
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
  color: #12bdd9;
}
// 二级
// 详情
.xqye {
  display: flex;
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
  width: 550px;
  background: #f5f5f5;
}
.kz {
  width: 200px;
  margin-right: 120px;
}
.h {
  height: 40px;
}
.xqy {
  margin: 0px 0px 30px 0px;
}
//修改
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
/* 是否删除 */
.sfsc {
  margin-left: 180px;
  font-size: 21px;
}
//删除按钮
.ntd1 {
  color: white !important;
  background: #006080 !important;
  width: 200px;
}
.ntx2 {
  color: #006080 !important;
  width: 200px;
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
</style>
<script>
import {
  modification,
  getOrgTree
} from "@/api/property/site";
import singleimageupload from "@/components/upload/singleimageupload";
import { getObjectPicPath } from "@/api/system/picture";
import picTable from "@/components/pagetable/picTable";
import addGardenMap from "@/views/property/components/map/addGardenMap";
import { picUrl } from "@/components/upload/picUpload";
import imgUrl from "../../../../assets/image/from图片.png";
import treeSelect from "@/components/treeSelect/treeSelect";
import {
  getQueryByPageStage,
  getQueryByPageGarden,
} from "@/api/property/transformer";
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
      imageUrl: imgUrl,
      checkModel: [],
      fileList: [],
      picDialogVisible: false, //详情大图
      state: [], // 基础设施状态
      staType: [], // 站类型
      buildType: [], //建设场所类型224
      engType: [], // 能源类型
      orgTreeData: [],
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      orgDefaultProps: {
        value: "id",
        label: "name",
        children: "children",
      },

      multipleSelection: [], // 要删除的选项
      dialogFormVisible: false,
      scqd: false,
      // 列表數據
      form: {},
      xiangqing: false,
      tableData: [],
      search: "",
      deId: "",
      //分页相关
      currentPage: 1,
      pageData: {
        total: 0,
        current: 1,
        size: 10,
      },
      // 显示图片预览对话框
      regTreeData: [],
      defaultProps: {
        checkStrictly: true,
        children: "children",
        value: "id",
        label: "name",
      },
      rules: {
        staName: [
          { required: true, message: "站点名称不能为空", trigger: "blur" },
        ],
        orgId: [{ required: true, message: "请选择组织机构", trigger: "blur" }],

        regId: [
          { required: true, message: "请选择行政区域", trigger: "change" },
        ],
        state: [{ required: true, message: "请选择状态", trigger: "change" }],
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
      params: {},
    };
  },
  components: { singleimageupload, picTable, addGardenMap, treeSelect },
  methods: {
    setData() {
      this.buildType = this.$parent.constructionType;
      this.state = this.$parent.status;
      this.staType = this.$parent.type;
      this.engType = this.$parent.energyType;
      this.regTreeData = this.$parent.regTreeData;
      this.orgTreeData = this.$parent.orgTreeData;
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
    getValue(value) {
      this.form.orgId = value;
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
    //省市区三联框点击后触发
    handleChange(value) {
      this.form.regId = value[value.length - 1]; //取地区里最后一个值发给后端
    },
    // 发送修改后的数据
    save() {
      this.form.picUrl = this.imageUrl;
      // 发送当前列表修改后的数据
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          modification(this.form)
            .then((res) => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
             this.$parent.$refs.crudForm.getDataInit();
            })
            .catch((err) => {
              this.$message.error("修改失败");
            });
        } else {
          return false;
        }
      });
    },
    // 取消修改
    quxg() {
      this.dialogFormVisible = false;
      this.$refs.treeSelect.valueTitle = "";
      this.$refs["form"].resetFields();
      this.form = {};
    },

    // 格式化日期

    formatDate(data) {
      if (data == null) {
        return "";
      }
      let dt = new Date(data);
      return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    },
    // 地址地图
    showAddGardenMap() {
      this.sign = true;
      this.$refs.addGardenMap.lng = this.form.lng;
      this.$refs.addGardenMap.lat = this.form.lat;
      this.$refs.addGardenMap.Pkeyword = this.form.addr;
      this.Pkeyword = this.form.addr;
      this.$refs.addGardenMap.open({
        lng: this.form.lng,
        lat: this.form.lat,
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
#table-wrap {
  padding-right: 20px;
  .el-table {
    padding-left: 20px;
  }
}
.el-upload__tip {
  margin-left: 3px;
  display: inline-block;
  color: red;
  white-space: nowrap;
}
/deep/ .el-select-tree .el-input.is-active .el-input__inner {
  border-color: #00607f !important;
}
/deep/ .demo-form-inline .el-form-item__label /deep/ #app {
  font-family: "Microsoft YaHei";
}

/deep/.el-table thead {
  color: black !important;
}
/deep/ .has-gutter {
  background: #f0f0f0 !important;
}

/deep/ .el-table th {
  background-color: transparent;
}
/deep/ .el-table tr {
  background-color: transparent;
}
.fy {
  position: fixed;
  bottom: 0px;
  background: #f7f7f7;
  z-index: 999;
  text-align: center;
  left: 220px;
  right: 0;
  padding: 10px 0;
  line-height: 25px;
}
.di {
  position: fixed;
  bottom: 0px;
  background: #f7f7f7;
  z-index: 999;
  text-align: center;
  left: 220px;
  right: 0;
  padding: 10px 0;
  line-height: 25px;
}
.rowbg {
  padding: 10px;
  height: 40px;
}
.rowbg2 {
  @extend .rowbg;
  background-color: #f7f7f7;
}
.tu {
  width: 200px;
  height: 200px;
  img {
    height: 100%;
    width: 100%;
  }
}
.demo-form-inline {
  padding-left: 15px;
  width: 750px;
}
/deep/ .el-form-item__label {
  color: #606266;
}
/deep/ .demo-form-inline .el-form-item__label {
  margin-left: 15px;
  color: #909090;
}

/deep/ .xqy .el-col-12 {
  padding-top: 24px;
}
/deep/ .el-table__body-wrapper {
  margin-bottom: 40px !important;
}
/deep/ .kp .el-form-item__label:before {
  content: "*";
  color: red;
  height: 32px;
  margin-right: 3px;
  font-size: 15px;
}
.pic_tip {
  margin-left: 41%;
  color: red;
  font-size: 12px;
  margin-top: -20px;
}
/* 滚动条样式 */
*::-webkit-scrollbar {
    width: 7px;
    height: 9px;
    background-color: transparent;
} /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
*::-webkit-scrollbar-track {
    background-color: #f0f6ff;
} /*定义滚动条轨道 内阴影+圆角*/
*::-webkit-scrollbar-thumb {
    background-color: #dbdbdb;
    border-radius: 6px;
} /*定义滑块 内阴影+圆角*/
*::-webkit-scrollbar-thumb:hover {
    background-color: #c2c2c2;
    border-radius: 6px;
} /*定义滑块 内阴影+圆角*/
.scrollbarHide::-webkit-scrollbar {
    display: none;
}
.scrollbarShow::-webkit-scrollbar {
    display: block;
}
</style>

