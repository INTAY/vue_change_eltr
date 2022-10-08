<template>
    <div class="t">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <div class="yi">
                <el-form-item label="业务类型" prop="busType">
                    <el-select size="mini" v-model="formInline.busType" placeholder="全部">
                        <el-option value>请选择</el-option>
                        <el-option v-for="item in busType" :key="item.value" :value="item.value" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                
                    <!-- 暂时隐去状态 -->
                <!-- <el-form-item label="状态" prop="state">
                    <el-select size="mini" v-model="formInline.state" placeholder="全部">
                        <el-option value>请选择</el-option>
                        <el-option v-for="item in state" :key="item.value" :value="item.value" :label="item.name"></el-option>
                    </el-select>
                </el-form-item> -->

                <el-button size="mini" @click="onSubmit" class="SearchBTN newButtonColor">查询</el-button>
                <el-button size="mini" @click="empty" class="SearchBTN otherBTN">清空</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import treeSelect from '@/components/treeSelect/treeSelect';
import { getSite } from '@/api/property/photovoltaic';
export default {
    components: { treeSelect },
    data() {
        return {
            formInline: {},
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
            devType: [], // 设备类型 2011
            busType: '',
            state: [
                { name: '启用', value: 1 },
                { name: '停用', value: 0 }
            ]
        };
    },

    methods: {
        setData() {
            this.regTreeData = this.$parent.$parent.regTreeData;
            this.busType = this.$parent.$parent.busType;
            this.orgTreeData = this.$parent.$parent.$refs.erji.orgTreeData;
        },
        //确定
        onSubmit() {
            if (this.formInline.devType) {
                this.formInline.devType = this.formInline.devType.value;
            }
            this.$parent.queryParam = this.formInline;
            this.$parent.getDataInit();
        },
        empty() {
            this.formInline = {};
        },
        //省市区三联框点击后触发
        handleChange(value) {
            this.formInline.regId = value[value.length - 1]; //取地区里最后一个值发给后端
        }
    }
};
</script>

<style lang="scss" scoped>
</style>