<template>
    <div>
        <!-- 详情 -->
        <el-dialog
            title="安防工单"
            :visible.sync="dialogFormVisible"
            width="970px"
            class="flaw_fault_manu"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
        >
            <div style="position: relative">
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="任务" name="first" class="panes">
                        <tasks-com class="tasks" ref="tasks"></tasks-com>
                    </el-tab-pane>
                    <el-tab-pane label="工单" name="second" class="panes">
                        <order-com class="order" ref="order" @listenEvent="pushMenuIndex" :currentIndex="menuIndex"></order-com>
                    </el-tab-pane>
                    <el-tab-pane label="日志" name="third" class="panes">
                        <log-com class="log" ref="log"></log-com>
                    </el-tab-pane>
                </el-tabs>
                <el-button type="text" class="detailOrder" v-if="menuIndex != 0 && activeName == 'second'" @click="backOrderDetail"
                    >返回工单详情 >></el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import tasksCom from './tasksCom.vue';
import logCom from './logCom.vue';
import orderCom from './orderCom.vue';

export default {
    components: {
        tasksCom,
        logCom,
        orderCom
    },
    data() {
        return {
            activeName: 'first',
            type: [],
            dialogFormVisible: false,
            activeSwitch: 'tasks',
            returnDetail: false,
            menuIndex: 0
        };
    },
    methods: {
        changeBtn(flag) {
            this.activeSwitch = flag;
        },
        handleClick(tab) {
            // this.menuIndex = 0;
        },
        pushMenuIndex(param) {
            this.menuIndex = param;
        },
        backOrderDetail() {
            this.menuIndex = 0;
        },
        // handleCloseDetailForm(){
        // //   this.$refs.order.$refs.detail.childModel = [];
        //     this.dialogFormVisible = false;
        // },
    }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
    padding: 30px 40px 20px;
}

.flaw_fault_manu {
    /deep/.el-tabs__header {
        margin: 0px !important;
        border: none;
    }
    padding: 8px;
    /deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
        background: #1396c2;
        color: white;
    }
    /deep/.el-tabs__item {
        width: 151px;
        height: 32px;
        line-height: 32px;
        text-align: center;
    }
    /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border: 1px solid #dfe4ed;
        border-radius: 3px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }
    /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
        border-color: #1396c2;
        background-color: #1396c2;
    }
    // 返回工单详情 >>
    .detailOrder {
        position: absolute;
        top: 1px;
        left: 56%;
        font-size: 13px;
        letter-spacing: 1px;
    }
}
</style>