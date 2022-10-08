<template>
    <div class="tasks">
        <el-form ref="form" :model="zoneForm" label-width="110px" size="small">
            <div class="title"><i />基础信息</div>
            <section class="bg-items" style="line-height: 30px">
                <el-row>
                    <el-col :span="24"
                        ><span span class="a">任务名称：</span><span class="b">{{ zoneForm.taskName }}</span></el-col
                    >
                </el-row>
                <el-row>
                    <el-col :span="8"
                        ><span span class="a">处理部门：</span><span class="b">{{ zoneForm.orgName }}</span></el-col
                    >
                    <el-col :span="5"
                        ><span span class="a">频率：</span><span class="b">{{ zoneForm.freq }}</span></el-col
                    >
                    <el-col :span="7"
                        ><span span class="a">任务制定时间：</span><span class="b">{{ zoneForm.createdTime }}</span></el-col
                    >
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <span span class="a">&emsp;&emsp;周期：</span><span class="b">{{ zoneForm.period }}</span>
                    </el-col>
                    <el-col :span="5"
                        ><span span class="a">审批人：</span><span class="b">{{ zoneForm.checkManName }}</span>
                    </el-col>
                    <el-col :span="7"
                        ><span span class="a">任务状态：</span><span class="b">{{ zoneForm.state }}</span></el-col
                    >
                </el-row>
            </section>
            <!-- 运维模块 -->

            <div class="title"><i />运维模块</div>
            <div class="OpsModule">
                <el-form ref="form" :model="zoneForm" label-width="120px" size="mini">
                    <el-form-item label="模块名称：">
                        <span>{{ zoneForm.inspName }}</span>
                    </el-form-item>
                    <el-form-item label="主模块：">
                        <div class="OpsMain" v-for="(item, index) in modelList" :key="index">
                            <el-popover placement="bottom" width="400" trigger="hover">
                                <el-table :data="item.children" stripe>
                                    <el-table-column type="index" width="50"> </el-table-column>
                                    <el-table-column property="libName" label="子模块名称"></el-table-column>
                                </el-table>
                                <el-button slot="reference" class="btnClass">{{ item.libName }}</el-button>
                            </el-popover>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 站点选择 -->
            <el-row>
                <el-col :span="3">
                    <div class="title"><i />站点选择</div>
                </el-col>
            </el-row>
            <div style="margin-top:-5px;">
                <el-table :data="stationData" style="width: 100%" :header-cell-style="{ background: '#f1f1f1', color: '#000' }">
                    <el-table-column type="index" width="70" align="center" />
                    <el-table-column prop="regName" label="区县" width="180"></el-table-column>
                    <el-table-column prop="staName" label="站名称" width="180"></el-table-column>
                    <el-table-column prop="addr" label="站地址"></el-table-column>
                    <el-table-column prop="totalStakeNum" label="总桩数"></el-table-column>
                    <el-table-column prop="zlStakeNum" label="直流充电桩数"></el-table-column>
                    <el-table-column prop="jlStakeNum" label="交流充电桩数"></el-table-column>
                </el-table>
            </div>
        </el-form>
    </div>
</template>

<script>
import { getDetails } from '@/api/operation/planTasks';
import Bus from '../../../../../src/components/bus.js';
export default {
    data() {
        return {
            type: [],
            orgTreeData: [],
            gardenData: [],
            regTreeData: [], //区域数据
            state: [], // 基础设施状态 200
            formInline: {},
            dialogFormVisible: false,
            zoneForm: {},
            stationData: [],
            stationForm: {},
            modelList: [], //  主模块
            childrenModelList: [], //  子模块
            current: 0
        };
    },
    created() {
        Bus.$on('sendSourceId', (data) => {
            this.getData(data);
        });
    },
    methods: {
        getData(id) {
            getDetails(id).then((res) => {
                if (res.code === '000000') {
                    this.zoneForm = res.data;
                    this.stationData = [
                        {
                            regName: res.data.regName,
                            staName: res.data.staName,
                            addr: res.data.addr,
                            totalStakeNum: res.data.totalStakeNum,
                            zlStakeNum: res.data.zlStakeNum,
                            jlStakeNum: res.data.jlStakeNum
                        }
                    ];
                    this.modelList = res.data.inspectContentDetVos;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.title {
    margin: 15px 0 13px;
    i {
        width: 4px;
        height: 14px;
        // display: inline-block;
        background: #24b3ca;
        margin-right: 10px;
        margin-top: 3px;
        float: left;
        border-radius: 5px;
    }
}
.staSlect {
    width: 100px;
    background: #1396c2;
    color: white;
    border-radius: 5px;
    margin-left: -20px;
}
.staDel {
    width: 100px;
    background: white;
    color: rgb(211, 47, 46);
    border-radius: 3px;
    float: right;
    border: 1px solid rgb(211, 47, 46);
    margin-right: 20px;
}
//  主模块鼠标移入移出样式
.main-model {
    display: flex;
    .item-model {
        width: 200px;
        background: rgb(226, 243, 250);
        border: 1px solid rgb(190, 229, 224);
        margin-left: 10px;
        color: #006080;
        text-align: center;
    }
    .item-table {
        position: absolute;
        left: 20%;
        // top: 10vh;
        z-index: 5;
        background: white;
        padding: 20px;
    }
}
.bg-items {
    padding: 10px 40px;
    background: rgb(248, 248, 248);
    border: 1px solid #efefef;
    .a {
        color: #909090;
    }
    .b {
        color: #363636;
    }
}
//运维模块
.OpsModule {
    padding: 20px 0 10px 0;
    box-sizing: border-box;
    border: 1px solid #efefef;
    // margin-bottom: 29px;
    background-color: #f8f8f8;
    //主模块
    .OpsMain {
        position: relative;
        display: inline-block;
        margin-right: 15px;
        //按钮的半透明颜色
        .btnClass {
            color: #187fa2;
            border-radius: 3px;
            border: 1px solid #b9e2f9;
            background-color: #e2f3fa;
        }
        .btnClass:hover {
            color: #187fa2;
            border-radius: 3px;
            border: 1px solid #7ec0db;
            background-color: #c2e5f3;
        }
    }
    /deep/ .el-form-item__label {
        color: #909090 !important;
        font-size: 14px !important;
    }
    /deep/ .el-form-item__content {
        color: #363636;
    }
}
</style>