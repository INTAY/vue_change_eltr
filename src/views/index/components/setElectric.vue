<template>
  <div class="echart" ref="setNum" id="setNum"></div>
</template>

<script>
    import {
        queryChargRankingTop10
    } from "@/api/operation/home";
    import {
        getOrgById
    } from '@/api/operation/statisticAnalysis'
    export default {
        data() {
            return {
                isShow: true,
                timer: '',
                myEchart: null,
                orgId: JSON.parse(sessionStorage.getItem("user")).orgId,
                regionId: ''
            };
        },
        props: [],
        mounted() {
            window.onresize = () => {
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.myEchart = this.$echarts.init(document.getElementById('setNum'));
                    this.myEchart.resize();
                }, 300)
            };
            this.getRegId()

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
                queryChargRankingTop10(param).then(res => {
                    if (res.code === '000000') {
                        let xLine = []
                        let numList = []
                        res.data.forEach(item => {
                            xLine.push(item.name)
                            numList.push(item.chagEq)
                        });

                        let option = {
                            legend: {
                                data: ["充电量"],
                                itemWidth: 13,
                                itemHeight: 13,
                                right: 0
                            },
                            grid: {
                                top: "40",
                                left: "3%",
                                right: "1%",
                                bottom: "0",
                                containLabel: true
                            },
                            tooltip: {
                                trigger: "axis",
                                axisPointer: {
                                    type: "shadow"
                                }
                            },
                            color: ["#5582c6", "#e98888"],
                            xAxis: {
                                type: "category",
                                data: xLine,
                                axisLabel: {
                                    interval: 0, //代表显示所有x轴标签显示
                                    show: true
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
                                        fontSize: 12
                                    }
                                },
                            },
                            yAxis: [
                                // 双y坐标轴
                                {
                                    name: "(kWh)",
                                    nameTextStyle: {
                                        color: '#707070',
                                        fontSize: 12,
                                        align: 'center'
                                    },
                                    type: "value",
                                    splitLine: {
                                        show: false
                                    },
                                    axisLabel: {
                                        formatter: "{value}"
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
                                }
                            ],
                            series: [{
                                type: "bar",
                                name: '充电量',
                                barWidth: 14, //柱子宽度
                                itemStyle: {
                                    normal: {
                                        barBorderRadius: [10, 10, 0, 0],
                                        color: function(params) {
                                            var colorList = [
                                                '#e98888', '#e98888', '#e98888', '#5582c6', '#5582c6',
                                                '#5582c6', '#5582c6', '#5582c6', '#5582c6', '#5582c6',
                                                '#7AA1DA', '#5582c6', '#5582c6', '#5582c6', '#5582c6'
                                            ];

                                            return colorList[params.dataIndex]

                                        },
                                    }
                                },
                                data: numList
                            }]
                        };

                        this.myEchart = this.$echarts.init(this.$refs.setNum);
                        this.myEchart.setOption(option, true);
                        window.addEventListener("resize", () => {
                            this.myEchart.resize();
                        });
                    }
                })

            }
        }
    };
</script>

<style lang="scss" scoped>
    .echart {
        width: 100%;
        height: calc(100% - 60px);
        margin-top: 46px; // pointer-events: none;
    }
</style>
