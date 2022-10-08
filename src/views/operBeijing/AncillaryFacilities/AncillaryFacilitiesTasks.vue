<template>
    <div>
        <crud-form
            :field-list="fieldList"
            :api="InspectTaskBjQueryByPage"
            :exportFn="exportAssetGarden"
            :showCheckbox="false"
            :queryParam="formInline"
            @cell-click="cellClick"
            :columnNum="8"
            :showColumnHandle="false"
            ref="crudForm"
        >
            <template slot="searchBar">
                <fill-bar ref="topform" :queryParam="formInline" />
            </template>

            <template slot="tableTopOptionLeft">
                <push-button ref="tableOperation" class="pushButton" />
            </template>
        </crud-form>
        <!-- 详情 -->
        <opsdetail ref="opsdetails" />
        <!-- 桩信息 -->
        <piletable ref="piletable" />
    </div>
</template>


<script>
import crudForm from '@/components/crudForm/index';
import { InspectTaskBjQueryByPage, getDetails, operationQueryDevList } from '@/api/operBeijing/PeriodicMaintenance';
import { onOrderExportExcel } from '@/api/operation/planTasks';
import { DICTDATA, getDict, translatorDict } from '@/api/dict';
import opsdetail from '../components/AncillaryFacilitiesTasks/detailMessage';
import piletable from '../components/AncillaryFacilitiesTasks/pileMessage';
import fillBar from '../components/AncillaryFacilitiesTasks/fillBar'; //引入formInput框栏
import pushButton from '../components/AncillaryFacilitiesTasks/pushButton'; //引入点击按钮模块
import { menuDelete, updateById, exportZone } from '@/api/property/garden';
import { mapMutations } from 'vuex';
import { zoneUrl } from '@/utils/downloadTemUrls';
import { exportDataBj } from '@/api/operBeijing/patrolTaskFormulation';


export default {
    components: {
        crudForm,
        fillBar, // fromInput框
        pushButton, //点击按钮模块
        opsdetail,
        piletable
    },

    data() {
        //桩信息显示值修改
        let showDeptName = (row, column) => {
            return '详情';
        };
        //任务制定时间
        let showCreatedTime = (row, column, index) => {
            return row.created_time.slice(0, 16);
        };
        return {
            regTreeData: [], //区域数据
            formInline: {
                taskType: 5,
                order: 'desc', //排序
                sortColumn: 'created_time'
            },
            InspectTaskBjQueryByPage,
            sign: '',
            fieldList: [
                { name: '任务编号', value: 'id', clickable: true },
                { name: '区县', value: 'reg_id' },
                { name: '站点名称', value: 'sta_name' },
                { name: '站点地址', value: 'addr' },
                { name: '任务名称', value: 'task_name' },
                { name: '任务制定时间', value: 'created_time', formatter: showCreatedTime },
                { name: '处理部门', value: 'org_id' },
                { name: '任务状态', value: 'state' },
                { name: '任务截止时间', value: 'deadline', formatter: showCreatedTime },
                { name: '实际结束时间', value: 'end_date', formatter: showCreatedTime },           
                { name: '任务创建人', value: 'apply_man_name' },
                { name: '派发组织', value: 'dispatch_org_id' },
                { name: '派发人', value: 'dispatch_man_name' },
                { name: '派发时间', value: 'dispatch_time', formatter: showCreatedTime },
                { name: '总桩数', value: 'total_stake' },
                { name: '桩信息', value: 'sta_id', clickable: true, formatter: showDeptName,noSort:true },                
                { name: '充电站点运营编码', value: 'sta_oper_num' },
                { name: '任务来源', value: 'task_source' },
                
            ]
        };
    },
    methods: {
        // 引入vuex
        ...mapMutations(['set_Sign']),
        //列点击
        async cellClick(row, column, cell, event) {
            //标记
            this.set_Sign(true)
            let operateDetail = this.$refs;
            if (column.label == '任务编号') {
                //先清空
            operateDetail.opsdetails.isIgnore = false
                operateDetail.opsdetails.OpsModuleForm = {};
                operateDetail.opsdetails.siteData = [];
                //数据请求
                const { data: res } = await getDetails(row.id);
                // console.log(res,"adsdasdsd");
                operateDetail.opsdetails.visible = true; //打开弹窗
                operateDetail.opsdetails.urlList = res.docUrls; //接受照片
                operateDetail.opsdetails.taskId = row.id;  
                operateDetail.opsdetails.taskState = row.state;
                operateDetail.opsdetails.taskDetail = res;
                //运维模块
                operateDetail.opsdetails.OpsModuleForm = res;
                //基础信息
                operateDetail.opsdetails.Basic = [
                    { name: '任务名称:', message: res.taskName },
                    { name: '专用充电站:', message: res.staName },
                    { name: '处理部门:', message: res.orgName },
                    { name: '截止时间:', message: res.deadline },
                    { name: '任务状态:', message: res.state },
                    { name: '持续时间:', message: res.duration },
                    { name: '实际结束时间:', message: res.endDate },
                    { name: '任务制定时间:', message: res.createdTime },
                    { name: '忽略原因:', message: res.ignoreReason },
                    { name: '维护原因:', message: res.inspectReason }
                ];
                //站点选择
                operateDetail.opsdetails.siteData.push(res);
            }
            if (column.label == '桩信息') {
                console.log(row,"row");
                operateDetail.piletable.visible = true;
                const { data: res } = await operationQueryDevList(row.sta_id);
                operateDetail.piletable.pileData = res;
            }
        },
        //导出
        exportAssetGarden() {
            this.$refs.crudForm.queryParam = this.$refs.topform.formInline;
            this.$refs.crudForm.getDataInit();

            this.$confirm('确认导出吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: ''
            }).then(() => {
                exportDataBj(this.$refs.topform.formInline)
                    .then((res) => {
                        if (res.code === '000000') {
                            this.$message({
                                message: '正在导出，请稍候...',
                                type: 'info'
                            });
                            let aLink = document.createElement('a');
                            aLink.href = res.data;
                            aLink.click();
                            this.$message({
                                message: res.mesg,
                                type: 'success'
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
/deep/.el-form-item {
    margin-right: 40px;
}
</style>