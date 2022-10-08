         
// 巡视工单处理页面 
<template>
    <div>
        <crud-form
            :field-list="fieldList"
            :api="workSheetBjQuery"
            :queryParam="formInline"
            :tableOptionWidth="140"
            :exportFn="exportDataBj"
            max-height="690"
            :showColumnHandle="false"
            ref="crudForm"
            :columnNum='9'
            @cell-click="cellClick"
            :showCheckbox="false"
        >
            <template slot="searchBar">
                <topform ref="topform" :queryParam="formInline" />
            </template>
        </crud-form>
        <biaoge ref="biaoge" />
    </div>
</template>

<script>
import { workSheetBjQuery, getDetails, exportDataBj } from '@/api/operBeijing/patrolFormManage';
import crudForm from '@/components/crudForm/index';
import topform from '../components/safeProtectionOder/topform';
import biaoge from '../components/safeProtectionOder/biaoge';
import { DICTDATA, getDict, translatorDict } from '@/api/dict';
import request from '@/api/request';
import { getChildren } from '@/api/power/resource';
import Bus from '../../../../src/components/bus.js';

export default {
    data() {
        return {
            type: [],
            state: [], // 基础设施状态 200
            formInline: {
                sheetType: 11
                // order: 'desc',
                // sortColumn: 'created_time'
            },
            workSheetBjQuery,
            fieldList: [
                { name: '工单编号', value: 'id', clickable: true },
                { name: '区县', value: 'reg_id', width: 80 },
                { name: '站点名称', value: 'sta_name' },
                { name: '站地址', value: 'addr' },
                { name: '任务名称', value: 'sheet_info' },
                { name: '完成度', value: 'percent' },
                { name: '处理部门', value: 'group_name' },
                { name: '安防工单状态', value: 'state' },
                { name: '工单持续时间', value: 'duration',noSort:true },
                { name: '任务编号', value: 'source_id' },
                { name: '工单开始时间', value: 'receive_time' },
                { name: '工单结束时间', value: 'finish_time' },
                { name: '工单来源', value: 'source_type' }
            ],
            pageData: {
                total: 0,
                current: 1,
                size: 0
            }
        };
    },
    components: { crudForm, topform, biaoge },
    created() {
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
        cellClick(row, column, cell, event) {
            if (column.label == '工单编号') {
                let biaoge = this.$refs.biaoge;
                biaoge.dialogFormVisible = true;
                biaoge.activeName = 'first';
                biaoge.menuIndex = 0;
                //  任务详情需要的
                this.$nextTick(function () {
                    Bus.$emit('sendSourceId', row.source_id);
                    Bus.$emit('sendOrderId', row.id);
                });
            }
        },
        //导出
        exportDataBj() {
            let formInline = this.$refs.topform.formInline;
            formInline.headers = this.$refs.crudForm.exportData.headers;
            formInline.values = this.$refs.crudForm.exportData.values;
            formInline.sheetType = 11;
            // console.log(formInline,"formInline");
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
/deep/ .el-form-item__content {
    font-size: 13.5px !important;
    color: #232323;
}
/deep/ .el-form-item__label {
    color: #919191;
    font-size: 13.5px !important;
}
/deep/ .deal_btn {
    color: #919191;
    font-size: 13.5px;
    font-style: normal;
}
/deep/ .el-checkbox-group {
    /deep/ .el-checkbox__input {
        vertical-align: top;
    }
    /deep/ .el-checkbox__label {
        padding-left: 3px;
    }
}
/deep/ .switch_btn {
    float: right;
}
/deep/ .wrap {
    white-space: nowrap;
}
.exportFiles {
    width: 120px;
    background: white;
    color: #1396c2;
    border: 1px solid #1396c2;
    margin-left: -1px;
}
.title {
    margin: 20px;
    i {
        width: 4px;
        height: 14px;
        display: inline-block;
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
/deep/ .el-icon-circle-close {
    color: #fff;
}
</style>
