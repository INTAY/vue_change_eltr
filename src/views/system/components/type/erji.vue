<template>
  <div>
    <div class="s">
      <el-button @click="addOpen" class="newButtonColor btnSpace listBTN">新增型号</el-button>
      <el-button @click="remove" class="BatchDeleteColor listBTN">批量删除</el-button>
    </div>
    <div>
      <el-dialog title="新增设备型号" :modal-append-to-body='false' :close-on-click-modal="false" :visible.sync="add"
                 top="20vh" style="left: 70px"
                 width="880px" class="yw">
        <el-form
          ref="sizeForm"
          :model="sizeForm"
          label-width="80px"
          size="small"
          :rules="rules"
          class="qw"
        >
          <el-form-item label="设备分类" prop="devClass">
            <el-select v-model="sizeForm.devClass" @change="getTypeDict" class="kz">
              <el-option
                v-for="item in kindDict"
                :key="item.value"
                :label="item.name"
                :value="item.value"/>
            </el-select>
          </el-form-item>

          <el-form-item label="设备类型" prop="devMainType">
            <el-select v-model="sizeForm.devMainType" @change="getFactList" class="kz">
              <el-option
                v-for="item in kindDictValue"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="生产厂家" prop="factId">
            <el-select v-model="sizeForm.factId" class="kz" @change="onFactoryChange">
              <el-option
                v-for="item in factoryValues"
                :key="item.id"
                :label="item.factName"
                :value="item.id"/>
            </el-select>
          </el-form-item>

          <el-form-item label="型号名称" prop="modelName">
            <el-input v-model="sizeForm.modelName" placeholder="请输入型号名称" class="kz" clearable/>
          </el-form-item>

          <el-form-item label="图片上传方式" label-width="100px" style="margin-left: -2%">
            <el-select size="mini" class="kz" @change="chooseImage" clearable v-model="checkValue">
              <el-option v-for="item in picUploadType"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item class="imageViewClass">
            <el-image class="kz" :src="imageUrl"
                      style="width: 220px; height: 188px;  border-radius:5px 5px 5px;"
                      placeholder="暂无图片">
            </el-image>
          </el-form-item>
          <el-form-item label="是否易耗品" label-width="90px" style="margin-left: -1%" prop="consumable">
            <el-select v-model="sizeForm.consumable" clearable class="kz">
              <el-option v-for="item in whethers" :key="item.value" :label="item.name" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-form>

        <div class="nn">
          <el-button size="mini" @click="addbg('sizeForm')" class="bouncedHold  editorBTN btnSpace">确定</el-button>
          <el-button size="mini" @click="qux('sizeForm')" class="cancelBTN  editorBTN">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="图片本地上传" :modal-append-to-body='false' :close-on-click-modal="false" top="30vh" :modal="true"
                 :visible.sync="uploadWin"
                 width="880px"
                 class="dialogClass">
        <el-form>
          <el-form-item label="图片上传" class="">
            <el-upload class="upload-demo"
                       :data="fileData"
                       ref="upload"
                       :action="uploadUrl"
                       :before-upload="beforeUpload"
                       list-type="picture-card"
                       :show-file-list="true"
                       :multiple="false"
                       :file-list="fileList"
                       :on-success="handleImageSuccess"
                       :headers="headers"
                       :auto-upload="true"
                       :limit="1"
                       accept=".png,.jpg,.gif,.svg"
                       :on-progress="uploadVideoProcess">
              <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过2MB</div>
              <i class="el-icon-plus"/>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="图片选取列表" :modal-append-to-body='false' :close-on-click-modal="false" top="30vh"
                 style="left: 140px"
                 :visible.sync="imageListWin"
                 width="880px">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <div>
            <el-form-item label="图片分类" class="a">
              <el-select size="mini" v-model="form.fileType" placeholder="全部" class="tpk" height="29px">
                <el-option v-for="item in picTypes"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片名称" class="a">
              <el-input v-model="form.name" size="mini" placeholder="请输入图片名称"/>
            </el-form-item>

            <el-button size="small" class="bouncedHold" style="width: 100px" @click="queryFormData">查询</el-button>
            <el-button size="small" class="cancelBTN" style="width: 100px" @click="clearForm">清空</el-button>
          </div>
          <div class="tup">
            <div class="block" style="position: relative;" v-for="item in picFiles" :key="item.id">
              <div class="demo-image__preview">
                <el-checkbox-group v-model="checkModel">
                  <el-checkbox-button :key="item.id" :label="item">
                    <el-image
                      style="width: 95px; height: 80px;  border-radius:5px 5px 5px; "
                      :src="item.url"
                      :aria-checked="true">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"/>
                      </div>
                    </el-image>
                  </el-checkbox-button>
                </el-checkbox-group>
              </div>
            </div>
            <div class="pageStyle" style="z-index=999">
              <div class="fenye">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 15, 20]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                  class="tablePagination"
                />
                <div class="sx">
                  <el-button size="mini" style="width: 50px;height: 25px;margin-top: 6%" @click="freshen">刷新</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="nn">
            <el-button size="small" style="width: 100px" @click="confirmCheckValue" class="bouncedHold  editorBTN btnSpace">确定</el-button>
            <el-button size="small" style="width: 100px" @click="cancleWin" class="cancelBTN  editorBTN">取消</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {add, getFactorys, piliangDelete} from "../../../../api/system/type";
  import {getDict, DICTDATA} from "../../../../api/dict";
  import request from '@/api/request'
  import Vue from 'vue'
  import {queryData} from "../../../../api/system/picture"; //查询列表和删除选项
  import imgUrl from "../../../../assets/image/from图片.png"
  import {batchDeleteInfo} from "../../../../api/property/lineManage";

  const tonken = Vue.cookie.get('token');
  export default {
    data() {
      return {
        rules: {
          modelName: [{required: true, message: '请输入型号名称', trigger: 'blur'}],
          devClass: [{required: true, message: '请选择设备分类', trigger: 'blur'}],
          devMainType: [{required: true, message: '请选择设备类型', trigger: 'blur'}],
          factId: [{required: true, message: '请选择厂家信息', trigger: 'blur'}],
          picUrl: [{required: true, message: '请选择图片上传方式', trigger: 'blur'}],
          consumable: [{required: true, message: '请选择是否易耗品', trigger: 'blur'}]
        },
        checkValue: "",
        checkModel: [],
        currentPage: 1,
        pageSize: 20,
        total: 40,
        fileData: {
          fileType: 1,
          filename: "",
          type: 1,
        },
        uploadUrl: "",
        imageUrl: "",
        updateLoading: "",
        headers: {Authorization: "Bearer " + tonken},
        kindDict: [],
        kindDictValue: [],
        factoryValues: [],
        fileList: [],
        picFiles: [],
        picTypes: [],
        add: false,
        imageListWin: false,
        uploadWin: false,
        sizeForm: {
          factId: "",
          picUrl: "",
          modelName: "",
          devClass: "",
          devMainType: "",
          consumable: "",
        },
        formF: {
          factType: "",
        },
        form: {},
        formData: {},
        picUploadType: [
          {
            value: 1,
            name: "图片本地上传"
          },
          {
            value: 2,
            name: "图片库选择"
          }
        ],
        whethers: [],
      };
    },
    mounted() {
      this.queryData();
    },
    created() {
      this.uploadUrl = request.uploadUrl()
      // 查询分类下拉框数据
      getDict(DICTDATA.DEV_KIND).then(res => {
        this.kindDict = res;
      });
      this.getPicTypes();
    },
    methods: {
      addOpen() {
        this.sizeForm = {};
        // 查询分类下拉框数据
        getDict(DICTDATA.DEV_KIND).then(res => {
          this.kindDict = res;
        });
        this.add = true;
        if (this.checkValue !== "") {
          this.checkValue = "";
        }
        if (this.imageUrl === "") {
          this.imageUrl = imgUrl;
        }
        // 是否
        getDict(DICTDATA.WHETHER).then(res => {
          this.whethers = res;
        })
      },
      queryData(data) {
        queryData(data)
          .then(res => {
            this.picFiles = res.data.records;
            this.pageSize = res.data.size;
            this.currentPage = res.data.current;
            this.total = res.data.total;
          })
          .catch(err => {
            this.$message.error('查询失败');
          });
      },
      // 下拉框点击事件,不同的选择跳不同的页面
      chooseImage() {
        this.fileList = [];
        if (this.checkModel.length != 0) {
          this.checkModel = [];
        }
        if (this.checkValue == 1) {
          this.uploadWin = true;
        } else {
          this.uploadWin = false;
        }
        if (this.checkValue == 2) {
          this.imageListWin = true;

        } else {
          this.imageListWin = false;
        }
      },
      // 查询按钮调取方法
      queryFormData() {
        this.queryData(this.form)
      },
      // 获取图片类型
      getPicTypes() {
        getDict(DICTDATA.PICTURE_TYPE).then(res => {
          for (let i = 0; i < res.length; i++) {
            this.picTypes.push(res[i]);
          }
        })
      },
      // 分页点击事件
      handleSizeChange(val) {
        this.pageSize = val
        this.form.size = this.pageSize
        this.form.current = 1
        this.queryData(this.form); //点击选择每页显示多少数据就会发送size，让页面显示多少条，并且默认第一个页面
      },
      handleCurrentChange(val) {
        this.form.size = this.pageSize
        this.form.current = val
        this.queryData(this.form);//点击第几页就会发送要显示的页数过去
      },
      freshen() {
        this.queryData();
      },
      confirmCheckValue() {
        if (this.checkModel.length > 1) {
          this.$message.error("每次只能选择一条图片数据!");
          return false;
        }
        this.imageUrl = this.checkModel[0].url;
        this.sizeForm.picUrl = this.checkModel[0].url
        this.checkModel = [];
        this.imageListWin = false;
      },
      // 清空查询
      clearForm() {
        this.form = {};
        this.queryData();
      },

      uploadVideoProcess(event, file, fileList) {
        //弹出上传加载
        this.updateLoading = true;
      },
      // 图片上传之前
      beforeUpload(file) {
        let picStyle = /^image\/(jpeg|png|jpg)$/.test(file.type)
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!picStyle) {
          this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          return false
        }
        this.fileData.filename = file.name;
        if (this.fileData.filename.length > 50) {
          this.$message.error('文件名称太长,请做修改!')
          return false;
        }
        return picStyle && isLt2M;
      },
      // 上传成功操作
      handleImageSuccess(res, file, fileList) {
        if ("000000" == res.code) {
          this.sizeForm.picUrl = res.data[0].picUrl
          this.imageUrl = res.data[0].url;
          this.$emit('on-success', res.data[0].url)
        } else {
          this.$message.error(res.mesg)
        }
        this.uploadWin = false;
      },
      /**
       * 根据分类、类型，获取厂家下拉框数据
       */
      getFactList() {
        if (this.sizeForm.devMainType != "") {
          this.formF.factType = this.sizeForm.devMainType;
          this.formF.kind = this.sizeForm.devClass;
          getFactorys(this.formF).then(res => {
            this.factoryValues = res.data;
          })
        } else {
          this.sizeForm.devMainType = "";
          this.sizeForm.devClass = "";
          this.factoryValues.length = 0;
          this.sizeForm.factId = "";
        }
      },
      onFactoryChange() {

      },

      /**
       * 根据设备分类获取设备类型下拉框数据
       */
      getTypeDict() {
        if (this.sizeForm.devClass != "") {
          getDict(this.sizeForm.devClass).then(res => {
            this.kindDictValue = res;
          });
        } else {
          this.kindDictValue.length = 0;
          this.sizeForm.devMainType = "";
          this.factoryValues.length = 0;
          this.sizeForm.factId = "";
        }
      },
      // 新增功能代码
      addbg(formName) {
        if (this.checkValue == "") {
          this.$message.error("请选择图片上传方式!");
          return false;
        }
        //上传提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
            add(this.sizeForm)
              .then(res => {
                this.$message({
                  message: res.mesg,
                  type: "success"
                });
                this.$parent.$refs.biaoge.cx();
                this.sizeForm = {};
                this.factoryValues.length = 0;
                this.kindDictValue.length = 0;
                this.fileList.length = 0;
                this.add = false;
                this.checkValue = "";
                this.imageUrl = "";
              })
              .catch(res => {
                this.$message.error(res.mesg);
                this.$parent.$refs.biaoge.cx();
                this.add = false;
                this.factoryValues.length = 0;
                this.kindDictValue.length = 0;
                this.kindDict.length = 0
                this.fileList.length = 0;
                this.checkValue = "";
                this.imageUrl = "";
              });
          } else {
            return false;
          }
        });
      },
      // 取消功能代码
      qux(formName) {
        this.$refs[formName].resetFields();
        this.sizeForm = {};
        this.add = false;
        this.factoryValues.length = 0;
        this.kindDictValue.length = 0;
        this.kindDict.length = 0
        this.fileList.length = 0;
        this.checkValue = "";
        this.imageUrl = "";
      },
      remove() {
        let arr = [];
        if (this.$parent.$refs.biaoge.SelectionArray.length === 0) {
          this.$message({
            message: "请至少选择一条数据!",
            type: "warning",
          });
          return false;
        }
        this.$parent.$refs.biaoge.SelectionArray.forEach(item => {
          arr.push(item.id);
        });
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          piliangDelete(arr)
            .then(res => {
              this.$message({
                message: res.mesg,
                type: "success"
              })
              this.$parent.$refs.biaoge.cx();
            })
            .catch(res => {
              this.$message({
                message: res.mesg,
                type: "error"
              })
            })

        })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          })
      }
      ,
      changeSelect(e) {
        this.$forceUpdate();
      },
      cancleWin() {
        this.imageListWin = false;
        this.checkModel = [];
      }
    }
  }
  ;
