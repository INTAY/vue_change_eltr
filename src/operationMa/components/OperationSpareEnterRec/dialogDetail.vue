<template>
  <div>
    <!-- 弹出层 详情 -->
    <el-dialog
      title="备品备件入库详情"
      :visible.sync="dialogDetailVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      class="yw"
      width="1200px"
    >
      <div>
        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>基本信息
          </div>
          <div class="form-item-content">
            <el-form ref="form" label-width="120px" size="small">
              <el-row>
                <el-col :span="9">
                  <el-form-item label="入库类型：">{{formInline.sourceType}}</el-form-item>
                </el-col>

                <el-col :span="9">
                  <el-form-item label="来源：">{{formInline.sourceName}}</el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="状态：">{{formInline.state}}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="9">
                  <el-form-item label="入库人：">{{formInline.fillManName}}</el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="入库时间：">{{formatDate(formInline.fillTime)}}</el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>备品备件
          </div>
          <div class="case-content">
            <el-table
              :data="tableData"
              :header-cell-style="{background:'#f1f1f1',color:'#000'}"
              stripe
              style="width: 100%"
            >
              <el-table-column
                label="标识"
                :show-overflow-tooltip="true"
                prop="id"
                align="center"
              ></el-table-column>

              <el-table-column
                label="类型"
                :show-overflow-tooltip="true"
                prop="spareType"
                :formatter="spareFormat"
                align="center"
              ></el-table-column>

              <el-table-column
                label="厂家"
                :show-overflow-tooltip="true"
                prop="factName"
                align="left"
              ></el-table-column>

              <el-table-column
                label="型号"
                :show-overflow-tooltip="true"
                prop="modelName"
                align="left"
              ></el-table-column>
              <el-table-column label="数量" align="center" prop="spareNum"></el-table-column>
              <el-table-column label="单位" align="center" prop="unit"></el-table-column>
              <el-table-column
                label="库房"
                :show-overflow-tooltip="true"
                prop="houseName"
                align="center"
              ></el-table-column>
              <el-table-column label="状态" align="center" prop="state" :formatter="stateFormat"></el-table-column>
              <el-table-column label="易耗品" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.consumable == 0">易耗品</span>
                  <span v-if="scope.row.consumable == 1">非易耗品</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                label="资产编号"
                :show-overflow-tooltip="true"
                prop="assetNo"
                align="left"
              ></el-table-column>
              <el-table-column
                label="保质期"
                :show-overflow-tooltip="true"
                prop="expireDate"
                align="left"
              ></el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 分页 -->
        <div class="page-wrap">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-size="pageData.size"
            :total="pageData.total"
            :current-page="pageData.current"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper, slot"
          >
            <span class="el-pagination__jump page-option-wrap">
              <a class="page-option-icon" href="javascript:;" @click="refresh" title="刷新">
                <img src="/static/img/7.png" />
              </a>
              <i class="split-line"></i>
              <a class="page-option-icon" href="javascript:;" @click="exportTable" title="导出">
                <img src="/static/img/8.png" />
              </a>
            </span>
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  spareInfoQueryByPage,
} from "@/api/operation/OperationSpareEnterRec";
import { DICTDATA, translatorDict } from "@/api/dict";

export default {
  data() {
    return {
      dialogDetailVisible: false,
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
      this.$parent.spareInfoQueryByPage({id:this.rowId ,size: val, current: 1 });
    },
    //  点击某页
    handleCurrentChange(val) {
     this.$parent.spareInfoQueryByPage({id:this.rowId , current: val ,size:this.pageData.pageSize});
    },
    // 分页-刷新
    refresh() {
     this.$parent.spareInfoQueryByPage({id:this.rowId ,current: 1});
    },
    // 导出
    exportTable() {
    },
    

 

    /**
     * 格式化日期
     */
    formatDate(data) {
      if (data == null) {
        return "";
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
    },
        // 类型格式化
    spareFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.SPARE_SYSTEM, cellValue);
      } else {
        return "";
      }
    },
    // 状态格式化
    stateFormat(row, column, cellValue, index) {
      if (cellValue !== "") {
        return translatorDict(DICTDATA.SPARE_STATE, cellValue);
      } else {
        return "";
      }
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