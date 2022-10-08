<template>
    <div class="defaultStyle" :id="id"></div>
    <!-- 
      备注: 1.必传属性:id,opData,lineWidth,lineColor,xAxisData
            2.一般属性都有默认值,如果有特殊需求的可以根据props里的属性进行调整
            3.堆叠统计的属性没有添加，
            4.引用时只需要 (import charge from "../../components/graph/lineChart")引入折线图的路径，components:{charge}里注册
            5.<charge
                id="realCharge"
                style="height:300px;width:690px;"
                :lineTitle="title"
                :titleposition="positionTitle"
                :legendData="dataLegend"
                :xAxisData="dataX"
                :yAxisRightName="yRightName"
                :yAxisLeftName="yLeftName"
                :opData="opDiskData"
                :lineColor="colorLines"
                :axisLabelY ="Y_axisLabel"
              />  把想用的属性绑定就行了。
     -->
</template>

<script>
import { lineDatas } from "../../utils/lineCharts"; 
export default {
  props: {
    id: String, //折线图id
    // -------------标题 ----------------
    lineTitle: String, //标题,
    titleposition: String, //标题位置
    titleColor: String, //标题颜色
    titleFontSize: Number, //标题的大小
    titleFontFamily: String, //标题的字体
    // -------------图例-----------------
    legendShow: Boolean, //图例是否显示
    legendPostionX: String, //图例在X轴方向上的的位置
    legendPostionTop: String, //图例在距离顶部的的位置
    legendPostionY: String, //图例在X轴方向上的的位置
    legendIcon: String, //图例的形状
    iconWidth: Number, //图例的长度
    iconHeight: Number, //图例的宽度
    iconGap: Number, //图例各项之间的距离
    legendColor: String, //文字的颜色
    legendFontSize: Number, //文字的大小
    legendData: Array, //图例的数据
    //-----------------------grid -----------------
    gridLeft: String, //右边
    gridRight: String, //左边
    gridTop: String, //上边
    gridBottom: String, //下边
    gridcontainLabel: Boolean,
    // -------------------xAxis yAxis--------------
    fontSizeAxisLabel: String, //X,Y轴刻度状态
    axisLineColor: String, //X,Y轴是否显示
    splitLineAxis: Boolean, //X轴网格线
    splitLineAxisY: Boolean, //Y轴网格线
    splitLineAxisColor: String, //X轴网格线颜色
    splitLineAxisColorY: String, //Y轴网格线颜色
    xAxisData: Array, //X轴刻度
    yAxisRightName: String, //Y轴左边单位
    yAxisLeftName: String, //Y轴右边的单位
    YaxisLabelRightFormatter: String, //Y轴的坐标刻度的样式
    YaxisLabelLeftFormatter: String, //Y轴的坐标刻度的样式
    axisLabelY: Boolean, //右侧Y轴的坐标刻度是否显示
    secondY: Boolean, //右侧Y轴的是否显示
    //-----------------series----------------------
    opData: Array, //图形数据组
    symbolShape: String, //节点形状
    symbolSize: Array, //节点大小
    lineWidth: Array, //折线宽度
    lineColor:Array,//折线的颜色
    areaColor: Array, //折线区域的颜色
    xType:String, //X轴的名称
  },
  mounted() {
    this.init();
  },
  //监听变化
  watch: {
    lineTitle: {
      handler(newName, oldName) {
        this.init();
      }
    },
    titleposition: {
      handler(newName, oldName) {
        this.init();
      }
    },
    titleColor: {
      handler(newName, oldName) {
        this.init();
      }
    },
    titleFontSize: {
      handler(newName, oldName) {
        this.init();
      }
    },
    titleFontFamily: {
      handler(newName, oldName) {
        this.init();
      }
    },
    legendShow: {
      handler(newName, oldName) {
        this.init();
      }
    },
    legendPostionX: {
      handler(newName, oldName) {
        this.init();
      }
    },
    legendPostionTop: {
      handler(newName, oldName) {
        this.init();
      }
    },
    legendPostionY: {
      handler(newName, oldName) {
        this.init();
      }
    },
    legendIcon: {
      handler(newName, oldName) {
        this.init();
      }
    },
    iconWidth: {
      handler(newName, oldName) {
        this.init();
      }
    },
    iconHeight: {
      handler(newName, oldName) {
        this.init();
      }
    },
    iconGap: {
      handler(newName, oldName) {
        this.init();
      }
    },
    legendColor: {
      handler(newName, oldName) {
        this.init();
      }
    },
    legendFontSize: {
      handler(newName, oldName) {
        this.init();
      }
    },
    legendData: {
      handler(newName, oldName) {
        this.init();
      }
    },
    gridLeft: {
      handler(newName, oldName) {
        this.init();
      }
    },
    gridRight: {
      handler(newName, oldName) {
        this.init();
      }
    },
    gridTop: {
      handler(newName, oldName) {
        this.init();
      }
    },
    gridBottom: {
      handler(newName, oldName) {
        this.init();
      }
    },
    gridcontainLabel: {
      handler(newName, oldName) {
        this.init();
      }
    },
    fontSizeAxisLabel: {
      handler(newName, oldName) {
        this.init();
      }
    },
    axisLineColor: {
      handler(newName, oldName) {
        this.init();
      }
    },
    splitLineAxis: {
      handler(newName, oldName) {
        this.init();
      }
    },
    splitLineAxisY: {
      handler(newName, oldName) {
        this.init();
      }
    },
    splitLineAxisColor: {
      handler(newName, oldName) {
        this.init();
      }
    },
    splitLineAxisColorY: {
      handler(newName, oldName) {
        this.init();
      }
    },
    xAxisData: {
      handler(newName, oldName) {
        this.init();
      }
    },
    yAxisRightName: {
      handler(newName, oldName) {
        this.init();
      }
    },
    yAxisLeftName: {
      handler(newName, oldName) {
        this.init();
      }
    },
    YaxisLabelRightFormatter: {
      handler(newName, oldName) {
        this.init();
      }
    },
    YaxisLabelLeftFormatter: {
      handler(newName, oldName) {
        this.init();
      }
    },
    axisLabelY: {
      handler(newName, oldName) {
        this.init();
      }
    },
    opData: {
      handler(newName, oldName) {
        this.init();
      }
    },
    symbolShape: {
      handler(newName, oldName) {
        this.init();
      }
    },
    symbolSize: {
      handler(newName, oldName) {
        this.init();
      }
    },
    lineWidth: {
      handler(newName, oldName) {
        this.init();
      }
    },
    areaColor: {
      handler(newName, oldName) {
        this.init();
      }
    },
    lineColor: {
      handler(newName, oldName) {
        this.init();
      }
    },
    secondY: {
      handler(newName, oldName) {
        this.init();
      }
    },
    xType: {
      handler(newName, oldName) {
        this.init();
      }
    },
  },
  methods: {
    init() {
      var echartsLine = this.$echarts.init(document.getElementById(this.id));
//    console.log("你还好");
      
      //-------------------变量  start-------------------------
      let lineTitle = this.lineTitle;
      let titleposition = this.titleposition;
      let titleColor = this.titleColor;
      let titleFontSize = this.titleFontSize;
      let titleFontFamily = this.titleFontFamily;
      let legendShow = this.legendShow;
      let legendColor = this.legendColor;
      let legendPostionX = this.legendPostionX;
      let legendPostionTop = this.legendPostionTop;
      let legendPostionY = this.legendPostionY;
      let legendIcon = this.legendIcon;
      let iconWidth = this.iconWidth;
      let iconHeight = this.iconHeight;
      let iconGap = this.iconGap;
      let legendFontSize = this.legendFontSize;
      let legendData = this.legendData;
      let gridLeft = this.gridLeft;
      let gridRight = this.gridRight;
      let gridTop = this.gridTop;
      let gridBottom = this.gridBottom;
      let gridcontainLabel = this.gridcontainLabel;
      let fontSizeAxisLabel = this.fontSizeAxisLabel;
      let axisLineColor = this.axisLineColor;
      let splitLineAxis = this.splitLineAxis;
      let splitLineAxisY = this.splitLineAxisY;
      let splitLineAxisColor = this.splitLineAxisColor;
      let splitLineAxisColorY = this.splitLineAxisColorY;
      let xAxisData = this.xAxisData;
      let yAxisRightName = this.yAxisRightName;
      let yAxisLeftName = this.yAxisLeftName;
      let YaxisLabelRightFormatter = this.YaxisLabelRightFormatter;
      let YaxisLabelLeftFormatter = this.YaxisLabelLeftFormatter;
      let axisLabelY = this.axisLabelY;
      let opData = this.opData;
      let symbolShape = this.symbolShape;
      let symbolSize = this.symbolSize;
      let lineWidth = this.lineWidth;
      let areaColor = this.areaColor;
      let lineColor  = this.lineColor;
      let secondY  = this.secondY;
      let xType  = this.xType;
      // ---------------------变量 end ----------------------------
      const option = {
        // 折线图标题
        title: {
          text: lineTitle || "", //可以有标题，也可以没有标题
          left: titleposition || "", //左边的位置
          textStyle: {
            color: titleColor || "black", //标题颜色,默认黑色
            fontSize: titleFontSize || 16, //默认12px,
            fontWeight: 600,
            fontFamily: titleFontFamily || "Microsoft YaHei" //默认的微软雅黑
          }
        },
        //点击安全框
        tooltip: {
          trigger: "axis",
          axisPointer: {
//          type: "shadow",
            label: {
              show: true,
            },
          },
        },
        //图例
        legend: {
          show: legendShow || true, //图例是否显示，默认显示
          x: legendPostionX || "right", //图例X轴位置，左边对齐
          top: legendPostionTop || "0%",
          y: legendPostionY || "35", //图例Y轴位置
          icon: legendIcon || "rect", //图例的形状, 默认rect
          itemWidth: iconWidth || 15, //图例长度,默认 15px
          itemHeight: iconHeight || 2, //图例的宽,默认 2px
          itemGap: iconGap || 20, //各项图例之间的距离，默认20px
          textStyle: {
            color: legendColor || "#232323", //图例文字的颜色
            fontSize: legendFontSize || 12 //图例文字大小
          },
          data: legendData
        },
        //图形布局
        grid: {
          left: gridLeft || "5%",
          right: gridRight || "5%",
          top: gridTop || "20%",
          bottom: gridBottom || "2%",
          containLabel: gridcontainLabel || true
        },
        // x轴
        xAxis: [
          {
            type: xType || "category",
            boundaryGap: false,
            //x轴坐标的
            axisLabel: {
              color: "#717171",
              fontSize: fontSizeAxisLabel || 14
            },
            //x轴坐标轴样式
            axisLine: {
              show: true,
              lineStyle: {
                color: axisLineColor || "#d8d8d8"
              }
            },
            axisTick: { show: false }, //刻度线
            //x轴网格线
            splitLine: {
              show: splitLineAxis || false,
              lineStyle: {
                color: splitLineAxisColor || "#195384"
              }
            },
            data: xAxisData
          }
        ],
        //Y轴 一个Y轴
        yAxis: [
          {
            type: "value",
            name: yAxisRightName || "",
            axisLabel: {
              formatter: YaxisLabelRightFormatter || "{value}",
              textStyle: {
                color: "#7c7c7c",
                fontSize: fontSizeAxisLabel || 14
              }
            },
            //y轴的样式
            axisLine: {
              lineStyle: {
                color: axisLineColor || "#d8d8d8"
              }
            },
            axisTick: { show: false },
            splitLine: {
              show: splitLineAxisY || false,
              lineStyle: {
                color: splitLineAxisColorY || "#195384"
              }
            }
          },
          //第二Y轴
          {
            show: secondY, //第二个Y轴是否显示
            type: "value",
            name: yAxisLeftName || "",
            axisLabel: {
              show: axisLabelY || false,
              formatter: YaxisLabelLeftFormatter || "{value}",
              textStyle: {
                color: "#7c7c7c",
                fontSize: fontSizeAxisLabel || 14
              }
            },
            axisLine: {
              lineStyle: {
                color: axisLineColor || "#d8d8d8"
              }
            },
            axisTick: { show: false },
            splitLine: { show: false }
          }
        ],
        series: lineDatas(
          opData,
          legendData,
          symbolShape,
          symbolSize,
          lineColor,
          lineWidth,
          areaColor,
        )
      };
      window.addEventListener('resize', function() {
        echartsLine.resize();
        });
      echartsLine.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.defaultStyle {
  width: 100%;
  height: 100%;
}
</style>