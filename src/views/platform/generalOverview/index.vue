<template>
  <div class="box">
    <el-form label-width="80px" :inline="true" class="box-search">
      <el-form-item label="统计时间">
        <el-select v-model="selectDate.queryType" placeholder="请选择">
          <el-option v-for="(item,index) in yearsOptions" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <span v-if="selectDate.queryType === '0'"></span>
        <el-date-picker v-if="selectDate.queryType === '1'" :picker-options="pickerOptions01" v-model="selectDate.year"  type="year" key="picker_single"  placeholder="选择年"  @change="clearInput"></el-date-picker>
        <el-date-picker v-if="selectDate.queryType === '2'" :picker-options="pickerOptions01" v-model="selectDate.year"  type="year" key="picker_single"  placeholder="选择年"></el-date-picker>
        <el-select v-if="selectDate.queryType === '2'" v-model="selectDate.quarter" @change="clearInput" placeholder="请选择">
          <el-option v-for="item in jidu" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-date-picker v-if="selectDate.queryType === '3'" :picker-options="pickerOptions01" v-model="selectDate.month" key="picker_single"  type="month"  placeholder="选择月"  @change="clearInput"></el-date-picker>
        <el-date-picker v-if="selectDate.queryType === '4'" :picker-options="pickerOptions01" v-model="selectDate.day" key="picker_single"  type="date"  placeholder="选择日期"  @change="clearInput"></el-date-picker>
        <el-date-picker v-if="selectDate.queryType === '5'" :picker-options="pickerOptions01" key="picker_double" v-model="selectDate.date5" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"  @change="clearInput"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" class="newButtonColor btnSpace SearchBTN" @click="getData()">查询</el-button>
        <el-button size="mini" @click="empty()" class="SearchBTN cancelBTN">清空</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-row class="footer">
          <el-col :span="8" class="iframe border-r">
              <div class="title">
                <i />订单初筛情况
              </div>
              <order-choose ref="orderChoose"></order-choose>
          </el-col>
          <el-col :span="8" class="iframe border-r">
            <div class="title">
              <i />订单推送情况
            </div>
            <order-push ref="orderPush"></order-push>
          </el-col>
          <el-col :span="8" class="iframe border-r">
            <div class="title">
              <i />状态推送情况
            </div>
            <status-push ref="statusPush"></status-push>
          </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="12" class="iframe  border-r">
            <div class="title">
              <i />状态变化推送及时率
            </div>
            <status-change-push ref="statusChangePush"></status-change-push>
        </el-col>
        <el-col :span="12" class="iframe  border-r">
          <div class="title">
              <i />状态固定推送及时率
          </div>
          <status-rate ref="statusRate"></status-rate>
        </el-col>
      </el-row>
    </div>

  </div>
