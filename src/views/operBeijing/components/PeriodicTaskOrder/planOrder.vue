<template>
    <div class="flaw_fault_manu">
        <el-dialog
            title="周期工单任务"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :modal-append-to-body="false"
            :modal="true"
            @open="submitButtonDisabled = false"
            :before-close="handleClose"
            width="1020px"
        >
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick(activeName)">
                <el-tab-pane label="任务" name="first" class="panes">
                    <assignment />
                </el-tab-pane>
                <el-tab-pane label="工单" name="second" class="panes">
                    <work-order />
                </el-tab-pane>
                <el-tab-pane label="日志" name="third" class="panes">
                    <log />
                </el-tab-pane>
            </el-tabs>
            <!-- 返回详情页面 -->
            <el-button type="text" class="detailOrder" v-if="!ops.detailOrder" @click="backOrderDetail">返回工单详情 >></el-button>
        </el-dialog>
    </div>
</template>

<script>
import assignment from './assignment';
import workOrder from './workOrder';
import log from './log';
import { mapMutations, mapState } from 'vuex';
export default {
    components: {
        assignment,
        workOrder,
        log
    },
    props:['fillData'],
    data() {
        return {
            visible: false,
            activeName: 'first',
        };
    },
    computed: {
        //引用vuex模块传输数据
        ...mapState(['ops'])
    },
    methods: {
        //引用vuex操作数据
        ...mapMutations(['set_detailOrder', 'set_checkOrderOther']),
        //切换
        handleClick(tab) {
            //判断切换到工单时,显示工单详情页面，按钮取消
            if (tab == 'second') this.set_checkOrderOther(5) 
            else this.set_detailOrder(true)          
        },
        //返回工单详情
        backOrderDetail() {
            this.set_checkOrderOther(5); //显示
            this.activeName = 'second';//返回周期工单选项
        },
        handleClose(val) {
            this.visible = false;
            this.activeName = 'first'
        }
    }
};
</script>

<style lang="scss" scoped>
.flaw_fault_manu {
    /deep/.el-dialog__body {
        padding: 20px 30px 26px 40px;
    }
    
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
    /deep/.el-tabs__nav .is-top {
        border-bottom: 1px solid #cecece;
    }
    // 返回工单详情 >>
    .detailOrder {
        position: absolute;
        top: 65px;
        left: 50%;
        font-size: 14px;
        letter-spacing: 2px;
    }
}
</style>