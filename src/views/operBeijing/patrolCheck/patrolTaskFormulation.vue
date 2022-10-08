// 巡视任务制定
<template>
    <div>
        <crud-form
            :field-list="fieldList"
            :api="queryByPage"
            :queryParam="formInline"
            :exportFn="exportDataBj"
            :showColumnHandle="false"
            max-height="690"
            :showCheckbox="false"
            ref="crudForm"
        >
            <template slot="searchBar">
                <topform ref="topform" :queryParam="formInline" />
            </template>
            <template slot="tableTopOptionLeft">
                <erji ref="erji" />
            </template>
        </crud-form>
        <!-- <biaoge ref="biaoge" /> -->
        <!-- 详情 -->
        <el-dialog
            title="详情"
            :visible.sync="dialogFormVisible"
            width="950px"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            :before-close="handleCloseDetailForm"
        >
            <!-- <el-form ref="form" :model="zoneForm" label-width="110px" size="small"> -->
            <!-- 站点选择 -->
            <el-row>
                <el-col :span="3"
                    ><div class="title"><i />站点选择</div></el-col
                >
            </el-row>
            <div style="margin: -10px 0 10px 0">
                <el-table :data="stationData" style="width: 100%" :header-cell-style="{ background: '#f8f8f8 !important', color: '#000' }">
                    <el-table-column type="index" width="70" align="center" show-tooltip-when-overflow />
                    <el-table-column prop="regName" label="区县" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="staName" label="站名称" width="180" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="addr" label="站地址" width="180" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="totalStakeNum" label="总桩数" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="zlStakeNum" label="直流充电桩数" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="jlStakeNum" label="交流充电桩数" show-tooltip-when-overflow></el-table-column>
                </el-table>
            </div>
            <!-- 运维模块 -->
            <div class="title"><i />运维模块</div>
            <div class="OpsModule">
                <el-form ref="form" label-width="110px" size="mini">
                    <el-form-item label="模块名称：">
                        <span>{{ zoneForm.inspName }}</span>
                    </el-form-item>
                    <el-form-item label="主模块：">
                        <div class="OpsMain" v-for="(item, index) in modelList" :key="index">
                            <el-popover placement="bottom" width="400" trigger="hover">
                                <el-table :data="item.children" stripe>
                                    <el-table-column type="index" width="50"> </el-table-column>
                                    <el-table-column property="libName" :label="item.libName"></el-table-column>
                                </el-table>
                                <el-button slot="reference" class="btnClass">{{ item.libName }}</el-button>
                            </el-popover>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="title"><i />基础信息</div>
            <div class="OpsModule">
                <el-form ref="form" :model="zoneForm" label-width="110px" size="mini">
                    <el-col :span="24">
                        <el-form-item label="任务名称：">
                            <span>{{ zoneForm.taskName }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="处理部门：">
                            {{ zoneForm.orgName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="截止时间：">
                            {{ zoneForm.deadline }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="任务状态：">
                            {{ zoneForm.state }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="持续时间：">
                            {{ zoneForm.duration }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="实际结束时间：">
                            {{ zoneForm.endDate }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="任务制定时间：">
                            {{ zoneForm.createdTime }}
                        </el-form-item>
                    </el-col>
                        <el-form-item v-if="zoneForm.ignoreReason !='' " label="忽略原因:"  style="margin-left: -10px">
                            <span style="margin-left: 10px">{{ zoneForm.ignoreReason }}</span>
                        </el-form-item>
                    <el-form-item label="巡视原因:" style="margin-top: -15px;margin-left:-10px;">
                        <span style="margin-left: 10px">{{ zoneForm.inspectReason }}</span>
                    </el-form-item>
                    <el-form-item label="照片：" style="margin: -14px 0 5px -2px">
                        <div v-if="urlList == '' || !urlList">无照片</div>
                        <div v-else>
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                                >全选</el-checkbox
                            >
                            &nbsp;&nbsp;
                            <el-button
                                size="mini"
                                @click="handleBatchDownload"
                                :disabled="urlArr == ''"
                                :class="{ newButtonColor: urlArr != '', download_btn: true }"
                                >下载</el-button
                            >
                            <div style="margin: 15px 0"></div>
                            <el-checkbox-group v-model="urlArr" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="item in urlList" :label="item" :key="item">
                                    <el-image :preview-src-list="urlList" style="width: 100px; height: 100px" :src="item"></el-image>
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div style="margin-top: 20px">
                <div style="margin-left: calc(32% - 55px)" v-if="taskState == '撤回' || taskState == '未派发'">
                    <el-button class="newButtonColor btnSpace listBTN" @click="sendTask" style="margin-left: 7px">派发</el-button>
                    <el-button class="newButtonColor btnSpace listBTN" @click="modify" style="margin-left: 7px">修改</el-button>
                    <el-button class="BatchDeleteColor listBTN" v-if="isIgnore" @click="ignore" style="margin-left: 7px">忽略</el-button>
                    <el-button class="BatchDeleteColor listBTN" v-else @click="remove" style="margin-left: 7px">删除</el-button>
                </div>
                <div style="margin-left: calc(48% - 55px)" v-else-if="taskState == '作废' || taskState == '办结'"></div>

                <div style="margin-left: calc(48% - 55px)" v-else-if="taskState == '生成工单'">
                    <el-button class="newButtonColor btnSpace listBTN" @click="reverse" style="margin-left: 7px">撤回</el-button>
                </div>
            </div>
            <!-- </el-form> -->
        </el-dialog>
        <piletable ref="piletable" />
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
    taskRevert,
    taskSend,
    taskdel,
    exportDataBj,
    ignore
} from '@/api/operBeijing/patrolTaskFormulation';
import crudForm from '@/components/crudForm/index';
import erji from '../components/patrolTaskFormulation/erji';
import topform from '../components/patrolTaskFormulation/topform';
import piletable from '../components/patrolTaskFormulation/pileMessage';
import { DICTDATA, getDict, translatorDict } from '@/api/dict';
// import { getRegNameByCode } from '@/utils/area';
import FunLib from '@/utils/mulDownloadPic';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import $ from 'jquery';
export default {
    components: { piletable, crudForm, topform, erji },
    data() {
        let statusFormat = (row) => {
            return translatorDict(DICTDATA.INFRASTRUCTURE_STATUS, Number(row.state));
        };
        let parkTypeFormat = (row) => {
            return translatorDict(DICTDATA.PARK_TYPE, Number(row.zoneType));
        };
        let formatterName = (row) => {
            if (row.stake_message) {
                return '详情';
            }
        };
        let getChargeInfo = (row) => {
            this.$refs.piletable.visible = true;
            operationQueryDevList(row.sta_id).then((res) => {
                if (res.code === '000000') {
                    this.$refs.piletable.pileData = res.data;
                }
            });
        };

        let getInfo = (row) => {
            // console.log(row, 'getInfo');
            this.sign = 1;
            this.isIgnore = false;
            this.taskId = row.id;
            this.taskState = row.state;
            this.dialogFormVisible = true;
            this.urlArr = [];
            this.checkAll = false;
            getDetails(row.id).then((res) => {
                if (res.code === '000000') {
                    this.taskDetail = res;
                    this.urlList = res.data.docUrls;
                    this.zoneForm = {
                        taskName: res.data.taskName,
                        orgName: res.data.orgName,
                        deadline: res.data.deadline,
                        state: res.data.state,
                        endDate: res.data.endDate,
                        inspectReason: res.data.inspectReason,
                        createdTime: res.data.createdTime,
                        state: res.data.state,
                        duration: res.data.duration,
                        inspName: res.data.inspName,
                        ignoreReason: res.data.ignoreReason
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
        };
        return {
            ignoreInfo: {
                id: ''
            },
            ignoreVisible: false, // 忽略原因弹框
            isIgnore: false, // 忽略 /删除
            taskId: '', //任务id
            taskState: '', //任务状态
            taskDetail: '', // 行数据
            type: [],
            orgTreeData: [],
            gardenData: [],
            regTreeData: [], //区域数据
            state: [], // 基础设施状态 200
            formInline: {
                taskType: 4,
                order: 'desc',
                sortColumn: 'created_time'
            },
            queryByPage,
            fieldList: [
                { name: '任务编号', value: 'id', type: 'link', clickFn: getInfo },
                { name: '区县', value: 'reg_id', width: 80 },
                { name: '站点名称', value: 'sta_name' },
                { name: '站点地址', value: 'addr' },
                { name: '任务名称', value: 'task_name' },
                { name: '任务制定时间', value: 'created_time' },
                { name: '处理部门', value: 'org_id' },
                { name: '任务状态', value: 'state' },
                { name: '派发组织', value: 'dispatch_org_id' },
                { name: '派发人', value: 'apply_man_name' },
                { name: '派发日期', value: 'dispatch_time' },
                { name: '直流充电桩数', value: 'dc_stake' },
                { name: '交流充电桩数', value: 'ac_stake' },
                { name: '任务截止时间', value: 'deadline' },
                { name: '实际结束时间', value: 'end_date' },
                { name: '总桩数', value: 'total_stake' },
                { name: '桩信息', value: 'stake_message', type: 'link', formatter: formatterName, clickFn: getChargeInfo, noSort: true },
                { name: '充电站点运营编码', value: 'sta_oper_num' }
            ],
            ignoreRules: {
                ignoreReason: [{ required: true, message: '请填写忽略原因', trigger: 'blur' }]
            },

            importUrl: '',
            dialogFormVisible: false,
            zoneForm: {},
            rules: {},
            stationData: [],
            selectData: [],
            stationRules: {},
            selectStationVisible: false,
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
            infoData: [],
            sign: '',
            checkAll: false,
            isIndeterminate: false,
            urlArr: [],
            urlList: []
        };
    },
    created() {
        // 获取状态字典
        getDict(DICTDATA.INFRASTRUCTURE_STATUS).then((res) => {
            this.state = res;
        });

        getDict(DICTDATA.INFRASTRUCTURE_STATUS).then((res) => {
            this.state = res;
        });
        getDict(DICTDATA.PARK_TYPE).then((res) => {
            this.type = res;
        });
    },
    methods: {
        // 下载图片
        handleBatchDownload() {
            this.$message({
                message: '正在下载，请稍等...',
                type: 'info'
            });
            // console.log(this.urlArr, '<图片标识>');
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
        // 撤回
        reverse() {
            taskRevert(this.taskId)
                .then((res) => {
                    if (res.code === '000000') {
                        this.$message({
                            message: '撤回成功!',
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        // this.$refs.crudForm.getDataInit();
                        if (this.sign == 1) {
                            this.$refs.crudForm.getDataInit();
                        } else {
                            // this.$refs.erji.queryProblem();
                            this.$refs.erji.$refs.crudForm.getDataInit();
                            this.$refs.crudForm.getDataInit();
                        }
                    } else {
                        this.$message.error('撤回失败!');
                    }
                })
                .catch((err) => {
                    this.$message.error('撤回失败!');
                });
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

        // 派发
        sendTask() {
            taskSend(this.taskId)
                .then((res) => {
                    if (res.code === '000000') {
                        this.$message({
                            message: '派发成功!',
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        if (this.sign == 1) {
                            this.$refs.crudForm.getDataInit();
                        } else {
                            // this.$refs.erji.queryProblem();
                            this.$refs.erji.$refs.crudForm.getDataInit();
                            this.$refs.crudForm.getDataInit();
                        }
                    } else {
                        this.$message.error(res.data);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.data);
                });
        },

        // 修改
        modify() {
            let fileList = [];
            if (!!this.urlList) {
                if (!!this.urlList.length) {
                    for (let i = 0; i < this.urlList.length; i++) {
                        fileList.push({ url: this.urlList[i] });
                    }
                }
            }

            let res = this.taskDetail.data;
            // console.log(res,"查看字段");
            let erji = this.$refs.erji;
            erji.isModify = true;
            // console.log(res, '行数据');
            erji.modelName = res.inspId;
            erji.isRevert = res.isRevert;
            erji.stationData = [
                {
                    regName: res.regName,
                    regId: res.regId,
                    stationName: res.staName,
                    address: res.addr,
                    totalStakeNum: res.totalStakeNum,
                    zlStakeNum: res.zlStakeNum,
                    jlStakeNum: res.jlStakeNum,
                    groupId: res.groupId,
                    stationId: res.staId
                }
            ];
            erji.modelList = res.inspectContentDetVos;
            erji.baseInfo = {
                taskName: res.taskName,
                // orgName: res.orgName,
                deadline: res.deadline,
                state: res.state,
                endDate: res.endDate,
                inspectReason: res.inspectReason,
                createdTime: res.createdTime,
                duration: res.duration
            };
            erji.fileList = fileList;
            erji.dialogFormVisible = true;
        },
        // 删除
        remove(row) {
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: ''
            }).then(() => {
                taskdel(this.taskId)
                    .then((res) => {
                        if (res.code === '000000') {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.dialogFormVisible = false;
                            this.$refs.crudForm.getDataInit();
                            // this.$refs.erji.queryProblem();
                            this.$refs.erji.$refs.crudForm.getDataInit();
                        } else {
                            this.$message.error(res.data);
                        }
                    })
                    .catch((err) => {});
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
                    this.ignoreInfo.id = this.taskId;
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
        //导出
        exportDataBj() {
            let formInline = this.$refs.topform.formInline;
            formInline.headers = this.$refs.crudForm.exportData.headers;
            formInline.values = this.$refs.crudForm.exportData.values;
            formInline.taskType = 4;
            // console.log(formInline, 'formInline');
            this.$confirm('确认导出吗?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: ''
            }).then(() => {
                this.$message({
                    message: '正在导出，请稍候...',
                    type: 'info'
                });
                exportDataBj(formInline)
                    .then((res) => {
                        if (res.code === '000000') {
                            let aLink = document.createElement('a');
                            aLink.href = res.data;
                            aLink.click();
                            this.$message({
                                message: '导出成功!',
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: res.data,
                                type: 'warning'
                            });
                        }
                    })
                    .catch((res) => {
                        this.$message({
                            message: res.mesg,
                            type: 'error'
                        });
                    });
            });
        },
        handleCloseDetailForm() {
            this.urlList = [];
            this.dialogFormVisible = false;
        }
    }
};
</script>

<style lang="scss" scoped>
/deep/ .el-upload-list__item {
    transition: none !important;
}
/deep/ .el-dialog__body {
    padding: 20px 35px;
}
/deep/ .el-col {
    height: 30px;
}
/deep/ .el-form-item__content {
    font-size: 13.5px !important;
    color: #232323;
}
/deep/ .el-form-item__label {
    color: #919191;
    font-size: 13.5px !important;
}
.el-checkbox-group {
    /deep/ .el-checkbox__input {
        vertical-align: top;
    }
    /deep/ .el-checkbox__label {
        padding-left: 3px;
    }
}
//运维模块
.OpsModule {
    padding-top: 12px;
    box-sizing: border-box;
    border: 1px solid #efefef;
    margin-bottom: 12px;
    background-color: #f8f8f8;
    //主模块
    .OpsMain {
        position: relative;
        display: inline-block;
        margin: 0 15px 10px 0;
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
}
.exportFiles {
    width: 120px;
    background: white;
    color: #1396c2;
    border: 1px solid #1396c2;
    margin-left: -1px;
}
.title {
    margin: 0 20px 10px 2px;
    width: 70px;
    i {
        width: 4px;
        height: 14px;
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
/deep/ .el-image /deep/.el-icon-circle-close {
    color: #fff;
}
</style>
