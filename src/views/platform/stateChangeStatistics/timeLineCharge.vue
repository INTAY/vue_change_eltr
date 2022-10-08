<template>
  <div id="lineMore">
    <div class="echarts" ref="charge"></div>
  </div>
</template>

<script>
    import echarts from "echarts";
    export default {
        props: {
            time: Array,
            status: Array,
        },
        data() {
            return {
                myEchart: null,
                lineData: [], //  折线图数据
                sourceData: [],
            };
        },
        watch: {
            time: {
                handler(newName, oldName) {
                    this.init();
                }
            },
            status: {
                handler(newName, oldName) {
                    this.init();
                }
            },
        },
        mounted() {
            this.init();
            
        },
        methods: {
            init() {
                //  组织折线图的数据
                let resultTimeMap = []
                //  找出最大的功率值
                let maxCharge = ''
                //  功率盒子
                let chargeList = []
                this.time.forEach(item => {
                    resultTimeMap.push({
                        name: new Date(item.time),
                        value: [item.time, item.value]
                    })
                    chargeList.push(item.value)
                });
                chargeList.sort(function (a, b) {
                    return a-b;
                });
                //  得出最大值 * 10%
                maxCharge = chargeList[chargeList.length - 1] * 0.1 +chargeList[chargeList.length - 1]

                //  整十的倍数
                const formatInt = (num, prec = 2, ceil = true) => {
                const len = String(num).length;
                if (len <= prec) { return num }; 

                const mult = Math.pow(10, prec);
                return ceil ? 
                    Math.ceil(num / mult) * mult : 
                    Math.floor(num / mult) * mult;
                } 
                //  end

                //  处理状态数据
                let map1=[], map2=[],  map4=[], map5=[], map6=[], map7=[]
                this.status.forEach(item => {
                    switch (item.status) {
                        case '充满':
                            map1.push({value: [item.time, -20]})
                            break;
                        case '故障':
                            map2.push({value: [item.time, -20]})
                            break;
                        case '工作':
                            map4.push({value: [item.time, -20]})
                            break;
                        case '待机':
                            map5.push({value: [item.time, -20]})
                            break;
                        case '离线':
                            map6.push({value: [item.time, -20]})
                            break;
                        case '充电暂停':
                            map7.push({value: [item.time, -20]})
                            break;
                        default:
                            break;
                    }
                });
                
                //  图表
                let option = {
                    color: ["#33a5cb", "#0c572c", "#e31111", "#0ea2e7", "#70e8a3", "#a3a3a3", "#d19800"],
                    tooltip: {
                        trigger: 'axis',
                        formatter: function(params) {
                            params = params[0];
                            if(params.seriesName == "功率曲线") {
                                return params.value[0] + '</br>' + params.value[1] +'(kW)' + " - "+ params.seriesName;
                            }else {
                                var date = new Date(params.name);
                                return params.value[0] + ' : ' + params.seriesName;
                            }
                            
                        },
                        axisPointer: {
                            animation: false
                        }
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        },
                        name: '时间'
                    },
                    grid:{
                        left:'8%',
                        right:'8%',
                        bottom:'15%',
                        containLabel:true
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: false
                        },
                        min: -20,
                        max: formatInt(Math.round(maxCharge), 1, true), //  计算出的最大值,在四舍五入
                        name: '功率(kW)'
                    },
                    dataZoom: [{
                        show: true,
                        height:20,
                        bottom:10,
                        start: 0,
                        end: 100,
                        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                        handleSize: '110%',
                        textStyle:{color:"#333"}, 
                            borderColor:"#90979c",
                        }, 
                        { type: "inside"}
                    ],
                    legend: {
                        data: ['功率曲线','充满', '故障', '空闲','工作','待机','离线','充电暂停'],
                        left: 'center'
                    },
                    series: []
                };
                option.series = []
                option.series.unshift({
                    name: '功率曲线',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: resultTimeMap,
                })
                option.series.push({ name: '充满', type: 'scatter', data: map1})
                option.series.push({ name: '故障', type: 'scatter', data: map2})
                option.series.push({ name: '工作', type: 'scatter', data: map4})
                option.series.push({ name: '待机', type: 'scatter', data: map5})
                option.series.push({ name: '离线', type: 'scatter', data: map6})
                option.series.push({ name: '充电暂停', type: 'scatter', data: map7})
                this.myEchart = this.$echarts.init(this.$refs.charge);
                this.myEchart.setOption(option);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .echarts {
        width: 100%;
        height: 300px;
    }
</style>