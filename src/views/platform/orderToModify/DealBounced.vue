<template>
  <div>
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      :modal-append-to-body="false"
      class="dialogDetail"
    >
      <!-- 站点信息 -->
      <div class="siteDetailMessage">
        <div>
          <span>充电站点:</span>
          {{this.address}}
        </div>
        <div class="Dmessage">
          <div>
            <span>统计时间:</span>
            {{this.dateTime}}
          </div>
          <div>
            <span>正常订单数:</span>
            {{this.orderNo}}
          </div>
          <div>
            <span>异常订单数:</span>
            {{this.abnormalOrders}}
          </div>
        </div>
      </div>
      <!-- 枪信息列表 -->
      <div class="Details">
        <div class="Details_message">
          <!-- 时间线 -->
          <div class="timesline">
            <div class="mainLine" v-for="items in timeLine" :key="items.id">
              <div class="iconRect"></div>
              <div class="messageDtails">
                <div :class="{'titleTimeColor': items.title == '故障'}">{{items.title}}</div>
                <div>{{items.time}}</div>
              </div>
            </div>
            <!-- 折线图 -->
            <div class="lineCahrts">
              <charge
                id="realCharge"
                style="height:100%;width:100%;"
                :legendData="dataLegend"
                :xAxisData="dataX"
                :yAxisRightName="yRightName"
                :opData="opDiskData"
                :lineColor="colorLines"
                :symbolSize="SizeSy"
              />
            </div>
            <!-- 表格 -->
            <div class="tableData">
              <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="orderNumbe" label="充电记录订单号" align="center"></el-table-column>
                <el-table-column prop="startTIme" label="开始时间" align="center"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
                <el-table-column prop="electric" label="电量（度）" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      address: "南京市浦口区",
      dateTime: "2019年",
      orderNo: "15",
      abnormalOrders: "20",
      siteMessage: [
        { status: "工作", name: "南京浦口充电桩群", number: "95%" },
        { status: "工作", name: "南京浦口充电桩群", number: "95%" },
        { status: "工作", name: "南京浦口充电桩群", number: "95%" },
        { status: "故障", name: "南京浦口充电桩群", number: "95%" },
        { status: "工作", name: "南京浦口充电桩群", number: "95%" },
        { status: "工作", name: "南京浦口充电桩群", number: "95%" },
        { status: "工作", name: "南京浦口充电桩群", number: "95%" },
        { status: "工作", name: "南京浦口充电桩群", number: "95%" },
        { status: "工作", name: "南京浦口充电桩群", number: "95%" }
      ],
      dialogVisible: false,
      //时间线
      timeLine: [
        {
          title: "空闲",
          time: "02:00"
        },
        {
          title: "空闲",
          time: "04:00"
        },
        {
          title: "故障",
          time: "07:00"
        },
        {
          title: "空闲",
          time: "09:00"
        },
        {
          title: "空闲",
          time: "12:00"
        },
        {
          title: "空闲",
          time: "14:00"
        },
        {
          title: "空闲",
          time: "16:00"
        },
        {
          title: "空闲",
          time: "18:00"
        },
        {
          title: "空闲",
          time: "18:00"
        },
        {
          title: "空闲",
          time: "18:00"
        },
        {
          title: "空闲",
          time: "18:00"
        },
        {
          title: "空闲",
          time: "18:00"
        },
        {
          title: "故障",
          time: "20:00"
        }
      ],
      // 折线图
      dataLegend: [],
      dataX: [
        "00:00",
        "03:00",
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
        "24:00"
      ],
      SizeSy: [0],
      yRightName: "功率（kWh）",
      opDiskData: [[250, 251, 252, 253, 254, 250, 265, 268, 259]],
      colorLines: ["#24b3ca"], //折线图颜色
      //表格
      tableData: [
        {
          orderNumbe: 1236589,
          startTIme: "06:00",
          endTime: "18:00",
          electric: 35,
          status: "正常"
        },
        {
          orderNumbe: 1236589,
          startTIme: "06:00",
          endTime: "18:00",
          electric: 35,
          status: "正常"
        },
        {
          orderNumbe: 1236589,
          startTIme: "06:00",
          endTime: "18:00",
          electric: 35,
          status: "正常"
        }
      ]
    };
  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
.siteDetailMessage {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 60px;
    padding-left: 20px;
    font-size: 14px;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    span {
      margin-right: 20px;
      color: #afafaf;
    }
    .Dmessage {
      display: flex;
      margin-top: 5px;
      div {
        flex: 1;
      }
    }
  }
  .Details {
    margin-top: 25px;
    .Details_name {
      width: 100%;
      height: 34px;
      padding-left: 18px;
      margin-top: 10px;
      line-height: 34px;
      font-size: 14px;
      color: #232323;
      border: 1px solid #c5e0e5;
      background-color: rgba(240, 240, 240, 0.5);
      border-radius: 5px;
      cursor: pointer;
      background-image: url("../../../../static/img/UP.png");
      background-position: 100% 100%;
      background-repeat: no-repeat;
    }
    .onClickBGC {
      background-color: rgba(238, 247, 248, 0.5);
      background-image: url("../../../../static/img/deepUP.png");
    }
    .Details_message {
      margin-top: 5px;
      padding: 8px 20px 5px 15px;
      border: 1px solid #f0f0f0;
      border-radius: 5px;
      background-color: #fcfcfc;
      .timesline {
        display: flex;
        align-items: center;
        padding: 12px 0 25px 0;
        height: 112px;
        border-bottom: 1px solid #dcdcdc;
        //主轴时间线
        .mainLine {
          position: relative;
          width: 100%;
          height: 3px;
          background-color: #dbdbdb;
          .iconRect {
            position: absolute;
            left: 15px;
            top: -13px;
            width: 28px;
            height: 28px;
            background-image: url("../../../../static/img/timeIcon.png");
          }
          .messageDtails {
            position: absolute;
            left: 10px;
            top: 12px;
            width: 40px;
            height: 40px;
            margin-top: 5px;
            text-align: center;
            .titleTimeColor {
              color: #c94343;
            }
          }
        }
      }
      .lineCahrts {
        width: 100%;
        height: 220px;
        padding-top: 12px;
      }
      .tableData {
        padding-top: 12px;
      }
    }
  }
</style>