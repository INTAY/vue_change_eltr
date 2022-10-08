<template>
  <div id="now-width">
    <div class="s">
      <el-button size="mini" @click="add" class="newButtonColor listBTN">新增</el-button>
    </div>

    <!-- 弹出层 新增 -->
    <dialog-add ref="dialogAdd" />
  </div>
</template>

<script>
import axios from "axios";
import dialogAdd from "./dialogAdd";
import { removeAll, exportMtTool } from "@/api/operation/mtTool";
export default {
  components: {
    dialogAdd
  },
  data() {
    return {
      fileList: [],
      nowWidth: ""
    };
  },
  mounted() {
    this.nowWidth = document.getElementById("now-width");
  },
  methods: {
    /**
     * 新增
     */
    add() {
      let dialogAdd = this.$refs.dialogAdd;

      dialogAdd.dialogFormVisible = true;
      dialogAdd.formInline = {};
      dialogAdd.formSearch = {};
      dialogAdd.tableData_devunsel = [];
      dialogAdd.tableData_devsel = [];
      // 查询待选的备件
      dialogAdd.searchTableDataUnsel();
    }
  }
};
</script>

<style lang="scss" scoped>
.s {
  padding: 13px 0 3px 22px;
  .push {
    color: #fff;
    background: #006080;
    width: 135px;
  }
  .buttonColor {
    color: #006080;
    width: 135px;
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