//选择框栏
<template>
  <div class="search-wrap">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="标识">
        <el-input size="mini" v-model="formInline.id" placeholder class="inputWidth"></el-input>
      </el-form-item>

      <el-form-item label="名称">
        <el-input size="mini" v-model="formInline.name" placeholder class="inputWidth"></el-input>
      </el-form-item>

      <el-form-item label="类型">
        <el-select
          size="mini"
          v-model="formInline.mainType"
          placeholder="全部"
          class="selectWidth"
          @change="searchFactByType"
        >
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in searchTypeOption"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="厂家">
        <el-select
          size="mini"
          v-model="formInline.factId"
          placeholder="全部"
          class="selectWidth"
          @change="searchModel"
        >
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in searchFactOption"
            :key="item.id"
            :label="item.factName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="型号">
        <el-select
          size="mini"
          v-model="formInline.modelId"
          placeholder="全部"
          class="selectWidth"
          @change="modelChange"
        >
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in searchModelOption"
            :key="item.id"
            :label="item.modelName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态">
        <el-select size="mini" v-model="formInline.status" placeholder="全部" class="selectWidth">
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in searchStatusOption"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button size="mini" class="newButtonColor SearchBTN" @click="search">查询</el-button>
        <el-button size="mini" class="otherBTN SearchBTN" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDict, DICTDATA } from "../../../../api/dict";
import {
  findByDicId,
  searchFactByType,
  searchModel
} from "../../../../api/operation/mtTool";

export default {
  data() {
    return {
      formInline: {},
      searchTypeOption: [],
      searchModelOption: [],
      searchFactOption: [],
      searchStatusOption: []
    };
  },
  created() {
    // 查询类型下拉框数据
    this.getSearchTypeOption();

    // 查询状态下拉框数据
    this.getSearchStatusOption();
  },
  methods: {
    modelChange() {
      this.$forceUpdate();
    },
    /**
     * 查询类型下拉框
     */
    getSearchTypeOption() {
      findByDicId(DICTDATA.MTTOOL_TYPE).then(res => {
        this.searchTypeOption = res.data;
      });
    },
    /**
     * 查询状态下拉框
     */
    getSearchStatusOption() {
      findByDicId(DICTDATA.MTTOOL_STATUS).then(res => {
        this.searchStatusOption = res.data;
      });
    },
    /**
     * 根据类型查厂家
     */
    searchFactByType() {
      this.searchFactOption = [];
      this.searchModelOption = [];
      this.formInline.factId = "";
      this.formInline.modelId = "";

      if (this.formInline.mainType !== "") {
        searchFactByType({
          factType: this.formInline.mainType,
          kind: DICTDATA.MTTOOL_TYPE // 类型
        }).then(res => {
          this.searchFactOption = res.data;
        });
      }
    },
    /**
     * 根据类型、厂家，查型号
     */
    searchModel() {
      this.searchModelOption = [];
      this.formInline.modelId = "";

      if (this.formInline.factId !== "") {
        searchModel({
          devClass: DICTDATA.MTTOOL_TYPE, // 类别
          devMainType: this.formInline.mainType, // 类型
          factId: this.formInline.factId // 厂家
        }).then(res => {
          this.searchModelOption = res.data;
        });
      }
    },
    /**
     * 查询
     */
    search() {
      var self = this;

      self.formInline.current = 1;
      self.$parent.$refs.table.search(self.formInline);
    },
    /**
     * 清空查询条件
     */
    clear() {
      this.formInline = {};
      this.searchFactOption = [];
      this.searchModelOption = [];
      this.formInline.factId = "";
      this.formInline.modelId = "";
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
.search-wrap {
  padding-top: 16px;
  padding-left: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eeeeee;
  background: #fcfcfc;

  .inputWidth {
    //input框的长度
    width: 135px;
  }
  .selectWidth {
    //selct选择框长度
    width: 100px;
  }

  .timeWidth {
    //时间选择框
    width: 220px;
  }

  .searchColor {
    //查询按钮的背景颜色和字体颜色
    background-color: #006080;
    color: #fff;
  }

  .interval {
    //表单之间的间隔
    padding-left: 40px;
  }

  .el-form-item {
    margin-bottom: 2px;
  }

  .el-button {
    border: 1px solid #006080;
  }

  .el-button:hover {
    color: #006080;
  }

  .el-button--mini,
  .el-button--small {
    border-radius: 2px;
  }

  .el-button--primary {
    background-color: #006080;
    border-color: #006080;
  }

  .el-button--primary:hover {
    color: #fff;
  }
}
</style>