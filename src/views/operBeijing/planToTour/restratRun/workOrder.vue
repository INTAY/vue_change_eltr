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
            <el-table-column prop="handle" label="操作人"> </el-table-column>
            <el-table-column prop="operation" label="操作部门" show-overflow-tooltip></el-table-column>
            <el-table-column prop="time" label="操作时间" :formatter="formatDate" show-overflow-tooltip></el-table-column>
            <el-table-column prop="checkResult" label="操作状态"> </el-table-column>
            <el-table-column prop="opinion" label="意见"> </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            siteData: []
        };
    },
    methods: {
        handleSelectionChange() {},
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