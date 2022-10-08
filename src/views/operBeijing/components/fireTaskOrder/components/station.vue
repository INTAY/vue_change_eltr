<template>
    <div class="station">
        <span style="font-size: 22px; font-weight: 500">{{ stationInline.staName }}</span>
        &nbsp;&nbsp;
        <span>【处理部门：{{ stationInline.dealDept }}】</span>
        <div style="margin-top: 20px">
            <!-- 点击展示伸缩的内容 -->
            <section class="toggle-item-content">
                <el-form ref="form" :model="receiveInfo" label-width="105px" class="base-info">
                    <!-- 第一行 -->
                    <el-col :span="6">
                        <el-form-item label="巡视人：">
                            <span>{{ receiveInfo.inspectMan }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="巡视开始时间：">
                            <span>{{ receiveInfo.inspectStartTime }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="巡视结束时间：">
                            <span>{{ receiveInfo.inspectEndTime }}</span>
                        </el-form-item>
                    </el-col>
                    <!-- 第二行 -->
                    <el-col :span="6">
                        <el-form-item label="是否有问题：">
                            <span>{{ receiveInfo.isProblem }}</span>
                        </el-form-item>
                    </el-col>
                    <!-- 问题类型和问题描述只存在于有问题的时候 -->
                    <el-col :span="16" v-if="receiveInfo.isProblem === '有'">
                        <el-form-item label="问题类型：">
                            <div class="sta-question">{{ receiveInfo.problemType }}</div>
                            <span>{{ receiveInfo.problemTypeDesc }}</span>
                        </el-form-item>
                    </el-col>
                    <!-- 第三行 -->
                    <el-col :span="24" v-if="receiveInfo.isProblem === '有'">
                        <el-form-item label="问题描述：">
                            <span>{{ receiveInfo.problemDesc }}</span>
                        </el-form-item>
                    </el-col>
                    <!-- 第四行 -->
                    <el-col :span="24">
                        <el-form-item label="照片：">
                            <div v-if="!!receiveInfo.docUrls">
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                                    >全选</el-checkbox
                                >
                                &nbsp;&nbsp;
                                <el-button size="mini" @click="handleBatchDownload" :disabled="urlArr == ''" :class="{ newButtonColor: urlArr != '', download_btn: true }" >下载</el-button> 
                                <div style="margin: 15px 0"></div>
                                <el-checkbox-group v-model="urlArr" @change="handleCheckedCitiesChange">
                                    <el-checkbox v-for="item in receiveInfo.docUrls" :label="item" :key="item">
                                        <el-image :preview-src-list="receiveInfo.docUrls" style="width: 100px; height: 100px" :src="item"></el-image>
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                            <div v-else>无照片</div>
                        </el-form-item>
                    </el-col>
                </el-form>
            </section>
        </div>
    </div>
</template>

<script>
import Bus from '../../../../../../src/components/bus.js';
import FunLib from '@/utils/mulDownloadPic';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import $ from 'jquery';

export default {
    data() {
        return {
            urlArr: [],
            // urlList: [],
            checkAll: false,
            isIndeterminate: false,
            stationInline: {},
            tableData: [],
            // siteItemMessage: []
        };
    },
    props: ['receiveInfo'],
    created() {
        Bus.$on('orderTitle', (data) => {
            this.stationInline = data;
        });
    },
    methods: {
        handleBatchDownload() {
            this.$message({
                message: '正在下载，请稍等...',
                type: 'info'
            });
            let fliesArr = [];
            //  把所有下载的图片都组装起来放到fliesArr
            for (let i = 0; i < this.receiveInfo.docUrls.length; i++) {
                fliesArr.push({
                    url: this.urlArr[i],
                    name: i
                });
            }
            FunLib.download(fliesArr);
        },
        handleCheckAllChange(val) {
            this.urlArr = val ? this.receiveInfo.docUrls : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.receiveInfo.docUrls.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.receiveInfo.docUrls.length;
        }
    }
};
</script>

<style lang="scss" scoped>
.station {
    min-height: 500px;
}

/deep/.el-form-item {
    margin-bottom: 0 !important;
}
.toggle-title {
    color: rgb(199, 23, 20);
}
.circle {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: #c71714;
    float: left;
    margin-top: 5px;
}
li {
    list-style-type: none;
}
.toggle-item {
    padding: 10px 20px;
    margin-top: 20px;
}
.toggle-item-content {
    background: rgb(248, 248, 248);
    float: left;
    .sta-question {
        display: inline;
        padding: 0 10px;
        border: 2px solid rgb(206, 72, 73);
        text-align: center;
        border-radius: 3px;
        margin-right: 12px;
    }
}
.download {
    margin-left: 20px;
    height: 30px;
    width: 100px;
    border-radius: 3px;
}
.danger {
    background: rgb(255, 231, 231);
}
.info {
    background: rgb(227, 227, 227);
}
</style>