<template>       
   <div class="protr">
        <el-dialog
          title="故障详情"
          :visible.sync="dialogFormVisible"
          top="8%"
          width="1050px"
          :modal-append-to-body="false"
          :close-on-click-modal="false"
        >
        <div style="padding: 0 10px;">
        	<el-form ref="form">
        	<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			    <el-tab-pane label="详情" name="first" class="panes">
			    	<p class="p_title"><b>丨</b>基本信息</p>
			    	<div class="panel_info">
				 		<ul>
				 			<li class="lis_"><span class="a_label">故障站点 ：</span><span class='a'>{{datas.stationName}}</span></li>
				 			<li><span class="a_label">故障工单编号 ：</span><span class='a'>{{datas.id}}</span></li>
				 			<li><span class="a_label">桩名称 ：</span><span class='a'>{{datas.stakeName}}</span></li>
				 			<li><span class="a_label">充电枪编号 ：</span><span class='a'>{{datas.gunNo}}</span></li>
				 			<li><span class="a_label">故障类型 ：</span><span class='a'>{{datas.faultType}}</span></li>
				 			<li><span class="a_label">工单持续时间 ：</span><span class='a'>{{datas.duration}}</span></li>
				 			<li><span class="a_label">故障类别 ：</span><span class='a'>{{datas.faultLabel}}</span></li>
				 			<li><span class="a_label">报修运维班 ：</span><span class='a'>{{datas.groupName}}</span></li>
				 			<li><span class="a_label">申请人单位 ：</span><span class='a'>{{datas.createManGroupName}}</span></li>
				 			<li class="lis_"><span class="a_label">故障工单状态 ：</span><span class='a'>{{datas.state}}</span></li>
				 			<li class="lis_"><span class="a_label">故障描述 ：</span><span class='a'>{{datas.faultDesc}}</span></li>
				 		</ul>
				 	</div>
				 	
			    	<p class="p_title"><b>丨</b>反馈信息</p>
			    	<div class="panel_info">
				 		<ul>
				 			<li><span class="a_label">桩状态 ：</span><span class='a'>{{datas.devStatus}}</span></li>
				 			<li><span class="a_label">到达时间 ：</span><span class='a'>{{datas.arriveTime}}</span></li>
				 			<li><span class="a_label">报修时间 ：</span><span class='a'>{{datas.reportTime}}</span></li>
				 			<li><span class="a_label">故障检修人 ：</span><span class='a'>{{datas.receiveManName}}</span></li>
				 			<li><span class="a_label">检修单位 ：</span><span class='a'>{{datas.fixGroupName}}</span></li>
				 			<li><span class="a_label">责任单位 ：</span><span class='a'>{{datas.dutyGroupName}}</span></li>
				 			<li><span class="a_label">检修负责人 ：</span><span class='a'>{{datas.fixManName}}</span></li>
				 			<li><span class="a_label">处理部门 ：</span><span class='a'>{{datas.dealDept}}</span></li>
				 			<li><span class="a_label">处理人 ：</span><span class='a'>{{datas.facManName}}</span></li>
				 			<li><span class="a_label">处理时间 ：</span><span class='a'>{{datas.name}}</span></li>
				 			<li><span class="a_label">是否更换配件 ：</span><span class='a'>{{datas.isSpare}}</span></li>
				 			<li><span class="a_label">是否厂家协助 ：</span><span class='a'>{{datas.isApplyFac}}</span></li>
				 			<li><span class="a_label">厂家名称 ：</span><span class='a'>{{datas.facName}}</span></li>
				 			<li><span class="a_label">维修状态 ：</span><span class='a'>{{datas.repairState}}</span></li>
				 			<li><span class="a_label">停运编号 ：</span><span class='a'>{{datas.proId}}</span></li>
				 			<li><span class="a_label">工单办结时间 ：</span><span class='a'>{{datas.finishTime}}</span></li>
				 			<li><span class="a_label">工单接单时间 ：</span><span class='a'>{{datas.receiveTime}}</span></li>
				 			<li class="lis_"><span class="a_label">旧件信息 ：</span><span class='a'>{{datas.oldSpare}}</span></li>
				 			<li class="lis_"><span class="a_label">新件信息 ：</span><span class='a'>{{datas.newSpare}}</span></li>
				 			<li class="lis_"><span class="a_label">检修处理情况描述 ：</span><span class='a'>{{datas.suggest}}</span></li>
				 		</ul>
				 	</div>
				 	<div class="panel_info">
				 		<el-form-item label="照片："style="margin:-8px 0 0 46px;">
                        <div v-if="!!cities">
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                                >全选</el-checkbox
                            >
                            &nbsp;&nbsp;
                            <el-button size="mini" :disabled="!checkedCities.length" @click="handleBatchDownload" class="newButtonColor download_btn">下载</el-button>
                            <div style="margin: 15px 0"></div>
                            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="img in cities" :label="img" :key="img">
                                    <el-image :preview-src-list="cities" style="width: 80px; height: 80px" :src="img"></el-image>
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div v-else>无照片</div>
                        </el-form-item>
                     </div>
			    </el-tab-pane>
			    <el-tab-pane label="日志" name="second" class="panes">
			    	
			    	<div class="time_lines_zky">
				    	<el-timeline-item v-for="item in activities" :key="item.id" :timestamp="item.time" placement="bottom">
					      <div class="card_zky">
					        <div class="left_zky">
					        	<p>
					        		<span class="a_label">操作人</span><span class='a'>{{item.handleManName}}</span>
					        		<span class="a_label" style="margin-left: 10px;">所属部门</span><span class='a'>{{item.handleOrgName}}</span>
					        	</p>
					        	<p>
					        		<span class="a_label">备注</span>
					        		<span class='a'>{{item.desc}}</span>
					        	</p>
					        </div>
					        <div class="right_zky">
					        	{{item.descr}}
					        </div>
					      </div>
					    </el-timeline-item>
					     
					 </div>
			    </el-tab-pane>
			    
	  		</el-tabs>
	  		</el-form>
        </div>
        
        </el-dialog>
  </div>
</template>

<script>
	import { queryLog } from '@/api/operBeijing/patrolFormManage';
	import FunLib from '@/utils/mulDownloadPic';
export default {
  data() {
    return {
    	activities: [
    	],
    	datas:{},
    	dialogFormVisible:false,
    	activeName: 'first',
    	checkAll: false,
        checkedCities: [],
        cities: [],
        isIndeterminate: false

    };
  },
  components: {
    
  },
  created() {
    
  },

  methods: {
  	inits(id){
	  		queryLog(id).then(res=>{
	  			this.activities = res.data
	  		})
	  	},
	  	handleBatchDownload() { 
            this.$message({
                message: '正在下载，请稍等...',
                type: 'info'
            });
            // console.log(this.urlArr, '<图片标识>');
            let fliesArr = [];
            //  把所有下载的图片都组装起来放到fliesArr
            for (let i = 0; i < this.cities.length; i++) {
                fliesArr.push({
                    url: this.cities[i],
                    name: i
                });
            }
            FunLib.download(fliesArr);
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
/deep/.el-form-item--small .el-form-item__label {
    line-height: 32px;
    color: darkgrey;
}
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