<template>
    <div class="log-model">
        <el-dialog title="日志" :visible.sync="show" width="50%" :before-close="handleClose">
            <el-timeline>
                <el-timeline-item  v-for="(item, index) in data" :key="index" :color="item.color" :timestamp="item.editTime" placement="top">
                    <el-row>
                        <el-col :span="18">
                            <section class="content-item">
                                <el-col :span="8">
                                    <div class="content-title">操作人</div>
                                    &nbsp;&nbsp;
                                    <div class="inline">{{item.editManId}}</div>
                                </el-col>
                                <el-col :span="14" :offset="2">
                                    <div class="content-title">所属部门</div>
                                    &nbsp;&nbsp;
                                    <div class="inline">{{item.content}}</div>
                                </el-col>
                                <el-col :span="24">
                                    <div class="content-title">&nbsp;&nbsp;&nbsp;备注</div>
                                    &nbsp;&nbsp;
                                    <div class="inline">{{item.remark}}</div>
                                </el-col>
                            </section>
                        </el-col>
                        
                        <el-col :span="5">
                            <section class="content-article">
                                <span>{{item.action}}</span>
                            </section>
                        </el-col>
                    </el-row>
                    
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        props:['show','data', 'componentName'],
        methods: {
            handleClose() {
                //  传给调用者
                let returnMap = {
                    dialogCtrl: false,
                    answer: false,
                }
                this.$emit('logCtrl', returnMap)
            },
        },
        watch: {
            componentName(val) {
                console.log(val);
            }
        },
    }
</script>

<style lang="scss" scoped>
.log-model {
    .content-item {
        padding: 10px 20px;
        height: 70px;
        background-color: rgb(242, 242, 242);
    }
    .content-title {
        color: rgb(144, 144, 144);
        display: inline;
        // width: 60px;
        text-align: right;
        line-height: 24px;
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
        line-height: 70px;
        background-color: rgb(234, 234, 234);
        text-align: center;
    }
}
/deep/ .el-timeline-item__timestamp {
    color: #333;
    line-height: 1;
    font-size: 13px;
}
</style>