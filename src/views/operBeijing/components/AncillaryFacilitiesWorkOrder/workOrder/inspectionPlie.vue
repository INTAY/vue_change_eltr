<template>
    <div>
        <!-- 充电桩名字 -->
        <el-row class="titleMessage">
            <el-button type="text" class="titleColor stadName">{{ stadName }}</el-button>
            <div class="otherStyle">
                【
                <el-button type="text" class="NameColor nameFont">处理部门:</el-button>
                <el-button type="text" class="titleColor nameFont">{{ className }}</el-button>
                】
            </div>
            <el-button v-if="checkedSite != '-1'" type="text" class="goHomePage" @click="backGoHomePage">桩巡视首页 >></el-button>
        </el-row>
        <!-- 充电桩详细信息 -->
        <el-row class="pileMessage">
            <div
                :class="{ pileMessage_card: true, pileCilck: index == checkedSite }"
                v-for="(item, index) in plieDate"
                :key="index"
                @click="siteMessage(item, index)"
            >
                <div :class="{ cicle: true, cicleChecked: index == checkedSite }"></div>
                <div :class="{ content: true, fontColor: index == checkedSite }">{{ item.libName }}</div>
                <div class="number">{{ item.errorCnt }}</div>
            </div>
        </el-row>
        <!-- 桩问题总汇 -->
        <el-row class="ProblemConfluence" v-if="checkedSite == '-1'">
            <div v-for="(item, index) in ConfluenceData" :key="index" class="problemDetail">
                <div :class="{ flag: true, flagCOlor: item.isProblem == '无' }"></div>
                <div class="title commone">{{ item.stakeNo }}</div>
                <div class="mainMessage commone">
                    <div class="hasProblem"><span class="commoneCOlor hasCommon">是否有问题:</span>{{ item.isProblem }}</div>
                    <div v-if="item.isProblem == '有'">
                        <span class="commoneCOlor">问题类型:</span
                        ><el-button class="warmPile commoneCOlor">{{ item.problemType }}</el-button
                        >{{ item.problemTypeDesc }}
                    </div>
                </div>
            </div>
        </el-row>
        <!-- 桩问题详情 -->
        <el-row class="ProblemDetail" v-if="checkedSite != '-1'">
            <el-collapse v-model="activeNames" accordion @change="handleChange">
                <el-collapse-item
                    :style="item.isProblem != '有' ? spanStyle : errorStyle"
                    v-for="(item, index) in ConfluenceData"
                    :key="index"
                    :title="item.stakeNo"
                    :name="index + 1"
                >
                    <el-form ref="form" :model="item" label-width="150px" class="base-info">
                        <!-- 第一行 -->
                        <el-col :span="4">
                            <el-form-item label="巡视人:" label-width="60px">
                                <span>{{ item.inspectMan }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="巡视开始时间:" label-width="100px">
                                <span>{{ item.inspectStartTime }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="巡视结束时间:" label-width="100px">
                                <span>{{ item.inspectEndTime }}</span>
                            </el-form-item>
                        </el-col>
                        <!-- 第二行 -->
                        <el-col :span="6" v-if="isHasCheckItem != 1">
                            <el-form-item label="是否有缺陷:" label-width="80px">
                                <span>{{ item.isDefit }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="isHasCheckItem != 1">
                            <el-form-item label="桩运行:" label-width="60px">
                                <span>{{ item.stakeStatus }}</span>
                            </el-form-item>
                        </el-col>
                        <!-- 第三行 -->
                        <el-col :span="24" v-if="item.isDefit == '有' && isHasCheckItem != 1">
                            <el-form-item label="缺陷编号:" label-width="70px">
                                <span>{{ item.defitNo }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="isHasCheckItem != 1">
                            <el-form-item label="是否有问题:" label-width="80px">
                                <span>{{ item.isProblem }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16" v-if="item.isProblem === '有' && isHasCheckItem != 1">
                            <el-form-item label="问题类型:" label-width="70px">
                                <el-button class="warmPile">{{ item.problemType }}</el-button>
                                {{ item.problemTypeDesc }}
                            </el-form-item>
                        </el-col>
                        <!-- 第四行 -->
                        <el-col :span="24" v-if="item.isProblem == '有'">
                            <el-form-item label="问题描述:" label-width="70px">
                                <span>{{ item.problemDesc }}</span>
                            </el-form-item>
                        </el-col>
                        <!-- 第五行 -->
                        <el-col :span="24" v-if="isHasCheckItem != 1">
                            <el-form-item label="照片:" label-width="70px">
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                                    >全选</el-checkbox
                                >
                                &nbsp;&nbsp;
                                <el-button type="primary" class="download" @click="handleBatchDownload" :disabled="cities.length == 0"
                                    >下载</el-button
                                >
                                <div style="margin: 15px 0"></div>
                                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange(checkedCities)">
                                    <el-checkbox v-for="item in cities" :key="item" :label="item">
                                        <el-image :preview-src-list="cities" style="width: 100px; height: 100px" :src="item"></el-image>
                                    </el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                        <!-- 选择框 -->
                        <el-col v-if="isHasCheckItem == 1">
                            <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
                                <!-- 连接线路 -->
                                <el-tab-pane label="连接线路" name="first">
                                    <el-col :span="6">
                                        <el-form-item label="是否有问题:" label-width="80px">
                                            <span>{{ item.isProblem }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="16" v-if="item.isProblem === '有'">
                                        <el-form-item label="问题类型:" label-width="70px">
                                            <el-button class="warmPile">{{ item.problemType }}</el-button>
                                            {{ item.problemTypeDesc }}
                                        </el-form-item>
                                    </el-col>
                                    <!-- 第四行 -->
                                    <el-col :span="24" v-if="item.isProblem == '有'">
                                        <el-form-item label="问题描述:" label-width="70px">
                                            <span>{{ item.problemDesc }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="照片:" label-width="70px">
                                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                                                >全选</el-checkbox
                                            >
                                            &nbsp;&nbsp;
                                            <el-button
                                                type="primary"
                                                class="download"
                                                @click="handleBatchDownload"
                                                :disabled="cities.length == 0"
                                                >下载</el-button
                                            >
                                            <div style="margin: 15px 0"></div>
                                            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange(checkedCities)">
                                                <el-checkbox v-for="item in cities" :key="item" :label="item">
                                                    <el-image
                                                        :preview-src-list="cities"
                                                        style="width: 100px; height: 100px"
                                                        :src="item"
                                                    ></el-image>
                                                </el-checkbox>
                                            </el-checkbox-group>
                                        </el-form-item>
                                    </el-col>
                                </el-tab-pane>
                                <!-- 连接构件 -->
                                <el-tab-pane label="连接构件" name="second">
                                    <el-col :span="6">
                                        <el-form-item label="是否有问题:" label-width="80px">
                                            <span>{{ item.isProblem }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="16" v-if="item.isProblem === '有'">
                                        <el-form-item label="问题类型:" label-width="70px">
                                            <el-button class="warmPile">{{ item.problemType }}</el-button>
                                            {{ item.problemTypeDesc }}
                                        </el-form-item>
                                    </el-col>
                                    <!-- 第四行 -->
                                    <el-col :span="24" v-if="item.isProblem == '有'">
                                        <el-form-item label="问题描述:" label-width="70px">
                                            <span>{{ item.problemDesc }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-form-item label="照片:" label-width="70px">
                                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                                                >全选</el-checkbox
                                            >
                                            &nbsp;&nbsp;
                                            <el-button
                                                type="primary"
                                                class="download"
                                                @click="handleBatchDownload"
                                                :disabled="cities.length == 0"
                                                >下载</el-button
                                            >
                                            <div style="margin: 15px 0"></div>
                                            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange(checkedCities)">
                                                <el-checkbox v-for="item in cities" :key="item" :label="item">
                                                    <el-image
                                                        :preview-src-list="cities"
                                                        style="width: 100px; height: 100px"
                                                        :src="item"
                                                    ></el-image>
                                                </el-checkbox>
                                            </el-checkbox-group>
                                        </el-form-item>
                                    </el-col>
                                </el-tab-pane>
                            </el-tabs>
                        </el-col>
                    </el-form>
                </el-collapse-item>
            </el-collapse>
        </el-row>
    </div>
</template>

<script>
import Bus from '@/components/bus.js';
import { getChildDetail } from '@/api/operation/planTasks';
import FunLib from '@/utils/mulDownloadPic';
import JSZip from 'jszip';

export default {
    data() {
        return {
            spanStyle: {
                '--TxchangeColor': '#e3e3e3',
                '--fontColor': '#383838'
            },
            errorStyle: {
                '--TxchangeColor': '#ffe6e6',
                '--fontColor': '#c31717'
            },
            Chose: 'true',
            plieDate: [],
            checkedSite: '-1',
            //桩问题总汇
            ConfluenceData: [],
            //桩问题详情
            activeNames: '1',
            stadName: null,
            checkedCities: [],
            cities: [],
            checkAll: false,
            allMessage: [],
            isHasCheckItem: sessionStorage.getItem('isHasCheckItem'),
            isIndeterminate: null
        };
    },
    mounted() {
        Bus.$on('set_orderDate', (e) => {
            // 充电桩详情
            this.plieDate = e.subContentVos;
            //充电桩总汇
            this.ConfluenceData = e.inspectStakeVos;
        });
        Bus.$on('staId', (e) => {
            this.stadName = e;
        });
        Bus.$on('className', (e) => {
            this.className = e;
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
            for (let i = 0; i < this.checkedCities.length; i++) {
                fliesArr.push({
                    url: this.checkedCities[i],
                    name: i
                });
            }
            FunLib.download(fliesArr);
        },
        //充电桩详细信息
        siteMessage(...val) {
            this.checkedSite = val[1];
            //查询本站点下设备状态
            this.getChildDetail(val[0].id);
        },
        //查询本站点下设备状态
        async getChildDetail(id) {
            const { data: res } = await getChildDetail(id);
            this.ConfluenceData = res;
            //图片汇合
            this.allMessage = [];
            for (let i = 0; i < res.length; i++) {
                this.allMessage.push(res[i].docUrls);
            }
        },

        //返回充电桩首页
        backGoHomePage() {
            this.checkedSite = '-1';
        },
        handleChange(...val) {
            this.cities = this.allMessage[val[1]];
            console.log(this.cities, val[1]);
        },
        handleCheckAllChange(val) {
            console.log(val);
            this.checkedCities = val ? this.cities : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
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
        margin-right: 10px;
        font-size: 20px;
        font-weight: 550;
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
        position: absolute;
        top: 4px;
        right: 0;
        margin-left: 90px;
        font-size: 13px;
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
        .cicleChecked {
            background-color: #fff;
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
        }
    }
}
//桩问题详情
.ProblemDetail {
    /deep/.el-collapse-item__header {
        padding: 0px 25px;
        font-weight: 600;
        color: var(--fontColor);
        background-color: var(--TxchangeColor);
    }
    /deep/.el-collapse-item__content {
        padding: 20px 20px 10px 20px;
        background-color: #f8f8f8;
    }
    //箭头
    /deep/.el-collapse-item__arrow .el-icon-arrow-right {
        font-size: 15px;
    }
    /deep/.el-collapse-item {
        margin-bottom: 12px;
    }
    /deep/.el-collapse {
        border-bottom: none;
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
/deep/.el-collapse-item__wrap {
    background-color: #f8f8f8;
}
</style>