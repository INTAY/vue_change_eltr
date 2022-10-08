<template>
  <div>
  	<!--<h1 style="font-size: 28px;">故障</h1>-->
    <crud-form
      :field-list="fieldList"
      :api="queryFault"
      :exportFn="exportAssetGarden"
      :showCheckbox="false"
      :queryParam="formInline"
      @cell-click="cellClick"
      :showColumnHandle="false"
      :columnNum='9'
      ref="crudForm"
    >
      <template slot="searchBar">
        <topform ref="topform" :queryParam="formInline" />
      </template>
      <template slot="tableTopOptionLeft">
		    <el-button class="newButtonColor btnSpace listBTN" @click="addDialogFormVisible" style="margin-left: 7px">厂家工单</el-button>
			</template>
      <!--<template slot="tableTopOptionRight">
        <el-button class="newButtonColor listBTN" plain @click="downloadExcelTem">下载模版</el-button>
        <el-button class="exportFiles" plain @click="">导出</el-button>
        <el-button class="newButtonColor listBTN" plain @click="">导出</el-button>
    	</template>-->
    </crud-form>
    <manu ref="manu"/>
    <protr ref="protr" />
  </div>
</template>

<script>
import { 
  queryFault,getFaultDetail,exportExcel_2
} from "@/api/operation/flawAfault";
import crudForm from "@/components/crudForm/index";
import topform from "./topform";
import protr from "./protr";
import { sxqxzk } from "@/api/property/stage";
import { DICTDATA, getDict, translatorDict } from "@/api/dict";
import { getRegNameByCode } from "@/utils/area";
import manu from "../manu";
export default {
	name:'flaw',
  data() {
    let statusFormat = (row) => {
      return translatorDict(DICTDATA.INFRASTRUCTURE_STATUS, Number(row.state));
    };
//  let formatDate = (row) => {
//    return formatDateTime(row.fillTime);
//  };
    let aaa = (row) => {
      return '111'
    };
    return {
      type: [],
      types: [],
      gardenData: [] ,
      regTreeData: [], //区域数据
      state: [], // 基础设施状态 200
      formInline: {},
      queryFault,
      fieldList: [
        { name: "区县", value: "reg_id" },
        { name: "站名称", value: "sta_name" },
        { name: "桩编号", value: "dev_id" },
        { name: "管理状态", value: "dev_status",},
        { name: "故障类型", value: "defit_fault_type" },
        { name: "故障工单编号", value: "id", clickable: true },
        { name: "故障工单状态", value: "state",},
        { name: "报修时间", value: "report_time" }, 
        { name: "办结时间", value: "finish_time" },
        { name: "接单时间", value: "receive_time" },
        { name: "审批状态", value: "approval_state",},
        { name: "维修状态", value: "repair_state", },
        { name: "对应缺陷工单", value: "source_id"},
        { name: "是否厂家协助", value: "is_fault_apply_fac", },
        { name: "厂单编号", value: "next_sheet_id",},
        { name: "停运编号", value: "pro_id",},
        { name: "检修单位", value: "fix_group_name",noSort:true},
        { name: "故障检修人", value: "receive_man_name",},
        { name: "申请人单位", value: "create_group_name",noSort:true},
        { name: "申请人", value: "create_man_name" },
        { name: "故障来源", value: "source_type" },
      ],
    };
  },
  components: { crudForm, topform, protr, manu },
  created() {
       if (!!this.$route.query.id) {
            this.formInline.id = this.$route.query.id;
        }
    this.init();
    getDict(DICTDATA.INFRASTRUCTURE_STATUS).then((res) => {
      this.state = res;
    });
    getDict(DICTDATA.ORDER_STATUS).then((res) => {
      this.type = res;
    });
    getDict(DICTDATA.UNIT_TYPE).then((res) => {
      this.types = res;
    });
  },
  methods: {
    cellClick(row, column, cell, event) {
      if (column.label == '故障工单编号') {
      	getFaultDetail(row.id).then(res=>{
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
    addDialogFormVisible() {
      this.$refs.manu.dialogFormVisible = true
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
        exportExcel_2(this.$refs.topform.formInline)
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

</style>
