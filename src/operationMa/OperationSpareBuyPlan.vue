<template>
  <div class="contain-main">
    <!-- 搜索条件 -->
    <div class="search-wrap">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="名称">
          <el-input size="mini" v-model="formInline.planName" placeholder class="inputWidth"></el-input>
        </el-form-item>

        <el-form-item label="来源">
          <el-select
            class="selectWidth"
            size="mini"
            v-model="formInline.sourceType"
            placeholder="全部"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in searchOriginOption"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select size="mini" class="selectWidth" v-model="formInline.state" placeholder="全部">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in searchStatusOption"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="计划采购日期">
          <el-date-picker
            v-model="formInline.searchDate"
            style="width: 220px"
            size="mini"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" class="newButtonColor SearchBTN" @click="search">查询</el-button>
          <el-button size="mini" class="otherBTN SearchBTN" @click="clear">清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格操作 -->
    <div class="table-option-wrap">
      <el-button @click="add" size="mini" class="newButtonColor listBTN">新增</el-button>
      <el-button @click="removeAll" size="mini" class="BatchDeleteColor listBTN">批量删除</el-button>
    </div>

    <!-- 表格 -->
    <div class="table-wrap">
      <table-comp ref="tableComp" />
    </div>

    <!-- 新增 -->
    <dialog-add ref="dialogAdd" />

    <!-- 详情 -->
    <dialog-detail ref="dialogDetail" />

    <!-- 审批 -->
    <dialog-approve ref="dialogApprove" />
  </div>
</template>

<script>
import { getDict, DICTDATA } from "@/api/dict";
import tableComp from "./components/OperationSpareBuyPlan/table";
import dialogAdd from "./components/OperationSpareBuyPlan/dialogAdd";
import dialogDetail from "./components/OperationSpareBuyPlan/dialogDetail";
import dialogApprove from "./components/OperationSpareBuyPlan/dialogApprove";
import { batchDelete } from "@/api/operation/operationSpareBuyPlan";

export default {
  components: {
    tableComp,
    dialogAdd,
    dialogDetail,
    dialogApprove
  },
  data() {
    return {
      formInline: {},
      searchStatusOption: [],
      searchOriginOption: []
    };
  },
  created() {
    // 查询状态下拉框数据
    getDict(DICTDATA.APPROVE_STATUS).then(res => {
      this.searchStatusOption = res;
    });

    getDict(DICTDATA.SPARE_BUY_PLAN_ORIGIN).then(res => {
      this.searchOriginOption = res;
    });
  },
  mounted() {

  },
  methods: {
    /**
     * 查询
     */
    search() {
      this.formInline.current = 1;
      this.$refs.tableComp.queryPage(this.formInline);
    },
    /**
     * 清空
     */
    clear() {
      this.formInline = {};
    },
    /**
     * 新增
     */
    add() {
      let dialogAdd = this.$refs.dialogAdd;
      dialogAdd.formInit();
      dialogAdd.dialogFormVisible = true;
    },
    /**
     * 批量删除
     */
    removeAll() {
      let multipleSelection = this.$refs.tableComp.multipleSelection;
      if (multipleSelection.length === 0) {
        this.$message({
          message: "请选择要删除的数据！",
          type: "warning"
        });
      } else {
        this.$confirm("确定要删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let ids = [];
          for (let i in multipleSelection) {
            ids.push(multipleSelection[i].id);
          }

          batchDelete(ids).then(res => {
            if (res.code === "000000" && res.data) {
              this.$message({
                showClose: true,
                message: "删除成功！",
                type: "success"
              });

              // 重新查询数据
              this.$refs.tableComp.queryPage({
                current: 1
              });
            } else {
              this.$message({
                message: "删除失败！",
                type: "warning"
              });
            }
          });
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.contain-main {
  width: 100%;
}

.inputWidth {
  width: 135px;
}

.selectWidth {
  //selct选择框长度
  width: 100px;
}

.search-wrap {
  padding-top: 16px;
  padding-left: 20px;
  border-bottom: 1px solid #eeeeee;
  background: #fcfcfc;
}

.table-option-wrap {
  padding: 10px 20px;
}

.table-wrap {
  padding: 0 10px;
}
</style>
