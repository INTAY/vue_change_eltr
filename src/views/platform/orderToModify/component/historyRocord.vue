<template>
  <div>
    <el-dialog title="历史修改记录" :visible.sync="dialogVisible" :close-on-click-modal="false" :modal-append-to-body="false" class="yw" width="1200px">
      <div>
        <div class="form-item">
          <div class="case-content">
            <el-table  :data="tableData"  :header-cell-style="{background:'#f1f1f1',color:'#000'}" stripe  style="width: 100%">
              <el-table-column  label="区县" prop="regionName"  align="center"></el-table-column>
              <el-table-column  label="站名"  prop="stationName" width="200"  align="center"></el-table-column>
              <el-table-column  label="充电桩编号" prop="stakeNo" width="200"  align="center"></el-table-column>
              <el-table-column  label="充电枪编号" prop="gunNo" width="200"  align="center"></el-table-column>
              <el-table-column label="车联网订单ID" align="center" width="200" prop="orderId"></el-table-column>
              <el-table-column label="充电类型" align="center" width="150" prop="orderConsumeType"></el-table-column>
              <el-table-column  label="充电开始一致" width="150"  prop="isStatusStartTimeSame" align="center">
                <template scope="scope">
                  <span v-if="scope.row.isStatusStartTimeSame == 0">否</span>
                  <span v-else>是</span>
                </template>
              </el-table-column>
              <el-table-column label="充电结束一致" width="150"  align="center" prop="isStatusEndTimeSame">
                <template scope="scope">
                  <span v-if="scope.row.isStatusEndTimeSame == 0">否</span>
                  <span v-else>是</span>
                </template>
              </el-table-column>
              <el-table-column label="订单信息" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="openDetailWin(scope.row.orderId)">查看</el-button>
                </template>
              </el-table-column>
              <el-table-column label="e充网反馈时间" align="center" width="200" prop="responTime"></el-table-column>
              <el-table-column label="e充网反馈失败原因" align="center" width="200"  prop="responErrInfo"></el-table-column>
              <el-table-column label="修改人" align="center" prop="pushManName"></el-table-column>
              <el-table-column label="修改内容" align="center" width="300" prop="editInfo"></el-table-column>
              <el-table-column label="补推次数" align="center" prop="pushNum"></el-table-column>
              <el-table-column label="补推时间" align="center" width="150" prop="pushTime" :formatter="formatDateRow"></el-table-column>
              <el-table-column label="补推结果" align="center" prop="pushState" :formatter="isRepush"></el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 分页 -->
        <!-- <div class="page-wrap">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageData.size" :total="pageData.total" :current-page="pageData.current" :page-sizes="[10, 20, 30, 40, 50, 100]" layout="total, sizes, prev, pager, next, jumper, slot">
                <span class="el-pagination__jump page-option-wrap">
                      <a class="page-option-icon" href="javascript:;" @click="refresh" title="刷新">
                        <img src="../../../../../static/img/7.png" />
                      </a>
                </span>
            </el-pagination>
        </div> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { orderDetail, editRec} from "@/api/platform/generalOverview";
  export default {
    data() {
      return {
        paramId: '',
        dialogVisible: false,
        formInline: {},
        tableData: [],
        spareOutPros: [],
        pageData: {
          total: 0,
          current: 1,
          pageSize: 10
        }
      };
      rowId:''
    },
    methods: {
      // pageSize 变化
      handleSizeChange(val) {
        this.pageData.pageSize = val;
      },
      //  点击某页
      handleCurrentChange(val) {
      },
      // 分页-刷新
      refresh() {
      },
      getData(val) {
          
          editRec(val).then(res => {
            if(res.code === '000000') {
              this.$refs.recordHis.tableData = res.data
            }
          })
          this.$refs.recordHis.dialogVisible = true
      },
      openDetailWin(val) {
          orderDetail(val).then(res => {
            if(res.code === '000000') {
              this.$parent.$refs.recordInfo.dialogVisible = true;
              this.$parent.$refs.recordInfo.mapSource = res.data
            }
          }).catch(err =>{
              this.$message.error('获取订单信息失败'+err);
          })
      },
      isRepush(val) {
          if(val.pushState == 0) return '失败'
          else return '成功'
      },
      /**
       * 格式化日期
       */
      formatDateRow(row, column) {
        let data = row[column.property];
        if (data == null) {
          return null;
        }
        let dt = new Date(data);
        return (
          dt.getFullYear() +
          "-" +
          (dt.getMonth() + 1) +
          "-" +
          dt.getDate() +
          " " +
          dt.getHours() +
          ":" +
          dt.getMinutes() +
          ":" +
          dt.getSeconds()
        );
      }
    }
  };
</script>

<style lang="scss" scoped>
// 分页
.page-wrap {
  position: absolute;
  bottom: 0;
  width: 100%;
  bottom: 0px;
  background: #f7f7f7;
  display: flex;
  justify-content: center;
  height: 35px;
  line-height: 20px;
  margin-left: -20px;
  .page-option-wrap {
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    background-color: #fff;

    .split-line {
      display: inline-block;
      width: 1px;
      background-color: #e8e8e8;
      height: 16px;
      vertical-align: middle;
    }

    .page-option-icon {
      display: inline-block;
      padding: 0 10px;

      img {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
.s {
  padding: 15px 40px;
  .push {
    color: #fff;
    background: #006080;
    width: 120px;
  }
  .buttonColor {
    color: #006080;
    width: 120px;
  }
}

.nn {
  text-align: center;
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
/deep/ .el-form-item__label {
  color: #909090;
}
/deep/ .el-form-item--small .el-form-item__content {
  color: #303133;
}
</style>