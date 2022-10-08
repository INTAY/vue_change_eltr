<template>
    <div class="detail" style="margin-top: -15px">
        <div class="title"><i />基础信息</div>
        <el-form ref="form" :model="formInline" label-width="100px" class="base-info">
            <el-col :span="24">
                <el-form-item label="任务名称">
                    <span>{{formInline.taskName}}</span>
                </el-form-item>
            </el-col>
            <!-- <el-col :span="24">
                <el-form-item label="充电站">
                    <span>{{formInline.staName}}</span>
                </el-form-item>
            </el-col> -->
            <el-col :span="12">
                <el-form-item label="区县">
                    <span>{{formInline.regName}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="任务名称">
                    <span>{{formInline.taskName}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="处理部门">
                    <span>{{formInline.dealDept}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="工单开始时间">
                    <span>{{formInline.receiveTime}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="工单持续时长">
                    <span>{{formInline.duration}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="派发日期">
                    <span>{{formInline.dispatchTime}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="工单结束日期">
                    <span>{{formInline.finishTime}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="消防工单状态">
                    <span>{{formInline.state}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="维护原因">
                    <span>{{formInline.inspectReason}}</span>
                </el-form-item>
            </el-col>
        </el-form>
        <div style="margin-top: 15px"></div>
        <div class="title"><i />运维模块</div>
        <el-form ref="form" :model="formInline" label-width="150px" class="base-info">
            <el-form-item label="模块名称">
                <span>{{formInline.inspName}}</span>
            </el-form-item>
            <el-form-item label="主模块">
                <span v-if="opsModule.length>7">
                    <div class="openContral" @click="is_show = false" v-if="is_show">收缩&nbsp;&nbsp;<i class="el-icon-arrow-up"></i></div>
                    <div class="openContral" @click="is_show = true" v-else>展开&nbsp;&nbsp;<i class="el-icon-arrow-down"></i></div>
                </span> 
                <div :class="is_show ? 'work_detail' : 'new_detail'">
                    <div class="OpsMain" v-for="(item, index) in opsModule" :key="index" @click="getChildren(item.id)">
                        <el-button slot="reference" class="btnClass">{{ item.libName }}</el-button>
                    </div>
                </div>
                
            </el-form-item>
            <el-form-item label="照片：">
                <div v-if="!!urlList">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                        >全选</el-checkbox
                    >
                    &nbsp;&nbsp;
                    <el-button size="mini" @click="handleBatchDownload" :disabled="urlArr == ''" :class="{ newButtonColor: urlArr != '', download_btn: true }" >下载</el-button> 
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
</template>

<script>
import Bus from '../../../../../../src/components/bus.js';
import { getOrderDetail } from '@/api/operation/planTasks';
import FunLib from '@/utils/mulDownloadPic';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import $ from 'jquery';

export default {
    data() {
        return {
            formInline: {},
            chiildrenItems: [],
            opsModule: [],
            baseInfo: {},
            is_show: false,
            isIndeterminate: false,
            checkAll: false,
            urlList: [],
            urlArr: []
        };
    },
    computed: {
        // 项目内容
        word() {
            if (this.is_show === false) {
                return '展开'
            } else if (this.is_show === true) {
                return '收起'
            } else if (this.is_show === '') {
                return null
            }
        }
    },
    created() {
        Bus.$on('sendOrderId', (data) => {
            this.getOrderDetail(data);
        });
    },
    methods: {
        handleBatchDownload() {
            this.$message({
                message: '正在下载，请稍等...',
                type: 'info'
            });
            // console.log(this.urlArr, '<图片标识>');
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
        async getOrderDetail(id) {
            const { data: res } = await getOrderDetail(id);
            this.formInline = res;
            this.urlList = res.docUrls;

            this.opsModule = res.inspectContentDetVos
            //  传递title
            Bus.$emit('orderTitle',this.formInline)

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
    },
};
</script>

<style lang="scss" scoped>
.detail {
    // title
    .title {
        margin-bottom: 10px;
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
    .base-info {
        width: 100%;
        padding: 10px 20px;
        background: #f8f8f8;
        float: left;
        margin-bottom: 15px;
    }
    .twice {
        background: rgb(237, 237, 237);
    }
    /deep/ .el-form-item--small.el-form-item {
        margin-bottom: 0;
    }
    /deep/ .el-form-item--small .el-form-item__label {
        line-height: 32px;
        color: rgb(145, 145, 145);
    }
    //主模块
    .OpsMain {
        position: relative;
        display: inline-block;
        margin-top: 5px;
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
.new_detail {
    height: 44px;
    overflow: hidden;
}
.work_detail {
    height: 100%;
}
.openContral{
    float: right;
    margin-top: 5px;
    margin-right: 33px;
    color: #187fa2;
}
</style>