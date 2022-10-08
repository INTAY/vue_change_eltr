<template>
  <div class="t">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <div class="yi">
        <!--<el-form-item label="区县" class="a">
          <el-cascader
          	class="ss"
            v-model="formInline.regId"
            size="mini"
            :options="regTreeData"
            :props="defaultProps"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        
        <el-form-item label="站名称" class="a">
          <el-input size="mini" class="xzk" v-model="formInline.staName" placeholder="请输入名称"></el-input>
        </el-form-item>-->
        
        <el-form-item label="区县" class="a">
        	<el-select size="mini" class="xzk" v-model="formInline.regId" @change="queryByCondition" clearable>
	            <el-option v-for="item in regionMap" :key="item.id" :value="item.id" :label="item.name"> </el-option>
	        </el-select>
        </el-form-item>
        
        <el-form-item label="站名称" >
            <el-select size="mini" filterable class="xzk" v-model="formInline.staId" clearable>
                <el-option v-for="item in staMap" :key="item.id" :value="item.id" :label="item.name"> </el-option>
            </el-select>
        </el-form-item>
        
        
        <el-form-item label="桩编号" class="a">
          <el-input size="mini" class="xzk" v-model="formInline.devId" placeholder="请输入编号" clearable></el-input>
        </el-form-item>
        
        <el-form-item label="故障工单编号" class="a">
          <el-input size="mini" class="xzk" v-model="formInline.id" placeholder="请输入编号" clearable></el-input>
        </el-form-item>
        
        <el-form-item label="管理状态" class="a">
          <el-select size="mini" v-model="formInline.devStatus" placeholder="全部" class="ss" clearable>
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item size="mini" label="报修时间" class="a">
        	<el-date-picker
        		clearable
        		size="mini"
        		class="sss"
			      v-model="value1"
			      type="daterange"
			      range-separator="-"
			      value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期">
			    </el-date-picker>
      	</el-form-item>
        <el-form-item size="mini" label="办结时间" class="a">
        	<el-date-picker
        		clearable
        		size="mini"
        		class="sss"
			      v-model="value2"
			      type="daterange"
			      range-separator="-"
			      value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期">
			    </el-date-picker>
      	</el-form-item>
      	
        <el-form-item label="工单状态" class="a">
          <el-select size="mini" v-model="formInline.state" placeholder="全部" class="ss" clearable>
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
import treeSelect from "@/components/treeSelect/treeSelect";
import { exportZone } from "@/api/property/garden";
import { region, queryStationByRegAndName } from '@/api/platform/generalOverview';
export default {
  data() {
    return {
      type: [
      	
      ],
      value1:[],
      value2:[],
      formInline: {
        
      },
      regTreeData: [],
      defaultProps: {
        checkStrictly: true,
        children: "children",
        value: "id",
        label: "name",
      },
      regionMap: [],
    	staMap: [],
    };
  },
  components: { treeSelect },
  created(){
       if (!!this.$route.query.id) {
            this.formInline.id = this.$route.query.id;
        }
  	region(sessionStorage.getItem("regId")).then((res) => {
        if (res.code == '000000') {
            this.regionMap = res.data;
        }
    });
  },
  methods: {
  	queryByCondition(arg) {
        this.staMap = [];
        let params = { regId: arg, stationName: '' };
        queryStationByRegAndName(params).then((res) => {
            if (res.code == '000000') {
                this.staMap = res.data;
            }
        });
    },
    getValue(value) {
      this.formInline.orgId = value;
    },
    setData() {
      this.regTreeData = this.$parent.$parent.regTreeData;
      this.type = this.$parent.$parent.type;
      this.types = this.$parent.$parent.types;
    },
    //省市区三联框点击后触发
    handleChange(value) {
//    this.formInline.regId = value[value.length - 1]; //取地区里最后一个值发给后端
    },
    // 查询
    onSubmit() {
//  	if (this.formInline.regId) {
//  		this.formInline.regId = this.formInline.regId[this.formInline.regId.length - 1];
//  	}
    	if (this.value1.length) {
    		this.formInline.reportTimeFrom = this.value1[0]
    		this.formInline.reportTimeTo = this.value1[1]
    	}else{
    		this.formInline.reportTimeFrom = ''
    		this.formInline.reportTimeTo = ''
    	}
    	if (this.value2.length) {
    		this.formInline.finishTimeFrom = this.value2[0]
    		this.formInline.finishTimeTo = this.value2[1]
    	}else{
    		this.formInline.finishTimeFrom = ''
    		this.formInline.finishTimeTo = ''
    	}
      this.$parent.$parent.formInline = this.formInline;
      this.$nextTick(()=>{
      	this.$parent.getDataInit();
      })
    },
    // 清空
    empty() {
    	this.value1 = [];
    	this.value2 = [];
      this.formInline = {};
    },

    // 选中组织机构树
    handleNodeClick(item) {
      this.formInline.orgId = item.id;
      this.formInline.orgName = item.name;
      this.visibleOrgTree = false;
    },
  },
};
</script>

