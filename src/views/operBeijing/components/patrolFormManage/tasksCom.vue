<template>
    <div class="tasks">
        <el-form ref="form" :model="zoneForm" label-width="100px" size="small">
            <!-- 站点选择 -->
            <el-row>
                <el-col :span="3">
                    <div class="title"><i />站点选择</div>
                </el-col>
            </el-row>
            <div style="margin-top:15px;">
                <el-table :data="stationData" style="width: 100%" :header-cell-style="{ background: '#f8f8f8 !important', color: '#000' }">
                    <el-table-column type="index" width="70" align="center" />
                    <el-table-column prop="regName" label="区县" width="180" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="staName" label="站点名称" width="180" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="addr" label="站点地址" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="totalStakeNum" label="总桩数" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="zlStakeNum" label="直流充电桩数" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="jlStakeNum" label="交流充电桩数" show-tooltip-when-overflow></el-table-column>
                </el-table>
            </div>
            <!-- 运维模块 -->
            <div class="title"><i />运维模块</div>
            <div class="OpsModule">
                <el-form ref="form" :model="zoneForm" label-width="70px" size="mini">
                    <el-form-item label="模块名称:">
                        <span>{{ zoneForm.inspName }}</span>
                    </el-form-item>
                    <el-form-item label="主模块:">
                        <div class="OpsMain" v-for="(item, index) in modelList" :key="index">
                            <el-popover placement="bottom" width="400" trigger="hover">
                                <el-table
                                    :data="item.children"
                                    style="margin-top: -3px"
                                    :header-row-style="{ background: '#f8f8f8 !important' }"
                                    stripe
                                >
                                    <el-table-column type="index" width="50"> </el-table-column>
                                    <el-table-column property="libName" :label="item.libName"></el-table-column>
                                </el-table>
                                <el-button slot="reference" class="btnClass">{{ item.libName }}</el-button>
                            </el-popover>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="title"><i />基础信息</div>
            <section class="bg-items" style="line-height: 30px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="任务名称:">
                            {{ zoneForm.taskName }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="处理部门:">
                            {{ zoneForm.orgName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="截止时间:" style="white-space: nowrap">
                            {{ zoneForm.deadline }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="持续时间:" style="white-space: nowrap">
                            {{ zoneForm.duration }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="实际结束时间:" style="white-space: nowrap">
                            {{ zoneForm.endDate }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="任务制定时间:" style="white-space: nowrap">
                            {{ zoneForm.createdTime }}
                        </el-form-item>
                    </el-col>
                    <el-form-item label="巡视原因:">
                        {{ zoneForm.inspectReason }}
                    </el-form-item>
                    <el-form-item label="照片：" class="pic_form">
                        <div v-if="!!urlList" style="margin-left: -8px">
                            <el-checkbox
                                :indeterminate="isIndeterminate"
                                v-model="checkAll"
                                @change="handleCheckAllChange"
                                style="margin-left: -8px"
                                >全选</el-checkbox
                            >
                            &nbsp;&nbsp;
                             <el-button
                                size="mini"
                                @click="handleBatchDownload"
                                :disabled="urlArr == ''"
                                :class="{ newButtonColor: urlArr != '', download_btn:true }"
                                >下载</el-button
                            >

                            <div style="margin: 15px 0"></div>
                            <el-checkbox-group v-model="urlArr" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="item in urlList" :label="item" :key="item">
                                    <el-image :preview-src-list="urlList" style="width: 100px; height: 100px" :src="item"></el-image>
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div v-else class="no_pic">无照片</div>
                    </el-form-item>
                </el-row>
            </section>
        </el-form>
    </div>
</template>

<script>
import { getDetails } from '@/api/operBeijing/patrolFormManage';
import Bus from '../../../../../src/components/bus.js';
import FunLib from '@/utils/mulDownloadPic';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import $ from 'jquery';
export default {
    data() {
        return {
            urlList: [],
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
            alreadySelectList: [],
            selectStationVisible: false,
            infoData: [
                {
                    id: '1',
                    label: '1'
                }
            ],
            activeSwitch: 'tasks',
            checkAll: false,
            isIndeterminate: false,
            urlArr: []
        };
    },
    created() {
        Bus.$on('sendSourceId', (data) => {
            this.getData(data);
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

        handleCheckAllChange(val) {
            this.urlArr = val ? this.urlList : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.urlList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.urlList.length;
        },

        mouseEnter(index, id) {
            this.seen = true;
            this.current = index;
            this.childrenModelList = [];
            this.modelList.forEach((item) => {
                item.children.forEach((i) => {
                    if (i.parentId == id) {
                        this.childrenModelList.push(i);
                    }
                });
            });
        },
        mouseleave() {
            this.seen = false;
            this.current = null;
        },
        getData(id) {
            getDetails(id).then((res) => {
                if (res.code === '000000') {
                    this.zoneForm = res.data;
                    this.urlList = res.data.docUrls;
                    this.stationData = [
                        {
                            regName: res.data.regName,
                            staName: res.data.staName,
                            addr: res.data.addr,
                            totalStakeNum: res.data.totalStakeNum,
                            zlStakeNum: res.data.zlStakeNum,
                            jlStakeNum: res.data.jlStakeNum
                        }
                    ];
                    this.modelList = res.data.inspectContentDetVos;
                    // console.log(this.modelList, ' this.modelList');
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.el-col {
    height: 30px;
}

.title {
    margin: 15px 0 15px 2px;
    i {
        width: 4px;
        height: 14px;
        display: inline-block;
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
    padding: 10px 50px 10px 20px;
    background: rgb(248, 248, 248);
}
//运维模块
.OpsModule {
    padding: 12px 50px 0;
    box-sizing: border-box;
    border: 1px solid #efefef;
    margin-bottom: 15px;
    background-color: #f8f8f8;
    //主模块
    .OpsMain {
        position: relative;
        display: inline-block;
        margin: 0 15px 8px 0;
        //按钮的半透明颜色
        .btnClass {
            height: 28px;
            line-height: 8px;
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
.pic_form {
    position: relative;
    margin: -18px 0 0 8px;
}
.no_pic {
    position: absolute;
    left: -10px;
}
</style>