<template>
    <div>
        <el-form :inline="true" :model="formInline">
            <div>
                <el-form-item label="区县">
                    <el-select
                        size="mini"
                        class="inputWidth"
                        v-model="formInline.regId"
                        @change="queryByCondition(formInline.regId)"
                        clearable
                    >
                        <el-option v-for="item in regionMap" :key="item.id" :value="item.id" :label="item.name"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="站点名称">
                    <el-select size="mini" filterable class="inputWidth" v-model="formInline.staId" clearable>
                        <el-option v-for="item in staMap" :key="item.id" :value="item.id" :label="item.name"> </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="任务编号">
                    <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.sourceId" clearable></el-input>
                </el-form-item>
                <el-form-item label="工单编号">
                    <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.id" clearable></el-input>
                </el-form-item>
                <el-form-item label="环境工单状态">
                    <el-select size="mini" v-model="formInline.state" placeholder="全部" class="xzk" clearable>
                        <el-option v-for="item in state" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="处理部门">
                    <!-- <tree-select
                        ref="orgTreeSelect"
                        v-model="formInline.orgId"
                        :props="orgDefaultProps"
                        :options="operateSys"
                        clearable
                        accordion
                        @getValue="getValue($event)"
                        height="200"
                    /> -->
                    <el-select size="mini" v-model="formInline.groupId" placeholder="请选择" clearable>
                        <el-option v-for="item in operateSys" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="完成度">
                    <el-input
                        size="mini"
                        placeholder="%"
                        class="inputWidth"
                        style="width: 82.5px !important"
                        v-model="formInline.percentFrom"
                        clearable
                    ></el-input>
                    <span>&nbsp;-&nbsp;</span>
                    <el-input
                        size="mini"
                        placeholder="%"
                        class="inputWidth"
                        style="width: 82.5px !important"
                        v-model="formInline.percentTo"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="工单开始时间">
                    <el-date-picker
                        v-model="formInline.getTime"
                        type="daterange"
                        range-separator="-"
                        size="mini"
                        start-placeholder="开始时间"
                        :picker-options="pickerOptions"
                        end-placeholder="结束时间"
                        clearable
                        value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="工单结束时间">
                    <el-date-picker
                        v-model="formInline.toTime"
                        type="daterange"
                        size="mini"
                        range-separator="-"
                        :picker-options="pickerOptions"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        clearable
                        value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" class="newButtonColor SearchBTN" @click="onSubmit()">查询</el-button>
                    <el-button size="mini" class="SearchBTN cancelBTN" @click="formInline = { sheetType: 9 }">清空</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>
<script>
import { region, queryStationByRegAndName } from '@/api/platform/generalOverview';
import { queryByPage, getOperationTree } from '@/api/operation/planTasks';
import { exportZone } from '@/api/property/garden';
import { DICTDATA, getDict, translatorDict } from '@/api/dict';
import treeSelect from '@/components/treeSelect/treeSelect';

export default {
    data() {
        return {
            type: [],
            formInline: {
                sheetType: 9
            },
            regionMap: [],
            staMap: [],
            state: [],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now(); // 选当前时间之前的时间
                }
            },
            //
            orgDefaultProps: {
                value: 'id',
                label: 'name',
                children: 'children'
            },
            operateSys: []
        };
    },
    components: { treeSelect },
    // mounted() {
    //     // this.regionMap = [];
    //     // region(sessionStorage.getItem('regId')).then((res) => {
    //     //     if (res.code == '000000') {
    //     //         this.regionMap = res.data;
    //     //     }
    //     // });
    // },
    created() {
        getDict(DICTDATA.DEVOPS_TASK_STATE).then((res) => {
            this.state = res;
        });
    },
    mounted() {
        const _this = this;
        getOperationTree(7).then((res) => {
            if (res.code === '000000') {
                _this.operateSys = res.data;
            }
        });
        region(sessionStorage.getItem('regId')).then((res) => {
            if (res.code == '000000') {
                _this.regionMap = res.data;
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
        // 查询
        onSubmit() {
            //
            if (!!this.formInline.getTime) {
                this.formInline.receiveTimeFrom = this.formInline.getTime[0];
                this.formInline.receiveTimeTo = this.formInline.getTime[1];
            } else {
                this.formInline.receiveTimeFrom = '';
                this.formInline.receiveTimeTo = '';
            }
            //
            if (!!this.formInline.toTime) {
                this.formInline.finishTimeFrom = this.formInline.toTime[0];
                this.formInline.finishTimeTo = this.formInline.toTime[1];
            } else {
                this.formInline.finishTimeFrom = '';
                this.formInline.finishTimeTo = '';
            }
            this.$parent.$parent.formInline = this.formInline;
            this.$nextTick(() => {
                this.$parent.getDataInit();
            });
        },
        // 清空
        empty() {
            this.formInline = {};
        }
    }
};
</script>
<style lang="scss" scoped>
</style>