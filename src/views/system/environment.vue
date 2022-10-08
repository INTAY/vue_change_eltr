<template>
  <div>
    <crud-form :field-list="fieldList" :showColumnSetting="false"   :exportFn="exportFn" :api="cx" :queryParam="formInline" ref="crudForm">
      <template slot="searchBar">
        <topform ref="topform" :queryParam="formInline"/>
      </template>

      <template slot="tableTopOptionLeft">
        <erji ref="erji"/>
      </template>
      <template slot="tableTopOptionRight">
        <el-button @click="daoru">批量导入</el-button>
        <input type="file" id="files" style="position:absolute;left:-10000px" @change="fileImport"/>
      </template>

      <template slot="tableOption" slot-scope="{ index, row }">
        <el-button @click="modify(row)" type="text" size="small">修改</el-button>
        <el-button @click="remove(row.id)" type="text" size="small">删除</el-button>
      </template>
    </crud-form>


  </div>
</template>

<script>
  import crudForm from "@/components/crudForm/index";
  import topform from "./components/environment/topform";
  import erji from "./components/environment/erji";
  import {cx, menuDelete} from "@/api/system/environment";
  import {DICTDATA, translatorDict} from "../../api/dict";


  export default {
    data() {
      let formatterAirQua = row => {
        return translatorDict(DICTDATA.AIR_QUALITY, Number(row.airQua));
      };
      let nameIsShow = row => {
        if (row.siteName !== null) {
          return row.siteName;
        } else {
          row.siteName = row.regName;
          return row.siteName;
        }
      }
      let formatWeather = row => {
        return translatorDict(DICTDATA.WEATHER, Number(row.weather));
      }
      return {
        formInline: {},
        cx,
        fieldList: [
          {name: "日期", value: "recDate"},
          {name: "天气", value: "weather", formatter: formatWeather},
          {name: "类型", value: "siteTypeName"},
          {name: "名称", value: "siteName", formatter: nameIsShow},
          {name: "最低温（℃）", value: "minTemp", width: "105"},
          {name: "最高温（℃）", value: "maxTemp", width: "105"},
          {name: "湿度（%）", value: "humidity"},
          {name: "PM2.5", value: "pm25"},
          {name: "空气质量", value: "airQua", formatter: formatterAirQua}
        ]
      };
    },
    components: {topform, erji, crudForm},

    methods: {
      // 导出
      exportFn() {

      },
      // 修改
      modify(row) {
        let erji = this.$refs.erji;
        erji.add = true;
        if (row.siteType === 1) {
          erji.siteFlag = true;
          erji.regFlag = false;
        }
        if (row.siteType === 2) {
          erji.regFlag = true;
          erji.siteFlag = false;
        }
        erji.ruleForm = row;
      },
      // 删除
      remove(id) {
        this.$confirm("确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: ""
        }).then(() => {
          menuDelete(id)
            .then(res => {
              if (res.data && res.code === "000000") {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.$refs.crudForm.getDataInit();
              } else {
                this.$message.error("删除失败");
              }
            })
            .catch(err => {
              this.$message.error("删除失败");
            });
        });
      },
      //批量导入
      daoru() {
        var selectedFile = document.getElementById("files");
        selectedFile.click();
      },
      fileImport() {
        //获取读取我文件的File对象
        var selectedFile = document.getElementById("files").files[0];
        var reader = new FileReader(); //这是核心,读取操作就是由它完成.
        reader.readAsText(selectedFile); //读取文件的内容,也可以读取文件的URL
        reader.onload = function () {
          //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
          var selectedFile = document.getElementById("files");
          let obj = {
            filePath: selectedFile.value,
            startIndex: "1"
          };
          dr(obj)
            .then(res => {
              this.$message({
                message: "导入成功",
                type: "success"
              });
            })
            .catch(err => {
              this.$message.error("导入失败");
            });
        };
      }
    }
  };
</script>

<style lang="scss" scoped>
  .div {
    width: 100%;
    height: 100%;
  }
  
</style>
