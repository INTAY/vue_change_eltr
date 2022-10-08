<template>
  <div class="el_upload_wrap">
    <el-upload
      ref="upload"
      :data="dataObj"
      :multiple="false"
      :on-success="handleImageSuccess"
      :before-upload="beforeUpload"
      :action="uploadUrl"
      :headers="headers"
      :show-file-list="false"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove">
      <div slot="tip" class="el-upload__tip">(图片格式仅限jpg、png、gif，图片大小500KB以内)</div>
      <el-image v-if="imageUrl" :src="imageUrl" style="width:140px;height:140px"/>
      <i v-else class="el-icon-plus"/>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    getPicUrl,
    beforeUpload,
    handleImageSuccess,
    picUrl,
    uploadUrl,
    fileType,
    type,
    fileName,
  } from "./picUpload";

  const tonken = Vue.cookie.get('token');

  export default {
    name: 'SingleImageUpload',
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        uploadUrl: '',
        dataObj: {fileType: 1, filename: "", type: 1},
        dialogImageUrl: '',
        dialogVisible: false,
        imageUrl: null,
        headers: {Authorization: "Bearer " + tonken},
        fileId: "",
      }
    },
    created() {
      getPicUrl();
      this.uploadUrl = uploadUrl;
    },
    computed: {},
    methods: {
      handleImageSuccess(res, file, fileList) {
        handleImageSuccess(res, file, fileList);
        this.imageUrl = picUrl;
        this.$parent.$parent.imageUrl = picUrl;
        this.$parent.$parent.uploadWin = false;
      },
      beforeUpload(file) {
        beforeUpload(file);
        this.dataObj.fileType = fileType;
        this.dataObj.type = type;
        this.dataObj.filename = fileName;
      },
      handleRemove(file, fileList) {
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el_upload_wrap {
    position: relative;
    height: 140px;width: 100%;
  }

  .el-upload__tip {
    position: absolute;
    width: 300px;
    left: 170px;
    top: 110px;
    color: red;
  }
</style>
