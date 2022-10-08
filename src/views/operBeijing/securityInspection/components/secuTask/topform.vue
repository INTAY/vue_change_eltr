<template>
  <div class="t">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <div class="yi">
        <el-form-item label="区县" class="a">
          <el-cascader
            v-model="formInline.regId"
            size="mini"
            :options="regTreeData"
            :props="defaultProps"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        
        <el-form-item label="站点名称" class="a">
          <el-input size="mini" class="kz" v-model="formInline.sta_name" placeholder="请输入名称"></el-input>
        </el-form-item>
        
        <el-form-item label="任务名称" class="a">
          <el-input size="mini" class="kz" v-model="formInline.task_name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="任务编号" class="a">
          <el-input size="mini" class="kz" v-model="formInline.id" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="派发人" class="a">
          <el-input size="mini" class="kz" v-model="formInline.apply_man_name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="派发组织" class="a">
          <el-input size="mini" class="kz" v-model="formInline.org_id" placeholder="请输入名称"></el-input>
        </el-form-item>
        
        <!--<el-form-item label="桩编号" class="a">
          <el-input size="mini" class="kz" v-model="formInline.sta_id" placeholder="请输入编号"></el-input>
        </el-form-item>-->
        
        <el-form-item size="mini" label="任务制定时间" class="a">
        	<el-date-picker
		      v-model="formInline.created_time"
		      type="date"
		      format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
		      placeholder="选择日期">
		    </el-date-picker>
      	</el-form-item>
        <el-form-item size="mini" label="实际结束时间" class="a">
        	<el-date-picker
		      v-model="formInline.created_time"
		      type="date"
		      format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
		      placeholder="选择日期">
		    </el-date-picker>
      	</el-form-item>
        <el-form-item size="mini" label="派发日期" class="a">
        	<el-date-picker
		      v-model="formInline.value2"
		      type="date"
		      format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
		      placeholder="选择日期">
		    </el-date-picker>
      	</el-form-item>
      	
      	<el-form-item label="处理部门" class="a">
          <el-input size="mini" class="kz" v-model="formInline.org_id" placeholder="请输入编号"></el-input>
        </el-form-item>
      	
        <el-form-item label="任务状态" class="a">
          <el-select size="mini" v-model="formInline.state" placeholder="全部" class="xzk">
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
export default {
  data() {
    return {
      type: [
      	{name:'状态1',value:'1'},
      	{name:'状态2',value:'2'},
      ],
      formInline: {
        taskType:'2'
      },
      regTreeData: [],
      defaultProps: {
        checkStrictly: true,
        children: "children",
        value: "id",
        label: "name",
      },
    };
  },
  components: { treeSelect },
  methods: {
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
    	if (this.formInline.regId) {
    		this.formInline.regId = this.formInline.regId[this.formInline.regId.length - 1];
    	}
      this.$parent.queryParam = this.formInline;
      this.$parent.getDataInit();
    },
    // 清空
    empty() {
      this.formInline = {taskType:'2'}; 
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
.btn {
  margin-left: 15px;
}
form.el-form.demo-form-inline.el-form--inline {
  height: 100%;
}
.kz{
	width: 140px;
}
.t {
  background: #fcfcfc !important;
}
.btk {
  width: 150px !important;
}
.xzk {
  width: 160px !important;
}
.ss {
  width: 100px;
}
/deep/.el-input__inner {
  height: 30px !important;
}

.el-form-item {
  height: 30px;
}
/deep/.yi.el-form-item {
  height: 30px !important;
  line-height: 30px;
}
.a{margin-left: 8px;}
.zbt .btz {
  width: 120px;
  height: 32px;
  background: #006080;
}
/deep/ .el-select-tree .el-input.is-active .el-input__inner {
  border-color: #00607f !important;
}
</style>