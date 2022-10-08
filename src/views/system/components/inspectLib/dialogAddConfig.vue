<template>
  <div>
    <!-- 新增配置 弹出层 -->
    <el-dialog
      title="新增配置"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="350px"
    >
      <el-form
        ref="form"
        :model="sizeForm"
        :rules="rule"
        label-width="80px"
        size="small"
        class="qw"
      >
        <el-form-item label="名称" prop="recName">
          <el-input v-model="sizeForm.recName" class="kz"></el-input>
        </el-form-item>
      </el-form>

      <div  slot="footer" class="dialog-footer dialog-btn">
        <el-button class="btnSpace bouncedHold listBTN" size="small" @click="add">确认</el-button>
        <el-button size="small" class="cancelBTN listBTN" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addDetail, updateDetail } from "@/api/system/inspectLib";
export default {
  data() {
    return {
      dialogFormVisible: false,
      sizeForm: {
        libId: "",
        id: ""
      },
      rule: {
        recName: [
          { required: true, message: "请输入配置名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        sortNo: [
          { required: true, message: "请输入排序", trigger: "blur" },
          {
            type: "number",
            message: "请输入正确的排序",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    /**
     * 表单初始化
     */
    resetForm() {
      if (this.$refs["form"] !== undefined) {
        this.$refs["form"].resetFields();
      }
    },
    /**
     * 取消
     */
    cancel() {
      this.dialogFormVisible = false;
    },
    add() {
      // 校验
      this.$refs["form"].validate(valid => {
        if (valid) {
            addDetail(this.sizeForm).then(res => {
              if (res.code === "000000" && res.data) {
                this.$message({
                  showClose: true,
                  message: "保存成功！",
                  type: "success"
                });
                this.dialogFormVisible = false;
                // 重新查询数据
                this.$emit("queryPage");
              } else {
                this.$message.error(res.mesg);
              }
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>