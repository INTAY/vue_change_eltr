<template>
    <div>
        <el-table
            ref="multipleTable"
            :data="siteData"
            tooltip-effect="dark"
            style="width: 100%"
            stripe
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="operaManName" label="操作人"> </el-table-column>
            <el-table-column prop="orgName" label="操作部门" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operaTime" label="操作时间" :formatter="formatDate"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="checkResultName" label="操作状态"> </el-table-column>
            <el-table-column prop="checkMess" label="意见"> </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { selectInfo } from '@/api/operation/planTasks'; //引入工单流程接口
import { mapState } from 'vuex';
export default {
    data() {
        return {
            siteData: []
        };
    },
    computed: {
        ...mapState(['user'])
    },
    created() {
        this.selectInfo({
            busId: this.user.pathData.busId,
            busType: this.user.pathData.busType,
            operateManId: this.user.pathData.operateManId
        });
    },
    methods: {
        handleSelectionChange() {},
        async selectInfo(data) {
            const { data: res } = await selectInfo(data);
            this.siteData = res;
        },
                // 格式化日期
        formatDate(row, column) {
            let data = row[column.property];
            if (data == null) {
                return null;
            }
            let dt = new Date(data);
            return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
        }

    }
};
</script>
<style lang="scss" scoped>
</style>