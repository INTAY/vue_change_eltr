<template>
  <div>
    <!-- 弹出层 查看配变详情 -->
    <el-dialog
      title="流程配置详情"
      :visible.sync="dialogDetailVisible"
      append-to-body
      width="900px"
      :modal-append-to-body="false"
    >
      <div class="xqye">
        <el-form :inline="true" :model="form" class="demo-form-inline xqy">
          <!-- 业务类型、组织机构 -->
          <el-row type="flex" justify="start" align="middle">
            <el-col :span="12">
              <el-form-item label="业务类型:">{{
                form.busTypeName
              }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组织机构:">{{ form.orgName }}</el-form-item>
            </el-col>
          </el-row>
          <!-- 审核页面 -->
          <el-row type="flex" justify="start" align="middle">
            <el-col :span="24">
              <el-form-item label="审核页面:">{{ form.resPath }}</el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="start" align="middle">
            <el-col :span="24">
              <el-form-item label="申请人所属组织机构:" label-width="280">{{ form.applyOrgName }}</el-form-item>
            </el-col>
          </el-row>
          <!-- 审核人 -->
          <el-row type="flex" justify="start" align="middle">
            <el-col :span="24">
              <el-form-item label="审批人:" class="checkListBox">
                <div class="block">
                  <el-timeline>
                    <el-row
                      v-for="(item, index) in form.checkList"
                      :key="index"
                    >
                      <el-timeline-item
                        :timestamp="`第${form.checkList[index].level}层级审批`"
                        placement="top"
                        color="#008ab6"
                      >
                        <el-form-item class="selectBox">
                          <!-- 1 -->
                          <div class="detailBoclk">
                            <span>{{ form.checkList[index].orgName }}</span>
                            <!-- 2 -->
                            <span class="secondSpan">{{ form.checkList[index].deptName }}</span>
                            <!-- 3 -->
                            <span>{{ form.checkList[index].userName }}</span>
                          </div>
                        </el-form-item>
                      </el-timeline-item>
                    </el-row>
                  </el-timeline>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogDetailVisible: false,
      form: {},
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.xqye {
  display: flex;
}
.xqy {
  width: 100%;
}
.tu {
  width: 210px;
  height: 210px;
}
.xq {
  display: flex;
  flex-wrap: wrap;
  margin-left: 10px;
  width: 600px;
}
.a {
  width: 250px;
}
.c {
  width: 500px;
}
.y {
  width: 550px;
  background: #f5f5f5;
}
.kz {
  width: 200px;
  margin-right: 120px;
}
.h {
  height: 40px;
}
.xqy {
  margin: 0px 0px 30px 0px;
}
.tu {
  width: 200px;
  height: 200px;
  img {
    height: 100%;
    width: 100%;
  }
}
.demo-form-inline {
  padding-left: 15px;
}
/deep/ .el-form-item__label {
  color: #909090;
  display: inline-block;
  width: 110px;
  text-align: right;
}
// /deep/ .demo-form-inline .el-form-item__label {
//   margin-left: 15px;
// }
.el-form-item {
  margin-bottom: 0;
}

.block {
  margin-top: 11px;
 /deep/ .el-timeline-item__wrapper {
    top:-5px;
  width: 660px;
}
  .el-timeline {
    width: 100%;
    padding-left: 0px;
  }
}
.detailBoclk {
  display: flex;
  span {
    font-size: 14px;
    padding: 0 15px;
    color: #a2a2a2;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    letter-spacing: 1px;
    background-color: #e7e7e7;
  }
  .secondSpan {
    margin: 0 25px;
  }
}
/deep/.el-form-item__label {
  width: 140px;
}
</style>