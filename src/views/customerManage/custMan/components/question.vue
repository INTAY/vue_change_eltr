<template>
    <div class="info-box">
        <el-table
            :data="tableData"
            style="width: 100%"
            :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column type="index" width="50" />
            <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
            <el-table-column prop="labels" label="标签" width="180"></el-table-column>
            <el-table-column prop="state" label="状态"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="creator" label="创建人"></el-table-column>
            <el-table-column prop="answer" label="解答内容"></el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button class="buleBTN" size="mini" @click="getDetail(scope.row)">详情</el-button>
                    <!-- <el-button class="buleBTN" size="mini" @click="dealQuestion()">解答</el-button> -->
                    <el-button class="buleBTN" size="mini" @click="getLog(scope.row)">日志</el-button>
                    <el-button class="buleBTN" size="mini" @click="getModifiy(scope.row)">修改</el-button>
                    <el-button class="redBTN" size="mini" @click="getDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="dl">
            <el-pagination
                style="display: inline-block"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageData.current"
                :page-sizes="[10, 20, 30, 40, 50]"
                :page-size="pageData.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageData.total"
            ></el-pagination>
            <el-button size="mini" @click="refresh">刷新</el-button>
            <!-- <el-button size="mini" @click="exportFun">导出</el-button> -->
        </div>

        <!-- 
            controlDialog 弹窗开关  
            data: 展示的map  
            hasFile 信息详情时显示(true) 
            isAnswer 点击解答 true
            componentName 从哪里来的(调接口用)
        -->
        <detail-model
            :show="detailDialog"
            :data="detailData"
            :hasFile="qs"
            :isAnswer="answer"
            @dialogCtrl="closeDetailDialog"
        ></detail-model>
        <log-model :show="logDialog" :data="logData" @logCtrl="closeLogDialog" :componentName="componentName"></log-model>
        <create-modify-model
            v-if="modifyDialog"
            :title="title"
            :formInline="modifyData"
            :show="modifyDialog"
            :makeTo="makeTo"
            :useTo="useTo"
            @closeEvent="retuncloseFun"
        ></create-modify-model>
    </div>
</template>

<script>
// 通用弹窗   详情   日志   修改
import detailModel from './detailModel.vue';
import logModel from './logModel.vue';
import modifyModel from './modifyModel.vue';
import createModifyModel from './createOrModifyModel.vue';
import { getTree, queryByPage, knowDetail, getEditRec, delKnowDetail, getKnowType } from '@/api/customerService/knowledgeLibrary';
import moment from 'moment';

export default {
    data() {
        return {
            tableData: [],
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
            useTo: 'modify', //  在这个页面就是修改
            title: '修改',
            modifyDialog: false,
            modifyData: {},
            multipleSelection: [],
            pageData: {
                total: 0,
                current: 1,
                size: 0
            },
            formInline: {},
            parentId: '-1'
        };
    },
    components: {
        detailModel,
        logModel,
        modifyModel,
        createModifyModel
    },
    watch: {
       parentId: {
           handler(newName, oldName) {
               this.formInline.knowledgeTypeId = newName
           },
           immediate: true,
           deep: true
       },
   },
    mounted () {
        // debugger
        this.formInline = this.$parent.$parent.$parent.$parent.$refs.searchBar.formInline
        this.formInline.knowledgeTypeId = this.$parent.$parent.$parent.$parent.$refs.tree.parentId
    },
    methods: {
        //  表格数据
        queryData(params) {
            queryByPage(params).then((res) => {
                if (res.code === '000000') {
                    this.tableData = res.data.records;
                    this.pageData = {
                        total: res.data.total,
                        current: res.data.current,
                        pageSize: res.data.size
                    };
                }
            });
        },
        //  多选，组织数据
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((element) => {
                this.multipleSelection.push(element.id);
            });
        },
        //  在这里获取详情子组件返回的值
        closeDetailDialog(val) {
            this.detailDialog = val.dialogCtrl;
            this.answer = val.answer;
        },
        //  在这里获取日志子组件返回的值
        closeLogDialog(val) {
            this.logDialog = val.dialogCtrl;
            this.answer = val.answer;
        },
        //  详情开关
        getDetail(row) {
            this.detailDialog = true;
            knowDetail(row.id).then((res) => {
                if (res.code === '000000') {
                    this.detailData = res.data;
                }
            });
        },
        //  日志弹窗
        getLog(row) {
            this.logDialog = true;
            this.logData = [];
            getEditRec(row.id).then((res) => {
                if (res.code === '000000') {
                    res.data.forEach((item) => {
                        this.logData.push({
                            action: item.action,
                            editManId: item.action,
                            editManName: item.action,
                            editTime: moment(item.editTime).format('YYYY-MM-DD HH:mm:ss'),
                            id: item.action,
                            knowledgeId: item.action
                        });
                    });
                }
            });
        },
        //  解答弹窗也是掉详情弹窗，入参不同的是answer
        dealQuestion() {
            this.answer = true;
            this.detailDialog = true;
            this.detailData = {
                a: '111'
            };
        },
        //  修改
        getModifiy(row) {
            let that = this;
            knowDetail(row.id).then((res) => {
                if (res.code === '000000') {
                    that.modifyData = res.data;
                    that.modifyData.knowledgeTypeId = that.$parent.$parent.$parent.$parent.$refs.tree.parentId;
                    that.modifyData.id = row.id;
                }
            });
            this.modifyDialog = true;
            this.makeTo = 'question';
        },
        //  delete
        getDel(val) {
            this.$confirm('确认删除该条数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    delKnowDetail(val.id).then((res) => {
                        if (res.code === '000000') {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        }
                    });
                    // this.queryData(this.$parent.$parent.$parent.$parent.$refs.searchBar.formInline)
                    this.modifyDialog = false;
                })
                .catch(() => {});
        },
        //  子传过来的回调
        retuncloseFun(val) {
            this.modifyDialog = val.dialogstatus;
        },
        //  =====================分页相关=============
        refresh() {
            let formInline = this.formInline;
            formInline.size = this.pageData.size;
            formInline.current = this.pageData.current;
            this.queryData(formInline);
        },
        /**
         * 每页条数变化
         */
        handleSizeChange(val) {
            let formInline = this.formInline;
            this.pageData.size = val;
            formInline.size = this.pageData.size;
            formInline.current = this.pageData.current;
            this.queryData(formInline);
        },
        /**
         * 点击某页
         */
        handleCurrentChange(val) {
            let formInline = this.formInline;
            this.pageData.current = val;
            formInline.size = this.pageData.pageSize;
            formInline.current = this.pageData.current;
            this.queryData(formInline);
        }
    }
};
</script>

<style lang="scss" scoped>
.dl {
    position: fixed;
    bottom: 0px;
    background: #f7f7f7;
    z-index: 999;
    text-align: center;
    left: 220px;
    right: 0;
    padding: 10px 0;
    line-height: 25px;
}
</style>