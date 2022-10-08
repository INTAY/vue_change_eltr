<template>
  <div class="leftMenu">
    <img src="../../../assets/image/right.png" alt="" v-show="!current" class="right" @click="menu">

    <div class="menu" v-show="current">
      <img src="../../../assets/image/left.png" alt="" v-show="current" class="left" @click="menu">
      <el-menu
        default-active="index"
        :router="true"
        class="el-menu-vertical-demo"
        @select="handelSeelct">
        <el-menu-item>
          <i class="iconfont icon-yunweiguanli2"></i>
          <span>&nbsp;运维管理</span>
        </el-menu-item>
        <!-- <el-menu-item index="/operationMa/OperationTeam">
          <span class="menuSty">运维组管理</span>
        </el-menu-item> -->
        <el-menu-item index="/operationMa/InspectionScheme">
          <span class="menuSty">运维预案</span>
        </el-menu-item>
        <el-menu-item index="/operationMa/InspectionPlan">
          <span class="menuSty">运维任务</span>
        </el-menu-item>
        <el-menu-item index="/operationMa/FaultMa">
          <span class="menuSty">故障管理</span>
        </el-menu-item>
        <el-menu-item index="/operationMa/OrderMa">
          <span class="menuSty">工单管理</span>
        </el-menu-item>
        <el-menu-item index="/operationMa/OperationTools">
          <span class="menuSty">运维工具管理</span>
        </el-menu-item>
        <el-menu-item index="/operationMa/OperationSpareBuyPlan">
          <span class="menuSty">备品备件采购管理</span>
        </el-menu-item>
        <el-menu-item index="/operationMa/OperationSpareStore">
          <span class="menuSty">备品备件库</span>
        </el-menu-item>
        <el-menu-item index="/operationMa/OperationSpareOutRec">
          <span class="menuSty">备品备件出库管理</span>
        </el-menu-item>
        <el-menu-item index="/operationMa/OperationSpareScrap">
          <span class="menuSty">备品备件报废管理</span>
        </el-menu-item>
      </el-menu>

    </div>
  </div>

</template>

<script>
export default {
  data () {
    return {
      current:true,
    }
  },
  methods: {
    handelSeelct () {
    },
    menu () {
      this.current = !this.current;
      this.$emit('change',this.current)

    }
  }
};
</script>

<style lang="scss" scoped>
.leftMenu {
  position: relative;
  float: left;
  min-width: 1px;
  height: 100%;
  .right{
    position: absolute;
    top: 50%;
    margin-top: -36px;
    cursor: pointer;
    z-index: 8;
  }
}
.menu {
  position: relative;
  float: left;
  width: 220px;
  height: 100%;
  background: #1c2e3c;
  .left{
    position: absolute;
    right: -14px;
    top: 50%;
    margin-top: -36px;
    cursor: pointer;
    z-index: 8;
  }
  .menuSty {
    margin-left:33px;
  }

}
/deep/ .el-menu{
  background-color: transparent;
}
/deep/ .el-menu-item {
  color: #a7b2b6;
}
/deep/ .el-menu-item:focus, .el-menu-item:hover {
    outline: 0;
    background-color: #006172;
    color: #fff;
}
</style>
