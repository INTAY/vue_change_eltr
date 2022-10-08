<template>
  <div>
    <div class="s">
      <el-button size="small" @click="add" class="push">入库</el-button>
    </div>

    <!-- 弹出层 详情 -->
    <dialog-detail ref="dialogDetail" />

    <!-- 弹出层 新增 -->
    <dialog-add ref="dialogAdd" />

  </div>
</template>

<script>
import dialogDetail from "./dialogDetail";
import dialogAdd from "./dialogAdd";
import { add } from "../../../../api/operation/operationSpareStore";

export default {
  components: {
    dialogDetail,
    dialogAdd
  },
  data() {
    return {}
  },
  methods: {
    /**
     * 入库
     */
    add() {
      this.$refs.dialogAdd.tableData = [
        {name: "", type: "", modelId: "", factoryId: "", storeNum: "", curNum: "", unit: "", storeNum: "", buyPlanId: ""}
      ];
      this.$refs.dialogAdd.dialogFormVisible = true;
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
</style>