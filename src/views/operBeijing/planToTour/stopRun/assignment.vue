<template>
    <div>
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
                    ModuleColor: true,
                    first_name: index == 0
                }"
            >
                <div class="basic_message_name">{{ item.name }}</div>
                <div>{{ item.message }}</div>
            </div>
            <div style="flex: 100%; color: #909090" class="basic_message basic_message_name">
                申请附件： 
                <a :href="downloadmap.baseUrl" target="_blank" rel="noopener noreferrer" v-if="!!downloadmap.baseUrl" download class="download_btn">附件下载</a>
                <span v-else>无附件</span>
            </div>
        </div>
        <!-- 审批意见 -->
        <div class="approval">
            <div class="title">
                <div class="sign"></div>
                <div>审批意见</div>
            </div>
            <div class="textInput"><el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入您的审批意见"></el-input></div>
        </div>
    </div>
</template>

<script>
import { bjProOptApply } from '@/api/operation/planTasks';
import { mapState } from 'vuex';
import { formatDate } from '@/utils/DateFormat';
import { DICTDATA, getDict, translatorDict } from '@/api/dict';

export default {
    data() {
        return {
            Basic: [],
            OpsModuleForm: {},
            siteData: [],
            ruleForm: {},
            detail: {},
            downloadmap: {
                name: '',
                baseUrl: ''
            }
        };
    },
    computed: {
        ...mapState(['user'])
    },
    mounted() {
        this.bjProOptApply(this.user.pathData.busId);
    },
    methods: {
        reStart() {},
        async bjProOptApply(data) {
            const { data: res } = await bjProOptApply(data);
            this.detail = res;
            if (res.optStartTime) {
                res.optStartTime = formatDate('YYYY-mm-dd HH:MM:SS', res.optStartTime);
            }
            if (res.preReworkTime) {
                res.preReworkTime = formatDate('YYYY-mm-dd HH:MM:SS', res.preReworkTime);
            }
            if (res.applyTime) {
                res.applyTime = formatDate('YYYY-mm-dd HH:MM:SS', res.applyTime);
            }
            this.Basic = [
                { name: '站名称:', message: res.staName },
                { name: '申请编码:', message: res.id },
                { name: '申请类型:', message: translatorDict(DICTDATA.STOP_RESTORE_TYPE, Number(res.planType)) },
                { name: '工单编号:', message: res.workSheetId },
                { name: '申请单位:', message: res.applyOrgName },
                { name: '申请来源:', message: translatorDict(DICTDATA.STOP_AFTER_SOURCE, Number(res.applySource)) },
                { name: '停运类型:', message: translatorDict(DICTDATA.OFF_STREAM_TYPE, Number(res.offType)) },
                { name: '停运标记:', message: translatorDict(DICTDATA.OFF_STREAM_MARK, Number(res.offLabel)) },
                { name: '申请停运时间:', message: res.optStartTime },
                { name: '预设复投时间:', message: res.preReworkTime },
                { name: '申请原因:', message: res.reasonType },
                { name: '申请人:', message: res.applyManName },
                { name: '申请时间:', message: res.applyTime }
            ];
            this.downloadmap.baseUrl = res.url;
        },
        downloadFiles() {}
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
        flex: 33%;
        font-size: 14px;

        padding-top: 15px;
        .basic_message_name {
            margin-right: 18px;
            color: #909090;
        }
    }
    //审核人
    .center_name {
        flex: 35%;
    }
    //任务名称占比
    .first_name {
        flex: 100%;
    }
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
//审批意见
.approval {
    margin-top: 20px;

    .textInput {
        border: 1px solid #efefef;
        .el-textarea {
            border: 20px solid #f8f8f8;
        }
    }
}
.dialog-footer {
    padding-left: calc(50% - 205px);
    .realButton {
        width: 200px;
        margin-top: 30px;
    }
    .reStart {
        width: 200px;
        margin-top: 30px;
        margin-left: 10px;
        border: 1px solid #1396c2;
    }
}
.download_btn {
    display: inline-block;
    border-radius: 3px;
    height: 23px !important;
    width: 70px !important;
    line-height: 22px !important;
    text-align: center;
    color: #0c83ae;
    text-decoration: underline;
}
</style>