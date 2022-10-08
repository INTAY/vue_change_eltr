<template>
    <div>
        <el-dialog
            title="详情"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :modal-append-to-body="false"
            :modal="true"
            @open="submitButtonDisabled = false"
            width="1020px"
        >
            <!-- 站点选择 -->
            <div class="changeSite">
                <div class="title">
                    <div class="sign"></div>
                    <div>站点选择</div>
                </div>
                <!-- 列表 -->
                <el-table ref="multipleTable" :data="siteData" tooltip-effect="dark" style="width: 100%" stripe>
                    <el-table-column type="index" width="50"> </el-table-column>
                    <el-table-column prop="regName" label="区县"> </el-table-column>
                    <el-table-column prop="staName" label="站点名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="addr" label="站点地址" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="totalStakeNum" label="总桩数"> </el-table-column>
                    <el-table-column prop="zlStakeNum" label="直流充电桩数"> </el-table-column>
                    <el-table-column prop="jlStakeNum" label="交流充电桩数"> </el-table-column>
                </el-table>
            </div>

            <!-- 运维模块 -->
            <div class="title">
                <div class="sign"></div>
                <div>运维模块</div>
            </div>
            <div class="OpsModule commonModule">
                <el-form :model="OpsModuleForm" label-width="80px" size="mini">
                    <el-form-item label="模块名称:">
                        <div class="ModuleColor">{{ OpsModuleForm.inspName }}</div>
                    </el-form-item>
                    <el-form-item label="主模块:">
                        <div class="OpsMain" v-for="(item, index) in OpsModuleForm.inspectContentDetVos" :key="index">
                            <el-popover placement="bottom" width="400" trigger="hover">
                                <el-table :data="item.children" stripe>
                                    <el-table-column type="index" width="50"> </el-table-column>
                                    <el-table-column property="libName" label="子模块信息"></el-table-column>
                                </el-table>
                                <el-button slot="reference" class="btnClass">{{ item.libName }}</el-button>
                            </el-popover>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 基础信息 -->
            <div class="title">
                <div class="sign"></div>
                <div>基础信息</div>
            </div>
            <div class="basic commonModule">
                <div
                    v-for="(item, index) in Basic"
                    v-show="item.name != '忽略原因'&&item.message != ''"
                    :key="index"
                    :class="{
                        basic_message: true,
                        ModuleColor: true,
                        first_name: index == 0,
                        center_name: index == 1,
                        second: index == 2,
                        last: index == 5,
                        lst_reason: index == 8
                    }"
                >
                    <div class="basic_message_name">{{ item.name }}</div>
                    <div>{{ item.message }}</div>
                    
                </div>
                <el-form class="formMarignTop">
                    <el-form-item label="照片：" label-width="107px">
                        <div v-if="!!urlList">
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                                >全选</el-checkbox
                            >
                            &nbsp;&nbsp;
                            <el-button size="mini" @click="handleBatchDownload" class="newButtonColor download_btn">下载</el-button>
                            <div style="margin: 15px 0"></div>
                            <el-checkbox-group v-model="urlArr" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="item in urlList" :label="item" :key="item">
                                    <el-image :preview-src-list="urlList" style="width: 100px; height: 100px" :src="item"></el-image>
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div v-else>无照片</div>
                    </el-form-item>
                </el-form>
            </div>

            <span slot="footer" class="dialog-footer">
                <div style="margin-top: 20px">
                    <div style="margin-left: calc(8% - 55px)" v-if="taskState == '撤回' || taskState == '未派发'">
                        <el-button class="newButtonColor btnSpace listBTN" @click="sendTask()" style="margin-left: 7px">派发</el-button>
                        <el-button class="newButtonColor btnSpace listBTN" @click="modify" style="margin-left: 7px">修改</el-button>
                        <el-button class="BatchDeleteColor listBTN" v-if="isIgnore" @click="ignore" style="margin-left: 7px"
                            >忽略</el-button
                        >
                        <el-button class="BatchDeleteColor listBTN" v-else @click="remove" style="margin-left: 7px">删除</el-button>
                    </div>

                    <div style="margin-left: calc(8% - 45px)" v-else-if="taskState == '生成工单'">
                        <el-button class="newButtonColor btnSpace listBTN" @click="reBack" style="margin-left: 7px">撤回</el-button>
                    </div>
                </div>
            </span>
        </el-dialog>
        <!-- 忽略原因弹框 -->
        <el-dialog
            title="忽略原因"
            :visible.sync="ignoreVisible"
            width="600px"
            top="30vh"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
        >
            <el-form ref="ignoreForm" :model="ignoreInfo" :rules="ignoreRules">
                <el-form-item label="忽略原因:" prop="ignoreReason" style="display: flex">
                    <el-input
                        type="textarea"
                        style="width: 400px"
                        :rows="6"
                        v-model="ignoreInfo.ignoreReason"
                        placeholder="请输入忽略原因"
                    ></el-input>
                </el-form-item>
                <span style="margin-left: 130px">
                    <el-button @click="confirmIgnore" class="newButtonColor btnSpace listBTN">确 定</el-button>
                    <el-button @click="cancelIgnore" class="listBTN cancelBTN">取 消</el-button>
                </span>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { taskRevert, taskSend, taskdel } from '@/api/operBeijing/patrolTaskFormulation';
