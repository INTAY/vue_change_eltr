<template>
    <div>
        <!-- 基础信息 -->
        <div class="title">
            <div class="sign"></div>
            <div>基本信息</div>
        </div>
        <div class="basic commonModule">
            <div
                v-for="(item, index) in Basic"
                :key="index"
                :class="{
                    basic_message: true,
                    ModuleColor: true,
                    first_name: index == 0,
                    center_name: index == 1
                }"
            >
                <div class="basic_message_name">{{ item.name }}</div>
                <div>{{ item.message }}</div>
            </div>
        </div>
        <!-- 运维模块 -->
        <div class="title">
            <div class="sign"></div>
            <div>运维模块</div>
        </div>
        <div class="OpsModule commonModule">
            <el-form ref="form" :model="OpsModuleForm" label-width="80px" size="mini">
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
        <!-- 站点选择 -->
        <div class="changeSite">
            <div class="title">
                <div class="sign"></div>
                <div>站点选择</div>
            </div>
            <!-- 列表 -->
            <el-table
                ref="multipleTable"
                :data="siteData"
                tooltip-effect="dark"
                style="width: 100%"
                stripe
            >
                <el-table-column type="index" width="50"> </el-table-column>
                <el-table-column prop="regName" label="区县"> </el-table-column>
                <el-table-column prop="staName" label="站点名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="addr" label="站点地址" show-overflow-tooltip></el-table-column>
                <el-table-column prop="totalStakeNum" label="总桩数"> </el-table-column>
                <el-table-column prop="zlStakeNum" label="直流充电桩数"> </el-table-column>
                <el-table-column prop="jlStakeNum" label="交流充电桩数"> </el-table-column>
            </el-table>
        </div>
        <!-- 审批意见 -->
        <div class="approval">
            <div class="title">
                <div class="sign"></div>
                <div>审批意见</div>
            </div>
            <div class="textInput"><el-input type="textarea" v-model="ruleForm.desc"></el-input></div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { getDetails } from '@/api/operation/planTasks'; //引入详情
export default {
    data() {
        return {
            Basic: [],
            OpsModuleForm: {},
            siteData: [],
            ruleForm: {},
            detailObj: {}
        };
    },
    computed: {
        ...mapState(['user'])
    },
    created() {
        let id = this.user.pathData.busId;
        this.detail(id);
    },
    methods: {
        //详情页面
        async detail(id) {
            try {
                const { data: res } = await getDetails(id);
                this.detailObj = res;
                //清空选择站点
                this.siteData = [];
                //基本信息
                this.Basic = [
                    { name: '任务名称:', message: res.taskName },
                    { name: '处理部门:', message: res.orgName },
                    { name: '审批人:', message: res.checkManName },
                    { name: '任务状态:', message: res.state }
                ];
                //运维模块
                this.OpsModuleForm = res;
                //选择站点
                this.siteData.push(res);
            } catch (error) {
                this.message.error(error)
            }
        },
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
        .basic_message_name {
            margin-right: 18px;
            color: #909090;
        }
    }
    //审核人
    .center_name {
        flex: 35%;
    }
    //任务名称占比
    .first_name {
        flex: 100%;
    }
}
//运维模块
.OpsModule {
    padding: 18px 30px;
    //主模块
    .OpsMain {
        position: relative;
        display: inline-block;
        margin: 0px 20px 20px 0;
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
//审批意见
.approval {
    margin-top: 20px;

    .textInput {
        border: 1px solid #efefef;
        .el-textarea {
            border: 20px solid #f8f8f8;
        }
    }
}
</style>