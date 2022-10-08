<template>
    <div>
        <!-- 站电桩名字 -->
        <el-row class="titleMessage">
            <el-button type="text" class="titleColor stadName">{{ stadName }}</el-button>
            <div class="otherStyle">
                【
                <el-button type="text" class="NameColor nameFont">处理部门:</el-button>
                <el-button type="text" class="titleColor nameFont">{{ className }}</el-button>
                】
            </div>
        </el-row>
        <!-- 站问题详情 -->
        <el-row class="ProblemDetail">
            <el-collapse v-model="activeNames" accordion>
                <el-collapse-item
                    :style="item.isProblem != '有' ? spanStyle : errorStyle"
                    v-for="(item, index) in ConfluenceData"
                    :key="index"
                    :title="item.subContentName"
                    :name="index + 1"
                    @change="handleChange"
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
                        <el-col :span="24" v-if="item.isProblem == '有' && isHasCheckItem != 1">
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
import { mapMutations, mapState } from 'vuex';
import Bus from '@/components/bus.js';
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
            checkedSite: '-1',
            //站问题总汇
            ConfluenceData: [],
            //站问题详情
            activeNames: '1',
            activeName: 'first',
            stadName: null,
            checkedCities: [],
            cities: [],
            checkAll: false,
            allMessage: [],
            isIndeterminate: null,
            isHasCheckItem: sessionStorage.getItem('isHasCheckItem')
        };
    },
    created() {
        Bus.$on('set_orderDate', (e) => {
            this.ConfluenceData = e.inspectStationVos;
            // 汇合图片
            this.allMessage = [];
            for (let i = 0; i < this.ConfluenceData.length; i++) {
                this.allMessage.push(this.ConfluenceData[i].docUrls);
            }
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
        //查询本站点下设备状态
        async getChildDetail(id) {
            const { data: res } = await getChildDetail(id);
            console.log(res, 'res');
            this.ConfluenceData = res;
        },
        handleChange(...val) {
            this.cities = this.allMessage[val[1]];
            console.log(this.cities, val[1]);
        },
        handleCheckAllChange(val) {
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
//站电桩名字
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
    //充电站名字颜色
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
//站问题详情
.ProblemDetail {
    /deep/.el-collapse-item__header {
        padding: 0px 25px;
        font-weight: 600;
        color: var(--fontColor);
        background-color: var(--TxchangeColor);
    }
    /deep/.el-collapse-item__content {
        padding: 20px;
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
/deep/.el-collapse-item__wrap {
    background-color: #f8f8f8;
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
/deep/.el-tabs--border-card > .el-tabs__header {
    background-color: #eaeaea;
}
/deep/.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    background-color: #eaeaea;
    border-bottom: 3px solid #1396c2;
    border-right-color: #eaeaea;
    border-left-color: #eaeaea;
}
/deep/.el-tabs--border-card {
    margin-bottom: 20px;
}
</style>