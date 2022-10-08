<template>
  <div class="default-class">
    <div class="list">
      <fill-bar ref="fillBar"/>
      <form-table ref="formTable"/>
      <pag-module style="position: fixed;bottom: 0px;" ref="pageModule"/>
    </div>
  </div>
</template>

<script>
import fillBar from "./components/fillBar"; //引入formInput框栏
import formTable from "./components/formTable"; // 引入form表格
import pagModule from "./components/pagModule"; // 引入分页模块



export default {
  components: {
    fillBar, // fromInput框
    formTable, // form表格
    pagModule, //分页模块
  },
  data() {
    return {
      regTreeData:[]
    };
  },
  created() {
    this.init();
  },
  methods: {
    onSubmit() {},
    empty() {},
    init() {
      // this.queryRegTree().then(() => {
      //   this.$refs.pushButton.setData();
      // });
    },
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