</template>
<script>
    import orderPush from "./component/orderPush"; // 引入季度时间组件
    import statusPush from "./component/statusPush"; // 引入季度时间组件
    import statusRate from "./component/statusRate"; // 引入季度时间组件
    import statusChangePush from "./component/statusChangePush"; // 引入季度时间组件
    import orderChoose from "./component/orderChoose"; // 引入季度时间组件
    import {
        overall,
        jidu
    } from "@/api/platform/generalOverview";
    import moment from "moment";

    export default {
        data() {
            return {
                scrollTarget: null,
                scrollCallback: null,
                pickerOptions01: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();//如果没有后面的-8.64e7就是不可以选择今天的 
                    }
                }, 
                regId: sessionStorage.getItem('regionId'),
                statisticsData: {},
                yesterday: '',
                selectDate: {
                    year: '',
                    month: '',
                    day: this.yesterday,
                    date5: [],
                    quarter: '',
                    queryType: '4'
                },
                yearsOptions: [
                    {
                        value: '0',
                        label: '请选择'
                    },
                    {
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
                    }
                ],
                inpurParams: {
                    day: '',
                    month: '',
                    quarter: '',
                    queryType: '4',
                    year: '',
                    endDay: '',
                    startDay: ''
                },
                jidu: jidu
            };
        },
        components: {
            orderPush,
            statusPush,
            statusRate,
            statusChangePush,
            orderChoose
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
            this.getData()
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
        methods: {
            empty() {
                this.selectDate = {
                    year: '',
                    month: '',
                    day: '',
                    date5: [],
                    quarter: '',
                    queryType: '0'
                }
                this.inpurParams = {
                    year: '',
                    month: '',
                    day: '',
                    date5: [],
                    quarter: '',
                    queryType: '0'
                }
            },
            clearInput() {
                //  清空之前已选条件
                this.inpurParams = {}
                
                if (this.selectDate.queryType == '1') {
                    this.inpurParams = {
                        queryType: this.selectDate.queryType,
                        year: moment(this.selectDate.year).format('YYYY'),
                    }
                } else if (this.selectDate.queryType == '2') {
                    this.inpurParams = {
                        quarter: this.selectDate.quarter,
                        year: moment(this.selectDate.year).format('YYYY'),
                        queryType: this.selectDate.queryType,
                    }
                } else if (this.selectDate.queryType == '3') {
                    this.inpurParams = {
                        month: moment(this.selectDate.month).format('YYYY-MM'),
                        queryType: this.selectDate.queryType,
                    }
                } else if (this.selectDate.queryType == '4') {
                    this.inpurParams = {
                        day: moment(this.selectDate.day).format('YYYY-MM-DD'),
                        queryType: this.selectDate.queryType,
                    }
                } else if (this.selectDate.queryType == '5') {
                    this.inpurParams = {
                        queryType: this.selectDate.queryType,
                        endDay: moment(this.selectDate.date5[1]).format('YYYY-MM-DD'),
                        startDay: moment(this.selectDate.date5[0]).format('YYYY-MM-DD')
                    }
                }else{
                    this.inpurParams = {
                        queryType: 0,
                    }
                } 
            },
            getData() {
                overall(this.inpurParams).then(res => {
                    if (res.code === '000000') {
                        //  如果返回不是空在赋值这四个，不然未定义
                        if (Object.keys(res.data).length > 0) {
                            this.$refs.orderChoose.total = res.data.orderRecTotal;
                            this.$refs.orderPush.total = res.data.orderRecTotal;
                            this.$refs.statusPush.total = res.data.statePushTotal;
                            this.$refs.statusChangePush.total = res.data.orderScreenSucc;
                            this.$refs.statusRate.total = res.data.statusFixPush;
                        }else {
                            this.$refs.orderChoose.total = ''
                            this.$refs.orderPush.total = ''
                            this.$refs.statusPush.total = ''
                            this.$refs.statusChangePush.total = ''
                            this.$refs.statusRate.total = ''
                        }
                        //  初筛
                        
                        this.$refs.orderChoose.sourceMap = [];
                        this.$refs.orderChoose.sourceMap.push({
                            value: res.data.orderScreenSucc,
                            name: '初筛成功'
                        }, {
                            value: res.data.orderScreenFail,
                            name: '初筛失败'
                        });
                        this.$refs.orderChoose.init()
                        //  订单
                        this.$refs.orderPush.sourceMap = [];
                        this.$refs.orderPush.sourceMap.push({
                            value: res.data.orderPushSucc,
                            name: '推送成功'
                        }, {
                            value: res.data.orderPushFail,
                            name: '推送失败'
                        }, {
                            value: res.data.orderRePushSucc,
                            name: '补推成功'
                        });
                        this.$refs.orderPush.init()
                        //  状态推送
                        this.$refs.statusPush.sourceMap = [];
                        this.$refs.statusPush.sourceMap.push({
                            value: res.data.statePushSucc,
                            name: '推送成功'
                        }, {
                            value: res.data.statePushFail,
                            name: '推送失败'
                        });
                        this.$refs.statusPush.init()
                        //  状态变化推送及时率
                        this.$refs.statusChangePush.sourceMap = [];
                        this.$refs.statusChangePush.sourceMap.push({
                            value: res.data.changeTimely,
                            name: '状态变化推送及时'
                        }, {
                            value: res.data.changeNotTimely,
                            name: '状态变化推送不及时'
                        });
                        this.$refs.statusChangePush.init()
                        //  状态固定推送及时率
                        this.$refs.statusRate.sourceMap = [];
                        this.$refs.statusRate.sourceMap.push({
                            value: res.data.statusFixTimely,
                            name: '状态固定推送及时'
                        }, {
                            value: res.data.statusFixNotTimely,
                            name: '状态固定推送不及时'
                        });
                        this.$refs.statusRate.init()
                    }
                })
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
    }
</script>
<style lang="scss" scoped>
    .box {
        width: 100%;
        height: calc(100% - 45px);
        box-sizing: border-box;
        .box-search {
            width: 100%;
            height: 60px;
            background: #f3f3f3;
            padding-top: 12px;
        }
        .left {
            width: 100%;
            height: 90px;
            border-bottom: 1px solid #cdd9e7;
            padding: 0 16px;
            li {
                position: relative;
                width: calc(100%/5);
            }
        }
        span {
            font-size: 22px;
            color: #333;
            margin-right: 6px;
            font-weight: 600;
        }
        ul {
            list-style: none;
            margin: 0;
            padding: 0;
            li {
                float: left;
                height: 90px;
                text-align: center;
                padding-top: 20px;
                font-size: 12px;
                color: #999;
                line-height: 24px;
            }
        }
        .line {
            height: 50px;
            width: 2px;
            border-left: 2px solid rgb(238, 238, 238);
            float: right;
        }
        img {
            height: 50px;
        }
        .footer {
            border-bottom: 1px solid #cdd9e7;
        }
        .iframe {
            height: 400px;
            flex: 33%;
            .title {
                float: left;
                margin: 20px;
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
        }
        .border-r {
            border-right: 1px solid #cdd9e7;
        }
    }
</style>