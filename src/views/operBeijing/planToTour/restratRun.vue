<template>
    <div class="Scheduler">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick(activeName)">
            <el-tab-pane label="详情" name="first" class="panes">
                <assignment ref="details" />
            </el-tab-pane>
            <el-tab-pane label="工单流程" name="second" class="panes">
                <work-order />
            </el-tab-pane>
            <el-tab-pane label="流程跟踪" name="third" class="panes">
                <log />
            </el-tab-pane>
        </el-tabs>
        <!-- 判断是否处理过 -->
        <div class="handle" v-if="this.user.pathData.state == 0 && activeName == 'first'">
            <el-button class="editorBTN thorght" @click="applyResult(3)">通过</el-button>
            <el-button class="editorBTN back" @click="applyResult(6)">打回</el-button>
        </div>
    </div>
</template>

<script>
//引入组件
import assignment from './restratRun/assignment';//planTasks
import workOrder from './restratRun/workOrder'; //ScheduledTask
import log from './restratRun/log';
import { mapState } from "vuex";
import { examine } from '@/api/operation/planTasks';
export default {
    //注册事件
    components: {
        assignment,
        workOrder,
        log
    },
    data() {
        return {
            activeName: 'first'
        };
    },
    methods: {
        handleClick(tab) {},
        //  审批操作
        async applyResult(arg) {
            if(!this.$refs.details.ruleForm.desc) {
                this.$message({ type: 'warning', message: "审批意见为必填项"})
                return
            }
           try {
                const data = {
                    // orgId: this.user.pathData.orgId,
                    checkMess: this.$refs.details.ruleForm.desc,
                    applyManId: this.$refs.details.detailObj.applyMan,
                    busType: 6,
                    checkResult: arg,
                    // descr: this.user.pathData.descr,
                    // applyId: this.user.pathData.id,
                    level: this.user.pathData.level,
                    busId: this.user.pathData.busId,
                    applyOrgId: this.$refs.details.detailObj.applyOrg
                }
                const { data: res } = await examine(data);
                this.$emit("visblie",false)
                this.$parent.$parent.$refs.crudForm.getDataInit()
           } catch (error) {
                this.$emit("visblie",false)
                this.$parent.$parent.$refs.crudForm.getDataInit()
           }
        },
    },
    computed: { 
        ...mapState(["user"]),
    }
};
</script>

<style lang="scss" scoped>
.Scheduler {
    margin: 35px;
    /deep/.el-tabs__header {
        margin: 0px 0px 22px 0px !important;
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
    .handle {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        .thorght {
            background-color: #1396c2 !important;
            color: #fff !important;
            font-size: 14px;
        }

        //打回
        .back {
            color: #1396c2 !important;
            font-size: 14px;
            border: 1px solid #1396c2 !important;
        }
    }
}
</style>