<template>
    <div>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="区县" label-position="left">
                <el-select size="mini" v-model="formInline.regId" @change="queryByCondition(formInline.regId)" clearable>
                    <el-option v-for="item in regionMap" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="站点名称" label-position="left">
                <el-select size="mini" filterable v-model="formInline.staId" clearable>
                    <el-option v-for="item in staMap" :key="item.stationId" :value="item.stationId" :label="item.stationName"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="任务名称" label-position="left">
                <el-input size="mini" v-model="formInline.taskName" clearable></el-input>
            </el-form-item>

            <el-form-item label="任务编号" label-position="left">
                <el-input size="mini" v-model="formInline.id" clearable></el-input>
            </el-form-item>

            <el-form-item label="处理部门" label-position="left">
                <el-select size="mini" v-model="formInline.orgId" class="selectWidth" clearable>
                    <el-option v-for="item in regTreeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="任务制定时间" label-position="left">
                <el-date-picker
                    v-model="formInline.getTime"
                    style="width: 220px"
                    size="mini"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    @change="timeQuantum"
                    clearable
                ></el-date-picker>
            </el-form-item>

            <el-form-item label="任务状态" label-position="left">
                <el-select size="mini" v-model="formInline.state" class="selectWidth" clearable>
                    <el-option v-for="item in state" :key="item.id" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="车联网状态" label-width="90px" label-position="left">
                <el-select size="mini" v-model="formInline.evnetStatus" class="selectWidth" clearable>
                    <el-option v-for="item in searchFactOption" :key="item.id" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button size="mini" class="newButtonColor SearchBTN" @click="search">查询</el-button>
                <el-button size="mini" class="otherBTN SearchBTN" @click="clear">清空</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { queryStationByRegAndName, region } from '@/api/operation/stopAndRestore';
import { DICTDATA, getDict, translatorDict } from '@/api/dict';
import { getOperationTreeTaske } from '@/api/commonApi'; //处理部门接口查询

export default {
    data() {
        return {
            // 查询参数
            formInline: {
                // getTime: [new Date()],
                taskType: 3
            },
            orgiztionProps: {
                //所属部门
                value: 'id',
                label: 'name',
                children: 'children',
                emitPath: false
            },
            staMap: [], //站
            regionMap: [], //区域
            searchFactOption: [], //车联网状态
            state: [], //任务状态
            regTreeData: null, //处理部门
            pickerDate: {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now(); //如果没有后面的-8.64e7就是不可以选择今天的
                    }
                }
            }
        };
    },
    created() {
        //任务状态
        getDict(DICTDATA.TASK_XS).then((res) => {
            this.state = res;
            console.log(this.state,'this.state');
        });
        //车联网状态
        getDict(DICTDATA.CAR_INTERNET_STATUS).then((res) => {
            this.searchFactOption = res;
        });
        if (!!this.$route.query.id) {
            this.formInline.id = this.$route.query.id;
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            this.regionMap = [];
            //  获取区域信息(区县)
            region(sessionStorage.getItem('regId')).then((res) => {
                
                if (res.code == '000000') {
                    this.regionMap = res.data;
                    this.staMap = [];
                }
            });
            //处理部门
            const res = await getOperationTreeTaske(3);
            this.regTreeData = res.data;
        },
        // 根据区域查站点
        queryByCondition(arg) {
            this.staMap = [];
            let params = { regId: arg, stationName: '' };
            queryStationByRegAndName(params).then((res) => {
                if (res.code == '000000') {
                    this.staMap = res.data.records;
                }
            });
        },
        timeQuantum(e) {
            this.formInline.startTime = e[0];
            this.formInline.endTime = e[1];
        },
        //查询
        search() {
            this.$parent.$parent.formInline = this.formInline;
            this.$nextTick(() => {
                this.$parent.getDataInit();
            });
        },
        //清空查询条件
        clear() {
            //清空查询条件
            this.formInline = {};
            //查询分类的重新赋值
            this.formInline.taskType = 3;
            this.formInline.order = 'desc';
            this.formInline.sortColumn = 'created_time';
        }
    }
};
</script>