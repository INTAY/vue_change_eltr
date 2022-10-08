<template>
	<el-dialog
      title="历史报修详情"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="900px"
    >
    <section class="scroll_section_dio_zky_rep">
    	<div style="margin-left:20px;line-height: 30px;">工单数量:{{tols}}</div>
	        	
    	<crud-form
    		:showIndex="false"
    		:showIndex_="true"
    		:showColumnSetting="false"
    		:showCheckbox="false"
	      :field-list="fieldList"
	      :exportFn="exportFn"
	      :api="getRep"
	      :queryParam="forminline"
	      tableOptionName="办结单位"
	      tableOptionWidth="100"
	      ref="crudForm"
	    >
	
	      <template slot="tableOption" slot-scope="{ index, row }">
	      	{{row.org}}
	      </template>
	      
	    </crud-form>
	</section>
	    </el-dialog>
</template>

<script>
	import crudForm from "@/components/crudForm/index";
	import {
		  getRep,
		} from "@/api/system/cust";
	export default {
		components:{crudForm},
		data() {
			return {
				dialogFormVisible:false,
				tols:'',
				forminline:{
					
				},
		       getRep,
		       fieldList: [
		        { name: "区县", value: "region" },
		        { name: "工单编号", value: "orderId" },
		        { name: "业务类型", value: "bussType" },
		        { name: "派发时间", value: "distributeTime", },
		        { name: "办结时间", value: "finishTime" },
		        { name: "处理时长", value: "delay" },
		        { name: "当前状态", value: "state" },
		        { name: "受理内容", value: "content" },
		        
//		        { name: "定时生成", value: "timing",width:200,formatter: formatterTime, showOverflowTooltip: true },
		      ],
			};
		},
		created() {
			getRep().then(res=>{
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
  .scroll_section_dio_zky_rep{
  	.search-wrap{display: none;}
  	.page-wrap-fixed{position: absolute;bottom: 1px;width: 850px !important;}
  	height: 520px;overflow: auto;
  }
</style>