<template>
    <div>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="区县" label-position="left">
                <el-select size="mini" class="inputWidth" v-model="formInline.regId" @change="queryByCondition(formInline.regId)" clearable>
                    <el-option v-for="item in regionMap" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="站点名称" label-position="left">
                <el-select size="mini" filterable class="inputWidth" v-model="formInline.staId" clearable>
                    <el-option v-for="item in staMap" :key="item.regId" :value="item.regId" :label="item.stationName"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="任务名称" label-position="left">
                <el-input size="mini" class="inputWidth" v-model="formInline.taskName" clearable></el-input>
            </el-form-item>

            <el-form-item label="任务编号" label-position="left">
                <el-input size="mini" class="inputWidth" v-model="formInline.id" clearable></el-input>
            </el-form-item>

            <el-form-item label="处理部门" label-position="left">
                <el-select size="mini" v-model="formInline.orgId" class="selectWidth" clearable>
                    <el-option v-for="item in regTreeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="派发人">
                <users-tree ref="usersTree"></users-tree>
            </el-form-item>

            <el-form-item label="任务制定时间" label-width="90px" label-position="left">
                <el-date-picker
                    v-model="formInline.startTime"
                    type="date"
                    class="pickTimeCom"
                    prefix-icon="222"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                -
                <el-date-picker
                    v-model="formInline.endTime"
                    type="date"
                    class="pickTimeCom"
                    prefix-icon="222"
                    :picker-options="pickerCircleEndTo"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
            </el-form-item>

            <el-form-item label="实际结束时间" label-width="90px" label-position="left">
                <el-date-picker
                    v-model="formInline.actualEndTimeFrom"
                    type="date"
                    class="pickTimeCom"
                    prefix-icon="222"
                    :picker-options="pickerCircleEndFrom"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                -
                <el-date-picker
                    v-model="formInline.actualEndTimeTo"
                    type="date"
                    class="pickTimeCom"
                    prefix-icon="222"
                    :picker-options="pickerCircleEndTo"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
            </el-form-item>

            <el-form-item label="派发日期" label-width="90px" label-position="left">
                <el-date-picker
                    v-model="formInline.dispatchTimeFrom"
                    type="date"
                    class="pickTimeCom"
                    prefix-icon="222"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                -
                <el-date-picker
                    v-model="formInline.dispatchTimeTo"
                    type="date"
                    class="pickTimeCom"
                    prefix-icon="222"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
            </el-form-item>

            <el-form-item label="任务来源" label-position="left">
                <el-select size="mini" v-model="formInline.taskSource" class="selectWidth" clearable>
                    <el-option v-for="item in taskSourceList" :key="item.id" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="任务状态" label-position="left">
                <el-select size="mini" v-model="formInline.state" class="selectWidth" clearable>
                    <el-option v-for="item in state" :key="item.id" :label="item.name" :value="item.value"></el-option>
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
import { getCurrentOrgUserTree } from '@/api/operBeijing/AncillaryFacilitiesTasks';
import usersTree from './usersTree';

export default {
    components: { usersTree },
    data() {
        return {
            // 查询参数
            formInline: {
                taskType: 5
            },
            staMap: [], //站
            regionMap: [], //区域
            state: [], //任务状态

            pickerDate: {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now(); //如果没有后面的-8.64e7就是不可以选择今天的
                    }
                }
            },
            IsRelTime: true, //控制查询功能是否开发,默认开放
            //--------------------
            regTreeData: [], //处理部门
            dispatchRegTreeData: [], //派发人
            taskSourceList: [],
            orgiztionProps: {
                //所属部门
                value: 'id',
                label: 'name',
                children: 'children',
                emitPath: false,
                checkStrictly: true
            },
            orgiztionProptake: {
                //所属部门
                value: 'id',
                label: 'name',
                children: 'children',
                emitPath: false,
                checkStrictly: true
            },
            //  周期开始时间的to不能大于from
            pickerCircleStartTo: {
                disabledDate: (time) => {
                    let delay = this.formInline.startTime;
                    if (delay) {
                        return time.getTime() <= new Date(delay).getTime();
                    }
                }
            },
            //  周期结束时间的from要大于周期开始时间的from
            pickerCircleEndFrom: {
                disabledDate: (time) => {
                    let delay = this.formInline.startTime;
                    if (delay) {
                        return time.getTime() <= new Date(delay).getTime();
                    }
                }
            },
            pickerCircleEndTo: {
                disabledDate: (time) => {
                    let delay = this.formInline.endTime;
                    if (delay) {
                        return time.getTime() <= new Date(delay).getTime();
                    }
                }
            }
        };
    },
    created() {
        // 任务状态
        getDict(DICTDATA.TASK_TYPE_BJ).then((res) => {
            this.state = res;
        });
        // 任务来源
        getDict(DICTDATA.TASK_SOURCE).then((res) => {
            this.taskSourceList = res;
        });
        //派发人
        this.distributer();
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
            const res = await getOperationTreeTaske(5);
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
        //查询
        search() {
            if (this.IsRelTime) {
                this.$parent.$parent.formInline = this.formInline;
                this.$nextTick(() => {
                    this.$parent.getDataInit();
                });
            } else {
                this.$message({
                    message: '查询失败',
                    type: 'warning'
                });
                this.IsRelTime = true;
            }
        },
        //清空查询条件
        clear() {
            //清空查询条件
            this.formInline = {};
            //查询分类的重新赋值
            this.formInline.taskType = 5;
        },

        //------------------------公共数据查询
        // 派发人
        async distributer() {
            this.dispatchRegTreeData = [];
            const { data: res } = await getCurrentOrgUserTree();
            this.dispatchRegTreeData.push(res);
        }
    }
};
</script>

<style lang="scss" scoped>
/deep/ .el-input--prefix .el-input__inner {
    padding: 0 !important;
    font-size: 13px !important;
    text-align: center !important;
}
.pickTimeCom {
    width: 82.5px !important;
}
</style>