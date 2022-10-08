<template>
    <div class="stake">
        <span style="font-size: 22px; font-weight: 500">{{ stationInline.staName }}</span>
        &nbsp;&nbsp;
        <span>【处理部门：{{ stationInline.dealDept }}】</span>
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
                        <div style="float: right" v-if="!item.displate">收缩&nbsp;&nbsp;<i class="el-icon-arrow-up"></i></div>
                        <div style="float: right" v-else>展开&nbsp;&nbsp;<i class="el-icon-arrow-down"></i></div>
                    </li>
                    <!-- 点击展示伸缩的内容 -->
                    <section class="toggle-item-content" v-if="item.displate">
                        <el-form ref="form" :model="item" label-width="105px" class="base-info">
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
                                            <el-form-item label="是否有问题：">
                                                <span>{{ item.isProblem }}</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="16">
                                            <el-form-item label="问题类型：">
                                                <span>{{ item.person }}</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="问题描述：">
                                                <span>{{ item.person }}</span>
                                            </el-form-item>
                                        </el-col>

                                        <el-col :span="24">
                                            <el-form-item label="照片：">
                                                <el-checkbox
                                                    :indeterminate="isIndeterminate"
                                                    v-model="checkAll"
                                                    @change="handleCheckAllChange"
                                                    >全选</el-checkbox
                                                >
                                                &nbsp;&nbsp;
                                                <el-button type="primary" :disabled="!checkedCities.length" class="download">下载</el-button>
                                                <div style="margin: 15px 0"></div>
                                                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                                                    <el-checkbox v-for="city in cities" :label="city" :key="city">
                                                        <img width="100px" src="@/assets/image/头像.png" alt="" />
                                                    </el-checkbox>
                                                </el-checkbox-group>
                                            </el-form-item>
                                        </el-col>
                                    </el-tab-pane>
                                </el-tabs>
                            </el-col>
                            <el-col :span="24" v-else>
                                <el-form-item label="照片：">
                                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                                        >全选</el-checkbox
                                    >
                                    &nbsp;&nbsp;
                                    <el-button type="primary" :disabled="!checkedCities.length" class="download">下载</el-button>
                                    <div style="margin: 15px 0"></div>
                                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                                        <el-checkbox v-for="city in cities" :label="city" :key="city">
                                            <img width="100px" :src="city" alt="" />
                                        </el-checkbox>
                                    </el-checkbox-group>
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
import Bus from '@/components/bus.js'

export default {
    data() {
        return {
            stationInline: {
                title: '北京市房山公交专用充电桩',
                operateSys: '房山运维组'
            },
            tableData: [],
            siteItemMessage: [],
            checkAll: false,
            checkedCities: [],
            cities: [],
            isIndeterminate: true,
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
            this.siteItemMessage = newVal;
        }
    },
    created() {
        Bus.$on('orderTitle', (data) => {
            this.stationInline = data
            this.cities = data.docUrls;
        });
    },
    methods: {
        tapItem(item, i) {
            this.siteItemMessage.forEach((ele, index) => {
                if (i == index) {
                    ele.displate = !ele.displate;
                } else {
                    ele.displate = false;
                }
                //  强制更新视图
                this.$forceUpdate();
            });
        },
        handleCheckAllChange(val) {
            this.checkedCities = val ? this.cities : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
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
            width: 100%;
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