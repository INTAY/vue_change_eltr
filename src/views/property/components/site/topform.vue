<template>
    <div class="t">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <div class="yi">
                <el-form-item label="站点名称" clearable class="a">
                    <el-input size="mini" v-model="formInline.staName" placeholder="请输入站点名称" class="btk"></el-input>
                </el-form-item>

                <el-form-item size="mini" label="组织机构" class="a">
                    <tree-select
                        ref="treeSelect"
                        v-model="formInline.orgId"
                        :props="orgDefaultProps"
                        :options="orgTreeData"
                        :clearable="isClearable"
                        :accordion="isAccordion"
                        @getValue="getValue($event)"
                        height="200"
                    />
                </el-form-item>
                <el-form-item label="行政区域" class="a">
                    <el-cascader
                        v-model="formInline.regId"
                        size="mini"
                        :options="regTreeData"
                        :props="defaultProps"
                        clearable
                        @change="handleChange"
                    ></el-cascader>
                </el-form-item>

                <el-form-item label="能源类型" class="a">
                    <el-select size="mini" v-model="formInline.engType" clearable placeholder="全部" class="btk">
                        <el-option v-for="item in energyType" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态" class="a">
                    <el-select size="mini" v-model="formInline.state" clearable placeholder="全部" class="btk">
                        <el-option v-for="item in status" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-button class="newButtonColor btnSpace SearchBTN" @click="onSubmit()">查询</el-button>
                <el-button class="SearchBTN cancelBTN" @click="empty()">清空</el-button>
            </div>
        </el-form>
    </div>
</template>
<style lang="scss" scoped>
.xan {
    color: white !important;
    background: #006080 !important;
    width: 60px;
}
.zxan {
    color: #006080 !important;
}
</style>
<script>
import { getDict, DICTDATA } from '@/api/dict';
import { getOrgTree } from '@/api/property/site';
import treeSelect from '@/components/treeSelect/treeSelect';
export default {
    data() {
        return {
            formInline: {
                headers: '',
                values: ''
            },
            orgTreeData: [],
            isClearable: true, // 可清空（可选）
            isAccordion: true, // 可收起（可选）
            orgDefaultProps: {
                value: 'id',
                label: 'name',
                children: 'children'
            },
            regTreeData: [],
            defaultProps: {
                checkStrictly: true,
                children: 'children',
                value: 'id',
                label: 'name'
            },
            status: [], // 基础设施状态
            energyType: [] //能源类型 201
        };
    },
    components: { treeSelect },
    methods: {
        setData() {
            this.regTreeData = this.$parent.$parent.regTreeData;
            this.status = this.$parent.$parent.status;
            this.energyType = this.$parent.$parent.energyType;
            this.orgTreeData = this.$parent.$parent.orgTreeData;
        },
        getValue(value) {
            this.formInline.orgId = value;
        },
        //省市区三联框点击后触发
        handleChange(value) {
            this.formInline.regId = value[value.length - 1]; //取地区里最后一个值发给后端
        },
        // 查询
        onSubmit() {
            this.$parent.queryParam = this.formInline;
            this.$parent.getDataInit();
        },
        // 清空
        empty() {
            this.formInline = {};
            this.$refs.treeSelect.valueTitle = '';
        }
    }
};
</script>