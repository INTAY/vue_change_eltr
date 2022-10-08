//旧件库
<template>
  <div class="default-class">
    <div class="list">
      <fill-bar ref="fillBar"/>
      <push-button ref="pushButton"/>
      <form-table ref="formTable"/>
      <pag-module style="position: fixed;bottom: 0px;" ref="pageModule"/>
      <dialog-detail ref="dialogDetail"/>
    </div>
  </div>
</template>

<script>

import fillBar from "./components/oldPartsLibrary/fillBar"; //引入formInput框栏
import pushButton from "./components/oldPartsLibrary/pushButton"; //引入点击按钮模块
import formTable from "./components/oldPartsLibrary/formTable"; // 引入form表格
import pagModule from "./components/oldPartsLibrary/pagingModule"; // 引入分页模块
import dialogDetail from "./components/oldPartsLibrary/dialogDetail";
export default {
  components: {
    fillBar,  // fromInput框
    pushButton,  //点击按钮模块
    formTable,  // form表格
    pagModule,  //分页模块
    dialogDetail
  },
  data() {
    return {

    };
  },
  methods: {
    onSubmit() {},
    empty() {}
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
