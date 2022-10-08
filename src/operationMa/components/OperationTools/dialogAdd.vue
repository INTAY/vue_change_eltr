<template>
  <div>
    <!-- 弹出层 新增/修改 -->
    <el-dialog
      title="编辑运维工具"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      class="yw"
      width="800px"
    >
      <el-form
        ref="form"
        :model="formInline"
        :rules="rules"
        label-width="120px"
        size="small"
        class="xy"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="工具名称" prop="name">
              <el-input v-model="formInline.name" class="width-240"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select
                v-model="formInline.mainType"
                class="width-240"
                placeholder="请选择"
                @change="searchFactByType"
              >
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in searchTypeOption"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="厂家">
              <el-select
                v-model="formInline.factId"
                class="width-240"
                placeholder="请选择"
                @change="searchModel"
              >
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in searchFactOption"
                  :key="item.id"
                  :label="item.factName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号">
              <el-select v-model="formInline.modelId" class="width-240" placeholder="请选择">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in searchModelOption"
                  :key="item.id"
                  :label="item.modelName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保管人">
              <el-input class="width-240" v-model="formInline.keeper"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="formInline.status" class="width-240" placeholder="请选择">
                <el-option
                  v-for="item in searchStatusOption"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出厂日期">
              <el-date-picker
                class="width-240"
                type="date"
                value-format="yyyy-MM-dd"
                v-model="formInline.mfdTime"
                placeholder="选择日期"
                :picker-options="pickerOptionsMfdTime"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投运日期">
              <el-date-picker
                class="width-240"
                value-format="yyyy-MM-dd"
                v-model="formInline.applyTime"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptionsApplyTime"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input
                class="width-620"
                type="textarea"
                v-model="formInline.description"
                :rows="2"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-footer">
        <el-button class="editorBTN btnSpace bouncedHold" @click="submit" size="small">确定</el-button>
        <el-button size="small" class="editorBTN cancelBTN" @click="cancel">取消</el-button>
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
} from "../../../../api/operation/mtTool";
export default {
  data() {
    return {
      dialogFormVisible: false,
      searchTypeOption: [],
      searchModelOption: [],
      searchFactOption: [],
      searchStatusOption: [],
      form: {},
      formInline: {},
      rules: {
        name: [
          { required: true, message: "请输入工具名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ]
      },
      // 出厂日期
      pickerOptionsMfdTime: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        }
      },
      // 投运日期
      pickerOptionsApplyTime: {
        disabledDate: time => {
          return time.getTime() < new Date(this.formInline.mfdTime).getTime() - 8.64e7;
        }
      }
    };
  },
  mounted() {},
  created() {
    // 查询类型下拉框数据
    this.getSearchTypeOption();

    // 查询状态下拉框数据
    this.getSearchStatusOption();
  },
  methods: {
    /**
     * 查询类型下拉框
     */
    getSearchTypeOption() {
      findByDicId(DICTDATA.MTTOOL_TYPE).then(res => {
        this.searchTypeOption = res.data;
      });
    },
    /**
     * 查询状态下拉框
     */
    getSearchStatusOption() {
      findByDicId(DICTDATA.MTTOOL_STATUS).then(res => {
        this.searchStatusOption = res.data;
      });
    },
    /**
     * 根据类型查厂家
     */
    searchFactByType() {
      if (this.formInline.mainType === "") {
        this.searchFactOption = [];
        this.searchModelOption = [];
      } else {
        searchFactByType({
          factType: this.formInline.mainType,
          kind: parseInt(DICTDATA.MTTOOL_TYPE) // 类型
        }).then(res => {
          this.searchFactOption = res.data;
          this.$forceUpdate();
        });
      }
    },
    /**
     * 根据类型、厂家，查型号
     */
    searchModel() {
      if (this.formInline.mainType === "" || this.formInline.factId === "") {
        this.searchModelOption = [];
      } else {
        searchModel({
          devClass: DICTDATA.MTTOOL_TYPE, // 类别
          devMainType: this.formInline.mainType, // 类型
          factId: this.formInline.factId // 厂家
        }).then(res => {
          this.searchModelOption = res.data;
        });
      }
    },
    /**
     * 保存
     */
    submit() {
      var self = this;

      // 校验
      this.$refs["form"].validate(valid => {
        if (valid) {
          self.formInline.mainType = parseInt(self.formInline.mainType);
          self.formInline.status = parseInt(self.formInline.status);

          // 年-月-日 日期格式 转换为后端所需的UTC格式
          if (self.formInline.mfdTime && self.formInline.mfdTime !== "") {
            self.formInline.mfdTime = new Date(
              self.formInline.mfdTime
            ).toISOString();
          }
          if (self.formInline.applyTime && self.formInline.applyTime !== "") {
            self.formInline.applyTime = new Date(
              self.formInline.applyTime
            ).toISOString();
          }

          if (self.formInline.id && self.formInline.id !== "") {
            self.apiModify();
          } else {
            self.apiAdd();
          }
        } else {
          return false;
        }
      });
    },
    /**
     * 接口调用 新增
     */
    apiAdd() {
      var self = this;

      add(self.formInline)
        .then(res => {
          if (res.code === "000000") {
            self.$message({
              showClose: true,
              message: "新增成功！",
              type: "success"
            });
            self.dialogFormVisible = false;
            // 重新查询数据
            self.$parent.$parent.$refs.table.search({
              current: 1
            });
          }
        })
        .catch(err => {});
    },
    /**
     * 接口调用 修改
     */
    apiModify() {
      var self = this;

      modify(self.formInline)
        .then(res => {
          if (res.code === "000000") {
            self.$message({
              showClose: true,
              message: "修改成功！",
              type: "success"
            });
            self.dialogFormVisible = false;
            // 重新查询数据
            self.$parent.$parent.$refs.table.search({
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
      this.$refs["form"].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-form-option {
  text-align: center;

  .btn-long {
    width: 120px;
  }
}

.el-button {
  border: 1px solid #006080;
}

.el-button:hover {
  color: #006080;
}

.el-button--primary {
  background-color: #006080;
  border-color: #006080;
}

.el-button--primary:hover {
  color: #fff;
}

.el-button--mini,
.el-button--small {
  border-radius: 2px;
}

.width-240 {
  width: 240px;
}

.width-620 {
  width: 620px;
}
</style>