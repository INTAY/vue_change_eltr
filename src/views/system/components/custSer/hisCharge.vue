<template>
	<el-dialog
      title="历史充电详情"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="1050px"
    >
    <section class="scroll_section_dio_zky_char">
    	<div style="margin-left:20px;line-height: 30px;">充电数量:{{tols}}</div>
    	<!--:columnNum="12"-->
    	<crud-form
    		:showIndex="false"
    		:showIndex_="true"
    		:showColumnSetting="false"
    		:showCheckbox="false"
	      :field-list="fieldList"
	      :exportFn="exportFn"
	      :api="getHis"
	      :queryParam="forminline"
	      tableOptionName="支付方式"
	      tableOptionWidth="100"
	      ref="crudForm"
	    >
	
	      <template slot="tableOption" slot-scope="{ index, row }">
	      	{{row.payMode}}
	      </template>
	      
	    </crud-form>
	</section>
	    </el-dialog>
</template>

<script>
	import crudForm from "@/components/crudForm/index";
	import {
		  getHis,
		} from "@/api/system/cust";	
	export default {
		components:{crudForm},
		data() {
			return {
				dialogFormVisible:false,
				tols:'',
				forminline:{
					
				},
		       getHis,
		       fieldList: [
		        { name: "区县", value: "region" },
		        { name: "充电站名称", value: "stationName" },
		        { name: "充电类型", value: "chargeType" },
		        { name: "充电开始时间", value: "startTime" },
		        { name: "充电结束时间", value: "endTime", },
		        { name: "充电时长", value: "delay", },
		        { name: "充电电量", value: "electy", },
		        { name: "充电金额", value: "amount", },
		        { name: "服务费", value: "serviceAmount", },
		      ],
			};
		},
		created() {
			getHis().then(res=>{
				this.tols = res.data.total;
			})
		},
		mounted(){
		},
		methods:{
			init(){
				this.forminline = {}
				this.$refs.crudForm.getDataInit()
				this.tols = this.$refs.crudForm.listInfo.pageTotal
			},
			exportFn(){
				
			}
		}
	}
</script>

<style lang="scss">
  .scroll_section_dio_zky_char{
  	.search-wrap{display: none;}
  	.page-wrap-fixed{position: absolute;bottom: 1px;width: 1000px !important;}
  	height: 520px;overflow: auto;
  }
</style>