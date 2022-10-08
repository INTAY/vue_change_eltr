<template>
  <div class="query_condition">
    <el-form :inline="true" :model="form">
      <el-form-item size="mini" label="类型">
        <el-select  v-model="form.siteType" placeholder="请选择类型" @change="onChange" clearable>
          <el-option v-for="item in stations" :key="item.value" :value="item.value" :label="item.name"/>
        </el-select>
      </el-form-item>

      <el-form-item size="mini" label="站名" v-if="siteFlag">
        <el-cascader
          v-model="form.siteId"
          :options="stationTree"
          :props="props"
          size="mini"
          clearable
          @change="sitehandleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item size="mini" label="区域" v-if="regFlag">
        <el-cascader
          v-model="form.regId"
          :options="areas"
          :props="props"
          size="mini"
          clearable
          @change="regionhandleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item size="mini" label="日期">
        <div class="block">
          <el-date-picker
            size="mini"
            v-model="form.startDate"
            type="date"
            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd "
            placeholder="选择开始日期"/>
          -
          <el-date-picker
            size="mini"
            v-model="form.endDate"
            type="date"
            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd "
            placeholder="选择结束日期"
          />
        </div>
      </el-form-item>

      <el-form-item>
        <el-button class="bouncedHold" size="mini" @click="chaxun">查询</el-button>
        <el-button size="mini" @click="res" class="cancelBTN" >清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.query_condition{
  margin-left: -30px !important;
}
  .t {
    border-bottom: 1px solid #eeeeee;
    background: #fcfcfc;
  }

  .btk {
    width: 150px !important;
  }

  .xzk {
    width: 190px !important;
  }

  .xxzk {
    width: 190px;
  }

  .xan {
    color: white !important;
    background: #006080 !important;
    width: 60px;
    height: 30px;
    margin-top: 2.5px;
  }

  .zxan {
    color: #006080 !important;
    height: 30px;
    /*margin-left: 1090px;*/
    margin-top: -50px;
  }

  .demo-form-inline {
    padding: 10px;
    height: 100px;
  }

  /deep/ .el-input__inner {
    height: 30px !important;
  }
</style>
<script>
  import {DICTDATA, getDict} from "../../../../api/dict";
  import {getOrgStationTree} from "../../../../api/system/environment";
  import {getAreas} from "../../../../api/operation/pushButton";

  export default {
    props: {
      queryParam: this.form
    },
    data() {
      return {
        form: {
          siteType: 1,
        },
        siteFlag: true,
        regFlag: false,
        node: {
          name: "",
          value: "",
        },
        props: {
          label: 'name',
          children: "children",
          checkStrictly: true,
          value: "id"
        },
        stations: [],
        stationTree: [],
        areas: [],
      };
    },
    created() {
      //获取类型
      getDict(DICTDATA.STATION_TYPE).then(res => {
        this.stations = res;
      })
      const id = JSON.parse(sessionStorage.getItem("orgId"));
      getOrgStationTree(id).then(res => {
        this.stationTree = this.getTreeData([res.data]);
      });
    },
    methods: {
      onChange(value) {
        if (value === 1) {
          this.regFlag = false;
          this.siteFlag = true;
        }
        if (value === 2) {
          this.regFlag = true;
          this.siteFlag = false;
          this.queryRegTree(-1)
        }
      },
      // 多级联动选择器选中事件
      regionhandleChange(value) {
        this.form.regId = value[value.length - 1];
      },
      sitehandleChange(value) {
        this.form.siteId = value[value.length - 1];
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
          if (data[i].children === null) {
            // children若为空数组，则将children设为undefined
            data[i].children = undefined;
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(data[i].children);
          }
        }
        return data;
      },
      res() {
        this.form = {};
      },
      chaxun() {
        this.$parent.queryParam = this.form;
        this.$parent.getDataInit();
      }
    }
  };
</script>
