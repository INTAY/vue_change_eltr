<template>
    <div class="t">
        <el-form :inline="true" class="demo-form-inline" label-width="100px" :model="formInline">
            <el-form-item label="区县">
                <el-select
                    size="mini"
                    class="inputWidth"
                    v-model="formInline.regId"
                    @change="queryByCondition(formInline.regId)"
                    clearable
                >
                    <el-option
                        v-for="item in regionMap"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="站点">
                <el-select
                    size="mini"
                    filterable
                    class="inputWidth"
                    v-model="formInline.stationId"
                    clearable
                >
                    <el-option
                        v-for="item in staMap"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="充电桩编号">
                <el-input
                    size="mini"
                    placeholder="请输入"
                    class="inputWidth"
                    v-model="formInline.stakeNo"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="充电枪编号">
                <el-input
                    size="mini"
                    placeholder="请输入"
                    class="inputWidth"
                    v-model="formInline.gunNo"
                    clearable
                ></el-input>
            </el-form-item>
            <!-- </el-col>
            <el-col :span="5">-->
            <el-form-item label="车联网订单ID" label-width="100px">
                <el-input
                    size="mini"
                    placeholder="请输入"
                    class="inputWidth"
                    v-model="formInline.orderId"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="充电类型">
                <el-select
                    size="mini"
                    class="inputWidth"
                    v-model="formInline.orderConsumeType"
                    clearable
                >
                    <el-option
                        v-for="item in chargeType"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="充电开始一致" label-width="100px">
                <el-select
                    size="mini"
                    class="inputWidth"
                    v-model="formInline.isStatusStartTimeSame"
                    clearable
                >
                    <el-option
                        v-for="item in isYes"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="充电结束一致" label-width="100px">
                <el-select
                    size="mini"
                    class="inputWidth"
                    v-model="formInline.isStatusEndTimeSame"
                    clearable
                >
                    <el-option
                        v-for="item in isYes"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="接收健康">
                <el-select
                    size="mini"
                    class="inputWidth"
                    v-model="formInline.isReceiveTimely"
                    clearable
                >
                    <el-option
                        v-for="item in healthMap"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="推送健康">
                <el-select
                    size="mini"
                    class="inputWidth"
                    v-model="formInline.isResponTimely"
                    clearable
                >
                    <el-option
                        v-for="item in healthMap"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    ></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="推送结果">
                <el-select size="mini" class="inputWidth" v-model="formInline.pushState" clearable>
                    <el-option
                        v-for="item in pushResult"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    ></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="接收时间">
                <el-date-picker
                class="picker-width"
                    v-model="formInline.getTime"
                    type="daterange"
                    :picker-options="pickerOptions0" 
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="推送时间" >
                <el-date-picker
                class="picker-width"
                    v-model="formInline.pushTime"
                    type="daterange"
                    :picker-options="pickerOptions0" 
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                ></el-date-picker>
            </el-form-item>
            
            <el-form-item class="BTNSearch">
                <el-button
                    size="mini"
                    class="newButtonColor btnSpace SearchBTN"
                    @click="onSubmit"
                >查询</el-button>
                <el-button size="mini" @click="clearBtnClick" class="SearchBTN cancelBTN">清空</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getDict, DICTDATA } from '@/api/dict';
import {
    overall,
    jidu,
    orderMonitor,
    chargeType,
    healthMap,
    pushResult,
    isYes,
    region,
    queryStationByRegAndName,
    getQuartorStartDate
} from '@/api/platform/generalOverview';
import moment from 'moment';

export default {
    data() {
        return {
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的 
                }
            }, 
            // 查询参数
            formInline: {
                getTime: [new Date(), new Date()],
                headers: [],
                values: [],
            },
            orderTypes: [],
            orderStatus: [],
            orderLevel: [],
            orderSource: [],
            groupMap: [],
            chargeType: chargeType,
            healthMap: healthMap,
            pushResult: pushResult,
            isYes: isYes,
            regionMap: [],
            staMap: [],
            jidu: jidu,
        };
    },
    mounted() {
        this.init();
        this.mountedSetSource();
    },
    watch: {
        $route(newVal){
            this.mountedSetSource()
        },
    },
    methods: {
        mountedSetSource() {
            if (Object.values(this.$route.params).length>0) {
                // this.formInline.pushState = this.$route.params.result;
                this.formInline.sortCol = 'push_time'
                this.formInline.sortType = '-1'
                switch (this.$route.params.queryType) {
                    case '1':
                        this.formInline.getTime = [`${this.$route.params.year}-01-01`, `${this.$route.params.year}-12-31`];
                        break;
                    case '2':
                        getQuartorStartDate(this.$route.params.year, this.$route.params.quarter);
                        break;
                    case '3':
                        let firstDate = moment(this.$route.params.month).startOf('month').format('YYYY-MM-DD');
                        let lastDate = moment(this.$route.params.month).endOf('month').format('YYYY-MM-DD');
                        this.formInline.getTime = [firstDate, lastDate];
                        break;
                    case '4':
                        this.formInline.getTime = [this.$route.params.day, this.$route.params.day];
                        break;
                    case '5':
                        this.formInline.getTime = [this.$route.params.startDay, this.$route.params.endDay];
                        break;
                    default:
                        break;
                }
                setTimeout(() => {
                    this.onSubmit();
                }, 1000);
            }
        },
        getData(param) {
            this.$parent.$refs.formTable.queryPage(this.formInline);
        },
        // 清空按钮
        clearBtnClick() {
            this.formInline = {};
        },
        // 分页查询工单
        onSubmit() {
            if (this.formInline.pushTime && this.formInline.pushTime.length > 0) {
                this.formInline.pushEnd = moment(this.formInline.pushTime[1]).format('YYYY-MM-DD');
                this.formInline.pushStart = moment(this.formInline.pushTime[0]).format('YYYY-MM-DD');
            }
            if (this.formInline.getTime && this.formInline.getTime.length > 0) {
                this.formInline.receiveEnd = moment(this.formInline.getTime[1]).format('YYYY-MM-DD');
                this.formInline.receiveStart = moment(this.formInline.getTime[0]).format('YYYY-MM-DD');
            }
            this.formInline.current = '1'
            this.formInline.sortCol = 'push_time'
            this.formInline.sortType = -1
            delete this.formInline.getTime;
            delete this.formInline.pushTime;
            this.$parent.$refs.formTable.queryPage(this.formInline);
        },
        init() {
            this.regionMap = [];
            region(sessionStorage.getItem("regId")).then((res) => {
                if (res.code == '000000') {
                    this.regionMap = res.data;
                    this.staMap = [];
                }
            });
        },
        queryByCondition(arg) {
            this.staMap = [];
            let params = { regId: arg, stationName: '' };
            queryStationByRegAndName(params).then((res) => {
                if (res.code == '000000') {
                    this.staMap = res.data;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.picker-width{
    width: 300px;
}
.t {
    padding-top: 16px;
    padding-left: 20px;
    border-bottom: 1px solid #eeeeee;
    background: #fcfcfc;
    .inputWidth {
        //input框的长度
        width: 170px;
    }
    .selectWidth {
        //selct选择框长度
        width: 130px;
    }
    .timeWidth {
        //时间选择框
        width: 240px;
    }
    .searchColor {
        //查询按钮的背景颜色和字体颜色
        background-color: #006080;
        color: #fff;
    }
    .emptyColor {
        //清空按钮字体颜色
        color: #006080;
    }
    .interval {
        //表单之间的间隔
        padding-left: 40px;
    }
}
.BTNSearch {
    width: 200px;
}
</style>
