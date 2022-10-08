//故障管理
<template>
  <div class="default-class">
    <div class="list">
      <fill-bar />
      <push-button />
      <form-table />
      <pag-module style="position: fixed;bottom: 0px;"/>
    </div>
  </div>
</template>

<script>

import fillBar from "./components/FaultMa/fillBar"; //引入formInput框栏
import pushButton from "./components/FaultMa/pushButton"; //引入点击按钮模块
import formTable from "./components/FaultMa/formTable"; // 引入form表格
import pagModule from "./components/FaultMa/pagingModule"; // 引入分页模块
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