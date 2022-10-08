<template>
  <div>
    <!-- 弹出层 详情 -->
    <el-dialog title="运维工具详情" :modal-append-to-body="false" :visible.sync="dialogFormVisible" :close-on-click-modal="false" class="yw" width="800px">
      <el-form ref="form" :model="formInline" label-width="120px" size="small" class="xy">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称："><span v-text="formInline.name"></span></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型：">
              <span v-text="formInline.mainTypeName"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="型号：">
              <span v-text="formInline.modelName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厂家：">
              <span v-text="formInline.factName"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态：">
              <span v-text="formInline.statusName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保管人："><span v-text="formInline.keeper"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出厂日期："><span v-text="formatDate(formInline.mfdTime)"></span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投运日期："><span v-text="formatDate(formInline.applyTime)"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述："><span v-text="formInline.description"></span>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      formInline: {}
    }
  },
  methods: {
    /**
     * 格式化日期
     */
    formatDate(date) {
      if(date == null) {
          return null
      }
      let dt = new Date(date)
      return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
    }
  }
};
</script>

<style lang="scss" scoped>
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
</style>