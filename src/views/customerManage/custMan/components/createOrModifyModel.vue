<template>
    <!-- 新增弹窗 -->
    <el-dialog :title="title" :visible.sync="show" width="50%" :before-close="handleClose">
        <div class="content-add-dialog">
            <el-form ref="form" :model="formInline" label-width="80px">
                <el-col :span="12">
                    <el-form-item label="类型">
                        <!-- 修改的时候设置为不可选择 -->
                        <el-select v-model="formInline.type" @change="()=>{this.$forceUpdate()}" style="width: 320px" placeholder="请选择" :disabled="title == '修改'">
                            <!-- <el-option label="信息" :value="1"> </el-option>
                            <el-option label="问题" :value="2"> </el-option> -->

                            <el-option v-for="(item,index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="标签" prop="labels">
                        <el-input v-model="formInline.labels" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="formInline.title" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <!-- 在问题的时候出现此栏 -->
                    <el-form-item v-if="this.makeTo == 'question'" label="解答" prop="answer">
                        <el-input type="textarea" v-model="formInline.answer" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <!-- 在信息的时候出现此栏 -->
                    <el-form-item label="内容" v-if="this.makeTo == 'info'" prop="answer">
                        <el-input type="textarea" v-model="formInline.answer" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <!-- 在信息的时候出现此栏 -->
                    <el-form-item v-if="formInline.type == 1 || formInline.type == '信息'" label="附件">
                        <!-- 浏览 -->
                        <!-- :action="`${this.BASE_API}/filestore/fileStore/uploadMultipartFileStore?uploadType=1`" -->
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            :action="`${this.BASE_API}/filestore/fileStore/uploadMultipartFileStore?uploadType=1`"
                            :on-remove="handleRemove"
                            multiple
                            :limit="5"
                            :headers="headers"
                            :file-list="fileList"
                            :on-success="handleImageSuccess"
                            :on-change="handleChange"
                            :auto-upload="false"
                            :before-upload="beforeUpload"
                            accept=".word,.execl,.pdf,.jpg,.png,.JPEG,.JPG,.PNG,.ceb,.gif,.GIF,.jpeg"
                            >
                            <el-button slot="trigger" size="small" type="primary">浏览</el-button>
                            <span style="color: red">仅支持word、execl、pdf、jpg、png、gif、ceb</span>
                        </el-upload>
                        <!-- <el-button size="small" type="primary" @click="submitUpload()">222</el-button> -->
                    </el-form-item>
                </el-col>
                <el-col :span="13" :offset="6">
                    <el-form-item>
                        <el-button class="bouncedHold btnSpace operate" size="mini" @click="add">确认</el-button>
                        <el-button size="mini" class="cancelBTN operate" @click="this.handleClose()">取消</el-button>
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
import Vue from "vue";
import { add, modifyKnowDetail, uploadFile } from '@/api/customerService/knowledgeLibrary';
import { BASE_API } from "@/api/request";
const tonken = Vue.cookie.get("token");

