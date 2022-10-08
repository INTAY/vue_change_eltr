<template>
  <div>
    <div style="padding: 0 20px; margin-bottom: 50px;" id="table-wrap">
      <!-- 表格本体 -->
      <el-table
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        stripe
        @selection-change="handleSelectionChange"
        max-height="600"
      >
        <el-table-column type="index" width="50" />

        <el-table-column type="selection" width="55" />

        <el-table-column label="厂家名称" prop="factName" show-tooltip-when-overflow />

        <el-table-column label="分类" prop="kindName" />

        <el-table-column label="类型" prop="factTypeName" />

        <el-table-column
          label="所属区域"
          prop="regId"
          :formatter="regFormat"
          show-tooltip-when-overflow
        />

        <el-table-column label="详细地址" prop="addr" show-tooltip-when-overflow />

        <el-table-column label="联系人" prop="atten" />

        <el-table-column label="联系电话" prop="tel" />

        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="openDetailWin(scope.$index, scope.row)" class="buleBTN" size="mini">详情</el-button>
            <el-button @click="openModifyWin(scope.$index, scope.row)" class="buleBTN" size="mini">修改</el-button>
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
      <!-- 详情 -->
      <el-dialog
        title="厂家详情"
        :visible.sync="detailWin"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        class="yw"
        width="880px"
      >
        <el-form :inline="true" :model="detailForm" label-width="100px" class="demo-form-inline">
          <div class="form-item">
            <div class="form-item-content">
              <el-form-item label="厂家名称:">
                <span>{{detailForm.factName}}</span>
              </el-form-item>
              <el-form-item label="分类:">
                <span>{{detailForm.kindName}}</span>
              </el-form-item>
              <el-form-item label="类型:">
                <span>{{detailForm.factTypeName}}</span>
              </el-form-item>
              <el-form-item label="所属区域:">
                <span>{{regName}}</span>
              </el-form-item>
              <el-form-item label="详细地址:">
                <span>{{detailForm.addr}}</span>
              </el-form-item>
              <el-form-item label="联系人:">
                <span>{{detailForm.atten}}</span>
              </el-form-item>
              <el-form-item label="联系电话:" prop="freq">
                <span>{{detailForm.tel}}</span>
              </el-form-item>
              <el-form-item label="备注:" prop="startDate">
                <span>{{detailForm.remark}}</span>
              </el-form-item>
              <el-form-item label="厂家图片:">
                <el-image
                  v-if="imageUrl"
                  :src="imageUrl"
                  style="width: 95px; height: 80px;  border-radius:5px 5px 5px;"
                />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-dialog>
    </div>

    <div>
      <!-- 修改 -->
      <el-dialog
        title="修改厂家"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :visible.sync="modifyWin"
        width="800px"
        class="yw"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small" class="qw">
          <el-form-item label="厂家名称" prop="factName">
            <el-input v-model="form.factName" class="kz" clearable />
          </el-form-item>
          <el-form-item label="分类" prop="factType">
            <el-select
              v-model="form.kind"
              placeholder="请选择分类"
              class="kz"
              clearable
              @change="getDevTypeDict"
            >
              <el-option
                v-for="item in kindDict"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="factType">
            <el-select v-model="form.factType" placeholder="请选择类型" class="kz" clearable>
              <el-option
                v-for="item in typeDict"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属区域" class="ww" prop="regId">
            <el-cascader
              v-model="form.regId"
              class="kz"
              :options="areas"
              :props="props"
              size="mini"
              clearable
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="addr">
            <el-input v-model="form.addr" class="kz" placeholder="请输入详细地址">
              <el-button
                slot="append"
                style="width: 20%"
                @click="openMapsWin"
                icon="el-icon-map-location"
              />
            </el-input>
          </el-form-item>

          <el-form-item label="联系人" prop="atten">
            <el-input v-model="form.atten" class="kz" clearable />
          </el-form-item>

          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="form.tel" class="kz" maxlength="11" clearable />
          </el-form-item>
          <el-form-item label="图片选择" prop="picId">
            <el-select size="mini" class="kz" clearable @change="chooseImage" v-model="checkValue">
              <el-option
                v-for="item in picUploadType"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-image
              class="kz"
              :src="imageUrl"
              style="margin-left: 115%;width: 220px; height: 188px;  border-radius:5px 5px 5px;"
              placeholder="暂无图片"
            ></el-image>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.remark" class="xzcs2" clearable />
          </el-form-item>
        </el-form>

        <div class="nn">
          <el-button size="mini" @click="addBiaoge('form')" class="bouncedHold btnSpace editorBTN">确定</el-button>
          <el-button size="mini" @click="cancleWin('form')" class="cancelBTN  editorBTN">取消</el-button>
        </div>
      </el-dialog>
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
        <singleimageupload ref="singleimageupload" />
      </el-dialog>
    </div>
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
    <div>
      <mapseldialog @map-confirm="handleMapConfirm" ref="mapseldialog" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.aa.cell {
  font-weight: bold;
}

