<template>
  <div>
    <div style="padding: 0 20px; margin-bottom: 60px;" id="table-wrap">
      <el-table
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" width="50" />

        <el-table-column type="selection" width="55" />

        <el-table-column label="型号" prop="modelName" />

        <el-table-column label="设备类型" prop="devMainTypeName" />

        <el-table-column label="设备分类" prop="devClassName" />

        <el-table-column label="生产厂家" prop="factName" />

        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="deployParams(scope.$index, scope.row)" class="buleBTN" size="mini">配置</el-button>
            <el-button @click="modifyWinOpen(scope.$index, scope.row)" class="buleBTN" size="mini">修改</el-button>
            <el-button @click="Delete(scope.$index, scope.row)" class="redBTN" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->
    <div class="page-wrap-fixed" id="page-wrap-fixed">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageData.size"
        :total="pageData.total"
        :current-page="pageData.current"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper, slot"
      >
        <span class="el-pagination__jump page-option-wrap">
          <a class="page-option-icon" href="javascript:;" @click="refresh" title="刷新">
            <img src="../../../../../static/img/7.png" />
          </a>
        </span>
      </el-pagination>
    </div>

    <!-- 二级 -->
    <div>
      <!-- 配置参数 -->
      <el-dialog
        title="参数配置"
        width="1050px"
        :visible.sync="deployParamsWin"
        :append-to-body="true"
        top="25vh"
        style="left: 160px"
        :close-on-click-modal="false"
      >

        <el-button size="mini" class="newButtonColor listBTN" @click="addParams">新增参数</el-button>
        <el-table
          :data="tableData2.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
          stripe
          style="width: 100%"
          max-height="620"
        >
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="参数标识" prop="paraCode" />
          <el-table-column label="参数名称" prop="paraName" />
          <el-table-column label="单位" prop="paraUnit" />
          <el-table-column label="备注" prop="descr" />
          <el-table-column label="操作">
            <template slot-scope="scope" style="width: 500px">
              <el-button @click="modifyDeploy(scope.$index, scope.row)" class="buleBTN" size="mini">修改</el-button>
              <el-button @click="deployDelete(scope.$index, scope.row)" class="redBTN" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 新增参数 -->
        <el-dialog
          title="新增参数"
          :visible.sync="addParamsWin"
          :append-to-body="true"
          width="800px"
          :close-on-click-modal="false"
          top="32vh"
          style="text-align: center"
        >
          <el-form
            ref="paramsForm"
            :model="paramsForm"
            :rules="deloyRules"
            label-width="80px"
            size="small"
            class="erji2"
          >
            <el-form-item label="参数类型" prop="dataType">
              <el-select v-model="paramsForm.dataType" style="width: 100%" clearable size="small">
                <el-option
                  v-for="item in valueDataType"
                  :label="item.name"
                  :value="item.value"
                  :key="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="参数名称" prop="paraName">
              <el-input v-model="paramsForm.paraName" class="xzcs" clearable />
            </el-form-item>
            <el-form-item label="参数编码" prop="paraCode">
              <el-input v-model="paramsForm.paraCode" class="xzcs" clearable />
            </el-form-item>
            <el-form-item label="参数值" prop="dataValue">
              <el-input v-model="paramsForm.dataValue" class="xzcs" clearable />
            </el-form-item>
            <el-form-item label="单位" prop="paraUnit">
              <el-input v-model="paramsForm.paraUnit" class="xzcs" clearable />
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="paramsForm.descr" class="xzcs2" clearable />
            </el-form-item>
          </el-form>

          <div class="btnClass">
            <el-button size="small" @click="confirmAdd('paramsForm')" class="bouncedHold  editorBTN btnSpace">确定</el-button>
            <el-button size="small" @click="cancleModifyWin" class="cancelBTN  editorBTN">取消</el-button>
          </div>
        </el-dialog>
        <!-- 修改配置 -->
        <el-dialog
          title="修改参数"
          :visible.sync="depoyModifyWin"
          append-to-body
          width="800px"
          :modal-append-to-body="false"
          :close-on-click-modal="false"
        >
          <el-form
            ref="modifyDeloyForm"
            :model="modifyDeloyForm"
            :rules="deloyRules"
            label-width="80px"
            size="small"
            class="erji2"
          >
            <el-form-item label="参数类型" prop="dataType">
              <el-select
                v-model="modifyDeloyForm.dataType"
                style="width: 100%"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in valueDataType"
                  :label="item.name"
                  :value="item.value"
                  :key="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="参数名称" prop="paraName">
              <el-input v-model="modifyDeloyForm.paraName" class="xzcs" clearable />
            </el-form-item>
            <el-form-item label="参数编码" prop="paraCode">
              <el-input v-model="modifyDeloyForm.paraCode" class="xzcs" clearable />
            </el-form-item>
            <el-form-item label="参数值" prop="dataValue">
              <el-input v-model="modifyDeloyForm.dataValue" class="xzcs" clearable />
            </el-form-item>
            <el-form-item label="单位" prop="paraUnit">
              <el-input v-model="modifyDeloyForm.paraUnit" class="xzcs" clearable />
            </el-form-item>

            <el-form-item label="备注">
              <el-input type="textarea" v-model="modifyDeloyForm.descr" class="xzcs2" clearable />
            </el-form-item>
          </el-form>

          <div class="nn">
            <el-button size="small" @click="modifyConfirm('modifyDeloyForm')" class="bouncedHold  editorBTN btnSpace">确定</el-button>
            <el-button size="small" @click="cancleModifyWin" class="cancelBTN  editorBTN">取消</el-button>
          </div>
        </el-dialog>
      </el-dialog>
    </div>

    <div>
      <div>
        <!-- 修改设备 -->
        <el-dialog
          title="修改设备型号"
          :visible.sync="modifyWin"
          width="800px"
          class="yw"
          top="25vh"
          style="left: 70px"
          :modal-append-to-body="false"
        >
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
            size="small"
            class="qw"
            :rules="rules"
          >
            <el-form-item label="设备分类" prop="devClass">
              <el-select v-model="form.devClass" class="kz" @change="onChange" clearable>
                <el-option
                  v-for="item in kindDict"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备类型" prop="devMainType">
              <el-select v-model="form.devMainType" class="kz" @change="onChange1" clearable>
                <el-option
                  v-for="item in kindDictValue"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产厂家" prop="factId">
              <el-select
                v-model="form.factId"
                class="kz"
                @change="onChange2"
                clearable
                prop="factId"
              >
                <el-option
                  v-for="item in factoryValues"
                  :key="item.id"
                  :label="item.factName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="型号名称" prop="modelName" pro>
              <el-input v-model="form.modelName" class="kz" clearable></el-input>
            </el-form-item>
            <el-form-item label="图片上传方式" class="selectClass" label-width="100px">
              <el-select
                size="mini"
                class="kz"
                @change="chooseImage"
                clearable
                v-model="checkValue"
              >
                <el-option label="图片本地上传" :value="1"></el-option>
                <el-option label="图片库选择" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="imageViewClass">
              <el-image
                class="kz"
                :src="imageUrl"
                style="width: 220px; height: 188px;  border-radius:5px 5px 5px; "
              ></el-image>
            </el-form-item>
          </el-form>
          <div class="nn">
            <el-button size="small" @click="addBiaoge('form')" class="bouncedHold  editorBTN btnSpace">确定</el-button>
            <el-button size="small" @click="qux('form')" class="cancelBTN  editorBTN">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
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
        <el-form>
          <el-form-item label="图片上传" class>
            <el-upload
              class="upload-demo"
              :data="fileData"
              ref="upload"
              :action="uploadUrl"
              :before-upload="beforeUpload"
              list-type="picture-card"
              :show-file-list="true"
              :multiple="false"
              :file-list="fileList"
              :on-success="handleImageSuccess"
              :headers="headers"
              :auto-upload="true"
              :limit="1"
              accept=".png, .jpg, .gif, .svg"
              :on-progress="uploadVideoProcess"
            >
              <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过2MB</div>
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="图片选取列表"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        top="33vh"
        style="left: 250px"
        :visible.sync="imageListWin"
        width="880px"
      >
        <el-form :inline="true" :model="picForm" class="demo-form-inline">
          <div>
            <el-form-item label="图片类别" class="a">
              <el-select
                size="mini"
                v-model="picForm.fileType"
                placeholder="全部"
                class="tpk"
                height="29px"
                clearable
              >
                <el-option
                  v-for="item in picTypes"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片名称" class="a">
              <el-input
                v-model="picForm.name"
                class="tpk"
                size="mini"
                placeholder="请输入图片名称"
                clearable
              />
            </el-form-item>
            <el-button size="small" class="bouncedHold" @click="queryFormData">查询</el-button>
            <el-button size="small" class="cancelBTN" @click="clearForm">清空</el-button>
          </div>
          <div class="tup">
            <div
              class="picBlock"
              style="position: relative; left: 10px; width: 200px"
              v-for="item in picFiles"
              :key="item"
            >
              <div class="demo-image__preview">
                <el-checkbox-group v-model="checkModel">
                  <el-checkbox-button :key="item.id" :label="item">
                    <el-image
                      style="width: 95px; height: 80px;  border-radius:5px 5px 5px; "
                      :src="item.url"
                      :aria-checked="true"
                    >
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" />
                      </div>
                    </el-image>
                  </el-checkbox-button>
                </el-checkbox-group>
              </div>
            </div>
            <div class="picPageStyle" style="z-index=999">
              <div class="picFenye">
                <el-pagination
                  @size-change="picHandleSizeChange"
                  @current-change="picHandleCurrentChange"
                  :current-page="picCurrentPage"
                  :page-sizes="[10, 15, 20]"
                  :page-size="picPageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="picTotal"
                  class="tablePagination"
                />
                <div class="sx">
                  <el-button size="mini" @click="freshen">刷新</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="picNn">
            <el-button size="small" @click="confirmCheckValue" class="bouncedHold  editorBTN btnSpace">确定</el-button>
            <el-button size="small" @click="cancleWin" class="cancelBTN  editorBTN">取消</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.imageViewClass {
  margin-top: 5%;
  margin-left: -37%;
}

