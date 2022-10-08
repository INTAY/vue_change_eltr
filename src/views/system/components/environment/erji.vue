<template>
  <div>
    <div>
      <el-button class="aniu" size="small" @click="ruleForm = {}, add = true">新增</el-button>
      <el-button class="aniu" size="small" @click="remove">批量删除</el-button>
    </div>

    <div>
      <el-dialog
        title="新增"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :visible.sync="add"
        width="800px"
      >
        <el-form
          ref="ruleForm"
          :rules="rules"
          :model="ruleForm"
          label-width="100px"
          size="small"
          class="qw"
        >
          <el-form-item label="日期" prop="recDate">
            <el-col :span="11" class="kz">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.recDate"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                class="kz"
              />
            </el-col>
          </el-form-item>

          <el-form-item label="类型" prop="siteType">
            <el-select v-model="ruleForm.siteType" placeholder="请选择类型" class="kz" @change="onChange">
              <el-option v-for="item in stations" :key="item.value" :value="item.value"
                         :label="item.name"/>

            </el-select>
          </el-form-item>

          <el-form-item label="站点名称" v-if="siteFlag">
            <el-autocomplete
              ref="autoComplete"
              v-model="ruleForm.siteName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="handleSelect"
              class="kz"
              clearable/>
          </el-form-item>
          <el-form-item label="区域" v-if="regFlag">
            <el-cascader
              v-model="ruleForm.regId"
              :options="areas"
              :props="props"
              size="mini"
              class="kz"
              clearable
              @change="regionhandleChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="天气">
            <el-select v-model="ruleForm.weather" class="kz">
              <el-option v-for="item in weathers" :key="item.value" :label="item.name" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="最高温度/℃" prop="maxTemp">
            <el-input v-model="ruleForm.maxTemp" class="kz" oninput="value=value.replace(/[^\d]/g,'')"/>
          </el-form-item>
          <el-form-item label="最低温度/℃" prop="minTemp">
            <el-input v-model="ruleForm.minTemp" class="kz" oninput="value=value.replace(/[^\d]/g,'')"/>
          </el-form-item>
          <el-form-item label="湿度/%" prop="humidity">
            <el-input v-model="ruleForm.humidity" class="kz" oninput="value=value.replace(/[^\d]/g,'')"/>
          </el-form-item>
          <el-form-item label="PM2.5" prop="pm">
            <el-input v-model="ruleForm.pm25" class="kz" oninput="value=value.replace(/[^\d]/g,'')"/>
          </el-form-item>

          <el-form-item label="空气质量" prop="airQua">
            <el-select v-model="ruleForm.airQua" placeholder="请选择空气质量" class="kz">
              <el-option v-for="item in airQualitys" :key="item.value" :label="item.name" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="nn">
          <el-button size="small" @click="addbg('ruleForm')" class="bouncedHold  editorBTN btnSpace">确定</el-button>
          <el-button size="small" @click="qux('ruleForm')" class="cancelBTN  editorBTN">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {
    add,
    piliangDelete,
    dc,
    xiuGai, getOrgStationTree
  } from "../../../../api/system/environment";
  import {DICTDATA, getDict} from "../../../../api/dict";
  import {getAreas} from "../../../../api/operation/pushButton";
  import {getStationList} from "../../../../api/property/charge";
  import {packageDataToMap, packageOrgToMap, regName} from "../../../../utils/area"; //添加,批量删除接口,批量导入,批量导出
  export default {
    data() {
      let checkmax = (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (value < this.ruleForm.minTemp) {
          callback(new Error("最高温度不可小于最低温度"));
        } else {
          callback();
        }
      };
      let checkmin = (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (value > this.ruleForm.maxTemp) {
          callback(new Error("最低温度不可高于最高温度"));
        } else {
          callback();
        }
      };
      let checkD = (rule, value, callback) => {
        if (!value) {
          return callback();
        }
        setTimeout(() => {
          if (value > 99) {
            callback(new Error("该值不可大于99"));
          } else {
            callback();
          }
        });
      };
      return {
        add: false,
        ruleForm: {
          recDate: "",
          siteType: "",
          siteId: "",
          weather: "",
          maxTemp: "",
          minTemp: "",
          humidity: "",
          pm: "",
          airQua: "",
          siteName: ""
        },
        rules: {
          siteType: [{required: true, message: "站点类型不可为空", trigger: "blur"}],
          siteName: [{required: true, message: "站点不可为空", trigger: "blur"}],
          recDate: [{required: true, message: "日期不能为空", trigger: "blur"}],
          maxTemp: [{validator: checkmax, trigger: "blur"}],
          minTemp: [{validator: checkmin, trigger: "blur"}],
          humidity: [{validator: checkD, trigger: "blur"}],
          pm: [{validator: checkD, trigger: "blur"}],
          airQua: [{required: true, message: "空气质量不可为空", trigger: "blur"}],
        },
        siteFlag: true,
        regFlag: false,
        stations: [],
        props: {
          label: 'name',
          children: "children",
          checkStrictly: true,
          value: "id"
        },
        areas: [],
        weathers: [],
        airQualitys: [],
        params: {},
      };
    },
    created() {
      //获取类型
      getDict(DICTDATA.STATION_TYPE).then(res => {
        this.stations = res;
      })
      // 天气
      getDict(DICTDATA.WEATHER).then(res => {
        this.weathers = res;
      })
      // 空气质量
      getDict(DICTDATA.AIR_QUALITY).then(res => {
        this.airQualitys = res;
      })
      this.queryRegTree(-1)
    },
    methods: {
      querySearchAsync(queryString, cb) {
        if (queryString !== "") {
          this.params.staName = queryString;
          getStationList(this.params).then(res => {
            for (let i of res.data) {
              i.value = i.staName; //将想要展示的数据作为value
            }
            let restaurants = res.data;
            cb(restaurants);
          });
        }
      },
      handleSelect(item) {
        this.ruleForm.siteId = item.id;
      },
      onChange(value) {
        if (value === 1) {
          this.regFlag = false;
          this.siteFlag = true;
        }
        if (value === 2) {
          this.regFlag = true;
          this.siteFlag = false;
        }
      },
      // 多级联动选择器选中事件
      regionhandleChange(value) {
        this.ruleForm.regId = value[value.length - 1];
      },
      sitehandleChange(value) {
        this.ruleForm.siteId = value[value.length - 1];
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
      addbg(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.add = false;
            let obj = {
              id: this.ruleForm.id,
              recDate: this.ruleForm.recDate,
              pm25: this.ruleForm.pm25,
              regId: this.ruleForm.regId,
              weather: this.ruleForm.weather,
              maxTemp: this.ruleForm.maxTemp,
              minTemp: this.ruleForm.minTemp,
              humidity: this.ruleForm.humidity,
              airQua: this.ruleForm.airQua,
              siteId: this.ruleForm.siteId,
              siteType: this.ruleForm.siteType
            };

            if (this.ruleForm.id && this.ruleForm.id !== "") {
              xiuGai(obj)
                .then(res => {
                  if (res.data && res.code === "000000") {
                    this.$message({
                      message: "修改成功",
                      type: "success"
                    });
                    this.$parent.getDataInit();
                    this.ruleForm = {};
                  }
                })
                .catch(err => {
                  this.$message.error("修改失败");
                  this.$parent.getDataInit();
                });
            } else {
              add(obj)
                .then(res => {
                  if (res.data && res.code === "000000") {
                    this.$message({
                      message: "添加成功",
                      type: "success"
                    });
                    this.$parent.getDataInit();
                    this.ruleForm = {};
                  }
                })
                .catch(err => {
                  this.$message.error("添加失败");
                  this.$parent.getDataInit();
                });
            }
          } else {
            return false;
          }
        });
      },
      qux(formName) {
        this.$refs[formName].resetFields();
        this.add = false;
      },
      remove() {
        let arr = [];
        if (this.$parent.getMultipleSelection().length === 0) {
          this.$message({
            message: "请至少选择一条数据!",
            type: "warning",
          });
          return false;
        }
        this.$parent.getMultipleSelection().forEach(item => {
          arr.push(item.id);
        });
        this.$confirm("确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: ""
        }).then(() => {
          piliangDelete(arr)
            .then(res => {
              if (res.data && res.code === "000000") {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.$parent.getDataInit();
              }
            })
            .catch(err => {
              this.$message.error("删除失败");
            });
        });
      },
    }
  };
</script>
<style lang="scss" scoped>
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

  .spa {
    margin-top: 8px;
    margin-left: 5px;
  }

  .dw1 {
    padding-right: 4px;
  }

  .ntd {
    color: white !important;
    background: #006080 !important;
    width: 200px;
    margin-right: 50px;
  }

  .ntx {
    color: #006080 !important;
    width: 200px;
  }

  .qw {
    width: 1000px;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    padding-left: 33px;
  }

  .kz {
    width: 200px;
    margin-right: 120px;
  }

  // 按钮
  .aniu {
    color: white !important;
    background: #006080 !important;
    width: 120px;
  }
</style>
