<template>
  <div class="leftMenu">
    <img src="../../../assets/image/right.png" alt v-show="!current" class="right" @click="menu" />

    <div class="menu" v-show="current">
      <img src="../../../assets/image/left.png" alt v-show="current" class="left" @click="menu" />
      <el-menu
        default-active="index"
        :router="true"
        class="el-menu-vertical-demo"
        @select="handelSeelct"
      >
        <el-menu-item>
          <i class="el-icon-s-tools"></i>
          <span class="title">系统管理</span>
        </el-menu-item>

        <el-menu-item index="/system/environment">
          <span class="menuSty" >环境信息</span>
        </el-menu-item>

        <el-menu-item index="/system/picture">
          <span slot="title" class="menuSty" >图片管理</span>
        </el-menu-item>

        <el-menu-item index="/system/production">
          <span slot="title" class="menuSty" >生产厂家</span>
        </el-menu-item>

        <el-menu-item index="/system/type">
          <span slot="title" class="menuSty" >设备型号</span>
        </el-menu-item>

        <el-menu-item index="/system/dict">
          <span slot="title" class="menuSty" >字典管理</span>
        </el-menu-item>

        <el-menu-item index="/system/inspectlib">
          <span slot="title" class="menuSty" >运维预案库</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      current: true,
      dynamicTags: [],
      isTag: true
    };
  },
  methods: {
    handelSeelct() {
    },
    menu() {
      this.current = !this.current;
      this.$emit("change", this.current);
    },
  
    
  }
};
</script> 

<style lang="scss" scoped>
.leftMenu {
  position: relative;
  float: left;
  min-width: 1px;
  height: 100%;
  .right {
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
  background: #1c2e3c !important;
  .left {
    position: absolute;
    right: -14px;
    top: 50%;
    margin-top: -36px;
    cursor: pointer;
    z-index: 8;
  }
  .menuSty {
    margin-left: 33px;
  }
  .title {
    color: #56afbe !important;
  }
}
/deep/ .el-menu {
  background-color: transparent;
}
/deep/ .el-menu-item {
  color: #a7b2b6;
}
/deep/ .el-menu-item:focus,
.el-menu-item:hover {
  outline: 0;
  background-color: #006172 !important;
  color: #fff !important;
}
</style>
