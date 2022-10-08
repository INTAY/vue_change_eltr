<template>
  <div>
    <crud-form
      :field-list="fieldList"
      :exportFn="exportFn"
      :api="queryByPage"
      :queryParam="formInline"
      ref="crudForm"
    >
      <template slot="searchBar">
        <search-bar ref="searchBar" :queryParam="formInline" />
      </template>

      <template slot="tableTopOptionLeft">
        <el-button size="mini" class="newButtonColor listBTN" @click="add">新增</el-button>
        <el-button size="mini" class="BatchDeleteColor listBTN" @click="batchDelete">批量删除</el-button>
      </template>

      <template slot="tableOption" slot-scope="{ index, row }">
        <el-button @click="modify(row)" class="buleBTN" size="mini">修改</el-button>
        <el-button @click="remove(row.id)" class="redBTN" size="mini">删除</el-button>
      </template>
    </crud-form>

    <!-- 新增弹出层 -->
    <dialog-add ref="dialogAdd" />
  </div>
</template>

<script>
import crudForm from "@/components/crudForm/index";
import searchBar from "./components/StoreRoomManage/searchBar";
import dialogAdd from "./components/StoreRoomManage/dialogAdd";
import {
  queryByPage,
  remove,
  batchDelete
} from "@/api/operation/storeRoomManage";
import { DICTDATA, translatorDict } from "@/api/dict";
import { getRegNameByCode } from "@/utils/area";

export default {
  components: { searchBar, crudForm, dialogAdd },
  data() {
    // 翻译行政区域
    let formatterRegId = row => {
      return getRegNameByCode(row.regId);
    };
    // 翻译状态
    let formatterState = row => {
      return translatorDict(DICTDATA.INFRASTRUCTURE_STATUS, row.state);
    };
    return {
      formInline: {},
      queryByPage,
      fieldList: [
        { name: "库房名称", value: "houseName" },
        { name: "所属组织机构", value: "orgName", showOverflowTooltip: true },
        { name: "行政区域", value: "regId", formatter: formatterRegId },
        { name: "地址", value: "addr", showOverflowTooltip: true },
        {
          name: "状态",
          value: "state",
          formatter: formatterState,
        }
      ]
    };
  },
  methods: {
    /**
     * 新增
     */
    add() {
      let dialogAdd = this.$refs.dialogAdd;
      dialogAdd.form = {};
      dialogAdd.dialogFormVisible = true;
    },
    // 导出
    exportFn() {},
    /**
     * 修改
     */
    modify(row) {
      let dialogAdd = this.$refs.dialogAdd;
      dialogAdd.form = row;
      dialogAdd.dialogFormVisible = true;
    },
    // 删除
    remove(id) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: ""
      }).then(() => {
        remove(id)
          .then(res => {
            if (res.data && res.code === "000000") {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.$refs.crudForm.getDataInit();
            } else {
              this.$message.error("删除失败");
            }
          })
          .catch(err => {
            this.$message.error("删除失败");
          });
      });
    },
    /**
     * 批量删除
     */
    batchDelete() {
      let arr = [];
      let sel = this.$refs.crudForm.getMultipleSelection();
      if (sel.length === 0) {
        this.$message({
          message: "请至少选择一条数据!",
          type: "warning"
        });
        return false;
      }
      sel.forEach(item => {
        arr.push(item.id);
      });
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: ""
      }).then(() => {
        batchDelete(arr)
          .then(res => {
            if (res.data && res.code === "000000") {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.$refs.crudForm.getDataInit();
            }
          })
          .catch(err => {
            this.$message.error("删除失败");
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
