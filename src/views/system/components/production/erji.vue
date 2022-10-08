<template>
  <div>
    <div class="s">
      <el-button @click="openAddwin" class="newButtonColor btnSpace listBTN">新增厂家</el-button>
      <el-button @click="remove" class="BatchDeleteColor listBTN">批量删除</el-button>
    </div>

    <div>
      <el-dialog title="新增厂家" :visible.sync="add" width="800px" class="yw" :modal-append-to-body='false'
                 :close-on-click-modal="false" top="25vh"
                 style="left: 140px">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="80px"
          size="small"
          class="qw"
        >
          <el-form-item label="厂家名称" prop="factName">
            <el-input v-model="form.factName" class="kz" placeholder="请输入厂家名称" clearable/>
          </el-form-item>

          <el-form-item label="设备分类" prop="kind">
            <el-select size="mini" @change="getDevTypeDict" v-model="form.kind" class="cjmc" clearable>
              <el-option
                v-for="item in kindDict"
                :key="item.value"
                :label="item.name"
                :value="item.value"/>
            </el-select>
          </el-form-item>

          <el-form-item label="设备类型" prop="factType">
            <el-select v-model="form.factType" placeholder="请选择类型" class="kz" clearable>
              <el-option
                v-for="item in typeDict"
                :key="item.value"
                :label="item.name"
                :value="item.value"/>
            </el-select>
          </el-form-item>

          <el-form-item label="所属区域" class="ww" prop="regId">
            <el-cascader
              v-model="form.regId"
              :options="areas"
              :props="props"
              size="mini"
              clearable
              @change="handleChange">
            </el-cascader>
          </el-form-item>

          <el-form-item label="详细地址" prop="addr">
            <el-input v-model="form.addr" class="kz" placeholder="请输入详细地址">
              <el-button slot="append" style="width: 20%" @click="openMapsWin" icon="el-icon-map-location"/>
            </el-input>
          </el-form-item>

          <el-form-item label="联系人" prop="atten">
            <el-input v-model="form.atten" class="kz" placeholder="请输入联系人" clearable/>
          </el-form-item>

          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="form.tel" class="kz" maxlength="11" placeholder="请输入联系电话" clearable/>
          </el-form-item>
          <el-form-item label="图片选择">
            <el-select size="mini" class="kz" clearable @change="chooseImage" v-model="checkValue">
              <el-option v-for="item in picUploadType"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-image class="kz" :src="imageUrl"
                      style="margin-left: 115%;width: 220px; height: 188px;  border-radius:5px 5px 5px;"
                      placeholder="暂无图片">
            </el-image>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.remark" class="xzcs2" clearable/>
          </el-form-item>
        </el-form>
        <div class="nn">
          <el-button size="mini" @click="addbg('form')" class="bouncedHold btnSpace editorBTN">确定</el-button>
          <el-button size="mini" @click="qux('form')" class="cancelBTN  editorBTN">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="图片本地上传" :modal-append-to-body='false' :close-on-click-modal="false" top="30vh" :modal="true"
                 :visible.sync="uploadWin"
                 width="880px"
                 class="dialogClass">
        <singleimageupload/>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="图片列表" :modal-append-to-body='false' :close-on-click-modal="false" top="20vh" :modal="true"
                 :visible.sync="imagesWin"
                 width="880px"
                 class="dialogClass">
        <picTable ref="picTable"/>
      </el-dialog>
    </div>
    <div>
    </div>
    <div>
      <mapseldialog @map-confirm="handleMapConfirm" ref="mapseldialog"/>
    </div>
  </div>
