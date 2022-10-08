<template>
    <div>
        <!-- 充电桩名字 -->
        <el-row>
            <span style="font-size: 22px; font-weight: 500">{{ stationInline.staName }}</span>
            &nbsp;&nbsp;
            <span>【处理部门：{{ stationInline.dealDept }}】</span>
            <!-- <el-button v-if="checkedSite != '-1'" type="text" class="goHomePage" @click="backGoHomePage">桩巡视首页 >></el-button> -->
        </el-row>
        <ul class="toggle-info">
            <div v-for="(item, index) in receiveInfo" :key="index">
                <!-- 伸缩的每一个列 -->
                <li @click="tapItem(item, index)" class="toggle-item" :class="item.isProblem == '有' ? 'danger' : 'liinfoL'">
                    <span class="toggle-title">
                        <div class="circle"></div>
                        &nbsp;&nbsp;
                        {{ item.stakeNo }}</span
                    >
                    <div style="float: right" v-if="!item.displate">收缩&nbsp;&nbsp;<i class="el-icon-arrow-up"></i></div>
                    <div style="float: right" v-else>展开&nbsp;&nbsp;<i class="el-icon-arrow-down"></i></div>
                </li>
                <!-- 点击展示伸缩的内容 -->
                <section class="toggle-item-content" v-if="item.displate">
                    <el-form ref="form" label-width="105px" class="base-info">
                        <!-- 第一行 -->
                        <el-col :span="6">
                            <el-form-item label="巡视人：">
                                <span>{{ item.inspectMan }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="巡视开始时间：">
                                <span>{{ item.inspectStartTime }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="巡视结束时间：">
                                <span>{{ item.inspectEndTime }}</span>
                            </el-form-item>
                        </el-col>
                        <!-- 第二行 -->
                        <el-col :span="6">
                            <el-form-item label="是否有缺陷：">
                                <span>{{ item.isDefit }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="18">
                            <el-form-item label="桩状态：">
                                <span>{{ item.stakeStatus }}</span>
                            </el-form-item>
                        </el-col>
                        <!-- 第三行 -->
                        <el-col :span="24">
                            <el-form-item label="缺陷编号：">
                                <span>{{ item.defitNo }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否有问题：">
                                <span>{{ item.isProblem }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16" v-if="item.isProblem === '有'">
                            <el-form-item label="问题类型：">
                                <div class="sta-question">{{ item.problemType }}</div>
                                <span>{{ item.problemTypeDesc }}</span>
                            </el-form-item>
                        </el-col>
                        <!-- 第四行 -->
                        <el-col :span="24" v-if="item.isProblem === '有'">
                            <el-form-item label="问题描述：">
                                <span>{{ item.problemDesc }}</span>
                            </el-form-item>
                        </el-col>
                        <!-- 第五行 -->
                        <!-- <el-col :span="24">
                            <el-form-item label="照片：">
                                <div v-if="!!item.docUrls">
                                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                                        >全选</el-checkbox
                                    >
                                    &nbsp;&nbsp;
                                    <el-button size="mini" @click="handleBatchDownload" :disabled="urlArr == ''" :class="{ newButtonColor: urlArr != '', download_btn: true }" >下载</el-button> 
                                    <div style="margin: 15px 0"></div>
                                    <el-checkbox-group v-model="urlArr" @change="handleCheckedCitiesChange">
                                        <el-checkbox v-for="item in item.docUrls" :label="item" :key="item">
                                            <el-image
                                                :preview-src-list="item.docUrls"
                                                style="width: 100px; height: 100px"
                                                :src="item"
                                            ></el-image>
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </div>
                                <div v-else>无照片</div>
                            </el-form-item>
                        </el-col> -->
                    </el-form>
                </section>
            </div>
        </ul>
    </div>
</template>

<script>
import Bus from '../../../../../../src/components/bus.js'
import { getChildDetail } from '@/api/operation/planTasks';
import FunLib from '@/utils/mulDownloadPic';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import $ from 'jquery';
export default {
    data() {
        return {
            stationInline: {},
            plieDate: [],
            // checkedSite: '-1',
            //桩问题总汇
            ConfluenceData: [],
            siteItemMessage: [],
            //桩问题详情
            activeNames: '1',
            urlArr: [],
            urlList: [],
            checkAll: false,
            isIndeterminate: false,
        };
    },
    props: ['receiveInfo','receiveChildModel'],
    watch: {
        //  监听接收数据的变化
        receiveInfo(newVal) {
            this.ConfluenceData = newVal;
        },
        receiveChildModel(newVal) {
            this.plieDate = newVal
            console.log()
        }
    },
    created() {
        Bus.$on('orderTitle', (data) => {
            this.stationInline = data
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
        // siteMessage(...val) {
        //     this.checkedSite = val[1];
        //     this.getChildDetail(val[0].id)
        // },
        //  获取子模块的详情数据
        // async getChildDetail(id) {
        //     const {data: res} = await getChildDetail(id)
        //     //  在这里给伸缩栏加上开关
        //     for (const i in res) {
        //         res[i].displate = false;
        //     }
        //     this.siteItemMessage = res

        // },
        //返回充电桩首页
        // backGoHomePage() {
        //     this.checkedSite = '-1';
        // },
        handleChange(val) {},
        tapItem(item, i) {
            this.receiveInfo.forEach((ele, index) => {
                if (i == index) {
                    ele.displate = !ele.displate;
                    //  给图片盒子加index
                    if (!!this.receiveInfo[index].docUrls) {
                        this.urlList = this.receiveInfo[index].docUrls;
                    } else {
                        this.urlList = [];
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
        }
    }
};
</script>

<style lang="scss" scoped>
//充电桩名字
.titleMessage {
    display: flex;
    //站点名字样式
    .stadName {
        margin-right: 15px;
        font-size: 20px;
        font-weight: 550;
        letter-spacing: 1.5px;
    }
    //其他样式
    .otherStyle {
        margin-top: 4px;
    }
    //充电桩名字颜色
    .titleColor {
        color: #363636;
    }
    //处理部门颜色
    .NameColor {
        color: #b0b0b0;
    }
    .nameFont {
        font-size: 14px;
    }
    //返回充电桩首页
    .goHomePage {
        margin-left: 90px;
    }
}
//充电桩详细信息
.pileMessage {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 25px;

    //每张卡的样式
    .pileMessage_card {
        position: relative;
        width: 22%;
        height: 82px;
        margin: 0 15px 15px 0;
        padding: 10px 12px 12px 25px;
        border-radius: 5px;
        background-color: #ffe6e6;
        color: #c21313;

        //具体内容
        .content {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            font-size: 14px;
        }
        //原点位置
        .cicle {
            position: absolute;
            top: 15px;
            left: 8px;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background-color: #c21313;
        }
        //数字
        .number {
            position: absolute;
            top: 0px;
            right: 0px;
            transform: translate(30%, -30%);
            width: 25px;
            height: 25px;
            border-radius: 50%;
            text-align: center;
            color: #fff;
            background-color: #c21313;
            border: 3px solid #fff;
        }
    }
    //选定时卡的样式
    .pileCilck {
        background-color: #c21313;
    }
    .cicleChecked {
        background-color: #fff;
    }
    .fontColor {
        color: #fff;
    }
}
//桩问题总汇
.ProblemConfluence {
    width: 100%;
    height: 100%;
    margin-right: 15px;
    padding: 10px 32px 25px 40px;
    border: 1px solid #f0f0f0;
    background-color: #f8f8f8;

    .problemDetail {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 60px;
        border-bottom: 1px solid #d7d7d7;
        //标识符
        .flag {
            position: absolute;
            top: 15px;
            left: -19px;
            width: 3px;
            height: 32px;
            background-color: #cc3737;
        }
        .flagCOlor {
            background-color: #cbcbcb;
        }
        //公共样式
        .commone {
            flex: 1;
            box-sizing: border-box;
        }
        .commoneCOlor {
            color: #a6a6a6;
        }
        //标题
        .title {
            padding-top: 13px;
            color: #232323;
            font-size: 14px;
            font-weight: 550;
        }
        .mainMessage {
            display: flex;
            color: #232323;
            margin-bottom: 8px;
            //是否有问题
            .hasProblem {
                margin-right: 60px;
                .hasCommon {
                    margin-right: 10px;
                }
            }
            //问题类型
            .warmPile {
                width: 58px;
                height: 20px;
                color: #c21313;
                padding: 0px;
                border: 1px solid #c21313;
                margin: 0px 10px;
            }
        }
    }
}
//桩问题详情
.ProblemDetail {
    /deep/.el-collapse-item__header {
        padding: 0px 25px;
        font-weight: 600;
        background-color: #e3e3e3;
    }
    /deep/.el-collapse-item__content {
        padding: 25px;
    }
    /deep/.el-collapse-item .is-active {
        color: #c31717;
    }
    /deep/.el-collapse-item__arrow .el-icon-arrow-right {
        font-weight: 600;
        font-size: 15px;
        color: #232323;
    }
    .toggle-info {
        li {
            list-style-type: none;
        }
        .toggle-item {
            padding: 10px 20px;
            margin-top: 20px;
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
    }

    /deep/.el-form-item {
        margin-bottom: 0 !important;
    }
}
.danger {
    background: rgb(255, 231, 231);
}
.info {
    background: rgb(227, 227, 227);
}
//  伸缩栏
.toggle-info {
    li {
        list-style-type: none;
    }
    .toggle-item {
        padding: 10px 20px;
        margin-top: 20px;
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
}

/deep/.el-form-item {
    margin-bottom: 0 !important;
}
</style>