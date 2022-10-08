<template>
    <div class="echart" ref="statusPush" id="statusPush"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    data() {
        return {
            myEchart: null,
            timer: '',
            regId: sessionStorage.getItem('regionId'),
            total: '',
            sourceMap: [],
            standSize: document.body.clientWidth
        };
    },
    mounted() {
        window.onresize = () => {
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.myEchart = this.$echarts.init(document.getElementById('statusPush'));
                    this.myEchart.resize();
                }, 300)
            };
        this.getData();
    },
    methods: {
        getData() {
            this.init();
        },
        init() {
            let color = ['#8CB5E1', '#E88889', '#C7AA06'];

            let option = {
                color: color,
                title: {
                    text: '{name|' + '状态推送总数' + '}\n{val|' + this.total + '}',
                    top: '42%',
                    x: 'center',
                    textStyle: {
                        rich: {
                            name: {
                                fontSize: 18,
                                color: '#7a7a7a',
                                fontWeight: 'normal'
                            },
                            val: {
                                fontSize: 26,
                                fontWeight: 'bold',
                                padding: [10, 32],
                                color: '#333333'
                            }
                        }
                    }
                },
                legend: {
                        itemHeight: 5,
                        itemWidth: 24,
                        orient: 'vertical',
                        right: "5%",
                        textStyle: {
                            color: '#90979c',
                        },
                        data: ['推送成功', '推送失败'],
                    },
                tooltip: {
                    trigger: 'item'
                },
                series: [
                    {
                        type: 'pie',
                        center: ['50%', '50%'],
                        radius: ['45%', '57%'],
                        clockwise: true,
                        avoidLabelOverlap: true,
                        hoverOffset: 15,
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    return color[params.dataIndex];
                                }
                            }
                        },
                        label: {
                            normal: {
                                formatter: (params) => {
                                   if(params.percent == 0) {
                                        return '{jump|' + params.percent.toFixed(0) + '%' + '  (' + params.value + ')}' + '\n{hr|}\n' + '{font| ' + params.name + '}  '
                                    }else {
                                        return '{jump|' + params.percent.toFixed(2) + '%' + '  (' + params.value + ')}' + '\n{hr|}\n' + '{font| ' + params.name + '}  '
                                    }
                                },
                                rich: {
                                    jump: {
                                        color: '#7791CA',
                                        fontSize: 14
                                    },
                                    black: {
                                        color: 'black'
                                    },
                                    font: {
                                        fontSize: 14,
                                        padding: [2, 0],
                                        color: '#999'
                                    },
                                    hr: {
                                        height: 0,
                                        borderWidth: 1,
                                        width: '100%',
                                        borderColor: '#7791CA'
                                    }
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                length: this.standSize / 99.9,
                                length2: this.standSize / 100,
                                lineStyle: {
                                    width: 1
                                }
                            }
                        },
                        data: this.sourceMap
                    }
                ]
            };

            this.myEchart = this.$echarts.init(this.$refs.statusPush);
            this.myEchart.setOption(option);
            let that = this;
            this.myEchart.on('click', 'series.pie.label', function (val) {
                if (val.name == '推送失败') {
                    that.$parent.$parent.$parent.inpurParams.result = 0;
                    that.$router.push({
                        name: 'platform/statusTransmission',
                        params: that.$parent.$parent.$parent.inpurParams
                    });
                } else {
                    that.$parent.$parent.$parent.inpurParams.result = 1;
                    that.$router.push({
                        name: 'platform/statusTransmission',
                        params: that.$parent.$parent.$parent.inpurParams
                    });
                }
            });
            window.addEventListener("resize", () => {
                this.myEchart.resize();
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.echart {
    width: 90%;
    height: 100%;
    padding: 40px 10px 10px 0;
    box-sizing: border-box;
}
</style>
