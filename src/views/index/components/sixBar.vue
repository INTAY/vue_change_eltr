<template>
  <div class="echart" id="sixBar"></div>
</template>

<script>
    import {
        usesProportion,
        usageDistribution,
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
                regionId: ''
            };
        },
        mounted() {
            this.getRegId(this.orgId)

            window.onresize = () => {
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.myEchart = this.$echarts.init(document.getElementById('sixBar'));
                    this.myEchart.resize();
                }, 300)
            };
        },
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
                let scale = 1
                let rich = {
                    blue: {
                        color: '#49dff0',
                        fontSize: 16 * scale,
                        align: 'center'
                    },
                    black: {
                        color: '#434343',
                        fontSize: 16 * scale,
                        align: 'center',
                    },
                    black2: {
                        color: '#434343',
                        fontSize: 16 * scale,
                        align: 'center'
                    },
                    gray: {
                        color: '#929292',
                        fontSize: 14 * scale,
                        align: 'center',
                    },
                    hr: {
                        borderColor: '#CDCDCD',
                        width: '100%',
                        borderWidth: 1,
                        height: 0
                    }
                }
                let m2R2Data = [];
                usesProportion(param).then(res => {
                    if (res.code === '000000') {
                        m2R2Data = res.data

                        var option = {
                            title: [{
                                subtext: '电动汽车类型\n占比',
                                subtextStyle: {
                                    width: '20px',
                                    fontSize: 16,
                                    color: '#191919',
                                    lineHeight: 26
                                },
                                textAlign: "center",
                                x: '48%',
                                y: '37%',
                            }],
                            series: [{
                                name: '用途占比',
                                type: 'pie',
                                center: ['47%', '47%'],
                                radius: ['47%', '62%'],
                                right: 20,
                                left: 30,
                                hoverAnimation: true,
                                color: ['#2CC7CA', '#8FB6EF', '#B6A3DF', '#59B3F0', '#6f81da', '#FEB881', '#D7CEEE', '#E88889', '#8E98B3', '#E4CE0C'],
                                emphasis: {
                                    label: {    
                                        show: true,
                                        fontSize: '15',
                                        fontWeight: 'bold',
                                        color: "#00ffb4"                    
                                    }  
                                },
                                label: {
                                    normal: {
                                        formatter: function(parms) {
                                            var total = 0;
                                            var percent = 0;
                                            m2R2Data.forEach(item => {
                                                total += Number(item.value)
                                            });
                                            percent = ((Number(parms.data.value) / total) * 100).toFixed(1);
                                            return '{black|' + percent + '%}' + '  ' + '{black2|(' + parms.data.value + ')}' + '\n' + '{gray|' + parms.data.legendane + '}';
                                        },
                                        rich: rich
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        length: 20,
                                        length2: 30,
                                        lineStyle: {
                                            color: '#CDCDCD'
                                        }
                                    }
                                },
                                data: m2R2Data
                            }]
                        };
                        this.myEchart = this.$echarts.init(document.getElementById('sixBar'));
                        this.myEchart.setOption(option);
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
        height: 100%;
        padding: 0;
    }
</style>
