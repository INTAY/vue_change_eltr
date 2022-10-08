<template>
  <div class="_falut_">
  	<!--<h1 style="font-size: 28px;">缺陷</h1>-->
    <crud-form
      :field-list="fieldList"
      :api="queryDefit"
      :exportFn="exportAssetGarden"
      :showCheckbox="false"
      :queryParam="formInline"
      @cell-click="cellClick"
      :columnNum='9'
      :showColumnHandle="false"
      ref="crudForm"
    >
      <template slot="searchBar">
        <topform ref="topform" :queryParam="formInline" />
      </template>
      <!--<template slot="tableTopOptionRight">
        <el-button class="newButtonColor listBTN" plain @click="downloadExcelTem">下载模版</el-button>
        <el-button class="exportFiles" plain @click="">导出</el-button>
        <el-button class="newButtonColor listBTN" plain @click="">导出</el-button>
    	</template>-->

    </crud-form>
    <protr ref="protr" />
  </div>
</template>

<script>
import { 
  queryDefit,getDefitDetail,exportExcel_1
} from "@/api/operation/flawAfault";
import crudForm from "@/components/crudForm/index";
import topform from "./topform";
import protr from "./protr";
import { sxqxzk } from "@/api/property/stage";
import { DICTDATA, getDict, translatorDict } from "@/api/dict";
import { getRegNameByCode } from "@/utils/area";
export default {
	name:'fault',
  data() {
    let statusFormat = (row) => {
      return translatorDict(DICTDATA.INFRASTRUCTURE_STATUS, Number(row.state));
    };
    let formatDate = (row) => {
      return formatDateTime(row.fillTime);
    };
    let prov = (row) => {
      return '占位'
    };
    return {
      // cellClickName:"自定义",
      type: [],
      gardenData: [] ,
      regTreeData: [], //区域数据
      state: [], // 基础设施状态 200
      formInline: {},
      queryDefit,
      fieldList: [
        { name: "区县", value: "reg_id" },
        { name: "站名称", value: "sta_name" },
        { name: "桩编号", value: "dev_id" },
        { name: "缺陷工单编号", value: "id", clickable: true },
        { name: "缺陷工单状态", value: "state",},
        { name: "报修时间", value: "report_time" },
        { name: "办结时间", value: "finish_time" },
        { name: "维修状态", value: "repair_state",},
        { name: "申请人", value: "create_man_name" },
        
        { name: "管理状态", value: "dev_status",},
        { name: "处理单位", value: "group_name" },
        { name: "接单时间", value: "receive_time" },
        { name: "审批状态", value: "approval_state",},
        { name: "对应工单", value: "source_id", clickable: true },
        
      ],
    };
  },
  components: { crudForm, topform, protr,  },
  created() {
    this.init();
    getDict(DICTDATA.INFRASTRUCTURE_STATUS).then((res) => {
      this.state = res;
    });
    getDict(DICTDATA.ORDER_STATUS).then((res) => {
      this.type = res;
    });
  },
  methods: {
    cellClick(row, column, cell, event) {
      if (column.label == '缺陷工单编号') {
      	getDefitDetail(row.id).then(res=>{
      		this.$refs.protr.dialogFormVisible = true;
      		this.$refs.protr.inits(row.id);
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
      	
        exportExcel_1(this.$refs.topform.formInline)
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

<style>
	._falut_ .page-wrap-fixed {
width: 95% !important;
}
</style>
