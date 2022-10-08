<template>
  <div>
    <!-- 弹出层 查看配变详情 -->
    <el-dialog  title="当天24h内所有接收记录"  :visible.sync="dialogDetailVisible"  class="xqyy"  width="1010px"  append-to-body  :modal-append-to-body="false">
      <div class="xqye">

      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogDetailVisible: false,
      form: {}
    };
  },
  methods: {
    // 格式化日期
    formatDate(data) {
      if (data == null) {
        return "";
      }
      let dt = new Date(data);
      return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    }
  }
};
</script>

<style lang="scss" scoped>
.xqye {
  display: flex;
}
.xqy {
  width: 760px;
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
.rowbg2 {
  background-color: #f7f7f7;
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
/deep/ .demo-form-inline .el-form-item__label {
  margin-left: 15px;
}
.el-form-item {
  margin-bottom: 0;
}
</style>
