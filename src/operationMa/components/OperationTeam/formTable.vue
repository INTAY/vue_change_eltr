<template>
  <div class="paddingLeft">
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#f1f1f1',color:'#000'}"
      stripe
      style="width: 100%"
    >
      <el-table-column type="index" width="50" align="center"></el-table-column>

      <el-table-column type="selection" width="55" align="center"></el-table-column>

      <el-table-column label="运维组标识" prop="Identification" align="center"></el-table-column>

      <el-table-column label="运维组名称" prop="name" align="center"></el-table-column>

      <el-table-column label="组长" prop="leader" align="center"></el-table-column>

      <el-table-column label="组织机构" prop="Organization" align="center"></el-table-column>

      <el-table-column label="状态" prop="status" align="center"></el-table-column>

      <el-table-column label="运维内容" prop="content" align="center"></el-table-column>

      <el-table-column label="成立时间" prop="time" align="center" ></el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template>
          <el-button @click=" xiangqing= true " type="text" size="small">详情</el-button>
          <el-button @click="dialogFormVisible = true" type="text" size="small">修改</el-button>
          <el-button type="text" size="small" v-if="isStop">解散</el-button>
          <el-button type="text" size="small" v-if="isStart">启用</el-button>
          <el-button type="text" size="small">删除</el-button>
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
          name: "运维组A",
          leader: "张三",
          Organization: "机构A",
          status: "正启用",
          content: "维护电力",
          time: "2019-10-10"
        },
        {
          Identification: "123655655",
          name: "运维组A",
          leader: "张三",
          Organization: "机构A",
          status: "正启用",
          content: "维护电力",
          time: "2019-10-10"
        },
        {
          Identification: "123655655",
          name: "运维组A",
          leader: "张三",
          Organization: "机构A",
          status: "正启用",
          content: "维护电力",
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