<template>
    <div class="tasks">
        <el-form ref="form" :model="zoneForm" label-width="110px" size="small">
            <!-- 站点选择 -->
            <el-row>
                <el-col :span="3">
                    <div class="title"><i />站点选择</div>
                </el-col>
            </el-row>
            <div>
                <el-table :data="stationData" style="width: 100%" :header-cell-style="{ background: '#f1f1f1', color: '#000' }">
                    <el-table-column type="index" width="70" align="center" />
                    <el-table-column prop="regName" label="区县" width="180"></el-table-column>
                    <el-table-column prop="staName" label="站名称" width="180"></el-table-column>
                    <el-table-column prop="addr" label="站地址"></el-table-column>
                    <el-table-column prop="totalStakeNum" label="总桩数"></el-table-column>
                    <el-table-column prop="zlStakeNum" label="直流充电桩数"></el-table-column>
                    <el-table-column prop="jlStakeNum" label="交流充电桩数"></el-table-column>
                </el-table>
            </div>
            <!-- 运维模块 -->

            <div class="title"><i />运维模块</div>
            <div class="OpsModule" style="margin-bottom: 15px;padding-bottom:25px;">
                <el-form ref="form" :model="zoneForm" label-width="110px" size="mini">
                    <el-form-item label="模块名称：">
                        <span>{{ zoneForm.inspName }}</span>
                    </el-form-item>
                    <el-form-item label="主模块：">
                        <div class="OpsMain" v-for="(item, index) in modelList" :key="index">
                            <el-popover placement="bottom" width="400" trigger="hover">
                                <el-table :data="item.children" stripe>
                                    <el-table-column type="index" width="50"> </el-table-column>
                                    <el-table-column property="libName" label="子模块名称"></el-table-column>
                                </el-table>
                                <el-button slot="reference" class="btnClass">{{ item.libName }}</el-button>
                            </el-popover>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 基础信息 -->
            <div class="title"><i />基础信息</div>
            <section class="OpsModule">
                <el-form-item label="任务名称：">
                    <span>{{ zoneForm.taskName }}</span>
                </el-form-item>
                <el-col :span="8">
                    <el-form-item label="处理部门：">
                        {{ zoneForm.orgName }}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="截止时间：">
                        {{ zoneForm.deadline }}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="任务状态：">
                        {{ zoneForm.state }}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="延续时间：">
                        {{ zoneForm.duration }}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="实际结束时间：">
                        {{ zoneForm.endDate }}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="任务制定时间：">
                        {{ zoneForm.createdTime }}
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="照片：">
                        <div v-if="!!urlList">
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                                >全选</el-checkbox
                            >
                            &nbsp;&nbsp;
                            <el-button
                                size="mini"
                                @click="handleBatchDownload"
                                :disabled="urlArr == ''"
                                :class="{ newButtonColor: urlArr != '', download_btn: true }"
                                >下载</el-button
                            >
                            <div style="margin: 15px 0"></div>
                            <el-checkbox-group v-model="urlArr" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="item in urlList" :label="item" :key="item">
                                    <el-image :preview-src-list="urlList" style="width: 100px; height: 100px" :src="item"></el-image>
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div v-else>无照片</div>
                    </el-form-item>
                </el-col>
            </section>
        </el-form>
    </div>
</template>

<script>
import { getDetails } from '@/api/operation/planTasks';
import Bus from '../../../../../src/components/bus.js';
import FunLib from '@/utils/mulDownloadPic';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import $ from 'jquery';

export default {
    data() {
        return {
            type: [],
            orgTreeData: [],
            gardenData: [],
            regTreeData: [], //区域数据
            state: [], // 基础设施状态 200
            formInline: {},
            dialogFormVisible: false,
            zoneForm: {},
            stationData: [],
            stationForm: {},
            modelList: [], //  主模块
            childrenModelList: [], //  子模块
            seen: false,
            current: 0,
            modelName: '',
            modelNameMap: [],
            pageData: {
                total: 0,
                current: 1,
                size: 0
            },
            alreadySelectList: [],
            selectStationVisible: false,
            infoData: [
                {
                    id: '1',
                    label: '1'
                }
            ],
            activeSwitch: 'tasks',
            isIndeterminate: false,
            checkAll: false,
            urlList: [],
            urlArr: []
        };
    },
    created() {
        Bus.$on('sendSourceId', (data) => {
            this.getData(data);
        });
    },
    methods: {
        handleCheckAllChange(val) {
            this.urlArr = val ? this.urlList : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.urlList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.urlList.length;
        },
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
        staChange() {},
        getData(id) {
            getDetails(id).then((res) => {
                if (res.code === '000000') {
                    this.urlList = res.data.docUrls;

                    this.zoneForm = res.data;
                    this.stationData = res.data;
                    this.modelList = res.data.inspectContentDetVos;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.tasks {
    // border: 1px solid #cecece;
    float: left;
}

.title {
    margin: 15px 0 13px;
    i {
        width: 4px;
        height: 14px;
        // display: inline-block;
        background: #24b3ca;
        margin-right: 10px;
        margin-top: 3px;
        float: left;
        border-radius: 5px;
    }
}
.staSlect {
    width: 100px;
    background: #1396c2;
    color: white;
    border-radius: 5px;
    margin-left: -20px;
}
.staDel {
    width: 100px;
    background: white;
    color: rgb(211, 47, 46);
    border-radius: 3px;
    float: right;
    border: 1px solid rgb(211, 47, 46);
    margin-right: 20px;
}
//  主模块鼠标移入移出样式
.main-model {
    display: flex;
    .item-model {
        width: 200px;
        background: rgb(226, 243, 250);
        border: 1px solid rgb(190, 229, 224);
        margin-left: 10px;
        color: #006080;
        text-align: center;
    }
    .item-table {
        position: absolute;
        left: 20%;
        // top: 10vh;
        z-index: 5;
        background: white;
        padding: 20px;
    }
}
.bg-items {
    padding: 10px 20px;
    background: rgb(248, 248, 248);
}
//运维模块
.OpsModule {
    padding: 15px 0;
    box-sizing: border-box;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    float: left;
    width: 100%;
    //主模块
    .OpsMain {
        position: relative;
        display: inline-block;
        // margin-top: 10px;
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
    /deep/ .el-form-item__label {
        color: #909090 !important;
        font-size: 14px !important;
    }
    /deep/ .el-form-item__content {
        color: #363636;
    }
    /deep/ .el-form-item {
        margin-bottom: 0;
    }
}
</style>