<template>
  <div>
    <div class="s">
      <el-button size="mini" @click="add" class="newButtonColor listBTN">新增工具</el-button>
      <el-button size="mini" @click="removeAll" class="BatchDeleteColor listBTN">批量删除</el-button>
        <el-button size="mini" slot="trigger" class="otherBTN listBTN">批量导入</el-button>
      <el-button size="mini" @click="exportTable" class="otherBTN listBTN">批量导出</el-button>
    </div>

    <!-- 弹出层 详情 -->
    <dialog-detail ref="dialogDetail" />

    <!-- 弹出层 新增 -->
    <dialog-add ref="dialogAdd" />
  </div>
</template>

<script>
import axios from "axios";
import dialogDetail from "./dialogDetail";
import dialogAdd from "./dialogAdd";
import { removeAll, exportMtTool } from "../../../../api/operation/mtTool";

export default {
  components: {
    dialogDetail,
    dialogAdd
  },
  data() {
    return {
      fileList: []
    };
  },
  mounted() {},
  methods: {
    /**
     * 批量导入
     */
    excleRead(response, file, fileList) {
      if (response.code !== "000000") {
        this.$message({
          message: response.mesg,
          type: "warning"
        });
      } else {
        this.$message({
          message: "导入成功！",
          type: "success"
        });
        // 重新查询数据
        this.$parent.$refs.table.search({
          current: 1
        });
      }
    },
    excleReadError() {
      this.$message({
        message: "文件上传失败！",
        type: "warning"
      });
    },
    /**
     * 新增
     */
    add() {
      this.$refs.dialogAdd.formInline = {};
      this.$refs.dialogAdd.formInline.status = 1;
      this.$refs.dialogAdd.dialogFormVisible = true;
    },
    /**
     * 批量删除
     */
    removeAll() {
      var self = this;

      let multipleSelection = this.$parent.$refs.table.multipleSelection;
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

          removeAll(ids).then(res => {
            if (res.code === "000000" && res.data) {
              self.$message({
                showClose: true,
                message: "删除成功！",
                type: "success"
              });

              // 重新查询数据
              self.$parent.$refs.table.search({
                current: 1
              });
            } else {
              this.$message({
                message: "删除失败！",
                type: "warning"
              });
            }
          });
        });
      }
    },
    /**
     * 导出
     */
    exportTable() {
      let param = this.$parent.$refs.tableOperation.formInline;
      this.$message({
        message: "功能待开发！",
        type: "warning"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.s {
  padding: 15px 40px;
  .push {
    color: #fff;
    background: #006080;
    width: 120px;
  }
  .buttonColor {
    color: #006080;
    width: 120px;
  }
}

.btn-upload {
  display: inline-block;
}

.el-button {
  border: 1px solid #006080;
}

.el-button:hover {
  color: #006080;
}

.el-button--primary:hover {
  color: #fff;
}

.el-button--mini,
.el-button--small {
  border-radius: 2px;
}
</style>