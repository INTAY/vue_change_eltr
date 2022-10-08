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
                        <el-option v-for="item in staMap" :key="item.stationId" :value="item.stationId" :label="item.stationName">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="任务名称">
                    <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.taskName" clearable></el-input>
                </el-form-item>
                <el-form-item label="任务编号">
                    <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.id" clearable></el-input>
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
                    <el-select size="mini" v-model="formInline.orgId" placeholder="请选择" clearable>
                        <el-option v-for="item in operateSys" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务状态">
                    <el-select size="mini" v-model="formInline.state" placeholder="全部" clearable>
                        <el-option v-for="item in state" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车联网状态">
                    <el-select size="mini" v-model="formInline.evnetStatus" placeholder="全部" clearable>
                        <el-option v-for="item in carInternet" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务制定时间">
                    <el-date-picker
                        v-model="formInline.getTime"
                        type="daterange"
                        size="mini"
                        range-separator="-"
                        start-placeholder="开始时间"
                        clearable
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                    ></el-date-picker>
                </el-form-item>
                <el-button size="small" class="newButtonColor SearchBTN" @click="onSubmit()">查询</el-button>
                <el-button
                    size="small"
                    class="SearchBTN cancelBTN"
                    @click="formInline = { taskType: 1, sortColumn: 'created_time', order: 'desc' }"
                    >清空</el-button
                >
            </div>
        </el-form>
    </div>
</template>
<script>
import { region } from '@/api/platform/generalOverview';
import { queryByPage, queryStationAndStakeNum, getOperationTree } from '@/api/operation/planTasks';
import { exportZone } from '@/api/property/garden';
import { DICTDATA, getDict, translatorDict } from '@/api/dict';
import treeSelect from '@/components/treeSelect/treeSelect';

export default {
    data() {
        return {
            orgTreeData: [],
            isClearable: true, // 可清空（可选）
            isAccordion: true, // 可收起（可选）
            formInline: {
                taskType: 1,
                sortColumn: 'created_time',
                order: 'desc'
            },
            regTreeData: [],
            regionMap: [],
            staMap: [],
            state: [],
            carInternet: [],
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
    mounted() {
        this.init();
    },
    created() {
        // 获取任务状态字典
        getDict(DICTDATA.TASK_XS).then((res) => {
            this.state = res;
        });
        //  获取车联网状态字典
        getDict(DICTDATA.CAR_INTERNET_STATUS).then((res) => {
            this.carInternet = res;
        });
        if (!!this.$route.query.id) {
            this.formInline.id = this.$route.query.id;
        }
    },
    methods: {
        init() {
            const _this = this;
            region(sessionStorage.getItem('regId')).then((res) => {
                if (res.code === '000000') {
                    this.regionMap = res.data;
                }
            });
            getOperationTree(1).then((res) => {
                if (res.code === '000000') {
                    _this.operateSys = res.data;
                }
            });
        },
        getValue(value) {
            this.formInline.orgId = value;
        },
        queryByCondition(arg) {
            console.log(arg);
            this.staMap = [];
            let params = { regId: arg, stationName: '' };
            queryStationAndStakeNum(params).then((res) => {
                if (res.code == '000000') {
                    this.staMap = res.data.records;
                }
            });
            this.$forceUpdate();
        },
        setData() {
            this.regTreeData = this.$parent.$parent.regTreeData;
            this.type = this.$parent.$parent.type;
            this.status = this.$parent.$parent.status;
            this.orgTreeData = this.$parent.$parent.orgTreeData;
        },
        //省市区三联框点击后触发
        handleChange(value) {
            this.formInline.regId = value[value.length - 1]; //取地区里最后一个值发给后端
        },
        // 查询
        onSubmit() {
            if (!!this.formInline.getTime) {
                this.formInline.startTime = this.formInline.getTime[0];
                this.formInline.endTime = this.formInline.getTime[1];
            } else {
                this.formInline.startTime = '';
                this.formInline.endTime = '';
            }
            this.$parent.$parent.formInline = this.formInline;
            this.$nextTick(() => {
                this.$parent.getDataInit();
            });
        },
        // 清空
        empty() {
            this.formInline = {};
        },

        // 选中组织机构树
        handleNodeClick(item) {
            this.formInline.orgId = item.id;
            this.formInline.orgName = item.name;
            this.visibleOrgTree = false;
        }
    }
};
</script>
<style lang="scss" scoped>
</style>