<template>
  <div class="search-wrap">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="出库申请名称">
        <el-input size="mini" v-model="formInline.recName" placeholder="请输入" class="inputWidth"></el-input>
      </el-form-item>
      <el-form-item label="审批状态">
        <el-select size="mini" v-model="formInline.state" placeholder="全部" class="selectWidth">
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in searchStatusOption"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="申请日期">
        <el-date-picker
          v-model="formInline.searchDate"
          style="width: 220px"
          size="mini"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerDate"
          @change="timeQuantum"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button size="mini" @click="search" class="SearchBTN newButtonColor">查询</el-button>
        <el-button size="mini" @click="clear" class="SearchBTN otherBTN">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDict, DICTDATA } from "@/api/dict";
import { findByDicId } from "@/api/operation/operationSpareOutRec";

export default {
  data() {
    return {
      formInline: {},
      searchStatusOption: [],
      pickerDate: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  created() {
    // 查询状态下拉框数据
    getDict(DICTDATA.SPARE_OUT_APPROVE_STATUS)
    .then(res => {
      this.searchStatusOption = res;
    });
  },
  methods: {
    timeQuantum(e){
      console.log(e[0]);
      console.log(e[1]);
      
      
      this.formInline.startTime = e[0]
       this.formInline.endTime = e[1]
    },
    /**
     * 查询
     */
    search() {
      var self = this;

      self.formInline.current = 1;
      self.$parent.$refs.table.search(self.formInline);
    },
    /**
     * 清空查询条件
     */
    clear() {
      this.formInline = {};
    }
  }
};
</script>

<style lang="scss" scoped>
.search-wrap {
  padding-top: 16px;
  padding-left: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eeeeee;
  background: #fcfcfc;

  .inputWidth {
    //input框的长度
    width: 150px;
  }
  .selectWidth {
    //selct选择框长度
    width: 150px;
  }

  .timeWidth {
    //时间选择框
    width: 220px;
  }
.btn_width{
  height: 28px;
}
  .searchColor {
    //查询按钮的背景颜色和字体颜色
    background-color: #006080;
    color: #fff;
  }

  .interval {
    //表单之间的间隔
    padding-left: 40px;
  }

  .el-form-item {
    margin-bottom: 2px;
  }

  .el-button {
    border: 1px solid #006080;
  }

  .el-button:hover {
    color: #006080;
  }

  .el-button--mini,
  .el-button--small {
    border-radius: 2px;
  }

  .el-button--primary {
    background-color: #006080;
    border-color: #006080;
  }

  .el-button--primary:hover {
    color: #fff;
  }
}
</style>
