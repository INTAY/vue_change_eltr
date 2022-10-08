// 查询条件
<template>
  <div>
    <el-form :inline="true" :model="formInline">

      <el-form-item label="类型">
        <el-select
          size="mini"
          v-model="formInline.spareType"
          placeholder="全部"
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

      <el-form-item label="状态">
        <el-select
          size="mini"
          v-model="formInline.state"
          placeholder="全部"
        >
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in searchStateOption"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="库房">
        <el-select
          size="mini"
          v-model="formInline.houseId"
          placeholder="全部"
        >
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in searchHouseOption"
            :key="item.id"
            :label="item.houseName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="易耗品">
        <el-select
          size="mini"
          v-model="formInline.consumable"
          placeholder="全部"
        >
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in searchConsumableOption"
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
import { getDict, DICTDATA } from "@/api/dict";
import { queryList } from "@/api/operation/storeRoomManage";
import {
  findByDicId,
  searchFactByType,
  searchModel
} from "@/api/operation/operationSpareStore";
export default {
  data() {
    return {
      formInline: {},
      searchTypeOption: [],
      searchFactOption: [],
      searchModelOption: [],
      searchStateOption: [],
      searchHouseOption: [],
      searchConsumableOption: [],
      pickerDate: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  created() {
    // 查询类型下拉框数据
    getDict(DICTDATA.SPARE_SYSTEM).then(res => {
      this.searchTypeOption = res;
    });

    // 状态字典
    getDict(DICTDATA.SPARE_STATE).then(res => {
      this.searchStateOption = res;
    });

    // 查询库房
    queryList().then(res => {
      this.searchHouseOption = res.data;
    });

    // 是否字典
    getDict(DICTDATA.WHETHER).then(res => {
      this.searchConsumableOption = res;
    });
  },
  methods: {
    /**
     * 根据类型查厂家
     */
    searchFactByType() {
      this.searchFactOption = [];
      this.searchModelOption = [];
      this.formInline.factId = "";
      this.formInline.modelId = "";

      if (this.formInline.spareType !== "") {
        searchFactByType({
          factType: this.formInline.spareType,
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
          devMainType: this.formInline.spareType, // 类型
          factId: this.formInline.factId // 厂家
        }).then(res => {
          this.searchModelOption = res.data;
        });
      }
    },
    changeModel() {
      this.$forceUpdate();
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
      this.searchFactOption = [];
      this.searchModelOption = [];
      this.formInline = {};
    }
  }
};
</script>