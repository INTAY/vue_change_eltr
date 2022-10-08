<template>
  <div class="t">
    <el-form :inline="true" :model="form" class="demo-form-inline" style="width: 1330px">
      <el-form-item size="mini" label="设备分类" class='a'>
        <el-select v-model="form.devClass"  class="sblx" @change="onChange" clearable>
          <el-option v-for="item in kindDict" :key="item.value" :label="item.name" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item size="mini" label="设备类型" class='a'>
        <el-select v-model="form.devMainType"  class="sblx" @change="onChange1" clearable>
          <el-option v-for="item in kindDictValue" :key="item.value" :label="item.name" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item size="mini" label="生产厂家" class='a'>
        <el-select  v-model="form.factId" class="sblx" @change="onChange2" clearable>
          <el-option v-for="item in factoryValues" :key="item.id" :label="item.factName" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item size="mini" label="型号" class='a'>
        <el-input v-model="form.modelName" placeholder="请输入型号" class="sblx"/>
      </el-form-item>
      <el-button @click="chaxun" class="newButtonColor SearchBTN">查询</el-button>
      <el-button @click="res" class="SearchBTN cancelBTN">清空</el-button>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
  .t {
    padding-top: 10px;
    background: #FCFCFC !important;
    margin-bottom: -12px;
  }

  .xan {
    color: white !important;
    background: #006080 !important;
    height: 30px;
  }

  .zxan {
    color: #006080 !important;
    height: 30px;
  }

  .a {
    padding-left: 10px;
  }

  .sblx {
    width: 180px;

  }

  /deep/ .el-input__inner {
    height: 30px !important;
  }

  .demo-form-inline {
    padding: 10px;
  }
</style>
<script>
  import {DICTDATA, getDict} from "../../../../api/dict";
  import {queryFactorys} from "../../../../api/system/production";

  export default {
    data() {
      return {
        form: {
          devClass: "",
          devMainType: "",
          modelName: "",
          factId: "",
        },
        formF: {
          factType: "",
        },
        kindDict: [],
        kindDictValue: [],
        factoryValues: [],
      };
    },
    created() {
      // 获取分类下拉框
      getDict(DICTDATA.DEV_KIND)
        .then(res => {
          this.kindDict = res;
        });
    },
    methods: {
      // 设备分类下拉框选中事件
      onChange() {
        if (this.form.devClass != "") {
          getDict(this.form.devClass).then(res => {
            this.kindDictValue = res;
          });
        } else {
          this.kindDictValue.length = 0;
          this.form.devClass = "";
          this.form.facType = "";
        }
      },
      // 设备类型选中事件
      onChange1() {
        this.$forceUpdate();
        if (this.form.devMainType != "") {
          this.formF.kind = this.form.devClass;
          this.formF.factType= this.form.devMainType;
          queryFactorys(this.formF).then(res => {
            this.factoryValues = res.data;
          })
        } else {
          this.form.devClass = "";
          this.form.factId = "";
          this.factoryValues.length = 0;
        }
      },
      // 厂家下拉框的选中事件
      onChange2() {
        this.$forceUpdate();
        if (this.form.factId != "") {
        } else {
          this.form.devClass = "";
          this.form.devMainType = "";
          this.form.factId = "";
          this.kindDictValue.length = 0;
        }
      },
      // 清空
      res() {
        this.form = {}
        this.form.devMainType = "";
        this.form.devClass = "";
        this.form.factId = "";
        this.factoryValues.length = 0;
        this.kindDictValue.length = 0;
        this.form.modelName = "";
        this.$parent.$refs.biaoge.cx();
      },
      chaxun() {
        this.$parent.$refs.biaoge.cx(this.form)
      }
    }
  };
</script>