import FunLib from '@/utils/mulDownloadPic';
import { mapState, mapMutations } from 'vuex';
import { ignore } from '@/api/operBeijing/patrolTaskFormulation';
export default {
    data() {
        return {
            isIgnore: false, // 忽略 /删除
            ignoreInfo: {
                id: ''
            },
            ignoreVisible: false, // 忽略原因弹框
            ignoreRules: {
                ignoreReason: [{ required: true, message: '请填写忽略原因', trigger: 'blur' }]
            },
            visible: false,
            taskId: '',
            taskState: '', //任务状态
            sign: '',
            taskDetail: null,
            Basic: [
                { name: '任务名称:', message: '' },
                { name: '处理部门:', message: '' },
                { name: '截止时间:', message: '' },
                { name: '任务状态:', message: '' },
                { name: '专用充电站:', message: '' },
                { name: '持续时间:', message: '' },
                { name: '实际结束时间:', message: '' },
                { name: '任务制定时间:', message: '' },
                { name: '忽略原因:', message: '' },
                { name: '维护原因:', message: '' }
            ],
            OpsModuleForm: {},
            siteData: [],
            checkAll: false,
            isIndeterminate: false,
            checkedCities: ['上海', '北京'],
            urlList: [],
            urlArr: []
        };
    },
    methods: {
        //撤回
        async reBack() {
            try {
                const { data: res } = await taskRevert(this.taskId);
                if (res) {
                    this.$message.success('撤回成功!');
                } else {
                    this.$message({
                        message: '撤回失败',
                        type: 'warning'
                    });
                }

                //关闭弹窗
                this.visible = false;
                //刷新为处理问题窗口
                if (!this.ops.sign) this.$parent.$refs.tableOperation.notOperateQ();
                //刷新页面
                this.$parent.$refs.crudForm.getDataInit();
            } catch (error) {
                this.$message.error('撤回失败');
                //关闭弹窗
                this.visible = false;
            }
        },
        //派发
        async sendTask() {
            const { data: res } = await taskSend(this.taskId);
            try {
                if (res) {
                    this.$message.success('派发成功');
                    this.visible = false;
                } else {
                    this.$message.error(res.data);
                }
            } catch (error) {
                this.$message.error(res.data);
            }
            //刷新页面
            this.$parent.$refs.crudForm.getDataInit();
        },
        //修改
        modify() {
            let fileList = [];
            if (!!this.urlList) {
                if (!!this.urlList.length) {
                    for (let i = 0; i < this.urlList.length; i++) {
                        fileList.push({ url: this.urlList[i] });
                    }
                }
            }
            if (this.ops.sign) {
                let res = this.taskDetail;
                let erji = this.$parent.$refs.tableOperation;
                erji.isModify = true;
                erji.OpsModuleForm.modelName = res.inspId;
                erji.siteData = [
                    {
                        regName: res.regName,
                        regId: res.regId,
                        stationId: res.staId,
                        stationName: res.staName,
                        address: res.addr,
                        totalStakeNum: res.totalStakeNum,
                        zlStakeNum: res.zlStakeNum,
                        jlStakeNum: res.jlStakeNum,
                        groupId: res.groupId
                    }
                ];
                erji.OpsModule = res.inspectContentDetVos;
                erji.formInline = {
                    taskName: res.taskName,
                    deadline: res.deadline,
                    state: res.state,
                    endDate: res.endDate,
                    inspectReason: res.inspectReason,
                    createdTime: res.createdTime,
                    duration: res.duration
                };
                erji.fileList = fileList;
                erji.visible = true;
            } else {
                let res = this.$parent.$refs.tableOperation.taskDetailProblem.data;
                let erji = this.$parent.$refs.tableOperation;
                erji.isModify = true;
                erji.OpsModuleForm.modelName = res.inspId;
                erji.siteData = [
                    {
                        regName: res.regName,
                        regId: res.regId,
                        stationId: res.staId,
                        stationName: res.staName,
                        address: res.addr,
                        totalStakeNum: res.totalStakeNum,
                        zlStakeNum: res.zlStakeNum,
                        jlStakeNum: res.jlStakeNum,
                        groupId: res.groupId
                    }
                ];
                erji.OpsModule = res.inspectContentDetVos;
                erji.formInline = {
                    taskName: res.taskName,
                    deadline: res.deadline,
                    state: res.state,
                    endDate: res.endDate,
                    inspectReason: res.inspectReason,
                    createdTime: res.createdTime,
                    duration: res.duration
                };
                erji.fileList = fileList;
                erji.visible = true;
            }
        },
        //忽略
        remove() {
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: ''
            }).then(() => {
                taskdel(this.taskId)
                    .then((res) => {
                        if (res.code === '000000') {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.visible = false;
                            this.$parent.$refs.crudForm.getDataInit();
                            this.$parent.$refs.tableOperation.queryProblem({ taskType: 5 });
                        } else {
                            this.$message.error('删除失败');
                        }
                    })
                    .catch((err) => {
                        this.$message.error('删除失败');
                    });
            });
        },
        // 忽略按钮
        ignore() {
            this.ignoreVisible = true;
        },
        // 确定忽略
        confirmIgnore() {
            this.$refs['ignoreForm'].validate((valid) => {
                if (valid) {
                    this.ignoreInfo.id = this.taskId;
                    console.log(this.ignoreInfo, '  this.ignoreInfo');
                    ignore(this.ignoreInfo)
                        .then((res) => {
                            if (res.code === '000000') {
                                this.$message({
                                    message: '忽略成功!',
                                    type: 'success'
                                });
                                this.ignoreVisible = false;
                                this.visible = false;
                                this.$refs['ignoreForm'].resetFields();
                                this.$parent.$refs.tableOperation.queryProblem({ taskType: 5 });
                                this.$parent.$refs.crudForm.getDataInit();
                            } else {
                                this.$message.error(res.data);
                            }
                        })
                        .catch((err) => {});
                }
            });
        },
        // 取消忽略
        cancelIgnore() {
            this.ignoreVisible = false;
            this.$refs['ignoreForm'].resetFields();
        },

        handleCheckAllChange(val) {
            this.urlArr = val ? this.urlList : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.urlList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.urlList.length;
        },
        //下载图片功能
        handleBatchDownload() {
            let fliesArr = [];
            //  把所有下载的图片都组装起来放到fliesArr
            for (let i = 0; i < this.urlArr.length; i++) {
                fliesArr.push({
                    url: this.urlArr[i],
                    name: i
                });
            }
            FunLib.download(fliesArr);
        }
    },
    computed: {
        ...mapState(['ops'])
    }
};
</script>

