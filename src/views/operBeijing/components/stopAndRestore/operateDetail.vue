<template>
    <!-- 弹出层 停复运详情 -->
    <div class="protr">
        <el-dialog
            :title="detailInfo.planType == '1' ? '停运详情' : '复运详情'"
            :visible.sync="dialogFormVisible"
            top="8%"
            width="1000px"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :before-close="handleClose"
        >
            <div>
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="详情" name="first" class="panes">
                        <div class="title_line"><i />基础信息</div>

                        <div class="panel_info">
                            <div class="OpsModule">
                                <el-form :inline="true" :model="detailInfo" class="infor-form" label-width="110px">
                                    <el-row>
                                        <el-col :span="24"
                                            ><el-form-item label="站名称:">{{ detailInfo.staName }}</el-form-item></el-col
                                        >

                                        <el-col :span="8"
                                            ><el-form-item label="申请编码:">{{ detailInfo.id }}</el-form-item></el-col
                                        >
                                        <el-col :span="8"
                                            ><el-form-item label="申请类型:">{{
                                                translatorDict(DICTDATA.STOP_RESTORE_TYPE, Number(detailInfo.planType))
                                            }}</el-form-item></el-col
                                        >
                                        <el-col :span="8"
                                            ><el-form-item label="工单编号:">{{ detailInfo.workSheetId }}</el-form-item></el-col
                                        >
                                        <el-col :span="8"
                                            ><el-form-item label="申请单位:">{{ detailInfo.applyOrgName }}</el-form-item></el-col
                                        >
                                        <el-col :span="8"
                                            ><el-form-item label="申请来源:">{{
                                                translatorDict(DICTDATA.STOP_AFTER_SOURCE, Number(detailInfo.applySource))
                                            }}</el-form-item></el-col
                                        >
                                        <el-col :span="8" v-if="detailInfo.planType == '1'">
                                            <el-form-item label="申请停运时间:">{{
                                                formatDate('YYYY-mm-dd HH:MM', detailInfo.optStartTime)
                                            }}</el-form-item>
                                        </el-col>
                                        <el-col :span="8" v-if="detailInfo.planType == '1'">
                                            <el-form-item label="预计复运时间:">{{
                                                formatDate('YYYY-mm-dd HH:MM', detailInfo.preReworkTime)
                                            }}</el-form-item>
                                        </el-col>
                                        <el-col :span="8" v-if="detailInfo.planType == '1'">
                                            <el-form-item label="停运标记:">{{
                                                translatorDict(DICTDATA.OFF_STREAM_MARK, Number(detailInfo.offLabel))
                                            }}</el-form-item>
                                        </el-col>
                                        <el-col :span="8" v-if="detailInfo.planType == '1'">
                                            <el-form-item label="停运类型:">{{
                                                translatorDict(DICTDATA.OFF_STREAM_TYPE, Number(detailInfo.offType))
                                            }}</el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="审核状态:">{{
                                                translatorDict(DICTDATA.APPROVE_STATUS, Number(detailInfo.state))
                                            }}</el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="申请人:">{{ detailInfo.applyManName }}</el-form-item>
                                        </el-col>
                                        <el-col :span="8" v-if="detailInfo.planType != '1'">
                                            <el-form-item label="申请复运时间:">{{
                                                formatDate('YYYY-mm-dd HH:MM', detailInfo.optStartTime)
                                            }}</el-form-item>
                                        </el-col>

                                        <el-col :span="8"
                                            ><el-form-item label="申请时间:">{{
                                                formatDate('YYYY-mm-dd HH:MM', detailInfo.applyTime)
                                            }}</el-form-item></el-col
                                        >
                                        <el-col :span="24"
                                            ><el-form-item label="申请原因:">{{ detailInfo.reason }}</el-form-item></el-col
                                        >
                                        <el-col :span="24">
                                            <el-form-item label="申请附件:">
                                                <a
                                                    :href="detailInfo.url"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    v-if="!!detailInfo.url"
                                                    download
                                                    class="download_btn"
                                                    >附件下载</a
                                                >
                                                <span v-else>无附件</span>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </div>
                            <div class="title_line">
                                <i />
                                <span v-if="detailInfo.planType == '1'">申请停运桩</span>
                                <span v-else>申请复运桩</span>&nbsp;&nbsp;&nbsp; <span>桩数：</span
                                ><span class="num_color">{{ stakeNum }}</span>
                            </div>
                            <div>
                                <el-table
                                    :data="detailInfo.proOptDevVos"
                                    style="width: 100%"
                                    max-height="215"
                                    :header-cell-style="{ background: '#f8f8f8 !important', color: '#000' }"
                                >
                                    <el-table-column type="index" width="50" align="center" show-tooltip-when-overflow />
                                    <el-table-column prop="regName" label="区县" width="100px"></el-table-column>
                                    <el-table-column prop="staName" label="站点名称" show-tooltip-when-overflow></el-table-column>
                                    <el-table-column prop="devId" label="充电桩编号" show-tooltip-when-overflow></el-table-column>
                                    <el-table-column prop="devName" label="充电桩名称" show-tooltip-when-overflow></el-table-column>
                                    <el-table-column
                                        prop="engSubType"
                                        label="充电桩类型"
                                        :formatter="devTypeFormat"
                                        show-tooltip-when-overflow
                                    ></el-table-column>
                                    <el-table-column
                                        prop="stakeStatus"
                                        label="充电桩状态"
                                        :formatter="stateFormat"
                                        show-tooltip-when-overflow
                                    ></el-table-column>
                                </el-table>
                            </div>
                            <!-- 审核通过的状态码是3,审核通过后展示这个表格 -->
                            <div v-if="detailInfo.state == 3">
                                <div class="title_line">
                                    <i />
                                    <span>平台执行后桩</span>
                                    &nbsp;&nbsp;&nbsp; <span>桩数：</span><span class="num_color">{{ doneStakeNum }}</span>
                                </div>
                                <div>
                                    <el-table
                                        :data="detailInfo.proOptDevDoneVos"
                                        max-height="215"
                                        style="width: 100%"
                                        :header-cell-style="{ background: '#f8f8f8 !important', color: '#000' }"
                                    >
                                        <el-table-column type="index" width="50" align="center" />
                                        <el-table-column prop="regName" label="区县"></el-table-column>
                                        <el-table-column prop="staName" label="站点名称" show-tooltip-when-overflow></el-table-column>
                                        <el-table-column prop="devId" label="充电桩编号" show-tooltip-when-overflow></el-table-column>
                                        <el-table-column
                                            prop="stakeStatus"
                                            label="充电桩状态"
                                            :formatter="stateFormat"
                                            show-tooltip-when-overflow
                                        ></el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- 日志 -->
                    <el-tab-pane label="日志" name="second" class="panes">
                        <div class="time_lines_zky">
                            <el-timeline :reverse="reverse">
                                <el-timeline-item
                                    v-for="item in activities"
                                    :key="item.id"
                                    :timestamp="formatDate('YYYY-mm-dd HH:MM:SS', item.operaTime)"
                                    size="normal"
                                    placement="bottom"
                                >
                                    <div class="card_zky">
                                        <div class="left_zky">
                                            <p>
                                                <span class="a_label">操作人</span><span class="a">{{ item.operaManName }}</span>
                                                <span class="a_label" style="margin-left: 10px">所属部门</span
                                                ><span class="a">{{ item.orgName }}</span>
                                            </p>
                                            <p>
                                                <span class="a_label">备注</span>
                                                <span class="a">{{ item.descr }}</span>
                                            </p>
                                        </div>
                                        <div class="right_zky">{{ item.checkMess }}</div>
                                    </div>
                                </el-timeline-item>
                            </el-timeline>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <!-- 驳回待修改状态是 6 && activeName == 'first' -->
            <div slot="footer" v-if="detailInfo.state == 6 && activeName == 'first'">
                <el-button class="newButtonColor btnSpace listBTN" @click="modify" style="margin-left: 7px">修改</el-button>
                <el-button class="BatchDeleteColor listBTN" @click="remove" style="margin-left: 7px">删除</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { DICTDATA, translatorDict } from '@/api/dict';
