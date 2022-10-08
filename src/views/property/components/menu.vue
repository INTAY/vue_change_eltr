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
          <i class="el-icon-coin"></i>
          <span  class="title">资产管理</span>
        </el-menu-item>

        <el-menu-item index="/property/stage">         
          <span class="menuSty">台区管理</span>
        </el-menu-item>

        <el-menu-item index="/property/transformer">         
          <span slot="title" class="menuSty">配变管理</span>
        </el-menu-item>

        <el-menu-item index="/property/garden">        
          <span slot="title" class="menuSty">园区管理</span>
        </el-menu-item>

        <el-menu-item index="/property/site">          
          <span slot="title" class="menuSty">站点管理</span>
        </el-menu-item>

         <el-menu-item index="/property/charge">          
          <span slot="title" class="menuSty">充电设备管理</span>
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
  background: #1c2e3c;
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
      .title{
    color: #56AFBE;
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
  background-color: #006172;
  color: #fff;
}

</style>
