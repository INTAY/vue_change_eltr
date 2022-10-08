<template>
  <div class="paddingLeft">
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#f1f1f1',color:'#000'}"
      stripe
      style="width: 100%"
    >
      <el-table-column type="index" width="50" align="center"></el-table-column>

      <el-table-column label="来源" prop="Identification" align="center"></el-table-column>

      <el-table-column label="组织机构" prop="Organization" align="center"></el-table-column>

      <el-table-column label="状态" prop="status" align="center"></el-table-column>

      <el-table-column label="上报人" prop="reporter" align="center"></el-table-column>

      <el-table-column label="上报人联系方式" prop="information" align="center"></el-table-column>

      <el-table-column label="故障缺陷发生时间" prop="time" align="center"></el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template>
          <el-button type="text" size="small">确认</el-button>
          <el-button type="text" size="small">详情</el-button>
          <el-button @click="dialogFormVisible = true" type="text" size="small">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isStop: false,
      isStart: false,
      tableData: [
        {
          Identification: "123655655",
          Organization: "机构A",
          status: "正启用",
          reporter: '孔啊',
          information: '135885522885',
          time: "2019-10-10"
        },
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.paddingLeft {  //全局布局
  padding-left: 20px;
}
</style>