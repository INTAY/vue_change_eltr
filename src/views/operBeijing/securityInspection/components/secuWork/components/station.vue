<template>
    <div class="station">
        <span style="font-size: 22px; font-weight: 500">{{ stationInline.title }}</span>
        &nbsp;&nbsp;
        <span>【处理部门：{{ stationInline.operateSys }}】</span>
        <div style="margin-top: 20px">
            <!-- 遍历伸缩的功能 -->
            <ul class="toggle-info">
                <div v-for="(item, index) in siteItemMessage" :key="index">
                    <!-- 伸缩的每一个列 -->
                    <li @click="tapItem(item, index)" class="toggle-item" :class="item.isProblem == '有' ? 'danger' : 'liinfoL'">
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
                        <el-form ref="form" :model="item" label-width="150px" class="base-info">
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
                                <el-form-item label="是否有问题：">
                                    <span>{{ item.isProblem }}</span>
                                </el-form-item>
                            </el-col>
                            <!-- 问题类型和问题描述只存在于有问题的时候 -->
                            <el-col :span="16" v-if="item.isProblem === '有'">
                                <el-form-item label="问题类型：">
                                    <div class="sta-question">{{item.problemType}}</div>
                                    <!-- <div v-for="(items,index) in item.checkItemVos" :key="index" style="display: inline"> -->
                                        <span>{{ item.problemTypeDesc }}</span>
                                        <!-- 判断下标是最后一个就不显示这个竖线 -->
                                        <!-- <el-divider v-if="index != item.checkItemVos.length-1" direction="vertical"></el-divider>
                                    </div> -->
                                </el-form-item>
                            </el-col>
                            <!-- 第三行 -->
                            <el-col :span="24" v-if="item.isProblem === '有'">
                                <el-form-item label="问题描述：">
                                    <span>{{ item.problemDesc }}</span>
                                </el-form-item>
                            </el-col>
                            <!-- 第四行 -->
                            <el-col :span="24">
                                <el-form-item label="照片：">
                                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                                        >全选</el-checkbox
                                    >
                                    &nbsp;&nbsp;
                                    <el-button type="primary" class="download">下载</el-button>
                                    <div style="margin: 15px 0"></div>
                                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                                        <el-checkbox v-for="city in cities" :label="city" :key="city">
                                            <img width="100px" src="@/assets/image/头像.png" alt="" />
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                            </el-col>
                            <!-- 第五行 -->
                            <el-col :span="24">
                                <el-form-item>
                                    <!--  -->
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
const cityOptions = ['上海', '北京', '广州', '深圳'];
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
            checkedCities: ['上海', '北京'],
            cities: cityOptions,
            isIndeterminate: true
        };
    },
    props: ["receiveInfo"],
    watch: {
        //  监听接收数据的变化
        receiveInfo(newVal) {
            //  在这里给伸缩栏加上开关
            for (const i in newVal) {
                newVal[i].displate = false
            }
            this.siteItemMessage = newVal
        }
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
            this.checkedCities = val ? cityOptions : [];
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
.station {
    min-height: 500px;
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
                border: 2px solid rgb(206,72,73);
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
</style>