export default {
    data() {
        return {
            typeList: [
                { value: 2, label: '问题' },
                { value: 1, label: '信息' }
            ],
            question: null,
            info: null,
            knowledgeTypeId: '',
            childernSwitch: '',
            fileList: [],
            uploadUrl: '',
            dataObj: {fileType: 1, filename: "", type: 1},
            headers: { Authorization: "Bearer " + tonken },
            BASE_API: '',
            fileStringBuffer: ''
        };
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
    created () {
      this.BASE_API =BASE_API;
    },
    mounted() {
        //  刚进来判断在什么位置
        if (this.makeTo == 'question') {
            this.formInline.type = 2;
        }else {
            this.formInline.type = 1;
        }
        this.$forceUpdate()
        //  修改的时候反显的
        
        this.formInline.fileUrls && 
        this.formInline.fileUrls.forEach(item => {

            var obj = {} 
            let index = item.lastIndexOf('\/');
            let fileName  = item.substring(index + 1, item.length); //最后的文件名截取出来
            this.$set(obj,'name',fileName);
            this.$set(obj,'url',item);  //修改files里面的结构（name,url）
            this.fileList.push(obj)
        });
    },
    methods: {
          //监控上传文件列表
         handleChange(file, fileList) {
             let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name);
             if (existFile) {
                 this.$message.error('当前文件已经存在!');
                 fileList.pop();
             }
             this.fileList = fileList;
         },
         
        beforeUpload(file) {
            console.log(file);
            const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
            
            const whiteList = ["word", "execl", "pdf", "jpg", "png", "gif", "ceb"];
            
            if (whiteList.indexOf(fileSuffix) === -1) {
                this.$msg("上传文件只能是 word、execl、pdf、jpg、png、gif、ceb", "error");
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            
            if (!isLt2M) {
                this.$msg("上传文件大小不能超过 2MB", "error");
                return false;
            }
        },
        //  回调
        handleClose() {
            //  传给调用者
            let returnMap = {
                dialogstatus: false
            };
            this.$emit('closeEvent', returnMap);
        },
        //  确定
        add() {
            this.$refs.upload.submit();
            let that = this
            //  TODO 修改的没做好
            setTimeout(() => {
                
            //  新增~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            if (that.title == '新增') {
                that.fileList.forEach(item => {
                    // console.log(item, '=====that.fileList=======')
                    //  拼接文件名
                    that.fileStringBuffer += item.response.data[0].url+','
                });
                that.fileStringBuffer = that.fileStringBuffer.slice(0,that.fileStringBuffer.length-1)

                that.formInline.fileUrls = that.fileStringBuffer
                //  当前是问题的新增
                if (that.formInline.type == 2) {
                    add(that.formInline)
                        .then((res) => {
                            if (res.code === '000000') {
                                that.$message({ type: 'success', message: '问题新增成功' });
                                that.handleClose();
                                let qs = that.$parent.$parent.$parent.$parent.$refs.content.$refs.question
                                qs.queryData({
                                    knowledgeTypeId: that.formInline.knowledgeTypeId  || '-1',
                                    type: 2
                                });
                                this.$refs['form'].resetFields();
                            }
                        })
                        .catch((err) => {
                            that.$message({ type: 'error', message: err });
                        });
                } else {
                    add(that.formInline)
                        .then((res) => {
                            if (res.code === '000000') {
                                that.$message({ type: 'success', message: '信息新增成功' });
                                that.handleClose();
                                let infos = that.$parent.$parent.$parent.$parent.$refs.content.$refs.info
                                infos.queryData({
                                    knowledgeTypeId: that.formInline.knowledgeTypeId || '-1',
                                    type: 1
                                });
                                this.$refs['form'].resetFields();
                                
                            }
                        })
                        .catch((err) => {
                            that.$message({ type: 'error', message: err });
                        });
                }
            } else {
                // console.log(that.fileList, '===///////===')
                    //  拼接文件名

                that.fileList.forEach(item => {
                    //  如果是已存在的
                    if(item.url) {
                        that.fileStringBuffer += item.url+',' 
                    }
                    else {
                        that.fileStringBuffer += item.response.data[0].url+','
                        
                    }
                    // || item.response.data[0].url+','
                });
                that.fileStringBuffer = that.fileStringBuffer.slice(0,that.fileStringBuffer.length-1)

                that.formInline.fileUrls = that.fileStringBuffer
                //  `~~~~~~~~~~~~~~~~~~~~修改~~~~~~~~~~~~~~~~~~~
                //  当前是问题的修改
                that.formInline.id = that.formInline.id
                if(that.formInline.type == '问题') that.formInline.type = 2
                if(that.formInline.type == '信息') that.formInline.type = 1

                if (that.formInline.type == 2) {
                    modifyKnowDetail(that.formInline)
                        .then((res) => {
                            if (res.code === '000000') {
                                that.$message({ type: 'success', message: '问题修改成功' });
                                that.handleClose();
                                let qs = that.$parent.$parent.$parent.$parent.$parent.$refs.content.$refs.question
                                qs.queryData({
                                    knowledgeTypeId: that.$parent.$parent.$parent.$parent.$parent.$refs.tree.parentId || '-1',
                                    type: 2
                                });
                                this.$refs['form'].resetFields();
                            }
                        })
                        .catch((err) => {
                            that.$message({ type: 'error', message: err });
                        });
                } else {
                    //  反之
                    modifyKnowDetail(that.formInline)
                        .then((res) => {
                            if (res.code === '000000') {
                                that.$message({ type: 'success', message: '信息修改成功' });
                                that.handleClose();
                                let infos = that.$parent.$parent.$parent.$parent.$parent.$refs.content.$refs.info
                                // console.log(that.$parent.$parent.$parent.$parent.$parent.$refs.tree.parentId);
                                infos.queryData({
                                    knowledgeTypeId: that.$parent.$parent.$parent.$parent.$parent.$refs.tree.parentId  || '-1',
                                    type: 1
                                });
                                this.$refs['form'].resetFields();
                            }
                        })
                        .catch((err) => {
                            that.$message({ type: 'error', message: err });
                        });
                }
            }
            }, 2000);
            
        },
        handleImageSuccess(res, file, fileList) {
        },
        handleRemove(file, fileList) {
            let _this = this
            for(var i = 0; i < _this.fileList.length; i++){
                if(file.uid == _this.fileList[i].uid){
                    _this.fileList.splice(i,1)
                }
            }
        },
    }
};
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
    display: inline-block;
}
/deep/ .el-upload {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    outline: none;
    height: 35px;
    width: 57px;
}
/deep/ .el-upload--text {
    background-color: #fff;
    /* border: 1px dashed #d9d9d9; */
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    // width: 360px;
    // height: 180px;
    // text-align: center;
    // cursor: pointer;
    position: relative;
    overflow: hidden;
}
</style>