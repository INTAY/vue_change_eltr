<template>
    <div>
        <!-- 表格区域 -->
        <div style="position: relative">
            <div class="btn-del">
                <el-button class="BatchDeleteColor btn_width" size="mini" @click="chooseDelete">删除</el-button>
            </div>

            <el-table
                :data="selectTable"
                max-height="300"
                :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                stripe
                style="width: 100%"
                @selection-change="selectionChange"
            >
                <el-table-column label="序号" type="index" width="50" />
                <el-table-column type="selection" align="center" width="50" />
                <el-table-column label="区县" show-overflow-tooltip prop="regName"></el-table-column>
                <el-table-column label="站点名称" show-overflow-tooltip prop="staName"></el-table-column>
                <el-table-column label="充电桩编号" v-if="!isSiteSelectTable" show-overflow-tooltip prop="id"></el-table-column>
                <el-table-column label="充电桩名称" v-if="!isSiteSelectTable" prop="devName"></el-table-column>
                <el-table-column label="充电桩类型" v-if="!isSiteSelectTable" :formatter="devTypeFormat" prop="devType"></el-table-column>
                <el-table-column
                    label="充电桩状态"
                    v-if="!isSiteSelectTable"
                    :formatter="statusFormat"
                    show-overflow-tooltip
                    prop="state"
                ></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { DICTDATA, translatorDict } from '@/api/dict';

export default {
    data() {
        return {
            selectTable: [],
            isSiteSelectTable: false,
            stakeMap: []
        };
    },
//    watch:{
// selectTable(val){
// console.log(this.$parent.staNum,"长度");
// this.$parent.staNum = val.length
// console.log(this.$parent.staNum,"长度");
// }
//    },
    methods: {
        // 桩状态格式化
        statusFormat(row, column, cellValue, index) {
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
        },
        // 删除
        chooseDelete() {
            if (!this.stakeMap.length) {
                this.$message.warning('未选中任何数据!');
            } else {
                this.stakeMap.forEach((item) => {
                    for (let i = 0; i < this.selectTable.length; i++) {
                        if (this.selectTable[i].id === item.id) {
                            this.selectTable.splice(i, 1);
                            break;
                        }
                    }
                });
            }
        },
        selectionChange(val) {
            this.stakeMap = val;
        }
    }
};
</script>
<style lang="scss" scope>
.btn-del {
    position: absolute;
    float: right;
    right: 2px;
    top: -37.5px;
}
</style>