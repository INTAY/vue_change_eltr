<template>
  <el-dialog
    title="用户详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :modal-append-to-body='false'
    width="1000px">
    <div style="box-sizing: border-box;padding: 0px 28px;">
    <div class="power_contents" 
    	:class="!isShrink?'sh_height2':''">
          <img class="shrink_imgs" @click="shrink" v-show="isShrink" src="../../../../assets/image/dou_tp.png"/>
          <img class="shrink_imgs" @click="shrink" v-show="!isShrink" src="../../../../assets/image/dou_bm.png"/>
          
    <el-form
      :model="dataForm"
      ref="dataForm"
      :inline="false"
      label-width="100px"
      disabled
      size="mini">

      <el-row class="greybg">
        <el-col :span="8">
          <el-form-item label="登录名" class="self-col-style">
            <span>{{dataForm.username}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户姓名" class="self-col-style">
            <span>{{dataForm.name}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号码" class="self-col-style">
            <span>{{dataForm.mobile}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="身份证号" class="self-col-style">
            <span>{{dataForm.cardCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱" class="self-col-style">
            <span>{{dataForm.email}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" class="self-col-style">
            <span>{{sexName(dataForm.sex)}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="greybg">
        <el-col :span="8">
          <el-form-item label="所属组织" class="self-col-style">
            <span>{{dataForm.orgName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="组织类型" class="self-col-style">
            <span>{{dataForm.orgServiceType}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="过期日期" class="self-col-style">
            <span>{{dataForm.expiryDate}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="是否外协" class="self-col-style">
            <span v-if="dataForm.isExt==1">是</span>
            <span else>否</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="外协单位名称" class="self-col-style">
            <span>{{dataForm.extName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资质证书" class="self-col-style">
            <span>{{dataForm.qualifyName}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="greybg">
        <el-col :span="8">
          <el-form-item label="资质等级" class="self-col-style">
            <span>{{dataForm.qualifyGradeName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="学历" class="self-col-style">
            <span>{{dataForm.eduName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入职时间" class="self-col-style">
            <span>{{formaTime(dataForm.entryTime)}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="初次工作时间" class="self-col-style">
            <span>{{formaTime(dataForm.initWorkTime)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工作时薪" class="self-col-style">
            <span>{{dataForm.salary}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否负责人" class="self-col-style">
            <span v-if="dataForm.isLeader==1">是</span>
            <span v-else>否</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="用户备注" class="greybg">
        <span>{{dataForm.description}}</span>
      </el-form-item>
    </el-form>
    </div>
    <div v-if="sign == 1">
    	<p class="p_title"><b>丨</b>数据权限   <span class="assign">按{{type}}分配</span>  </p>
	    <div style="padding-left: 12px;padding-top: 8px;">
	    	
	    	<el-tag v-if="type!='组织和地区'" style="margin-top: 5px;" type="info" v-for="(item,index) in data" :key="index">
	    		{{regName_(item)}}
	    	</el-tag>
	    	<div v-if="type=='组织和地区'">
	    		<div style="margin-bottom: 8px;" v-if='insDatas.length'>
	    			组织：
	    		<el-tag style="margin-top: 5px;" type="info" v-for="(item,index) in insDatas" :key="index">
	    		{{orgNameFormat(item)}}
	    		</el-tag>
	    		</div>
	    		
	    		<div v-if='areaData.length'>
	    			地区：
	    		<el-tag style="margin-top: 5px;" type="info" v-for="(item,index) in areaData" :key="index">
	    		{{regName_(item)}}
	    		</el-tag>
	    		</div>
	    		
	    	</div>
	    </div>
    </div>
    
     </div>
     
  </el-dialog>
  
</template>

<script>
  import _find from 'lodash/find';
  import { DICTDATA, getDict, translatorDict } from "@/api/dict";
  import {packageOrgToMap} from '@/utils/area' 
  import {getRegNameByCode} from '@/utils/area'
  import {formatDate} from "@/utils/DateFormat"
  import { mapState,mapMutations } from "vuex";
  export default {
    data () {
      return {
        visible: false,
        isShrink:false,
        type:'地区',
        sign:1,
        data:[],
        insDatas:[],
        areaData:[],
        dataForm: {
          sex: 1,
          userType: 1
        }
      }
    },
    computed:{
  	  ...mapState(['insData']),
    },
    created(){
    	
    },
    mounted() {

    },
    methods: {
    	regName_(item){
    		return getRegNameByCode(item)
    	},
    	searchTree(tree, id) {
        var stark = [];
        stark = stark.concat(tree);
        while (stark.length) {
            var temp = stark.shift();
            if (temp.children) {
                stark = stark.concat(temp.children);
            }
            if (temp.id === id) {
                return temp;
            }
        }
        return null;
    },
    orgServiceTypeNameFormat(data){
	      return translatorDict(DICTDATA.SERVICE_TYPE, Number(data));
	    },
    orgNameFormat(cellValue) {
        var org = this.searchTree(this.insData, cellValue);
        return org ? org.name : '';
    },
    	shrink(){
  		this.isShrink = !this.isShrink;
  	},
  	 formaTime(data){
  	 	return formatDate("YYYY-mm-dd HH:MM:SS",data)
	 },
      init (data=null) {
        this.visible = true;
        let datas = JSON.parse(JSON.stringify(data))
        this.dataForm = datas;
        this.dataForm.orgServiceType=this.orgServiceTypeNameFormat(this.dataForm.orgServiceType)
        this.orgTreeData = this.$parent.$parent.orgTreeData
        this.roleData = this.$parent.$parent.roleData
      },
      sexName(value){
    	if (value == '1') {
    		return '男'
    	} else if (value == '2') {
    		return '女'
    	}
    },
      roleTypeFormat(value){
    	if (value == '1') {
    		return 'web用户'
    	} else if (value == '0') {
    		return 'app用户'
    	}
    },
      getUserTypeData(value){
        if(value && this.userTypeList.length==0){
          getDict(DICTDATA.USER_TYPE).then(res => {
            this.userTypeList = res;
          });
        }
      },
      getQualifyData(value){
        if(value && this.qualifyList.length==0){
          getDict(DICTDATA.QUALITY_TYPE).then(res => {
            this.qualifyList = res;
          });
        }
      },
      getQualifyGradeData(value){
        if(value && this.qualifyGradeList.length==0){
          getDict(DICTDATA.QUALITY_GRDADE).then(res => {
            this.qualifyGradeList = res;
          });
        }
      },
      getEduData(value){
        if(value && this.qualifyList.length==0){
          getDict(DICTDATA.EDU).then(res => {
            this.eduList = res;
          });
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
  .greybg{
    background-color:#ededed;
  }
  .p_title{
	font-size: 16px;
  	margin:18px 0px 8px -5px;
  	b{
  		color: #1396C2;
  	}
  }
  .self-col-style{
    margin-bottom:5px;
    margin-top:5px;
  }
  .assign{
  	border-radius: 5px;
  	background: #F7F7F7;
  	color: gray;
  	padding: 4px 40px 4px 20px;
  }
  .el-tag{
  	margin-right: 7px;
  }
  .power_contents{
	background: #f7f7f7;
	border: 1px solid #EEEEEE;
	box-sizing: border-box;
	overflow: hidden;
	padding: 10px 16px;
	position: relative;
}
.power_content_per .is-active{
	background: #00FFFF !important;
	color: red !important;
}
.shrink_imgs{
		position: absolute;
		right: 0;top: 0;
		cursor: pointer;
		z-index: 5;
	}
.sh_height2{
	height: 86px;
}
  
</style>
<style >
	.power_contents .el-form-item--mini .el-form-item__label {
	    color: #A9A9A9;
	}
</style>