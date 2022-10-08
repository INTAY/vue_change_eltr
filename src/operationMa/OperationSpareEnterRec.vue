<template>
  <div>
    <crud-form :field-list="fieldList" :api="queryByPage" :queryParam="formInline" ref="crudForm">
      <template slot="searchBar">
        <fill-bar ref="fillBar" />
      </template>

      <template slot="tableTopOptionLeft">
        <push-button ref="tableOperation" />
      </template>
      <template slot="tableOption" slot-scope="scope">
        <el-button @click="detail(scope.row)" class="buleBTN" size="mini">详情</el-button>
      </template>
    </crud-form>
    <dialog-detail ref="dialogDetail" />
  </div>
</template>

<script>
import crudForm from "@/components/crudForm/index";
import {
  queryByPage,
  getDetails,
  spareInfoQueryByPage,
  formatDateTime
} from "@/api/operation/OperationSpareEnterRec";
import { DICTDATA, getDict, translatorDict } from "@/api/dict";
import dialogDetail from "./components/OperationSpareEnterRec/dialogDetail";
import fillBar from "./components/OperationSpareEnterRec/fillBar"; //引入formInput框栏
import pushButton from "./components/OperationSpareEnterRec/pushButton"; //引入点击按钮模块
export default {
  data() {
    let formatterState = row => {
      return translatorDict(DICTDATA.UNIT_TYPE, Number(row.state));
    };
    let formatDate = row => {
      return formatDateTime(row.fillTime);
    };
    let formatterSpareType = row => {
      return translatorDict(DICTDATA.SPARE_SYSTEM, Number(row.spareType));
    };
    return {
      regTreeData: [], //区域数据
      formInline: {},
      queryByPage,
      fieldList: [
        {
          name: "备品备件类型",
          value: "spareType",
          formatter: formatterSpareType
        },
        { name: "备品备件厂家", value: "factName" },
        { name: "备品备件型号", value: "modelId" },
        { name: "数量", value: "devNum" },
        { name: "单位", value: "unit" },
        { name: "库房", value: "houseName" },
        { name: "入库时间", value: "fillTime", formatter: formatDate }
      ],
      translate: {}
    };
  },
  components: {
    crudForm,
    fillBar, // fromInput框
    pushButton, //点击按钮模块
    dialogDetail
  },
  created() {},
  mounted() {

  },
  methods: {

    //详情
    /**
     * 查看详情
     */
    detail(row) {
      let dialogDetail = this.$refs.dialogDetail;
      dialogDetail.formInline = {};
      dialogDetail.tableData = [];
      dialogDetail.rowId = row.id;
      dialogDetail.dialogDetailVisible = true;
      getDetails(row.id).then(res => {
        dialogDetail.formInline = res.data;
        dialogDetail.formInline.sourceType = translatorDict(
          DICTDATA.SPARE_IMPORT_TYPE,
          Number(row.sourceType)
        );
        dialogDetail.formInline.state = translatorDict(
          DICTDATA.SPARE_OUT_APPROVE_STATUS,
          Number(row.state)
        );
      });
      this.spareInfoQueryByPage({ id: row.id })

    },
    spareInfoQueryByPage(data) {     
      spareInfoQueryByPage(data).then(res => {
         let dia = this.$refs.dialogDetail;
        dia.tableData = res.data.records;
        dia.pageData = {
          total: res.data.total,
          current: res.data.current,
          pageSize: res.data.size
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.default-class {
  width: 100%;
  height: 100%;
  .list {
    height: 100%;
    overflow-y: auto;
    padding: 20px;
    box-sizing: border-box;
  }
}
</style>
