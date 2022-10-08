<template>
  <div class="t">
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <div class="yi">
        <el-form-item size="mini" label="图片类别" class="a">
          <el-select  v-model="form.fileType" placeholder="全部" class="tpk" clearable>
            <el-option v-for="item in picTypes"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="图片名称" class="a">
          <el-input v-model="form.name" placeholder="请输入图片名称" class="tpk"  clearable/>
        </el-form-item>

        <el-button @click="queryData" class="newButtonColor btnSpace SearchBTN">查询</el-button>
        <el-button @click="cleanUp" class="SearchBTN cancelBTN">清空</el-button>
      </div>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
  .t {
    border-bottom: 1px solid #eeeeee !important;
    background: #fcfcfc !important;
  }

  .tpk {
    width: 180px;
  }


  .a {
    padding-left: 10px;
  }

  .demo-form-inline {
    margin-bottom: -2px;
    padding:15px 17px 0;
    height: 60px;
  }

  /deep/ .el-input__inner {
    height: 30px !important;
  }

</style>
<script>
  import {getDict, DICTDATA} from "../../../../api/dict";

  export default {
    data() {
      return {
        value1: "",
        value2: "",
        form: {},
        picTypes: []
      };
    },
    created() {
      this.getPicTypes();
    },
    methods: {
      cleanUp() {
        this.form = {}
      },
      queryData() {
        this.$parent.$refs.biaoge.queryData(this.form);
      },
      getPicTypes() {
        getDict(DICTDATA.PICTURE_TYPE).then(res => {
          for (let i = 0; i < res.length; i++) {
            this.picTypes.push(res[i]);
          }
        })
      },
      onSubmit() {
      }
    }
  };
</script>
