<template>
    <div class="Scheduler">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick(activeName)">
            <el-tab-pane label="详情" name="first" >
                <assignment ref="details" />
            </el-tab-pane>
            <el-tab-pane label="工单流程" name="second">
                <work-order />
            </el-tab-pane>
            <el-tab-pane label="流程跟踪" name="third">
                <log />
            </el-tab-pane>
        </el-tabs>
        <div class="handle" v-if="activeName == 'first'">
            <el-button class="editorBTN thorght" @click="transitOrBack(3)">通过</el-button>
            <el-button class="editorBTN back" @click="transitOrBack(6)">打回</el-button>
        </div>
    </div>
</template>

<script>
//引入组件
import assignment from './Scheduler/assignment'; //planTasks
import workOrder from './Scheduler/workOrder'; //ScheduledTask
import log from './Scheduler/log';
import { mapState } from "vuex";
import { taskExamine } from '@/api/operation/planTasks'; //通过和打回的接口

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
    computed: { 
        ...mapState(["user"]),
    },
    methods: {
        handleClick(tab) {},
        //通过或者打回
        async transitOrBack(arg) {
            try {
                const { data: res } = await taskExamine({
                    // orgId: this.user.pathData.orgId,
                    checkMess: this.$refs.details.ruleForm.desc,
                    applyManId: this.$refs.details.detailObj.applyMan,
                    busType: 4, //判断业务类型的
                    checkResult: arg,
                    // descr: this.user.pathData.descr,
                    // applyId: this.user.pathData.id,
                    busId: this.user.pathData.busId,
                    level: this.user.pathData.level,
                    applyOrgId: this.$refs.details.detailObj.dispatchOrgId
                });

                //子组件传给父组件 关闭弹窗
                this.$emit('visblie', false);
                //返回成功的信息
                this.$message({
                    message: res.data,
                    type: 'success'
                });
                //重新刷新分页页面
                this.$parent.$parent.$refs.crudForm.getDataInit()
            } catch (error) {
                //关闭弹窗
                this.$emit('visblie', false);
                //失败返回信息
                this.$message.error(error);
                //重新刷新分页页面
                this.$parent.$parent.$refs.crudForm.getDataInit()
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.Scheduler {
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
        // .el-button {

        //通过
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
        // }
    }
}
</style>