.a {
  padding-left: 10px;
}

.tpk {
  width: 200px;
}

.xan {
  color: white !important;
  background: #006080 !important;
  height: 30px;
  margin-top: 5px;
}

.zxan {
  color: #006080 !important;
  height: 30px;
  margin-top: 5px;
}

.tup {
  display: flex;
  flex-wrap: wrap;
}

.picBlock {
  width: 188px;
  display: flex;
  flex-wrap: wrap;
  /*margin: 20px 20px 20px 20px;*/
}

.demo-image__preview {
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 5px 5px 5px;
  /*<!--margin-left: -114%;-->*/
}

.nn {
  margin-left: 10%;
}

.picNn {
  margin-left: 30%;
}

//分页器
.picPageStyle {
  width: 100%;
  background-color: #f7f7f7;
  bottom: 10px;
  margin-bottom: 2%;
}

.picFenye {
  margin-left: 10%;
  display: flex;
}

.selectClass {
  margin-left: -2%;
}

.el-upload__tip {
  color: red;
  margin-left: 8%;
}

.srk {
  width: 200px;
}

.aa.cell {
  font-weight: bold;
}

.aniu {
  color: white !important;
  background: #006080 !important;
  width: 120px;
}

.aniu2 {
  color: white !important;
  background: #006080 !important;
  width: 120px;
}

