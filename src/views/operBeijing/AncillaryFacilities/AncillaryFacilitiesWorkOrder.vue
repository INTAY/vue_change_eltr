<template>
    <div>
        <crud-form
            :field-list="fieldList"
            :api="workSheetBjQuery"
            :showCheckbox="false"
            :exportFn="exportAssetGarden"
            :queryParam="formInline"
            @cell-click="cellClick"
            :columnNum="10"
            :showColumnHandle="false"
            ref="crudForm"
        >
            <template slot="searchBar">
                <fill-bar ref="fillBar" :queryParam="formInline" />
            </template>
        </crud-form>

        <plan-order ref="planOrder" />
    </div>
</template>

<script>
import crudForm from '@/components/crudForm/index';
import { workSheetBjQuery, getDetails, onOrderExportExcel } from '@/api/operation/planTasks'; //分页查询接口、周期工单接口
import fillBar from '../components/AncillaryFacilitiesWorkOrder/fillBar';
import planOrder from '../components/AncillaryFacilitiesWorkOrder/planOrder';
import { mapMutations } from 'vuex';
import Bus from '../../../components/bus';
export default {
    components: {
        crudForm,
        fillBar, // fromInput框
        planOrder
    },
    data() {
        // 当前周期结束时间
        let showCircelEnd = (row, column, index) => {
            return row.receive_time.slice(0, 16);
        };
        // 当前周期开始时间
        let showCircleStart = (row, column, index) => {
            return row.finish_time.slice(0, 16);
        };
        return {
            regTreeData: [], //区域数据
            ISDATA: null,
            formInline: {
                sheetType: 13
            },
            workSheetBjQuery,
            fieldList: [
                { name: '工单编号', value: 'id', clickable: true },
                { name: '区县', value: 'reg_id' },
                { name: '站点名称', value: 'sta_name' },
                { name: '站点地址', value: 'addr' },
                { name: '任务名称', value: 'sheet_info' },
                { name: '任务编号', value: 'source_id' },
                { name: '完成度', value: 'percent' },
                { name: '处理部门', value: 'group_name' },
                { name: '工单状态', value: 'state' },
                { name: '工单持续时长', value: 'duration', noSort: true },
                { name: '工单开始时间', value: 'receive_time' },
                { name: '工单结束时间', value: 'finish_time' },
                { name: '工单来源', value: 'source_type' }
            ]
        };
    },
    methods: {
        // 引入vuex
        ...mapMutations(['set_taskSet']),
        //列点击
        async cellClick(row, column, cell, event) {
            let planOrdeeDetail = this.$refs.planOrder;

            if (column.label == '工单编号') {
                planOrdeeDetail.visible = true;

                const { data: res } = await getDetails(row.source_id);

                //任务传送
                Bus.$emit('IS', res);
                sessionStorage.setItem('IS', JSON.stringify(res));
                //设施编号id，查询设备详情
                Bus.$emit('ISTake', row.id);
                sessionStorage.setItem('ISTake', row.id);
            }
        },
        take() {
            this.$refs.planOrder.visible = true;
        },
        //详情
        detail(row) {
            let dialogDetail = this.$refs.piletable;
            dialogDetail.visible = true;
        },
        spareInfoQueryByPage(data) {
            spareInfoQueryByPage(data).then((res) => {
                let dia = this.$refs.dialogDetail;
                dia.tableData = res.data.records;
                dia.pageData = {
                    total: res.data.total,
                    current: res.data.current,
                    pageSize: res.data.size
                };
            });
        },
        //导出
        exportAssetGarden() {
            this.$refs.crudForm.queryParam = this.$refs.fillBar.formInline;
            this.$refs.crudForm.getDataInit();
            this.$refs.fillBar.formInline.headers = this.$refs.crudForm.exportData.headers;
            this.$refs.fillBar.formInline.values = this.$refs.crudForm.exportData.values;

            this.$confirm('确认导出吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: ''
            }).then(() => {
                onOrderExportExcel(this.$refs.fillBar.formInline)
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
    },
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