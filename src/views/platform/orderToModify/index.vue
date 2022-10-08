<template>
    <div class="box">
        <el-form label-width="100px" :inline="true" class="box-search">
            <el-form-item label="区县">
                <el-select size="mini" class="inputWidth" v-model="formInline.regId" @change="queryByCondition(formInline.regId)">
                    <el-option v-for="item in regionMap" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="站点">
                <el-select size="mini" filterable class="inputWidth" v-model="formInline.station" clearable>
                    <el-option v-for="item in staMap" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="充电桩编号">
                <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.stakeNo" clearable></el-input>
            </el-form-item>
            <el-form-item label="充电枪编号">
                <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.gunNo" clearable></el-input>
            </el-form-item>
            <el-form-item label="车联网订单ID" label-width="100px">
                <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.orderId" clearable></el-input>
            </el-form-item>
            <el-form-item label="充电类型">
                <el-select size="mini" class="inputWidth" v-model="formInline.orderConsumeType" clearable>
                    <el-option v-for="item in chargeType" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <br/>
            <el-form-item label="充电开始一致">
                <el-select size="mini" class="inputWidth" style="width:100px" v-model="formInline.isStatusStartTimeSame" clearable>
                    <el-option v-for="item in isYes" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="充电结束一致">
                <el-select size="mini" class="inputWidth" style="width:100px" v-model="formInline.isStatusEndTimeSame" clearable>
                    <el-option v-for="item in isYes" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="接收时间">
                <el-date-picker
                class="picker-width"
                    v-model="formInline.receviceTime"
                    type="daterange"
                    :picker-options="pickerOptions0" 
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="补推时间">
                <el-date-picker v-model="formInline.getTime" 
                type="daterange" 
                :picker-options="pickerOptions0"  
                range-separator="至" start-placeholder="开始时间" 
                end-placeholder="结束时间" 
                class="picker-width"></el-date-picker>
            </el-form-item>
            <el-form-item label="推送状态">
                <el-select size="mini" class="inputWidth" style="width: 100px;" v-model="formInline.pushState" clearable>
                    <el-option v-for="item in repushResultMap" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="btnSearch">
                <el-button size="mini" class="newButtonColor btnSpace SearchBTN" @click="getData(formInline, true)">查询</el-button>
                <el-button size="mini" @click="emptyFun()" class="SearchBTN otherBTN">清空</el-button>
            </el-form-item>
        </el-form>
        <div class="table-top">
            <div class="table-top-a">
                <div class="table-info green"></div>&nbsp;
                <span style="color: rgb(40,176,114);font-size: 14px;">及时 &nbsp;&nbsp;&nbsp;</span>
                <div class="table-info red"></div>&nbsp;
                <span style="color: rgb(237, 110, 109);font-size: 14px;">不及时</span>
            </div>
        </div>
        <el-table :data="tableOrder" ref="tableSour" :header-cell-style="{height: '45px'}" style="font-size: 14px" @sort-change="changeSort" stripe class="tableStyle" text-align="left">
            <el-table-column type="index" align="center" label="序号"></el-table-column>
            <el-table-column prop="reg_id" label="区县" align="left" v-if="colData[0].istrue" sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="station_id" label="站点" align="left" width="200" v-if="colData[1].istrue" sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="stake_no" align="left" width="200" label="充电桩编号" v-if="colData[2].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="gun_no" align="left" width="200" label="充电枪编号" v-if="colData[3].istrue"  sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="id" align="left" width="200" label="订单ID"  v-if="colData[4].istrue" sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="order_consume_type" label="充电类型" align="left" v-if="colData[5].istrue" width="150" sortable show-tooltip-when-overflow ></el-table-column>
            <el-table-column label="充电开始一致" width="140"  v-if="colData[6].istrue"  sortable align="left" prop="is_status_start_time_same" >
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.is_status_start_time_same == '1'" size="small">是</el-tag>
                    <el-tag v-if="scope.row.is_status_start_time_same == '0'" size="small" type="danger">否</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="充电结束一致" align="left" v-if="colData[7].istrue"  sortable prop="is_status_end_time_same" width="140">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.is_status_end_time_same == '1'" size="small">是</el-tag>
                    <el-tag v-if="scope.row.is_status_end_time_same == '0'" size="small" type="danger">否</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="订单信息" align="left" width="120" v-if="colData[8].istrue" >
                <template slot-scope="scope">
                    <el-tag @click="details(scope.row.id)" size="small">查看</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="push_state" align="left" width="100" label="推送状态" v-if="colData[9].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="respon_err_info" align="left" width="200" label="e充网反馈失败原因" v-if="colData[10].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="respon_time" align="left" width="200" label="e充网反馈时间" v-if="colData[11].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="push_man_name" align="left" width="100" label="修改人" v-if="colData[12].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="edit_info" align="left" width="200" label="修改内容"  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="push_num" align="left" width="100" label="补推次数" v-if="colData[13].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="push_time" align="left" width="200"  v-if="colData[14].istrue" sortable label="补推时间"></el-table-column>
            <el-table-column prop="amount" align="left" width="100"  label="交易金额" v-if="colData[15].istrue" sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="buss_type" align="left" width="100" label="业务类型" v-if="colData[16].istrue" sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="card_no" align="left" width="200" label="卡号" v-if="colData[17].istrue"  sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="create_time" align="left" width="200" label="订单创建时间" v-if="colData[18].istrue"  sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="accept_time" align="left" width="200" label="上送时间" v-if="colData[19].istrue"  sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="elec_amount" align="left" width="100" label="交易电费" v-if="colData[20].istrue"  sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column label="接收健康值" v-if="colData[21].istrue" width="150"  prop="is_receive_timely" sortable align="left">
                <template slot-scope="scope">
                    <div class="table-inlines red" v-if="scope.row.is_receive_timely == '0'"></div>
                    <div class="table-inlines green" v-if="scope.row.is_receive_timely == '1'"></div>
                </template>
            </el-table-column>
            <el-table-column label="推送健康值" v-if="colData[22].istrue" width="150"  prop="is_respon_timely" sortable align="left">
                <template slot-scope="scope">
                    <div class="table-inlines red" v-if="scope.row.is_respon_timely == '0'" @click="pushHealth(scope.row.id)"></div>
                    <div class="table-inlines green" v-if="scope.row.is_respon_timely == '1'" @click="pushHealth(scope.row.id)"></div>
                </template>
            </el-table-column>
            <el-table-column prop="is_status_change_timely" align="left" width="200" v-if="colData[23].istrue"  sortable label="状态变化是否及时" show-tooltip-when-overflow>
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.is_status_change_timely == '1'" size="small">是</el-tag>
                    <el-tag v-if="scope.row.is_status_change_timely == '0'" size="small" type="danger">否</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="ord_type" align="left" width="100" label="充电方式" v-if="colData[24].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="order_channel" align="left" width="100" label="订单渠道" v-if="colData[25].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="order_source" align="left" width="100" label="订单来源" v-if="colData[26].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="order_state" align="left" width="100" label="订单状态" v-if="colData[27].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="paid_time" align="left" width="200" label="支付完成时间" v-if="colData[28].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="pay_id" align="left" width="200" label="支付单号" v-if="colData[29].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="push_time" align="left" width="200" label="推送时间" v-if="colData[31].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="receive_time" align="left" width="200" label="接收时间" v-if="colData[32].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="request_electy" align="left" width="130" label="请求充电量" v-if="colData[33].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="request_freeze_amount" align="left" width="200" label="桩请求冻结金额" v-if="colData[34].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="run_electy" align="left" width="100" label="抄表电量" v-if="colData[35].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="screen" align="left" width="200" label="初筛是否通过" v-if="colData[36].istrue"   sortable show-tooltip-when-overflow>
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.screen == 1" size="small">是</el-tag>
                    <el-tag v-if="scope.row.screen == 0" size="small" type="danger">否</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="screen_fail_resaon" align="left" width="200" label="筛选失败原因" v-if="colData[37].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="service_amount" align="left" width="130" label="交易服务费" v-if="colData[38].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="stake_ou_code" align="left" width="200" label="充电桩产权单位"  v-if="colData[39].istrue"  sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="start_time" align="left" width="200" label="充电开始时间" v-if="colData[40].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="third_trade_no" align="left" width="200" label="交易流水号" v-if="colData[41].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="total_electy" align="left" width="100" label="交易电量" v-if="colData[42].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="total_spvalue" align="left" width="120" label="电表总止值" v-if="colData[43].istrue"   sortable show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="total_stvalue" align="left" width="120" label="电表总起值" v-if="colData[44].istrue"  sortable  show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="user_id" align="left" width="200" label="用户ID" v-if="colData[45].istrue"  sortable  show-tooltip-when-overflow></el-table-column>

            <el-table-column label="操作" align="left" width="160px" sortable fixed="right">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.push_state == '补推成功'|| scope.row.push_state == '首推成功'"  class="buleBTN" size="mini" disabled>修改</el-button>
                    <el-button v-else @click="modifyInfo(scope.row.id)" class="buleBTN" size="mini">修改</el-button>
                    <el-button @click="getHis(scope.row.id)" class="buleBTN" size="mini">预览</el-button>
                </template>
            </el-table-column>
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
        <div class="di">
            <el-pagination style="display: inline-block" 
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="pageData.current" 
            :page-sizes="[10, 20, 30, 40, 50]" 
            :page-size="pageData.size" 
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageData.total"
            ></el-pagination>
            <el-button size="mini" @click="refresh">刷新</el-button>
            <el-button size="mini" @click="exportFun">导出</el-button>
        </div>
        <history-rocord ref="recordHis"></history-rocord>
        <order-info ref="recordInfo"></order-info>
        <order-modify ref="recordMod"></order-modify>
    </div>
