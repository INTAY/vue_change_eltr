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
          <el-date-picker v-if="selectDate.queryType === '1'" :picker-options="pickerOptions0" v-model="selectDate.year"  type="year"  key="picker_single" placeholder="选择年"  @change="clearInput"></el-date-picker>
          <el-date-picker v-if="selectDate.queryType === '2'" :picker-options="pickerOptions0" v-model="selectDate.year"  type="year"  key="picker_single" placeholder="选择年"></el-date-picker>
          <el-select v-if="selectDate.queryType === '2'" v-model="selectDate.quarter" @change="clearInput" placeholder="请选择">
            <el-option v-for="item in jidu" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-date-picker v-if="selectDate.queryType === '3'" :picker-options="pickerOptions0" v-model="selectDate.month"  type="month"  key="picker_single" placeholder="选择月"  @change="clearInput"></el-date-picker>
          <el-date-picker v-if="selectDate.queryType === '4'" :picker-options="pickerOptions0" v-model="selectDate.day"  type="date"  key="picker_single" placeholder="选择日期"  @change="clearInput"></el-date-picker>
          <el-date-picker v-if="selectDate.queryType === '5'" :picker-options="pickerOptions0" v-model="selectDate.date5" type="daterange" key="picker_double" start-placeholder="开始日期" end-placeholder="结束日期"  @change="clearInput"></el-date-picker>
        </el-form-item>
        <el-form-item label="行政区域">
            <el-select size="mini" class="inputWidth" v-model="selectDate.regId" clearable @change="clearInput">
                <el-option v-for="item in regionMap" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="范围">
            <el-input size="mini" placeholder="%" class="inputWidth" style="width: 100px" v-model="selectDate.rateBegin" @change="clearInput" clearable></el-input>
            <span>&nbsp;-&nbsp;</span>
            <el-input size="mini" placeholder="%" class="inputWidth" style="width: 100px" v-model="selectDate.rateEnd" @change="clearInput" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" class="newButtonColor btnSpace SearchBTN" @click="getData()">查询</el-button>
          <el-button size="mini" @click="onEmpty()" class="SearchBTN cancelBTN">清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="infoBox generalStyle">
        <div class="noData" v-if="!hasData"><img src="../../../assets/image/为空.png" alt=""></div>
        <div class="message workMessage" v-for="(item,index) in siteMessage" :key="item.stationId"  @click="displayDialog(item)">
            <span class="sort-id" v-if="index<10">0{{index+1}}</span>
            <span class="sort-id" v-else>{{index+1}}</span>
            <div style="width: 140px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.stationName}}</div>
            <div class="bottomSTyle">{{item.timelyRate}}</div>
        </div>

      <el-dialog title="详情" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" :modal-append-to-body="false" class="dialogDetail">
        <!-- 站点信息 -->
        <div class="siteDetailMessage">
          <el-row>
            <el-col :span="9">
              <span>充电站点:</span>{{this.titleMap.address}}
            </el-col>
            <el-col :span="9">
                <span>统计时间:</span>{{this.titleMap.tjTime}}
            </el-col>
            <el-col :span="6">
                <span>接收频次(近24h):</span> {{this.titleMap.receiveAvg}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9">
                <span>状态固定推送及时率:</span> {{this.titleMap.rate}}%
            </el-col>
            <!-- <el-col :span="8">
                <span>日均三小时固定推送状态次数:</span> {{this.titleMap.abnormalOrders}}次
            </el-col> -->
            <el-col :span="9">
                <span>推送成功率:</span> {{this.titleMap.pushSuccRate}}
            </el-col>
          </el-row>
        </div>
        <!-- 时间框 -->
        <div>
          <el-form :inline="true" :model="formTimes" class="demo-form-inline">
            <el-form-item>
                <el-date-picker v-model="formTimes.dateTime" :picker-options="pickerOptions" type="date" placeholder="选择日期" @change="onSearch"></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <!-- 枪信息列表 -->
        <div class="Details">
          <div v-for="(item,index) in siteItemMessage" :key="index">
              <el-row class="Details_name">
                  <el-col :span="12">{{item.gunName}}</el-col>
                  <el-col :span="12" style="text-align: right;padding-right:20px;">
                      <span style="font-size:14px;color: #333333;">日均3小时固定推送状态次数&nbsp;</span>{{item.fixTimelyNum}}
                  </el-col>
              </el-row>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    import charge from "../../../components/graph/lineChart";
    import {
        statusFixTimelyRate,
        statusFixTimelyRateDetail,
        jidu,
        region,
        getFixTimelyNum
    } from "@/api/platform/generalOverview";
    import moment from "moment";

    export default {
        components: {
            charge
        },
        data() {
            return {
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的 
                    }
                },  
                pickerOptions: {},
                hasData: false,
                jidu: jidu,
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
                yearsOptions: [{
                    value: '0',
                    label: '请选择'
                }, {
                    value: '1',
                    label: '按年'
                }, {
                    value: '2',
                    label: '按季度'
                }, {
                    value: '3',
                    label: '按月'
                }, {
                    value: '4',
                    label: '按天'
                }, {
                    value: '5',
                    label: '自定义'
                }],
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
                form: {
                    region: "",
                    yearData: "",
                    month: "",
                    datTime: "",
                    timeData: 1,
                },
                titleMap: {
                    address: '',
                    rate: '',
                    receiveAvg: '',
                    pushSuccRate: '',
                    tjTime: '',
                },
                siteMessage: [],
                dialogVisible: false,
                formTimes: {
                    dateTime: ""
                },
                //桩的信息
                siteItemMessage: [],
                //时间线
                timeLine: [],
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
            this.init()
            this.getData()
            this.renderRouteSource()
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
            init() {
                region(sessionStorage.getItem("regId")).then(res => {
                    if (res.code == '000000') {
                        this.regionMap = res.data
                    }
                })
            },
            //查询
            getData() {
                this.hasData = false
                statusFixTimelyRate(this.inpurParams).then(res => {
                    if (res.code === '000000') {
                        this.siteMessage = res.data
                        if (res.data.length > 0) {
                            this.hasData = true
                        }
                    }
                })
            },
            renderRouteSource() {
                if (Object.keys(this.$route.params).length == 0) return
                this.$route.params.queryType = this.$route.params.queryType + ''
                if (this.$route.params.queryType == '1') {
                    this.selectDate = {
                        queryType: this.$route.params.queryType,
                        year: moment(this.$route.params.year).format('YYYY'),
                    }
                } else if (this.$route.params.queryType == '2') {
                    this.selectDate = {
                        quarter: this.$route.params.quarter,
                        year: moment(this.$route.params.year).format('YYYY'),
                        queryType: this.$route.params.queryType,
                    }
                } else if (this.$route.params.queryType == '3') {
                    this.selectDate = {
                        month: moment(this.$route.params.month).format('YYYY-MM'),
                        queryType: this.$route.params.queryType,
                    }
                } else if (this.$route.params.queryType == '4') {
                    this.selectDate = {
                        day: moment(this.$route.params.day).format('YYYY-MM-DD'),
                        queryType: this.$route.params.queryType,
                    }
                } else if (this.$route.params.queryType == 0) {
                    this.selectDate = {
                        queryType:  this.$route.params.queryType,

                    }
                } else {
                    this.selectDate = {
                        queryType: this.$route.params.queryType,
                        date5: [moment(this.$route.params.date5[1]).format('YYYY-MM-DD'), moment(this.$route.params.date5[0]).format('YYYY-MM-DD')]
                    }
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
                    stakeNo: ''
                }
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
                statusFixTimelyRateDetail(this.inpurParams).then((res) => {
                    if(res.code == '000000') {
                        this.getdisabled(res.data.startTime, res.data.endTime)
                        this.formTimes.dateTime = res.data.startTime
                        this.titleMap.receiveAvg = res.data.receiveAvg
                        this.titleMap.pushSuccRate = res.data.pushSuccRate
                        this.titleMap.tjTime = res.data.tjTime

                        this.siteItemMessage = res.data.gunFixTimelyList

                    }
                });
                this.dialogVisible = true;
            },
            handleClose() {
                this.dialogVisible = false;
                this.formTimes.dateTime = ''
            },
            onSearch() {
                let params = {
                    queryTime: moment(this.formTimes.dateTime).format('YYYY-MM-DD'),
                    stationId: this.inpurParams.stationId
                }
                this.siteItemMessage = []
                getFixTimelyNum(params).then(res => {
                    if(res.code == '000000') {
                        this.siteItemMessage = res.data.gunFixTimelyList
                    }
                })
            },
            //清空时间插件
            onReset(val) {
                this.inpurParams = {}
            },
            clearInput() {
                this.inpurParams = {}
                if (this.selectDate.queryType == '1') {
                    this.inpurParams = {
                        queryType: this.selectDate.queryType,
                        year: moment(this.selectDate.year).format('YYYY'),
                        regId: this.selectDate.regId,
                        rateBegin: this.selectDate.rateBegin,
                        rateEnd: this.selectDate.rateEnd
                    }
                } else if (this.selectDate.queryType == '2') {
                    this.inpurParams = {
                        quarter: this.selectDate.quarter,
                        year: moment(this.selectDate.year).format('YYYY'),
                        queryType: this.selectDate.queryType,
                        regId: this.selectDate.regId,
                        rateBegin: this.selectDate.rateBegin,
                        rateEnd: this.selectDate.rateEnd
                    }
                } else if (this.selectDate.queryType == '3') {
                    this.inpurParams = {
                        month: moment(this.selectDate.month).format('YYYY-MM'),
                        queryType: this.selectDate.queryType,
                        regId: this.selectDate.regId,
                        rateBegin: this.selectDate.rateBegin,
                        rateEnd: this.selectDate.rateEnd
                    }
                } else if (this.selectDate.queryType == '4') {
                    this.inpurParams = {
                        day: moment(this.selectDate.day).format('YYYY-MM-DD'),
                        queryType: this.selectDate.queryType,
                        regId: this.selectDate.regId,
                        rateBegin: this.selectDate.rateBegin,
                        rateEnd: this.selectDate.rateEnd
                    }
                } else if (this.selectDate.queryType == '0') {
                    this.inpurParams = {
                        queryType: 0,
                        regId: this.selectDate.regId,
                        rateBegin: this.selectDate.rateBegin,
                        rateEnd: this.selectDate.rateEnd
                    }
                } else {
                    this.inpurParams = {
                        queryType: this.selectDate.queryType,
                        endDay: moment(this.selectDate.date5[1]).format('YYYY-MM-DD'),
                        startDay: moment(this.selectDate.date5[0]).format('YYYY-MM-DD'),
                        regId: this.selectDate.regId,
                        rateBegin: this.selectDate.rateBegin,
                        rateEnd: this.selectDate.rateEnd
                    }
                }
            }
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
            border: 1px solid #C3E2ED;
            background-color: #EBF3F6;
            border-radius: 5px;
            // background-image: url('../../../../static/img/UP.png');
            background-position: 100% 100%;
            background-repeat: no-repeat;
            .numText {
                color: #2C7994;
                font-size: 16px;
                font-weight: 600;
            }
        }
        
        .onClickBGC {
            background-color: rgba(238, 247, 248, 0.5);
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
                overflow-x: scroll; /*添加横向滚动条*/
                white-space: nowrap;/*不换行*/
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