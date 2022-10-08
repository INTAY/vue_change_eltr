<template>
  <div>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="入库来源">
        <el-select size="mini" v-model="formInline.sourceType" placeholder="全部">
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in sourceTypeData"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select
          size="mini"
          v-model="formInline.spareType"
          @change="searchFactByType"
          placeholder="全部"
          class="selectWidth"
          clearable
        >
          <el-option label="全部"></el-option>
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
          v-model="formInline.factoryId"
          placeholder="全部"
          @change="searchModel"
          class="selectWidth"
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
          @change="changeModel"
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

      <el-form-item label="入库日期">
        <el-date-picker
          v-model="formInline.searchDate"
          style="width: 220px"
          size="mini"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerDate"
          @change="timeQuantum"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button size="mini" class="newButtonColor SearchBTN" @click="search">查询</el-button>
        <el-button size="mini" class="otherBTN SearchBTN" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDict, DICTDATA } from "@/api/dict";
import {
  searchFactByType,
  searchModel
} from "@/api/operation/operationSpareStore";
export default {
  data() {
    return {
      formInline: {},
      sourceTypeData: [], // 入库类型 436
      pickerDate: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      searchTypeOption: [],
      searchFactOption: [],
      searchModelOption: []
    };
  },
  created() {
    // 入库来源
    getDict(DICTDATA.SPARE_IMPORT_TYPE).then(res => {
      this.sourceTypeData = res;
    });
    // 备品备件类型下拉框数据 20130
    getDict(DICTDATA.SPARE_SYSTEM).then(res => {
      this.searchTypeOption = res;
    });
  },
  methods: {
    /**
     * 根据类型查厂家
     */
    searchFactByType() {
      this.searchFactOption = [];
      this.searchModelOption = [];
      this.formInline.factoryId = "";
      this.formInline.modelId = "";

      if (this.formInline.type !== "") {
        searchFactByType({
          factType: this.formInline.type,
          kind: DICTDATA.SPARE_SYSTEM // 类型
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

      if (this.formInline.factoryId !== "") {
        searchModel({
          devClass: DICTDATA.SPARE_SYSTEM, // 类别
          devMainType: this.formInline.type, // 类型
          factId: this.formInline.factoryId // 厂家
        }).then(res => {
          this.searchModelOption = res.data;
        });
      }
    },
    changeModel(e) {
      this.$forceUpdate();
    },
    timeQuantum(e) {
      this.formInline.startTime = e[0];
      this.formInline.endTime = e[1];
    },
    /**
     * 查询
     */
    search() {
      this.$parent.queryParam = this.formInline;
      this.$parent.getDataInit();
    },
    /**
     * 清空查询条件
     */
    clear() {
      this.formInline = {};
    }
  }
};
</script>

<style lang="scss" scoped></style>
