<template>
    <div id="echart2" ref="echart2"></div>
</template>

<script>
import jsjson from './jiangsu.json';

import { numberToCurrency } from '../../../utils/filters/numberToCurrency';
import { queryChargStaRankingTop10, queryMapData } from '@/api/operation/home';
import { getOrgById } from '@/api/operation/statisticAnalysis';
export default {
    props: {
        cityValue: Number
    },
    filters: {
        numberToCurrency
    },
    data() {
        return {
            timer: '',
            regionId: '',
            orgId: JSON.parse(sessionStorage.getItem('user')).orgId,
            resultCity: [],
            option: {},
            symbolMap: [],
            changeData: [],
            city: [
                {
                    name: '南京市',
                    value: [80, '56162', 111]
                },
                {
                    name: '苏州市',
                    value: [123, '56162', 111]
                },
                {
                    name: '徐州市',
                    value: [60, '56162', 111]
                },
                {
                    name: '连云港市',
                    value: [123, '56162', 1112]
                },
                {
                    name: '宿迁市',
                    value: [123, '33330', 1115]
                },
                {
                    name: '淮安市',
                    value: [40, '112232', 111]
                },
                {
                    name: '盐城市',
                    value: [900, 1111, 111]
                },
                {
                    name: '常州市',
                    value: [100, 1111, 11111]
                },
                {
                    name: '泰州市',
                    value: [15, 2233, 1111]
                },
                {
                    name: '无锡市',
                    value: [123, '8894', 1111]
                },
                {
                    name: '扬州市',
                    value: [400, '432423', 111]
                },
                {
                    name: '南通市',
                    value: [0, '32321', 111]
                },
                {
                    name: '镇江市',
                    value: [9999, '22222', 111]
                }
            ]
        };
    },
    created() {
        this.getRegId(this.orgId);
    },
    mounted() {
        window.onresize = () => {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.myEchart = this.$echarts.init(document.getElementById('echart2'));
                this.myEchart.resize();
            }, 300);
        };
    },
    methods: {
        //  获取区域id
        getRegId(param) {
            getOrgById(param).then(res => {
                if (res.mesg === '处理成功') {
                    this.regionId = res.data.regionId;
                    //调用获取地图接口
                    this.getMapDatas(this.regionId);
                }
            });
        },
        getMapDatas(param) {
            this.option = [];
            queryMapData(param).then(res => {
                if (res.code === '000000') {
                    this.resultCity = res.data;
                    if (this.resultCity.length > 0) {
                        this.renderJSMap();
                    }
                }
            });
        },
        //  渲染地图
        renderJSMap() {
            let echart = this.$echarts.init(this.$refs.echart2);
            var geoCoordMap = {
                南京市: [118.767413, 32.041544],
                无锡市: [120.301663, 31.574729],
                徐州市: [117.684811, 34.261792],
                常州市: [119.946973, 31.772752],
                苏州市: [120.619585, 31.199379],
                淮安市: [119.021265, 33.397506],
                宿迁市: [118.493328, 33.645154],
                南通市: [120.977608, 32.216212],
                盐城市: [120.139998, 33.377631],
                扬州市: [119.421003, 32.693159],
                镇江市: [119.452753, 32.064402],
                泰州市: [119.915176, 32.484882],
                连云港市: [119.178821, 34.600018]
            };

            for (let i in this.resultCity) {
                this.changeData.push({
                    name: this.resultCity[i].name,
                    value: this.resultCity[i].value
                });
            }

            let Mdata = function(data) {
                let res = [];
                for (let i = 0; i < data.length; i++) {
                    let geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)
                        });
                    }
                }

                return res;
            };

            this.$echarts.registerMap('江苏', jsjson);
            let scale = 1;
            let rich = {
                blue: {
                    color: '#49dff0',
                    fontSize: 16 * scale,
                    align: 'center'
                },
                black: {
                    color: '#000000',
                    fontSize: 16 * scale,
                    align: 'center'
                },
                black2: {
                    color: '#000000',
                    fontSize: 14 * scale,
                    align: 'center'
                },
                gray: {
                    color: '#808080',
                    fontSize: 14 * scale,
                    align: 'center'
                },
                hr: {
                    borderColor: '#CDCDCD',
                    width: '100%',
                    borderWidth: 1,
                    height: 0
                }
            };
            this.option = {
                color: ['#d5e6fb'],
                tooltip: {
                    formatter: function(args) {
                        let custumerHtml = '';
                        custumerHtml = `
                                  <div style="display: inline-block;text-align: right;width: 120px;padding-right: 10px;">充电桩</div>
                                  <span style="color: #1FD5E9;fonst-size:18px;font-weight:800;">${numberToCurrency(
                                      args.value[2]
                                  )}</span> 台</br>
                                  <div style="display: inline-block;text-align: right;width: 120px;padding-right: 10px;">充电设施总功率</div>
                                  <span style="color: #1FD5E9;fonst-size:18px;font-weight:800;">${numberToCurrency(
                                      args.value[3]
                                  )}</span> kW</br>
                                  <div style="display: inline-block;text-align: right;width: 120px;padding-right: 10px;">储能装机容量</div>
                                  <span style="color: #1FD5E9;fonst-size:18px;font-weight:800;">${numberToCurrency(
                                      args.value[4]
                                  )}</span> kW</br>
                                `;
                        return custumerHtml;
                    },
                    rich: rich
                },
                backgroundColor: '#fff',
                visualMap: {
                    show: true,
                    min: 0,
                    orient: 'horizontal',
                    max: 1000,
                    itemWidth: 7,
                    itemHeight: 180,
                    inRange: {
                        color: ['#ffd0a7', '#bb5800']
                    },

                    type: 'continuous',
                    calculable: true
                },
                geo3D: {
                    map: '江苏',
                    roam: true,
                    itemStyle: {
                        color: '#d5e6fb',
                        // areaColor: '#489AFF',
                        opacity: 1,
                        borderWidth: 1,
                        borderColor: '#FAFAD2'
                    },
                    label: {
                        show: false,
                        textStyle: {
                            color: '#282828', //地图初始化区域字体颜色
                            fontSize: 12,
                            opacity: 1,
                            backgroundColor: 'rgba(0,23,11,0)'
                        }
                    },
                    emphasis: {
                        //当鼠标放上去  地区区域是否显示名称
                        label: {
                            show: false,
                            textStyle: {
                                color: '#fff',
                                fontSize: 3,
                                backgroundColor: 'rgba(0,23,11,0)'
                            }
                        }
                    },
                    shading: 'color',
                    light: {
                        //光照阴影
                        main: {
                            color: '#fff', //光照颜色
                            intensity: 1.2, //光照强度
                            shadow: false, //是否显示阴影
                            alpha: 55,
                            beta: 10
                        },
                        ambient: {
                            intensity: 0.3
                        }
                    }
                },
                series: [
                    {
                        name: 'bar3D',
                        type: 'bar3D',
                        coordinateSystem: 'geo3D',
                        barSize: 3, //柱子粗细
                        opacity: 1,
                        bevelSize: 0,
                        label: {
                            show: true,
                            formatter: '{b}'
                        },
                        data: Mdata(this.changeData)
                    }
                ]
            };
            echart.setOption(this.option);
            window.addEventListener('resize', () => {
                echart.resize();
            });
        }
    }
};
</script>

<style lang="scss" scoped>
#echart2 {
    width: 100%;
    height: calc(100% - 30px);
}
</style>
