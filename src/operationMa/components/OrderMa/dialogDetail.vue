<template>
  <div>
    <!-- 工单详情弹框-->
    <el-dialog title="工单详情" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="orderDetailWin" width="80%" top="20vh">
        <el-form :inline="true" class="demo-form-inline" :model="exampleData">
            <div class="form-item" style="width: 100%">
                <div class="form-item-title"><span class="line" />基本信息</div>
                <div class="form-item-content">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="工单编号:">
                                <span v-text="exampleData.id" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="工单类型:">
                                <span>{{typeFormat(exampleData.sheetType)}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="工单状态:">
                                <span>{{stateFormat(exampleData.state)}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="工单级别:">
                                <span>{{levelFormat(exampleData.sheetLevel)}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="计划完成时间:" style="width: 120%">
                                <span>{{dateFormat(exampleData.planFinishTime)}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="工单来源:">
                                <span>{{sourceFormat(exampleData.sourceType)}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="关联工单:">
                                <span v-text="exampleData.parentId" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="联系人:">
                                <span v-text="exampleData.linkMan" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6">
                            <el-form-item label="联系电话:">
                                <span v-text="exampleData.tel" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="站点名称:" style="width: 120%">
                                <span v-text="exampleData.staName" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所属区域:" style="width: 120%">
                                <span v-text="exampleData.regId" />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="站点地址:">
                                <span v-text="exampleData.addr" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="派单人:">
                                <span v-text="exampleData.dispatchManName" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="派单时间:">
                                <span>{{dateFormat(exampleData.dispatchTime)}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="接单人:">
                                <span v-text="exampleData.receiveManName" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="接单班组:">
                                <span v-text="exampleData.groupName" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="接单时间:" style="width: 120%">
                                <span>{{dateFormat(exampleData.receiveTime)}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="办结时间:">
                                <span>{{dateFormat(exampleData.finishTime)}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="工单处理耗时:">
                                <span v-text="orderOperateTime" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="创建人:">
                                <span v-text="exampleData.createManName" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="创建时间:">
                                <span>{{dateFormat(exampleData.createTime)}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <br/>
                <div class="form-item-title"><span class="line" />设备</div>
                <div class="form-item-content">
                    <el-table :data="tableDevicesData" stripe :header-cell-style="{background:'#f1f1f1',color:'#000'}" highlight-current-row >
                        <el-table-column type="index" width="50" />
                        <el-table-column label="设备编号" prop="id" align="center" />
                        <el-table-column label="设备名称" prop="devName" align="center" />
                        <el-table-column label="设备类型" :formatter="typeFormatTable" prop="sheetType" align="center" />
                        <el-table-column label="故障标识" prop="alarmId" align="center" />
                        <el-table-column label="描述" prop="descr" align="center" />
                        <el-table-column label="发生时间" :formatter="dateTableFormat" prop="generaTime" align="center" />
                        <el-table-column label="处理状态" :formatter="stateFormatTable" prop="state" align="center" />
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                              <el-row>
                                <el-col :span="12">
                                  <el-button type="text" size="small" @click="operateRecord(scope.row)">处理记录</el-button>
                                </el-col>
                                <el-col :span="12">
                                  <el-button type="text" size="small" @click="openFittingsWin(scope.row)">配件更换记录</el-button>
                                </el-col>
                              </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <br/>
                <div class="form-item-title"><span class="line" />工单处理流程</div>
                <div class="form-item-content">
                    <el-table :data="tableOperationData" stripe :header-cell-style="{background:'#f1f1f1',color:'#000'}">
                        <el-table-column type="index" width="50" />
                        <el-table-column label="时间" :formatter="dateTableFormat" prop="handleTime" align="center" />
                        <el-table-column label="处理人" prop="handleManName" align="center" />
                        <el-table-column label="处理类型" :formatter="orderOperateFormat" prop="handleType" align="center" />
                        <el-table-column label="处理意见" prop="descr" align="center" />
                        <el-table-column label="工单状态" :formatter="stateFormatTable"  prop="descr" align="center" />
                        <!-- <el-table-column label="持续时长" prop="generaTime" align="center" /> -->
                    </el-table>
                </div>
              </div>

            </el-form>
        </el-dialog>
      <!-- 配件更换记录 -->
      <el-dialog title="配件更换记录" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="fittingsChangeWin" width="70%">
          <el-table :data="fittingsData" stripe :header-cell-style="{background:'#f1f1f1',color:'#000'}" highlight-current-row @expand-change="getDetailChange">
            <el-table-column label="旧件信息" align="center">
              <el-table-column type="index" label="序号" width="100" align="center"/>
              <el-table-column label="标识" prop="usedSpareId" align="center"/>
              <el-table-column label="类型" :formatter="spareSysFormatTable1" prop="usedSpareType" align="center"/>
              <el-table-column label="照片" prop="usedPicUrl" align="center">
                <template slot-scope="scope">
                  <img :src="scope.row.usedPicUrl" width="60" height="60" alt="">
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="新件信息" align="center">
              <el-table-column label="标识" prop="spareId" align="center"/>
              <el-table-column label="类型" :formatter="spareSysFormatTable1" prop="spareType" align="center"/>
              <el-table-column label="照片" prop="newPicUrl" align="center"/>
              <el-table-column label="更换详情" type="expand"  width="100" align="center">
                  <template slot-scope="scope">
                    <div class="titles">
                        <i />更换详细记录
                      </div>
                  <el-table :data="scope.row.ruleItemData" stripe :header-cell-style="{background:'#f1f1f1',color:'#000'}" highlight-current-row>
                      <el-table-column prop="handleTime" :formatter="dateTableFormat" label="时间" align="center"/>
                      <el-table-column prop="handleManName" label="处理人" align="center"/>
                      <el-table-column prop="descr" label="描述" align="center"/>
                      <el-table-column prop="state" :formatter="approveFormatTable" label="状态" align="center"/>
                  </el-table>
                  </template>
              </el-table-column>
            </el-table-column>
          </el-table>
          <div class="page-wrap">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-size="pageData.size"
              :total="pageData.total"
              :current-page="pageData.current"
              :page-sizes="[10, 20, 30, 40, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper, slot"
            >
            </el-pagination>
          </div>
      </el-dialog>
      <!-- 设备处理记录 -->
      <el-dialog title="设备处理记录" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="deviceOperateDialog" >
          <el-table :data="deivceOperateTable" stripe :header-cell-style="{background:'#f1f1f1',color:'#000'}" highlight-current-row>
              <el-table-column type="index" width="50" />
              <el-table-column label="时间" prop="handleTime" align="center" />
              <el-table-column label="处理人" prop="handleManName" align="center"/>
              <el-table-column label="描述" prop="descr" align="center" />
              <el-table-column label="状态" :formatter="approveFormatTable" prop="state" align="center" />
          </el-table>
      </el-dialog>
  </div>
</template>

<script>
    import {
        DICTDATA,
        translatorDict
    } from "@/api/dict";
    import {
        getDetails,
        queryBysheetIdDevId,
        spareSwitchRecQuery,
        queryProBySwitchRecId
    } from '@/api/operation/orderManage'
    import {
        getTimeSalc
    } from '@/utils/DateFormat'
    import imgUrl from "@/assets/image/bg.png"

    export default {
        data() {
            return {
                orderDetailWin: false,
                fittingsChangeWin: false,
                imageUrl: imgUrl,
                deviceOperateDialog: false,
                exampleData: {},
                // 配件更换记录数据
                fittingsData: [],
                tableOperationData: [],
                tableDevicesData: [],
                deivceOperateTable: [],
                orderOperateTime: '',
                dealDetail: [],
                pageData: {
                  total: 0,
                  current: 1,
                  pageSize: 10
                },
                dealDetailRow: {}
            };
        },
        mounted() {

        },
        methods: {
            dateFormat(time) {
                if(!time) return
                let date = new Date(time);
                let year = date.getFullYear();
                let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
            },
            dateTableFormat(row, column) {
                let time = row[column.property];
                let date = new Date(time);
                let year = date.getFullYear();
                let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
            },

            orderOperateFormat(row, column, cellValue, index) {
                if (cellValue !== "") {
                    return translatorDict(DICTDATA.ORDER_OPERATE_STATUS, cellValue);
                } else {
                    return "";
                }
            },
            stateFormat(value) {
              if (value !== "") {
                return translatorDict(DICTDATA.ORDER_STATUS, value);
              } else {
                return "";
              }
            },
            stateFormatTable(row, column, cellValue, index) {
              if (cellValue !== "") {
                return translatorDict(DICTDATA.ORDER_STATUS, cellValue);
              } else {
                return "";
              }
            },
            approveFormatTable(row, column, cellValue, index) {
              if (cellValue !== "") {
                return translatorDict(DICTDATA.APPROVE_STATUS, cellValue);
              } else {
                return "";
              }
            },
            spareSysFormatTable1(row, column, cellValue, index) {
              if (cellValue !== "") {
                return translatorDict(DICTDATA.SPARE_SYSTEM, cellValue);
              } else {
                return "";
              }
            },
            levelFormat(value) {
              if (value !== "") {
                return translatorDict(DICTDATA.ORDER_LEVEL, value);
              } else {
                return "";
              }
            },
            sourceFormat(value) {
              if (value !== "") {
                return translatorDict(DICTDATA.ORDER_SOURCE, value);
              } else {
                return "";
              }
            },
            typeFormat(value) {
              if (value !== "") {
                return translatorDict(DICTDATA.ORDER_TYPE, value);
              } else {
                return "";
              }
            },
            typeFormatTable(row, column, cellValue, index) {
              if (cellValue !== "") {
                return translatorDict(DICTDATA.ORDER_TYPE, cellValue);
              } else {
                return "";
              }
            },
            getDetail(id) {
                this.exampleData = {}
                this.tableDevicesData = []
                this.tableOperationData = []
                getDetails(id).then(res => {
                    this.exampleData = res.data.workSheetDetailVo;
                    this.tableDevicesData = res.data.workSheetDevVos

                    this.tableOperationData = res.data.workSheetPros

                    this.orderOperateTime = getTimeSalc(this.dateFormat(this.exampleData.receiveTime),this.dateFormat(this.exampleData.finishTime))
                });
            },

            openFittingsWin(row) {
              this.dealDetailRow = {}
              this.dealDetailRow = row
              this.fittingsChangeWin = true
              let params = {
                devId: row.devId,
                workSheetlId: row.sheetId,
                current: row.current
              }
              spareSwitchRecQuery(params).then(res=>{
                if(res.code = '000000') {
                  this.pageData = {
                    total: res.data.total,
                    current: res.data.current,
                    pageSize: res.data.size
                  };
                    res.data.records.map(item => {
                      item.ruleItemData = [];
                    });
                  this.fittingsData = res.data.records
                }
              })
            },
            getDetailChange(row, expandedRows) {
              if (expandedRows.length > 0) {
              queryProBySwitchRecId(row.id).then(res => {
                if(res.code === '000000') {
                    this.fittingsData.forEach((temp, index) => {
                        // 找到当前点击的行，把动态获取到的数据赋值进去
                        if (temp.id === row.id) {
                          this.fittingsData[index].ruleItemData = res.data;
                        }
                      });
                  }
                })
              }
            },
            operateRecord(row) {
              this.deviceOperateDialog = true
              queryBysheetIdDevId(row.id,row.devId).then(res=>{
                    //  设备处理记录
                    if(res.code==='000000') {
                      this.deivceOperateTable = res.data
                    }
              })
            },
            handleSizeChange(val) {
              let params = {
                devId: this.dealDetailRow.devId,
                workSheetlId: this.dealDetailRow.workSheetlId,
                current: 1,
                size: val
              }
              this.openFittingsWin(params);
            },
            handleCurrentChange(val) {
              let params = {
                devId: this.dealDetailRow.devId,
                workSheetlId: this.dealDetailRow.workSheetlId,
                current: val,
              }
              this.openFittingsWin(params);
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
    .titles {
        float: left;
        margin: 10px 0;
        i {
            width: 4px;
            height: 14px;
            display: inline-block;
            background: #24b3ca;
            margin-right: 10px;
            margin-top: 3px;
            float: left;
            border-radius: 5px;
        }
    }
</style>