</template>
<script>
  import {getDict, DICTDATA} from "../../../../api/dict";
  import {add, piliangDelete} from "../../../../api/system/production"; //添加,批量删除接口
  import {findByParentId} from "../../../../api/system/dict";
  import {getAreas} from "../../../../api/operation/pushButton";
  import singleimageupload from '../../../../components/upload/singleimageupload'
  import {fileid, picUrl} from "../../../../components/upload/picUpload";
  import picTable from "../../../../components/pagetable/picTable";
  import imgUrl from "../../../../assets/image/from图片.png"
  import mapseldialog from '../../../../components/mapseldialog'

  export default {
    data() {
      return {
        form: {
          factName: "",
          factType: "",
          kind: "",
          regId: "",
          addr: "",
          atten: "",
          tel: "",
          remark: "",
          picIds: "",
          longitude: "",
          latitude: ""
        },
        rules: {
          kind: [{required: true, message: "分类不能为空", trigger: "blur"}],
          factType: [{required: true, message: "类型不能为空", trigger: "blur"}],
          factName: [{required: true, message: "厂家名称不能为空", trigger: "blur"}],
          regId: [{required: true, message: "所属区域不可为空", trigger: "blur"}],
          addr: [{required: true, message: "详细地址不可为空", trigger: "blur"}],
          atten: [{required: true, message: "联系人不可为空", trigger: "blur"}],
          tel: [{required: true, message: "联系电话不可为空", trigger: "blur"}],
          picId: [{required: true, message: "请选取图片", trigger: "blur"}],
        },
        kindDict: [],
        typeDict: [],
        areas: [],
        props: {
          children: "children",
          label: "name",
          value: "id",
        },
        add: false,
        params: {
          value: "",
        },
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
        checkValue: "",
        checkModel: [],
        imageUrl: imgUrl,
        uploadWin: false,
        imagesWin: false,
        mapsWin: false,
        address: ""
      };
    },
    components: {singleimageupload, picTable, mapseldialog},
    created() {
      // 获取分类下拉框
      getDict(DICTDATA.DEV_KIND).then(res => {
        this.kindDict = res;
      });
      // 获取区域
      this.queryRegTree(-1)
    },
    methods: {

      openAddwin() {
        this.add = true;
        this.imageUrl = imgUrl;
        this.form = {
          factName: "",
          factType: "",
          kind: "",
          regId: "",
          addr: "",
          atten: "",
          tel: "",
          remark: "",
          picIds: "",
        };
        this.checkValue = "";
      },
      // 多级联动选择器选中事件
      handleChange(value) {
        this.form.regId = value[value.length - 1];
      },
      /**
       * 根据设备分类，查询设备类型下拉框
       */
      getDevTypeDict() {
        this.params.value = this.form.kind
        findByParentId(this.params).then(res => {
          this.typeDict = res.data;
        });
      },
      //地区数据查询，翻译使用
      queryRegTree(id) {
        return new Promise((resolve, reject) => {
          getAreas(id).then(res => {
            this.areas = this.getTreeData(res.data.children);
            resolve();
          });
        });
      },
      // 递归算法
      getTreeData(data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].children.length < 1) {
            // children若为空数组，则将children设为undefined
            data[i].children = undefined;
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(data[i].children);
          }
        }
        return data;
      },
      // 输入框点击事件
      openMapsWin() {
        this.$refs.mapseldialog.open({lng: this.form.longitude, lat: this.form.latitude});
      },
      handleMapConfirm(addres) {
        this.form.addr = addres.province + addres.city + addres.district + addres.addr
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
          this.imagesWin = true;
        } else {
          this.imagesWin = false;
        }
      },
      addbg(formName) {
        if (fileid) {
          this.form.picIds = fileid;
        }
        if (this.$refs.picTable !== undefined) {
          this.form.picIds = this.$refs.picTable.picId;
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.add = false;
            add(this.form)
              .then(res => {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$parent.$refs.biaoge.cx();
                this.form = {};
              })
              .catch(err => {
                this.$message.error("添加失败");
                this.$parent.$refs.biaoge.cx();
              });
          } else {
            return false;
          }
        });
      },
      qux(formName) {
        this.$refs[formName].resetFields();
        this.form = {};
        this.add = false;
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
    }
  };
</script>
<style lang="scss" scoped>

  //按钮
  .aniu {
    color: white !important;
    background: #006080 !important;
    width: 120px;
  }

  .xan {
    color: white !important;
    background: #006080 !important;
    margin-top: 5px;
  }

  .s {
    padding: 10px 20px 0;
    border-top: 1px solid #eee;
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

