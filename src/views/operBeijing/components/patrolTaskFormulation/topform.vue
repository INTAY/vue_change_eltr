<template>
    <div>
        <el-form :inline="true" :model="formInline">
            <div>
                <el-form-item label="区县">
                    <el-select size="mini" v-model="formInline.regId" @change="queryByCondition(formInline.regId)" clearable>
                        <el-option v-for="item in regionMap" :key="item.id" :value="item.id" :label="item.name"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="站点名称">
                    <el-select size="mini" filterable v-model="formInline.staId" @change="$forceUpdate()" clearable>
                        <el-option v-for="item in staMap" :key="item.stationId" :value="item.stationId" :label="item.stationName">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="任务名称">
                    <el-input size="mini" placeholder="请输入" clearable v-model="formInline.taskName"></el-input>
                </el-form-item>
                <el-form-item label="任务编号">
                    <el-input size="mini" clearable placeholder="请输入" v-model="formInline.id"></el-input>
                </el-form-item>

                <el-form-item label="派发人">
                    <users-tree ref="usersTree"></users-tree>
                </el-form-item>

                <el-form-item label="任务状态">
                    <el-select size="mini" v-model="formInline.state" placeholder="请选择" clearable>
                        <el-option v-for="item in state" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="处理部门">
                    <el-select size="mini" v-model="formInline.orgId" placeholder="请选择" clearable>
                        <el-option v-for="item in operateSys" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="派发日期">
                    <el-date-picker
                        size="mini"
                        v-model="formInline.getTime2"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        clearable
                    ></el-date-picker>
                </el-form-item>

                <el-form-item label="任务制定时间">
                    <el-date-picker
                        size="mini"
                        v-model="formInline.getTime"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"
                        clearable
                    ></el-date-picker>
                </el-form-item>

                <el-form-item label="实际结束时间">
                    <el-date-picker
                        size="mini"
                        v-model="formInline.getTime1"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        clearable
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" class="newButtonColor SearchBTN" @click="onSubmit()">查询</el-button>
                    <el-button size="mini" class="SearchBTN cancelBTN" @click="empty">清空</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>
<script>
import { region } from '@/api/platform/generalOverview';
import { queryStationAndStakeNum, getOperationTree, getOrgTreeByUser, getUserTree } from '@/api/operBeijing/patrolTaskFormulation';
import { DICTDATA, getDict, translatorDict } from '@/api/dict';
// import treeSelect from '@/components/treeSelect/treeSelect';
// usersTree
import usersTree from './usersTree';

export default {
    components: { usersTree },
    data() {
        return {
            usersTreeData: [],
            orgTreeData: [],
            orgDefaultProps: {
                value: 'id',
                label: 'name',
                children: 'children'
            },

            operateSys: [],
            formInline: {},
            regTreeData: [],
            regionMap: [],
            staMap: [],
            state: [],
            carInternet: [],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now(); // 选当前时间之前的时间
                }
            }
        };
    },
    created() {
        // 获取任务状态字典
        getDict(DICTDATA.TASK_TYPE_BJ).then((res) => {
            this.state = res;
        });
        //  获取车联网状态字典
        getDict(DICTDATA.CAR_INTERNET_STATUS).then((res) => {
            this.carInternet = res;
        });
        // if (!!this.$route.query.id) {
        //     this.formInline.id = this.$route.query.id;
        // }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            region(sessionStorage.getItem('regId')).then((res) => {
                if (res.code === '000000') {
                    this.regionMap = res.data;
                    // console.log(this.regionMap, '区域数据');
                }
            });

            // const _this = this;
            getOperationTree(4).then((res) => {
                if (res.code === '000000') {
                    // let map = [];
                    // map[0] = res.data;
                    // _this.operateSys = map;
                    this.operateSys = res.data;
                }
            });
            getOrgTreeByUser().then((res) => {
                if (res.code === '000000') {
                    this.orgTreeData = res.data.children;
                }
            });
            // 用户树
            getUserTree().then((res) => {
                if (res.code === '000000') {
                    this.usersTreeData = res.data.children;
                }
            });
        },
        //
        // getValue(value) {
        //     this.formInline.orgId = value;
        // },

        //  得到最后一个机构id
        getOrg() {
            if (this.formInline.orgIdList) {
                this.formInline.orgId = this.formInline.orgIdList[this.formInline.orgIdList.length - 1];
            }
        },
        queryByCondition(arg) {
            // console.log(arg);
            // this.$forceUpdate();
            this.staMap = [];
            this.formInline.staId = '';
            let params = { regId: arg, stationName: '' };
            queryStationAndStakeNum(params).then((res) => {
                if (res.code == '000000') {
                    this.staMap = res.data.records;
                }
            });
            // this.$forceUpdate();
        },
        //省市区三联框点击后触发
        handleChange(value) {
            this.formInline.regId = value[value.length - 1]; //取地区里最后一个值发给后端
        },
        // 查询
        onSubmit() {
            // 实际结束时间
            if (!!this.formInline.getTime1) {
                this.formInline.actualEndTimeFrom = this.formInline.getTime1[0];
                this.formInline.actualEndTimeTo = this.formInline.getTime1[1];
            } else {
                this.formInline.actualEndTimeFrom = '';
                this.formInline.actualEndTimeTo = '';
            }
            // 派发日期
            if (!!this.formInline.getTime2) {
                this.formInline.dispatchTimeFrom = this.formInline.getTime2[0];
                this.formInline.dispatchTimeTo = this.formInline.getTime2[1];
            } else {
                this.formInline.dispatchTimeFrom = '';
                this.formInline.dispatchTimeTo = '';
            }
            // 任务制定
            if (!!this.formInline.getTime) {
                this.formInline.startTime = this.formInline.getTime[0];
                this.formInline.endTime = this.formInline.getTime[1];
            } else {
                this.formInline.startTime = '';
                this.formInline.endTime = '';
            }

            this.formInline.taskType = 4;
            this.formInline.order = 'desc';
            this.formInline.sortColumn = 'created_time';
            this.$parent.$parent.formInline = this.formInline;
            this.$nextTick(() => {
                this.$parent.getDataInit();
            });
        },
        // 清空
        empty() {
            this.formInline = {};
            this.$refs.usersTree.$refs.treeSelect.valueTitle = '';
            // this.$refs.orgTreeSelect.valueTitle = '';
        },

        getUserId() {
            this.$forceUpdate();
        }
    }
};
</script>
<style lang="scss" scoped>
/deep/ .el-form-item__label {
    color: #232323 !important;
}
</style>