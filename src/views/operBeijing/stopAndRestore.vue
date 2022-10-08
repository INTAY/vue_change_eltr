// 停复运管理
<template>
    <div>
        <crud-form
            :field-list="fieldList"
            :api="queryByPage"
            :queryParam="formInline"
            :exportFn="exportDataBj"
            @cell-click="cellClick"
            :showCheckbox="false"
            :columnNum="9"
            :showColumnHandle="false"
            ref="crudForm"
        >
            <template slot="searchBar">
                <fill-bar ref="fillBar" />
            </template>

            <template slot="tableTopOptionLeft">
                <push-button ref="tableOperation" />
            </template>
        </crud-form>
        <operate-detail ref="operateDetail" />
        <charge-table ref="chargeTable" />
    </div>
</template>

<script>
import crudForm from '@/components/crudForm/index';
import {
    queryByPage,
    formatDateTime,
    getProOptApplyBjDetail,
    queryByPlanId,
    getInfos,
    exportDataBj
} from '@/api/operBeijing/stopAndRestore';
import { DICTDATA, getDict, translatorDict } from '@/api/dict';
import operateDetail from './components/stopAndRestore/operateDetail';
import chargeTable from './components/stopAndRestore/chargeTable';
import fillBar from './components/stopAndRestore/fillBar'; //引入formInput框栏
import pushButton from './components/stopAndRestore/pushButton'; //引入点击按钮模块
import moment from 'moment';
export default {
    data() {
        //申请状态
        let formatterState = (row) => {
            return translatorDict(DICTDATA.APPROVE_STATUS, Number(row.state));
        };
        // 站状态
        let formatterStaStatus = (row) => {
            return translatorDict(DICTDATA.UNIT_TYPE, Number(row.staStatus));
        };
        // 申请来源
        let formatterApplySource = (row) => {
            return translatorDict(DICTDATA.STOP_AFTER_SOURCE, Number(row.applySource));
        };

        let formatDate = (row) => {
            return formatDateTime(row.applyTime);
        };
        let formatDate1 = (row) => {
            return formatDateTime(row.optStartTime);
        };
        let formatDate2 = (row) => {
            return formatDateTime(row.preReworkTime);
        };
        //
        let formatterPlanType = (row) => {
            return translatorDict(DICTDATA.STOP_RESTORE_TYPE, Number(row.planType));
        };
        return {
            regTreeData: [], //区域数据
            formInline: {
                order: 'desc',
                sortColumn: 'applyTime',
                startTime: '',
                endTime: moment(new Date()).format('YYYY-MM-DD')
            },
            queryByPage,
            fieldList: [
                { name: '站点名称', value: 'staName', sortBy: 'staId' },
                { name: '申请编号', value: 'id', clickable: true },
                { name: '桩编号', value: 'staId', clickable: true, width: 90 },
                { name: '审核状态', value: 'state', formatter: formatterState, width: 100 },
                { name: '申请类型', value: 'planType', formatter: formatterPlanType, width: 100 },
                { name: '申请停/复运时间', value: 'optStartTime', formatter: formatDate1 },
                { name: '申请时间', value: 'applyTime', formatter: formatDate },
                { name: '申请人', value: 'applyManName' },
                { name: '申请来源', value: 'applySource', formatter: formatterApplySource, width: 100 },
                { name: '申请单位', value: 'applyOrgName' },
                { name: '预计复投时间', value: 'preReworkTime', formatter: formatDate2 },
                { name: '工单编号', value: 'workSheetId', clickable: true },
                { name: '区县', value: 'regId', width: 80 },
                { name: '申请说明', value: 'reason' },
                { name: '站状态', value: 'staStatus', formatter: formatterStaStatus }
            ],
            translate: {}
        };
    },
    components: {
        crudForm,
        fillBar, // fromInput框
        pushButton, //点击按钮模块
        operateDetail,
        chargeTable
    },
    created() {
        if (!!this.$route.query.id) {
            this.formInline.id = this.$route.query.id;
            this.formInline.startTime = '';
            this.formInline.endTime = '';
        } else {
            this.getCurrentMonthFirst();
        }
    },
    methods: {
        // 默认开始时间
        getCurrentMonthFirst() {
            let date = new Date();
            date.setDate(1);
            let month = parseInt(date.getMonth() + 1);
            let day = date.getDate();
            if (month < 10) month = '0' + month;
            if (day < 10) day = '0' + day;
            let startTime = date.getFullYear() + '-' + month + '-' + day;
            this.formInline.startTime = startTime;
        },

        //   列点击
        cellClick(row, column, cell, event) {
            let operateDetail = this.$refs.operateDetail;
            if (column.label == '申请编号') {
                operateDetail.fileName = '';
                // 详情
                getProOptApplyBjDetail(row.id).then((res) => {
                    if (res.code == '000000') {
                        operateDetail.detailInfo = res.data;
                        operateDetail.stakeNum = operateDetail.detailInfo.proOptDevVos.length;
                        operateDetail.doneStakeNum = operateDetail.detailInfo.proOptDevDoneVos.length;
                    }
                });

                // 日志
                getInfos(row.id).then((res) => {
                    if (res.code == '000000') {
                        operateDetail.activities = res.data;
                    }
                });
                operateDetail.dialogFormVisible = true;
            }
            if (column.label == '桩编号') {
                // 桩编号弹窗
                queryByPlanId(row.id).then((res) => {
                    if (res.code == '000000') {
                        this.$refs.chargeTable.chargeTable = res.data;
                    }
                });
                this.$refs.chargeTable.dialogFormVisible = true;
            }
            if (column.label == '工单编号') {
                if (!!row.workSheetId) {
                    this.$router.push({ path: '/operBeijing/flawAfault', query: { id: row.workSheetId } });
                } else {
                    return;
                }
            }
        },
        //导出
        exportDataBj() {
            let formInline = this.$refs.fillBar.formInline;
            if (formInline.getTime) {
                formInline.startTime = formInline.getTime[0];
                formInline.endTime = formInline.getTime[1];
            }
            formInline.headers = this.$refs.crudForm.exportData.headers;
            formInline.values = this.$refs.crudForm.exportData.values;
            // console.log(this.$refs.topform.formInline,"site");
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
                            message: '导出失败!',
                            type: 'error'
                        });
                    });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.default-class {
    width: 100%;
    height: 100%;
    .list {
        height: 100%;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
    }
}
</style>
