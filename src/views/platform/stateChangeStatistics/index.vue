<template>
    <div class="changeStatistics">
        <div class="box" style="padding: 15px 0;background: rgb(243,243,243);">
            <el-form label-width="80px" :inline="true" class="box-search">
                <el-form-item label="统计时间">
                    <el-select v-model="selectDate.queryType" placeholder="请选择">
                        <el-option v-for="item in yearsOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-if="selectDate.queryType === '1'" v-model="selectDate.year" :picker-options="pickerOptions0" type="year" key="picker_single"  placeholder="选择年" @change="clearInput"></el-date-picker>
                    <el-date-picker v-if="selectDate.queryType === '2'" v-model="selectDate.year" :picker-options="pickerOptions0" type="year" key="picker_single"  placeholder="选择年"></el-date-picker>
                    <el-select v-if="selectDate.queryType === '2'" v-model="selectDate.quarter" @change="clearInput" placeholder="请选择">
                       <el-option v-for="item in jidu"  :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-date-picker v-if="selectDate.queryType === '3'" v-model="selectDate.month" :picker-options="pickerOptions0" key="picker_single"  type="month" placeholder="选择月" @change="clearInput"></el-date-picker>
                    <el-date-picker v-if="selectDate.queryType === '4'" v-model="selectDate.day" :picker-options="pickerOptions0" key="picker_single"  type="date" placeholder="选择日期" @change="clearInput"></el-date-picker>
                    <el-date-picker v-if="selectDate.queryType === '5'" v-model="selectDate.date5" type="daterange" key="picker_double" :picker-options="pickerOptions0" start-placeholder="开始日期" end-placeholder="结束日期" @change="clearInput"></el-date-picker>
                </el-form-item>
                <el-form-item label="行政区域">
                    <el-select size="mini" class="inputWidth" v-model="selectDate.regId" clearable @change="clearInput">
                        <el-option v-for="item in regionMap" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="范围">
                    <el-input size="mini" placeholder="%" class="inputWidth" style="width: 100px" @change="clearInput" v-model="selectDate.rateBegin" clearable></el-input>
                    <span>&nbsp;-&nbsp;</span>
                    <el-input size="mini" placeholder="%" class="inputWidth" style="width: 100px" @change="clearInput" v-model="selectDate.rateEnd" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" class="newButtonColor btnSpace SearchBTN" @click="getData()">查询</el-button>
                    <el-button size="mini" @click="onEmpty()" class="SearchBTN cancelBTN">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="infoBox generalStyle">
            <div class="noData" v-if="!hasData">
                <img src="../../../assets/image/为空.png" alt />
            </div>
            <div class="message workMessage" v-for="(item,index) in siteMessage" :key="item.stationId" :title="item.stationName" @click="displayDialog(item)">
                <span class="sort-id" v-if="index<10">0{{index+1}}</span>
                <span class="sort-id" v-else>{{index+1}}</span>
                <div style="width: 140px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.stationName}}</div>
                <div class="bottomSTyle">{{item.timelyRate}}</div>
            </div>

            <el-dialog title="详情" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" :modal-append-to-body="false" class="dialogDetail">
                <div style="padding: 0 50px">
                    <!-- 站点信息 -->
                <div class="siteDetailMessage">
                    <div>
                        <span>充电站点:</span>
                        {{this.titleMap.address}}
                    </div>
                    <div class="Dmessage">
                        <div>
                            <span>统计时间:</span>
                            {{this.titleMap.tjTime}}
                        </div>
                        <div>
                            <span>及时订单数:</span>
                            {{this.titleMap.succNum}}
                        </div>
                        <div>
                            <span>不及时订单数:</span>
                            {{this.titleMap.failNum}}
                        </div>
                        <div>
                            <span>及时率</span>
                            {{this.titleMap.rate}}%
                        </div>
                    </div>
                </div>
                <!-- 时间框 -->
                <div>
                    <el-form :inline="true" :model="formTimes" class="demo-form-inline">
                        <el-form-item>
                            <el-date-picker
                                v-model="formTimes.dateTime"
                                type="date"
                                @change="onSearch"
                                :picker-options="pickerOptions"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </div>
                <!-- 枪信息列表 -->
                            <!-- initStatus 这个只有在接口请求通了才会变成true -->
                <div class="Details" v-if="initStatus" >
                    <div v-for="(item,index) in siteItemMessage" :key="item.id">
                        <div  :class="{'Details_name':true,'onClickBGC': item.displate}"  @click="pileDetail(item,index)">{{item.gunName}}</div>
                        <div class="Details_message" v-if="item.displate">
                            <timeLineCharge v-if="initStatus" :time="timeList" :status="statusList" ref="timeLineCharge"/>
                            <!-- 表格 -->
                            <div class="tableData" >
                                <el-table :data="tableData" stripe style="width: 100%;font-size: 14px" :row-style="rowClass">
                                    <el-table-column prop="orderId" label="充电记录订单号" align="center"></el-table-column>
                                    <el-table-column prop="startTimeHm" label="开始时间" align="center"></el-table-column>
                                    <el-table-column prop="endTimeHm" label="结束时间" align="center"></el-table-column>
                                    <el-table-column prop="electy" label="电量（度）" align="center"></el-table-column>
                                    <el-table-column prop="state" label="状态" align="center"></el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import timeLineCharge from './timeLineCharge';
    import {
        statusChangeTimelyRate,
        statusChangeTimelyRateDetail,
        jidu,
        region,
        getOrderListAndState
    } from '@/api/platform/generalOverview';
    import moment from 'moment';

    export default {
        components: {timeLineCharge},
        data() {
            return {
                fromDate: '',
                toDate: '',
                //  让echart在请求接口成功了之后显示
                initStatus: false,
                pickerOptions01: {
                    disabledDate:(time)=> {
                        return time.getTime() <= new Date(this.fromDate).getTime() - 86400000 || time.getTime() >= new Date(this.toDate).getTime()
                    }
                }, 
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的 
                    }
                }, 
                pickerOptions: {},
                hasData: false,
                selectDate: {
                    year: '',
                    month: '',
                    day: this.yesterday,
                    date5: [],
                    quarter: '',
                    queryType: '4',
                    regId: '',
                    rateBegin: '',
                    rateEnd: ''
                },
                regionMap: [],
                orderTypes: [],
                yearsOptions: [
                    {value: '0',label: '请选择'},
                    {value: '1', label: '按年'},
                    {value: '2',label: '按季度'},
                    {value: '3',label: '按月'},
                    {value: '4',label: '按天'},
                    {value: '5',label: '自定义'}
                ],
                inpurParams: {
                    day: '',
                    month: '',
                    quarter: '',
                    queryType: '4',
                    year: '',
                    endDay: '',
                    startDay: '',
                    regId: '',
                    rateBegin: '',
                    rateEnd: ''
                },
                jidu: jidu,
                siteMessage: [],
                dialogVisible: false,
                formTimes: {
                    dateTime: '',
                    startDate: '',
                    endDate: ''
                },
                titleMap: {
                    address: '',
                    tjTime: '',
                    succNum: '',
                    failNum: '',
                    rate: '',
                },
                //桩的信息
                siteItemMessage: [],
                //表格
                tableData: [],
                yesterday: '',
                timelist: [],  //  传给echarts的时间数据
                statuList: [], //  传给echarts的状态数据
            };
        },
        watch:{
            //  判断当前是请选择的时候，让入参变成默认
            'selectDate.queryType'(newVal) {
                if(newVal == '0') {
                    this.inpurParams = {
                        queryType: 0,
                    }
                }
            }
        },
        created() {
            //  
            moment.locale('zh-cn');
            let today = {};
            let _today = moment();
            today.year = _today.format('yyyy'); /*现在的年*/
            today.date = _today.format('YYYY-MM-DD'); /*现在的时间*/
            this.yesterday = _today.subtract(1, 'days').format('YYYY-MM-DD'); /*前一天的时间*/
            this.inpurParams= {
                day: this.yesterday,
                month: '',
                quarter: '',
                queryType: '4',
                year: '',
                endDay: '',
                startDay: ''
            }
            this.getData();
            this.init();
            this.renderRouteSource();
        },
        methods: {
            //  选择范围根据后台返回来定
            getdisabled(startDate, endDate) {
                this.pickerOptions= Object.assign({},this.pickerOptions,{
                    disabledDate(time){
                        return time.getTime() <= new Date(startDate).getTime() - 86400000 || time.getTime() >= new Date(endDate).getTime()
                    }
                })
            },
            minOrmax(param){
                if (param===1) {
                    if(this.selectDate.rateBegin < 0){
                        this.selectDate.rateBegin= ''
                    }else if(this.selectDate.rateBegin > 100){
                        this.selectDate.rateBegin = ''
                    }
                }else {
                    if(this.selectDate.rateEnd < 0){
                        this.selectDate.rateEnd = ''
                    }else if(this.selectDate.rateEnd > 100){
                        this.selectDate.rateEnd = ''
                    }
                }
            },
            rowClass(row, index) {
                if (row.row.state == '不及时') { return {"color": "red"} }
            },
            init() {
                region(sessionStorage.getItem("regId")).then((res) => {
                    if (res.code == '000000') {
                        this.regionMap = res.data;
                    }
                });
            },
            //查询
            getData() {
                this.hasData = false;
                statusChangeTimelyRate(this.inpurParams).then((res) => {
                    if (res.code === '000000') {
                        this.siteMessage = res.data;
                        if (res.data.length > 0) {
                            this.hasData = true;
                        }
                    }
                });
            },
            renderRouteSource() {
                if (Object.keys(this.$route.params).length == 0) return;
                this.$route.params.queryType = this.$route.params.queryType + '';
                if (this.$route.params.queryType == '0')
                    if (this.$route.params.queryType == '1') {
                        this.selectDate = {
                            queryType: this.$route.params.queryType,
                            year: moment(this.$route.params.year).format('YYYY')
                        };
                    } else if (this.$route.params.queryType == '2') {
                    this.selectDate = {
                        quarter: this.$route.params.quarter,
                        year: moment(this.$route.params.year).format('YYYY'),
                        queryType: this.$route.params.queryType
                    };
                } else if (this.$route.params.queryType == '3') {
                    this.selectDate = {
                        month: moment(this.$route.params.month).format('YYYY-MM'),
                        queryType: this.$route.params.queryType
                    };
                } else if (this.$route.params.queryType == '4') {
                    this.selectDate = {
                        day: moment(this.$route.params.day).format('YYYY-MM-DD'),
                        queryType: this.$route.params.queryType
                    };
                } else if (this.$route.params.queryType == '0') {
                    this.selectDate = {
                        queryType: this.$route.params.queryType
                    };
                } else {
                    this.selectDate = {
                        queryType: this.$route.params.queryType,
                        date5: [
                            moment(this.$route.params.date5[1]).format('YYYY-MM-DD'),
                            moment(this.$route.params.date5[0]).format('YYYY-MM-DD')
                        ]
                    };
                }
            },
            //清空
            onEmpty() {
                this.selectDate = {
                    year: '',
                    month: '',
                    day: '',
                    date5: [],
                    quarter: '',
                    queryType: '0',
                    stakeNo1: '',
                    stakeNo: '',
                    reg: ''
                };
                this.inpurParams = {
                    year: '',
                    month: '',
                    day: '',
                    date5: [],
                    quarter: '',
                    queryType: '0',
                    regId: '',
                    rateBegin: '',
                    rateEnd: ''
                }
            },
            displayDialog(item) {
                this.titleMap.address = item.stationName;
                this.titleMap.rate = item.rate;
                this.inpurParams.stationId = item.stationId
                statusChangeTimelyRateDetail(this.inpurParams).then((res) => {
                    if (res.code == '000000') {
                        this.initStatus = true
                        this.formTimes.dateTime = res.data.startTime

                        this.formTimes.fromDate = res.data.startTime
                        this.formTimes.toDate = res.data.endTime
                        this.getdisabled(res.data.startTime, res.data.endTime)

                        this.titleMap.succNum = res.data.succNum
                        this.titleMap.failNum = res.data.failNum
                        this.titleMap.tjTime = res.data.tjTime

                        this.siteItemMessage = res.data.gunInfoList
                        //  第一个展开，其余的合拢
                        this.siteItemMessage.forEach((item,index) => {
                            if (index === 0) {
                                item.displate = true
                            }else {
                                item.displate = false
                            }
                        });

                        //  时间
                        if(res.data.gunInfoList && res.data.gunInfoList.length > 0) {
                            this.timeList = res.data.gunInfoList[0].timeList
                        }
                        this.statusList = []
                        if(res.data.gunInfoList && res.data.gunInfoList.length > 0) {
                            this.statusList = res.data.gunInfoList[0].statusList
                        }
                        if(res.data.gunInfoList && res.data.gunInfoList.length > 0) {
                            this.tableData = res.data.gunInfoList[0].chargeList
                        }

                    }
                });
                this.dialogVisible = true;
            },
            handleClose() {
                this.dialogVisible = false;
                this.formTimes.dateTime = ''

                // 清除图标的数据
                this.initStatus = false
            },
            onSearch() {
                let params = {
                    queryTime: moment(this.formTimes.dateTime).format('YYYY-MM-DD'),
                    stationId: this.inpurParams.stationId
                }
                getOrderListAndState(params).then(res => {
                    if (res.code == '000000') {
                        this.initStatus = true
                        this.siteItemMessage = res.data.gunInfoList
                        this.siteItemMessage.forEach((item,index) => {
                            if (index == 0) {
                                item.displate = true
                            }else {
                                item.displate = false
                            }
                        });

                        //  时间
                        if(res.data.gunInfoList && res.data.gunInfoList.length > 0) {
                            this.timeList = res.data.gunInfoList[0].timeList
                        }
                        this.statusList = []
                        if(res.data.gunInfoList && res.data.gunInfoList.length > 0) {
                            this.statusList = res.data.gunInfoList[0].statusList
                        }
                        if(res.data.gunInfoList && res.data.gunInfoList.length > 0) {
                            this.tableData = res.data.gunInfoList[0].chargeList
                        }
                    }
                })
            },
            //清空时间插件
            onReset(val) {
                this.formTimes.dateTime = ''
            },
            pileDetail(item, i) {
                this.siteItemMessage.forEach((ele, index) => {
                    if (i == index) {
                        ele.displate = !ele.displate;
                    } else {
                        ele.displate = false;
                    }
                    //  强制更新视图
                    this.$forceUpdate()
                });
            },
            clearInput(e) {
                this.inpurParams = {};
                if (this.selectDate.queryType == '1') {
                    this.inpurParams = {
                        queryType: this.selectDate.queryType,
                        year: moment(this.selectDate.year).format('YYYY'),
                        regId: this.selectDate.regId,
                        rateBegin: this.selectDate.rateBegin,
                        rateEnd: this.selectDate.rateEnd
                    };
                } else if (this.selectDate.queryType == '2') {
                    this.inpurParams = {
                        quarter: this.selectDate.quarter,
                        year: moment(this.selectDate.year).format('YYYY'),
                        queryType: this.selectDate.queryType,
                        regId: this.selectDate.regId,
                        rateBegin: this.selectDate.rateBegin,
                        rateEnd: this.selectDate.rateEnd
                    };
                } else if (this.selectDate.queryType == '3') {
                    this.inpurParams = {
                        month: moment(this.selectDate.month).format('YYYY-MM'),
                        queryType: this.selectDate.queryType,
                        regId: this.selectDate.regId,
                        rateBegin: this.selectDate.rateBegin,
                        rateEnd: this.selectDate.rateEnd
                    };
                } else if (this.selectDate.queryType == '4') {
                    this.inpurParams = {
                        day: moment(this.selectDate.day).format('YYYY-MM-DD'),
                        queryType: this.selectDate.queryType,
                        regId: this.selectDate.regId,
                        rateBegin: this.selectDate.rateBegin,
                        rateEnd: this.selectDate.rateEnd
                    };
                } else if (this.selectDate.queryType == '0') {
                    this.inpurParams = {
                        queryType: 0,
                        regId: this.selectDate.regId,
                        rateBegin: this.selectDate.rateBegin,
                        rateEnd: this.selectDate.rateEnd
                    };
                } else {
                    this.inpurParams = {
                        queryType: this.selectDate.queryType,
                        endDay: moment(this.selectDate.date5[1]).format('YYYY-MM-DD'),
                        startDay: moment(this.selectDate.date5[0]).format('YYYY-MM-DD'),
                        regId: this.selectDate.regId,
                        rateBegin: this.selectDate.rateBegin,
                        rateEnd: this.selectDate.rateEnd
                    };
                }
            },
        },
        beforeCreate() {
            moment.locale('zh-cn');
            let today = {};
            let _today = moment();
            today.year = _today.format('yyyy'); /*现在的年*/
            today.date = _today.format('YYYY-MM-DD'); /*现在的时间*/
            this.yesterday = _today.subtract(1, 'days').format('YYYY-MM-DD'); /*前一天的时间*/
        }
    };