.anniu {
  color: #006080 !important;
  width: 120px;
}

.s {
  padding: 20px 0;
}

.el-button {
  color: #12bdd9;
}

// 二级
.qw {
  width: 780px !important;
  height: 100% !important;
  display: flex !important;
  flex-wrap: wrap !important;
  padding-left: 25px!important;
  box-sizing: border-box;
}

.kz {
  width: 220px;
  margin-right: 70px;
}

.nn {
  margin-left: 28%;
}

.ntd {
  color: white !important;
  background: #006080 !important;
  width: 120px;
}

.ntx {
  width: 120px;
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

//分页器
.block {
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

.sx {
  margin-top: 2px;
  margin-left: 10px;
}

.fenye {
  margin-left: 40%;
  display: flex;
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

.page-option-wrap {
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  background-color: #fff;
}

.split-line {
  display: inline-block;
  width: 1px;
  background-color: #e8e8e8;
  height: 16px;
  vertical-align: middle;
}

.page-option-icon {
  display: inline-block;
  padding: 0 10px;
}

img {
  display: inline-block;
  vertical-align: middle;
}
</style>
<script>
import {
  cx,
  menuDelete,
  xiuGai,
  pzcx,
  pzadd,
  pzmenuDelete,
  pzxiuGai,
} from "../../../../api/system/type";
import { DICTDATA, getDict } from "../../../../api/dict";
import { getFactorys } from "../../../../api/system/type";
import request from "../../../../api/request";
import Vue from "vue";
import { queryData } from "../../../../api/system/picture";
import selectVue from "../../../../components/selectVue";

const tonken = Vue.cookie.get("token");
export default {
  data() {
    return {
      // 设备型号
      form: {
        id: "",
        devClass: "",
        devMainType: "",
        factId: "",
        modelName: "",
        picUrl: "",
      },
      // 修改设备型号参数校验
      rules: {
        modelName: [
          { required: true, message: "请输入型号名称", trigger: "blur" },
        ],
        devClass: [
          { required: true, message: "请选择设备分类", trigger: "blur" },
        ],
        devMainType: [
          { required: true, message: "请选择设备类型", trigger: "blur" },
        ],
        factId: [
          { required: true, message: "请选择厂家信息", trigger: "blur" },
        ],
        picUrl: [
          { required: true, message: "请选择图片上传方式", trigger: "blur" },
        ],
      },

      checkValue: "",
      checkModel: [],
      kindDict: [],
      kindDictValue: [],
      factoryValues: [],
      fileList: [],
      picTypes: [],
      picFiles: [],
      formF: {
        factType: "",
      },
      fileData: {
        fileType: 1,
        filename: "",
        type: 1,
      },
      sscont: {}, //获取搜索值
      modifyWin: false,
      uploadWin: false,
      imageListWin: false,
      updateLoading: false,
      headers: { Authorization: "Bearer " + tonken },
      uploadUrl: "",
      imageUrl: "",
      scqd: false,
      tableData: [],
      tableData2: [],

      // 图片
      picForm: {
        fileType: "",
        name: "",
        size: "",
        current: "",
        fileId: "",
      },
      // 新增配置
      paramsForm: {
        descr: "",
        paraName: "",
        paraUnit: "",
        modelId: "",
        paraCode: "",
        dataType: "",
        dataValue: "",
      },
      // 新增参数配置参数校验
      deloyRules: {
        paraName: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
        paraCode: [
          { required: true, message: "请输入参数标识", trigger: "blur" },
        ],
        dataType: [
          { required: true, message: "请选择参数类型", trigger: "blur" },
        ],
        dataValue: [
          { required: true, message: "请输入参数值", trigger: "blur" },
        ],
      },
      modelId: "",
      // 修改配置
      modifyDeloyForm: {
        id: "",
        paraCode: "",
        descr: "",
        paraName: "",
        paraUnit: "",
        dataValue: "",
        dataType: "",
      },
      search: "",
      deployParamsWin: false,
      addParamsWin: false,
      depoyModifyWin: false,
      pzid: "",
      pzcxid: 0,
      //分页相关属性
      pageData: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      SelectionArray: [], //批量删除
      picCurrentPage: 1,
      picPageSize: 20,
      picTotal: 40,
      valueDataType: [],
    };
  },
  components: { selectVue },
  mounted() {
    this.cx(); //页面加载时请求列表数据渲染接口
    this.queryData();
    let elementResizeDetectorMaker = require("element-resize-detector");
    let tableWidth = document.getElementById("table-wrap");
    let pageWidth = document.getElementById("page-wrap-fixed");
    let erd = elementResizeDetectorMaker();
    erd.listenTo(tableWidth, function (element) {
      pageWidth.style.width = element.offsetWidth + "px";
    });
  },
  created() {
    this.uploadUrl = request.uploadUrl();
    // 获取分类下拉框
    getDict(DICTDATA.DEV_KIND).then((res) => {
      this.kindDict = res;
    });
    this.getPicTypes();
    this.onChange1();
    //获取字段类型
    getDict(DICTDATA.VALUE_DATA_TYPE).then((res) => {
      this.valueDataType = res;
    });
  },
  methods: {
    onChange() {
      if (this.form.devClass !== "") {
        getDict(this.form.devClass).then((res) => {
          this.kindDictValue = res;
        });
      }
    },
    // 设备类型选中事件
    onChange1() {
      this.$forceUpdate();
      if (this.form.devMainType !== "") {
        getFactorys(this.formF).then((res) => {
          this.factoryValues = res.data;
        });
      }
    },
    // 厂家下拉框的选中事件
    onChange2() {
      this.$forceUpdate();
      if (this.form.factId != "") {
      } else {
        this.form.devClass = "";
        this.form.devMainType = "";
        this.form.factId = "";
        this.kindDictValue.length = 0;
      }
    },
    //查询接口,不传参默认渲染所有数据到表格里
    cx(data) {
      cx(data)
        .then((res) => {
          this.tableData = res.data.records;
          this.pageData = {
            total: res.data.total,
            current: res.data.current,
            pageSize: res.data.size,
          };
        })
        .catch((err) => {
          this.$message.error("查询失败");
        });
    },
    // 删除
    Delete(index, row) {
      const id = row.id;
      this.$confirm("此操作将永久删除该项数据, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          menuDelete(id)
            .then((res) => {
              this.$message({
                message: res.mesg,
                type: "success",
              });
              this.queryList();
            })
            .catch((err) => {
              this.$message({
                message: "失败",
                type: "error",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 修改
    modifyWinOpen(index, row) {
      //获取当前选择的列表数据
      this.modifyWin = true;
      this.form = {
        id: row.id,
        modelName: row.modelName,
        devMainType: row.devMainType,
        factId: row.factId,
        devClass: row.devClass,
        picUrl: row.picUrl,
      };
      if (this.form.picUrl != null && this.form.picUrl != "") {
        this.imageUrl = this.form.picUrl;
      } else {
        this.imageUrl = "";
      }
      // 获取设备类型对应的数据
      getDict(this.form.devClass).then((res) => {
        this.kindDictValue = res;
      });
      // 获取对应厂家数据
      this.formF.factType = this.form.devMainType;
      getFactorys(this.formF).then((res) => {
        this.factoryValues = res.data;
      });
    },
    // 下拉框点击事件,不同的选择跳不同的页面
    chooseImage() {
      if (this.checkValue === 1) {
        this.uploadWin = true;
      } else {
        this.uploadWin = false;
      }
      if (this.checkValue === 2) {
        this.imageListWin = true;
      } else {
        this.imageListWin = false;
      }
    },
    /* ==  图片上传功能代码  start==  */
    // 上传加载动画
    uploadVideoProcess(event, file, fileList) {
      this.updateLoading = true;
    },
    // 图片上传之前图片格式校验
    beforeUpload(file) {
      let picStyle = /^image\/(jpeg|png|jpg)$/.test(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!picStyle) {
        this.$message.error("上传头像图片只能是 JPG/PNG/GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      this.fileData.filename = file.name;
      return picStyle && isLt2M;
    },
    // 上传成功操作赋值操作
    handleImageSuccess(res, file, fileList) {
      if ("000000" === res.code) {
        this.form.picUrl = res.data[0].url;
        this.imageUrl = res.data[0].url;
        this.$emit("on-success", res.data[0].url);
      } else {
        this.$message.error(res.mesg);
      }
      this.uploadWin = false;
    },
    /* ==  图片上传功能代码 end==  */

    /* ==  图片列表弹框功能代码  start==  */
    // 获取图片列表
    queryData(data) {
      queryData(data)
        .then((res) => {
          this.picFiles = res.data.records;
          this.picPageSize = res.data.size;
          this.picCurrentPage = res.data.current;
          this.picTotal = res.data.total;
        })
        .catch((err) => {
          this.$message.error("查询失败");
        });
    },
    // 获取图片类型
    getPicTypes() {
      getDict(DICTDATA.PICTURE_TYPE).then((res) => {
        for (let i = 0; i < res.length; i++) {
          this.picTypes.push(res[i]);
        }
      });
    },
    // 查询按钮调取方法
    queryFormData() {
      this.queryData(this.picForm);
    },
    // 清空查询
    clearForm() {
      this.form = {};
      this.queryData();
    },
    // 分页点击事件
    picHandleSizeChange(val) {
      this.pageSize = val;
      this.picForm.size = this.pageSize;
      this.picForm.current = 1;
      this.queryData(this.picForm); //点击选择每页显示多少数据就会发送size，让页面显示多少条，并且默认第一个页面
    },
    picHandleCurrentChange(val) {
      this.picForm.size = this.pageSize;
      this.picForm.current = val;
      this.queryData(this.picForm); //点击第几页就会发送要显示的页数过去
    },

    confirmCheckValue() {
      if (this.checkModel.length > 1) {
        this.$message.error("每次只能选择一条图片数据!");
        return false;
      }
      this.imageUrl = this.checkModel[0].url;
      this.form.picUrl = this.checkModel[0].url;
      this.checkModel = [];
      this.imageListWin = false;
    },
    cancleWin() {
      this.imageListWin = false;
      this.checkModel = [];
    },
    freshen() {
      this.queryData();
    },
    /* ==  图片列表弹框功能代码  end==  */

    addBiaoge(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 发送当前列表修改后的数据
          this.modifyWin = false;
          xiuGai({
            id: this.form.id,
            modelName: this.form.modelName,
            devMainType: this.form.devMainType,
            factId: this.form.factId,
            devClass: this.form.devClass,
            picUrl: this.form.picUrl,
          })
            .then((res) => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.cx();
              this.checkValue = "";
            })
            .catch((err) => {
              this.$message.error("修改失败");
            });
        } else {
          return false;
        }
      });
    },
    qux(formName) {
      this.$refs[formName].resetFields();
      this.form = {};
      this.modifyWin = false;
      this.checkValue = "";
    },

    /**
     * 配置模块功能代码
     */
    // 配置查询
    deployParams(index, row) {
      this.deployParamsWin = true;
      // 把设备型号的数据的id赋值给新增参数配置
      this.modelId = row.id;
      pzcx(row.id)
        .then((res) => {
          this.tableData2 = res.data;
        })
        .catch((err) => {
        });
    },
    //添加改变后新的查询
    xpzcx(xid) {
      pzcx(xid)
        .then((res) => {
          this.tableData2 = res.data;
        })
        .catch((err) => {
        });
    },
    //新增配置
    confirmAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          pzadd({
            modelId: this.modelId,
            paraCode: this.paramsForm.paraCode,
            paraName: this.paramsForm.paraName,
            paraUnit: this.paramsForm.paraUnit,
            dataType: this.paramsForm.dataType,
            dataValue: this.paramsForm.dataValue,
            descr: this.paramsForm.descr,
          })
            .then((res) => {
              this.$message({
                message: res.mesg,
                type: "success",
              });
              const xid = this.modelId;
              this.xpzcx(xid);
              this.paramsForm = {};
              this.addParamsWin = false;
            })
            .catch((err) => {
            });
        }
      });
    },
    addParams() {
      this.addParamsWin = true;
      this.paramsForm = {};
    },
    //删除配置
    deployDelete(index, row) {
      const id = row.id;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          pzmenuDelete(id)
            .then((res) => {
              this.$message({
                message: res.mesg,
                type: "success",
              });
              const xid = this.modelId;
              this.xpzcx(xid);
            })
            .catch((res) => {
              this.$message.error(res.mesg);
            });
        })
        .catch((res) => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //修改配置弹框
    modifyDeploy(index, row) {
      this.depoyModifyWin = true;
      this.modifyDeloyForm = {
        id: row.id,
        paraCode: row.paraCode,
        paraName: row.paraName,
        paraUnit: row.paraUnit,
        dataType: row.dataType,
        dataValue: row.dataValue,
        descr: row.descr,
      };
    },
    // 配置修改确认按钮
    modifyConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          pzxiuGai({
            id: this.modifyDeloyForm.id,
            paraCode: this.modifyDeloyForm.paraCode,
            paraName: this.modifyDeloyForm.paraName,
            paraUnit: this.modifyDeloyForm.paraUnit,
            descr: this.modifyDeloyForm.descr,
          })
            .then((res) => {
              this.$message({
                message: res.mesg,
                type: "success",
              });
              this.depoyModifyWin = false;
              this.xpzcx(this.paramsForm.modelId);
            })
            .catch((err) => {
              this.$message.error("修改失败");
            });
        }
      });
    },
    cancleModifyWin() {
      this.modifyDeloyForm = {};
      this.depoyModifyWin = false;
      this.paramsForm = {};
      this.addParamsWin = false;
    },
    //表格选选择框事件
    handleSelectionChange(val) {
      this.SelectionArray = val;
    },
    // 分页点击事件
    handleSizeChange(val) {
      let formInline = this.$parent.$refs.topform.form;
      this.pageData.pageSize = val;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      this.cx(formInline); //点击选择每页显示多少数据就会发送size，让页面显示多少条，并且默认第一个页面
    },
    handleCurrentChange(val) {
      let formInline = this.$parent.$refs.topform.form;
      this.pageData.current = val;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      this.cx(formInline); //点击第几页就会发送要显示的页数过去
    },
    refresh() {
      let formInline = this.$parent.$refs.topform.form;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      this.cx(formInline);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ #app {
  font-family: "Microsoft YaHei";
}


/deep/ .el-table thead {
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

.el-dialog__title {
  font-size: 30px !important;
}
/deep/.el-dialog__header {
  padding: 40px 0 10px 50px !important
}
/deep/.el-dialog__body {
  padding: 30px 50px!important;
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
