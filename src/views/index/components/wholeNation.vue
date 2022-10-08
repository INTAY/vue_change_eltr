<template>
  <div class="echart" ref="wholeNationMap"></div>
</template>

<script>
import {
  queryRegionalFaultStatistics
} from "@/api/operation/statisticAnalysis";
import echarts from "echarts";
export default {
  data() {
    return {
      myEchart: null,
      option: {
        title: {
            // text: '全国行政区划3D地图',
            x: 'center',
            top: "20",
            textStyle: {
                color: '#000',
                fontSize: 24
            }
        },
        tooltip: {
            show: true,

        },
        geo3D: {
            map: 'china',
            roam: true,
            itemStyle: {
                areaColor: '#FFB400',
                opacity: 1,
                borderWidth: 1,
                borderColor: '#FFB400'
            },
            label: {
                show: false,
                formatter: function(value) {
                    return '{img|}' + value.name + '11';
                },
                textStyle: {
                    color: '#fff', //地图初始化区域字体颜色
                    fontSize: 16,
                    opacity: 0.8,
                    backgroundColor: '#7F7F7F',
                    rich: {
                        img: {
                            padding: [0, 5],
                            backgroundColor: {
                                image: ''
                            }
                        }
                    }

                },
            },

            light: { //光照阴影
                main: {
                    color: '#fff', //光照颜色
                    intensity: 1.2, //光照强度
                    shadow: true, //是否显示阴影
                    alpha: 35,
                    beta: 10

                },
                ambient: {
                    intensity: 0.3
                }
            },

        },

    }
    };
  },
  props: [],
  mounted() {
    this.orgId = JSON.parse(sessionStorage.getItem("user")).orgId;
    //  获取区域id
    this.getData(this.orgId);
  },
  destroyed() {},
  methods: {
    getData(param) {
      queryRegionalFaultStatistics(param).then(res => {

        this.myEchart = this.$echarts.init(this.$refs.wholeNationMap);
        this.myEchart.setOption(this.option);
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.echart {
  width: 100%;
  height: 500px;
}
</style>
