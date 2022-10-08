<template>
  <div>
    <div class="s">
      <el-button @click="addWin = true" class="newButtonColor btnSpace listBTN">新增图片</el-button>
      <el-button @click="modifyOpen" class="newColor btnSpace listBTN">修改图片</el-button>
      <el-button @click="deletePicBatch" class="BatchDeleteColor listBTN">批量删除</el-button>
    </div>
    <!-- 二级 -->
    <div>
      <el-dialog title="新增图片" :modal-append-to-body='false' :visible.sync="addWin" width="800px" class="yw">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules" size="small" class="qw">
          <el-form-item label="图片名称" prop="name">
            <el-input v-model="form.name" class="kz"/>
          </el-form-item>

          <el-form-item label="类型" prop="fileType">
            <el-select v-model="form.fileType" placeholder="请选择类型" class="kz" @change="changeSelect($event)">
              <el-option v-for="item in picTypes"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="图片上传">
            <div class="tpsc">
              <el-upload id="upFile" class="upload-demo"
                         :data="fileData"
                         ref="upload"
                         :action="uploadUrl"
                         :before-upload="beforeUpload"
                         list-type="picture-card"
                         :show-file-list="true"
                         :multiple="false"
                         :on-success="handleImageSuccess"
                         :headers="headers"
                         :auto-upload="false"
                         :limit="1"
                         accept=".png,.jpg,.gif,.svg"
                         :on-progress="uploadVideoProcess">
                <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过2MB</div>
                <i class="el-icon-plus"/>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
        <div class="nn">
          <el-button size="mini" @click="confirmSave('form')" class="bouncedHold  editorBTN btnSpace">确定</el-button>
          <el-button size="mini" @click="cancleForm" class="cancelBTN  editorBTN">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="修改图片" :modal-append-to-body='false' :visible.sync="modifyWin" width="800px" class="yw">
        <el-form ref="modifyForm" :model="modifyForm" label-width="80px" size="small" class="qw">
          <el-form-item label="图片名称" :rules="[{ required: true, message: '图片名称不能为空'},]">
            <el-input v-model="modifyForm.filename" class="kz" @input="changeInput($event)"/>
          </el-form-item>

          <el-form-item label="类型">
            <el-select v-model="modifyForm.fileType" placeholder="请选择类型" class="kz" @change="changeSelect($event)">
              <el-option v-for="item in picTypes"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="照片上传">
            <div class="tpsc">
              <el-upload class="upload-demo"
                         :data="fileData"
                         ref="uploadModify"
                         :action="modifyUrl"
                         :before-upload="beforeUpload"
                         list-type="picture-card"
                         :show-file-list="true"
                         :on-success="handleImageSuccess"
                         :headers="headers"
                         :auto-upload="false"
                         :on-progress="uploadVideoProcess"
                         :file-list="fileList"
                         :limit="1"
                         :on-remove="removeFile"
                         accept=".png,.jpg,.gif,.svg">
                <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过2MB</div>
                <i class="el-icon-plus"/>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
        <div class="nn">
          <el-button size="small" @click="confirmModify('modifyForm')" class="bouncedHold  editorBTN btnSpace">确定</el-button>
          <el-button size="small" @click="cancleForm" class="cancelBTN  editorBTN">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {modifyPic, deleBatch} from "../../../../api/system/picture"; //查询列表和删除选项
  import {DICTDATA, getDict} from "../../../../api/dict";
  import Vue from 'vue'
  import {
    uploadUrl,
    modifyUrl,
    getPicUrl,
    beforeUpload,
    handleImageSuccess
  } from "../../../../components/upload/picUpload";
  import {piliangDelete} from "../../../../api/system/production";

  const tonken = Vue.cookie.get('token');
  export default {
    data() {
      return {
        uploadUrl: "",
        modifyUrl: "",
        form: {
          name: "",
          fileType: "",
          url: "",
          fileId: "",
          type: ""
        },
        rules: {
          name: [{required: true, message: "名称不能为空", trigger: "blur"}],
          fileType: [{required: true, message: "类型不能为空", trigger: "blur"}],
        },
        modifyForm: {
          filename: "",
          fileType: "",
          fileid: "",
          type: 1,
          url: ""
        },
        fileData: {
          fileType: "",
          filename: "",
          type: 1,
          fileid: ""
        },
        fileList: [],
        fileListAdd: [],
        fileidArray: [],
        picTypes: [],
        headers: {Authorization: "Bearer " + tonken},
        saveData: false,
        modifyWin: false,
        deleteWin: false,
        addWin: false,
        updateLoading: false,
      };
    },
    created() {
      getPicUrl();
      this.uploadUrl = uploadUrl
      this.modifyUrl = modifyUrl;
      this.getPicTypes();
    },

    mounted() {
      window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    },
    methods: {
      beforeunloadHandler() {
        this.$parent.$refs.biaoge.checkData.length = 0;
      },
      changeInput(e) {
        this.$forceUpdate();
      },
      changeSelect(e) {
        this.$forceUpdate();
      },
      getPicTypes() {
        getDict(DICTDATA.PICTURE_TYPE).then(res => {
          for (let i = 0; i < res.length; i++) {
            this.picTypes.push(res[i]);
          }
        })
      },
      uploadVideoProcess(event, file, fileList) {
        //弹出上传加载
        this.updateLoading = true;
      },

      // 上传成功操作
      handleImageSuccess(res, file, fileList) {
        handleImageSuccess(res, file, fileList)
        this.$parent.$refs.biaoge.queryData();
      },

      // 图片格式、大小校验
      beforeUpload(file) {
        beforeUpload(file);
      },
      // 图片上传
      confirmSave(formName) {
        this.fileData.fileType = this.form.fileType;
        this.fileData.filename = this.form.name;
        this.$refs[formName].validate((valid => {
          if (valid) {
            this.$refs.upload.submit();
            this.$parent.$refs.biaoge.queryData();
            this.form = {};
            this.addWin = false;
          }
        }))

      },
      // 修改按钮弹出框
      modifyOpen() {
        if (this.$parent.$refs.biaoge.checkData.length === 0) {
          this.$message.error("请选择一张图片数据进行修改")
          return false;
        }
        if (this.$parent.$refs.biaoge.checkData.length > 1) {
          this.$message.error("修改只能选择一张图片数据")
          return false;
        }
        this.modifyWin = true;
        this.modifyForm.filename = this.$parent.$refs.biaoge.checkData[0].name;
        this.modifyForm.fileid = this.$parent.$refs.biaoge.checkData[0].fileid;
        this.modifyForm.fileType = this.$parent.$refs.biaoge.checkData[0].fileType;
        this.modifyForm.url = this.$parent.$refs.biaoge.checkData[0].url;
        this.fileList.push(this.modifyForm);
        if (this.fileList.length > 1) {
          this.fileList.length = 1
        }
      },
      // 移除文件
      removeFile() {
        this.fileList.length = 0
      },
      // 修改确定按钮
      confirmModify(formName) {
        if (this.modifyForm.filename.length === 0) {
          this.$message.error('图片名称必填!');
          return false;
        }
        if (this.modifyForm.fileType.length === 0) {
          this.$message.error('图片类型必选!');
          return false;
        }
        this.fileData.filename = this.modifyForm.filename;
        this.fileData.fileid = this.modifyForm.fileid;
        this.fileData.fileType = this.modifyForm.fileType;
        // 格式化数据
        let formObject = new FormData();
        formObject.append("fileType", this.modifyForm.fileType);
        if (this.modifyForm.fileType === 1) {
          this.modifyForm.type = 1;
          formObject.append("type", this.modifyForm.type);
        }
        if (this.modifyForm.fileType === 2) {
          this.modifyForm.type = 2;
          formObject.append("type", this.modifyForm.type);
        }
        formObject.append("filename", this.modifyForm.filename);
        formObject.append("fileid", this.modifyForm.fileid);
        formObject.append("url", this.modifyForm.url)
        if (this.fileList.length === 0) {
          this.$refs.uploadModify.submit();
          this.$parent.$refs.biaoge.queryData();
          this.modifyForm = {};
          this.fileList.length = 0;
          this.$message({
            message: "修改成功",
            type: "success"
          })
          this.modifyWin = false;
        } else {
          this.$refs[formName].validate(valid => {
            if (valid) {
              modifyPic(formObject).then(res => {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$parent.$refs.biaoge.queryData();
                this.modifyForm = {};
                this.fileList.length = 0;
                this.modifyWin = false;
              })
                .catch(err => {
                  this.$message.error("修改失败");
                  this.$parent.$refs.biaoge.queryData();
                  this.modifyForm = {};
                  this.fileList.length = 0;
                });
            }
          })
        }
        // 清空数组
        this.$parent.$refs.biaoge.checkData.length = 0
      },
      // 取消按钮
      cancleForm() {
        this.addWin = false;
        this.modifyForm = {};
        this.fileList = [];
        this.form = {};
        this.modifyWin = false;
        this.deleteWin = false;
        this.fileidArray.length = 0;
        this.$parent.$refs.biaoge.checkData = [];
      },
      deletePicBatch() {
        if (this.$parent.$refs.biaoge.checkData.length === 0) {
          this.$message({
            message: "请至少选择一条数据!",
            type: "warning",
          })
          return false;
        }
        // 获取选中的图的数据
        let arr = [];
        if (this.$parent.$refs.biaoge.checkData.length > 0) {
          for (let i = 0; i < this.$parent.$refs.biaoge.checkData.length; i++)
            arr.push(this.$parent.$refs.biaoge.checkData[i].fileid);
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          deleBatch(arr)
            .then(res => {
              this.$message({
                message: res.mesg,
                type: "success"
              })
              this.fileidArray.length = 0;
              this.$parent.$refs.biaoge.checkData.length = 0;
              this.$parent.$refs.biaoge.queryData();
            })
            .catch(res => {
              this.$message({
                message: res.mesg,
                type: "error"
              })
              this.$message.error("删除失败");
              this.fileidArray.length = 0;
              this.$parent.$refs.biaoge.checkData.length = 0;
              this.$parent.$refs.biaoge.queryData();
            })
        })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          })
      },
    }
  };
