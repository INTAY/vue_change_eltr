<template>
    <div>
        <crud-form
            :field-list="fieldList"
            :api="queryByPage"
            :exportFn="exportAssetGarden"
            :queryParam="formInline"
            :tableOptionWidth="140"
            max-height="690"
            :showCheckbox="false"
            :showColumnHandle="false"
            ref="crudForm"
            @cell-click="cellClick"
        >
            <template slot="searchBar">
                <topform ref="topform" :queryParam="formInline" />
            </template>

            <template slot="tableTopOptionLeft">
                <erji ref="erji" />
            </template>
            <template slot="tableTopOptionRight">
                <el-button class="newButtonColor listBTN" plain @click="downloadExcelTem">下载模版</el-button>
                <el-button class="exportFiles" plain @click="downloadExcelTem">导入文件</el-button>
            </template>
        </crud-form>
        <biaoge ref="biaoge" />
        <!-- 详情 -->
        <el-dialog
            title="详情"
            :visible.sync="dialogFormVisible"
            width="60%"
            class="yw"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
        >
            <el-form ref="form" :model="zoneForm"  size="small" :rules="rules">
                <div class="title"><i />基础信息</div>
                <section class="bg-items" style="line-height: 30px">
                    <el-row>
                        <el-col  :span="24">
                            <span class="a">任务名称：</span><span class="b">{{ zoneForm.taskName }}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10"
                            ><span class="a">处理部门：</span
                            ><span class="b">{{ zoneForm.orgName }}</span></el-col
                        >
                        <el-col :span="6"
                            ><span class="a">&emsp;&emsp;频率：</span><span class="b">{{ zoneForm.freq }}</span></el-col
                        >
                        <el-col :span="6" style="white-space: nowrap"
                            ><span class="a">任务制定时间：</span><span class="b">{{ zoneForm.createdTime }}</span></el-col
                        >
                    </el-row>
                    <el-row>
                        <el-col :span="10"
                            ><span class="a">&emsp;&emsp;周期：</span
                            ><span>{{ zoneForm.period }}</span></el-col
                        >
                        <el-col :span="6"
                            ><span class="a">任务状态：</span><span class="b">{{ zoneForm.state }}</span></el-col
                        >
                        <el-col :span="6" style="white-space: nowrap"
                            ><span class="a">&emsp;&emsp;&emsp;审核人：</span><span class="b">{{ zoneForm.checkManName }}</span></el-col
                        >
                    </el-row>
                </section>

                <!-- 运维模块 -->
                <div class="title"><i />运维模块</div>
                <div class="OpsModule">
                    <el-form ref="form" :model="zoneForm" label-width="110px" size="mini">
                        <el-form-item label="模块名称:">
                            <span>{{ zoneForm.inspName }}</span>
                        </el-form-item>
                        <el-form-item label="主模块:">
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
                <div>
                    <el-table
                        :data="stationData"
                        style="width: 100%"
                        :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                        @selection-change="staChange"
                    >
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
        </el-dialog>
        <!-- 查看桩信息 -->
        <el-dialog
            title="桩信息"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :modal="true"
            :visible.sync="selectStationVisible"
            width="60%"
            class="dialogClass"
        >
            <el-table :data="infoData" style="width: 100%" :header-cell-style="{ background: '#f1f1f1', color: '#000' }">
                <el-table-column type="index" width="50" label="序号" />
                <el-table-column prop="zlFactName" label="直流充电桩厂家" show-tooltip-when-overflow></el-table-column>
                <el-table-column prop="zlRatePower" label="直流充电桩功率"></el-table-column>
                <el-table-column prop="zlStakeCount" label="直流充电桩数"></el-table-column>
                <el-table-column prop="jlRatePower" label="交流充电桩功率"></el-table-column>
                <el-table-column prop="jlFactName" label="交流充电桩厂家" show-tooltip-when-overflow></el-table-column>
                <el-table-column prop="jlStakeCount" label="交流充电桩数"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import { queryByPage, getDetails, operationQueryDevList, onOrderExportExcel } from '@/api/operation/planTasks';

