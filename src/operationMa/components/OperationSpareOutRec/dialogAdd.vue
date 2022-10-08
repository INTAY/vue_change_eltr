<template>
  <div>
    <!-- 弹出层 新增/修改 -->
    <el-dialog
      title="备品备件出库申请"
      :modal-append-to-body="false"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      class="title"
      width="1190px"
    >
      <div>
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>基本信息
          </div>
          <div class="form-item-content">
            <el-form ref="form" :model="formInline" :rules="rules" size="mini" class="xy">
              <el-row>
                <el-col :span="9">
                  <el-form-item label="出库申请名称" prop="recName">
                    <el-input v-model="formInline.recName" class="width-240" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="审批人" style="display:flex;">
                    <el-input
                      id="checkManNameTxtbox"
                      class="width-240"
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
        <!-- 搜索区域 -->
        <div class="form-item form-item-a">
          <div class="form-item-title">
            <span class="line"></span>备品备件
          </div>
          <div class="dev-wrap">
            <div class="single org">
              <div class="search-wrap">
                <el-form :model="formSearch" :inline="true" class="demo-form-inline">
                  <el-form-item label="类型">
                    <el-select
                      size="mini"
                      v-model="formSearch.spareType"
                      @change="searchFactByType"
                      placeholder="全部"
                      class="selectWidth"
                      clearable
                    >
                      <el-option label="全部"></el-option>
                      <el-option
                        v-for="item in searchTypeOption"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="厂家">
                    <el-select
                      size="mini"
                      v-model="formSearch.factoryId"
                      placeholder="全部"
                      @change="searchModel"
                      class="selectWidth"
                    >
                      <el-option label="全部" value></el-option>
                      <el-option
                        v-for="item in searchFactOption"
                        :key="item.id"
                        :label="item.factName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="型号">
                    <el-select
                      size="mini"
                      v-model="formSearch.modelId"
                      placeholder="全部"
                      class="selectWidth"
                      @change="changeModel"
                    >
                      <el-option label="全部" value></el-option>
                      <el-option
                        v-for="item in searchModelOption"
                        :key="item.id"
                        :label="item.modelName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="库房">
                    <el-select
                      size="mini"
                      v-model="formSearch.houseId"
                      placeholder="全部"
                      class="selectWidth"
                    >
                      <el-option label="全部" value></el-option>
                      <el-option
                        v-for="item in warehouseData"
                        :key="item.id"
                        :label="item.houseName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item>
                    <el-button
                      size="mini"
                      @click="searchTableDataUnsel"
                      class="newButtonColor SearchBTN"
                    >查询</el-button>
                    <el-button size="mini" @click="empty" class="otherBTN SearchBTN">清空</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <!-- 表格区域 -->
              <div class="item-sel">
                <!-- <div class="left"> -->
                <div>
                  <span class="daixuan">待选备品备件</span>
                  <span>
                    <el-button class="newButtonColor listBTN" size="mini" @click="add">出库</el-button>
                  </span>
                  <div class="cont">
                    <el-table
                      :data="tableData_devunsel"
                      :header-cell-style="{background:'#f1f1f1',color:'#000'}"
                      stripe
                      @selection-change="handleSelectionChange"
                      style="width: 100%"
                    >
                      <el-table-column type="selection" width="45" align="center"></el-table-column>
                      <el-table-column
                        label="备品备件类型"
                        :show-overflow-tooltip="true"
                        prop="spareType"
                        :formatter="spareTypeFormat"
                        align="center"
                      ></el-table-column>

                      <el-table-column
                        label="备品备件厂家"
                        :show-overflow-tooltip="true"
                        prop="factName"
                        align="left"
                      ></el-table-column>

                      <el-table-column
                        label="备品备件型号"
                        :show-overflow-tooltip="true"
                        prop="modelName"
                        align="left"
                      ></el-table-column>
                      <el-table-column label="数量" align="center" prop="spareNum"></el-table-column>
                      <el-table-column label="单位" align="center" prop="unit"></el-table-column>
                      <el-table-column
                        label="库房"
                        :show-overflow-tooltip="true"
                        prop="houseName"
                        align="center"
                      ></el-table-column>
                      <el-table-column label="易耗品" align="center">
                        <template slot-scope="scope">
                          <span v-if="scope.row.consumable == 0">易耗品</span>
                          <span v-if="scope.row.consumable == 1">非易耗品</span>
                          <span v-else>-</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="资产编号"
                        :show-overflow-tooltip="true"
                        prop="assetNo"
                        align="left"
                      ></el-table-column>
                      <el-table-column
                        label="保质期"
                        :show-overflow-tooltip="true"
                        prop="expireDate"
                        align="center"
                      ></el-table-column>
                    </el-table>
                  </div>
                </div>
                <!-- 分页 -->
                <div class="page-wrap">
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
                        <img src="/static/img/7.png" />
                      </a>
                      <i class="split-line"></i>
                      <a
                        class="page-option-icon"
                        href="javascript:;"
                        @click="exportTable"
                        title="导出"
                      >
                        <img src="/static/img/8.png" />
                      </a>
                    </span>
                  </el-pagination>
                </div>

                <!-- <div class="right"> -->
                <div>
                  <span class="daixuan">已选备品备件</span>
                  <span>
                    <el-button class="BatchDeleteColor listBTN" size="mini" @click="removeDevSel">批量删除</el-button>
                  </span>

                  <div class="cont">
                    <el-table
                      :data="tableData_devsel"
                      :header-cell-style="{background:'#f1f1f1',color:'#000'}"
                      stripe
                      @selection-change="handleSelectionChangeDevSel"
                      style="width: 100%"
                    >
                      <el-table-column type="selection" width="45" align="center"></el-table-column>
                      <el-table-column
                        label="备品备件类型"
                        :show-overflow-tooltip="true"
                        prop="spareType"
                        :formatter="spareTypeFormat"
                        align="center"
                      ></el-table-column>

                      <el-table-column
                        label="备品备件厂家"
                        :show-overflow-tooltip="true"
                        prop="factName"
                        align="left"
                      ></el-table-column>

                      <el-table-column
                        label="备品备件型号"
                        :show-overflow-tooltip="true"
                        prop="modelName"
                        align="left"
                      ></el-table-column>
                      <el-table-column label="数量" align="center" prop="spareNum"></el-table-column>
                      <el-table-column label="单位" align="center" prop="unit"></el-table-column>
                      <el-table-column
                        label="库房"
                        :show-overflow-tooltip="true"
                        prop="houseName"
                        align="center"
                      ></el-table-column>
                      <el-table-column label="易耗品" align="center">
                        <template slot-scope="scope">
                          <span v-if="scope.row.consumable == 0">易耗品</span>
                          <span v-if="scope.row.consumable == 1">非易耗品</span>
                          <span v-else>-</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="资产编号"
                        :show-overflow-tooltip="true"
                        prop="assetNo"
                        align="left"
                      ></el-table-column>
                      <el-table-column
                        label="保质期"
                        :show-overflow-tooltip="true"
                        prop="expireDate"
                        align="center"
                      ></el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dialog-footer dialog-btn">
        <el-button class="editorBTN btnSpace bouncedHold" size="mini" @click="save">确认</el-button>
        <el-button size="mini" class="editorBTN cancelBTN" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  querySpareInfoPage,
  addSpareExportRec,
  warehouseQueryByList
} from "@/api/operation/operationSpareOutRec";
import { getDict, DICTDATA, translatorDict } from "@/api/dict";
import {
  searchFactByType,
  searchModel
} from "@/api/operation/operationSpareStore";
import { getOrgUserTree } from "@/api/operation/operationSpareOutRec";

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
      // 组织机构用户树
      formSearch: {},
      tableData_devunsel: [],
      tableData_devsel: [],
      dialogFormVisible: false,
      formInline: {},
      multipleSelection: [],
      multipleSelectionDevSel: [],
      rules: {
        recName: [
          { required: true, message: "请选择出库申请名称", trigger: "blur" }
        ],
        checkManId: [
          { required: true, message: "请选择审批人", trigger: "blur" }
        ]
      },
      searchTypeOption: [],
      searchFactOption: [],
      searchModelOption: [],
      pageData: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      warehouseData: []
    };
  },
  created() {
    // 备品备件类型下拉框数据 20130
    getDict(DICTDATA.SPARE_SYSTEM).then(res => {
      this.searchTypeOption = res;
    });
    // 组织机构树
    getOrgUserTree("-1").then(res => {
      this.orgTreeData = [res.data];
    });
    var self = this;
    // 库房
    self.warehouseQueryByList();
    // 可出库的备品备件
    self.querySpareInfoPage({});
    // 点击其他地方隐藏组织机构用户树
    document.addEventListener("click", e => {
      console.log(e);
      
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
    showOrgTree() {
      this.visibleOrgTree = true;
    },
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
     * 根据类型查厂家
     */
    searchFactByType() {

      this.searchFactOption = [];
      this.searchModelOption = [];
      this.formSearch.factoryId = "";
      this.formSearch.modelId = "";

      if (this.formSearch.type !== "") {
        searchFactByType({
          factType: this.formSearch.type,
          kind: DICTDATA.SPARE_SYSTEM // 类型
        }).then(res => {
          this.searchFactOption = res.data;
        });
      }
    },
    /**
     * 根据类型、厂家，查型号
     */
    searchModel() {
      this.searchModelOption = [];
      this.formSearch.modelId = "";

      if (this.formSearch.factoryId !== "") {
        searchModel({
          devClass: DICTDATA.SPARE_SYSTEM, // 类别
          devMainType: this.formSearch.type, // 类型
          factId: this.formSearch.factoryId // 厂家
        }).then(res => {
          console.log(res);
          this.searchModelOption = res.data;
        });
      }
    },
    // 库房
    warehouseQueryByList() {
      warehouseQueryByList().then(res => {
        this.warehouseData = res.data;
      });
    },
    changeModel() {
      this.$forceUpdate();
    },
    /**
     * 删除已选的备品备件
     */
    removeDevSel() {
      if (this.multipleSelectionDevSel.length > 0) {
        for (var i in this.multipleSelectionDevSel) {
          for (var j in this.tableData_devsel) {
            if (
              this.multipleSelectionDevSel[i].id === this.tableData_devsel[j].id
            ) {
              this.tableData_devsel.splice(j, 1);
              break;
            }
          }
        }
      }
    },
    /**
     * 保存
     */
    save() {
      // 校验
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.tableData_devsel.length === 0) {
            this.$message({
              message: "请选择备品备件！",
              type: "warning"
            });
            return;
          } else {
            let param = {};
            param.recName = this.formInline.recName;
            param.checkManName = this.formInline.checkManName;
            param.checkManId = this.formInline.checkManId;
            param.spareInfoIds = [];

            for (let i in this.tableData_devsel) {
              param.spareInfoIds.push(this.tableData_devsel[i].id);
            }
            addSpareExportRec(param).then(res => {
              if (res.code === "000000" && res.data) {
                this.$message({
                  showClose: true,
                  message: "出库申请提交成功！",
                  type: "success"
                });
                this.dialogFormVisible = false;
                // 重新查询数据
                this.$parent.$parent.$refs.table.search({
                  current: 1
                });
              } else {
                this.$message.error(res.mesg);
              }
            });
 
          }

 
        }
      });
    },
    /**
     * 添加到“已选备品备件”
     */
    add() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: "请选择要出库的选项！",
          type: "warning"
        });
      } else {
        // 判断是否重复添加
        for (var i in this.multipleSelection) {
          for (var j in this.tableData_devsel) {
            if (this.multipleSelection[i].id === this.tableData_devsel[j].id) {
              this.$message({
                message: "不能重复选择备品备件！",
                type: "warning"
              });
              return;
            }
          }
        }

        this.tableData_devsel.push.apply(
          this.tableData_devsel,
          this.multipleSelection
        );
      }
    },
    /**
     * “待选备品备件”表格的选中事件
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * “已选备品备件”表格的选中事件
     */
    handleSelectionChangeDevSel(val) {
      this.multipleSelectionDevSel = val;
    },
    /**
     * 根据查询条件查询待选的备件
     */
    searchTableDataUnsel(data) {
      // console.log(this.formSearch, "搜索条件...........");
      this.querySpareInfoPage(this.formSearch);
    },
    // 查询可出库的备品备件
    querySpareInfoPage(data) {
      querySpareInfoPage(data).then(res => {
        this.tableData_devunsel = res.data.records;
        this.pageData = {
          total: res.data.total,
          current: res.data.current,
          pageSize: res.data.size
        };
      });
    },
    // 清空
    empty() {
      this.formSearch = {};
      this.visibleOrgTree = false;
    },
    hideOrgTree() {
    },

    // pageSize 变化
    handleSizeChange(val) {
      this.pageData.pageSize = val;
      this.querySpareInfoPage({ size: val, current: 1 });
    },
    //  点击某页
    handleCurrentChange(val) {
      this.querySpareInfoPage({ current: val,size: this.pageData.pageSize });
    },
    // 分页-刷新
    refresh() {
      this.querySpareInfoPage({ current: 1 });
    },
    // 导出
    exportTable() {
    },
    // 表格多行选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 状态格式化 字典200
    spareTypeFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.SPARE_SYSTEM, cellValue);
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-btn{
  margin-bottom: 20px;
}
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

