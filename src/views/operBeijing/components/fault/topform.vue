<template>
  <div class="t">
    <el-form :inline="true" :model="formInline">
      <div class="yi">
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
        <!--<el-form-item label="站名称" class="a">
        	<el-autocomplete
          ref="autoComplete"
          v-model="formInline.staName"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
          clearable
        />
        </el-form-item>-->
        
        <el-form-item label="桩编号" class="a">
          <el-input size="mini" class="xzk" v-model="formInline.devId" placeholder="请输入编号" clearable></el-input>
        </el-form-item>
        
        <el-form-item label="缺陷工单编号" class="a">
          <el-input size="mini" class="xzk" v-model="formInline.id" placeholder="请输入编号" clearable></el-input>
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
        
        <el-form-item size="mini" label="报修时间" class="a">
        	<el-date-picker
        		clearable
        		class="sss"
        		size="mini"
			      v-model="value1"
			      type="daterange"
			      range-separator="-"
			      value-format="yyyy-MM-dd"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期">
			    </el-date-picker>
        	<!--<el-date-picker
		      v-model="formInline.reportTime"
		      type="date"
		      format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
		      placeholder="选择日期">
		    </el-date-picker>-->
      	</el-form-item>
        <el-form-item size="mini" label="办结时间" class="a">
        	<el-date-picker
        		clearable
        		class="sss"
        		size="mini"
			      v-model="value2"
			      type="daterange"
			      range-separator="-"
			      value-format="yyyy-MM-dd"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期">
			    </el-date-picker>
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
import { getStationList } from "@/api/property/charge";
import { region, queryStationByRegAndName } from '@/api/platform/generalOverview';
export default {
  data() {
    return {
      type: [
      ],
      params:{},
      formInline: {
        
      },
      value1:[],
      value2:[],
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
  	handleSelect(item) {
//    this.form.siteId = item.id;
    },
  	querySearchAsync(queryString, cb) {
      if (queryString !== "") {
        this.params.staName = queryString;
        getStationList(this.params).then((res) => {
          for (let i of res.data) {
            i.value = i.staName; //将想要展示的数据作为value
          }
          let restaurants = res.data;
          cb(restaurants);
        });
      }
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

<style lang="scss" scoped>

</style>