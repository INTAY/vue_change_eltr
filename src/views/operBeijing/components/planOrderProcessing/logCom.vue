<template>
    <div class="log-model">
        <div class="time_lines_zky">
            <el-timeline :reverse="reverse">
                <el-timeline-item
                    v-for="item in activities"
                    :key="item.id"
                    :timestamp="formatDate('YYYY-mm-dd HH:MM:SS', item.recTime)"
                    size="normal"
                    placement="bottom"
                >
                    <div class="card_zky">
                        <div class="left_zky">
                            <p>
                                <span class="a_label">操作人</span><span class="a">{{ item.handleManName }}</span>
                                <span class="a_label" style="margin-left: 10px">所属部门</span><span class="a">{{ item.handleOrgName }}</span>
                            </p>
                        </div>
                        <div class="right_zky">{{ item.descr }}</div>
                    </div>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>

<script>
import { formatDate } from '@/utils/DateFormat';
import { queryLog } from '@/api/operation/planTasks';
import Bus from '../../../../../src/components/bus.js';

export default {
    data() {
        return {
            formatDate,
            reverse: true, // 正序倒序
            activities: [],
        };
    },
    //  得到工单id
    created() {
        Bus.$on('sendOrderId', (data) => {
            this.queryLog(data);
        });
    },
    methods: {
        async queryLog(id) {
            const { data: res } = await queryLog(id);
            this.activities = res
        },
    }
};
</script>

<style lang="scss" scoped>
.log-model {
    // border: 1px solid #cecece;
    padding: 20px 10px;
    .content-item {
        padding: 10px 20px;
        line-height: 40px;
        height: 60px;
        background-color: rgb(242, 242, 242);
    }
    .content-title {
        color: rgb(144, 144, 144);
        display: inline;
        // width: 60px;
        text-align: right;
        line-height: 50px;
    }
    .inline {
        display: inline;
        // width: 600px;
        // overflow: hidden;
        // white-space: nowrap;
        // text-overflow: ellipsis;
    }
    .content-article {
        // float: right;
        line-height: 60px;
        background-color: rgb(234, 234, 234);
        text-align: center;
    }
}
/deep/ .el-timeline-item__timestamp {
    color: #333;
    line-height: 1;
    font-size: 13px;
}
.time_lines_zky {
    padding: 10px;
    margin-left: 70px;
    .card_zky {
        height: 60px;
        display: flex;
        border-radius: 4px;
        border: 1px solid #e6ebf5;
        background: #f2f2f2;
        .left_zky {
            flex: 1;
            box-sizing: border-box;
            padding-top: 4px;
            width: 100px;
            word-break: break-all;
            white-space: nowrap;
            text-overflow: ellipsis;
            p {
                line-height: 24px;
                .a_label {
                    display: inline-block;
                    width: 90px;
                    text-align: right;
                    color: darkgrey;
                }
                .a {
                    color: #363636;
                    padding-left: 8px;
                }
            }
        }
        .right_zky {
            width: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #eaeaea;
            color: #707070;
        }
    }
}
</style>