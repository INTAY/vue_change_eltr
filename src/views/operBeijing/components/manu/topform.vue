<template>
  <div class="t">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <div class="yi">
        <el-form-item label="厂家名称" class="a">
          <el-input size="mini" class="kz" v-model="formInline.facName" placeholder="请输入名称" clearable></el-input>
        </el-form-item>
        <el-form-item size="mini" label="创建日期：">
        <div class="block">
        	<el-date-picker
        		clearable
        		size="mini"
        		class="sss"
			      v-model="value1"
			      type="daterange"
			      range-separator="-"
			      value-format="yyyy-MM-dd"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期">
			    </el-date-picker>
          <!--<el-date-picker
            v-model="formInline.createTimeTo"
            type="datetime"
            placeholder="创建日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="timeQuantum"
          ></el-date-picker>-->
        </div>
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
export default {
  data() {
    return {
      type: [
      	{name:'状态1',value:'1'},
      	{name:'状态2',value:'2'},
      ],
      value1:[],
      formInline: {
        
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
  components: {  },
  methods: {
  	timeQuantum(){
  		
  	},
    setData() {
      this.regTreeData = this.$parent.$parent.regTreeData;
      this.type = this.$parent.$parent.type;
    },
    //省市区三联框点击后触发
    // 查询
    onSubmit() {
//  	if (this.formInline.regId) {
//  		this.formInline.regId = this.formInline.regId[this.formInline.regId.length - 1];
//  	}
    	if (this.value1.length) {
    		this.formInline.createTimeFrom = this.value1[0]
    		this.formInline.createTimeTo = this.value1[1]
    	}else{
    		this.formInline.createTimeFrom = ''
    		this.formInline.createTimeTo = ''
    	}
      this.$parent.$parent.$parent.formInline = this.formInline;
      this.$nextTick(()=>{
      	this.$parent.getDataInit();
      })
    },
    // 清空
    empty() {
    	this.value1 = [];
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

