// 备品备件出库管理
<template>
  <div class="default-class">
    <div class="list">
      <fill-bar ref="fillBar" />
      <push-button ref="tableOperation" />
      <form-table ref="table" />
      <!-- 弹出层 详情 -->
      <dialog-detail ref="dialogDetail" />
      <!-- 弹出层 审批 -->
      <dialog-approve ref="dialogApprove" />
      <pag-module ref="pageModule" style="position: fixed;bottom: 0px;"/>
    </div>
  </div>
</template>

<script>
import dialogDetail from "./components/OperationSpareOutRec/dialogDetail";
import dialogApprove from "./components/OperationSpareOutRec/dialogApprove";
import fillBar from "./components/OperationSpareOutRec/fillBar"; //引入formInput框栏
import pushButton from "./components/OperationSpareOutRec/pushButton"; //引入点击按钮模块
import formTable from "./components/OperationSpareOutRec/formTable"; // 引入form表格
import pagModule from "./components/OperationSpareOutRec/pagingModule"; // 引入分页模块
export default {
  components: {
    fillBar,  // fromInput框
    pushButton,  //点击按钮模块
    formTable,  // form表格
    pagModule,  //分页模块
    dialogDetail,
    dialogApprove
  },
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.default-class {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>