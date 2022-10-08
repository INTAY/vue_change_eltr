<template>
    <div class="detail">
        <div class="title"><i />基础信息</div>
        <el-form ref="form" :model="formInline" label-width="150px" class="base-info">
            <el-col :span="12">
                <el-form-item label="充电站">
                    <span>{{formInline.staName}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="区县">
                    <span>{{formInline.regName}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="工单编号">
                    <span>{{formInline.id}}</span>
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
                <el-form-item label="当前周期">
                    <span>{{formInline.period}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="计划工单状态">
                    <span>{{formInline.state}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="派发日期">
                    <span>{{formInline.dispatchTime}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="当前周期开始时间">
                    <span>{{formInline.circleStart}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="频率">
                    <span>{{formInline.freq}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="当前周期结束时间">
                    <span>{{formInline.circleEnd}}</span>
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
                <div class="OpsMain" v-for="(item, index) in opsModule" :key="index" @click="getChildren(item.id)">
                    <el-button slot="reference" class="btnClass">{{ item.libName }}</el-button>
                </div>
            </el-form-item>
            <el-form-item label="子模块名称">
                <div v-for="(item, index) in childModel" :key="index">
                    <section :class="{ twice: index % 2 != 0 }" style="padding: 0 30px">
                        <span>{{ index + 1 }}</span
                        >&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ item.libName }}</span>
                    </section>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Bus from '@/components/bus.js';
import { getOrderDetail } from '@/api/operation/planTasks';

export default {
    data() {
        return {
            formInline: {},
            chiildrenItems: [],
            opsModule: [],
            baseInfo: {},
            childModel: []

        };
    },
    created() {
        Bus.$on('sendOrderId', (data) => {
            this.getOrderDetail(data);
        });
    },
    methods: {
        async getOrderDetail(id) {
            const { data: res } = await getOrderDetail(id);
            this.formInline = res;
            this.opsModule = res.inspectContentDetVos
            let box = res.inspectContentDetVos
            //  把所有模块下的子模块都装起来
            const _this = this
            for (const key in box) {
                for (const i in box[key].children) {
                    //  所有的子模块数据放在这里
                    _this.chiildrenItems = [..._this.chiildrenItems, box[key].children[i]]
                }
            }
        },
        getChildren(id) {
            //  点击获得主模块id，id = parentId 
            this.childModel = []
            this.childModel = this.chiildrenItems.filter((item) => item.parentId == id)
        }
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
</style>