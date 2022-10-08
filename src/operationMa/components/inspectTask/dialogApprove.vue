<template>
  <div>
    <!-- 弹出层 审批 -->
    <el-dialog
      title="运维任务审批"
      :modal-append-to-body="false"
      :visible.sync="dialogDetailVisible"
      width="900px"
    >
      <div>
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>基本信息
          </div>
          <div class="form-item-content">
            <el-form ref="form" label-width="120px" size="small">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="任务名称：">{{inspectTaskInfo.taskName}}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="任务类型："
                  >{{translatorDict(DICTDATA.DEVOPS_TASK_TYPE, inspectTaskInfo.taskType)}}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="组织机构：">{{inspectTaskInfo.orgName}}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="审核人：">{{inspectTaskInfo.checkManName}}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="周期："
                  >{{translatorDict(DICTDATA.CYCLE_TIME, inspectTaskInfo.period)}}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="频次：">{{inspectTaskInfo.freq}}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="间隔时间：">{{inspectTaskInfo.intervalDays}}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="开始执行时间："
                  >{{formatDate("YYYY-mm-dd HH:MM:SS", inspectTaskInfo.startDate)}}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="结束执行时间："
                  >{{formatDate("YYYY-mm-dd HH:MM:SS", inspectTaskInfo.endDate)}}</el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>运维内容
          </div>
          <div class="form-item-content case-info">
            <el-form label-width="120px" size="small">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="预案名称：">
                    <el-link type="primary">{{inspectTaskInfo.inspectContent.inspName}}</el-link>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="描述：">
                    <p class="caseDesc">{{inspectTaskInfo.inspectContent.descr}}</p>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <!-- 运维设备 -->
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>
            运维设备
            ({{translatorDict(DICTDATA.DEVOPS_DEVICES_TARGET, inspectTaskInfo.taskObjType)}})
          </div>
          <div class="dev-wrap">
            <!-- 充电站 -->
            <el-table
              v-if="inspectTaskInfo.taskObjType === 1"
              :data="inspectTaskInfo.assetStations"
              :header-cell-style="{background:'#f1f1f1',color:'#000'}"
              stripe
              style="width: 100%"
            >
              <el-table-column type="index" width="20" align="center"></el-table-column>
              <el-table-column
                label="站点名称"
                :show-overflow-tooltip="true"
                prop="staName"
                align="center"
              ></el-table-column>
              <el-table-column
                label="所属区域"
                :show-overflow-tooltip="true"
                :formatter="getRegNameByCode"
                prop="regId"
                align="center"
              ></el-table-column>
              <el-table-column label="详细地址" :show-overflow-tooltip="true" prop="addr" align="left"></el-table-column>
            </el-table>

            <!-- 充电桩 -->
            <el-table
              v-if="inspectTaskInfo.taskObjType === 2"
              :data="inspectTaskInfo.assetStakes"
              :header-cell-style="{background:'#f1f1f1',color:'#000'}"
              stripe
              style="width: 100%"
            >
              <el-table-column type="index" width="20" align="center"></el-table-column>
              <el-table-column label="桩编号" :show-overflow-tooltip="true" prop="id" align="center"></el-table-column>
              <el-table-column
                label="桩名称"
                :show-overflow-tooltip="true"
                prop="devName"
                align="center"
              ></el-table-column>
              <el-table-column
                label="站点名称"
                :show-overflow-tooltip="true"
                prop="stationName"
                align="left"
              ></el-table-column>
              <el-table-column label="功率(kW)" prop="ratePower" align="center"></el-table-column>
            </el-table>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>审批意见
          </div>
          <div>
            <el-input type="textarea" :rows="2" placeholder="请输入审批意见" v-model="descr"></el-input>
          </div>
        </div>

        <div class="dialog-footer">
          <el-button type="primary" class="btn-long" @click="pass" size="small">通过</el-button>
          <el-button class="btn-long" @click="unpass">驳回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { DICTDATA, translatorDict } from "@/api/dict";
import { formatDate } from "@/utils/DateFormat";
import { getRegNameByCode } from "@/utils/area";
import { approval } from "@/api/operation/inspectTask";

export default {
  data() {
    return {
      DICTDATA,
      formatDate,
      translatorDict,
      dialogDetailVisible: false,
      inspectTaskInfo: {
        inspectContent: ""
      },
      descr: ""
    };
  },
  methods: {
    /**
     * 展示弹出层
     */
    showDialog() {
      this.dialogDetailVisible = true;
      this.descr = "";
    },
    getRegNameByCode(row) {
      return getRegNameByCode(row.regId);
    },
    /**
     * 审核通过
     */
    pass() {
      let param = {
        taskId: this.inspectTaskInfo.id,
        state: 3,
        descr: this.descr
      };
      approval(param).then(res => {
        if (res.data && res.code === "000000") {
          this.$message({
            message: "审批成功",
            type: "success"
          });
          // 关闭弹出层
          this.dialogDetailVisible = false;
          // 重新查询数据
          this.$parent.getDataInit();
        } else {
          this.$message.error("审批失败");
        }
      });
    },
    /**
     * 驳回
     */
    unpass() {
      let param = {
        taskId: this.inspectTaskInfo.id,
        state: 4,
        descr: this.descr
      };
      approval(param).then(res => {
        if (res.data && res.code === "000000") {
          this.$message({
            message: "驳回成功",
            type: "success"
          });
          // 关闭弹出层
          this.dialogDetailVisible = false;
          // 重新查询数据
          this.$parent.getDataInit();
        } else {
          this.$message.error("驳回失败");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dialog__body >>> .form-item .form-item-content {
  padding: 15px;
}

.form-item >>> .el-form-item--small.el-form-item {
  margin-bottom: 0;
}

.table-link {
  border: 0 !important;
}

.el-button {
  color: #00607f;
  border: 1px solid #8facb5;
}

.el-button:hover {
  color: #00607f;
  border: 1px solid #8facb5;
  background-color: #fff;
}

.el-button--primary {
  background-color: #00607f;
  border-color: #00607f;
  color: #fff;
}

.el-button--primary:hover {
  background-color: #00607f;
  border-color: #00607f;
  color: #fff;
}

.el-button--small.btn-long {
  padding: 9px 40px;
}

.el-button--small.btn-middle {
  padding: 9px 20px;
}

.el-button--mini,
.el-button--small {
  border-radius: 2px;
}

.caseDesc {
  margin: 0;
}

.case-info {
  padding: 5px !important;
}

.case-info .el-form-item--mini.el-form-item,
.case-info .el-form-item--small.el-form-item {
  margin-bottom: 0;
}

.form-item {
  margin-bottom: 10px;

  .form-item-content {
    background-color: #fcfcfc;
    border: 1px solid #eee;
    padding: 15px 15px 0;
  }

  .form-item-title {
    font-size: 16px;
    line-height: 30px;
    color: #434343;
    margin-bottom: 5px;

    .line {
      display: inline-block;
      vertical-align: middle;
      width: 4px;
      height: 14px;
      margin-right: 10px;
      background-color: #24b3ca;
      border-radius: 4px;
    }
  }
}
</style>
