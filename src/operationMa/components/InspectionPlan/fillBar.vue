<template>
  <div class="t">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="任务名称" v-model="formInline.name">
        <el-input size="mini" placeholder="请输入任务名称" class="inputWidth"></el-input>
      </el-form-item>

      <el-form-item label="任务类型">
        <el-select size="mini" v-model="formInline.type" placeholder="全部" class="selectWidth">
          <el-option v-for="item in inspectType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态">
        <el-select size="mini" v-model="formInline.stauts" placeholder="全部" class="selectWidth">
          <el-option label="已保存" value="1"></el-option>
          <el-option label="待审核" value="2"></el-option>
          <el-option label="已审核未下发" value="3"></el-option>
          <el-option label="已下发" value="4"></el-option>
        </el-select>
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
      formInline: {},
      inspectType: [
        {value: "", label: "请选择"},
        {value: "1", label: "计划巡视"},
        {value: "2", label: "特殊巡视"},
        {value: "3", label: "周期保养"},
        {value: "4", label: "巡视检查"}
      ]
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
    width: 160px;
  }
  .searchColor {
    //查询按钮的背景颜色和字体颜色
    background-color: #006080;
    color: #fff;
  }
  .emptyColor { //清空按钮字体颜色
    color: #006080;
  }
  .interval {  //表单之间的间隔
     padding-left: 40px;
  }
}
</style>