<template>
	<!--任务制定-->
  <div class="special_tour_task">
  	<!--<h1 style="font-size: 28px;">特巡任务制定</h1>-->
    <crud-form
      :field-list="fieldList"
      :api="queryByPage"
      :exportFn="exportAssetGarden"
      :queryParam="formInline"
      @cell-click="cellClick"
      :columnNum='8'
      :showCheckbox="false"
      :showColumnHandle="false"
      ref="crudForm"
    >
      <template slot="searchBar">
        <topform ref="topform" :queryParam="formInline" />
      </template>
      <template slot="tableTopOptionLeft">
		    <erji ref="erji" />
		</template>
		<!--<template slot="tableTopOptionRight">
		    <el-button class="newButtonColor listBTN" plain @click="">下载模版</el-button>
		    <el-button class="exportFiles listBTN" plain @click="">导入文件</el-button>
		</template>-->

    </crud-form>
    <protr ref="protr" />
    <el-dialog
        title="桩信息"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :modal="true"
        :visible.sync="selectStationVisible"
        width="60%"
        class="dialogClass"
    >
        <el-table :data="infoData" style="width: 100%" :header-cell-style="{ background: '#f1f1f1', color: '#000' }">
                <el-table-column type="index" width="50" label="序号" />
                <el-table-column prop="zlFactName" label="直流充电桩厂家"  show-tooltip-when-overflow></el-table-column>
                <el-table-column prop="zlRatePower" label="直流充电桩功率" ></el-table-column>
                <el-table-column prop="zlStakeCount" label="直流充电桩数" ></el-table-column>
                <el-table-column prop="jlRatePower" label="交流充电桩功率"></el-table-column>
                <el-table-column prop="jlFactName" label="交流充电桩厂家" show-tooltip-when-overflow></el-table-column>
                <el-table-column prop="jlStakeCount" label="交流充电桩数" ></el-table-column>
        </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { queryByPage, getDetails, operationQueryDevList ,onOrderExportExcel} from '@/api/operation/planTasks';
import erji from './components/tourTask/erji';
import crudForm from "@/components/crudForm/index";
import topform from "./components/tourTask/topform";
import protr from "./components/tourTask/protr";
import { sxqxzk } from "@/api/property/stage";
import { DICTDATA, getDict, translatorDict } from "@/api/dict";
import { getRegNameByCode } from "@/utils/area";
export default {
	name:'tourTask',
  data() {
    let statusFormat = (row) => {
      return translatorDict(DICTDATA.INFRASTRUCTURE_STATUS, Number(row.state));
    };
    let formatDate = (row) => {
      return formatDateTime(row.fillTime);
    };
    let formatName = (row) => {
      if (row.stake_message) {
      	return '详情'
      }else{
      	return ""
      }
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
      formInline: {
      	taskType:'2',
      	order: "desc",
		sortColumn: "created_time",
      	},
      queryByPage,
      fieldList: [
        { name: '任务编号', value: 'id', clickable: true },
        { name: '区县', value: 'reg_id' },
        { name: '站点名称', value: 'sta_name' },
        { name: '站点地址', value: 'addr' },
        { name: '任务名称', value: 'task_name' },
        { name: '任务制定时间', value: 'created_time' },
        { name: '处理部门', value: 'org_id' },
        { name: '任务状态', value: 'state' },
        { name: '任务截止时间', value: 'deadline' },
        { name: '任务结束时间', value: 'end_date' },
        { name: '派发组织', value: 'dispatch_org_id' },
        { name: '派发人', value: 'dispatch_man_name' },
        { name: '派发日期', value: 'dispatch_time' },
        { name: '总桩数', value: 'total_stake' },
        // { name: '直流桩数', value: 'dc_stake' },
        // { name: '交流桩数', value: 'ac_stake' },
        { name: '桩信息', value: 'stake_message',type:'link',  clickable: true ,formatter:formatName,noSort:true},
        { name: '充电站运营编码', value: 'sta_oper_num' },
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
    getDict(DICTDATA.ORDER_STATUS).then((res) => {
      this.type = res;
    });
  },
  methods: {
    cellClick(row, column, cell, event) {
      if (column.label == '任务编号') {
      	this.$refs.protr.dialogFormVisible = true;
      	this.$refs.protr.states = row.state;
      	this.$refs.protr.ids = row.id;
      	let that = this;
      	if (row.state == "撤回") {
      		this.$refs.protr.sign = 2;
      	}else if (row.state == "作废"){
      		this.$refs.protr.sign = 3;
      	}
      	else{
      		this.$refs.protr.sign = 1;
      	}
      	setTimeout(function(){
      		that.$refs.protr.$refs.tasksCom.getData(row.id);
      	},50)
      }
      if (column.label == '桩信息') {
        operationQueryDevList(row.stake_message).then((res) => {
            if (res.code === '000000') {
            	this.selectStationVisible = true;
                this.infoData = res.data;
            }
        });
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

        this.$confirm('确认导出吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: ''
        }).then(() => {
            onOrderExportExcel(this.$refs.topform.formInline)
                .then((res) => {
                    if (res.code === '000000') {
                        this.$message({
                            message: '正在导出，请稍候...',
                            type: 'info'
                        });
                        let aLink = document.createElement('a');
                        aLink.href = res.data;
                        aLink.click();
                        this.$message({
                            message: res.mesg,
                            type: 'success'
                        });
                    }
                })
                .catch((res) => {
                    this.$message({
                        message: res.mesg,
                        type: 'error'
                    });
                });
        });
    }
  },
};
</script>

<style lang="scss" scoped>

</style>