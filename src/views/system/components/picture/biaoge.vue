<template>
  <div id="table-wrap">
    <div class="tup">
      <div class="block" style="position: relative;" v-for="item in picFile" :key="item">
        <div class="demo-image__preview">
          <el-checkbox-group v-model="checkData">
            <el-checkbox-button :key="item.id" :label="item" @change="selectChangeData">
              <el-image
                style="width: 120px; height: 120px;  border-radius:5px 5px 5px; "
                :src="item.url"
                :title="item.name"
                :aria-checked="true"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </el-checkbox-button>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="page-wrap-fixed" id="page-wrap-fixed">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageData.size"
        :total="pageData.total"
        :current-page="pageData.current"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper, slot"
      >
        <span class="el-pagination__jump page-option-wrap">
          <a class="page-option-icon" href="javascript:;" @click="refresh" title="刷新">
            <img src="../../../../../static/img/7.png" />
          </a>
        </span>
      </el-pagination>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-checkbox__input {
  width: 25px !important;
  height: 25px !important;
}
/deep/ .el-checkbox-button--medium .el-checkbox-button__inner{
  padding: 9px 15px;
  border-radius: 4px !important;
}
.tup {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 20px;
}
.block {
  width: 188px;
  display: flex;
  flex-wrap: wrap;

}

//分页器
.pageStyle {
  width: 100%;
  background-color: #f7f7f7;
  position: fixed;
  bottom: 10px;
}

.fenye {
  margin-left: 27%;
  display: flex;
}

.demo-image__preview {
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 5px 5px 5px;
}

.demo-image__preview:hover {
  padding: 5px;
  background: #f5f5f5;
  border: 1px solid #5f9ea0;
  border-radius: 5px;
}

.demonstration {
  margin: 0 auto;
}

.yan {
  width: 25px !important;
  height: 25px !important;
  background-color: transparent;
  border-radius: 50% !important;
}

.page-option-wrap {
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  background-color: #fff;
}

.split-line {
  display: inline-block;
  width: 1px;
  background-color: #e8e8e8;
  height: 16px;
  vertical-align: middle;
}

.page-option-icon {
  display: inline-block;
  padding: 0 10px;
}

img {
  display: inline-block;
  vertical-align: middle;
}
</style>
<script type="text/ecmascript-6">
import { queryData } from "../../../../api/system/picture"; //查询列表和删除选项

export default {
  data() {
    return {
      checkData: [],
      trueLable: [],
      picFile: [],
      cData: [],
      seen: true,
      checked: true,
      pageData: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
    };
  },
  mounted() {
    this.queryData();
    let elementResizeDetectorMaker = require("element-resize-detector");
    let tableWidth = document.getElementById("table-wrap");
    let pageWidth = document.getElementById("page-wrap-fixed");
    let erd = elementResizeDetectorMaker();
    erd.listenTo(tableWidth, function (element) {
      pageWidth.style.width = element.offsetWidth + "px";
    });
  },
  methods: {
    //查询接口,不传参默认渲染所有数据到表格里
    queryData(data) {
      queryData(data)
        .then((res) => {
          this.picFile = res.data.records;
          this.pageData = {
            total: res.data.total,
            current: res.data.current,
            pageSize: res.data.size,
          };
        })
        .catch((err) => {
          this.$message.error("查询失败");
        });
    },
    refresh() {
      let formInline = this.$parent.$refs.topform.form;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      this.pageData(formInline);
    },
    // 分页点击事件
    handleSizeChange(val) {
      let formInline = this.$parent.$refs.topform.form;
      this.pageData.pageSize = val;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      this.queryList(formInline);
    },
    handleCurrentChange(val) {
    let formInline = this.$parent.$refs.topform.form;
      this.pageData.current = val;
      formInline.size = this.pageData.pageSize;
      formInline.current = this.pageData.current;
      this.queryData(formInline);
    },
    //复选框状态改变
    selectChangeData(val) {
    },
  },
};
</script>
<style lang="scss">
/deep/ .el-image-viewer__close {
  top: 75px !important;
  right: 20px !important;
  color: #fff !important;
}

/deep/ #app {
  font-family: "Microsoft YaHei";
}

.el-image-viewer__close {
  color: white;
}
/* 滚动条样式 */
*::-webkit-scrollbar {
    width: 7px;
    height: 9px;
    background-color: transparent;
} /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
*::-webkit-scrollbar-track {
    background-color: #f0f6ff;
} /*定义滚动条轨道 内阴影+圆角*/
*::-webkit-scrollbar-thumb {
    background-color: #dbdbdb;
    border-radius: 6px;
} /*定义滑块 内阴影+圆角*/
*::-webkit-scrollbar-thumb:hover {
    background-color: #c2c2c2;
    border-radius: 6px;
} /*定义滑块 内阴影+圆角*/
.scrollbarHide::-webkit-scrollbar {
    display: none;
}
.scrollbarShow::-webkit-scrollbar {
    display: block;
}
</style>

