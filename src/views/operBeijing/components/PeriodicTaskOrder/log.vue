<template>
    <div class="log">
        <el-timeline :reverse="true">
            <el-timeline-item
                :timestamp="item.timeDate"
                placement="bottom"
                v-for="(item, index) in timelineDate"
                :key="index"
                size="normal"
            >
                <el-card>
                    <div class="cardMain">
                        <div class="cardMain_man">
                            <span>操作人</span>
                            <span class="manBlock">{{ item.handleManName }}</span>
                        </div>
                        <div class="cardMain_development">
                            <span>所属部门</span>
                            <span class="manBlock">{{ item.handleOrgName }}</span>
                        </div>
                    </div>
                    <div class="cardTitle">{{ item.descr }}</div>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>


<script>
import { queryLog } from '@/api/operation/planTasks'; //引用日志事件的
import Bus from '@/components/bus';

export default {
    data() {
        return {
            timelineDate: [] //事件线数据
        };
    },
    created() {
        Bus.$on('ISTake', (e) => {
            
            this.queryLog(e);
        });
    },
    methods: {
        async queryLog(id) {
            //请求数据
            const { data: res } = await queryLog(id);
            //数据赋值
            this.timelineDate = res;
        }
    }
};
</script>

<style lang="scss" scoped>
.log {
    padding: 40px 80px 80px 120px;
}
/deep/.el-timeline-item__timestamp.is-bottom {
    position: absolute;
    top: 0;
    margin-left: -113px;
    width: 73px;
    line-height: inherit;
    text-align-last: right;
}
/deep/.el-timeline-item__content {
    padding: 10px 0 15px;
}
/deep/.el-card__body {
    display: flex;
    height: 60px;
    line-height: 60px;
    padding: 0px;
    border: none;
    .cardMain {
        display: flex;
        flex: 7.8;
        font-size: 14px;
        padding-left: 20px;
        color: #878787;
        background-color: #f2f2f2;
        // 操作人
        .cardMain_man {
            width: 150px;
        }
        // 所属部门
        .cardMain_development {
            flex: 1;
        }
        //操作人和所属部门公共样式
        .manBlock {
            margin-left: 15px;
            color: #3c3c3c;
        }
    }
    .cardTitle {
        flex: 1.8;
        font-size: 14px;
        color: #878787;
        text-align: center;
        background-color: #eaeaea;
    }
}
//第一个时间戳高亮
/deep/ .el-timeline-item:nth-child(1) .el-timeline-item__node {
    box-shadow: 0px 0px 10px #1394c5;
    background-color: #1396c2;
}
</style>