//选择框栏
<template>
  <div class="t">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="运维组名称" v-model="formInline.name">
        <el-input size="mini" placeholder="请输入运维组名称" class="inputWidth"></el-input>
      </el-form-item>

      <el-form-item label="组织机构" class="interval">
        <el-select size="mini" v-model="formInline.organization" placeholder="请输入组织机构" class="selectWidth">
          <el-option label="全部" value="1"></el-option>
          <el-option label="部门1" value="2"></el-option>
          <el-option label="部门2" value="3"></el-option>
          <el-option label="部门3" value="4"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" class="interval">
        <el-select size="mini" v-model="formInline.stauts" placeholder="全部" class="selectWidth">
          <el-option label="正启用" value="7"></el-option>
          <el-option label="已停用" value="8"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="选择时间" class="interval">
        <el-date-picker
          size="mini"
          v-model="formInline.datatime"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="timeWidth"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button size="small" class="searchColor" @click="onSubmit()">查询</el-button>
        <el-button size="small" class="emptyColor" @click="empty()">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: "",
      value2: "",
      formInline: {}
    };
  },
  methods: {
    onSubmit() {}, //查询按钮
    empty() {},  //清空按钮

  }
};
</script>

<style lang="scss" scoped>
.t {
  padding-top: 16px;
  padding-left: 20px;
  border-bottom: 1px solid #eeeeee;
  background: #fcfcfc;
  .inputWidth {
    //input框的长度
    width: 135px;
  }
  .selectWidth { //selct选择框长度
    width: 100px;
  }
  .timeWidth {  //时间选择框
    width: 220px;
  }
  .searchColor {
    //查询按钮的背景颜色和字体颜色
    background-color: #006080;
    color: #fff;
  }
  .emptyColor {
    color: #006080;
  }
  .interval {  //表单之间的间隔
     padding-left: 40px;
  }
}
</style>