</script>

<style lang="scss" scoped>

  .el-upload__tip {
    color: red;
  }

  // 按钮
  .aniu {
    color: white !important;
    background: #006080 !important;
    width: 120px;
  }

  .anniu {
    color: #006080 !important;
    width: 120px;
  }

  .s {
   padding: 15px 25px 0;
  }

  .el-button {
    color: #006080;
  }

  // 二级
  .qw {
    width: 1000px;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    padding-left: 25px;
  }

.nn {
    display: flex;
    justify-content: center;
}
  .bz {
    width: 175px;
  }

  .dw {
    margin-right: 125px;
    display: flex;
  }

  .dw span {
    margin-top: 8px;
    margin-left: 5px;
  }

  .dw1 {
    padding-right: 4px;
  }

  .ntd {
    color: white !important;
    background: #006080;
    width: 200px;
    margin-right: 50px;
  }

  .ntx {
    color: #006080;
    width: 200px;
  }

  .kz {
    width: 200px;
    margin-right: 120px;
  }

  .dq {
    width: 90px;
  }

  .ww {
    margin-right: 42px;
  }

  .tup {
    width: 105px;
    height: 102px;
  }

  .ya {
    width: 674px;
    height: 70px;
    background: #006080;
    margin-left: 32px;
  }

  .xzcs2 {
    width: 600px;
  }

  // 图片
  .tp {
    width: 800px;
  }

  .ws {
    width: 70px;
    height: 70px;
  }

  .tpsc {
    display: flex;
  }

  .ani {
    margin-top: 40px;
    margin-right: 10px;
    font-size: 12px;
  }

  .tpscwz {
    margin-top: 40px;
    color: red;
    font-size: 12px;
  }
</style>
