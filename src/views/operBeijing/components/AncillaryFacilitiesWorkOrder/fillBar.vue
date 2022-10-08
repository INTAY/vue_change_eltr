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
                    <el-option v-for="item in staMap" :key="item.id" :value="item.regId" :label="item.stationName"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="任务名称" label-position="left">
                <el-input size="mini" class="inputWidth" v-model="formInline.sheetInfo" clearable></el-input>
            </el-form-item>

            <el-form-item label="工单编号" label-position="left">
                <el-input size="mini" class="inputWidth" v-model="formInline.id" clearable></el-input>
            </el-form-item>

            <el-form-item label="任务编号" label-position="left">
                <el-input size="mini" class="inputWidth" v-model="formInline.sourceId" clearable></el-input>
            </el-form-item>

            <el-form-item label="工单状态">
                <el-select size="mini" v-model="formInline.state" class="selectWidth" clearable>
                    <el-option v-for="item in searchTypeOption" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="工单开始时间" label-position="left">
                <el-date-picker
                    v-model="formInline.receiveTimeFrom"
                    type="date"
                    class="pickTimeCom"
                    prefix-icon="222"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                -
                <el-date-picker
                    v-model="formInline.receiveTimeTo"
                    type="date"
                    class="pickTimeCom"
                    :picker-options="pickerCircleStartTo"
                    prefix-icon="222"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
            </el-form-item>

            <el-form-item label="工单结束时间" label-position="left">
                <el-date-picker
                    v-model="formInline.finishTimeFrom"
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
                    v-model="formInline.finishTimeTo"
                    type="date"
                    class="pickTimeCom"
                    prefix-icon="222"
                    :picker-options="pickerCircleEndTo"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
            </el-form-item>

            <el-form-item label="完成度" label-position="left">
                <el-input
                    size="mini"
                    placeholder="%"
                    class="pickTimeCom"
                    style="width: 82.5px"
                    v-model="formInline.percentFrom"
                    clearable
                ></el-input>
                <span>&nbsp;-&nbsp;</span>
                <el-input
                    size="mini"
                    placeholder="%"
                    class="pickTimeCom"
                    style="width: 82.5px"
                    v-model="formInline.percentTo"
                    clearable
                ></el-input>
            </el-form-item>

            <el-form-item label="处理部门" label-position="left">
                <el-select size="mini" v-model="formInline.groupId" class="selectWidth" clearable>
                    <el-option v-for="item in regTreeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
import { getDict, DICTDATA } from '@/api/dict';
import { queryStationByRegAndName, region } from '@/api/operation/stopAndRestore';
import { getOperationTreeTaske } from '@/api/commonApi'; //处理部门接口查询

export default {
    data() {
        return {
            workOrderStar: [], //工单开始时间（仅做接受参数，不做传参，不可删）
            workOrderEnd: [], //工单结束时间（仅做接受参数，不做传参，不可删）
            // 查询参数
            formInline: {
                sheetType: 13
            },
            staMap: [], //站
            regionMap: [], //区域
            searchTypeOption: null, //周期工单状态
            regTreeData: null, //处理部门
            orgiztionProps: {
                //所属部门
                value: 'id',
                label: 'name',
                children: 'children',
                emitPath: false,
                checkStrictly: true
            },
            pickerDate: {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now(); //如果没有后面的-8.64e7就是不可以选择今天的
                    }
                }
            },
            IsRelTime: true, //控制查询功能是否开发,默认开放
            //  工单开始时间的to不能大于from
            pickerCircleStartTo: {
                disabledDate: (time) => {
                    let delay = this.formInline.receiveTimeFrom;
                    if (delay) {
                        return time.getTime() <= new Date(delay).getTime();
                    }
                }
            },
            //  工单结束时间的from要大于工单开始时间的from
            pickerCircleEndFrom: {
                disabledDate: (time) => {
                    let delay = this.formInline.receiveTimeFrom;
                    if (delay) {
                        return time.getTime() <= new Date(delay).getTime();
                    }
                }
            },
            pickerCircleEndTo: {
                disabledDate: (time) => {
                    let delay = this.formInline.receiveTimeTo;
                    if (delay) {
                        return time.getTime() <= new Date(delay).getTime();
                    }
                }
            }
        };
    },
    created() {
        getDict(DICTDATA.ORDER_STATUS).then((res) => {
            this.searchTypeOption = res;
        });
    },
    mounted() {
        this.init();
        //默认时间
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
                    message: '工单开开始时间和工单结束时间的有问题',
                    type: 'warning'
                });
                this.IsRelTime = true;
            }
            this.workOrderStar = [];
            this.workOrderEnd = [];
        },
        //清空查询条件
        clear() {
            this.formInline = {};
            this.formInline.sheetType = 13;
            this.IsRelTime = true;
            this.workOrderStar = [];
            this.workOrderEnd = [];
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