// 运维任务管理
<template>
  <div>
    <crud-form
      :field-list="fieldList"
      :showCheckbox="false"
      :exportFn="exportFn"
      :api="queryByPage"
      :queryParam="formInline"
      ref="crudForm"
    >
      <template slot="searchBar">
        <fill-bar ref="searchBar" :queryParam="formInline" />
      </template>

      <template slot="tableTopOptionLeft">
        <el-button size="mini" class="listBTN newButtonColor" @click="add">新增</el-button>
      </template>

      <template slot="tableOption" slot-scope="{ index, row }"></template>
        <el-button @click="detail(row)" class="buleBTN" size="mini">详情</el-button>
        <el-button v-if="row.state === 1 || row.state === 4" @click="modify(row.id)" class="buleBTN" size="mini">修改</el-button>
        <el-button v-if="row.state === 6" @click="start(row.id)" class="buleBTN" size="mini">启动</el-button>
        <el-button
          v-if="row.state === 5 || row.state === 3"
          @click="stop(row.id)"
          class="redBTN"
          size="mini"
        >停止</el-button>
        <el-button v-if="row.state === 2" @click="approve(row.id)" class="buleBTN" size="mini">审批</el-button>
      </template>
    </crud-form>

    <!-- 弹出层 新增 -->
    <dialogAdd ref="dialogAdd" />

    <!-- 弹出层 详情 -->
    <dialogDetail ref="dialogDetail" />

    <!-- 弹出层 审批 -->
    <dialogApprove ref="dialogApprove" />
  </div>
</template>

<script>
import crudForm from "@/components/crudForm/index";
import { DICTDATA, translatorDict } from "@/api/dict";
import {
  queryByPage,
  getInspectTaskById,
  voidInspectTask,
  lussuedInspectTask
} from "@/api/operation/inspectTask";
import fillBar from "./components/inspectTask/fillBar";
import dialogAdd from "./components/inspectTask/dialogAdd";
import { formatDate } from "@/utils/DateFormat";
import dialogDetail from "./components/inspectTask/dialogDetail";
import dialogApprove from "./components/inspectTask/dialogApprove";

export default {
  components: { fillBar, crudForm, dialogAdd, dialogDetail, dialogApprove },
  data() {
    var formatterType = row => {
      return translatorDict(DICTDATA.DEVOPS_TASK_TYPE, row.taskType);
    };
    var formatterState = row => {
      return translatorDict(DICTDATA.DEVOPS_TASK_STATE, row.state);
    };
    var formatterPeriod = row => {
      return translatorDict(DICTDATA.CYCLE_TIME, row.period);
    };
    var formatterStartDate = row => {
      return formatDate("YYYY-mm-dd HH:MM:SS", row.startDate);
    };
    var formatterEndDate = row => {
      return formatDate("YYYY-mm-dd HH:MM:SS", row.endDate);
    };
    var formatterCreatedTime = row => {
      return formatDate("YYYY-mm-dd HH:MM:SS", row.createdTime);
    };

    return {
      formatDate,
      queryByPage,
      fieldList: [
        { name: "任务名称", value: "taskName", showOverflowTooltip: true },
        { name: "任务类型", value: "taskType", formatter: formatterType },
        { name: "状态", value: "state", formatter: formatterState },
        { name: "周期", value: "period", formatter: formatterPeriod },
        { name: "运维预案名称", value: "inspName", showOverflowTooltip: true },
        {
          name: "开始执行时间",
          value: "startDate",
          formatter: formatterStartDate,
          showOverflowTooltip: true
        },
        {
          name: "结束执行时间",
          value: "endDate",
          formatter: formatterEndDate,
          showOverflowTooltip: true
        },
        {
          name: "任务制定时间",
          value: "createdTime",
          formatter: formatterCreatedTime,
          showOverflowTooltip: true
        }
      ],
      formInline: {}
    };
  },
  methods: {
    /**
     * 修改
     */
    modify(id) {
      let dialogAdd = this.$refs.dialogAdd;
      getInspectTaskById(id).then(res => {
        dialogAdd.showModifyDialog(res.data);
      });
    },
    /**
     * 新增
     */
    add() {
      this.$refs.dialogAdd.showDialog();
    },
    /**
     * 停止
     */
    stop(id) {
      this.$confirm("确定要停止吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        lussuedInspectTask(id).then(res => {
          if (res.data && res.code === "000000") {
            this.$message({
              message: "运维任务已停止",
              type: "success"
            });

            // 重新查询数据
            this.getDataInit();
          } else {
            this.$message.error(res.data);
          }
        });
      });
    },
    /**
     * 启动
     */
    start(id) {
      this.$confirm("确定要启动吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        voidInspectTask(id).then(res => {
          if (res.data && res.code === "000000") {
            this.$message({
              message: "运维任务已启动",
              type: "success"
            });

            // 重新查询数据
            this.getDataInit();
          } else {
            this.$message.error(res.data);
          }
        });
      });
    },
    /**
     * 审批
     */
    approve(id) {
      let dialogApprove = this.$refs.dialogApprove;
      getInspectTaskById(id).then(res => {
        dialogApprove.inspectTaskInfo = res.data;
        dialogApprove.showDialog();
      });
    },
    /**
     * 详情
     */
    detail(row) {
      let dialogDetail = this.$refs.dialogDetail;
      getInspectTaskById(row.id).then(res => {
        dialogDetail.inspectTaskInfo = res.data;
        dialogDetail.dialogDetailVisible = true;
      });
    },
    /**
     * 报废
     */
    scrap(id) {
      this.$prompt("确认报废吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          scrapSpare({
            id: id, // 备件标识
            scrapDesc: value
          }).then(res => {
            if (res.code === "000000") {
              this.$message({
                showClose: true,
                message: "报废成功！",
                type: "success"
              });

              // 重新查询数据
              this.$refs.crudForm.getDataInit();
            } else {
              this.$message({
                message: res.mesg,
                type: "warning"
              });
            }
          });
        })
        .catch(() => {});
    },
    getDataInit(param) {
      this.$refs.crudForm.queryParam = param;
      this.$refs.crudForm.getDataInit();
    },
    /**
     * 导出
     */
    exportFn() {}
  }
};
</script>