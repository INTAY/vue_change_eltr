<template>
    <div class='info-box'>
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#f1f1f1',color:'#000'}" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column type="index" width="50"/>
            <el-table-column prop="date" label="创建时间" width="180"></el-table-column>
            <el-table-column prop="name" label="标签" width="180"></el-table-column>
            <el-table-column prop="address" label="状态"></el-table-column>
            <el-table-column prop="address" label="标题"></el-table-column>
            <el-table-column prop="address" label="创建人"></el-table-column>
            <el-table-column prop="address" label="解答内容"></el-table-column>
            <el-table-column label="操作" width="370">
                <template>
                    <el-button class="buleBTN" size="mini" @click="getDetail()">详情</el-button>
                    <el-button class="buleBTN" size="mini" @click="dealQuestion()">解答</el-button>
                    <el-button class="buleBTN" size="mini" @click="getLog()">日志</el-button>
                    <el-button class="buleBTN" size="mini" @click="getModifiy()">修改</el-button>
                    <el-button class="redBTN" size="mini" @click="getDel()">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 
            controlDialog 弹窗开关  
            data: 展示的map  
            hasFile 信息详情时显示(true) 
            isAnswer 点击解答 true
            componentName 从来来的(调接口用)
        -->
        <detail-model :show="detailDialog" :data="detailData" :hasFile="qs" :isAnswer="answer" @dialogCtrl="closeDetailDialog"></detail-model>
        <log-model :show="logDialog" :data="logData" @logCtrl="closeLogDialog" :componentName="componentName"></log-model>
        <create-modify-model :title="title" :formInline="modifyData" :show="modifyDialog" :makeTo="makeTo" :useTo="useTo" @closeEvent="retuncloseFun"></create-modify-model>

    </div>
</template>

<script>
    // 通用弹窗   详情   日志   修改
    import detailModel from './detailModel.vue';
    import logModel from './logModel.vue';
    import modifyModel from './modifyModel.vue';
    import createModifyModel from './createOrModifyModel.vue';

    export default {
        data() {
            return {
                tableData: [{
                    date: '2016-05-02',
                    name: 'dddddd',
                    address: '上海市普陀区金沙江路 1518 弄'
                }],
                //  详情弹窗相关
                detailDialog: false,
                detailData: {},
                qs: false,
                answer: false,
                //  日志弹窗相关
                logDialog: false,
                logData: [],
                componentName: 'question',
                //  详情弹窗相关
                makeTo: 'question',
                useTo: 'modify',  //  在这个页面就是修改
                title:'修改',
                modifyDialog: false,
                modifyData: {}
            }
        },
        components: {
            detailModel,
            logModel,
            modifyModel,
            createModifyModel
        },
        methods: {
            handleSelectionChange() {},
            //  在这里获取详情子组件返回的值
            closeDetailDialog(val) {
                this.detailDialog = val.dialogCtrl
                this.answer = val.answer
            },
            //  在这里获取日志子组件返回的值
            closeLogDialog(val) {
                this.logDialog = val.dialogCtrl
                this.answer = val.answer
            },
            //  详情开关
            getDetail() {
                this.detailDialog = true
                this.detailData = {
                    a: '111'
                }
            },
            //  日志弹窗
            getLog() {
                this.logDialog = true
                this.logData = [{
                    operator: '泥煤',
                    content: '活动按期开始',
                    timestamp: '2018-04-15 02:02:22',
                    color: '#1396C2',
                }, {
                    operator: '泥煤',
                    content: '通过审核',
                    timestamp: '2018-04-13 02:02:22'
                }, {
                    operator: '泥煤',
                    content: '创建成功',
                    timestamp: '2018-04-11 02:02:22'
                }]
            },
            //  解答弹窗也是掉详情弹窗，入参不同的是answer
            dealQuestion() {
                this.answer = true
                this.detailDialog = true
                this.detailData = {
                    a: '111'
                }
            },
            getModifiy() {
                this.modifyDialog = true
                this.makeTo = 'question'
                this.modifyData = {
                    name: '111',
                    desc: '222'
                }
                // this.makeTo = 'question'
            },
            //  delete
            getDel() {
                this.$confirm('确认删除该条数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.modifyDialog = false
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }).catch(() => {
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });
            },
            //  子传过来的回调
            retuncloseFun(val) {
                this.modifyDialog = val.dialogstatus
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>