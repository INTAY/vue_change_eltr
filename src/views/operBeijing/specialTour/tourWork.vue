<template>
	<!--任务制定-->
  <div class="special_tour_work">
  	<!--<h1 style="font-size: 28px;">特巡工单处理</h1>-->
    <crud-form
      :field-list="fieldList"
      :api="workSheetBjQuery"
      :exportFn="exportAssetGarden"
      :queryParam="formInline"
      @cell-click="cellClick"
      :columnNum='9'
      :showCheckbox="false"
      :showColumnHandle="false"
      ref="crudForm"
    >
      <template slot="searchBar">
        <topform ref="topform" :queryParam="formInline" />
      </template>

    </crud-form>
    <protr ref="protr" />
  </div>
</template>

<script>
import { workSheetBjQuery,onOrderExportExcel } from '@/api/operation/planTasks';
import crudForm from "@/components/crudForm/index";
import topform from "./components/tourWork/topform";
import protr from "./components/tourWork/protr";
import { sxqxzk } from "@/api/property/stage";
import { DICTDATA, getDict, translatorDict } from "@/api/dict";
import Bus from '@/components/bus.js'
import { getRegNameByCode } from "@/utils/area";
export default {
	name:'tourWork',
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
      ruleForm:{},
      type: [],
      gardenData: [] ,
      regTreeData: [], //区域数据
      state: [], // 基础设施状态 200
      formInline: {sheetType:'6',},
      workSheetBjQuery,
      fieldList: [
        { name: '工单编号', value: 'id', clickable: true },
        { name: '区县', value: 'reg_id' },
        { name: '站点名称', value: 'sta_name'},
        { name: '站地址', value: 'addr'},
        { name: '任务名称', value: 'sheet_info'},
        { name: '完成度', value: 'percent' },
        { name: '处理部门', value: 'group_name' },
        { name: '特巡工单状态', value: 'state' },
        { name: '工单持续时间', value: 'duration',noSort:true },


        { name: '任务编号', value: 'source_id' },
        { name: '工单开始时间', value: 'circle_start' },
        { name: '工单结束时间', value: 'circel_end' },
        { name: '检查人', value: 'group_name' },
        { name: '特巡对象', value: 'txObj' ,noSort:true},
        
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
      if (column.label == '工单编号') {
      	this.$refs.protr.dialogFormVisible = true;
      	this.$refs.protr.inits(row.id);
      	this.$nextTick(function () {
            Bus.$emit('sendSourceId',row.source_id)
            Bus.$emit('sendOrderId',row.id)
        })
      	let that = this;
      	setTimeout(function(){
      		that.$refs.protr.$refs.tasksCom.getData(row.source_id);
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