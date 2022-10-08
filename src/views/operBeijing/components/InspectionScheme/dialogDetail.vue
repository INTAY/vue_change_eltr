<template>
  <div>
    <!-- 弹出层 查看预案 -->
    <el-dialog
      title="模块任务详情"
      :modal-append-to-body="false"
      :visible.sync="dialogDetailVisible"
      class="yw"
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
                <el-col :span="9">
                  <el-form-item label="模块名称：">{{formInline.inspName}}</el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="状态：">{{stateFormat(formInline.state)}}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="任务类型：">{{inspTypeFormat(formInline.inspType)}}</el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div class="form-item">
          <div class="form-item-title">
            <span class="line"></span>运维方案
          </div>
          <div class="case-content">
            <el-tree
              :data="caseSelectTreeData"
              :props="defaultProps"
              node-key="id"
              :default-expand-all="true"
            ></el-tree>
          </div>
        </div>
        <!-- 表格 -->
         <div class="form-item">
        <div class="form-item-title">
          <span class="line"></span>使用中的任务
        </div>
              <el-table
        :data="tableData"
        :header-cell-style="{background:'#f1f1f1',color:'#000'}"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column label="站点编号"  prop="staId"></el-table-column>
        <el-table-column label="任务名称" prop="inspName"  show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间"  prop="optTime"></el-table-column>
      </el-table>

         </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { DICTDATA, translatorDict } from "@/api/dict";
export default {
  data() {
    return {
      dialogDetailVisible: false,
      tableData:[],
      caseSelectTreeData: [],
      formInline: {},
      defaultProps: {
        children: "children",
        label: "libName",
      },
    };
  },
  mounted() {},
  methods: {
    /**
     * 前端翻译字典-“状态”
     */
    stateFormat(state) {
      if (state !== "") {
        return translatorDict(DICTDATA.INSPECT_CONTENT_STATUS, state);
      } else {
        return "";
      }
    },
    //  类型
    inspTypeFormat(inspType) {
      if (inspType !== "") {
        return translatorDict(DICTDATA.DEVOPS_TASK_TYPE, inspType);
      } else {
        return "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
      vertical-align: revert;
      width: 4px;
      height: 14px;
      margin-right: 10px;
      background-color: #24b3ca;
      border-radius: 4px;
    }
  }
}

.case-content {
  border: 1px solid #eaeaea;
  border-radius: 4px;
  height: 100%;
  max-height: 350px;
  overflow-y: auto;
}
/deep/ .el-dialog__header{
  padding-left: 18px !important;
}
</style>
