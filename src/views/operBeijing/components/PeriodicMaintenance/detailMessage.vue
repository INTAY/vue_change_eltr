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
            <!-- 基础信息 -->
            <div class="title">
                <div class="sign"></div>
                <div>基础信息</div>
            </div>
            <div class="basic commonModule">
                <div
                    v-for="(item, index) in Basic"
                    :key="index"
                    :class="{
                        basic_message: true,
                        ModuleColor: true,
                        first_name: index == 0,
                        center_name: index == 1,
                        last: index == 5
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
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            Basic: [],
            OpsModuleForm: {},
            siteData: []
        };
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
            width: 90px;
            margin-right: 12px;
            color: #909090;
            text-align:right;
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
    //最后一行占比
    .last {
        flex: 45%;
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
/deep/ .el-dialog__body {
    padding: 30px 40px;
}
</style>