<template>
	<el-dialog
      title="客户信息"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="680px"
    >
    <div class="panel_info">
    	<h3>用户信息</h3>
 		<ul>
 			<li><span class="a_label">手机号 ：</span>
 				<el-input v-model="form.tel" placeholder="请输入内容"></el-input>
 			</li>
 			<li><span class="a_label">客户姓名 ：</span>
 				<el-input v-model="form.name" placeholder="请输入内容"></el-input>
 			</li>
 			<li><span class="a_label">客户年龄区间 ：</span>
 				<el-select v-model="form.ageRange" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in eleAgeRange"
				      :key="item.id"
				      :label="item.name"
				      :value="item.value">
				    </el-option>
		  		</el-select>
 			</li>
 			<li><span class="a_label">客户性别 ：</span>
 				<el-select v-model="form.sex" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in eleSex"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
		  		</el-select>
 			</li>
 		</ul>
    	<h3>车辆信息</h3>
 		<ul>
 			<li><span class="a_label">客户车辆类型 ：</span><span class='a'>
 				<el-select v-model="form.carType" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in carModels"
				      :key="item.id"
				      :label="item.name"
				      :value="item.value">
				    </el-option>
				  </el-select>
 			</span></li>
 			<li><span class="a_label">客户大类 ：</span><span class='a'>
 				<el-select v-model="form.userMainType" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in custB"
				      :key="item.id"
				      :label="item.name"
				      :value="item.value">
				    </el-option>
				  </el-select>
 			</span></li>
 			<li><span class="a_label">客户小类 ：</span><span class='a'>
 				<el-select v-model="form.userSubType" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in custS"
				      :key="item.id"
				      :label="item.name"
				      :value="item.value">
				    </el-option>
				  </el-select>
 			</span></li>
 			<li><span class="a_label">客户车辆品牌 ：</span><span class='a'>
 				<el-select v-model="form.carBrandName" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in ele"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
 			</span></li>
 			<li><span class="a_label">客户车系 ：</span><span class='a'>
 				<el-select v-model="form.carSeriesName" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in ele"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
 			</span></li>
 			<li><span class="a_label">客户车型 ：</span><span class='a'>
 				<el-select v-model="form.carModelName" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in ele"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
 			</span></li>
 		</ul>
    	<h3>行为信息</h3>
 		<ul>
 			<li><span class="a_label">主要充电方式 ：</span><span class='a'>
 				<el-select v-model="form.charType" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in charTypes"
				      :key="item.id"
				      :label="item.name"
				      :value="item.value">
				    </el-option>
				  </el-select>
 			</span></li>
 			<li><span class="a_label">主要充电桩型 ：</span><span class='a'>
 				<el-select v-model="form.poleType" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in charLabs"
				      :key="item.id"
				      :label="item.name"
				      :value="item.value">
				    </el-option>
				  </el-select>
 			</span></li>
 			<li><span class="a_label">充电频次 ：</span><span class='a'>
 				<el-select v-model="form.charRate" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in charRates"
				      :key="item.id"
				      :label="item.name"
				      :value="item.value">
				    </el-option>
				  </el-select>
 			</span></li>
 			<li><span class="a_label">主要充电时段 ：</span><span class='a'>
 				<el-select v-model="form.charTimeInte" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in otimes"
				      :key="item.id"
				      :label="item.name"
				      :value="item.value">
				    </el-option>
				  </el-select>
 			</span></li>
 			<li><span class="a_label">拨打客服频次 ：</span><span class='a'>
 				<el-select v-model="form.servTelNum" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in calNums"
				      :key="item.id"
				      :label="item.name"
				      :value="item.value">
				    </el-option>
				  </el-select>
 			</span></li>
 			<li><span class="a_label">主要充电区域 ：</span><span class='a'>
 				<el-select v-model="form.charArea" placeholder="请选择" clearable>
				    <el-option
				      v-for="item in ele"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
 			</span></li>
 		</ul>
 	</div>
 	<span slot="footer" class="dialog-footer">
      <el-button size="mini" class="bouncedHold btnSpace editorBTN" :disabled='submitButtonDisabled' @click="save()">确定</el-button>
      <el-button size="mini" class="editorBTN cancelBTN" @click="cancel">取消</el-button>
    </span>
    </el-dialog>
</template>

<script>
	import {
	  modify,
	} from "@/api/system/cust";
	import {
	  findByParentId,
	} from "@/api/system/dict";
	export default {
		data() {
			return {
				submitButtonDisabled:false,
				dialogFormVisible:false,
				ids:'',
				eleAgeRange:[],
				eleSex:[{name:'男',id:1},{name:'女',id:2}],
				ele:[],
				input:'',
				form:{
					
				},
				brands:[],
	            cars:[],
	            carModels:[],
	            custB:[],
	            custS:[],
	            charTypes:[],
	            charLabs:[],
	            charRates:[],
	            otimes:[],
	            calNums:[],
	            
			};
		},
		created() {
			findByParentId({value:'236'}).then(res => {
		      	this.carModels = res.data;
		    });
	        findByParentId({value:'176'}).then(res => {
		      	this.custB = res.data;
		    });
	        findByParentId({value:'177'}).then(res => {
		      	this.custS = res.data;
		    });
	        findByParentId({value:'74'}).then(res => {
		      	this.eleAgeRange = res.data;
		    });
	        findByParentId({value:'305'}).then(res => {
		      	this.charTypes = res.data;
		    });
	        findByParentId({value:'235'}).then(res => {
		      	this.charLabs = res.data;
		    });
	        findByParentId({value:'72'}).then(res => {
		      	this.charRates = res.data;
		    });
	        findByParentId({value:'73'}).then(res => {
		      	this.otimes = res.data;
		    });
	        findByParentId({value:'72'}).then(res => {
		      	this.calNums = res.data;
		    });
		},
		methods:{
			save(){
				modify(this.form,this.ids).then(res => {
	              if (res.code !== "000000") {
	                this.$message({
	                  message: res.mesg,
	                  type: "warning"
	                });
	              } else {
	                this.$message({
	                  message: "修改成功！",
	                  type: "success"
	                });
	                this.dialogFormVisible = false;
					this.$parent.search();
	              }
	            })
			},
			cancel(){
				this.form = {};
				this.dialogFormVisible = false;
			}
		}
	}
</script>
<style type="text/css">
	.panel_info ul .el-input__inner{width: 150px !important;height: 28px;}
</style>
<style lang="scss" scoped>
  .panel_info{
  	padding: 2px 22px;
  	ul{
  		padding: 10px 0px;
  		margin: 0;
  		display: flex;
  		border-bottom: 1px solid gainsboro;
  		line-height: 25px;font-size: 14px;color: darkgrey;
  		flex-flow: wrap;
  		li{
  			list-style: none;
  			line-height: 36px;
  			flex: 50%;
  			white-space: nowrap;
  		}
  		.a_label{
  			display: inline-block;width: 120px;text-align: right;
  		}
  		
  	}
  }
  h3{
  	margin: 0;
  	line-height: 38px;
  	font-size: 20px;
  }
</style>