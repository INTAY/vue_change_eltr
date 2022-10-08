//选择框栏
<template>
  <div class="t">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">

      <el-form-item label="组织机构">
        <el-select size="mini" v-model="formInline.organization" placeholder="请输入组织机构" class="selectWidth">
          <el-option label="全部" value="1"></el-option>
          <el-option label="机构A" value="2"></el-option>
          <el-option label="机构B" value="3"></el-option>
          <el-option label="机构C" value="4"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" class="interval">
        <el-select size="mini" v-model="formInline.stauts" placeholder="全部" class="selectWidth">
          <el-option label="待确认" value="7"></el-option>
          <el-option label="已确认" value="8"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="来源" class="interval">
        <el-select size="mini" v-model="formInline.source" placeholder="全部" class="selectWidth">
          <el-option label="人工报修" value="10"></el-option>
          <el-option label="检修" value="11"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="上报人" class="interval">
        <el-select size="mini" v-model="formInline.reporter" placeholder="全部" class="selectWidth">
          <el-option label="张三" value="5"></el-option>
          <el-option label="李四" value="6"></el-option>
          <el-option label="张武" value="9"></el-option>
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
    padding-left: 30px;
  }
}
</style>