import { formatDate } from '@/utils/DateFormat';
import { deleteById } from '@/api/operBeijing/stopAndRestore';

export default {
    data() {
        return {
            reverse: true, // 正序倒序
            DICTDATA,
            formatDate,
            translatorDict,
            activities: [],
            dialogFormVisible: false,
            activeName: 'first', // 默认打开
            detailInfo: {}, //详情
            stakeNum: '',
            doneStakeNum: '' //执行后
        };
    },
    components: {},
    created() {},

    methods: {
        handleClick(tab) {},
        handleClose() {
            this.dialogFormVisible = false;
            this.activeName = 'first';
        },
        // 修改
        modify() {
            let dialogStop = this.$parent.$refs.tableOperation.$refs.dialogStop;
            // dialogStop.isModify = true;
            // 1是停运
            if (this.detailInfo.planType == '1') {
                dialogStop.signal = 0;
            } else {
                dialogStop.signal = 1;
            }
            if (!!this.detailInfo.url) {
                dialogStop.fileList.push({ url: this.detailInfo.url, name: '附件' });
            }
            this.$nextTick(() => {
                dialogStop.$refs.selectTable.selectTable = JSON.parse(JSON.stringify(this.detailInfo.proOptDevVos));
            });

            dialogStop.formInline = {
                id: this.detailInfo.id,
                optStartTime: this.detailInfo.optStartTime,
                offType: this.detailInfo.offType,
                offLabel: this.detailInfo.offLabel,
                preReworkTime: this.detailInfo.preReworkTime,
                reason: this.detailInfo.reason,
                regId: this.detailInfo.regId,
                staId: this.detailInfo.staId,
                staName: this.detailInfo.staName,
                staStatus: this.detailInfo.staStatus,
                preReworkTime: this.detailInfo.preReworkTime,
                preReworkTime: this.detailInfo.preReworkTime,
                flag: 0,
                planType: this.detailInfo.planType
            };
            dialogStop.dialogFormVisible = true;

            // let selectTable = dialogStop.$refs.selectTable;
            // if (!this.detailInfo.flag) {
            // selectTable.isSiteSelectTable = false;
            // console.log(dialogStop.$refs.selectTable.selectTable,"1");
            // dialogStop.$refs.selectTable.selectTable = this.detailInfo.proOptDevVos;
            //  console.log(dialogStop.$refs.selectTable.selectTable,"2");
            // } else {
            //     selectTable.isSiteSelectTable = true;
            //     selectTable.selectTable.push({
            //         staName: this.detailInfo.staName,
            //         staId: this.detailInfo.staId,
            //         regId: this.detailInfo.regId,
            //         regName: this.detailInfo.regId
            //     });
            // }
        },
        // 删除
        remove() {
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: ''
            }).then(() => {
                deleteById(this.detailInfo.id)
                    .then((res) => {
                        if (res.code === '000000') {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.$parent.$refs.crudForm.getDataInit();
                            this.dialogFormVisible = false;
                        } else {
                            this.$message.error(res.data);
                        }
                    })
                    .catch((res) => {});
            });
        },
        // 桩状态格式化
        stateFormat(row, column, cellValue, index) {
            if (cellValue !== '') {
                return translatorDict(DICTDATA.UNIT_TYPE, cellValue);
            } else {
                return '';
            }
        },
        // 桩类型格式化
        devTypeFormat(row, column, cellValue, index) {
            if (cellValue !== '') {
                return translatorDict(DICTDATA.STAKE_TYPE, cellValue);
            } else {
                return '';
            }
        }
    }
};
</script>
<style lang="scss" scope>
.protr {
    position: relative;
    .el-dialog__body {
        padding: 30px 75px 30px 70px;
    }

    .el-timeline-item {
        height: 80px;
    }
    .el-timeline-item::marker {
        color: #fff;
    }
    .el-row {
        height: 30px !important;
    }
    .el-col {
        height: 30px !important;
    }
    .download_btn {
        color: #0c83ae;
        text-decoration: underline;
    }
    .el-tabs__header {
        margin: 0;
    }
    .el-tabs--card > .el-tabs__header {
        border: none;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border: none;
    }
    .el-timeline-item {
        padding-bottom: 8px;
        &:nth-child(1) {
            .el-timeline-item__node {
                background: #1394c5;
            }
        }
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
        border: 1px solid #dfe4ed;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        border-right: none;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item:last-child {
        border: 1px solid #dfe4ed;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        border-left: none;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
    }
    padding: 8px;
    .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
        background: #1396c2;
        color: white;
        height: 33px;
        line-height: 33px;
    }
    .el-tabs__nav {
        height: 32px;
    }
    .el-tabs__item {
        background: #f9f9f9;
        line-height: 32px;
        width: 150px;
        text-align: center;
        border: 1px solid #dfe4ed;
    }
}

