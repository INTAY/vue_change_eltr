<template>
  <div>
    <!-- 弹出层 查看预案 -->
    <el-dialog title="旧件详情" :modal-append-to-body="false" :visible.sync="dialogDetailVisible" class="dialog-box" width="900px">
      <div class="box">
            <el-form :inline="true" :model="formInline" class="demo-form-inline xqy">
              <el-row type="flex" justify="start" align="middle" class="rowbg2">
                <el-col :span="12">
                  <el-form-item label="旧件编号">{{formInline.id}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="旧件类型">{{typeFormat(formInline.spareType)}}</el-form-item>
                </el-col>
              </el-row>

              <el-row type="flex" justify="start" align="middle" class="rowbg">
                <el-col :span="12">
                  <el-form-item label="旧件厂家">{{formInline.factName}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="旧件型号">{{formInline.modelId}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg2">
                <el-col :span="12">
                  <el-form-item label="资产编号">{{formInline.assetNo }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="采购计划">{{formInline.planName}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg">
                <el-col :span="12">
                  <el-form-item label="单位">{{formInline.unit}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="保质期限">{{formInline.expireDate}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg2">
                <el-col :span="12">
                  <el-form-item label="状态">{{stateFormat(formInline.state)}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="旧件入库时间">{{formInline.spareImportTime}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg">
                <el-col :span="12">
                  <el-form-item label="入备品备件库时间">{{formInline.importTime}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="报废时间">{{formInline.scrapTime}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg2">
                <el-col :span="12">
                  <el-form-item label="报废人">{{formInline.scrapManName}}</el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="middle" class="rowbg">
                <el-col>
                  <el-form-item label="报废原因">{{formInline.scrapDesc}}</el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
    </el-dialog>
  </div>
</template>

<script>
    import {
        DICTDATA,
        translatorDict
    } from "@/api/dict";
    import {
        spareUsed
    } from '../../../../api/operation/oldPartsLibrary'
    import {
        dateFormat
    } from '../../../../utils/DateFormat'

    export default {
        data() {
            return {
                dialogDetailVisible: false,
                caseSelectTreeData: [],
                formInline: {},
            };
        },
        mounted() {},
        methods: {
            /**
             * 前端翻译字典-“状态”
             */
            stateFormat(state) {
                if (state !== "") {
                    return translatorDict(DICTDATA.OLD_PARTS_LIBRARY, state);
                } else {
                    return "";
                }
            },
            typeFormat(state) {
                if (state !== "") {
                    return translatorDict(DICTDATA.SPARE_SYSTEM, state);
                } else {
                    return "";
                }
            },
            getDetail(id) {
                spareUsed(id).then(res => {
                    this.formInline = res.data;
                    this.formInline.expireDate = dateFormat(res.data.expireDate)
                    this.formInline.spareImportTime = dateFormat(res.data.spareImportTime)
                    this.formInline.importTime = dateFormat(res.data.importTime)
                    this.formInline.scrapTime = dateFormat(res.data.scrapTime)
                });
            },
        }
    };
</script>

<style lang="scss" scoped>
    .form-item {
        margin-bottom: 10px;
        .form-item-content {
            background-color: #fcfcfc;
            border: 1px solid #eee;
            padding: 15px 15px 0;
        }
        .form-item-title {
            font-size: 16px;
            line-height: 30px;
            color: #434343;
            margin-bottom: 5px;
            .line {
                display: inline-block;
                vertical-align: middle;
                width: 4px;
                height: 14px;
                margin-right: 10px;
                background-color: #24b3ca;
                border-radius: 4px;
            }
        }
    }

    .box {
        .rowbg {
            padding: 10px;
            height: 40px;
        }
        .rowbg2 {
            @extend .rowbg;
            background-color: #f7f7f7;
        }
    }

    .el-form-item {
        margin-bottom: 0 !important;
    }

    .case-content {
        border: 1px solid #eaeaea;
        border-radius: 4px;
        height: 300px;
        overflow-y: auto;
    }
</style>
