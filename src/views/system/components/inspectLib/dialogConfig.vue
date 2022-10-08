<template>
  <div>
    <!-- 配置 弹出层 -->
    <el-dialog
      title="配置检查项"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="800px"
    >
      <div class="s">
        <el-button class="newButtonColor listBTN" size="small" @click="addItem"
          >新 增</el-button
        >
      </div>

      <!-- 表格 -->
      <div>
        <el-table
          :data="tableData"
          :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
          stripe
          style="width: 100%; margin-bottom: 58px"
        >
          <el-table-column
            label="序号"
            type="index"
            width="150"
          ></el-table-column>

          <el-table-column label="检查项名称">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.recName"></el-input>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                class="delete-btn"
                size="small"
                @click="removeRow(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div  slot="footer" class="dialog-footer dialog-btn">
        <el-button
          class="editorBTN btnSpace bouncedHold"
          size="mini"
          @click="submit"
          >确认</el-button
        >
        <el-button size="small" class="editorBTN cancelBTN" @click="cancel"
          >取消</el-button
        >
      </div>
    </el-dialog>

    <!-- 新增配置组件 -->
    <!-- <dialog-add-config ref="dialogAddConfig" @queryPage="queryPage" /> -->
  </div>
</template>

<script>
// import dialogAddConfig from "./dialogAddConfig";
import { updateByLibId,queryInspectList } from "@/api/system/inspectLib";
export default {
  // components: { dialogAddConfig },
  data() {
    return {
      dialogFormVisible: false,
       tableDatas: {
             libId: "",
             recNames:[] 
       },
      tableData: [],
      multipleSelection: [],
      pageData: {
        total: 0,
        current: 1,
        size: 10,
      },
    };
  },
  created() {},
  methods: {
        queryInspectList() {
      queryInspectList(this.tableDatas.libId).then((res) => {
        console.log(res,"列表");
        this.tableData = res.data;

        // 分页
      });
    },

    addItem() {
      let self = this;

      self.tableData.push({
        recName: "",
      });
    },
    submit() {     
      this.tableDatas.recNames = this.tableData.map((obj,index,array) => {
        return obj.recName
      })
      console.log(this.tableDatas.recNames,"recNames");
      // if (this.tableData.length == 0) {
      //   this.$message({
      //     message: "内容不能为空！",
      //     type: "warning",
      //   });
      //   return;
      // } else {
        updateByLibId({
            libId: this.tableDatas.libId,
             recNames:this.tableDatas.recNames 
        }).then((res) => {
          if (res.code !== "000000") {
            this.$message({
              message: res.mesg,
              type: "warning",
            });
          } else {
            this.dialogFormVisible = false;
            this.$message({
              message: "保存成功！",
              type: "success",
            });
            this.$parent.$parent.$parent.$parent.$refs.tableComp.queryPage();
          }
        });
      // }
    },

    /**
     * 删除单行
     */
    removeRow(rowIndex) {
      this.tableData.splice(rowIndex, 1);
    },
    //   取消
    cancel() {
      this.dialogFormVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.table-option-wrap {
  margin-bottom: 10px;
}

.pagenation-wrap {
  background: #f7f7f7;
  text-align: center;
  padding: 10px 0;
  line-height: 25px;
}

.confirmLayer {
  z-index: 3000 !important;
}
/deep/ .el-dialog__header {
  padding: 30px 0 0 20px;
}
</style>