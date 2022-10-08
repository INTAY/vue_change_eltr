import { type } from '@/components/upload/picUpload';
<template>
    <!-- 新增弹窗 -->
    <el-dialog :title="title" :visible.sync="show" width="50%" :before-close="handleClose">
        <div class="content-add-dialog">
            <el-form ref="form" :model="formInline" label-width="80px">
                <el-col :span="12">
                    <el-form-item label="类型">
                        <!-- 修改的时候设置为不可选择 -->
                        <el-select v-model="chooseType" style="width: 320px" placeholder="请选择" :disabled="title == '修改'">
                            <el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value" ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="标签">
                        <el-input v-model="formInline.name" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="标题">
                        <el-input v-model="formInline.name" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <!-- 在问题的时候出现此栏 -->
                    <el-form-item v-if="chooseType == 0" label="解答">
                        <el-input type="textarea" v-model="formInline.desc" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <!-- 在信息的时候出现此栏 -->
                    <el-form-item label="内容" v-if="chooseType == 1">
                        <el-input type="textarea" v-model="formInline.desc" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <!-- 在信息的时候出现此栏 -->
                    <el-form-item v-if="chooseType == 1" label="附件">
                        浏览
                        <span style="color: red">仅支持word、execl、pdf、jpg、png、gif、ceb</span>
                    </el-form-item>
                </el-col>
                <el-col :span="13" :offset="6">
                    <el-form-item>
                    <el-button class="bouncedHold btnSpace operate" size="mini" @click="add">确认</el-button>
                    <el-button size="mini" class="cancelBTN operate" @click="cancel">取消</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </div>
    </el-dialog>
</template>

<script>
    /**
       show 弹窗开关  
       formInline  当前为修改时需要赋值的数据
       useTo 当前是什么功能，修改modify 还是新增 add
       makeTo 当前是信息info还是问题question 
     */
    export default {
        data() {
            return {
                chooseType: 0,
                typeList: [{value: 0, label: '问题'},{value: 1, label: '信息'}]
            }
        },
        props: {
            title: {
                type: String
            },
            show: {
                type: Boolean
            },
            formInline: {
                type: Object,
                default: Object
            },
            makeTo: {
                type: String
            },
            useTo: {
                type: String
            }
        },
        watch: {
            makeTo(val) {
                console.log(val ,'======22=========')
                if(this.makeTo == 'question') {
                    this.chooseType = 0
                }
                else {
                    this.chooseType = 1
                }
            }
        },
        mounted () {
            if(this.makeTo == 'question') 
                this.chooseType = 0
            else 
                this.chooseType = 1
            
        },
        methods: {
            //  回调
            handleClose() {
                //  传给调用者
                let returnMap = {
                    dialogstatus: false,
                }
                this.$emit('closeEvent', returnMap)
            },
            //  确定
            add() {
                //  当前是问题的新增
                if (this.chooseType==0) {
                    
                }else {
                    //  反之
                }
            },
            //  新增弹窗中的取消
            cancel() {
                this.handleClose()
                // this.addDialogVisible = false
            },
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
    height: 300px;

}
    
</style>