</script>

<style lang="scss" scoped>
    .changeStatistics {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        .topSelect {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 62px;
            border-bottom: 1px solid #eee;
            .pickerStyle {
                width: 120px;
                margin-right: 15px;
            }
            .checkDate {
                width: 280px;
            }
            .selectOptions {
                width: 150px;
            }
        }
        .noData {
            width: 100%;
            height: 100%;
            img {
                width: 300px;
                margin-left: calc(50% - 150px);
                margin-top: calc(15% - 150px);
            }
        }
        .infoBox {
            display: flex;
            align-content: flex-start;
            flex-wrap: wrap;
            flex: 1;
            padding-top: 25px;
            .message {
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 279px;
                height: 96px;
                margin: 0 37px 41px 0;
                font-size: 14px;
                color: #7c7f7f;
                border-radius: 10px;
                background-image: url('../../../../static/img/hlht/006.png');
                background-position: 100% 100%;
                background-repeat: no-repeat;
                cursor: pointer;
                .bottomSTyle {
                    margin-top: 12px;
                    font-size: 24px;
                    font-weight: 600;
                    color: #1396c2;
                }
                .sort-id {
                    position: absolute;
                    left: 10px;
                    top: 5px;
                    color: white;
                    font-size: 16px;
                    font-weight: 600;
                }
            }
            .workMessage {
                border: 1px solid #cbe2e6;
                background-color: rgba(239, 248, 249, 0.5);
            }
            .faultMessage {
                border: 1px solid #e6cbcb;
                background-color: rgba(249, 239, 239, 0.5);
                background-image: url('../../../../static/img/hlht/005.png');
            }
        }
        .generalStyle {
            padding-left: 28px;
        }
        .el-form-item {
            margin-bottom: 0px;
            height: 28px;
            .el-radio {
                margin-right: 8px;
            }
        }
        .el-button {
            padding: 8px 18px;
        }
        .siteDetailMessage {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 60px;
            padding-left: 20px;
            font-size: 14px;
            margin-bottom: 12px;
            border: 1px solid #F0F0F0;
            border-radius: 3px;
            background-color: #FCFCFC;
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
        .Details {
            margin-top: 25px;
            .Details_name {
                width: 100%;
                height: 34px;
                padding-left: 18px;
                margin-top: 10px;
                line-height: 34px;
                font-size: 14px;
                color: #232323;
                border: 1px solid #c5e0e5;
                background-color: #F0F0F0;
                border-radius: 5px;
                cursor: pointer;
                background-image: url('../../../../static/img/UP.png');
                background-position: 100% 100%;
                background-repeat: no-repeat;
            }
            .onClickBGC {
                background-color: #F2FAFC;
                background-image: url('../../../../static/img/deepUP.png');
            }
            .Details_message {
                margin-top: 5px;
                padding: 8px 20px 5px 15px;
                border: 1px solid #f0f0f0;
                border-radius: 5px;
                background-color: #fcfcfc;
                .timesline {
                    // display: flex;
                    align-items: center;
                    padding: 12px 0 25px 0;
                    height: 112px;
                    border-bottom: 1px solid #dcdcdc; //主轴时间线
                    overflow-x: scroll;
                    /*添加横向滚动条*/
                    white-space: nowrap;
                    /*不换行*/
                    .mainLine {
                        position: relative;
                        width: 50px;
                        height: 3px;
                        background-color: #dbdbdb;
                        display: inline-block;
                        .iconRect {
                            position: absolute;
                            left: 15px;
                            top: -13px;
                            width: 28px;
                            height: 28px;
                            background-image: url('../../../../static/img/timeIcon.png');
                        }
                        .iconRect-error {
                            position: absolute;
                            left: 15px;
                            top: -13px;
                            width: 28px;
                            height: 28px;
                            background-image: url('../../../../static/img/icon(1).png');
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
                }
            }
        }
    }
</style>