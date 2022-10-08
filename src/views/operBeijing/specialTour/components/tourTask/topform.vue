<template>
  <div class="t">
    <el-form :inline="true" :model="formInline">
    	<!--label-width="90px"-->
      <div class="yi">
        <!--<el-form-item label="区县" class="a">
          <el-cascader
          	class="kz"
            v-model="formInline.regId"
            size="mini"
            :options="regTreeData"
            :props="defaultProps"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        
        <el-form-item label="站点名称" class="a">
          <el-input size="mini" class="kz" v-model="formInline.staName" placeholder="请输入名称"></el-input>
        </el-form-item>-->
        
        <el-form-item label="区县" class="a">
        	<el-select size="mini" class="xzk" v-model="formInline.regId" @change="queryByCondition" clearable>
	            <el-option v-for="item in regionMap" :key="item.id" :value="item.id" :label="item.name"> </el-option>
	        </el-select>
        </el-form-item>
        
        <el-form-item label="站名称" >
            <el-select size="mini" filterable class="xzk" v-model="formInline.staId" clearable>
                <el-option v-for="item in staMap" :key="item.id" :value="item.stationId" :label="item.stationName"> </el-option>
            </el-select>
        </el-form-item>
        
        
        <el-form-item label="任务名称" class="a">
          <el-input size="mini" class="kz" v-model="formInline.taskName" placeholder="请输入名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="任务编号" class="a">
          <el-input size="mini" class="kz" v-model="formInline.id" placeholder="请输入名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="派发人" class="a">
          <users-tree ref="usersTree"></users-tree>
        </el-form-item>
        
        
        <!--<el-form-item label="桩编号" class="a">
          <el-input size="mini" class="kz" v-model="formInline.sta_id" placeholder="请输入编号"></el-input>
        </el-form-item>-->
        
        <el-form-item size="mini" label="任务制定时间" class="a">
        	<el-date-picker
        		clearable
        		v-model="formInline.startTime_"
        		size="mini"
		      type="daterange"
		      range-separator="-"
        	start-placeholder="开始时间"
        	end-placeholder="结束时间"
        	value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        	@change="timeQuantumZD"
		      >
		    </el-date-picker>
      	</el-form-item>
      	<!--:picker-options="pickerOptions"--> <!--test-->
        <el-form-item size="mini" label="实际结束时间" class="a">
        	<el-date-picker
        		clearable
		      v-model="formInline.actualEndTime"
		      size="mini"
		      type="daterange"
		      range-separator="-"
        	start-placeholder="开始时间"
        	end-placeholder="结束时间"
        	value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        	@change="timeQuantumSJ"
		      >
		    </el-date-picker>
		    
      	</el-form-item>
        <el-form-item size="mini" label="派发日期" class="a">
        	<el-date-picker
        		clearable
				      v-model="formInline.dispatchTime"
				      size="mini"
				      type="daterange"
				      range-separator="-"
		        	start-placeholder="开始时间"
		        	end-placeholder="结束时间"
		        	value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
		        	@change="timeQuantumPF"
        	>
		    </el-date-picker>
      	</el-form-item>
      	
      	<el-form-item label="处理部门" class="a">
      		<el-select size="mini" v-model="formInline.orgId" placeholder="请选择" clearable>
	            <el-option v-for="item in operateSys" :key="item.id" :label="item.name" :value="item.id"></el-option>
	        </el-select>
        </el-form-item>
      	
        <el-form-item label="任务状态" class="a">
          <el-select size="mini" v-model="formInline.state" placeholder="全部" class="xzk" clearable>
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <span class="btn">
          <el-button size="mini" class="newButtonColor SearchBTN" @click="onSubmit()">查询</el-button>
          <el-button size="mini" class="otherBTN SearchBTN" @click="empty()">清空</el-button>
        </span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { exportZone } from "@/api/property/garden";
import {queryStationAndStakeNum,getOperationTree } from '@/api/operation/planTasks';
import { region, queryStationByRegAndName } from '@/api/platform/generalOverview';
import { getOrgTreeByUser, getAllNextUser} from '@/api/operation/flawAfault'; //处理部门接口查询
import usersTree from './usersTree';
export default {
  data() {
    return {
      type: [
      ],
      operateSys:[],
      formInline: {
        taskType:'2',
        applyManName:''
      },
      regTreeData: [],
      regTreeData_: [],
      defaultProps: {
        checkStrictly: true,
        children: "children",
        value: "id",
        label: "name",
      },
      regionMap: [],
    	staMap: [],
    	org_data: [],
    	user_data: [],
	    pickerOptions: {
	        disabledDate(time) {
	            return time.getTime() > Date.now(); // 选当前时间之前的时间
	        }
	    }
    	
    };
  },
  components: { usersTree },
  created(){
  	region(sessionStorage.getItem("regId")).then((res) => {
        if (res.code == '000000') {
            this.regionMap = res.data;
        }
    });
    getOperationTree(2).then((res) => {
        if (res.code === '000000') {
            this.operateSys = res.data;
        }
    });
    getOrgTreeByUser().then(res=>{
    	this.org_data = res.data;
    })
  },
  methods: {
  	queryByCondition(arg) {
        this.staMap = [];
        let params = { regId: arg, stationName: '' };
        queryStationAndStakeNum(params).then((res) => {
            if (res.code == '000000') {
                this.staMap = res.data.records;
            }
        });
    },
    checkUser(data){
    	this.formInline.applyManName = ""
    	getAllNextUser(data).then(res=>{
    		this.user_data = res.data
    	})
    },
    getValue(value) {
      this.formInline.orgId = value;
    },
    setData() {
      this.regTreeData = this.$parent.$parent.regTreeData;
      this.type = this.$parent.$parent.type;
    },
    //省市区三联框点击后触发
    handleChange(value) {
//    this.formInline.regId = value[value.length - 1];
    },
    // 查询
    onSubmit() {
      this.$parent.$parent.formInline = this.formInline;
      this.$nextTick(()=>{
      	this.$parent.getDataInit();
      })
    },
    // 清空
    empty() {
      this.formInline = {taskType:'2'}; 
      this.$refs.usersTree.$refs.treeSelect.valueTitle = '';
    },

    // 选中组织机构树
    handleNodeClick(item) {
      this.formInline.orgId = item.id;
      this.formInline.orgName = item.name;
      this.visibleOrgTree = false;
    },
    timeQuantumZD(e) {
    	if (e) {
    		this.formInline.startTime = e[0];
        this.formInline.endTime = e[1];
    	}else{
    		this.formInline.startTime = '';
        this.formInline.endTime = '';
    	}
    },
    // 实际开始时间
    timeQuantumSJ(e) {
    	if (e) {
    		this.formInline.actualEndTimeFrom = e[0];
        this.formInline.actualEndTimeTo = e[1];
    	}else{
    		this.formInline.actualEndTimeFrom = '';
        this.formInline.actualEndTimeTo = '';
    	}
    },
    // 派发 日期
        timeQuantumPF(e) {
            	if (e) {
		    		this.formInline.dispatchTimeFrom = e[0];
		        this.formInline.dispatchTimeTo = e[1];
		    	}else{
		    		this.formInline.actualEndTimeFrom = '';
		        this.formInline.actualEndTimeTo = '';
		    	}
    },
  },
};
</script>
<style lang="scss" scoped>
.inputWidth {
    width: 84px !important;
}
</style>