.el-button {
  color: #12bdd9;
}

// 二级
.qw {
  width: 1000px;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
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
  margin-right: 50px;
}

.ntx {
  color: #006080;
  width: 200px;
}

.kz {
  width: 200px;
  margin-right: 120px;
}

.dq {
  width: 90px;
}

.ww {
  margin-right: 42px;
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

// 详情
.xq {
  margin-left: 70px;
}

.h {
  display: flex;
  flex-wrap: wrap;
}

.k {
  width: 300px;
}

.y {
  width: 700px;
  background: #f5f5f5;
}

// 图片
.tp {
  width: 800px;
}
img {
  display: inline-block;
  vertical-align: middle;
}
</style>
<script>
import { cx, menuDelete, xiuGai } from "../../../../api/system/production";
import { DICTDATA, getDict } from "../../../../api/dict";
import { findByParentId } from "../../../../api/system/dict";
import {
  packageDataToMap,
  regName,
  getRegNameByCode,
} from "../../../../utils/area";
import singleimageupload from "../../../../components/upload/singleimageupload";
import { fileid } from "../../../../components/upload/picUpload";
import picTable from "../../../../components/pagetable/picTable";
import imgUrl from "../../../../assets/image/from图片.png";
import { getObjectPicPath } from "../../../../api/system/picture";
import mapseldialog from "../../../../components/mapseldialog";
import { getAreas } from "../../../../api/operation/pushButton";

export default {
  data() {
    return {
      imageUrl: imgUrl,
      sscont: {}, //获取搜索值
      detailWin: false,
      modifyWin: false,
      scqd: false,
      detailForm: {
        factName: "",
        factTypeName: "",
        kindName: "",
        regId: "",
        addr: "",
        atten: "",
        tel: "",
        remark: "",
      },
      form: {
        factName: "",
        factType: "",
        kind: "",
        regId: "",
        addr: "",
        atten: "",
        tel: "",
        remark: "",
        picIds: "",
      },
      rules: {
        kind: [{ required: true, message: "分类不能为空", trigger: "blur" }],
        factType: [
          { required: true, message: "类型不能为空", trigger: "blur" },
        ],
        factName: [
          { required: true, message: "厂家名称不能为空", trigger: "blur" },
        ],
        regId: [
          { required: true, message: "所属区域不可为空", trigger: "blur" },
        ],
        addr: [
          { required: true, message: "详细地址不可为空", trigger: "blur" },
        ],
        atten: [{ required: true, message: "联系人不可为空", trigger: "blur" }],
        tel: [{ required: true, message: "联系电话不可为空", trigger: "blur" }],
      },
      tableData: [],
      search: "",
      pageData: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      SelectionArray: [], //批量删除
      kindDict: this.$parent.$refs.erji.kindDict,
      typeDict: [],
      params: {
        value: "",
      },
      areas: [],
      props: {
        children: "children",
        label: "name",
        value: "id",
      },
      regName: "",
      areaArray: [],
      areaCode: "",
      mapData: {},
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
      checkValue: "",
      checkModel: [],
      uploadWin: false,
      imagesWin: false,
      imageUrl: imgUrl,
    };
  },
  components: { singleimageupload, picTable, mapseldialog },
  mounted() {
    this.cx(); //页面加载时请求列表数据渲染接口
    let elementResizeDetectorMaker = require("element-resize-detector");
    let tableWidth = document.getElementById("table-wrap");
    let pageWidth = document.getElementById("page-wrap-fixed");
    let erd = elementResizeDetectorMaker();
    erd.listenTo(tableWidth, function (element) {
      pageWidth.style.width = element.offsetWidth + "px";
    });
  },
  methods: {
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
      this.$confirm("此操作将永久删除该项数据, 是否继续?", "提示", {
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
              this.cx();
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
    //地区数据查询，翻译使用
    queryRegTree(id) {
      return new Promise((resolve, reject) => {
        getAreas(id).then((res) => {
          this.areas = this.getTreeData(res.data.children);
          resolve();
        });
      });
    },
    // 递归算法
    getTreeData(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    // 详情
    openDetailWin(index, row) {
      this.detailWin = true;
      this.detailForm = row;
      const code = row.regId;
      packageDataToMap(code);
      this.regName = regName;
      if (row.picIds != null) {
        const id = row.picIds;
        getObjectPicPath(id).then((res) => {
          this.imageUrl = res.data;
        });
      }
      if (row.picIds == null) {
        this.imageUrl = imgUrl;
      }
      this.queryRegTree(-1);
      return this.regName;
    },
    // 修改弹框
    openModifyWin(index, row) {
      //获取当前选择的列表数据
      this.modifyWin = true;
      this.form = {
        id: row.id,
        factName: row.factName,
        factType: row.factType,
        kind: row.kind,
        regId: row.regId,
        addr: row.addr,
        atten: row.atten,
        tel: row.tel,
        remark: row.remark,
      };
      // 获取分类下拉框
      getDict(DICTDATA.DEV_KIND).then((res) => {
        this.kindDict = res;
      });
      this.params.value = this.form.kind;
      findByParentId(this.params).then((res) => {
        this.typeDict = res.data;
      });
      if (row.picIds != null) {
        const id = row.picIds;
        getObjectPicPath(id).then((res) => {
          this.imageUrl = res.data;
        });
      }
      if (row.picIds == null) {
        this.imageUrl = imgUrl;
      }
    },
    // 输入框点击事件
    openMapsWin() {
      this.$refs.mapseldialog.open({
        lng: this.form.longitude,
        lat: this.form.latitude,
      });
    },
    handleMapConfirm(addres) {
      this.form.addr =
        addres.province + addres.city + addres.district + addres.addr;
    },
    /**
     * 根据设备分类，查询设备类型下拉框
     */
    getDevTypeDict() {
      this.params.value = this.form.kind;
      findByParentId(this.params).then((res) => {
        this.typeDict = res.data;
      });
    },
    // 多级联动选择器选中事件
    handleChange(value) {
      this.form.regId = value[value.length - 1];
    },
    // 下拉框点击事件,不同的选择跳不同的页面
    chooseImage() {
      this.fileList = [];
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
    addBiaoge(formName) {
      // 获取上传图片的id
      if (fileid) {
        this.form.picIds = fileid;
      }
      // 获取选中的图片id
      if (this.$refs.picTable !== undefined) {
        this.form.picIds = this.$refs.picTable.picId;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 发送当前列表修改后的数据
          this.modifyWin = false;
          xiuGai({
            id: this.form.id,
            factName: this.form.factName,
            factType: this.form.factType,
            regId: this.form.regId,
            addr: this.form.addr,
            atten: this.form.atten,
            tel: this.form.tel,
            remark: this.form.remark,
          })
            .then((res) => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.cx();
            })
            .catch((err) => {
              this.$message.error("修改失败");
            });
        } else {
          return false;
        }
      });
    },
    cancleWin(formName) {
      this.$refs[formName].resetFields();
      this.form = {};
      this.modifyWin = false;
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
      this.cx(formInline);
    },
    handleCurrentChange(val) {
      let formInline = this.$parent.$refs.topform.form;
      this.pageData.current = val;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      this.cx(formInline);
    },
    refresh() {
      let formInline = this.$parent.$refs.topForm.form;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      this.cx(formInline);
    },
    regFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        const code = cellValue;
        return getRegNameByCode(code);
      } else {
        return "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.form-item-content {
  background-color: #fcfcfc;
  border: 1px solid #eee;
  padding: 15px 15px 0;
}

.xan {
  color: white !important;
  background: #006080 !important;
  margin-top: 5px;
}
/deep/.el-dialog__header {
  padding: 40px 0 10px 50px !important;
}
/deep/.el-dialog__body {
  padding: 30px 50px!important;
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
