//选择框栏
<template>
  <div class="t">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">

      <el-form-item label="旧件类型">
        <el-select size="mini" v-model="formInline.spareType" placeholder="请选择旧件类型" class="selectWidth" @change="getSecondSour(formInline.typeId)">
          <el-option v-for="item in dictCode" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="旧件厂家" class="interval">
        <el-select size="mini" v-model="formInline.factId" placeholder="请选择旧件厂家" class="selectWidth"  @change="getThirdSour(formInline.factoryId)">
          <el-option v-for="item in factoryMap" :key="item.id" :label="item.factName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="旧件型号" class="interval">
        <el-select size="mini" v-model="formInline.modelId" placeholder="请选择旧件型号" class="selectWidth">
          <el-option v-for="item in equipmentMap" :key="item.id" :label="item.modelName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" class="interval">
        <el-select size="mini" v-model="formInline.state" placeholder="请选择状态" class="selectWidth">
          <el-option v-for="item in searchTypeOption" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="旧件入库日期" class="interval">
        <el-date-picker
          size="mini"
          v-model="formInline.datatime"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="timeWidth"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button size="mini" class="newButtonColor SearchBTN" @click="onSubmit()">查询</el-button>
        <el-button size="mini" class="otherBTN SearchBTN" @click="empty()">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import {
        searchEquipment,
        searchFactory,
        queryPage
    } from '../../../../api/operation/oldPartsLibrary'
    import {
        getDict,
        DICTDATA
    } from "../../../../api/dict";

    export default {
        data() {
            return {
                formInline: {},
                statusMap: [], // 状态
                equipmentMap: [], //  设备型号
                factoryMap: [], //  厂家
                searchTypeOption: [], //  旧件状态
                dictCode: []
            };
        },
        mounted() {
            this.getDictCode()
        },
        methods: {
            onSubmit() {
                if (this.formInline.datatime && this.formInline.datatime.length > 0) {
                    this.formInline.endTime = this.formInline.datatime[1]
                    this.formInline.startTime = this.formInline.datatime[0]
                }
                delete this.formInline.datatime
                this.$parent.$refs.formTable.queryPage(this.formInline);
            },
            empty() {
                this.formInline = {};
            },
            getDictCode() {
                getDict(DICTDATA.SPARE_SYSTEM).then(res => {
                    this.dictCode = res;
                });
                //  字典获取旧件状态
                getDict(DICTDATA.OLD_PARTS_LIBRARY).then(res => {
                    this.searchTypeOption = res;
                });
            },
            //  获取设备型号
            getSecondSour(args) {
                searchFactory({
                    "kind": DICTDATA.SPARE_SYSTEM,
                    factType: args
                }).then(res => {
                    if (res.code == '000000') {
                        this.factoryMap = res.data
                    }
                }).catch(err => {})
            },
            //  获取厂家
            getThirdSour(args) {
                searchEquipment({
                    "kind": DICTDATA.SPARE_SYSTEM,
                    factType: args
                }).then(res => {
                    if (res.code == '000000') {
                        this.equipmentMap = res.data
                    }
                }).catch(err => {})
            },
            queryPage() {
                queryPage().then(res => {

                })
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
        .selectWidth {
            //selct选择框长度
            width: 150px;
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
        .emptyColor {
            color: #006080;
        }
        .interval {
            //表单之间的间隔
            padding-left: 30px;
        }
    }
</style>