/deep/ .el-dialog__body {
  padding: 0 20px 1px 20px;
}
/deep/ .form-item .el-form-item--mini.el-form-item {
  margin: 10px 0;
}
.t-a-c {
  text-align: center;

  .el-input__inner {
    text-align: center !important;
  }
}
.el-table {
  margin-bottom: 10px;
}
.el-button--primary {
  background-color: #006080;
  border-color: #006080;
}

.el-button--primary:hover {
  color: #fff;
}

.el-button--mini,
.el-button--small {
  border-radius: 2px;
}

.selectWidth {
  width: 120px;
}

.width-240 {
  width: 240px;
}

.width-620 {
  width: 620px;
}

.form-item {
  vertical-align: baseline;
  .form-item-content {
    border: 1px solid #efefef;
  }
  .search-wrap {
    height: 48px;
    line-height: 24px;
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
      margin-top: -3px;
    }
  }
}
.form-item-a {
  margin-top: 5px;
}
.item-sel {
  overflow: hidden;
  .daixuan {
    font-weight: 700;
    color: #1e1e1e;
    display: inline-block;
    margin-right: 5px;
  }
  .add-btn {
    width: 135px;
  }
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
      margin-bottom: 10px;
    }
  }

  .middle {
    margin-left: 550px;
  }

  .right {
    width: 580px;
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


// 分页
.page-wrap {
  width: 100%;
  bottom: 0px;
  background: #f7f7f7;
  display: flex;
  justify-content: center;
  height: 35px;
  line-height: 20px;
  margin: -10px 0 10px;
  .page-option-wrap {
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    background-color: #fff;

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

      img {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
/deep/ .el-form-item__label {
  color: #909090 !important;
}
</style>
