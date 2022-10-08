<template>
    <div class="assignment">
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
                <el-table-column prop="zlStakeNum" label="直流充电桩功率"> </el-table-column>
                <el-table-column prop="zlStakeNum" label="直流充电桩厂家"> </el-table-column>
                <el-table-column prop="jlStakeNum" label="交流充电桩数"> </el-table-column>
                <el-table-column prop="jlStakeNum" label="交流充电桩功率"> </el-table-column>
                <el-table-column prop="jlStakeNum" label="交流充电桩厂家"> </el-table-column>
                <el-table-column prop="jlStakeNum" label="充电站点运营编码"> </el-table-column>
            </el-table>
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
                    last: index == 6
                }"
            >
                <div class="basic_message_name">{{ item.name }}</div>
                <div>{{ item.message }}</div>
            </div>
            <el-form>
                <el-form-item label="照片：" label-width="107px">
                    <div v-if="!!urlList">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
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
    </div>
</template>
<script>
import { mapState } from 'vuex';
import Bus from '@/components/bus';
import FunLib from '@/utils/mulDownloadPic'

export default {
    computed: {
        ...mapState(['ops'])
    },
    data() {
        return {
            Basic: [],
            OpsModuleForm: {},
            siteData: [],
            checkAll: false,
            isIndeterminate: false,
            urlList: [],
            urlArr: [],
        };
    },
    created() {
        Bus.$on('IS', (e) => {
            //清空选择站点
            this.siteData = [];
            this.urlList = e.docUrls;
            this.Basic = [
                { name: '任务名称:', message: e.taskName },
                { name: '充电站名:', message: e.staName },
                { name: '处理部门:', message: e.orgName },
                { name: '截止时间:', message: e.deadline },
                { name: '持续时间:', message: e.duration },
                { name: '实际结束时间:', message: e.endDate },
                { name: '任务制定时间:', message: e.createdTime }
            ];

            //运维模块
            this.OpsModuleForm = e;
            //选择站点
            this.siteData.push(e);
        });
    },
    methods: {
        // 批量下载
        handleBatchDownload() {
             this.$message({
                    message: '正在下载，请稍等...',
                    type: 'info'
                });
            let fliesArr = [];
            //  把所有下载的图片都组装起来放到fliesArr
            for (let i = 0; i < this.urlArr.length; i++) {
                fliesArr.push({
                    url: this.urlArr[i],
                    name: i
                });
            }
            FunLib.download(fliesArr);
        },
        //全选
        handleCheckAllChange(val) {
            this.urlArr = val ? this.urlList : [];
            this.isIndeterminate = false;
        },
        //点击事件
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.urlList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.urlList.length;
        },
    }
};
</script>

<style lang="scss" scoped>
.assignment {
    margin-top: 30px;
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
            flex: 35%;
            font-size: 14px;

            padding-top: 15px;
            .basic_message_name {
                width: 90px;
                margin-right: 18px;
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
        //最后一行占比
        .last {
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
}
//照片
.picture {
    margin: 20px 0;
}
</style>