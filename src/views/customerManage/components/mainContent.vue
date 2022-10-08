<template>
    <div class="content-box">
        <ul>
            <li class="info default" @click="changeTab(1)" :class="{active:activeSwitch == 1}">信息</li>
            <li class="question default" @click="changeTab(2)" :class="{active:activeSwitch == 2}">问题</li>
            <li class="delete">
                <el-button class="BatchDeleteColor listBTN" @click="deleteMap(activeSwitch)">批量删除</el-button>
            </li>
            <li class="add">
               <el-button class="newButtonColor btnSpace listBTN" @click="addMap(activeSwitch)">新增</el-button>
            </li>
        </ul>
        <!-- activeSwitch == 1 显示信息   activeSwitch == 2 显示问题 -->
        <info v-if="activeSwitch==1" ref="info"></info>
        <question v-if="activeSwitch==2" ref="question"></question>
         <!-- 
            show 弹窗开关  
            formInline  当前为修改时需要赋值的数据
            useTo 当前是什么功能，修改modify 还是新增 add
            makeTo 当前是信息info还是问题question 
         -->
        <create-modify-model :title="title" :show="addDialog" :makeTo="makeTo" :useTo="useTo" @closeEvent="retuncloseFun"></create-modify-model>
    </div>
</template>

<script>
import info from './info.vue';
import question from './question.vue';
import createModifyModel from './createOrModifyModel.vue';
    export default {
        data() {
            return {
                //  1 的时候信息显示，后者反之
                activeSwitch: 1,
                //  新增弹窗相关
                addDialog: false,
                makeTo: '',
                useTo: 'add',  //  在这个页面就是新增
                title:'新增'
            }
        },
        components: {
            info,
            question,
            createModifyModel
        },
        methods: {
            //  切换tab
            changeTab(flag) {
                //  1 的时候信息显示，后者反之
                if(flag == 1) {
                    this.activeSwitch = 1
                    this.makeTo = 'info'
                } else {
                    this.activeSwitch = 2
                    this.makeTo = 'question'
                }
            },
            // 批量删除 activeSwitch == 1 说明是信息的操作，反之
            deleteMap(tag) {
                
                this.$confirm('确认删除选中的数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // if(this.activeSwitch == 1) {

                    // }else {

                    // }
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }).catch(() => {
                    // if(this.activeSwitch == 1) {

                    // }else {

                    // }
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });
            },
             // 新增 activeSwitch == 1 说明是信息的操作，反之
            addMap(tag) {
                this.addDialog = true
                if(this.activeSwitch == 1) {
                    this.makeTo = 'info'
                } else {
                    this.makeTo = 'question'
                }
            },
            //  子传过来的回调
            retuncloseFun(val) {
                this.addDialog = val.dialogstatus
            }
        },
    }
</script>

<style lang="scss" scoped>
.content-box {
    ul {
        margin: 20px;
        width: calc(100% - 30px);
        position: relative;
        border-bottom: 2px solid #1396C2;
        li {
            display: inline-block;
        }
        .question {
            margin-left: 10px;
        }
        .add,.delete {
            float: right;
            margin-top: 4px;
            margin-right: 10px;
        }
        //  默认样式
        .default {
            background-color: #E8E8E8;
            width: 160px;
            line-height: 30px;
            color: #333;
            text-align: center;
            border-radius: 3px;
            position: relative;
            bottom: -5px;
        }
        //  选中样式
        .active {
            background-color: #1396C2;
            width: 160px;
            line-height: 40px;
            color: white;
            text-align: center;
            border-radius: 1px;
            position: relative;
            bottom: 0px;
        }
    }
    .content-add-dialog {
        padding: 0 80px 0 40px;
        height: 250px;
        
    }
}

</style>