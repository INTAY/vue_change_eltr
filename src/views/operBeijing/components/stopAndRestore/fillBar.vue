<template>
    <div>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="区县">
                <el-select size="mini" v-model="formInline.regId" @change="queryByCondition(formInline.regId)" clearable>
                    <el-option v-for="item in regionMap" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="站点名称">
                <el-select size="mini" filterable v-model="formInline.staId" @change="$forceUpdate()" clearable>
                    <el-option v-for="item in staMap" :key="item.stationId" :value="item.stationId" :label="item.stationName"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="申请单位">
                <tree-select
                    ref="treeSelect"
                    v-model="formInline.applyOrg"
                    :props="orgDefaultProps"
                    :options="orgTreeData"
                    clearable
                    accordion
                    @getValue="getValue($event)"
                    height="200"
                />
            </el-form-item>
            <el-form-item label="申请人">
                <!-- <el-input size="mini"  v-model="formInline.applyManName" clearable></el-input> -->
                <el-select size="mini" @change="getUserId" v-model="formInline.applyMan" clearable>
                    <el-option v-for="item in usersTreeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审核状态">
                <el-select size="mini" v-model="formInline.state" clearable>
                    <el-option v-for="item in approveStatus" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="申请来源">
                <!-- <el-input size="mini"  v-model="formInline.applySource" clearable></el-input> -->
                <el-select size="mini" v-model="formInline.applySource" clearable>
                    <el-option v-for="item in stopAfterSource" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="桩编号">
                <el-input size="mini" v-model="formInline.devId" placeholder="请输入" clearable></el-input>
            </el-form-item>

            <el-form-item label="申请编号">
                <el-input size="mini" v-model="formInline.id" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="申请类型">
                <el-select size="mini" v-model="formInline.planType" clearable>
                    <el-option v-for="item in stopRestoreType" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="申请时间">
                <el-date-picker
                    v-model="formInline.getTime"
                    size="mini"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerDate"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    @change="timeQuantum"
                ></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button size="mini" class="newButtonColor SearchBTN" @click="search">查询</el-button>
                <el-button size="mini" class="otherBTN SearchBTN" @click="clear">清空</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getDict, DICTDATA } from '@/api/dict';
import { queryStationByRegAndName, region, getOperationTree, getNextUsers } from '@/api/operBeijing/stopAndRestore';
import treeSelect from '@/components/treeSelect/treeSelect';
import moment from 'moment';
export default {
    components: { treeSelect },
    data() {
        return {
            orgTreeData: [],
            orgDefaultProps: {
                value: 'id',
                label: 'name',
                children: 'children'
            },

            operateSys: [],
            stopRestoreType: [], // 停复运类型 470
            approveStatus: [], // 通用审批状态 71
            stopAfterSource: [], // 停复运来源 473
            // 查询参数
            formInline: {
                getTime: [moment(new Date()).format('YYYY-MM-DD')],
                order: 'desc',
                sortColumn: 'applyTime'
            },
            staMap: [], //站
            regionMap: [], //区域
            pickerDate: {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now(); //如果没有后面的-8.64e7就是不可以选择今天的
                    }
                }
            },
            usersTreeData: []
        };
    },
    created() {
        // 停复运类型 470
        getDict(DICTDATA.STOP_RESTORE_TYPE).then((res) => {
            this.stopRestoreType = res;
        });
        // 通用审批状态 71
        getDict(DICTDATA.APPROVE_STATUS).then((res) => {
            this.approveStatus = res;
        });
        // 停复运来源 473
        getDict(DICTDATA.STOP_AFTER_SOURCE).then((res) => {
            this.stopAfterSource = res;
        });

        if (!!this.$route.query.id) {
             this.formInline.id = this.$route.query.id;
            this.formInline.getTime = [];
        }else{
        this.getCurrentMonthFirst();

        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // const id = sessionStorage.getItem('orgId').replace(/^\"|\"$/g, '');
            getOperationTree().then((res) => {
                if (res.code === '000000') {
                    // console.log(res);
                    this.orgTreeData = res.data;
                }
            });
            region(sessionStorage.getItem('regId')).then((res) => {
                if (res.code === '000000') {
                    this.regionMap = res.data;
                }
            });
        },
        getValue(value) {
            this.formInline.applyMan = '';
            this.formInline.applyOrg = value;
            getNextUsers(value).then((res) => {
                if (res.code === '000000') {
                    this.usersTreeData = res.data;
                }
            });
        },
        getUserId() {
            this.$forceUpdate();
        },
        // 默认开始时间
        getCurrentMonthFirst() {
            let date = new Date();
            date.setDate(1);
            let month = parseInt(date.getMonth() + 1);
            let day = date.getDate();
            if (month < 10) month = '0' + month;
            if (day < 10) day = '0' + day;
            let startTime = date.getFullYear() + '-' + month + '-' + day;
            this.formInline.getTime.unshift(startTime);
        },
        // 根据区域查站点
        queryByCondition(arg) {
            this.staMap = [];
            this.formInline.staId = '';
            let params = { regId: arg, stationName: '' };
            queryStationByRegAndName(params).then((res) => {
                if (res.code == '000000') {
                    console.log(res, 'res');
                    this.staMap = res.data.records;
                }
            });
        },
        timeQuantum(e) {
            if (e) {
                this.formInline.startTime = e[0];
                this.formInline.endTime = e[1];
            } else {
                this.formInline.getTime = [];
            }
        },
        /**
         * 查询
         */
        search() {
            this.formInline.order = 'desc';
            this.formInline.sortColumn = 'applyTime';
            if (this.formInline.getTime) {
                this.formInline.startTime = this.formInline.getTime[0];
                this.formInline.endTime = this.formInline.getTime[1];
            }
            this.$parent.$parent.formInline = this.formInline;
            this.$nextTick(() => {
                this.$parent.getDataInit();
            });
        },
        /**
         * 清空查询条件
         */
        clear() {
            this.formInline = {};
            this.$refs.treeSelect.valueTitle = '';
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
