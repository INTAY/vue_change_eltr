<template>
	<div>
	<el-dialog
          title="厂家工单"
          :visible.sync="dialogFormVisible"
          top="8%"
          width="1050px"
          :modal-append-to-body="false"
          :close-on-click-modal="false"
        >
        <div class="flaw_fault_manu_fix_zky">
        	<crud-form
		      :field-list="fieldList"
		      :api="queryFact"
		      :exportFn="exportAssetGarden"
		      :showCheckbox="false"
		      :queryParam="formInline"
		      @cell-click="cellClick"
		      :showColumnHandle="false"
		      :columnNum='10'
		      ref="crudForm"
		    >
		      <template slot="searchBar">
		        <topform ref="topform" :queryParam="formInline" />
		      </template>
		    </crud-form>
        </div>
    
    </el-dialog>
    <protr ref="protr" />
    </div>
</template>

<script>
import { 
  queryFact,getFaultDetail,exportExcel_3
} from "@/api/operation/flawAfault";
import crudForm from "@/components/crudForm/index";
import topform from "./topform";
import protr from "./protr";
import { sxqxzk } from "@/api/property/stage";
import { DICTDATA, getDict, translatorDict } from "@/api/dict";
import { getRegNameByCode } from "@/utils/area";
export default {
	name:'manu',
  data() {
    let statusFormat = (row) => {
      return translatorDict(DICTDATA.INFRASTRUCTURE_STATUS, Number(row.state));
    };
    let formatDate = (row) => {
      return formatDateTime(row.fillTime);
    };
    let aaa = (row) => {
      return 'aaa'
    };
    return {
      // cellClickName:"自定义",
      type: [],
      gardenData: [],
      regTreeData: [], //区域数据
      state: [], // 基础设施状态 200
      formInline: {},
      queryFact,
      dialogFormVisible:false,
      fieldList: [
        { name: "厂单编号", value: "id" },
        { name: "厂家名称", value: "fac_name" },
        { name: "故障单号", value: "source_id", clickable: true },
        { name: "故障原因", value: "descr" },
        { name: "是否维修", value: "repair_state",},
        { name: "审批状态", value: "approval_state",},
        { name: "工单创建时间", value: "create_time" },
        { name: "工单开始时间", value: "dispatch_time" },
        { name: "工单结束时间", value: "finish_time" },
      ],
    };
  },
  components: { crudForm, topform, protr,  },
  created() {
    this.init();
    getDict(DICTDATA.INFRASTRUCTURE_STATUS).then((res) => {
      this.state = res;
    });
    getDict(DICTDATA.APPROVE_STATUS).then((res) => {
      this.type = res;
    });
  },
  methods: {
    cellClick(row, column, cell, event) {
      if (column.label == '故障单号') {
      	getFaultDetail(row.source_id).then(res=>{
      		this.$refs.protr.dialogFormVisible = true;
      		this.$refs.protr.inits(row.source_id);
      		this.$refs.protr.datas = res.data;
      		this.$refs.protr.cities = res.data.docUrls;
      	})
      }

    },
    init() {
      this.queryRegTree().then(() => {
        this.$refs.topform.setData();
      });
    },

    //地区数据查询，翻译使用
    queryRegTree() {
      return new Promise((resolve, reject) => {
        sxqxzk().then((res) => {
          this.regTreeData = this.getTreeData(res.data.children);
          resolve();
        });
      });
    },
    // 递归判断列表，把最后的children设为undefined
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },

    //导出
    exportAssetGarden() {
      this.$refs.crudForm.queryParam = this.$refs.topform.formInline;
      this.$refs.crudForm.getDataInit();
      this.$refs.topform.formInline.headers = this.$refs.crudForm.exportData.headers;
      this.$refs.topform.formInline.values = this.$refs.crudForm.exportData.values;
      this.$confirm("确认导出吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
        confirmButtonClass: "messagebox-button",
        cancelButtonClass: "messagebox-button",
      }).then(() => {
        exportExcel_3(this.$refs.topform.formInline)
          .then((res) => {
            if (res.code === "000000") {
              this.$message({
                message: "正在导出，请稍候...",
                type: "info",
              });
              let aLink = document.createElement("a");
              aLink.href = res.data;
              aLink.click();
              this.$message({
                message: res.mesg,
                type: "success",
              });
            }
          })
          .catch((res) => {
            this.$message({
              message: res.mesg,
              type: "error",
            });
          });
      });
    },
  },
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

/deep/ .table-top-option-wrap {
  margin: 0 !important;
}
/deep/ .table-top-option-wrap .right {
  margin: 11px 15px 0 0;
}
/deep/ .el-table {
  margin-top: 7px !important;
}
/deep/ .el-input-group__append {
  padding: 0 30px;
}
</style>

<style>
	.flaw_fault_manu_fix_zky .page-wrap-fixed {
position: absolute ; 
width: 95%;
}
</style>