</template>

<script>
    import historyRocord from './component/historyRocord';
    import orderInfo from './component/orderInfo';
    import orderModify from './component/orderModify';
    import {
        queryOrderPushPage,
        chargeType,
        healthMap,
        isYes,
        orderDetail,
        editInfo,
        editRec,
        region,
        queryStationByRegAndName,
        getQuartorStartDate,
        PUSHSTATEMAP,
        exportPushData
    } from '@/api/platform/generalOverview';
    import moment from 'moment';
    export default {
        name: 'orderToModify',
        components: {
            historyRocord,
            orderInfo,
            orderModify
        },
        data() {
            return {
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的 
                    }
                },
                formInline: {
                    receviceTime: [new Date(), new Date()],
                    getTime: [],
                    current: '1',
                    gunNo: '',
                    //  充电枪编号
                    isReceiveTimely: '',
                    //  接收健康
                    isResponTimely: '',
                    //  推送健康
                    isStatusEndTimeSame: '',
                    //  充电结束一致
                    isStatusStartTimeSame: '',
                    //  充电开始一致
                    orderConsumeType: '',
                    //  充电类型
                    orderId: '',
                    //  车联网订单ID
                    size: '10',
                    stakeNo: ''
                },
                orderTypes: {},
                orderSource: {},
                groupMap: [],
                tableOrder: [],
                pageData: {
                    total: 0,
                    current: 1,
                    size: 10
                },
                // 弹窗
                dialogVisible: false,
                address: '南京市浦口区',
                cacheData: [], //缓存数据
                chargeType: chargeType,
                healthMap: healthMap,
                isYes: isYes,
                regionMap: [],
                staMap: [],
                repushResultMap: PUSHSTATEMAP,
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
                    { title: "推送状态", istrue: true },

                    { title: "e充网反馈失败原因", istrue: true },
                    { title: "e充网反馈时间", istrue: true },
                    { title: "修改人", istrue: true },
                    { title: "补推内容", istrue: true },
                    { title: "补推次数", istrue: true },
                    { title: "补推时间", istrue: true },
                    { title: "交易金额", istrue: true },
                    { title: "业务类型", istrue: true },
                    { title: "卡号", istrue: true },
                    { title: "订单创建时间", istrue: true },
                    { title: "上送时间", istrue: true },
                    { title: "交易电费", istrue: true },
                    { title: "接收健康值", istrue: true },
                    { title: "推送健康值", istrue: true },
                    { title: "状态变化是否及时", istrue: true },

                    { title: "充电方式", istrue: true },
                    { title: "订单渠道", istrue: true },
                    { title: "订单来源", istrue: true },
                    { title: "订单状态", istrue: true },
                    { title: "支付完成时间", istrue: true },
                    { title: "支付单号", istrue: true },
                    { title: "推送时间", istrue: true },
                    { title: "接收时间", istrue: true },
                    { title: "请求充电量", istrue: true },

                    { title: "桩请求冻结金额", istrue: true },
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
                ],
                colOptions: [],
                colSelect: [],
                flag: false //  防止分页的时候页数和页码一起请求
            };
        },
        created () {
            let _this = this;
            for (let i = 0; i < _this.colData.length; i++) {
                _this.colSelect.push(_this.colData[i].title);
                if (_this.colSelect.length > 15) {
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
            $route(newVal){
                this.mountedSetSource()
            },
        },
        mounted() {
            //  展示站点数据
            this.regionMap = [];
            region(sessionStorage.getItem("regId")).then((res) => {
                if (res.code == '000000') {
                    this.regionMap = res.data;
                    this.staMap = [];
                }
            });
            //  如果从首页来的就调this.mountedSetSource();
            if (Object.values(this.$route.params).length>0) {
                this.mountedSetSource();
            }else {
                //  否则就普通的
                this.formInline.sortCol = 'push_time'
                this.formInline.sortType = -1
                this.getData(this.formInline);
                this.formInline.receviceTime = [new Date(), new Date()]
            }
        },
        methods: {
            changeSort (val) {
                if(val.order == null) return
                let orderSort;
                //  升序
                if(val.order && val.order == "ascending") {
                    orderSort = 1
                }
                //  降序
                if(val.order == "descending") {
                    orderSort = -1  
                }
                this.formInline.sortCol = val.prop
                this.formInline.sortType = orderSort
                this.getData(this.formInline)
                
            },
            mountedSetSource() {
                // this.formInline.pushState = this.$route.params.result;
                this.formInline.sortCol = 'push_time'
                this.formInline.sortType = '-1'
                switch (this.$route.params.queryType) {
                    case '1':
                        this.formInline.getTime = [`${this.$route.params.year}-01-01`, `${this.$route.params.year}-12-31`];
                        break;
                    case '2':
                        getQuartorStartDate(this.$route.params.year, this.$route.params.quarter);
                        break;
                    case '3':
                        let firstDate = moment(this.$route.params.month).startOf('month').format('YYYY-MM-DD');
                        let lastDate = moment(this.$route.params.month).endOf('month').format('YYYY-MM-DD');
                        this.formInline.getTime = [firstDate, lastDate];
                        break;
                    case '4':
                        this.formInline.getTime = [new Date(this.$route.params.day), new Date(this.$route.params.day)];
                        break;
                    case '5':
                        this.formInline.getTime = [this.$route.params.startDay, this.$route.params.endDay];
                        break;
                    default:
                        break;
                }
                setTimeout(() => {
                    if (this.formInline.receviceTime && this.formInline.receviceTime.length > 0) {
                        this.formInline.receiveEnd = this.formInline.receviceTime[1];
                        this.formInline.receiveStart = this.formInline.receviceTime[0];
                    }
                    // delete this.formInline.getTime;
                    this.getData(this.formInline);
                }, 1000);
            },
            emptyFun() {
                this.formInline = {
                    sortCol: "push_time",
                    sortType: -1
                };
            },
            details(val) {
                orderDetail(val).then((res) => {
                    if (res.code == '000000') {
                        this.$refs.recordInfo.mapSource = res.data;
                    }
                });
                this.$refs.recordInfo.dialogVisible = true;
            },
            modifyInfo(val) {
                editInfo(val).then((res) => {
                    if (res.code == '000000') {
                        this.$refs.recordMod.formInline = res.data;
                        if(res.data.isStatusEndTimeSame == '1'){
                            this.$refs.recordMod.formInline.isStatusEndTimeSame = '是'
                        }else {
                            this.$refs.recordMod.formInline.isStatusEndTimeSame = '否'
                        }
                        if(res.data.isStatusStartTimeSame == '1'){
                            this.$refs.recordMod.formInline.isStatusStartTimeSame = '是'
                        }else {
                            this.$refs.recordMod.formInline.isStatusStartTimeSame = '否'
                        }
                        
                    }
                });
                this.$refs.recordMod.dialogVisible = true;
            },
            getHis(val) {
                editRec(val).then((res) => {
                    if (res.code == '000000') {
                        this.$refs.recordHis.tableData = res.data;
                    }
                });
                this.$refs.recordHis.paramId = val;
                this.$refs.recordHis.dialogVisible = true;
            },
            //  isSerachBtn 判断是否点了查询按钮进来的，如果是current=1
            getData(params, isSerachBtn) {
                if(isSerachBtn) {
                    this.formInline.current = 1
                }
                //  如果选择了补推时间
                if(params&& params.getTime&&params.getTime.length>0) {
                    this.formInline.pushStart = moment(params.getTime[0]).format('YYYY-MM-DD')
                    this.formInline.pushEnd = moment(params.getTime[1]).format('YYYY-MM-DD')
                }
                if(params&& params.receviceTime&&params.receviceTime.length>0) {
                    this.formInline.receiveStart = moment(params.receviceTime[0]).format('YYYY-MM-DD')
                    this.formInline.receiveEnd = moment(params.receviceTime[1]).format('YYYY-MM-DD')
                }
                // delete params.getTime
                // delete params.receviceTime
                queryOrderPushPage(params).then((res) => {
                    if (res.code == '000000') {
                        this.tableOrder = res.data.records;
                        // 渲染分页控件数据
                        this.pageData = {
                            total: res.data.total,
                            current: res.data.current,
                            pageSize: res.data.size
                        };
                        this.flag = false
                    }
                });
            },
            queryByCondition(arg) {
                this.staMap = [];
                let params = {
                    regId: arg,
                    stationName: ''
                };
                queryStationByRegAndName(params).then((res) => {
                    if (res.code == '000000') {
                        this.staMap = res.data;
                    }
                });
            },
            /**
             * 刷新
             */
            refresh() {
                this.formInline.size = this.pageData.size;
                this.formInline.current = this.pageData.current;
                this.getData(this.formInline);
            },
            /**
             * 每页条数变化
             */
            handleSizeChange(val) {
                this.formInline.size = val
                this.formInline.current = 1;
                this.getData(this.formInline);
                //  防止handleCurrentChange方法跟handleSizeChange同时请求，加了个flag，只有在查数据结束以后才可以调用handleCurrentChange，别的地方都不可以调
                this.flag = true
            },
            /**
             * 点击某页
             */
            handleCurrentChange(val) {
                if(!this.flag) {
                    this.formInline.current = val
                    this.getData(this.formInline);
                }
                
            },
            exportFun() {
                if (this.tableOrder.length == 0) {
                    this.$message({
                    showClose: true,
                    message: '表格数据0条不可导出',
                    type: 'warning'
                    });
                    return 
                }
                //   当前选择的table列
                let nowColList = this.$refs.tableSour.layout.store.states.columns
                //  选择的查询条件
                let seclectFormLine = this.formInline
                //  置空
                seclectFormLine.headers = [];
                seclectFormLine.values = [];
                //  掐头去尾 去undefind
                let filerList = nowColList.slice(1,nowColList.length-1).filter( (item,index,arr) => {
                    if (item.property != undefined) {
                    return arr
                    }
                })
                //  格式化
                filerList.forEach(item => {
                    seclectFormLine.headers.push(item.label)
                    seclectFormLine.values.push(item.property)
                });

                if(seclectFormLine.getTime&&seclectFormLine.getTime.length>0) {
                    seclectFormLine.pushStart = moment(seclectFormLine.getTime[0]).format('YYYY-MM-DD')
                    seclectFormLine.pushEnd = moment(seclectFormLine.getTime[1]).format('YYYY-MM-DD')
                }
                if(seclectFormLine.receviceTime&&seclectFormLine.receviceTime.length>0) {
                    seclectFormLine.receiveStart = moment(seclectFormLine.receviceTime[0]).format('YYYY-MM-DD')
                    seclectFormLine.receiveEnd = moment(seclectFormLine.receviceTime[1]).format('YYYY-MM-DD')
                }
                // delete seclectFormLine.receviceTime
                // delete seclectFormLine.getTime
                if(!nowColList.sortCol) {
                    seclectFormLine.sortCol= "push_time"
                    seclectFormLine.sortType= -1
                }
                exportPushData(seclectFormLine).then((res) => {
                    if(res.code === '000000') {
                    window.open(res.data)
                    }
                })
            }
        }
    };
</script>

<style lang="scss" scoped>
    .box {
        width: 100%;
        box-sizing: border-box;
        .box-search {
            width: 100%;
            background: #f3f3f3;
            padding: 12px 0;
        }
        .left {
            width: 100%;
            height: 90px;
            border-bottom: 1px solid #cdd9e7;
            padding: 0 16px;
            li {
                position: relative;
                width: calc(100% / 5);
            }
        }
    }

    .tableStyle {
        width: 98%;
        margin: 2px 0 60px 18px;
        font-size: 14px;
        tbody tr:hover>td {
            background-color: #f5b8b8;
        }
    } //弹框
    .siteDetailMessage {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 60px;
        padding-left: 20px;
        font-size: 14px;
        margin-bottom: 12px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #fcfcfc;
        span {
            margin-right: 20px;
            color: #afafaf;
        }
        .Dmessage {
            display: flex;
            margin-top: 5px;
            div {
                flex: 1;
            }
        }
    }

    .Details_message {
        margin-top: 5px;
        padding: 8px 20px 5px 15px;
        border: 1px solid #f0f0f0;
        border-radius: 5px;
        background-color: #fcfcfc;
        .timesline {
            display: flex;
            align-items: center;
            padding: 12px 0 25px 0;
            height: 112px;
            border-bottom: 1px solid #dcdcdc; //主轴时间线
            .mainLine {
                position: relative;
                width: 100%;
                height: 3px;
                background-color: #dbdbdb;
                .iconRect {
                    position: absolute;
                    left: 15px;
                    top: -13px;
                    width: 28px;
                    height: 28px;
                    background-image: url('../../../../static/img/timeIcon.png');
                }
                .messageDtails {
                    position: absolute;
                    left: 10px;
                    top: 12px;
                    width: 40px;
                    height: 40px;
                    margin-top: 5px;
                    text-align: center;
                    .titleTimeColor {
                        color: #c94343;
                    }
                }
            }
        }
        .lineCahrts {
            width: 100%;
            height: 220px;
            padding-top: 12px;
        }
        .tableData {
            padding-top: 12px;
            .sign {
                display: inline-block;
                width: 3px;
                height: 13px;
                margin-right: 16px;
                background-color: #24b3ca;
            }
        }
    }

    .inputWidth {
        //input框的长度
        width: 170px;
    }

    .block {
        display: inline-block;
    }

    .di {
        position: fixed;
        bottom: 0px;
        background: #f7f7f7;
        z-index: 999;
        text-align: center;
        left: 220px;
        right: 0;
        padding: 10px 0;
        line-height: 25px;
    }

    .btnSearch {
        width: 200px;
    }

    .picker-width {
        width: 300px;
    }

    .chakan {
        color: #1396c2!important;
        font-size: 13px;
    }
    .table-inlines {
        width: 60px;
        height: 20px;
    }
    .green {
        background-color: rgb(40, 176, 114);
        // cursor: pointer;
        margin-top: 7px;
    }
    .green:hover,
    .green:focus{
        background-color: rgb(82, 202, 148);
    }

    .red {
        background-color: rgb(237, 110, 109);
        // cursor: pointer;
        margin-top: 7px;
    }
    .red:hover,
    .red:focus{
        background-color: rgb(238, 130, 130);  
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
</style>