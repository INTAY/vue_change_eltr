<template>
    <div>
        <el-dialog
            title="桩信息"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :modal-append-to-body="false"
            :modal="true"
            @open="submitButtonDisabled = false"
            width="1020px"
        >
            <el-table ref="multipleTable" :data="pileData" tooltip-effect="dark" style="width: 100%" stripe>
                <el-table-column type="index" width="50" label="序号" />
                <el-table-column prop="zlFactName" label="直流充电桩厂家"  show-tooltip-when-overflow></el-table-column>
                <el-table-column prop="zlRatePower" label="直流充电桩功率" ></el-table-column>
                <el-table-column prop="zlStakeCount" label="直流充电桩数" ></el-table-column>
                <el-table-column prop="jlRatePower" label="交流充电桩功率"></el-table-column>
                <el-table-column prop="jlFactName" label="交流充电桩厂家" show-tooltip-when-overflow></el-table-column>
                <el-table-column prop="jlStakeCount" label="交流充电桩数" ></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>

export default {
    data() {
        return {
            visible: false,
            pileData: [],
        };
    }
};
</script>

<style lang="scss" scoped>
</style>