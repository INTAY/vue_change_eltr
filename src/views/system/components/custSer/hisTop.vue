<template>
	<el-dialog
      title="Top5充电站"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="900px"
    >
    <section class="scroll_section_dio_zky_top">
    	<crud-form
    		:showIndex="false"
    		:showIndex_="true"
    		:showColumnSetting="false"
    		:showCheckbox="false"
	      :field-list="fieldList"
	      :exportFn="exportFn"
	      :api="getTop"
	      :showCellClick="false"
	      :queryParam="forminline"
	      tableOptionName="站地址"
	      tableOptionWidth="100"
	      ref="crudForm"
	    >
	
	      <template slot="tableOption" slot-scope="{ index, row }">
	      	{{row.address}}
	      </template>
	      
	    </crud-form>
	</section>
	    </el-dialog>
</template>

<script>
	import crudForm from "@/components/crudForm/index";
	import {
		  getTop,
		} from "@/api/system/cust";	
	export default {
		components:{crudForm},
		data() {
			return {
				dialogFormVisible:false,
				forminline:{
					
				},
		       getTop,
		       fieldList: [
		        { name: "区县", value: "region" },
		        { name: "充电站名称", value: "stationName" },
		        { name: "站编号", value: "stationNo" },
		        { name: "站内桩数", value: "stakeCount" },
		        { name: "充电次数", value: "chargeCount", },
		      ],
			};
		},
		created() {
			
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
  .scroll_section_dio_zky_top{
  	.search-wrap{display: none;}
  	.table-top-option-wrap{display: none;}
  	.page-wrap-fixed{position: absolute;bottom: 1px;width: 850px !important;}
  	height: 520px;overflow: auto;
  }
</style>