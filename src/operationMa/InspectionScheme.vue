<!-- 运维预案 -->
<template>
  <div class="default-class">
    <div class="list">
      <!-- 搜索条件 -->
      <fill-bar ref="fillBar" />
      <!-- 表格操作 -->
      <push-button ref="pushButton" />
      <!-- 表格 -->
      <form-table ref="formTable" />

      <dialog-detail ref="dialogDetail" />
    </div>
  </div>
</template>

<script>
// 引入搜索条件区域组件
import fillBar from "./components/InspectionScheme/fillBar";
// 引入表格操作区域组件
import pushButton from "./components/InspectionScheme/pushButton";
// 引入表格组件
import formTable from "./components/InspectionScheme/formTable";
// 引入详情弹出层组件
import dialogDetail from "./components/InspectionScheme/dialogDetail";

export default {
  components: {
    fillBar, // fromInput框
    pushButton, //点击按钮模块
    formTable, // form表格
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