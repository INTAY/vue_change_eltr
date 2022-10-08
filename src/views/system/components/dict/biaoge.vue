<template>
  <div>
    <div style="padding: 0px 15px 45px" id="table-wrap">
      <el-table
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" show-overflow-tooltip/>

        <el-table-column label="字典名称" prop="name"  show-overflow-tooltip/>

        <el-table-column label="字典码" prop="value"   show-overflow-tooltip/>

        <el-table-column label="上级字典" prop="parentName" show-overflow-tooltip  />

        <el-table-column label="排序" prop="sortNo" show-overflow-tooltip  />

        <el-table-column label="备注" prop="remark"   show-overflow-tooltip/>

        <el-table-column fixed="right" label="操作"  >
          <template slot-scope="scope">
            <el-button @click="xgopen(scope.$index, scope.row)" class="common-btn">修改</el-button>
            <el-button @click="Delete(scope.$index, scope.row)" class="delete-btn">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->
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
          <a class="page-option-icon" href="javascript:;" @click="refresh" title="刷新">
            <img src="/static/img/7.png" />
          </a>
        </span>
      </el-pagination>
    </div>

    <div>
      <!-- 修改二级 -->
      <div>
        <el-dialog
          title="修改字典"
          :visible.sync="xiugai"
          width="500px"
          class="yw"
          :modal-append-to-body="false"
          :close-on-click-modal="false"
          top="20vh"
          style="left: 85px"
        >
          <el-form
            ref="sizeForm"
            :model="sizeForm"
            :rules="this.$parent.$refs.erji.rules"
            label-width="80px"
            size="small"
            class="qw"
          >
            <el-form-item label="上级字典">
              <span>{{sizeForm.parentName}}</span>
            </el-form-item>
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="sizeForm.name" class="kz" clearable />
            </el-form-item>
            <el-form-item label="字典码" prop="value">
              <el-input
                v-model="sizeForm.value"
                class="kz"
                readonly
                clearable
              />
            </el-form-item>
            <el-form-item label="排序" prop="sortNo">
              <el-input
                v-model="sizeForm.sortNo"
                class="kz"
                clearable
              />
            </el-form-item>
            <el-form-item label="备注">
              <!-- <textarea v-model="sizeForm.remark" class="kz" clearable /> -->
              <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="sizeForm.remark"
              maxlength="128"
              show-word-limit
              class="kz"
            />
            </el-form-item>
          </el-form>
          <div class="dialog-footer">
            <el-button size="small"  @click="addBiaoge('sizeForm')" class="btnSpace bouncedHold listBTN">确定</el-button>
            <el-button size="small" @click="xiugai = false" class="cancelBTN listBTN">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.di {
  position: fixed;
  bottom: 0px;
  background: #f7f7f7;
  z-index: 999;
  text-align: center;
  left: 440px;
  right: 0;
  padding: 10px 0;
  line-height: 25px;
}

.aniu {
  width: 80px;
}

.srk {
  width: 200px;
}

.aa.cell {
  font-weight: bold;
}


// 二级
.qw {
  padding-left: 65px;
}

.kz {
  width: 200px;
}

//分页器
.block {
  width: 100%;
  background-color: #f7f7f7;
  position: fixed;
  bottom: 10px;
}

.sx {
  margin-top: 2px;
  margin-left: 10px;
}

.fenye {
  margin-left: 30%;
  display: flex;
}
</style>
<script>
import {
  cx,
  remove,
  xiuGai,
  findByParentId,
} from "../../../../api/system/dict";

export default {
  name: "biaoge",
  data() {
    return {
      tableData: [],
      params: {
        value: "",
      },
      search: "",
      xiugai: false,
      deleteWin: false,
      sizeForm: {},
      SelectionArray: [], //批量删除
      treeid: "-1",
      pageData: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      // sscont: {},
    };
  },
  created() {
    this.params.parentId = -1;
    this.cx(this.params);
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

  methods: {
    /**
     * 根据父字典码获取所有子级字典
     */
    findByParentId(param) {
      findByParentId(param).then((res) => {
        this.tableData = res.data.records;
      });
    },
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
          console.log(err, "查询报错");
        });
    },
    // 分页点击事件
    handleSizeChange(val) {
      let formInline = {};
      this.pageData.pageSize = val;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      let parentId = this.$parent.$refs.tree.parentId;
      if (parentId != "" || parentId != null) {
        formInline.parentId = parentId;
      }
      this.cx(formInline);
    },
    handleCurrentChange(val) {
      let formInline = {};
      this.pageData.current = val;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      let parentId = this.$parent.$refs.tree.parentId;
      if (parentId != "" || parentId != null) {
        formInline.parentId = parentId;
      }
      this.cx(formInline); //点击第几页就会发送要显示的页数过去
    },
    // 删除
    Delete(index, row) {
      console.log(row);
      const id = row.id;
      this.$confirm("此操作将永久删除该项数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        confirmButtonClass: "messagebox-button",
		cancelButtonClass: "messagebox-button"
      })
        .then(() => {
          remove(id)
            .then((res) => {
              if (res.code === "000000") {
                this.$message({
                  message: res.mesg,
                  type: "success",
                });
//              this.cx();
                this.$parent.$refs.tree.rest()
                this.params.value = row.parentId;
                findByParentId(this.params).then((res) => {
                  this.tableData = res.data;
                });
              } else {
                this.$message({
                  message: res.mesg,
                  type: "error",
                });
              }
            })
            .catch((res) => {
              this.$message({
                message: res.mesg,
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
    xgopen(index, row) {
      //获取当前选择的列表数据
      this.xiugai = true;
      
      this.sizeForm = {
        id: row.id,
        name: row.name,
        value: row.value,
        paraName: row.paraName,
        sortNo: row.sortNo,
        parentName: row.parentName,
        parentId: row.parentId,
      };
      console.log( this.sizeForm)
    },
    addBiaoge(formName) {
      // 发送当前列表修改后的数据
      this.$refs[formName].validate((valid) => {
        if (valid) {
          xiuGai({
            id: this.sizeForm.id,
            name: this.sizeForm.name,
            value: this.sizeForm.value,
            paraName: this.sizeForm.paraName,
            remark:this.sizeForm.remark,
            sortNo: this.sizeForm.sortNo,
          })
            .then((res) => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.xiugai = false;
              this.params.value = this.sizeForm.parentId;
              this.$parent.$refs.tree.rest()
              console.log(this.sizeForm);
              findByParentId(this.params).then((res) => {
                this.$parent.$refs.biaoge.tableData = res.data;
              });
            })
            .catch((err) => {
              this.$message.error("修改失败");
              this.xiugai = false;
            });
        }
      });
    },
    //表格选选择框事件
    handleSelectionChange(val) {
      this.SelectionArray = val;
    },
    refresh() {
      let formInline = {};
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


/deep/ .has-gutter {
  background: #f0f0f0 !important;
}

/deep/ .el-table th {
  background-color: transparent;
}

/deep/ .el-table tr {
  background-color: transparent;
}

// .page-option-wrap {
//   border: 1px solid #e8e8e8;
//   border-radius: 2px;
//   background-color: #fff;
// }

// .split-line {
//   display: inline-block;
//   width: 1px;
//   background-color: #e8e8e8;
//   height: 16px;
//   vertical-align: middle;
// }

// .page-option-icon {
//   display: inline-block;
//   padding: 0 10px;
// }

// img {
//   display: inline-block;
//   vertical-align: middle;
// }
</style>