<style lang="scss" scoped>
//标题样式
.title {
    display: flex;
    font-size: 16px;
    margin-bottom: 18px;
    .sign {
        width: 4px;
        height: 15px;
        margin-top: 4px;
        margin-right: 9px;
        border-radius: 5px;
        font-weight: 500;
        background-color: #24b3ca;
    }
}
// 基础信息
.basic {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 30px 18px;
    .basic_message {
        display: flex;
        flex: 25%;
        font-size: 14px;
        padding-top: 15px;
        margin-bottom: 0px;
        .basic_message_name {
            width: 90px;
            margin-right: 12px;
            color: #909090;
            text-align: right;
        }
    }
    /deep/.el-form-item__label {
        color: #909090;
    }
    //审核人
    .center_name {
        flex: 100%;
    }
    //任务名称占比
    .first_name {
        flex: 100%;
    }
    .second {
        flex: 30%;
    }
    //最后一行占比
    .last {
        flex: 30%;
    }
    .lst_reason {
        flex: 100%;
    }
    .formMarignTop {
        margin-top: 8px;
    }
}
//运维模块
.OpsModule {
    padding: 18px 30px;
    //主模块
    .OpsMain {
        position: relative;
        display: inline-block;

        margin-right: 20px;
        //按钮的半透明颜色
        .btnClass {
            color: #187fa2;
            border-radius: 3px;
            border: 1px solid #b9e2f9;
            background-color: #e2f3fa;
        }
        .btnClass:hover {
            color: #187fa2;
            border-radius: 3px;
            border: 1px solid #7ec0db;
            background-color: #c2e5f3;
        }
    }
}
//站点选择
.paginationStyle {
    margin-top: 20px;
}
//基础和运维模块的公共样式
.commonModule {
    box-sizing: border-box;
    border: 1px solid #efefef;
    margin-bottom: 29px;
    background-color: #f8f8f8;
}
//字体颜色
.ModuleColor {
    color: #363636;
}
.changeSite {
    margin-bottom: 25px;
}
/deep/ .el-dialog__body {
    padding: 30px 40px;
}
.relsove {
    margin-bottom: 20px;
}
</style>