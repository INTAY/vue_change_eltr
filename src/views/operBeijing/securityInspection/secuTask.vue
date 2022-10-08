<template>
	<!--任务制定-->
  <div class="secu_work_task">
  	<!--<h1 style="font-size: 28px;">安防任务制定</h1>-->
    <crud-form
      :field-list="fieldList"
      :api="queryByPage"
      :exportFn="exportAssetGarden"
      :queryParam="formInline"
      @cell-click="cellClick"
      :columnNum='8'
      :showCheckbox = "false"
      :showColumnHandle="false"
      ref="crudForm"
    >
      <template slot="searchBar">
        <topform ref="topform" :queryParam="formInline" />
      </template>
      <template slot="tableTopOptionLeft">
		    <erji ref="erji" />
		</template>
		<template slot="tableTopOptionRight">
		    <el-button class="newButtonColor listBTN" plain @click="">下载模版</el-button>
		    <el-button class="exportFiles listBTN" plain @click="">导入文件</el-button>
		</template>

    </crud-form>
    <protr ref="protr" />
  </div>
</template>

<script>
import { queryByPage, getDetails, operationQueryDevList } from '@/api/operation/planTasks';
import erji from './components/secuTask/erji';
import crudForm from "@/components/crudForm/index";
import topform from "./components/secuTask/topform";
import protr from "./components/secuTask/protr";
import { sxqxzk } from "@/api/property/stage";
import { DICTDATA, getDict, translatorDict } from "@/api/dict";
import { getRegNameByCode } from "@/utils/area";
export default {
	name:'secuTask',
  data() {
    let statusFormat = (row) => {
      return translatorDict(DICTDATA.INFRASTRUCTURE_STATUS, Number(row.state));
    };
    let formatDate = (row) => {
      return formatDateTime(row.fillTime);
    };
    let parkTypeFormat = (row) => {
      return '占位';
    };
    return {
      // cellClickName:"自定义",
      type: [],
      gardenData: [] ,
      regTreeData: [], //区域数据
      state: [], // 基础设施状态 200
      formInline: {taskType:'2'}, 
      queryByPage,
      fieldList: [
        { name: '任务编号', value: 'id', clickable: true },
        { name: '区县', value: 'reg_id' },
        { name: '站点名称', value: 'sta_name' },
        { name: '站点地址', value: 'addr' },
        { name: '任务名称', value: 'task_name' },
        { name: '任务开始时间', value: 'created_time' },
        { name: '任务结束时间', value: 'created_time' },
        { name: '任务创建人', value: 'apply_man_name' },
        { name: '处理部门', value: 'org_id' },
        { name: '周期', value: 'period' },
        { name: '频率', value: 'freq' },
        { name: '总桩数', value: 'optTime' },
        { name: '直流充电桩数', value: 'link' },
        { name: '交流充电桩数', value: 'tel' },
        { name: '桩信息', value: 'sta_id', clickable: true },
        { name: '完成度', value: 'org_id' },
        { name: '特巡对象', value: 'org_id' },
        { name: '特巡工单状态', value: 'state' },
        { name: '工单持续时间', value: 'evnet_status' },
      ],
      selectStationVisible:false,
      infoData:[],
    };
  },
  components: { crudForm, topform, protr,erji },
  created() {
    this.init();
    getDict(DICTDATA.INFRASTRUCTURE_STATUS).then((res) => {
      this.state = res;
    });
    getDict(DICTDATA.PARK_TYPE).then((res) => {
      this.type = res;
    });
  },
  methods: {
    cellClick(row, column, cell, event) {
      if (column.label == '任务编号') {
      	this.$refs.protr.dialogFormVisible = true;
      	let that = this;
      	setTimeout(function(){
      		that.$refs.protr.$refs.tasksCom.getData(row.id);
      	},50)
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
//    this.$refs.crudForm.queryParam = this.$refs.topform.formInline;
//    this.$refs.crudForm.getDataInit();
//    this.$refs.topform.formInline.headers = this.$refs.crudForm.exportData.headers;
//    this.$refs.topform.formInline.values = this.$refs.crudForm.exportData.values;
//    this.$confirm("确认导出吗?", {
//      confirmButtonText: "确定",
//      cancelButtonText: "取消",
//      type: "",
//    }).then(() => {
//      exportZone(this.$refs.topform.formInline)
//        .then((res) => {
//          if (res.code === "000000") {
//            this.$message({
//              message: "正在导出，请稍候...",
//              type: "info",
//            });
//            let aLink = document.createElement("a");
//            aLink.href = res.data;
//            aLink.click();
//            this.$message({
//              message: res.mesg,
//              type: "success",
//            });
//          }
//        })
//        .catch((res) => {
//          this.$message({
//            message: res.mesg,
//            type: "error",
//          });
//        });
//    });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
