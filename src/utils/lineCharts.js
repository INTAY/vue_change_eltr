import Echarts from 'echarts'  

export function lineDatas(opData,legendData,symbolShape,symbolSize,lineColor,lineWidth,areaColor) {
    let res = []

    for(var i = 0; i < opData.length; i++)  {
        res.push({
            name: legendData[i],
            type:'line',
            yAxisIndex: i,
            symbol: "circle",//折线上节点的形状，默认没有
            symbolSize: symbolSize == undefined? 8 : symbolSize[i],//折线上节点的大小，默认6px
            itemStyle: {  //折线以及节点的颜色
                normal: {
                    color:lineColor?lineColor[i] :"",//原点的颜色，默认没有，会与折线的颜色相似
                    lineStyle: {
                        color: lineColor[i],       //折线的颜色
                        width: lineWidth == undefined?2:lineWidth[i], //折线的宽度，默认2px
                    },
                    areaStyle: { //折线区域的颜色
                        color:new Echarts.graphic.LinearGradient(0, 1, 0, 0,[{
                            offset: 0,
                            color: areaColor == undefined?"#fff":areaColor[i][0]
                        }, {
                            offset: 1,
                            color: areaColor == undefined?"#fff":areaColor[i][1]
                        }]),//园区渐变色
                    }
                }
            },
            data:opData[i]//折线图数据组
        })
    }
    return res
}