<template>
    <div class="all">
        <el-row :gutter="24">
            <el-col :span="8" class="iframe line">
                <!-- <div class="sign"></div> -->
                <div class="title">
                    <i />全省充电桩分布情况
                </div>
                <div style="clear: both"></div>
                <!-- <whole-nation/> -->
                <jiang-su />
            </el-col>
            <el-col :span="8" class="iframe line">
                <el-row style="height: 270px;width:100%;" class="bor-bot-line">
                    <el-col :span="24">
                        <div class="title">
                            <i />近12个月充电情况
                        </div>
                        <div style="clear: both"></div>
                        <div
                            ref="historyCharge"
                            id="historyCharge"
                            style="height: 270px;width: 100%"
                        ></div>
                    </el-col>
                </el-row>
                <el-row style="height: 270px" :gutter="24" class="footer">
                    <!-- 占比图 -->
                    <six-bar />
                </el-row>
            </el-col>
            <el-col :span="8" class="iframe">
                <el-row style="height: 150px" class="bor-bot-line">
                    <div class="title">
                        <i /> 电动汽车类型占比
                    </div>
                    <el-row>
                        <el-col :span="12" class="byCar-rate">
                            <div>
                                {{this.info.cyc}}
                                <span class="precent">&nbsp;%</span>
                            </div>
                            <span class="spc-color">乘用车</span>
                            <span class="use-pre">占比</span>
                        </el-col>
                        <el-col :span="12" class="buessiness-rate">
                            <div>
                                {{this.info.swc}}
                                <span class="precent">&nbsp;%</span>
                            </div>
                            <span class="spc-color">商务车</span>
                            <span class="use-pre">占比</span>
                        </el-col>
                    </el-row>
                </el-row>
                <el-row class="footer mrg-t-20">
                    <div class="title">
                        <i />【充电数量】/【充电功率】按用途分布情况
                    </div>
                    <div ref="chargeNum" id="chargeNum" style="height: 340px;width: 100%;"></div>
                    <!-- 充电数量 -->
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import echarts from 'echarts';
import jiangSu from './jiangsu.vue';
import wholeNation from './wholeNation';
import sixBar from './sixBar';
import { getAssetInfo, monthChargePower, usageDistribution } from '@/api/operation/home';
import { getOrgById } from '@/api/operation/statisticAnalysis';
export default {
    data() {
        return {
            timer: '',
            orgId: JSON.parse(sessionStorage.getItem('user')).orgId,
            info: {},
            regionId: ''
        };
    },
    components: {
        jiangSu,
        sixBar,
        wholeNation
    },
    props: [],
    mounted() {
        window.onresize = () => {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.myEchart = this.$echarts.init(document.getElementById('historyCharge'));
                this.myEcharts = this.$echarts.init(document.getElementById('chargeNum'));
                this.myEchart.resize();
                this.myEcharts.resize();
            }, 300);
        };
        this.getRegId(this.orgId);
    },
    methods: {
        getRegId() {
            getOrgById(this.orgId).then(res => {
                if (res.mesg === '处理成功') {
                    this.regionId = res.data.regionId;
                    this.initHistoryCharge(this.regionId);
                    this.initRadar(this.regionId);
                    this.getInfo(this.regionId);
                }
            });
        },
        getInfo(param) {
            getAssetInfo(param).then(res => {
                if (res.code === '000000') {
                    this.info = res.data;
                }
            });
        },
        initHistoryCharge(param) {
            monthChargePower(param).then(res => {
                var option = {
                    color: ['#5582c6', '#f8c093'],
                    legend: {
                        data: ['充电量', '充电次数'],
                        right: '8%',
                        top: '3%',
                        icon: 'rect',
                        itemWidth: 13,
                        itemHeight: 13
                    },
                    grid: {
                        top: '16%',
                        left: '6%',
                        right: '3%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: res.data.month,
                            boundaryGap: true,
                            name: '(月)',
                            nameTextStyle: {
                                color: '#707070',
                                fontSize: 12,
                                padding: [30, 0, 0, 0]
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#d8d8d8'
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                interval: 0,
                                formatter: '{value}',
                                textStyle: {
                                    //改变刻度字体样式
                                    color: '#636363'
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '(kWh)',
                            nameTextStyle: {
                                color: '#707070',
                                fontSize: 14,
                                align: 'center'
                            },
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                interval: 0,
                                formatter: '{value}',
                                textStyle: {
                                    //改变刻度字体样式
                                    color: '#636363',
                                    fontSize: 14
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#d8d8d8'
                                }
                            },
                            axisTick: {
                                show: false
                            }
                        },
                        {
                            type: 'value',
   
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                interval: 0
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#d8d8d8'
                                }
                            },
                            axisLabel: {
                                interval: 0,
                                formatter: '{value}',
                                textStyle: {
                                    //改变刻度字体样式
                                    color: '#636363',
                                    fontSize: 14
                                }
                            },
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    series: [
                        {
                            name: '充电量',
                            type: 'bar',
                            data: res.data.histogram,
                            barWidth: 14, //柱子宽度
                            itemStyle: {
                                normal: {
                                    barBorderRadius: [3, 3, 0, 0]
                                }
                            }
                        },
                        {
                            name: '充电次数',
                            type: 'line',
                            data: res.data.line,
                            barWidth: 14, //柱子宽度
                            yAxisIndex: 1,
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        {
                                            offset: 0,
                                            color: '#f8c093'
                                        },
                                        {
                                            offset: 0.5,
                                            color: '#F9D4B6'
                                        },
                                        {
                                            offset: 1,
                                            color: '#fce8d8'
                                        }
                                    ])
                                }
                            }
                        }
                    ]
                };
                let historyCharge = this.$echarts.init(this.$refs.historyCharge);
                historyCharge.setOption(option);
                window.addEventListener('resize', () => {
                    historyCharge.resize();
                });
            });
        },
        initRadar(param) {
            usageDistribution(param).then(res => {
                if (res.code === '000000') {
                    let circleText = [];
                    for (let i in res.data.yt) {
                        circleText.push({
                            text: res.data.yt[i]
                        });
                    }
                    let option = {
                        color: ['#E98888', '#5582c6'],
                        legend: {
                            data: ['充电数量', '充电功率'],
                            top: '10',
                            itemHeight: 15,
                            itemWidth: 15
                        },
                        radar: [
                            {
                                indicator: circleText,
                                center: ['50%', '50%'],
                                radius: 100,
    
                                shape: 'circle',
                                name: {
                                    formatter: '【{value}】',
                                    textStyle: {
                                        fontSize: 14,
                                        color: '#232323'
                                    }
                                },
                                splitArea: {
                                    areaStyle: {
                                        color: [
                                            'rgba(251, 251, 251, 1)',
                                            'rgba(234, 234, 234, 1)',
                                            'rgba(251, 251, 251, 1)',
                                            'rgba(234, 234, 234, 1)',
                                            'rgba(251, 251, 251, 1)'
                                        ],
                                        shadowColor: 'rgba(224, 224, 224, 1)',
                                        shadowBlur: 10
                                    }
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: 'rgba(217, 217, 217, 1)'
                                    }
                                }
                            }
                        ],
                        series: [
                            {
                                name: '雷达图',
                                type: 'radar',
                                emphasis: {
                                    lineStyle: {
                                        width: 4
                                    }
                                },
                                data: [
                                    {
                                        value: res.data.sl,
                                        name: '充电数量',
                                        symbol: 'rect',
                                        symbolSize: 0,
                                        lineStyle: {
                                            type: 'solid',
                                            color: 'rgba(233,136,136, 0.5)',
                                            width: 2
                                        }
                                    },
                                    {
                                        value: res.data.gl,
                                        name: '充电功率',
                                        symbolSize: 0,
                                        areaStyle: {
                                            type: 'solid',
                                            color: 'rgba(85,130,198, 0.2)',
                                            width: 1
                                        },
                                        lineStyle: {
                                            type: 'solid',
                                            color: '#5582c6',
                                            width: 1
                                        }
                                    }
                                ]
                            }
                        ]
                    };
                    let chargeNum = this.$echarts.init(this.$refs.chargeNum);
                    chargeNum.setOption(option);
                    window.addEventListener('resize', () => {
                        chargeNum.resize();
                    });
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.all {
    width: 100%;
    height: 540px;
    margin-top: 20px;
    border-bottom: 1px solid #e2e2e2;
    .mrg-t-20 {
        margin-top: 20px;
    }
    .iframe {
        position: relative;
        height: 540px;
        .sign {
            position: absolute;
            top: 3px;
            left: 25px;
            width: 4px;
            height: 15px;
            background-color: #24b3ca;
            border-radius: 6px;
        }
    }
    .title {
        padding-left: 20px;
        i {
            width: 4px;
            height: 14px;
            display: inline-block;
            background: #24b3ca;
            margin-right: 10px;
            margin-top: 3px;
            border-radius: 5px;
        }
    }
    .spc-color {
        color: #1d94d2;
        font-size: 14px;
        cursor: pointer;
    }
    .use-pre {
        font-size: 14px;
        color: #7e7e7e;
    }
    .byCar-rate {
        text-align: center;
        margin-top: 30px;
        border-right: 1px solid #e2e2e2;
        line-height: 30px;
        div {
            font-size: 30px;
            color: #d08484;
            font-weight: 600;
        }
    }
    .precent {
        font-size: 16px;
        color: #232323;
    }
    .buessiness-rate {
        text-align: center;
        margin-top: 30px;
        line-height: 30px;
        div {
            font-size: 30px;
            color: #3c6ebf;
            font-weight: 600;
        }
    }
    .line {
        border-right: 1px solid #e2e2e2;
    }
    .bor-bot-line {
        border-bottom: 1px solid #e2e2e2;
    }
}

.footer {
    height: 540px;
    .bar {
        height: 270px;
        width: 228px;
        padding: 0;
    }
}
</style>
