<template>
  <div>
    <div class="s">
      <el-button size="mini" class="listBTN newButtonColor" @click="openadd"
        >新增字典</el-button
      >
      <el-button size="mini" class="listBTN BatchDeleteColor" @click="remove"
        >批量删除</el-button
      >
      <el-divider direction="vertical" />
      <el-input
        size="small"
        v-model="params.name"
        style="width: 220px"
        placeholder="请输入字典名称"
        clearable
      />
      <el-input
        size="small"
        v-model="params.value"
        style="width: 220px; margin: 0 1% 0 0.5%"
        placeholder="请输入字典码"
        clearable
      />
      <el-button class="newButtonColor SearchBTN" size="mini" @click="queryDict"
        >查询</el-button
      >
      <el-button size="mini" class="otherBTN SearchBTN" @click="clearParams"
        >清空</el-button
      >
    </div>
    <!-- 二级 -->
    <div>
      <el-dialog
        title="新增字典"
        :visible.sync="add"
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
          :rules="rules"
          label-width="80px"
          size="small"
          class="qw"
        >
          <el-form-item label="上级字典">
            <span>{{ sizeForm.parentName }}</span>
          </el-form-item>

          <el-form-item label="字典名称" prop="name">
            <el-input v-model="sizeForm.name" class="kz" clearable />
          </el-form-item>

          <el-form-item label="字典码" prop="value">
            <el-input
              v-model.number="sizeForm.value"
              class="kz"
              clearable
            />
          </el-form-item>

          <el-form-item label="排序" prop="sortNo">
            <el-input
              v-model.number="sizeForm.sortNo"
              class="kz"
              clearable
            />
          </el-form-item>
          <el-form-item label="备注">
            <!-- <textarea type = "textarea" v-model="sizeForm.remark" class="kz" clearable maxlength="50" :show-word-limit="true" /> -->
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
          <el-button
            size="small"
            @click="addbg('sizeForm')"
            class="btnSpace bouncedHold listBTN"
            >确定</el-button
          >
          <el-button size="small" @click="cancleWin" class="cancelBTN listBTN"
            >取消</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  add,
  piliangDelete,
  findByParentId,
  cx,
} from "../../../../api/system/dict";

export default {
  data() {
  	var isWidth= (rule, value, callback) => {
        if (!value) {
          
        } else {
          if (value.toString().length<=6) {
            callback()
          } else {
            return callback(new Error('输入数字超出限制'))
          }
        }
      };
    return {
      add: false,
      xztreeid: "",
      // 新增参数校验
      rules: {
        name: [{ required: true, message: "请输入字典名称", trigger: "blur" },
        		{max:32, message: "长度超过限制", trigger: "blur"}
        ],
        sortNo: [
          { required: true, message: "请输入字典排序号", trigger: "blur" },
          {type: 'number', message: "请输入数字", trigger: "blur"},
          { validator: isWidth, trigger: "blur" }
        ],
        value: [{ required: true, message: "请输入字典码", trigger: "blur" },
        {type: 'number', message: "请输入数字", trigger: "blur"},
        { validator: isWidth, trigger: "blur" }
        ],
      },
      sizeForm: {
        parentName: "",
        name: "",
        value: "",
        sortNo: "",
        parentId: "",
        remark: "",
      },
      ids: "",
      params: {},
    };
  },
  methods: {
    openadd() {
      this.sizeForm = {};
      console.log(this.$parent.$refs.tf.formInline.value);
      if (this.$parent.$refs.tf.formInline.value === undefined) {
        this.$message({
          message: "至少选取树的一条数据!",
          type: "warning",
        });
        return false;
      }
      this.sizeForm.parentId = this.$parent.$refs.tf.formInline.value;
      this.sizeForm.parentName = this.$parent.$refs.tf.formInline.name;
      this.add = true;
      console.log(this.sizeForm);
    },
    addbg(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          add({
            name: this.sizeForm.name,
            value: this.sizeForm.value,
            sortNo: this.sizeForm.sortNo,
            parentId: this.sizeForm.parentId,
            remark: this.sizeForm.remark,
          })
            .then((res) => {
              if (res.code === "000000") {
                this.$message({
                  message: "添加成功",
                  type: "success",
                });
                this.add = false;
                this.$parent.$refs.tree.getTreeTable();
                this.params.value = this.sizeForm.parentId;
                findByParentId(this.params).then((res) => {
                  this.$parent.$refs.biaoge.tableData = res.data;
                  this.$parent.$refs.tree.rest();
                });
                this.params = {};
              } else if (res.code === "050000") {
                this.$message({
                  message: res.mesg + "," + res.data,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              this.$message.error("添加失败");
              this.add = false;
              this.params.value = this.sizeForm.parentId;
              findByParentId(this.params).then((res) => {
                this.$parent.$refs.biaoge.tableData = res.data;
              });
            });
        }
      });
    },
    cancleWin() {
      this.add = false;
      this.sizeForm = {};
    },
    remove() {
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
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        confirmButtonClass: "messagebox-button",
        cancelButtonClass: "messagebox-button",
      })
        .then(() => {
          piliangDelete(arr)
            .then((res) => {
              this.$parent.$refs.biaoge.cx({ parentId: this.ids });
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.$parent.$refs.biaoge.SelectionArray = [];
              this.$parent.$refs.tree.rest();
            })
            .catch((err) => {
              this.$message.error("删除失败");
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 查询功能
    queryDict() {
      this.params.parentId = -1;
      cx(this.params).then((res) => {
        this.$parent.$refs.biaoge.tableData = res.data.records;
        this.$parent.$refs.biaoge.currentPage = res.data.current;
        this.$parent.$refs.biaoge.size = res.data.size;
        this.$parent.$refs.biaoge.total = res.data.total;
      });
      console.log(this.$parent.$refs.biaoge.tableData, "+++++++");
    },
    clearParams() {
      this.params = {};
      this.params.parentId = -1;
      cx(this.params).then((res) => {
        this.$parent.$refs.biaoge.tableData = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// 按钮
.aniu {
  width: 120px;
}
.s {
  padding: 0 15px 5px 15px;
}

// 二级
.qw {
  padding-left: 65px;
}

.kz {
  width: 200px;
}

.xan {
  width: 60px;
  height: 33px;
  margin-top: 3px;
  margin-left: 1%;
}

.zxan {
  height: 30px;
}
//  .el-button--primary{
//    height: 32px !important;
//    width: 120px;
//  }
</style>
