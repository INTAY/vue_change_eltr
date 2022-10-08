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
                        <el-option v-for="item in staMap" :key="item.id" :value="item.id" :label="item.name"> </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="任务名称">
                    <el-input size="mini" placeholder="请输入" v-model="formInline.sheetInfo" clearable></el-input>
                </el-form-item>
                <el-form-item label="工单编号">
                    <el-input size="mini" placeholder="请输入" v-model="formInline.id" clearable></el-input>
                </el-form-item>

                <el-form-item label="任务编号">
                    <el-input size="mini" placeholder="请输入" v-model="formInline.sourceId" clearable></el-input>
                </el-form-item>
                <el-form-item label="处理部门">
                    <el-select size="mini" v-model="formInline.groupId" placeholder="请选择" clearable>
                        <el-option v-for="item in operateSys" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="完成度">
                    <el-input size="mini" placeholder="%" style="width: 82.5px" v-model="formInline.percentFrom" clearable></el-input>
                    <span>&nbsp;-&nbsp;</span>
                    <el-input size="mini" placeholder="%" style="width: 82.5px" v-model="formInline.percentTo" clearable></el-input>
                </el-form-item>
                <el-form-item label="巡查工单状态">
                    <el-select size="mini" v-model="formInline.state" placeholder="全部" clearable>
                        <el-option v-for="item in state" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工单开始时间">
                    <el-date-picker
                        size="mini"
                        v-model="formInline.getTime"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        :picker-options="pickerOptions"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        clearable
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="工单结束时间">
                    <el-date-picker
                        size="mini"
                        v-model="formInline.toTime"
                        type="daterange"
                        range-separator="-"
                        :picker-options="pickerOptions"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        clearable
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" class="newButtonColor SearchBTN" @click="onSubmit()">查询</el-button>
                    <el-button size="mini" class="SearchBTN cancelBTN" @click="formInline = {}">清空</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>
<script>
import { region, queryStationByRegAndName } from '@/api/platform/generalOverview';
import { getOperationTree } from '@/api/operBeijing/patrolFormManage';
import { DICTDATA, getDict, translatorDict } from '@/api/dict';
// import moment from 'moment';
import treeSelect from '@/components/treeSelect/treeSelect';
export default {
    components: { treeSelect },
    data() {
        return {
            operateSys: [],
            type: [],
            orgTreeData: [],
            formInline: {
                sheetType: 8,
                finishTimeFrom: '',
                finishTimeTo: '',
                receiveTimeFrom: '',
                receiveTimeTo: ''
            },
            regTreeData: [],
            regionMap: [],
            staMap: [],
            state: [],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now(); // 选当前时间之前的时间
                }
            },
            orgDefaultProps: {
                value: 'id',
                label: 'name',
                children: 'children'
            }
        };
    },
    mounted() {
        // 获取任务状态字典
        getDict(DICTDATA.ORDER_STATUS).then((res) => {
            // console.log(res,"字典");
            this.state = res;
        });
        this.init();
    },
    created() {},
    methods: {
        init() {
            region(sessionStorage.getItem('regId')).then((res) => {
                if (res.code === '000000') {
                    this.regionMap = res.data;
                    // console.log(this.regionMap, ' this.regionMap');
                    // this.$forceUpdate();
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
        },
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
            queryStationByRegAndName(params).then((res) => {
                if (res.code == '000000') {
                    console.log(res, 'res');
                    this.staMap = res.data;
                }
            });
            // this.$forceUpdate();
        },

        // getValue(value) {
        //     this.formInline.orgId = value;
        // },
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
            // 工单开始时间
            if (!!this.formInline.getTime) {
                this.formInline.receiveTimeFrom = this.formInline.getTime[0];
                this.formInline.receiveTimeTo = this.formInline.getTime[1];
            } else {
                this.formInline.receiveTimeFrom = '';
                this.formInline.receiveTimeTo = '';
            }
            // 工单结束时间
            if (!!this.formInline.toTime) {
                this.formInline.finishTimeFrom = this.formInline.toTime[0];
                this.formInline.finishTimeTo = this.formInline.toTime[1];
            } else {
                this.formInline.finishTimeFrom = '';
                this.formInline.finishTimeTo = '';
            }
            this.formInline.sheetType = 8;
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
        // //工单开始时间
        // startTimeQuantum(e) {
        //     this.formInline.receiveTimeFrom = moment(e[0]).format('YYYY-MM-DD');
        //     this.formInline.receiveTimeTo = moment(e[1]).format('YYYY-MM-DD');
        // },
        // //工单结束时间
        // endTimeQuantum(e) {
        //     this.formInline.finishTimeFrom = moment(e[0]).format('YYYY-MM-DD');
        //     this.formInline.finishTimeTo = moment(e[1]).format('YYYY-MM-DD');
        // }
    }
};
</script>
<style lang="scss" scoped>
/deep/ .el-form-item__label {
    color: #232323 !important;
}
</style>