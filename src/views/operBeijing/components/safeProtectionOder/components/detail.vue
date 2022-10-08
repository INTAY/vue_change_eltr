<template>
    <div class="detail" style="margin-top: -15px">
        <div class="title"><i />基础信息</div>
        <el-form ref="form" :model="formInline" label-width="100px" class="base-info">
            <el-col :span="24">
                <el-form-item label="任务名称" class="wrap">
                    <span>{{ formInline.taskName }}</span>
                </el-form-item>
            </el-col>

            <el-col :span="24">
                <el-form-item label="充电站" class="wrap">
                    <span>{{ formInline.staName }}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="区县" class="wrap">
                    <span>{{ formInline.regName }}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="处理部门" class="wrap">
                    <span>{{ formInline.dealDept }}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="工单编号" class="wrap">
                    <span>{{ formInline.id }}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="工单开始时间" class="wrap">
                    <span>{{ formInline.circleStart }}</span>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item label="工单持续时长" class="wrap">
                    <span>{{ formInline.period }}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="派发日期" class="wrap">
                    <span>{{ formInline.dispatchTime }}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="工单结束时间" class="wrap">
                    <span>{{ formInline.circleEnd }}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="安防工单状态" class="wrap">
                    <span>{{ formInline.state }}</span>
                </el-form-item>
            </el-col>

            <el-form-item label="维护原因">
                <span>{{ formInline.inspectReason }}</span>
            </el-form-item>
        </el-form>
        <div style="margin-top: 15px"></div>
        <div class="title"><i />运维模块</div>
        <el-form ref="form" :model="formInline" label-width="95px" class="base-info base-info-t">
            <el-form-item label="模块名称" style="margin-bottom: 3px !important">
                <span>{{ formInline.inspName }}</span>
            </el-form-item>
            <el-form-item label="主模块" style="margin-bottom: 0 !important">
                <span v-if="opsModule.length > 7">
                    <div class="openContral" @click="is_show = false" v-if="is_show">收缩&nbsp;&nbsp;<i class="el-icon-arrow-up"></i></div>
                    <div class="openContral" @click="is_show = true" v-else>展开&nbsp;&nbsp;<i class="el-icon-arrow-down"></i></div>
                </span>

                <div :class="is_show ? 'work_detail' : 'new_detail'">
                    <div class="OpsMain" v-for="(item, index) in opsModule" :key="index" @click="getChildren(item)">
                        <el-button slot="reference" :class="{ btnClass: true, currentBtn: item.libName == libName }">{{
                            item.libName
                        }}</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-form-item :label="libName + '子模块'">
                <div v-for="(item, index) in childModel" :key="index">
                    <section :class="{ twice: index % 2 != 0 }" style="padding: 0 20px">
                        <span>{{ index + 1 }}</span
                        >&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ item.libName }}</span>
                    </section>
                </div>
            </el-form-item>
            <el-form-item label="照片">
                <div v-if="!!urlList">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
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
                <div v-else>无照片</div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Bus from '../../../../../../src/components/bus.js';
import { getOrderDetail } from '@/api/operBeijing/patrolFormManage';
import FunLib from '@/utils/mulDownloadPic';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import $ from 'jquery';
export default {
    data() {
        return {
            urlList: [],
            urlArr: [],
            formInline: {},
            childrenItems: [],
            opsModule: [],
            baseInfo: {},
            childModel: [],
            checkAll: false,
            isIndeterminate: false,
            libName: '',
            is_show: false
        };
    },
    created() {
        Bus.$on('sendOrderId', (data) => {
            this.getOrderDetail(data);
        });
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
    },

    methods: {
        handleBatchDownload() {
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
            // console.log(res, '工单信息');
            this.formInline = res;
            this.urlList = res.docUrls;
            this.opsModule = res.inspectContentDetVos;
            this.libName = this.opsModule[0].libName;
            this.childModel = this.opsModule[0].children;
            let box = res.inspectContentDetVos;
            //  把所有模块下的子模块都装起来
            const _this = this;
            _this.childrenItems = [];
            for (const key in box) {
                for (const i in box[key].children) {
                    //  所有的子模块数据放在这里
                    _this.childrenItems = [..._this.childrenItems, box[key].children[i]];
                }
            }
            //  传递title
            Bus.$emit('orderTitle', this.formInline);
        },
        getChildren(item) {
            this.childModel = [];
            this.libName = item.libName;
            let id = item.id;
            //  点击获得主模块id，id = parentId
            this.childModel = this.childrenItems.filter((item) => item.parentId == id);
        },
        handleCheckAllChange(val) {
            this.urlArr = val ? this.urlList : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            // this.checkAll = checkedCount === !!this.urlList.length ? this.urlList.length : '';
            this.checkAll = checkedCount === this.urlList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.urlList.length;
        }
    }
};
</script>

<style lang="scss" scoped>
.detail {
    // title
    .title {
        margin: 15px 0 15px 2px;
        i {
            float: left;
            width: 4px;
            height: 14px;
            background: #24b3ca;
            margin-right: 10px;
            margin-top: 3px;
            border-radius: 5px;
        }
    }
    .base-info {
        width: 100%;
        padding: 10px 40px 15px 10px;
        background: #f8f8f8;
        float: left;
        margin-bottom: 15px;
    }
    .base-info-t {
        padding: 10px 40px 10px 10px;
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
    .el-col {
        height: 30px;
    }
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
        .currentBtn {
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
.openContral {
    float: right;
    margin-top: 2px;
    margin-right: 33px;
    color: #187fa2;
    font-size: 13px;
    cursor: pointer;
}
.el-icon-arrow-down:before,
.el-icon-arrow-up:before {
    margin-left: -5px;
}
</style>