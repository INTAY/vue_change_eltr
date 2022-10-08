<template>
  <div class="child-content">
    <div class="content">
      <div class="main-content">
        <!-- 数量栏 -->
        <num />

        <!-- 江苏地图 栏 -->
        <map-js />

        <!-- 底部2个图表 -->
        <el-row :gutter="24" class="footer">
          <el-col :span="8" class="iframe">
            <div class="title">
              <i />日充电负荷情况
            </div>
            <use-electric ref="useEch" />
          </el-col>
          <el-col :span="8" class="iframe">
            <div class="title">
              <i />充电量城市排名
            </div>
            <set-electric ref="setEch"/>
          </el-col>
          <el-col :span="8" class="iframe">
            <div class="title">
              <i />充电量站点排名
            </div>
            <div style="clear:both"></div>
            <div id="echartRanking" style="width: 100%;height: 240px"></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
    import num from "./components/num";
    import mapJs from "./components/map";
    import setElectric from "./components/setElectric";
    import useElectric from "./components/useElectric";
    import {
        queryChargStaRankingTop10,
    } from "@/api/operation/home";
    import {
        getOrgById
    } from '@/api/operation/statisticAnalysis'
    export default {
        data() {
            return {
                contentWidth: 220,
                orgId: JSON.parse(sessionStorage.getItem("user")).orgId,
                regionId: '',
                format(percentage) {
                    return percentage = '';
                },
                chargeList: []
            };
        },
        components: {
            num,
            mapJs,
            setElectric,
            useElectric
        },
        mounted() {
            this.getRegId(this.orgId)
            // this.getStationRank(this.orgId)
        },
        methods: {
            getRegId() {
                getOrgById(this.orgId).then(res => {
                    if (res.mesg === '处理成功') {
                        this.regionId = res.data.regionId
                        sessionStorage.setItem("regionId", res.data.regionId)
                        this.getStationRank(this.regionId);
                    }
                })
            },
            getStationRank(param) {
                queryChargStaRankingTop10(param).then(res => {

                    let stationNameList = []
                    let numList = []
                    let maxList = []
                    res.data.forEach((item, index) => {
                        if (index >= 5) {
                            return
                        }
                        stationNameList.push(item.name)
                        numList.push(item.chagEq)
                    });
                    let optionE = {
                        backgroundColor: '#fff',
                        grid: [{
                            width: '65%',
                            left: '4%',
                            top: '10',
                            right: '20',
                            bottom: '0',
                        }],
                        xAxis: [{
                            gridIndex: 0, //x 轴所在的 grid 的索引
                            show: false
                        }],
                        yAxis: [{

                            gridIndex: 0, //y轴所在的 grid 的索引
                            splitLine: 'none',
                            axisTick: 'none',
                            axisLine: 'none',
                            axisLabel: {
                                verticalAlign: 'bottom',
                                align: 'left',
                                padding: [0, 0, 15, 15],
                                textStyle: {
                                    color: '#232323',
                                    fontSize: '14',
                                }
                            },
                            data: stationNameList,
                            inverse: true,
                        }, {
                            //左侧柱状图的Y轴
                            gridIndex: 0, //y轴所在的 grid 的索引
                            splitLine: 'none',
                            axisTick: 'none',
                            axisLine: 'none',
                            data: numList,
                            inverse: true,
                            axisLabel: {
                                show: true,
                                verticalAlign: 'bottom',
                                align: 'right',
                                padding: [0, -110, -10, 0],
                                textStyle: {
                                    color: '#fff',
                                    fontSize: '16',
                                },
                                formatter: function(value) {
                                    return '{x|' + value + '}  {y|' + "kWh}"
                                },
                                rich: {
                                    y: {
                                        color: '#797979',
                                        fontSize: 14
                                    },
                                    x: {
                                        color: '#232323',
                                        fontSize: 14
                                    }
                                }
                            }
                        }, {
                            //左侧柱状图的Y轴
                            gridIndex: 0, //y轴所在的 grid 的索引
                            splitLine: 'none',
                            axisTick: 'none',
                            axisLine: 'none',
                            data: []
                        }, ],
                        series: [{
                                name: '值',
                                type: 'bar',
                                //使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
                                //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
                                data: numList,
                                barWidth: 15,
                                zlevel: 1,
                                itemStyle: {
                                    normal: {
                                        color: '#5582c6',
                                        barBorderRadius: 5,
                                    }
                                },
                                z: 2
                            },
                            {
                                name: '外框',
                                type: 'bar',
                                xAxisIndex: 0, //使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
                                yAxisIndex: 2, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
                                barGap: '-100%',
                                data: [10000, 10000, 10000, 10000, 10000],
                                barWidth: 15,
                                itemStyle: {
                                    normal: {
                                        color: '#e8e8e8',
                                        barBorderRadius: 6,
                                    }
                                },
                                z: 0
                            },
                        ]
                    };
                    let echart = this.$echarts.init(document.getElementById("echartRanking"));
                    echart.setOption(optionE);
                    window.addEventListener("resize", () => {
                        echart.resize();
                    });
                    // }
                })
            },
        }
    };
</script>

<style lang="scss" scoped>
    .child-content {
        position: relative;
        width: 100%;
        height: 100%;
        .left_menu {
            float: left;
            width: 220px;
            height: 100%;
        }
        .content {
            height: 100%;
            box-sizing: border-box;
            overflow-y: auto;
            .main-content {
                width: 100%;
                padding: 10px 50px;
            }
        }
        /*修改滚动条样式*/
        .content::-webkit-scrollbar {
            width: 6px;
            height: 10px;
        }
        .content::-webkit-scrollbar-track {
            background: rgb(239, 239, 239);
            border-radius: 2px;
        }
        .content::-webkit-scrollbar-thumb {
            background: #bfbfbf;
            border-radius: 10px;
        }
        .content::-webkit-scrollbar-thumb:hover {
            background: #333;
        }
        .content::-webkit-scrollbar-corner {
            background: #179a16;
        }
        .station-rank {
            padding: 0 0 0 30px;
        }
        .process-text {
            line-height: 48px;
        }
        .metre {
            color: #797979;
        }
        .metre-text {
            color: #232323;
        }
        .get-more {
            width: 70px;
            line-height: 20px;
            padding: 1px 10px;
            margin-top: 20px;
            margin-right: 15px;
            float: right;
            text-align: center;
            font-size: 12px;
            border: 1px solid #CFE7EB;
            background-color: #F5F8FB;
            color: #97C6CE;
            cursor: pointer;
        }
        .fs-14 {
            font-size: 14px
        }
    }

    .footer {
        height: 300px;
        .iframe {
            height: 300px;
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
    }

    /deep/ .el-progress-bar {
        padding-right: 30px;
    }
</style>
