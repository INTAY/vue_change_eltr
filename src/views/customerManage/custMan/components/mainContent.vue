<template>
    <div class="content-boxs">
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
        <info v-show="activeSwitch==1" ref="info"></info>
        <question v-show="activeSwitch==2" ref="question"></question>
         <!-- 
            show 弹窗开关  
            formInline  当前为修改时需要赋值的数据
            useTo 当前是什么功能，修改modify 还是新增 add
            makeTo 当前是信息info还是问题question 
         -->
        <create-modify-model v-if="addDialog" :title="title" :formInline="crateData" :show="addDialog" :makeTo="makeTo" :useTo="useTo" @closeEvent="retuncloseFun"></create-modify-model>
    </div>
</template>

<script>
import info from './info.vue';
import question from './question.vue';
import createModifyModel from './createOrModifyModel.vue';
    import { batchDelete } from '@/api/customerService/knowledgeLibrary';


    export default {
        data() {
            return {
                //  1 的时候信息显示，后者反之
                activeSwitch: 1,
                //  新增弹窗相关
                addDialog: false,
                makeTo: '',
                useTo: 'add',  //  在这个页面就是新增
                title:'新增',
                question: null,  //  问题模块
                info: null,  //  信息
                crateData: {
                    knowledgeTypeId: ''
                }
            }
        },
        components: {
            info,
            question,
            createModifyModel
        },
        mounted () {
            this.question = this.$parent.$parent.$parent.$refs.content.$refs.question
            this.info = this.$parent.$parent.$parent.$refs.content.$refs.info
            this.formInline = this.$parent.$parent.$parent.$refs.searchBar.formInline
            
        },
        methods: {
            //  切换tab
            changeTab(flag) {
                this.formInline.knowledgeTypeId = this.$parent.$parent.$parent.$refs.tree.parentId || -1
                //  切换的时候从第一页开始查
                this.formInline.current = 1
                
                console.log(this.formInline, '===========');
                //  1 的时候信息显示，后者反之
                if(flag == 1) {
                    this.activeSwitch = 1
                    this.makeTo = 'info'
                    this.formInline.type = this.activeSwitch
                    this.info.queryData(this.formInline)
                } else {
                    this.activeSwitch = 2
                    this.makeTo = 'question'
                    this.formInline.type = this.activeSwitch

                    this.question.queryData(this.formInline)
                }
            },
            // 批量删除 activeSwitch == 1 说明是信息的操作，反之
            deleteMap(tag) {
                if(that.info.multipleSelection.length == 0) return
                let that = this
                that.$confirm('确认删除选中的数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(that.activeSwitch == 1) {
                        //  删除后查询
                        that.batchDelete(that.info.multipleSelection)
                        that.info.queryData({
                            type: 1,
                            knowledgeTypeId: this.$parent.$parent.$parent.$refs.tree.parentId
                        })
                    }else {
                        that.batchDelete(that.question.multipleSelection)
                        that.question.queryData({
                            type: 2,
                            knowledgeTypeId: this.$parent.$parent.$parent.$refs.tree.parentId
                        })
                    }
                }).catch(() => {
                    
                });
            },
            batchDelete(params) {
                batchDelete(params).then(res => {
                    if(res.code === '000000') {
                        this.$message({type: 'success', message: '删除成功'})
                    }
                })
            },
             // 新增 activeSwitch == 1 说明是信息的操作，反之
            addMap(tag) {
                let that = this
                that.addDialog = true
                if(that.activeSwitch == 1) {
                    that.makeTo = 'info'
                } else {
                    that.makeTo = 'question'
                }
                that.crateData.knowledgeTypeId = that.$parent.$parent.$parent.$refs.tree.parentId
                // that.crateData = {
                //     knowledgeTypeId: that.$parent.$parent.$parent.$refs.tree.parentId,
                //     labels: '',
                //     title: '',
                //     answer: '',
                // }
            },
            //  子传过来的回调
            retuncloseFun(val) {
                this.addDialog = val.dialogstatus
            }
        },
    }
</script>

<style lang="scss" scoped>
.content-boxs {
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