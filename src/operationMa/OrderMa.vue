//工单管理
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
import fillBar from "./components/OrderMa/fillBar"; //引入formInput框栏
import pushButton from "./components/OrderMa/pushButton"; //引入点击按钮模块
import formTable from "./components/OrderMa/formTable"; // 引入form表格
import pagModule from "./components/OrderMa/pagingModule"; // 引入分页模块
import dialogDetail from "./components/OrderMa/dialogDetail";
import {sxqxzk} from '../../api/operation/orderManage'
export default {
  components: {
    fillBar, // fromInput框
    pushButton, //点击按钮模块
    formTable, // form表格
    pagModule, //分页模块
    dialogDetail
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
      this.queryRegTree().then(() => {
        this.$refs.pushButton.setData();
      });
    },
    //地区数据查询，翻译使用
    queryRegTree() {
      return new Promise((resolve, reject) => {
        sxqxzk().then(res => {
          this.regTreeData = this.getTreeData(res.data.children);
          resolve();
        });
      });
    },
    // 递归判断列表，把最后的children设为undefined
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    }
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
