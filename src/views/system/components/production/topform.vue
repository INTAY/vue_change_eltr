<template>
  <div class="search-wrap">
    <el-form :inline="true" :model="form">
      <el-form-item size="mini" label="厂家名称">
        <el-input v-model="form.factName" placeholder="请输入厂家名称" class="cjmc" />
      </el-form-item>

      <el-form-item size="mini" label="分类">
        <el-select
          v-model="form.kind"
          class="cjmc"
          placeholder="请选择"
          @change="getDevTypeDict"
          clearable
        >
          <el-option
            v-for="item in kindDict"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item size="mini" label="类型">
        <el-select v-model="form.factType" class="cjmc" placeholder="请选择" clearable>
          <el-option
            v-for="item in kindDictValue"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item size="mini" label="联系人">
        <el-input v-model="form.atten" placeholder="请输入联系人" class="cjmc" clearable />
      </el-form-item>

      <el-form-item size="mini" label="联系电话">
        <el-input v-model="form.tel" placeholder="请输入联系电话" class="cjmc" maxlength="11" clearable />
      </el-form-item>

      <el-form-item>
        <el-button @click="queryBtnClick" class="newButtonColor btnSpace SearchBTN">查询</el-button>
        <el-button @click="clearForm" class="SearchBTN cancelBTN">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.search-wrap {
  padding: 18px 20px 0;
  margin-bottom: -12px;
  background: #fcfcfc;
}

.xan {
  color: white;
  background: #006080;
  height: 30px;
}

.zxan {
  color: #006080;
  height: 30px;
}

.a {
  padding-left: 10px;
}

.cjmc {
  width: 180px;
}

.lx {
  width: 160px;
}

.lxr {
  width: 160px;
}

.lxdh {
  width: 160px;
}

.ss {
  width: 100px;
}

/deep/ .el-input__inner {
  height: 30px !important;
}
</style>
<script>
import { getDict, DICTDATA } from "../../../../api/dict";
import { findByParentId } from "../../../../api/system/dict";

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
      },
      kindDict: [],
      kindDictValue: [],
      params: {
        value: "",
      },
    };
  },
  created() {
    // 获取分类下拉框
    getDict(DICTDATA.DEV_KIND).then((res) => {
      this.kindDict = res;
    });
  },
  methods: {
    // 下拉框选中事件
    getDevTypeDict() {
      this.params.value = this.form.kind;
      findByParentId(this.params).then((res) => {
        this.kindDictValue = res.data;
      });
    },
    clearForm() {
      this.form = {};
    },
    queryBtnClick() {
      this.$parent.$refs.biaoge.cx(this.form);
    },
  },
};
</script>
