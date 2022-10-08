// 备品备件库
<template>
  <div>
    <crud-form
      :field-list="fieldList"
      :showCheckbox="false"
      :exportFn="exportFn"
      :api="queryPage"
      :queryParam="formInline"
      ref="crudForm"
    >
      <template slot="searchBar">
        <fill-bar ref="searchBar" :queryParam="formInline" />
      </template>

      <template slot="tableOption" slot-scope="{ index, row }">
        <el-button @click="detail(row)" class="buleBTN" size="mini">详情</el-button>
        <el-button v-if="row.state === 1" @click="scrap(row.id)" class="redBTN" size="mini">报废</el-button>
      </template>
    </crud-form>

    <dialog-detail ref="dialogDetail" />
  </div>
</template>

<script>
import crudForm from "@/components/crudForm/index";
import { DICTDATA, translatorDict } from "@/api/dict";
import { queryPage } from "@/api/operation/operationSpareStore";
import fillBar from "./components/OperationSpareStore/fillBar";
import dialogDetail from "./components/OperationSpareStore/dialogDetail";
import { getSpareInfo, scrapSpare } from "@/api/operation/operationSpareStore";

export default {
  components: { fillBar, crudForm, dialogDetail },
  data() {
    var formatterSpareType = row => {
      return translatorDict(DICTDATA.SPARE_SYSTEM, row.spareType);
    };

    var formatterUnit = row => {
      return translatorDict(DICTDATA.SPARE_UNIT_TYPE, Number(row.unit));
    };

    var formatterState = row => {
      return translatorDict(DICTDATA.SPARE_STATE, row.state);
    };

    return {
      queryPage,
      fieldList: [
        { name: "类型", value: "spareType", formatter: formatterSpareType },
        { name: "厂家", value: "factName" },
        { name: "型号", value: "modelName" },
        { name: "数量", value: "spareNum" },
        { name: "单位", value: "unit", formatter: formatterUnit },
        { name: "库房", value: "houseName" },
        { name: "状态", value: "state", formatter: formatterState }
      ],
      formInline: {}
    };
  },
  methods: {
    /**
     * 详情
     */
    detail(row) {
      let dialogDetail = this.$refs.dialogDetail;
      getSpareInfo(row.id).then(res => {
        dialogDetail.spareInfor = res.data;
        dialogDetail.dialogDetailVisible = true;
      });
    },
    /**
     * 报废
     */
    scrap(id) {
      this.$prompt("确认报废吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          scrapSpare({
            id: id, // 备件标识
            scrapDesc: value
          }).then(res => {
            if (res.code === "000000") {
              this.$message({
                showClose: true,
                message: "报废成功！",
                type: "success"
              });

              // 重新查询数据
              this.$refs.crudForm.getDataInit();
            } else {
              this.$message({
                message: res.mesg,
                type: "warning"
              });
            }
          });
        })
        .catch(() => {});
    },
    /**
     * 导出
     */
    exportFn() {}
  }
};
</script>