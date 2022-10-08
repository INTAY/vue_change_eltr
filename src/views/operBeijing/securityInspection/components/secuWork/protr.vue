<template>       
   <div class="protr">
        <el-dialog
          title="特巡工单详情"
          :visible.sync="dialogFormVisible"
          top="8%"
          width="980px"
          :modal-append-to-body="false"
          :close-on-click-modal="false"
          @close="inits"
        >
        <div style="padding: 0 20px;">
        	<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			    <el-tab-pane label="任务" name="first" class="panes">
			    	<tasks-com ref="tasksCom"/>
			    </el-tab-pane>
			    
			    <el-tab-pane label="工单" name="second" class="panes">
			    	<order-com ref="orderCom"/>
			    </el-tab-pane>
			    
			    <el-tab-pane label="日志" name="third" class="panes">
			    	
			    	<div class="time_lines_zky">
			    		
				    	<el-timeline-item v-for="item in activities" :key="item.id" :timestamp="item.time" placement="bottom">
					      <div class="card_zky">
					        <div class="left_zky">
					        	<p>
					        		<span class="a_label">操作人</span><span class='a'>{{datas.name}}</span>
					        		<span class="a_label" style="margin-left: 10px;">所属部门</span><span class='a'>{{datas.name}}</span>
					        	</p>
					        	<p>
					        		<span class="a_label">备注</span>
					        		<span class='a'>{{datas.name}}</span>
					        	</p>
					        </div>
					        <div class="right_zky">
					        	所属状态
					        </div>
					      </div>
					    </el-timeline-item>
					    
					 </div>
			    </el-tab-pane>
			    
			    
	  		</el-tabs>
        </div>
        
        </el-dialog>
  </div>
</template>

<script>
	import orderCom from "./orderCom.vue";
	import tasksCom from "./components/tasksCom.vue";
export default {
  data() {
    return {
    	activities: [
    	{id:'1',time:'1111111111'},
    	{id:'2',time:'1111111111'},
    	],
    	datas:{name:'1111111111111'},
    	dialogFormVisible:false,
    	activeName: 'first',
    	checkAll: false,
        checkedCities: ['img1',],
        cities: ['img1', 'img2', 'img3',],
        isIndeterminate: true

    };
  },
  components: {
    orderCom,tasksCom
  },
  created() {
    
  },

  methods: {
	  	inits(){
	  		
	  	},
  	  handleCheckAllChange(val) {
        this.checkedCities = val ? this.cities : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
	  handleClick(tab) {
		  console.log(this.activeName)
		  if (this.activeName == 'second') {
		  	this.$refs.orderCom.showNo = '0'
		  }
	  },
  },
};
</script>
<style lang="scss">
	.protr{
		.el-tabs__header{
			margin: 0;
		}
		.el-timeline-item{
			color: #fff !important;
			&:nth-child(1){
				.el-timeline-item__node{
					background: #1394C5;
					box-shadow: 0px 0px 7px #1394c5;
				}
			}
		}
	}
</style>
<style lang="scss" scoped>
/deep/ .el-timeline-item__timestamp.is-bottom{
  margin:-59px 0 0 -105px;
  width: 73px;
  text-align-last:right;
  line-height: inherit;
}
/deep/ .el-timeline-item__node--normal{
  left: 0;
  width: 9px;
  height: 9px;
}

.time_lines_zky{
	padding: 10px;
	margin-left:70px ;
	.card_zky{
		height: 60px;
		display: flex;
		border-radius: 4px;
		margin-bottom: 8px;
    	border: 1px solid #e6ebf5;
		background: #F2F2F2;
		.left_zky{
			flex: 1;box-sizing: border-box;padding-top: 4px;
			p{
				line-height: 24px;
				.a_label{
		  			display: inline-block;width: 90px;text-align: right;color: darkgrey;
		  		}
		  		.a{
		  			color: black;padding-left: 8px;
		  		}
			}
		}
		.right_zky{
			width: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #EAEAEA;
		}
	}
	
}
.panel_info{
  	padding: 7px 12px;
  	background: #F8F8F8;
  	ul{
  		padding: 0;
  		margin: 0;
  		display: flex;
  		line-height: 27px;font-size: 14px;
  		flex-flow: wrap;
  		li{
  			list-style: none;
  			width: 33.3%;
  			white-space: nowrap;
			overflow: hidden; 
			text-overflow:ellipsis;
  		}
  		.lis_{
  			width: 100%;
  		}
  		.a_label{
  			display: inline-block;width: 130px;text-align: right;color: darkgrey;
  		}
  		.a{
  			color: black;
  		}
  	}
  }
.p_title {
	font-size: 16px;
  	margin:15px 0px 10px -2px;
	 b{color: #1396c2;}
}
</style>
