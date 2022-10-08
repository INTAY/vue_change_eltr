<template>
  <div class="box">
    <el-dialog title="订单信息" :visible.sync="dialogVisible" width="50%" :modal-append-to-body="false">
        <el-row class="bg1">
          <el-col :span="4" :offset="2">充电开始时间</el-col>
          <el-col :span="6">{{this.mapSource.startTime}}</el-col>
          <el-col :span="4" :offset="2">充电结束时间</el-col>
          <el-col :span="6">{{this.mapSource.endTime}}</el-col>
        </el-row>
        <el-row class="bg2">
          <el-col :span="4" :offset="2">交易电量（度）</el-col>
          <el-col :span="6">{{this.mapSource.totalElecty}}</el-col>
          <el-col :span="4" :offset="2">交易电费（元）</el-col>
          <el-col :span="6">{{this.mapSource.elecAmount}}</el-col>
        </el-row>
        <el-row class="bg1">
          <el-col :span="4" :offset="2">交易服务费（元）</el-col>
          <el-col :span="6">{{this.mapSource.serviceAmount}}</el-col>
          <el-col :span="4" :offset="2">交易金额（元）</el-col>
          <el-col :span="6">{{this.mapSource.amount}}</el-col>
        </el-row>
    </el-dialog>
  </div>
</template>
<script>
    export default {
        data() {
            return {
              dialogVisible: false,
              mapSource: {}
            }
        },
        methods: {
        }
    };
</script>
<style lang="scss" scope>
  .box {
    .bg1 {
      background-color: rgb(247, 247, 247);
      padding: 10px;
    }
    .bg2 {
      background-color: rgb(235, 235, 235);
      padding: 10px;
    }
  }
  .el-dialog__body{
    padding-top: 15px !important;
  }
</style>
