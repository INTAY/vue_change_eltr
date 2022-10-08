<template>
  <div>
    <!-- 弹出层 备品备件详情 -->
    <el-dialog
      title="备品备件详情"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="dialogDetailVisible"
      width="960px"
    >
      <el-form :inline="true" :model="spareInfor" class="infor-form" label-width="120px">
        <el-row type="flex" justify="start" align="middle" class="rowbg2">
          <el-col :span="8">
            <el-form-item label="备品备件编号">{{spareInfor.id}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="备品备件类型"
            >{{translatorDict(DICTDATA.SPARE_SYSTEM, spareInfor.spareType)}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备品备件厂家">{{spareInfor.factName}}</el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="start" align="middle" class="rowbg">
          <el-col :span="8">
            <el-form-item label="备品备件型号">{{spareInfor.modelName}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数量">{{spareInfor.spareNum}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="单位"
            >{{translatorDict(DICTDATA.SPARE_UNIT_TYPE, Number(spareInfor.unit))}}</el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="start" align="middle" class="rowbg2">
          <el-col :span="8">
            <el-form-item label="资产编号">{{spareInfor.assetNo}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保质期">{{formatDate("YYYY-mm-dd", spareInfor.expireDate)}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库">{{spareInfor.houseName}}</el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="start" align="middle" class="rowbg">
          <el-col :span="8">
            <el-form-item label="易耗品">{{translatorDict(DICTDATA.WHETHER, spareInfor.consumable)}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">{{translatorDict(DICTDATA.SPARE_STATE, spareInfor.state)}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购价格(元)">{{spareInfor.price}}</el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="start" align="middle" class="rowbg2">
          <el-col :span="8">
            <el-form-item
              label="入库类型"
            >{{translatorDict(DICTDATA.SPARE_IMPORT_TYPE, spareInfor.importType)}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源名称">{{spareInfor.planName}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库时间">{{formatDate("YYYY-mm-dd HH:MM:SS", spareInfor.importTime)}}</el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="start" align="middle" class="rowbg">
          <el-col :span="8">
            <el-form-item label="出库申请单编号">{{spareInfor.exportId}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出库申请单名称">{{spareInfor.exportName}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出库时间">{{formatDate("YYYY-mm-dd HH:MM:SS", spareInfor.exportTime)}}</el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="start" align="middle" class="rowbg2">
          <el-col :span="8">
            <el-form-item label="安装工单编号">{{spareInfor.installId}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安装设备编号">{{spareInfor.installDevId}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安装时间">{{formatDate("YYYY-mm-dd HH:MM:SS", spareInfor.installTime)}}</el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="start" align="middle" class="rowbg">
          <el-col :span="8">
            <el-form-item label="报废时间">{{formatDate("YYYY-mm-dd HH:MM:SS", spareInfor.scrapTime)}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报废人">{{spareInfor.scrapManName}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报废描述">{{spareInfor.scrapDesc}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { DICTDATA, translatorDict } from "@/api/dict";
import { formatDate } from "@/utils/DateFormat";

export default {
  data() {
    return {
      DICTDATA,
      translatorDict,
      formatDate,
      dialogDetailVisible: false,
      spareInfor: {}
    };
  },
  mounted() {},
  methods: {
    
  }
};
</script>

<style lang="scss" scoped>
.rowbg {
  padding: 10px;
  height: 40px;
}
.rowbg2 {
  @extend .rowbg;
  background-color: #f7f7f7;
}

.infor-form {
  >>> .el-form-item {
    margin-bottom: 0;
  }
  >>> .el-form-item__label {
    color: #909090;
  }
  >>> .el-form-item__content {
    color: #232323;
  }
}
</style>