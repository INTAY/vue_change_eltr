<template>
    <el-upload
        class="aniuEx"
        ref="upload"
        :on-success="handleImageSuccess"
        :multiple="false"
        accept=".xlsx"
        :action="importUrl"
        :headers="headers"
        :show-file-list="false"
    >
        <el-button size="small" class="listBTN BatchDeleteColor aniuEx">导入excel</el-button>
    </el-upload>
</template>

<script>
import Vue from 'vue';

const tonken = Vue.cookie.get('token');
export default {
    props: {
        importUrl: {
            type: String,
            default: ''
        }
    },
    name: 'excelUpload',
    data() {
        return {
            headers: { Authorization: 'Bearer ' + tonken }
        };
    },
    methods: {
        // 导入成功的回调
        handleImageSuccess(res, file, fileList) {
            if ('000000' === res.code) {
                this.$message.success(res.mesg);
            } else {
                this.$message.error(res.mesg);
            }
        }
    }
};
</script>

<style lang='scss' scoped>
.aniuEx {
    float: right;
    color: #d42f2f;
    border-color: #d42f2f;
    /deep/ .el-upload {
        //消除本身的样式，利用穿透
        margin-left: 15px;
        width: 130px;
        height: 34px;
        border: none;
        border-radius: 0;
    }
}
</style>