import { menuDelete, exportZone } from '@/api/property/garden';
import crudForm from '@/components/crudForm/index';
import erji from '../components/planTasks/erji';
import topform from '../components/planTasks/topform';
import biaoge from '../components/planTasks/biaoge';
import { sxqxzk } from '@/api/property/stage';
import { DICTDATA, getDict, translatorDict } from '@/api/dict';
// import { getRegNameByCode } from '@/utils/area';
import excelUpload from '@/components/upload/excelUpload';
import request from '@/api/request';
import { zoneUrl } from '@/utils/downloadTemUrls';
import { getChildren } from '@/api/power/resource';
import { exportDataBj } from '@/api/operBeijing/patrolTaskFormulation';
export default {
    data() {
        // 状态
        let statusFormat = (row) => {
            return translatorDict(DICTDATA.INFRASTRUCTURE_STATUS, Number(row.state));
        };
        // 园区类型
        let parkTypeFormat = (row) => {
            return translatorDict(DICTDATA.PARK_TYPE, Number(row.zoneType));
        };
        let formatterName = (row) => {
            if (row.stake_message) {
                return '详情';
            }
        };
        return {
            type: [],
            orgTreeData: [],
            gardenData: [],
            regTreeData: [], //区域数据
            state: [], // 基础设施状态 200
            formInline: {
                taskType: 1,
                sortColumn: 'created_time',
                order: 'desc'
            },
            queryByPage,
            fieldList: [
                { name: '任务编号', value: 'id', clickable: true },
                { name: '区县', value: 'reg_id', width: 80 },
                { name: '站点名称', value: 'sta_name' },
                { name: '站点地址', value: 'addr' },
                { name: '任务名称', value: 'task_name' },
                { name: '任务制定时间', value: 'created_time' },
                { name: '处理部门', value: 'org_id' },
                { name: '任务状态', value: 'state' },
                { name: '任务创建人', value: 'apply_man_name' },
                { name: '周期', value: 'period' },
                { name: '频率', value: 'freq' },
                { name: '总桩数', value: 'total_stake' },
                { name: '桩信息', value: 'stake_message', clickable: true, formatter: formatterName, noSort: true },
                { name: '车联网状态', value: 'evnet_status' },
                { name: '充电站点运营编码', value: 'sta_oper_num' }
                // { name: '交流桩数', value: 'ac_stake' },
                // { name: '直流桩数', value: 'dc_stake' },
            ],
            importUrl: '',
            dialogFormVisible: false,
            zoneForm: {
                addr: '',
                lng: '',
                lat: '',
                areaName: ''
            },
            rules: {
                zoneName: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
                zoneType: [{ required: true, message: '请选择园区类型', trigger: 'change' }],
                orgId: [{ required: true, message: '请选择组织机构', trigger: 'blur' }],
                state: [{ required: true, message: '请选择行政区域', trigger: 'change' }],
                regId: [{ required: true, message: '请选择行政区域', trigger: 'change' }]
            },
            stationData: [],
            selectData: [],
            stationRules: {},
            stationForm: {},
            modelList: [], //  主模块
            childrenModelList: [], //  子模块
            seen: false,
            current: 0,
            modelName: '',
            modelNameMap: [],
            pageData: {
                total: 0,
                current: 1,
                size: 0
            },
            alreadySelectList: [],
            selectStationVisible: false,
            infoData: []
        };
    },
    components: { crudForm, topform, erji, biaoge, excelUpload },
    created() {
        // 获取状态字典
        getDict(DICTDATA.INFRASTRUCTURE_STATUS).then((res) => {
            this.state = res;
        });
        getDict(DICTDATA.PARK_TYPE).then((res) => {
            this.type = res;
        });
        if (!!this.$route.query.id) {
            this.formInline.id = this.$route.query.id;
        }
    },
    methods: {
        //  直流
        stateFormat(row, column) {
            if (row.engsubtype === 1) {
                return '正确';
            } else {
                return '错误';
            }
        },
        //  交流
        staChange() {},
        init() {
            this.$refs.topform.setData();
            this.$refs.erji.setData();
            this.$refs.biaoge.setData();
        },
        mouseEnter(index, id) {
            this.seen = true;
            this.current = index;
            this.childrenModelList = [];
            this.modelList.forEach((item) => {
                item.children.forEach((i) => {
                    if (i.parentId == id) {
                        this.childrenModelList.push(i);
                    }
                });
            });
        },
        mouseleave() {
            this.seen = false;
            this.current = null;
        },
        //下载excel 模版
        downloadExcelTem() {
            let a = document.createElement('a');
            a.href = zoneUrl;
            a.click();
        },
        cellClick(row, column, cell, event) {
            if (column.label == '任务编号') {
                this.dialogFormVisible = true;
                getDetails(row.id).then((res) => {
                    if (res.code === '000000') {
                        this.zoneForm = {
                            taskName: res.data.taskName,
                            orgName: res.data.orgName,
                            checkManName: res.data.checkManName,
                            state: res.data.state,
                            inspName: res.data.inspName,
                            freq: res.data.freq,
                            createdTime: res.data.createdTime,
                            state: res.data.state,
                            period: res.data.period
                        };
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
            } else if (column.label == '桩信息') {
                operationQueryDevList(row.sta_id).then((res) => {
                    if (res.code === '000000') {
                        this.selectStationVisible = true;
                        this.infoData = res.data;
                    }
                });
            }
        },
        //详情
        /**
         * 查看详情
         */

        // 修改
        modify(row) {
            let biaoge = this.$refs.biaoge;
            if (biaoge.checkValue != '') {
                biaoge.checkValue = '';
            }
            biaoge.dialogFormVisible = true;
            biaoge.sizeForm = JSON.parse(JSON.stringify(row));
            if (biaoge.sizeForm.picUrl) {
                biaoge.imageUrl = biaoge.sizeForm.picUrl;
            }
        },
        // 删除
        remove(row) {
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: ''
            }).then(() => {
                menuDelete(row.id)
                    .then((res) => {
                        if (res.code === '000000') {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.$refs.crudForm.getDataInit();
                        } else {
                            this.$message.error('删除失败');
                        }
                    })
                    .catch((err) => {
                        this.$message.error('删除失败');
                    });
            });
        },

        //导出
        exportAssetGarden() {
            this.$refs.crudForm.queryParam = this.$refs.topform.formInline;
            this.$refs.crudForm.getDataInit();
            this.$refs.topform.formInline.headers = this.$refs.crudForm.exportData.headers;
            this.$refs.topform.formInline.values = this.$refs.crudForm.exportData.values;

            this.$confirm('确认导出吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: ''
            }).then(() => {
                this.$message({
                    message: '正在导出，请稍候...',
                    type: 'info'
                });
                exportDataBj(this.$refs.topform.formInline)
                    .then((res) => {
                        if (res.code === '000000') {
                            let aLink = document.createElement('a');
                            aLink.href = res.data;
                            aLink.click();
                            this.$message({
                                message: '导出成功!',
                                type: 'success'
                            });
                        }
                    })
                    .catch((res) => {
                        this.$message({
                            message: '导出失败',
                            type: 'error'
                        });
                    });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
    padding: 0 30px 30px;
}

/deep/ .table-top-option-wrap {
    margin: 0 !important;
}
/deep/ .table-top-option-wrap .right {
    margin: 11px 15px 0 0;
}
/deep/ .el-table {
    margin-top: 5px !important;
}
//运维模块
.OpsModule {
    padding: 20px 0 15px;
    box-sizing: border-box;
    border: 1px solid #efefef;
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
    /deep/ .el-form-item {
        margin-bottom: 10px;
    }
}
.exportFiles {
    width: 120px;
    background: white;
    color: #1396c2;
    border: 1px solid #1396c2;
    margin-left: -1px;
}
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
</style>
