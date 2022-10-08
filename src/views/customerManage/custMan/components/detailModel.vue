<template>
    <!-- 详情弹窗 -->
    <el-dialog title="详情" :visible.sync="show" width="50%" :before-close="handleClose">
        <div class="content-detail-dialog">
            <el-row class="bg1">
                <el-col :span="2" class="title" :offset="2">类型</el-col>
                <el-col :span="16">{{data.type}}</el-col>
            </el-row>
            <el-row class="bg2">
                <el-col :span="2" class="title" :offset="2">标签</el-col>
                <el-col :span="16">{{data.labels}}</el-col>
            </el-row>
            <el-row class="bg1">
                <el-col :span="2" class="title" :offset="2">标题</el-col>
                <el-col :span="16">{{data.title}}</el-col>
            </el-row>
            <el-row class="bg2">
                <el-col :span="2" class="title" :offset="2">内容</el-col>
                <el-col :span="16">{{data.answer}}</el-col>
            </el-row>
            <!-- 只有在当前tab是信息的时候显示文件下载 -->
            <el-row class="bg1" v-if="hasFile">
                <el-col :span="2" class="title" :offset="2">文件</el-col>
                <el-col :span="10">
                    <div v-for="(item,index) in data.fileUrls" :key="index">
                        <i class="el-icon-document" style="color:#90CAF6;font-size: 18px"></i>
                        &nbsp;&nbsp;
                        <span>{{item.name}}</span>
                        &nbsp;&nbsp;
                        <!-- <span @click="openUrl(item.value)" style="color:#90CAF6;course: poiner">下载</span> -->
                        <a :href="item.value" target="_blank" rel="noopener noreferrer" style="color:#90CAF6;course: poiner">下载</a>
                    </div>
                </el-col>    
            </el-row>
            <el-row v-if="isAnswer" style="margin-top: 30px">
                <el-col :span="3" :offset="6">
                    <el-button class="bouncedHold btnSpace operate" size="mini" @click="add">已答</el-button>
                </el-col>
                <el-col :span="3" :offset="4">
                    <el-button class="cancelBTN btnSpace operate" size="mini" @click="add">打回</el-button>
                </el-col>
            </el-row>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        props:['show','data','hasFile','isAnswerFun','isAnswer'],
        methods: {
            handleClose() {
                //  传给调用者
                let returnMap = {
                    dialogCtrl: false,
                    answer: false
                }
                this.$emit('dialogCtrl', returnMap)
            },
            add() {},
            openUrl(item) {
                // window.location.href=item

                var elemIF = document.createElement("iframe");
          elemIF.src = item;
          elemIF.style.display = "none";
          document.body.appendChild(elemIF)
            }
        },
    }
</script>

<style lang="scss" scoped>
.content-detail-dialog {
    .title {
        color: #929292;
    }
    .bg1 {
        background-color: rgb(255, 255, 255);
        padding: 10px;
    }
    .bg2 {
        background-color: rgb(243, 243, 243);
        padding: 10px;
    }
    .operate {
        width: 150px;
    }
}
/deep/ .el-dialog__body {
    padding: 15px 40px 30px 40px;
}
    
</style>