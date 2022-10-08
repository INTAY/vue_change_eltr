<template>
    <div>
        <el-form :inline="true" :model="formInline">
            <div class="yi">
                <el-form-item label="区县" class="a">
                    <el-select size="mini" class="xzk" v-model="formInline.regId" @change="queryByCondition" clearable>
                        <el-option v-for="item in regionMap" :key="item.id" :value="item.id" :label="item.name"> </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="站名称">
                    <el-select size="mini" filterable class="xzk" v-model="formInline.staId" clearable>
                        <el-option v-for="item in staMap" :key="item.id" :value="item.stationId" :label="item.stationName"> </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="任务编号" class="a">
                    <el-input size="mini" class="kz" v-model="formInline.sourceId" placeholder="请输入名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="工单编号" class="a">
                    <el-input size="mini" class="kz" v-model="formInline.id" placeholder="请输入名称" clearable></el-input>
                </el-form-item>

                <el-form-item label="特巡工单状态" class="a">
                    <el-select size="mini" clearable v-model="formInline.state" placeholder="全部" class="xzk">
                        <el-option v-for="item in type" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item size="mini" label="工单开始时间" class="a">
                    <el-date-picker
                        clearable
                        v-model="formInline.circleStart_"
                        size="mini"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        @change="timeQuantumZD"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item size="mini" label="工单结束时间" class="a">
                    <el-date-picker
                        clearable
                        v-model="formInline.circelEnd_"
                        size="mini"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        @change="timeQuantumSJ"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="完成度" class="a">
                    <el-input
                        size="mini"
                        placeholder="%"
                        class="inputWidth"
                        style="width: 100px"
                        v-model="formInline.percentFrom"
                        clearable
                    ></el-input>
                    <span>&nbsp;-&nbsp;</span>
                    <el-input
                        size="mini"
                        placeholder="%"
                        class="inputWidth"
                        style="width: 100px"
                        v-model="formInline.percentTo"
                        clearable
                    ></el-input>
                </el-form-item>

                <el-form-item label="处理部门" class="a">
                    <el-select size="mini" v-model="formInline.groupId" placeholder="请选择" clearable>
                        <el-option v-for="item in operateSys" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <span class="btn">
                    <el-button size="mini" class="newButtonColor SearchBTN" @click="onSubmit()">查询</el-button>
                    <el-button size="mini" class="otherBTN SearchBTN" @click="empty()">清空</el-button>
                </span>
            </div>
        </el-form>
    </div>
</template>

<script>
import treeSelect from '@/components/treeSelect/treeSelect';
import { exportZone } from '@/api/property/garden';
import { queryStationAndStakeNum, getOperationTree } from '@/api/operation/planTasks';
import { region, queryStationByRegAndName } from '@/api/platform/generalOverview';
import { getOrgTreeByUser, getAllNextUser } from '@/api/operation/flawAfault'; //处理部门接口查询
export default {
    data() {
        return {
            type: [],
            operateSys: [],
            formInline: {
                sheetType: '6'
            },
            regTreeData: [],
            regTreeData_: [],
            defaultProps: {
                checkStrictly: true,
                children: 'children',
                value: 'id',
                label: 'name'
            },
            IsRelTime: true, //控制查询功能是否开发,默认开放
            regionMap: [],
            staMap: []
        };
    },
    components: { treeSelect },
    created() {
        region(sessionStorage.getItem('regId')).then((res) => {
            if (res.code == '000000') {
                this.regionMap = res.data;
            }
        });
        getOrgTreeByUser().then((res) => {
            this.regTreeData_ = res.data;
        });
        getOperationTree(2).then((res) => {
            if (res.code === '000000') {
                this.operateSys = res.data;
            }
        });
    },
    methods: {
        queryByCondition(arg) {
            this.staMap = [];
            let params = { regId: arg, stationName: '' };
            queryStationAndStakeNum(params).then((res) => {
                if (res.code == '000000') {
                    this.staMap = res.data.records;
                }
            });
        },
        setData() {
            this.regTreeData = this.$parent.$parent.regTreeData;
            this.type = this.$parent.$parent.type;
        },
        //省市区三联框点击后触发
        // 查询
        onSubmit() {
            if (this.IsRelTime) {
                this.$parent.$parent.formInline = this.formInline;
                this.$nextTick(() => {
                    this.$parent.getDataInit();
                });
            } else {
                this.$message({
                    message: '周期开开始时间和周期结束时间的有问题',
                    type: 'warning'
                });
                this.IsRelTime = true;
            }
        },
        // 清空
        empty() {
            this.formInline = { sheetType: '6' };
        },

        // 选中组织机构树
        handleNodeClick(item) {
            this.formInline.orgId = item.id;
            this.formInline.orgName = item.name;
            this.visibleOrgTree = false;
        },
        timeQuantumZD(e) {
            if (e) {
                this.formInline.receiveTimeFrom = e[0];
                this.formInline.receiveTimeTo = e[1];
                //判断周期开始的事件和周期结束的时间校验
                if (this.formInline.finishTimeFrom < this.formInline.receiveTimeFrom) {
                    //当时间判断不正常的时候关闭查询接口
                    this.IsRelTime = false;
                    this.$message({
                        message: '周期开始的起始时间不能大于周期结束的起始时间',
                        type: 'warning'
                    });
                    return;
                } else if (this.formInline.finishTimeTo < this.formInline.receiveTimeTo) {
                    //当时间判断不正常的时候关闭查询接口
                    this.IsRelTime = false;
                    this.$message({
                        message: '周期开始的结束时间不能大于周期结束的结束时间',
                        type: 'warning'
                    });
                    return;
                }
                //当时间判断正常的时候放开查询接口
                this.IsRelTime = true;
            } else {
                this.IsRelTime = true;
                this.formInline.receiveTimeFrom = '';
                this.formInline.receiveTimeTo = '';
            }
        },
        timeQuantumSJ(e) {
            if (e) {
                this.formInline.finishTimeFrom = e[0];
                this.formInline.finishTimeTo = e[1];
                //判断周期开始的事件和周期结束的时间校验
                if (this.formInline.finishTimeFrom < this.formInline.receiveTimeFrom) {
                    //当时间判断不正常的时候关闭查询接口
                    this.IsRelTime = false;
                    this.$message({
                        message: '周期开始的起始时间不能大于周期结束的起始时间',
                        type: 'warning'
                    });
                    return;
                } else if (this.formInline.finishTimeTo < this.formInline.receiveTimeTo) {
                    //当时间判断不正常的时候关闭查询接口
                    this.IsRelTime = false;
                    this.$message({
                        message: '周期开始的结束时间不能大于周期结束的结束时间',
                        type: 'warning'
                    });
                    return;
                }
                //当时间判断正常的时候放开查询接口
                this.IsRelTime = true;
            } else {
                this.IsRelTime = true;
                this.formInline.finishTimeFrom = '';
                this.formInline.finishTimeTo = '';
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.inputWidth {
    width: 84px !important;
}
</style>