<template>
    <div>
        <!-- 详情 -->
        <el-dialog
            title="消防工单"
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

        },
        pushMenuIndex(param) {
            this.menuIndex = param
        },
        backOrderDetail() {
            this.menuIndex = 0
        }
    }
};
</script>

<style lang="scss" scoped>
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
        width: 150px;
        text-align: center;
    }
    /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border: 1px solid #dfe4ed;
        border-radius: 4px 4px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }
    .panes {
        border-bottom: 1px solid #e4e7ed;
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