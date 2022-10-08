<template>
  <div>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="任务名称" v-model="formInline.name">
        <el-input size="mini" placeholder="请输入任务名称"></el-input>
      </el-form-item>

      <el-form-item label="任务类型">
        <el-select size="mini" v-model="formInline.type" placeholder="全部">
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in inspectType"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态">
        <el-select size="mini" v-model="formInline.stauts" placeholder="全部">
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in inspectState"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button size="mini" class="newButtonColor SearchBTN" @click="onSubmit()">查询</el-button>
        <el-button size="mini" class="otherBTN SearchBTN" @click="empty()">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDict, DICTDATA } from "@/api/dict";

export default {
  data() {
    return {
      formInline: {},
      inspectType: [],
      inspectState: []
    };
  },
  created() {
    getDict(DICTDATA.DEVOPS_TASK_TYPE).then(res => {
      this.inspectType = res;
    });

    getDict(DICTDATA.DEVOPS_TASK_STATE).then(res => {
      this.inspectState = res;
    });
  },
  methods: {
    onSubmit() {
      this.$parent.getDataInit(this.formInline);
    },
    empty() {
      this.formInline = {};
    }
  }
};
</script>

<style lang="scss" scoped>
</style>