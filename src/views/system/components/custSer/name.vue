<template>
	<el-dialog
      title="客户信息"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="600px"
    >
    <div class="panel_info">
    	<h3>用户信息</h3>
 		<ul>
 			<li><span class="a_label">手机号 ：</span><span class='a'>{{data.tel}}</span></li>
 			<li><span class="a_label">客户姓名 ：</span><span class='a'>{{data.name}}</span></li>
 			<li><span class="a_label">客户年龄区间 ：</span><span class='a'>{{data.ageRangeDesc}}</span></li>
 			<li><span class="a_label">客户性别 ：</span><span class='a'>{{data.sexDesc}}</span></li>
 		</ul>
    	<h3>车辆信息</h3>
 		<ul>
 			<li><span class="a_label">客户车辆类型 ：</span><span class='a'>{{data.carTypeDesc}}</span></li>
 			<li><span class="a_label">客户大类 ：</span><span class='a'>{{data.userMainTypeDesc}}</span></li>
 			<li><span class="a_label">客户小类 ：</span><span class='a'>{{data.userSubTypeDesc}}</span></li>
 			<li><span class="a_label">客户车辆品牌 ：</span><span class='a'>{{data.carBrandName}}</span></li>
 			<li><span class="a_label">客户车系 ：</span><span class='a'>{{data.carSeriesName}}</span></li>
 			<li><span class="a_label">客户车型 ：</span><span class='a'>{{data.carModelName}}</span></li>
 		</ul>
    	<h3>行为信息</h3>
 		<ul>
 			<li><span class="a_label">主要充电方式 ：</span><span class='a'>{{data.charTypeDesc}}</span></li>
 			<li><span class="a_label">主要充电桩型 ：</span><span class='a'>{{data.poleTypeDesc}}</span></li>
 			<li><span class="a_label">充电频次 ：</span><span class='a'>{{data.charRateDesc}}</span></li>
 			<li><span class="a_label">主要充电时段 ：</span><span class='a'>{{data.charTimeInteDesc}}</span></li>
 			<li><span class="a_label">拨打客服频次 ：</span><span class='a'>{{data.servTelNumDesc}}</span></li>
 			<li><span class="a_label">主要充电区域 ：</span><span class='a'>{{data.charArea}}</span></li>
 		</ul>
 	</div>
    </el-dialog>
</template>

<script>
	export default {
		data() {
			return {
				dialogFormVisible:false,
				data:[]
			};
		},
		created() {
			
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
  .panel_info{
  	padding: 7px 22px;
  	ul{
  		padding: 10px 0px;
  		margin: 0;
  		display: flex;
  		border-bottom: 1px solid gainsboro;
  		line-height: 25px;font-size: 14px;color: darkgrey;
  		flex-flow: wrap;
  		li{
  			list-style: none;
  			flex: 50%;
  			white-space: nowrap;
			overflow: hidden; 
			text-overflow:ellipsis;
  			
  		}
  		.a_label{
  			display: inline-block;width: 120px;text-align: right;
  		}
  		.a{
  			color: black;
  		}
  	}
  }
  h3{
  	margin: 0;
  	line-height: 38px;
  	font-size: 20px;
  }
</style>