.el-timeline {
    margin-left: 8px;
}
/deep/ .el-timeline-item__node--normal {
    left: 0;
    width: 9px;
    height: 9px;
}
/deep/ .el-timeline-item:nth-child(1) .el-timeline-item__node {
    box-shadow: 0px 0px 7px #1394c5;
}
/deep/ .el-timeline-item__timestamp.is-bottom {
    margin: -59px 0 0 -113px;
    width: 73px;
    text-align-last: right;
    line-height: inherit;
    color: #707070;
}
.time_lines_zky {
    padding: 10px;
    margin-left: 70px;
    .card_zky {
        height: 60px;
        display: flex;
        border-radius: 4px;
        border: 1px solid #e6ebf5;
        background: #f2f2f2;
        .left_zky {
            flex: 1;
            box-sizing: border-box;
            padding-top: 4px;
            width: 100px;
            word-break: break-all;
            white-space: nowrap;
            text-overflow: ellipsis;
            p {
                line-height: 24px;
                .a_label {
                    display: inline-block;
                    width: 90px;
                    text-align: right;
                    color: darkgrey;
                }
                .a {
                    padding-left: 8px;
                }
            }
        }
        .right_zky {
            width: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #eaeaea;
            color: #707070;
        }
    }
}
.title_line {
    margin: 13px 20px 12px 2px;
    i {
        width: 4px;
        height: 14px;
        background: #24b3ca;
        margin-right: 10px;
        margin-top: 3px;
        float: left;
        border-radius: 5px;
        white-space: nowrap;
    }
}
.panel_info {
    /deep/ .el-form-item__label {
        color: #a1a1a1;
        font-size: 13.5px !important;
    }
    /deep/ .el-form-item__content {
        color: #363636;
        font-size: 13.5px;
    }
    /deep/ .el-form-item {
        white-space: nowrap;
    }
    .OpsModule {
        padding: 7px;
        display: flex;
        box-sizing: border-box;
        border: 1px solid #efefef;
        background-color: #f8f8f8;
    }
    .num_color {
        color: #1396c2;
        font-size: 15px;
        margin-top: 2px;
    }
}
.p_title {
    font-size: 16px;
    margin: 15px 0px 10px -2px;
    b {
        color: #1396c2;
    }
}
</style>
