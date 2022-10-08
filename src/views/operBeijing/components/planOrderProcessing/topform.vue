<template>
    <div class="planOrder">
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
                <el-form-item label="任务名称">
                    <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.sheetInfo" clearable></el-input>
                </el-form-item>

                <el-form-item label="任务编号">
                    <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.sourceId" clearable></el-input>
                </el-form-item>
                <el-form-item label="计划工单状态">
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
                <el-form-item label="工单编号">
                    <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.id" clearable></el-input>
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
                <el-form-item label="周期开始时间">
                    <el-date-picker
                        size="mini"
                        v-model="formInline.circleStartFrom"
                        type="date"
                        class="pickTimeCom"
                        prefix-icon="222"
                        clearable
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                    >
                    </el-date-picker>
                    -
                    <el-date-picker
                        size="mini"
                        v-model="formInline.circleStartTo"
                        type="date"
                        class="pickTimeCom"
                        clearable
                        :picker-options="pickerCircleStartTo"
                        prefix-icon="222"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="周期结束时间">
                    <el-date-picker
                        size="mini"
                        v-model="formInline.circleEndFrom"
                        type="date"
                        class="pickTimeCom"
                        clearable
                        prefix-icon="222"
                        :picker-options="pickerCircleEndFrom"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                    >
                    </el-date-picker>
                    -
                    <el-date-picker
                        size="mini"
                        v-model="formInline.circleEndTo"
                        type="date"
                        class="pickTimeCom"
                        prefix-icon="222"
                        clearable
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerCircleEndTo"
                        placeholder="选择日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-button size="mini" class="newButtonColor SearchBTN" @click="onSubmit()">查询</el-button>
                <el-button size="mini" class="SearchBTN cancelBTN" @click="(IsRelTime = true), (formInline = { sheetType: 5 })"
                    >清空</el-button
                >
            </div>
        </el-form>
    </div>
</template>
<script>
import { region, queryStationByRegAndName } from '@/api/platform/generalOverview';
import { queryByPage, getOperationTree } from '@/api/operation/planTasks';
import { DICTDATA, getDict, translatorDict } from '@/api/dict';
import treeSelect from '@/components/treeSelect/treeSelect';

export default {
    data() {
        return {
            type: [],
            orgTreeData: [],
            isClearable: true, // 可清空（可选）
            isAccordion: true, // 可收起（可选）
            formInline: {
                sheetType: 5
            },
            regTreeData: [],
            regionMap: [],
            staMap: [],
            state: [],
            //  周期开始时间的to不能大于from
            pickerCircleStartTo: {
                disabledDate: (time) => {
                    let delay = this.formInline.circleStartFrom;
                    if (delay) {
                        return time.getTime() <= new Date(delay).getTime();
                    }
                }
            },
            //  周期结束时间的from要大于周期开始时间的from
            pickerCircleEndFrom: {
                disabledDate: (time) => {
                    let delay = this.formInline.circleStartFrom;
                    if (delay) {
                        return time.getTime() <= new Date(delay).getTime();
                    }
                }
            },
            pickerCircleEndTo: {
                disabledDate: (time) => {
                    let delay = this.formInline.circleStartTo;
                    if (delay) {
                        return time.getTime() <= new Date(delay).getTime();
                    }
                }
            },
            orgDefaultProps: {
                value: 'id',
                label: 'name',
                children: 'children'
            },
            operateSys: []
            // IsRelTime: true //控制查询功能是否开发,默认开放
        };
    },
    components: { treeSelect },
    mounted() {
        this.regionMap = [];
        region(sessionStorage.getItem('regId')).then((res) => {
            if (res.code == '000000') {
                this.regionMap = res.data;
            }
        });
        const _this = this;
        getOperationTree(1).then((res) => {
            if (res.code === '000000') {
                _this.operateSys = res.data;
            }
        });
        this.getData();
    },
    created() {
        // 获取任务状态字典
        getDict(DICTDATA.ORDER_STATUS).then((res) => {
            this.state = res;
        });
    },
    methods: {
        getData() {
            queryByPage(this.formInline).then((res) => {});
        },
        queryByCondition(arg) {
            console.log(arg);
            this.staMap = [];
            let params = { regId: arg, stationName: '' };
            queryStationByRegAndName(params).then((res) => {
                console.log(res, 'jihua');
                if (res.code == '000000') {
                    this.staMap = res.data;
                }
            });
        },

        getValue(value) {
            this.formInline.orgId = value;
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
            // if (this.IsRelTime) {
            this.$parent.$parent.formInline = this.formInline;
            this.$nextTick(() => {
                this.$parent.getDataInit();
            });
            // } else {
            //     this.$message({
            //         message: '周期开开始时间和周期结束时间的有问题',
            //         type: 'warning'
            //     });
            // }
        },
        // 选中组织机构树
        handleNodeClick(item) {
            this.formInline.orgId = item.id;
            this.formInline.orgName = item.name;
            this.visibleOrgTree = false;
        },
        // timeQuantum(e) {
        //     this.formInline.circleStartFrom = e[0];
        //     this.formInline.circleStartTo = e[1];
        //     //判断周期开始的事件和周期结束的时间校验
        //     if (this.formInline.circleEndFrom < this.formInline.circleStartFrom) {
        //         //当时间判断不正常的时候关闭查询接口
        //         this.IsRelTime = false;
        //         this.$message({
        //             message: '周期开始的起始时间不能大于周期结束的起始时间',
        //             type: 'warning'
        //         });
        //         return;
        //     } else if (this.formInline.circleEndTo < this.formInline.circleStartTo) {
        //         //当时间判断不正常的时候关闭查询接口
        //         this.IsRelTime = false;
        //         this.$message({
        //             message: '周期开始的结束时间不能大于周期结束的结束时间',
        //             type: 'warning'
        //         });
        //         return;
        //     }
        //     //当时间判断正常的时候放开查询接口
        //     this.IsRelTime = true;
        // },
        // timeEnd(e) {
        //     this.formInline.circleEndFrom = e[0];
        //     this.formInline.circleEndTo = e[1];
        //     //判断周期开始的事件和周期结束的时间校验
        //     if (this.formInline.circleEndFrom < this.formInline.circleStartFrom) {
        //         //当时间判断不正常的时候关闭查询接口
        //         this.IsRelTime = false;
        //         this.$message({
        //             message: '周期开始的起始时间不能大于周期结束的起始时间',
        //             type: 'warning'
        //         });
        //         return;
        //     } else if (this.formInline.circleEndTo < this.formInline.circleStartTo) {
        //         //当时间判断不正常的时候关闭查询接口
        //         this.IsRelTime = false;
        //         this.$message({
        //             message: '周期开始的结束时间不能大于周期结束的结束时间',
        //             type: 'warning'
        //         });
        //         return;
        //     }
        //     //当时间判断正常的时候放开查询接口
        //     this.IsRelTime = true;
        // },
        getOrg() {
            if (this.formInline.orgIdList) {
                this.formInline.orgId = this.formInline.orgIdList[this.formInline.orgIdList.length - 1];
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.planOrder {
    /deep/ .el-input--prefix .el-input__inner {
        padding: 0 !important;
        font-size: 13px !important;
        text-align: center !important;
    }
    .pickTimeCom {
        width: 82.5px !important;
    }
}
</style>