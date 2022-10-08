<template>
    <el-form
        label-position="right"
        label-width="80px"
        size="mini"
        :inline="true"
        :model="ss"
        ref="refform"
        class="demo-form-inline wrap_inline"
    >
        <el-form-item label="组织名称">
            <el-input v-model="ss.name" placeholder clearable class="input_inner"></el-input>
        </el-form-item>
        <el-form-item label="业务类型">
            <el-select v-model="ss.serviceType" clearable class="input_inner">
                <el-option
                    v-for="item in serviceTypes"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="联系人">
            <el-input v-model="ss.linkName" clearable class="input_inner"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
            <el-input v-model="ss.linkPhone" maxlength="11" clearable class="input_inner"></el-input>
        </el-form-item>
        <el-form-item label="所属区域">
            <el-cascader
                class="input_inner"
                v-model="regionId"
                :options="regTree"
                :props="defaultProps"
                clearable
                @change="handleChange"
            ></el-cascader>
        </el-form-item>
        <el-form-item>
            <el-button style="margin-left: 20px;" class="newButtonColor btnSpace SearchBTN" @click="cx">查询</el-button>
            <el-button @click="reset" class="SearchBTN cancelBTN">清空</el-button>
        </el-form-item>
    </el-form>
</template>
<style lang="scss">
.wrap_inline {
    background: #f8f8f8;
    padding: 14px 5px 0px 5px;
    .el-form-item {
        margin-bottom: 12px;
    }
}
.wrap_inline .input_inner {
    width: 120px;
}
</style>
<script>
	import { mapState,mapMutations } from "vuex";
	import { cxx } from "@/api/power/institution";
export default {
    data() {
        return {
            serviceTypes: [],
            orgTypes: [],
            regionId: [],
            ss: {
                name: null,
                type: null,
                serviceType: null,
                regionId: null,
                linkName: null,
                linkPhone: null
            },
            defaultProps: {
                checkStrictly: true,
                children: 'children',
                value: 'id',
                label: 'name'
            }
        };
    },
    created() {
    	console.log(this.$store)
    },
    computed:{
  	  ...mapState(['regTree']),
    },
    methods: {
        setData() {
            this.serviceTypes = this.$parent.$parent.$parent.serviceTypes;
            this.orgTypes = this.$parent.$parent.$parent.orgTypes;
        },
        //省市区三联框点击后触发
        handleChange(value) {
            this.ss.regionId = value[value.length - 1]; //取地区里最后一个值发给后端
        },
        cx() {
            this.$parent.$parent.$parent.$refs.biaoge.cx(this.ss);
            this.$parent.$parent.$parent.$refs.biaoge.ids = null;
            this.$parent.$parent.$parent.$refs.tree.selOrg = null;
        },
        reset() {
            this.ss = {};
            this.regionId = [];
            this.$parent.$parent.$parent.$refs.biaoge.ids = null;
            this.$parent.$parent.$parent.$refs.tree.selOrg = null;
        },
        getTreeData(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].children.length < 1) {
                    data[i].children = undefined;
                } else {
                    this.getTreeData(data[i].children);
                }
            }
            return data;
        }
    }
};
</script>
