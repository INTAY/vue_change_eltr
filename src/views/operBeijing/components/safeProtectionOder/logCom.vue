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
import { queryLog } from '@/api/operBeijing/patrolFormManage';
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
    .el-timeline-item {
        height: 80px;
    }
   /deep/ .el-timeline-item::marker {
        color: #fff;
    }
  /deep/ .el-timeline-item {
        padding-bottom: 8px;
        &:nth-child(1) {
            .el-timeline-item__node {
                background: #1394c5;
            }
        }
    }
.log-model {
    padding: 25px 20px 0 10px;
}
/deep/ .el-timeline-item__timestamp {
    color: #333;
    line-height: 1;
    font-size: 13px;
}

.el-timeline {
    margin-left: 8px;
}
/deep/ .el-timeline-item__node--normal {
    left: 0;
    width: 9px;
    height: 9px;
}
/deep/ .el-timeline-item:nth-child(1) .el-timeline-item__node {
    box-shadow: 0px 0px 7px #1394c5;
}
/deep/ .el-timeline-item__timestamp.is-bottom {
    margin: -59px 0 0 -113px;
    width: 73px;
    text-align-last: right;
    line-height: inherit;
    color: #707070;
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
                line-height: 52px;
                .a_label {
                    display: inline-block;
                    width: 65px;
                    text-align: right;
                    color: darkgrey;
                }
                .a {
                    // color: #606266;
                    padding-left: 8px;
                }
            }
        }
        .right_zky {
            width: 148px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #eaeaea;
            color: #707070;
        }
    }
}
</style>