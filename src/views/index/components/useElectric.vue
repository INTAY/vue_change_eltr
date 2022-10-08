<template>
  <div class="echart" ref="useNum" id="useNum"></div>
</template>

<script>
    import echarts from 'echarts'
    import {
        chargingLoadDay
    } from "@/api/operation/home";
    import {
        getOrgById
    } from '@/api/operation/statisticAnalysis'
    export default {
        data() {
            return {
                myEchart: null,
                timer: '',
                orgId: JSON.parse(sessionStorage.getItem("user")).orgId,
                regionId: '',
            };
        },
        props: [],
        mounted() {
            window.onresize = () => {
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.myEchart = this.$echarts.init(document.getElementById('useNum'));
                    this.myEchart.resize();
                }, 300)
            };
            this.getRegId(this.orgId)
        },
        destroyed() {},
        methods: {
            getRegId() {
                getOrgById(this.orgId).then(res => {
                    if (res.mesg === '处理成功') {
                        this.regionId = res.data.regionId
                        this.init(this.regionId);
                    }
                })
            },
            init(param) {
                chargingLoadDay(param).then(res => {
                    var option = {

                        color: ['#5582c6'],
                        legend: {
                            icon: 'rect',
                            top: '20%',
                            right: 40,
                            data: ['日充电负荷'],
                            itemWidth: 13,
                            itemHeight: 13
                        },
                        grid: {
                            top: '30%',
                            left: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: res.data.hour,
                            name: '(小时)',
                            nameTextStyle: {
                                color: '#707070',
                                fontSize: 12,
                                align: 'left'
                            },
                            axisTick: {
                                show: false,
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#d8d8d8'
                                }
                            },
                            axisLabel: {
                                interval: 0,
                                formatter: '{value}',
                                textStyle: { //改变刻度字体样式
                                    color: '#636363',
                                    fontSize: 14
                                }
                            },
                        },
                        yAxis: {
                            type: 'value',
                            splitLine: {
                                show: false
                            },
                            scale: true,
                            splitArea: {
                                show: true,
                                interval: 2
                            },
                            name: '(kWh)',
                            nameTextStyle: {
                                color: '#707070',
                                fontSize: 12,
                                align: 'center'
                            },
                            axisTick: {
                                show: false,
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#d8d8d8'
                                }
                            },
                            axisLabel: {
                                interval: 0,
                                formatter: '{value}',
                                textStyle: { //改变刻度字体样式
                                    color: '#636363',
                                    fontSize: 14
                                }
                            },
                        },
                        series: [{
                            name: '日充电负荷',
                            data: res.data.fh,
                            type: 'line',
                            lineStyle: {
                                color: '#5582c6'
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1, [{
                                                offset: 0,
                                                color: '#7096cf'
                                            },
                                            {
                                                offset: 1,
                                                color: '#ccd7e7'
                                            }
                                        ])
                                }
                            }
                        }]
                    };

                    this.myEchart = this.$echarts.init(this.$refs.useNum);
                    this.myEchart.setOption(option);
                    window.addEventListener("resize", () => {
                        this.myEchart.resize();
                    });
                })

            }
        }
    };
</script>

<style lang="scss" scoped>
    .echart {
        width: 100%;
        height: 100%;
    }
</style>
