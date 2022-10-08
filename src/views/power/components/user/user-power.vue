<template>
	<el-dialog title="配置数据权限" :visible.sync="visible" width="910px" :close-on-click-modal="false" :modal-append-to-body='false'>
      	<div style="box-sizing: border-box;padding: 0px 20px;position: relative;top: -9px;">
      	<p class="p_title"><b>丨</b>基本信息</p>
      	<div style="box-sizing: border-box;padding: 0px 8px;">
		 <div class="power_content">
          
         <el-row justify="start" align="middle">
            <el-col :span="8">
              <p>用户名：</p>
              <p>{{detailForm.name}}</p>
            </el-col>
            <el-col :span="8">
            	<p>手机号码：</p>
              <p>{{detailForm.mobile}}</p>
            </el-col>
            <el-col :span="8">
              <p>所属角色：</p>
              <p>{{detailForm.roleName}}</p>
            </el-col>
          </el-row>

          <el-row type="" justify="start" align="middle">
            <el-col :span="8">
               <p>组织机构类型：</p>
              <!--<p>{{detailForm.userType}}</p>-->
              <p>{{detailForm.orgServiceTypeName}}</p>
            </el-col>
            <el-col :span="8">
            	<p>所属组织机构：</p>
             <p> {{detailForm.orgName}}</p>
            </el-col>
            <el-col :span="8">
              <p>所属部门：</p>
              <p>{{detailForm.deptName}}</p>
            </el-col>
            
          </el-row>
         
          
		 </div>
		 </div>
		 	
		 <!--上面是基本信息-->
		 <p class="p_title"><b>丨</b>数据权限</p>
		 <div v-if="flag == 'text'" class="power_content_per">
		 	<!--大众-->
		 	<Areas ref="areas" />
		 </div>
		 <div v-else-if="flag == 'arop'" class="power_content_per">
		 	<arop ref="arop" />
		 </div>
		 <div v-else class="power_content_per">
		 	<el-select v-model="value" placeholder="请选择">
			    <el-option
			      v-for="item in options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
		 	<Operator ref="opera" v-if="value==2"/>
		 	<Courts ref="court" v-if="value==3"/>
		 </div>
		 </div>
		 <span slot="footer" style="position: relative;top: -16px;">
            <el-button class="bouncedHold"  @click="powerAff">确定</el-button>
            <el-button  @click="visible = false">取消</el-button>
          </span>
         
      </el-dialog>
</template>
<script>
import Areas from './power/Area'
import arop from './power/arop'
import Courts from './power/Courts' //台区
import Operator from './power/Operator' //运营商
import {getPower,updatePower,updatePower2} from '@/api/power/user' 
import {find,isNil,merge,omitBy,isNull} from 'lodash';
import { DICTDATA, getDict, translatorDict } from "@/api/dict";
import {packageOrgToMap} from '@/utils/area' 
 export default {
    data () {
      return {
        visible: false,
        flag:"",
        roleData:JSON.parse(localStorage.getItem('roleDatas')),
        detailForm:{},
        options: [{
          value: '2',
          label: '按运营商配置'
        }, {
          value: '3',
          label: '按台区配置'
        }],
        value: '2'

      }
    },
    components:{Areas,Courts,Operator,arop},
    created(){
    	
    },
    mounted() {

    },
    methods: {
		orgServiceTypeNameFormat(data){
	      return translatorDict(DICTDATA.SERVICE_TYPE, Number(data));
	    },
      init (data = null) {
        this.visible = true;
        let datas = JSON.parse(JSON.stringify(data))
        this.detailForm = datas;
        this.detailForm.orgServiceTypeName = this.orgServiceTypeNameFormat(this.detailForm.orgServiceType)
//      this.detailForm.roleName=this.roleNameFormat(this.detailForm.roleId)
//      this.detailForm.orgId=packageOrgToMap(this.detailForm.orgId)
      },
      roleNameFormat(data){
	      var role = find(this.roleData,{"id":data});
	      return role ? role.name:""
	    },
      powerAff(){
      	var params = {};
      	if (this.flag == 'text') {
      		params = {
				userId:this.detailForm.id,
				objType:3,
				objIds:this.$refs.areas.maps,
			}
      		//发送请求
			updatePower(params).then(res=>{
			  if("000000"==res.code){
	          	this.$message({
		          message: '操作成功',
		          type: 'success'
		        })
	          }else{
	            this.$message.error(res.mesg);
	          }
			})
      	}else if(this.flag == 'arop'){
      		params = [
	      		{
					userId:this.detailForm.id,
					objType:1, //组织
					objIds:this.$refs.arop.datas,
				},
	      		{
					userId:this.detailForm.id,
					objType:3, //地区
					objIds:this.$refs.arop.maps2,
				}
      		]
			updatePower2(params).then(res=>{
			  if("000000"==res.code){
	          	this.$message({
		          message: '操作成功',
		          type: 'success'
		        })
	          }else{
	            this.$message.error(res.mesg);
	          }
			})
      	}else{
      		if(this.value == '2') {
	    		params = {
					userId:this.detailForm.id,
					objType:5,
					objIds:this.$refs.opera.datas,
				}
	      	}else if(this.value == '3') {
	      		params = {
					userId:this.detailForm.id,
					objType:4,
					objIds:this.$refs.court.tagsID,
				}
      		}
	      	//发送请求
			updatePower(params).then(res=>{
			  if("000000"==res.code){
	          	this.$message({
		          message: '操作成功',
		          type: 'success'
		        })
	          }else{
	            this.$message.error(res.mesg);
	          }
			})
      	}
      	this.visible = false
      }
    }
  }

</script>

<style lang="scss" scoped>
.power_content{
	background: #fcfcfc;
	border: 1px solid #EEEEEE;
	box-sizing: border-box;
	overflow: hidden;
	padding: 10px 16px;
	position: relative;
	img{
		position: absolute;
		right: 0;top: 0;
	}
}
.sh_height{
	height: 40px;
}
.p_title{
	font-size: 16px;
  	margin:8px 0px 10px 5px;
  	b{
  		color: #1396C2;
  	}
  }
.power_content_per{
	box-sizing: border-box;
	padding: 2px;
	.el-select{
		width: 300px;margin: 2px 0px 5px 0px;
	}
}
.el-row{
	
}
.el-col{
	display: flex;
	p{margin: 3px 0;}
	p:nth-child(odd){width: 150px;text-align: right; color: #A9A9A9;}
	p:nth-child(even){flex:1;text-align: left; }
}
  .rowbg{
    padding: 10px;
    height: 40px;
  }
  .rowbg2{
    @extend .rowbg;
    background-color:#f7f7f7;
  }
  .el-select{
  	width: 100%;
  }
  .el-cascader{
  	width: 100%;
  }
  
</style>