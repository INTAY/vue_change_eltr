<template>
    <div>
        <!-- 基础信息 -->
        <div class="title">
            <div class="sign"></div>
            <div>基础信息</div>
        </div>
        <div class="basic commonModule">
            <div
                v-for="(item, index) in Basic"
                :key="index"
                :class="{
                    basic_message: true,
                    ModuleColor: true
                }"
            >
                <div class="basic_message_name">{{ item.name }}</div>
                <div>{{ item.message }}</div>
            </div>
        </div>
        <!-- 运维模块 -->
        <div class="title">
            <div class="sign"></div>
            <div>运维模块</div>
        </div>
        <div class="OpsModule commonModule">
            <el-form :model="OpsModuleForm" label-width="80px" size="mini">
                <el-form-item label="模块名称:">
                    <div class="ModuleColor">{{ OpsModuleForm.inspName }}</div>
                </el-form-item>
                <el-form-item label="主模块:">
                    <!-- 收缩和展开模块 -->
                    <div v-if="disShow">
                        <div class="openContral" @click="is_show = false" v-if="is_show">
                            收缩&nbsp;&nbsp;<i class="el-icon-arrow-up"></i>
                        </div>
                        <div class="openContral" @click="is_show = true" v-else>展开&nbsp;&nbsp;<i class="el-icon-arrow-down"></i></div>
                    </div>
                    <!-- 主体 -->
                    <div :class="is_show ? 'work_detail' : 'new_detail'">
                        <div
                            class="OpsMain"
                            v-for="(item, index) in OpsModuleForm.inspectContentDetVos"
                            :key="index"
                            @click="getChildren(item.id)"
                        >
                            <el-button class="btnClass">{{ item.libName }}</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="子模块名称:">
                    <div class="childrenModule">
                        <div class="crossMoule" v-for="(item, index) in childrenModuleData" :key="index">
                            <div class="crossIndex">{{ index + 1 }}</div>
                            <!-- 超过显示隐藏并显示弹出小框显示全部 -->
                            <el-tooltip class="item" effect="dark" :content="item.libName" placement="bottom-start">
                                <div class="overHide">{{ item.libName }}</div>
                            </el-tooltip>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="照片：" label-width="107px">
                    <div v-if="!!urlList">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        &nbsp;&nbsp;
                        <el-button size="mini" @click="handleBatchDownload" class="newButtonColor download_btn">下载</el-button>
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
    </div>
</template>

<script>
import Bus from '@/components/bus.js';
import { getOrderDetail } from '@/api/operation/planTasks';
import FunLib from '@/utils/mulDownloadPic';

export default {
    data() {
        return {
            visible: false,
            Basic: [],
            OpsModuleForm: {},
            childrenModuleData: [],
            chiildrenItems: [],
            is_show: false,
            disShow: false,
            checkAll: false,
            isIndeterminate: false,
            urlList: [],
            urlArr: []
        };
    },
    mounted() {
        Bus.$on('ISTake', (e) => {
            this.getOrderDetail(e);
        });
    },
    methods: {
        async getOrderDetail(id) {
            const { data: res } = await getOrderDetail(id);
            Bus.$emit('staId', res.staName);
            Bus.$emit('className', res.dealDept);
            //照片
            this.urlList = res.docUrls;
            //基础信息
            (this.Basic = [
                { name: '任务名称:', message: res.taskName },
                { name: '充电站:', message: res.staName },
                { name: '区县:', message: res.regName },
                { name: '工单编号:', message: res.id },
                { name: '处理部门:', message: res.dealDept },
                { name: '附属设施工单状态:', message: res.state },
                { name: '派发日期:', message: res.dispatchTime },
                { name: '工单开始时间:', message: res.receiveTime },
                { name: '工单结束时间:', message: res.finishTime },
                { name: '工单持续时长:', message: res.duration },
                { name: '维护原因:', message: res.inspectReason }
            ]),
                //运维模块
                (this.OpsModuleForm = res);
            let box = res.inspectContentDetVos;
            //当模块数量到6 的时候显示
            if (this.OpsModuleForm.inspectContentDetVos.length >= 6) {
                this.disShow = true;
            }
            //  把所有模块下的子模块都装起来
            const _this = this;
            for (const key in box) {
                for (const i in box[key].children) {
                    //  所有的子模块数据放在这里
                    _this.chiildrenItems = [..._this.chiildrenItems, box[key].children[i]];
                }
            }
            //把首次的id传给,初始化的时候能有数据
            let FistId = box[0].id;
            this.getChildren(FistId);
            this.$forceUpdate();
        },
        getChildren(id) {
            //  点击获得主模块id，id = parentId
            this.childModel = [];
            this.childrenModuleData = this.chiildrenItems.filter((item) => item.parentId == id);
        },
        //照片
        handleCheckAllChange(val) {
            this.urlArr = val ? this.urlList : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.urlList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.urlList.length;
        },
        handleBatchDownload() {
            let fliesArr = [];
            //  把所有下载的图片都组装起来放到fliesArr
            for (let i = 0; i < this.urlArr.length; i++) {
                fliesArr.push({
                    url: this.urlArr[i],
                    name: i
                });
            }
            FunLib.download(fliesArr);
        }
    },
    computed: {
        // 项目内容
        word() {
            if (this.is_show === false) {
                return '展开';
            } else if (this.is_show === true) {
                return '收起';
            } else if (this.is_show === '') {
                return null;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
//标题样式
.title {
    display: flex;
    font-size: 16px;
    margin-bottom: 18px;
    .sign {
        width: 4px;
        height: 15px;
        margin-top: 4px;
        margin-right: 9px;
        border-radius: 5px;
        font-weight: 500;
        background-color: #24b3ca;
    }
}
// 基础信息
.basic {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 30px 18px;
    .basic_message {
        display: flex;
        flex: 50%;
        font-size: 14px;

        padding-top: 15px;
        .basic_message_name {
            width: 120px;
            margin-right: 12px;
            color: #909090;
            text-align: right;
        }
        //首行占65%
        &:nth-child(1) {
            flex: 100%;
        }
        &:nth-child(2) {
            flex: 100%;
        }
    }
}
//运维模块
.OpsModule {
    padding: 18px 30px;
    //主模块
    .OpsMain {
        position: relative;
        display: inline-block;
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
//子模块信息
.childrenModule {
    color: #232323;
    .crossMoule {
        display: flex;
        padding-left: 32px;
        width: 90%;
        height: 40px;
        font-size: 14px;
        line-height: 40px;
    }
    .crossMoule:nth-child(even) {
        background-color: #ededed;
    }
    .crossIndex {
        margin-right: 30px;
        width: 20px;
    }
}
/deep/.el-form-item__label {
    color: #a0a0a0;
}

//基础和运维模块的公共样式
.commonModule {
    box-sizing: border-box;
    border: 1px solid #efefef;
    margin-bottom: 29px;
    background-color: #f8f8f8;
}
//字体颜色
.ModuleColor {
    color: #363636;
}
.new_detail {
    height: 29px;
    overflow: hidden;
}
.work_detail {
    height: 100%;
}
.openContral {
    float: right;
    margin-top: 5px;
    margin-right: 33px;
    color: #187fa2;
    cursor: pointer;
}
.overHide {
    width: 350px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>