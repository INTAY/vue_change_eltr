<template>
    <div class="paddingLeft">
       <div class="table-top">
            <div class="table-top-a">
                    <div class="table-info green"></div>&nbsp;
                    <span style="color: rgb(40,176,114);font-size: 14px;">及时 &nbsp;&nbsp;&nbsp;</span>
                    <div class="table-info red"></div>&nbsp;
                    <span style="color: rgb(237, 110, 109);font-size: 14px;">不及时</span>
            </div>
        </div>
        <el-table ref="tableSour" :data="tableData" :header-cell-style="{background:'#f1f1f1',color:'#000'}" stripe @sort-change="changeSort"  style="width: 100%;margin-bottom: 50px;margin-top: 2px;">
            <el-table-column type="index" align="center" label="序号"></el-table-column>
            <el-table-column prop="reg_id" label="区县" align="left" v-if="colData[0].istrue" sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="station_id" label="站点" align="left" width="200" v-if="colData[1].istrue" sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="stake_no" align="left" width="200" label="充电桩编号" v-if="colData[2].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="gun_no" align="left" width="200" label="充电枪编号" v-if="colData[3].istrue"  sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="id" align="left" width="200" label="订单ID"  v-if="colData[4].istrue" sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="order_consume_type" label="充电类型" align="left" v-if="colData[5].istrue" width="150"  sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column label="充电开始一致" width="150"  v-if="colData[6].istrue"  sortable align="left" prop="is_status_start_time_same" >
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.is_status_start_time_same == '1'" size="small">是</el-tag>
                    <el-tag v-if="scope.row.is_status_start_time_same == '0'" size="small" type="danger">否</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="充电结束一致" align="left" v-if="colData[7].istrue"  sortable prop="is_status_end_time_same" width="150">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.is_status_end_time_same == '1'" size="small">是</el-tag>
                    <el-tag v-if="scope.row.is_status_end_time_same == '0'" size="small" type="danger">否</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="订单信息" align="left" width="80"  v-if="colData[8].istrue" >
                <template slot-scope="scope">
                    <el-tag @click="openDetailWin(scope.row.id)" size="small">查看</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="接收健康值" v-if="colData[9].istrue" width="150"  prop="is_receive_timely" sortable align="left">
                <template slot-scope="scope">
                    <div class="table-inlines red" v-if="scope.row.is_receive_timely == '0'" @click="getHealth(scope.row.id)"></div>
                    <div class="table-inlines green" v-if="scope.row.is_receive_timely == '1'" @click="getHealth(scope.row.id)"></div>
                </template>
            </el-table-column>
            <el-table-column label="推送健康值" v-if="colData[10].istrue" width="150"  prop="is_respon_timely" sortable align="left">
                <template slot-scope="scope">
                    <div class="table-inlines red" v-if="scope.row.is_respon_timely == '0'" @click="pushHealth(scope.row.id)"></div>
                    <div class="table-inlines green" v-if="scope.row.is_respon_timely == '1'" @click="pushHealth(scope.row.id)"></div>
                </template>
            </el-table-column>

            <el-table-column prop="amount" align="left" width="100" label="交易金额" v-if="colData[11].istrue" sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="buss_type" align="left" width="100" label="业务类型" v-if="colData[12].istrue" sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="card_no" align="left" width="200" label="卡号" v-if="colData[13].istrue"  sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="create_time" align="left" width="200" label="订单创建时间" v-if="colData[14].istrue"  sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="accept_time" align="left" width="200" label="上送时间" v-if="colData[15].istrue"  sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="elec_amount" align="left" width="100" label="交易电费" v-if="colData[16].istrue"  sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="is_status_change_timely" align="left" width="200" v-if="colData[17].istrue"  sortable label="状态变化是否及时" show-tooltip-when-overflow>
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.is_status_change_timely == '1'" size="small">是</el-tag>
                    <el-tag v-if="scope.row.is_status_change_timely == '0'" size="small" type="danger">否</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="ord_type" align="left" width="100" label="充电方式" v-if="colData[18].istrue"  sortable  show-tooltip-when-overflow></el-table-column><el-table-column prop="order_channel" align="left" width="100" label="订单渠道" v-if="colData[19].istrue"  sortable  show-tooltip-when-overflow></el-table-column><el-table-column prop="order_source" align="left" width="100" label="订单来源" v-if="colData[20].istrue"  sortable  show-tooltip-when-overflow></el-table-column><el-table-column prop="order_state" align="left" width="100" label="订单状态" v-if="colData[21].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="paid_time" align="left" width="200" label="支付完成时间" v-if="colData[22].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="pay_id" align="left" width="200" label="支付单号" v-if="colData[23].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="push_man_name" align="left" width="100" label="修改人" v-if="colData[24].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="push_num" align="left" width="100" label="补推次数" v-if="colData[25].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="push_state" align="left" width="100" label="推送状态" v-if="colData[26].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="push_time" align="left" width="200" label="推送时间" v-if="colData[27].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="receive_time" align="left" width="200" label="接收时间" v-if="colData[28].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="request_electy" align="left" width="200" label="请求充电量" v-if="colData[29].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="request_freeze_amount" align="left" width="200" label="桩请求冻结金额" v-if="colData[30].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="respon_err_info" align="left" width="200" label="e充网反馈失败原因" v-if="colData[31].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="respon_time" align="left" width="200" label="e充网反馈时间" v-if="colData[32].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="run_electy" align="left" width="100" label="抄表电量" v-if="colData[33].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="screen" align="left" width="200" label="初筛是否通过" v-if="colData[34].istrue"   sortable show-tooltip-when-overflow>
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.screen == '1'" size="small">是</el-tag>
                    <el-tag v-if="scope.row.screen == '0'" size="small" type="danger">否</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="screen_fail_resaon" align="left" width="200" label="筛选失败原因" v-if="colData[35].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="service_amount" align="left" width="100" label="交易服务费" v-if="colData[36].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="stake_ou_code" align="left" width="200" label="充电桩产权单位"  v-if="colData[37].istrue"  sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="start_time" align="left" width="200" label="充电开始时间" v-if="colData[38].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="third_trade_no" align="left" width="200" label="交易流水号" v-if="colData[39].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="total_electy" align="left" width="100" label="交易电量" v-if="colData[40].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="total_spvalue" align="left" width="120" label="电表总止值" v-if="colData[41].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="total_stvalue" align="left" width="120" label="电表总起值" v-if="colData[42].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="user_id" align="left" width="200" label="用户ID" v-if="colData[43].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="pushTime" align="left" width="200"  v-if="colData[44].istrue" sortable label="补推时间"></el-table-column>
            
            <el-table-column width="40" fixed="right">
                <template slot="header">
                    <el-popover placement="bottom" min-width="80" trigger="click" popper-class="col-setting-popover" >
                    <el-button slot="reference" size="small" type="text" icon="el-icon-setting" style="padding:0; border-color:#f1f1f1;"></el-button>
                    <div class="col-setting-title">展示列设置</div>
                    <el-checkbox-group style="height: 600px;overflow-y: scroll;" v-model="colOptions" :min="1" class="col-setting-group">
                        <el-checkbox v-for="item in colSelect" :label="item" :key="item">{{item}}</el-checkbox>
                    </el-checkbox-group>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <div>
            <el-dialog title="订单信息" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="orderDetailWin" width="50%" top="20vh">
                <el-form :inline="true" class="demo-form-inline" :model="exampleData" label-width="150px">
                    <div class="form-item" style="width: 100%">
                        <div class="form-item-content">
                            <el-row class="bg-247">
                                <el-col :span="12">
                                    <el-form-item label="充电开始时间">
                                        <span v-text="exampleData.startTime" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="充电结束时间">
                                        <span>{{exampleData.endTime}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row class="bg-235">
                                <el-col :span="12">
                                    <el-form-item label="交易电量(度)">
                                        <span>{{exampleData.totalElecty}}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="交易电费(元)">
                                        <span>{{exampleData.elecAmount}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row class="bg-247">
                                <el-col :span="12">
                                    <el-form-item label="交易服务费(元)">
                                        <span v-text="exampleData.serviceAmount" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="交易金额(元)">
                                        <span v-text="exampleData.amount" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-form>
            </el-dialog>

            <el-dialog title="接收信息" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="getHealthDialog">
                <el-form :inline="true" class="demo-form-inline" :model="getData" label-width="150px">
                    <div class="form-item" style="width: 100%">
                        <div class="form-item-content">
                            <el-row class="bg-247">
                                <el-col :span="12">
                                    <el-form-item label="充电开始时间">
                                        <span v-text="getData.startTime" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="(前置模块)采集时间">
                                        <span>{{getData.acceptTime}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row class="bg-235">
                                <el-col :span="12">
                                    <el-form-item label="(省级应用)接收时间">
                                        <span>{{getData.receiveTime}}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="接收延时">
                                        <span>{{getData.delayInfo}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-form>
            </el-dialog>
            <el-dialog title="推送信息" :visible.sync="pushHealthDialog" width="50%">
                <el-form :inline="true" class="demo-form-inline" :model="pushData" label-width="150px">
                    <div class="form-item" style="width: 100%">
                        <div class="form-item-content">
                            <el-row class="bg-247">
                                <el-col :span="12">
                                    <el-form-item label="(省级应用)推送时间">
                                        <span v-text="pushData.pushTime" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="(e充网)反馈时间">
                                        <span>{{pushData.responTime}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row class="bg-235">
                                <el-col :span="12">
                                    <el-form-item label="推送延时" style="width: 120%">
                                        <span>{{pushData.delayInfo}}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="推送结果">
                                        <span>{{pushData.pushResult}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row class="bg-247">
                                <el-col :span="12">
                                    <el-form-item label="推送备注">
                                        <span v-text="pushData.note" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { queryByPage, dispatchById, confirmedById, getDetails, queryUser } from '../../../../api/operation/orderManage';
import { orderMonitor, orderDetail, pushInfo, receiveInfo } from '@/api/platform/generalOverview';
import moment from 'moment';

import { DICTDATA, translatorDict } from '@/api/dict';
export default {
    data() {
        return {
            orderDetailWin: false,
            exampleData: {},
            getHealthDialog: false,
            getData: {},
            pushHealthDialog: false,
            pushData: {},
            pageData: {
                total: 0,
                current: 1,
                size: 10
            },
            exampleData: {},
            tableData: [],
            exampleData: {},
            orgId: JSON.parse(sessionStorage.getItem('user')).orgId,
            colData: [
                { title: "区县", istrue: true },
                { title: "站点", istrue: true },
                { title: "充电桩编号", istrue: true },
                { title: "充电枪编号", istrue: true },
                { title: "订单ID", istrue: true },
                { title: "充电类型", istrue: true },
                { title: "充电开始一致", istrue: true },
                { title: "充电结束一致", istrue: true },
                { title: "订单信息", istrue: true },
                { title: "接收健康值", istrue: true },
                { title: "推送健康值", istrue: true },
                { title: "交易金额", istrue: true },
                { title: "业务类型", istrue: true },
                { title: "卡号", istrue: true },
                { title: "订单创建时间", istrue: true },
                { title: "上送时间", istrue: true },
                { title: "交易电费", istrue: true },
                { title: "状态变化是否及时", istrue: true },
                { title: "充电方式", istrue: true },
                { title: "订单渠道", istrue: true },
                { title: "订单来源", istrue: true },
                { title: "订单状态", istrue: true },
                { title: "支付完成时间", istrue: true },
                { title: "支付单号", istrue: true },
                { title: "修改人", istrue: true },
                { title: "补推次数", istrue: true },
                { title: "推送状态", istrue: true },
                { title: "推送时间", istrue: true },
                { title: "接收时间", istrue: true },
                { title: "请求充电量", istrue: true },
                { title: "桩请求冻结金额", istrue: true },
                { title: "e充网反馈失败原因", istrue: true },
                { title: "e充网反馈时间", istrue: true },
                { title: "抄表电量", istrue: true },
                { title: "初筛是否通过", istrue: true },
                { title: "筛选失败原因", istrue: true },
                { title: "交易服务费", istrue: true },
                { title: "充电桩产权单位", istrue: true },
                { title: "充电开始时间", istrue: true },
                { title: "交易流水号", istrue: true },
                { title: "交易电量", istrue: true },
                { title: "电表总止值", istrue: true },
                { title: "电表总起值", istrue: true },
                { title: "用户ID", istrue: true },
                { title: "补推时间", istrue: true },
            ],
            colOptions: [],
            colSelect: [],
        };
    },
    created () {
        let _this = this;
        for (let i = 0; i < _this.colData.length; i++) {
            _this.colSelect.push(_this.colData[i].title);
            if (_this.colSelect.length > 11) {
                continue;
            }
            _this.colOptions.push(_this.colData[i].title);
        }
    },
    watch: {
        colOptions(valArr) {
        var arr = this.colSelect.filter((i) => valArr.indexOf(i) < 0);
        this.colData.filter((i) => {
            if (arr.indexOf(i.title) != -1) {
            i.istrue = false;
            this.$nextTick(() => {
                // this.$refs.tableDataRef.doLayout();
            });
            } else {
            i.istrue = true;
            this.$nextTick(() => {
                // this.$refs.tableDataRef.doLayout();
            });
            }
        });
        },
    },
    methods: {
        changeSort (val) {
            let orderSort;
            //  升序
            if(val.order == null) return
            if(val.order && val.order == "ascending") {
                orderSort = 1
            }
            //  降序
            if(val.order == "descending") {
                orderSort = -1  
            }
            let paramInput = this.$parent.$refs.fillBar.formInline
            if (paramInput.pushTime && paramInput.pushTime.length > 0) {
                paramInput.pushEnd = moment(paramInput.pushTime[1]).format('YYYY-MM-DD');
                paramInput.pushStart = moment(paramInput.pushTime[0]).format('YYYY-MM-DD');
            }
            if (paramInput.getTime && paramInput.getTime.length > 0) {
                paramInput.receiveEnd = moment(paramInput.getTime[1]).format('YYYY-MM-DD');
                paramInput.receiveStart = moment(paramInput.getTime[1]).format('YYYY-MM-DD');
            }
            paramInput.sortCol = 'push_time'
            paramInput.sortType = -1
            delete paramInput.getTime;
            delete paramInput.pushTime;
            paramInput.sortCol = val.prop
            paramInput.sortType = orderSort
            this.queryPage(paramInput)
        },
        queryPage(param) {
            orderMonitor(param).then((res) => {
                this.tableData = res.data.records;

                // 渲染分页控件数据
                this.pageData = {
                    total: res.data.total,
                    current: res.data.current,
                    pageSize: res.data.size
                };
                this.$parent.$refs.pageModule.pageData = this.pageData;
            });
        },
        openDetailWin(arg) {
            orderDetail(arg).then((res) => {
                if (res.code == '000000') {
                    this.exampleData = res.data;
                }
            });
            this.orderDetailWin = true;
        },
        getHealth(arg) {
            this.getHealthDialog = true;
            receiveInfo(arg).then((res) => {
                if (res.code == '000000') {
                    this.getData = res.data;
                }
            });
        },
        pushHealth(arg) {
            this.pushHealthDialog = true;
            pushInfo(arg).then((res) => {
                if (res.code == '000000') {
                    this.pushData = res.data;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.paddingLeft {
    //全局布局
    padding: 0 20px;
    padding-bottom: 70px;
}

// /deep/ .el-table {
//     background-color: #f2f2f2;
// }

.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
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

.form-item-content {
    background-color: #fcfcfc;
    border: 1px solid #eee;
    padding: 15px;
}
.table-inlines {
    width: 60px;
    height: 20px;
}
.green {
    background-color: rgb(40, 176, 114);
    cursor: pointer;
    margin-top: 7px;
}
.green:hover,
.green:focus{
    background-color: rgb(82, 202, 148);
}

.red {
    background-color: rgb(237, 110, 109);
    cursor: pointer;
    margin-top: 7px;
}
.red:hover,
.red:focus{
   background-color: rgb(238, 130, 130);  
}
.bg-247 {
    background-color: rgb(247, 247, 247);
}
.bg-235 {
    background-color: rgb(235, 235, 235);
}
.table-info {
    width: 10px;
    height: 10px;
    display: inline-block;
}
.table-top{
  display: flex;
  justify-content:flex-end;
}
.table-top-a{
  width: 140px;
}
.chakan{
    color:#1396c2!important;
    font-size: 13px;
}
</style>
