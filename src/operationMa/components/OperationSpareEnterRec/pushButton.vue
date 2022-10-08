<template>
  <div>
    <div>
      <el-button size="mini" class="newButtonColor listBTN" @click="add" >新增</el-button>
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
      fileList: []
    };
  },
  mounted() {},
  methods: {
    /**
     * 新增
     */
    add() {
      let dialogAdd = this.$refs.dialogAdd;
       dialogAdd.sign = false;
      dialogAdd.formInline = {};
      dialogAdd.formSearch = {};
      dialogAdd.tableData = [];
      dialogAdd.dialogFormVisible = true;
     
    }
  }
};
</script>

<style lang="scss" scoped>
</style>