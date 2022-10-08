<template>
    <div>
        <crud-form
            :field-list="fieldList"
            :api="queryByPage"
            :exportFn="exportAssetGarden"
            :queryParam="formInline"
            :tableOptionWidth="160"
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
        </crud-form>
        <modifyOrder ref="modifyOrder" />
        <biaoge ref="biaoge" />

        <!-- 详情 -->
        <div class="del_css">
            <el-dialog
                title="详情"
                :visible.sync="dialogFormVisible"
                width="960px"
                class="yw"
                :before-close="handleCloseDetailForm"
                ref="detailDia"
                :close-on-click-modal="false"
                :modal-append-to-body="false"
            >
                <el-form ref="form" :model="zoneForm" label-width="110px" size="small">
                    <!-- 站点选择 -->
                    <el-row>
                        <el-col :span="3"
                            ><div class="title"><i />站点选择</div></el-col
                        >
                    </el-row>
                    <div>
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
                    <!-- 运维模块 -->
                    <div class="title"><i />运维模块</div>
                    <div class="OpsModule">
                        <el-form ref="form" :model="zoneForm" label-width="110px" size="mini">
                            <el-form-item label="模块名称：">
                                <span>{{ zoneForm.inspName }}</span>
                            </el-form-item>
                            <el-form-item label="主模块：">
                                <div class="OpsMain" v-for="(item, index) in zoneForm.inspectContentDetVos" :key="index">
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
                    <div class="title"><i />基础信息</div>
                    <section class="OpsModule">
                        <el-form-item label="任务名称：">
                            <span>{{ zoneForm.taskName }}</span>
                        </el-form-item>
                        <el-col :span="8">
                            <el-form-item label="处理部门：">
                                {{ zoneForm.orgName }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="截止时间：" style="white-space: nowrap">
                                {{ zoneForm.deadline }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="任务状态：">
                                {{ zoneForm.state }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="延续时间：" style="white-space: nowrap">
                                {{ zoneForm.duration }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="实际结束时间：" style="white-space: nowrap">
                                {{ zoneForm.endDate }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="任务制定时间：" style="white-space: nowrap">
                                {{ zoneForm.createdTime }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="忽略原因：">
                                {{ zoneForm.ignoreReason }}
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="照片：">
                                <div v-if="!!urlList">
                                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                                        >全选</el-checkbox
                                    >
                                    &nbsp;&nbsp;
                                    <el-button size="mini" @click="handleBatchDownload" class="newButtonColor download_btn">下载</el-button>
                                    <div style="margin: 15px 0"></div>
                                    <el-checkbox-group v-model="urlArr" @change="handleCheckedCitiesChange">
                                        <el-checkbox v-for="item in urlList" :label="item" :key="item">
                                            <el-image
                                                :preview-src-list="urlList"
                                                style="width: 100px; height: 100px"
                                                :src="item"
                                            ></el-image>
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </div>
                                <div v-else>无照片</div>
                            </el-form-item>
                        </el-col>
                    </section>
                    <div style="margin-top: 20px">
                        <div style="margin-left: calc(32% - 55px)" v-if="taskState == '撤回' || taskState == '未派发'">
                            <el-button class="newButtonColor btnSpace listBTN" @click="reverseOrder" style="margin-left: 7px"
                                >派发</el-button
                            >
                            <el-button class="newButtonColor btnSpace listBTN" @click="modifyOrder" style="margin-left: 7px"
                                >修改</el-button
                            >
                            <el-button class="BatchDeleteColor listBTN" v-if="isIgnore" @click="ignore" style="margin-left: 7px"
                                >忽略</el-button
                            >
                            <el-button class="BatchDeleteColor listBTN" v-else @click="delOrder" style="margin-left: 7px">删除</el-button>
                        </div>
                        <div style="margin-left: calc(48% - 55px)" v-else-if="taskState == '作废' || taskState == '办结'"></div>

                        <div style="margin-left: calc(48% - 55px)" v-else-if="taskState == '生成工单'">
                            <el-button class="newButtonColor btnSpace listBTN" @click="cancleOrder" style="margin-left: 7px"
                                >撤回</el-button
                            >
                        </div>
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
            <!-- 忽略原因弹框 -->
            <el-dialog
                title="忽略原因"
                :visible.sync="ignoreVisible"
                width="600px"
                top="30vh"
                :close-on-click-modal="false"
                :modal-append-to-body="false"
            >
                <el-form ref="ignoreForm" :model="ignoreInfo" :rules="ignoreRules">
                    <el-form-item label="忽略原因:" prop="ignoreReason" style="display: flex">
                        <el-input
                            type="textarea"
                            style="width: 420px"
                            :rows="6"
                            v-model="ignoreInfo.ignoreReason"
                            placeholder="请输入忽略原因"
                        ></el-input>
                    </el-form-item>
                    <span style="margin-left: 130px">
                        <el-button @click="confirmIgnore" class="newButtonColor btnSpace listBTN">确 定</el-button>
                        <el-button @click="cancelIgnore" class="listBTN cancelBTN">取 消</el-button>
                    </span>
                </el-form>
            </el-dialog>
        
    </div>
</template>

<script>
import {
    queryByPage,
    getDetails,
    operationQueryDevList,
    onOrderExportExcel,
    cancel,
    directDispatch,
    reDispatch,
    revert
} from '@/api/operation/planTasks';
import { ignore } from '@/api/operBeijing/patrolTaskFormulation';
import { menuDelete, updateById, exportZone } from '@/api/property/garden';
import crudForm from '@/components/crudForm/index';
import erji from '../components/environmentMaintenance/erji';
import modifyOrder from '../components/environmentMaintenance/modifyOrder';

import topform from '../components/environmentMaintenance/topform';
import biaoge from '../components/environmentMaintenance/biaoge';
import { sxqxzk } from '@/api/property/stage';
import { DICTDATA, getDict, translatorDict } from '@/api/dict';
import { getRegNameByCode } from '@/utils/area';
import excelUpload from '@/components/upload/excelUpload';
import request from '@/api/request';
import { zoneUrl } from '@/utils/downloadTemUrls';
import { getChildren } from '@/api/power/resource';
import FunLib from '@/utils/mulDownloadPic';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import $ from 'jquery';

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
            isIgnore: false, // 忽略 /删除
            ignoreInfo: {
                id: ''
            },
            ignoreVisible: false, // 忽略原因弹框
            ignoreRules: {
                ignoreReason: [{ required: true, message: '请填写忽略原因', trigger: 'blur' }]
            },
            type: [],
            state: [], // 基础设施状态 200
            formInline: {
                taskType: 7,
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
                { name: '任务来源', value: 'task_source' },
                { name: '任务截止时间', value: 'deadline' },
                { name: '实际结束时间', value: 'end_date' },
                { name: '派发组织', value: 'dispatch_org_id' },
                { name: '派发人', value: 'dispatch_man_name' },
                { name: '派发日期', value: 'dispatch_time' },
                { name: '总桩数', value: 'total_stake' },
                { name: '桩信息', value: 'stake_message', clickable: true, formatter: formatterName, noSort: true },
                { name: '充电站点运营编码', value: 'sta_oper_num' }
                // { name: '交流桩数', value: 'ac_stake' },
                // { name: '直流桩数', value: 'dc_stake' },
            ],

            dialogFormVisible: false,
            zoneForm: {},
            stationData: [],
            selectStationVisible: false,
            modelList: [], //  主模块
            pageData: {
                total: 0,
                current: 1,
                size: 0
            },
            infoData: [],
            isIndeterminate: false,
            checkAll: false,
            operateOrderId: '', //  工单操作时候使用的orderid
            taskState: '', //  记录工单状态
            urlList: [],
            urlArr: []
        };
    },
    components: { crudForm, topform, erji, biaoge, excelUpload, modifyOrder },
    created() {
        // 获取状态字典
        getDict(DICTDATA.INFRASTRUCTURE_STATUS).then((res) => {
            this.state = res;
        });
        getDict(DICTDATA.PARK_TYPE).then((res) => {
            this.type = res;
        });
    },
    methods: {
        //下载excel 模版
        downloadExcelTem() {
            let a = document.createElement('a');
            a.href = zoneUrl;
            a.click();
        },
        handleCloseDetailForm() {
            this.urlList = [];
            this.dialogFormVisible = false;
        },
        handleBatchDownload() {
            this.$message({
                message: '正在下载，请稍等...',
                type: 'info'
            });
            let fliesArr = [];
            //  把所有下载的图片都组装起来放到fliesArr
            for (let i = 0; i < this.urlArr.length; i++) {
                fliesArr.push({
                    url: this.urlArr[i],
                    name: i
                });
            }
            FunLib.download(fliesArr);
        },
        cellClick(row, column, cell, event) {
            if (column.label == '任务编号') {
                this.isIgnore = false;
                this.dialogFormVisible = true;
                this.operateOrderId = '';
                this.order_state = '';
                this.operateOrderId = row.id;
                this.order_state = row.state;
                this.urlArr = [];
                this.checkAll = false;
                this.$refs.modifyOrder.isFrom = 'index';

                getDetails(row.id).then((res) => {
                    if (res.code === '000000') {
                        this.taskState = res.data.state;
                        //  基本信息
                        this.urlList = res.data.docUrls;
                        this.zoneForm = res.data;
                        //  已选择的站点
                        this.stationData = [
                            {
                                regName: res.data.regName,
                                staName: res.data.staName,
                                addr: res.data.addr,
                                totalStakeNum: res.data.totalStakeNum,
                                zlStakeNum: res.data.zlStakeNum,
                                jlStakeNum: res.data.jlStakeNum,
                                groupId: res.data.groupId
                            }
                        ];
                        //  主模块
                        this.zoneForm.inspectContentDetVos = res.data.inspectContentDetVos;
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
        //  撤回
        cancleOrder() {
            this.$confirm('确定要撤回吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                revert(this.operateOrderId).then((res) => {
                    if (res.code == '000000') {
                        //  判断在未处理问题点击的操作还是查询页面
                        if (this.$refs.modifyOrder.isFrom == 'index') {
                            this.$refs.crudForm.getDataInit();
                            // this.dialogFormVisible = false;
                        } else {
                            this.$refs.erji.$refs.crudForm.getDataInit();
                            this.$refs.crudForm.getDataInit();
                        }
                        this.dialogFormVisible = false;

                        this.$message({ type: 'success', message: '撤回成功' });
                    }
                });
            });
        },
        //  派发
        async reverseOrder() {
            try {
                const { data: res } = await directDispatch(this.operateOrderId);
                this.$message({ type: 'success', message: '派发成功' });
                //  判断在未处理问题点击的操作还是查询页面
                if (this.$refs.modifyOrder.isFrom == 'index') {
                    this.$refs.crudForm.getDataInit();
                    // this.dialogFormVisible = false;
                } else {
                    this.$refs.erji.$refs.crudForm.getDataInit();
                    this.$refs.crudForm.getDataInit();
                }
                this.dialogFormVisible = false;
            } catch (error) {
                this.$message({ type: 'error', message: error });
            }
        },
        //  修改
        modifyOrder() {
            //  修改页面出现，详情页面消息
            this.dialogFormVisible = false;
            this.$refs.modifyOrder.modifyFormVisible = true;
            //  已选站点赋值
            this.$refs.modifyOrder.stationData = this.stationData;
            //  主模块id赋值
            this.$refs.modifyOrder.modelName = this.zoneForm.inspId;
            this.$refs.modifyOrder.modelList = this.zoneForm.inspectContentDetVos;
            this.$refs.modifyOrder.baseInfo = this.zoneForm;
            this.$refs.modifyOrder.orderID = this.operateOrderId;
        },
        //  删除
        async delOrder() {
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                cancel(this.operateOrderId).then((res) => {
                    if (res.code == '000000') {
                        this.$message({ type: 'success', message: '删除成功' });
                        //  刷新接口关闭弹窗
                        if (this.$refs.modifyOrder.isFrom == 'index') {
                            this.$refs.crudForm.getDataInit();
                            // this.dialogFormVisible = false;
                        } else {
                            this.$refs.erji.$refs.crudForm.getDataInit();
                            this.$refs.crudForm.getDataInit();
                        }
                        this.dialogFormVisible = false;
                    }
                });
            });
        },
        // 忽略按钮
        ignore() {
            this.ignoreVisible = true;
        },
        // 确定忽略
        confirmIgnore() {
            this.$refs['ignoreForm'].validate((valid) => {
                if (valid) {
                    this.ignoreInfo.id = this.operateOrderId;
                    console.log(this.ignoreInfo, '  this.ignoreInfo');
                    ignore(this.ignoreInfo)
                        .then((res) => {
                            if (res.code === '000000') {
                                this.$message({
                                    message: '忽略成功!',
                                    type: 'success'
                                });
                                this.ignoreVisible = false;
                                this.dialogFormVisible = false;
                                this.$refs['ignoreForm'].resetFields();
                                this.$refs.erji.$refs.crudForm.getDataInit();
                                this.$refs.crudForm.getDataInit();
                            } else {
                                this.$message.error(res.data);
                            }
                        })
                        .catch((err) => {});
                }
            });
        },
        // 取消忽略
        cancelIgnore() {
            this.ignoreVisible = false;
            this.$refs['ignoreForm'].resetFields();
        },

        handleCheckAllChange(val) {
            this.urlArr = val ? this.urlList : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.urlList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.urlList.length;
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
                onOrderExportExcel(this.$refs.topform.formInline)
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
    padding: 15px 0;
    box-sizing: border-box;
    border: 1px solid #efefef;
    margin-bottom: 15px;
    background-color: #f8f8f8;
    float: left;
    width: 100%;
    //主模块
    .OpsMain {
        position: relative;
        display: inline-block;
        margin-bottom: 5px;
        margin-right: 20px;
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
    /deep/ .el-form-item {
        margin-bottom: 0 !important;
    }
    /deep/ .el-form-item__label {
        color: #909090 !important;
        font-size: 14px !important;
    }
    /deep/ .el-form-item__content {
        color: #363636;
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
    padding: 10px 20px;
    background: rgb(248, 248, 248);
}
.del_css {
    /deep/ .el-dialog__body {
        padding: 0 30px 20px;
        color: #606266;
        font-size: 14px;
        word-break: break-all;
        display: flow-root;
    }
}
.demo-form-inline {
    padding: 0 40px;
}
</style>
