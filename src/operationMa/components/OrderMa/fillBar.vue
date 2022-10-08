//选择框栏
<template>
  <div class="t">
    <el-form :inline="true" class="demo-form-inline" :model="formInline">
      <el-form-item label="站点名称">
        <el-input size="mini" placeholder="请输入站名称" class="inputWidth" v-model="formInline.staName"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="工单编号">
        <el-input size="mini" placeholder="请输入工单编号" class="inputWidth" v-model="formInline.id"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="工单类型">
        <el-select size="mini" class="inputWidth" v-model="formInline.sheetType" clearable>
          <el-option v-for="item in orderTypes"
                     :key="item.value"
                     :value="item.value"
                     :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工单状态">
        <el-select size="mini" class="inputWidth" v-model="formInline.state" clearable>
          <el-option v-for="item in orderStatus"
                     :key="item.value"
                     :value="item.value"
                     :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="工单级别">
        <el-select size="mini" class="inputWidth" v-model="formInline.sheetLevel" clearable>
          <el-option v-for="item in orderLevel"
                     :key="item.value"
                     :value="item.value"
                     :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工单来源">
        <el-select size="mini" class="inputWidth" v-model="formInline.sourceType" clearable>
          <el-option v-for="item in orderSource"
                     :key="item.value"
                     :value="item.value"
                     :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运维班组">
        <el-select size="mini" class="inputWidth" v-model="formInline.groupId" clearable>
          <el-option v-for="item in groupMap"
                     :key="item.id"
                     :value="item.id"
                     :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" class="newButtonColor SearchBTN" @click="onSubmit">查询</el-button>
        <el-button size="mini" class="otherBTN SearchBTN" @click="clearBtnClick">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import {
        getDict,
        DICTDATA
    } from "@/api/dict";
    import { conditionsQry } from "@/api/operation/orderManage";
    export default {
        data() {
            return {
                // 查询参数
                formInline: {},
                orderTypes: [],
                orderStatus: [],
                orderLevel: [],
                orderSource: [],
                groupMap: []
            };
        },
        mounted() {
            this.getDictMethods()
            this.conditionsQry()
        },
        methods: {
            getDictMethods() {
                // 获取工单类型
                getDict(DICTDATA.ORDER_TYPE).then(res => {
                    this.orderTypes = res;
                })
                // 获取工单状态
                getDict(DICTDATA.ORDER_STATUS).then(res => {
                    this.orderStatus = res;
                })
                // 获取工单等级
                getDict(DICTDATA.ORDER_LEVEL).then(res => {
                    this.orderLevel = res;
                })
                // 获取工单来源
                getDict(DICTDATA.ORDER_SOURCE).then(res => {
                    this.orderSource = res;
                })
            },
            //  获取运维班组
            conditionsQry() {
              conditionsQry({serviceType: 1}).then(res=>{
                if(res.code === '000000') {
                  this.groupMap = res.data
                }
              })
            },
            // 清空按钮
            clearBtnClick() {
                this.formInline = {};
            },
            // 分页查询工单
            onSubmit() {
                if (this.formInline.datatime && this.formInline.datatime.length > 0) {
                    this.formInline.createdTimeEnd = this.formInline.datatime[1]
                    this.formInline.createdTimeStart = this.formInline.datatime[0]
                }
                delete this.formInline.datatime
                this.$parent.$refs.formTable.queryPage(this.formInline);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .t {
        padding-top: 16px;
        padding-left: 20px;
        border-bottom: 1px solid #eeeeee;
        background: #fcfcfc;
        .inputWidth {
            //input框的长度
            width: 170px;
        }
        .selectWidth {
            //selct选择框长度
            width: 130px;
        }
        .timeWidth {
            //时间选择框
            width: 240px;
        }
        .searchColor {
            //查询按钮的背景颜色和字体颜色
            background-color: #006080;
            color: #fff;
        }
        .emptyColor {
            //清空按钮字体颜色
            color: #006080;
        }
        .interval {
            //表单之间的间隔
            padding-left: 40px;
        }
    }
</style>
