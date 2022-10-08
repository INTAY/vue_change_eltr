<template>
  <div>
    <!-- 新增 弹出层 -->
    <el-dialog
      title="备品备件入库"
      :visible.sync="dialogFormVisible"
       :modal-append-to-body="false"
      :close-on-click-modal="false"
      class="yw"
      width="1000px"
    >
      <div class="s" style="padding-left: 0">
        <el-button size="small" @click="addItem" class="push m-b-10">新增一条</el-button>
      </div>

      <el-table
        :data="tableData"
        :header-cell-style="{background:'#f1f1f1',color:'#000'}"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" width="50" align="center"></el-table-column>

        <el-table-column label="名称" prop="name" align="center" width="150">
          <template slot-scope="scope">
            <el-input class="kz" v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="类型" prop="type" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.type"
              @change="getFact(scope.row, scope.$index)"
              size="mini"
              placeholder="全部"
              class="selectWidth"
            >
              <el-option label="请选择" value></el-option>
              <el-option
                v-for="item in searchTypeOption"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="厂家" prop="factoryId" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.factoryId"
              @change="getModel(scope.row, scope.$index)"
              size="mini"
              placeholder="全部"
              class="selectWidth"
            >
              <el-option label="请选择" value></el-option>
              <el-option
                v-for="item in scope.row.factOption"
                :key="item.id"
                :label="item.factName"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="型号" prop="modelId" align="center">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.modelId" placeholder="全部" class="selectWidth">
              <el-option label="请选择" value=""></el-option>
              <el-option
                v-for="item in scope.row.modelOption"
                :key="item.id"
                :label="item.modelName"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="数量" prop="storeNum" align="center">
          <template slot-scope="scope">
            <el-input class="kz" v-model="scope.row.storeNum"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="单位" prop="unit" align="center">
          <template slot-scope="scope">
            <el-input class="kz" v-model="scope.row.unit"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="入库人" prop="storeMan" align="center">
          <template slot-scope="scope">
            <el-input class="kz" v-model="scope.row.storeMan"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="采购计划" prop="buyPlanId" align="center">
          <template slot-scope="scope">
            <el-input class="kz" v-model="scope.row.buyPlanId"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="有效期(年)" prop="expireDate" align="center" width="90">
          <template slot-scope="scope">
            <el-input class="kz" v-model="scope.row.expireDate"></el-input>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" align="center" width="50">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="removeRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="dialog-footer">
        <el-button type="primary" class="btn-long" @click="submit" size="small">确认</el-button>
        <el-button size="small" class="btn-long" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDict, DICTDATA } from "../../../../api/dict";
import {
  add,
  modify,
  findByDicId,
  searchFactByType,
  searchModel
} from "../../../../api/operation/operationSpareStore";
export default {
  data() {
    return {
      dialogFormVisible: false,
      searchTypeOption: [],
      tableData: [
        {
          name: "",
          type: "",
          modelId: "",
          factoryId: "",
          storeNum: "",
          unit: "",
          storeNum: "",
          buyPlanId: "",
          expireDate: "",
          factOption: [],
          modelOption: []
        }
      ]
    };
  },
  created() {
    // 查询类型下拉框数据
    getDict(DICTDATA.SPARE_OUT_TYPE)
    .then(res => {
      this.searchTypeOption = res;
    });
  },
  methods: {
    /**
     * 根据类型获取厂家
     */
    getFact(row, index) {
      row.factOption = [];
      row.modelOption = [];
      row.factoryId = "";
      row.modelId = "";

      if (row.typeId !== "") {
        searchFactByType({
          factType: row.type, // 类型
          kind: DICTDATA.SPARE_OUT_TYPE // 分类 432-备品备件
        }).then(res => {
          row.factOption = res.data;
          this.$set(this.tableData, index, row);
        });
      } else {
        this.$set(this.tableData, index, row);
      }

    },
    /**
     * 根据类型、厂家，获取型号
     */
    getModel(row, index) {
      row.modelOption = [];
      row.modelId = "";

      if (row.factoryId !== "") {
        searchModel({
          devClass: DICTDATA.SPARE_OUT_TYPE, // 类别
          devMainType: row.type, // 类型
          factId: row.factoryId // 厂家
        })
        .then(res => {
          row.modelOption = res.data;
          this.$set(this.tableData, index, row);
        });
      } else {
        this.$set(this.tableData, index, row);
      }

    },
    /**
     * 删除单行
     */
    removeRow(rowIndex) {
      this.tableData.splice(rowIndex, 1);
    },
    /**
     * 新增一条
     */
    addItem() {
      var self = this;

      self.tableData.push({
        name: "",
        type: "",
        modelId: "",
        factoryId: "",
        storeNum: "",
        curNum: "",
        unit: "",
        storeNum: "",
        buyPlanId: ""
      });
    },
    /**
     * 保存
     */
    submit() {
      // 校验
      if (this.tableData.length === 0) {
        this.$message({
          message: "请增加备品备件！",
          type: "warning"
        });
        return;
      }
      for (let i in this.tableData) {
        if (this.tableData[i].name.trim() === "") {
          this.$message({
            message: "请填写完整！",
            type: "warning"
          });
          return;
        }
      }

      add({
        spareStoreRecFormList: this.tableData
      })
        .then(res => {
          if (res.code !== "000000") {
            this.$message({
              message: res.mesg,
              type: "warning"
            });
          } else {
            this.$message({
              message: "入库成功！",
              type: "success"
            });
            this.dialogFormVisible = false;
            // 重新查询数据
            this.$parent.$parent.$refs.table.search({
              current: 1
            });
          }
        })
        .catch(err => {});
    },

    /**
     * 取消
     */
    cancel() {
      this.formInline = {};
      this.dialogFormVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.push {
  color: #fff;
  background: #006080;
  width: 120px;
}
.m-b-10 {
  margin-bottom: 10px;
}
</style>