</script>

<style lang="scss" scoped>


  .a {
    padding-left: 10px;
  }

  .tpk {
    width: 200px;
  }

  .xan {
    color: white !important;
    background: #006080 !important;
    height: 30px;
    margin-top: 5px;
  }

  .zxan {
    color: #006080 !important;
    height: 30px;
    margin-top: 5px;
  }

  .div {
    width: 100%;
    height: 100%;
  }

  //分页器
  .pageStyle {
    width: 100%;
    background-color: #f7f7f7;
    bottom: 10px;
    margin-bottom: 2%;
  }

  .fenye {
    margin-left: 10%;
    display: flex;

  }

  .nr {
    padding: 15px 20px 20px 20px;
  }

  .dialogClass {
    height: 1000px;
    left: 125px;
  }

  .imageViewClass {
    margin-top: 5%;
    margin-left: -38%;
  }

  .selectClass {
    margin-left: -2%;
  }

  .block {
    width: 188px;
    display: flex;
    flex-wrap: wrap;
  }

  .demo-image__preview {
    padding: 5px;
    border: 1px solid transparent;
    border-radius: 5px 5px 5px;
    margin-left: 3%;
  }

  .tup {
    display: flex;
    flex-wrap: wrap;
  }

  .upload-demo {
    margin-left: -27%;
  }

  .el-upload__tip {
    color: red;
    margin-left: 27%;
  }

  // 按钮
  .aniu {
    color: white !important;
    background: #006080 !important;
    width: 120px;
  }

  .aniu2 {
    color: white !important;
    background: #006080 !important;
    width: 120px;
  }

  .anniu {
    color: #006080 !important;
    width: 120px;
  }

  .s {
    border-top:1px solid #eee;
    padding: 10px 20px 0;
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
    padding-left: 50px!important;
  }

  .nn {
   display: flex;
   justify-content: center;
  }
  .ntd {
    color: white !important;
    background: #006080 !important;
    width: 150px;
  }

  .ntx {
    width: 150px;
  }

  .bg {
    margin-top: 20px;
  }

  .sc {
    width: 120px;
  }

  .kz {
    width: 220px;
    margin-right: 70px;
  }

  .tp {
    width: 670px;
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

  // 表格
  /deep/ #app {
    font-family: "Microsoft YaHei";
  }

  /deep/ .el-table td {
    text-align: center;
  }

  /deep/ .el-table th {
    text-align: center;
  }

  /deep/ .el-table thead {
    color: black !important;
  }

  /deep/ .has-gutter {
    background: #f0f0f0 !important;
  }

  /deep/ .el-table th {
    background-color: transparent;
  }

  /deep/ .el-table tr {
    background-color: transparent;
  }
</style>
