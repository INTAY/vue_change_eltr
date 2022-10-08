
<template>
    <div class="stake">
        <span style="font-size: 18px; font-weight: 500">{{ stationInline.staName }}</span>
        &nbsp;&nbsp;
        <span>【<i class="deal_btn">处理部门：</i>{{ stationInline.dealDept }}】</span>
        <div style="margin-top: 20px">
            <!-- 遍历伸缩的功能 -->
            <ul class="toggle-info">
                <div v-for="(item, index) in siteItemMessage" :key="index">
                    <!-- 伸缩的每一个列 -->
                    <li @click="tapItem(item, index)" class="toggle-item">
                        <span class="toggle-title">
                            <div class="circle"></div>
                            &nbsp;&nbsp;
                            {{ item.subContentName }}</span
                        >
                        <div class="switch_btn" v-if="!item.displate">收缩&nbsp;&nbsp;<i class="el-icon-arrow-up"></i></div>
                        <div class="switch_btn" v-else>展开&nbsp;&nbsp;<i class="el-icon-arrow-down"></i></div>
                    </li>
                    <!-- 点击展示伸缩的内容 -->
                    <section class="toggle-item-content" v-if="item.displate">
                        <el-form ref="form" :model="item" label-width="105px" class="base-info">
                            <!-- 第一行 -->
                            <el-col :span="6">
                                <el-form-item label="巡视人:">
                                    <span>{{ item.inspectMan }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="巡视开始时间:">
                                    <span>{{ item.inspectStartTime }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="巡视结束时间:">
                                    <span>{{ item.inspectEndTime }}</span>
                                </el-form-item>
                            </el-col>
                            <!-- 有检查项 -->
                            <el-col :span="24" v-if="item.checkItemVos">
                                <el-tabs v-model="activeName" @tab-click="handleClick">
                                    <el-tab-pane
                                        :label="eachItem.itemName"
                                        :name="index.toString()"
                                        v-for="(eachItem, index) in item.checkItemVos"
                                        :key="index"
                                    >
                                        <el-col :span="8">
                                            <el-form-item label="是否有问题:">
                                                <span>{{ item.isProblem }}</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="16">
                                            <el-form-item label="问题类型:">
                                                <span>{{ item.problemTypeDesc }}</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="问题描述:">
                                                <span>{{ item.problemDesc }}</span>
                                            </el-form-item>
                                        </el-col>

                                        <el-col :span="24">
                                            <el-form-item label="照片：">
                                                <div v-if="!!urlList">
                                                    <el-checkbox
                                                        :indeterminate="isIndeterminate"
                                                        v-model="checkAll"
                                                        @change="handleCheckAllChange"
                                                        >全选</el-checkbox
                                                    >
                                                    &nbsp;&nbsp;
                                                    <el-button size="mini" @click="handleBatchDownload" class="newButtonColor download_btn"
                                                        >下载</el-button
                                                    >
                                                    <div style="margin: 15px 0"></div>
                                                    <el-checkbox-group v-model="urlArr" @change="handleCheckedCitiesChange">
                                                        <el-checkbox v-for="item in urlList" :label="item" :key="item">
                                                            <el-image
                                                                :preview-src-list="urlList"
                                                                style="width: 100px; height: 100px"
                                                                :src="item"
                                                            ></el-image>
                                                        </el-checkbox>
                                                    </el-checkbox-group>
                                                </div>
                                                <div v-else>无照片</div>
                                            </el-form-item>
                                        </el-col>
                                    </el-tab-pane>
                                </el-tabs>
                            </el-col>
                            <el-col :span="24" v-else>
                                <el-form-item label="照片：">
                                    <div v-if="!!urlList">
                                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                                            >全选</el-checkbox
                                        >
                                        &nbsp;&nbsp;
                                        <el-button size="mini" @click="handleBatchDownload" class="newButtonColor download_btn"
                                            >下载</el-button
                                        >
                                        <div style="margin: 15px 0"></div>
                                        <el-checkbox-group v-model="urlArr" @change="handleCheckedCitiesChange">
                                            <el-checkbox v-for="item in urlList" :label="item" :key="item">
                                                <el-image
                                                    :preview-src-list="urlList"
                                                    style="width: 100px; height: 100px"
                                                    :src="item"
                                                ></el-image>
                                            </el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>无照片</div>
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </section>
                </div>
            </ul>
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
            stationInline: {},
            tableData: [],
            siteItemMessage: [],
            checkAll: false,
            urlArr: [],
            urlList: [],
            isIndeterminate: false,
            activeName: '1'
        };
    },
    props: ['receiveInfo'],
    watch: {
        //  监听接收数据的变化
        receiveInfo(newVal) {
            for (const i in newVal) {
                newVal[i].displate = false;
            }
            console.log(newVal, 'siteItemMessage');
            this.siteItemMessage = newVal;
        }
    },
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
            for (let i = 0; i < this.urlArr.length; i++) {
                fliesArr.push({
                    url: this.urlArr[i],
                    name: i
                });
            }
            FunLib.download(fliesArr);
        },
        tapItem(item, i) {
            this.siteItemMessage.forEach((ele, index) => {
                if (i == index) {
                    ele.displate = !ele.displate;
                    //  给图片盒子加index
                    console.log(!!this.siteItemMessage[index].checkItemVos, index);
                    // 判断有没有检查项,有检查项就取检查项里边的图片,反之取父级
                    if (!!this.siteItemMessage[index].checkItemVos) {
                        console.log(this.siteItemMessage[index].checkItemVos,"111111111");
                        if (!!this.siteItemMessage[index].checkItemVos[index].docUrls) {
                            this.urlList = this.siteItemMessage[index].checkItemVos[index].docUrls;
                        } else {
                            this.urlList = [];
                        }
                    } else {
                        if (!!this.siteItemMessage[index].docUrls) {
                            this.urlList = this.siteItemMessage[index].docUrls;
                        } else {
                            this.urlList = [];
                        }
                    }
                } else {
                    ele.displate = false;
                }
                //  强制更新视图
                this.$forceUpdate();
            });
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
        handleClick(tab, event) {}
    }
};
</script>

<style lang="scss" scoped>
.stake {
    min-height: 500px;
    .toggle-info {
        li {
            list-style-type: none;
        }
        .toggle-item {
            background: rgb(255, 231, 231);
            padding: 8px 20px;
            margin-top: 10px;
            cursor: pointer;
            .toggle-title {
                color: rgb(199, 23, 20);
            }
            .circle {
                height: 7px;
                width: 7px;
                border-radius: 50%;
                background-color: #c71714;
                float: left;
                margin-top: 6px;
            }
        }
        .toggle-item-content {
            background: rgb(248, 248, 248);
            display: flex;
            flex-direction: column;
            width: 100%;
            .base-info {
                margin-top: 8px;
            }
        }
    }
    /deep/.el-form-item {
        margin-bottom: 0 !important;
    }
    /deep/ .el-tabs--top .el-tabs__item.is-top {
        padding-left: 0;
        width: 110px;
    }
    /deep/ .el-tabs__nav {
        white-space: nowrap;
        position: relative;
        -webkit-transition: -webkit-transform 0.3s;
        transition: -webkit-transform 0.3s;
        transition: transform 0.3s;
        transition: transform 0.3s, -webkit-transform 0.3s;
        float: left;
        width: 100% !important;
        overflow-x: auto;
        z-index: 2;
        background: rgb(234, 234, 234);
    }
}
</style>