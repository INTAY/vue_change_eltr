//运维工具管理
<template>
  <div class="default-class">
    <div class="list">
      <fill-bar ref="fillBar" />
      <push-button ref="tableOperation" />
      <form-table ref="table" />
      <pag-module ref="pageModule" style="position: fixed;bottom: 0px;"/>
    </div>
  </div>
</template>

<script>
import fillBar from "./components/OperationTools/fillBar"; //引入formInput框栏
import pushButton from "./components/OperationTools/pushButton"; //引入点击按钮模块
import formTable from "./components/OperationTools/formTable"; // 引入form表格
import pagModule from "./components/OperationTools/pagingModule"; // 引入分页模块
export default {
  components: {
    fillBar,  // fromInput框
    pushButton,  //点击按钮模块
    formTable,  // form表格
    pagModule  //分页模块
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