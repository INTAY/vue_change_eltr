<template>
    <el-form
        label-position="right"
        label-width="100px"
        size="mini"
        :inline="true"
        :model="form"
        ref="refform"
        class="demo-form-inline wrap_inline_cust"
    >
        <el-form-item label="客户姓名">
            <el-input v-model="form.name" placeholder clearable class="input_inner_text"></el-input>
        </el-form-item>
        <el-form-item label="客户电话">
            <el-input v-model="form.tel" placeholder clearable class="input_inner_text"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
            <el-date-picker
            	style="width: 200px;"
		      v-model="form.regTime"
		      type="date"
		      format="yyyy 年 MM 月 dd 日"
      			value-format="yyyy-MM-dd"
		      placeholder="日期">
		    </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号归属地">
            <el-input v-model="form.telRegion" placeholder clearable class="input_inner_text"></el-input>
        </el-form-item>
        
        <el-form-item label="客户性别">
            <el-select v-model="form.sex" clearable class="input_inner">
                <el-option
                    v-for="item in eleSex"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="品牌">
            <el-select v-model="form.carBrandName" clearable class="input_inner">
                <el-option
                    v-for="item in brands"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                ></el-option>
            </el-select>
        </el-form-item>
        
        <el-form-item label="车系">
            <el-select v-model="form.carSeriesName" clearable class="input_inner">
                <el-option
                    v-for="item in cars"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                ></el-option>
            </el-select>
        </el-form-item>
        
        <el-form-item label="车型">
            <el-select v-model="form.carModelName" clearable class="input_inner">
                <el-option
                    v-for="item in carModels"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                ></el-option>
            </el-select>
        </el-form-item>
        
        <el-form-item label="客户车辆类型">
            <el-select v-model="form.carType" clearable class="input_inner">
                <el-option
                    v-for="item in carModels"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                ></el-option>
            </el-select>
        </el-form-item>
        
        <el-form-item label="客户大类">
            <el-select v-model="form.userMainType" clearable class="input_inner">
                <el-option
                    v-for="item in custB"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                ></el-option>
            </el-select>
        </el-form-item>
        
        <el-form-item label="客户小类">
            <el-select v-model="form.userSubType" clearable class="input_inner">
                <el-option
                    v-for="item in custS"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                ></el-option>
            </el-select>
        </el-form-item>
        
        <el-form-item>
            <el-button style="margin-left: 20px;" class="newButtonColor btnSpace SearchBTN" @click="sear">查询</el-button>
            <el-button @click="cancel" class="SearchBTN cancelBTN">清空</el-button>
        </el-form-item>
        
    </el-form>
</template>
<script>
	import {
	  findByParentId,
	} from "@/api/system/dict";
export default {
    data() {
        return {
        	form:{},
        	eleSex:[{name:'男',id:1},{name:'女',id:2}],
            serviceTypes: [],
            brands:[],
            cars:[],
            carModels:[],
            custB:[],
            custS:[],
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
    },
    methods: {
        setData() {
            this.serviceTypes = this.$parent.$parent.$parent.serviceTypes;
            this.orgTypes = this.$parent.$parent.$parent.orgTypes;
        },
        sear(){
        	this.$parent.forminlines = this.form;
        	this.$parent.queryList(this.form)
        },
        cancel(){
        	this.form = {}
        }
        
    }
};
</script>
<style lang="scss">
.wrap_inline_cust {
    background: #f8f8f8;
    padding: 14px 5px 0px 5px;
    .el-form-item {
        margin-bottom: 12px;
    }
    .input_inner_text {
	    width: 150px;
	}
    .input_inner {
	    width: 120px;
	}
}
</style>