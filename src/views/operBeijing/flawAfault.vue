<template>
  <div class="flaw_fault_manu">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="缺陷工单" name="first" class="panes">
    	<div>
    		<fault />
    	</div>
    </el-tab-pane>
    <el-tab-pane label="故障工单" name="second" class="panes">
    	<div>
    		<flaw />
    	</div>
    </el-tab-pane>
    <!--<el-tab-pane label="厂家工单" name="third" class="panes">
    	<div>
    		<manu />
    	</div>
    </el-tab-pane>-->
  </el-tabs>

  </div>
</template>

<script>
	import fault from "./components/fault";
	import flaw from "./components/flaw";
export default {
  name:'flawAfault',
components: { fault,flaw, },
  data() {
    return {
    	activeName: 'first',
    };
  },
  created() {
if (!!this.$route.query.id) {
	this.activeName= 'second'
}
  },
  methods: {
  	handleClick(tab) {
  		
  	}
  },
};
</script>

<style lang="scss">
	.flaw_fault_manu{
		
		padding: 8px;
		.el-tabs--card > .el-tabs__header .el-tabs__item.is-active{
			 background: #1396C2;color: white;
		}
		.el-tabs__nav{
			height: 32px;
		}
		.el-tabs__item{
			/*background: #F9F9F9;*/
			line-height: 32px;width: 150px;text-align: center;
			/*background-image: url(../../../static/img/13.png);
   			background-repeat: no-repeat;
   	 		background-size: 100%;*/
    		/*background-position: 0px 2px;*/
		}
	}
</style>

