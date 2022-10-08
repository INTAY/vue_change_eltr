<template>
  <el-container class="page-table-ctn">
    <el-table
      stripe
      :header-cell-style="{background:'#f1f1f1',color:'#000'}"
      @selection-change="handleSelectionChange"
      :data="filterData"
      ref="pageTable"
    >
      <slot></slot>
      <el-table-column width="40" fixed="right" v-if="dynamicColumnSetting">
        <template slot="header">
          <el-popover
            placement="bottom"
            min-width="80"
            trigger="click"
            popper-class="col-setting-popover"
          >
            <el-button
              slot="reference"
              size="small"
              type="text"
              icon="el-icon-setting"
              style="padding:0;border-color:#f1f1f1;"
            ></el-button>
            <div class="col-setting-title">展示列设置</div>
            <el-checkbox-group v-model="visibleIndexs" :min="1" class="col-setting-group">
              <el-checkbox
                v-for="colInfo in columnInfos"
                :label="colInfo.index"
                :key="colInfo.index"
                :disabled="colInfo.disabled"
              >{{ colInfo.label }}</el-checkbox>
            </el-checkbox-group>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>

<script>
export default {
  name: "page-table",
  props: {
    data: {
      type: Array,
      require: true,
      default: _ => []
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: _ => [10, 30, 50, 100]
    },
    layout: {
      type: String,
      default: "sizes, prev, pager, next, jumper"
    },
    dynamicColumnSetting: {
      // 是否开启动态列设置
      type: Boolean,
      default: false
    },
    columnVisibles: {
      // 列可见性，初始需要设置全true。列下标值是从 0 开始
      type: Array,
      default: _ => []
    },
    alwaysShowColumnIndexs: {
      // 总是展示的列下标（不允许隐藏）。列下标值是从 0 开始
      type: Array,
      default: _ => []
    },
    hidenColumnIndexs: {
      // 初始隐藏的列下标。列下标值是从 0 开始
      type: Array,
      default: _ => []
    }
  },
  data() {
    return {
      checkList: ["选中且禁用", "复选框 A"],
      allData: this.data, 
      filterData: [], // 表格展示数据
      multipleSelection:[],//选中的数据
      start: 1,
      end: 1,
      totalSize: this.data.length,
      currPageSize: this.paging ? this.pageSize : Number.MAX_SAFE_INTEGER,
      currPage: this.currentPage,
      dynColSettingDialogVisible: false, // '展示列设置'弹窗开关
      columnInfos: [], // 所有列信息
      visibleIndexs: [], // 可见列的下标集合
      hidenIndexs: this.hidenColumnIndexs // 不可见列(隐藏列)的下标集合
    };
  },
  methods: {
    renderTable() {
      if (this.totalSize > this.currPageSize) {
        // 总行数大于一页
        let startIndex = (this.currPage - 1) * this.currPageSize,
          endIndex = this.currPage * this.currPageSize;
        this.start = startIndex + 1;
        this.end = this.totalSize < endIndex ? this.totalSize : endIndex;
        this.filterData = this.allData.slice(startIndex, endIndex); //[start,end)
      } else if (this.totalSize > 0) {
        // 总行数小于等于一页
        this.currPage = 1;
        this.start = 1;
        this.end = this.totalSize;
        this.filterData = this.allData;
      } else {
        // 无数据
        this.currPage = 1;
        this.start = 0;
        this.end = 0;
        this.filterData = [];
      }
    },
    setData(value) {
      this.allData = value;
      this.totalSize = value.length;
      this.renderTable();
    },
    oprColumns(indexs, isShow) {
      let self = this;
      indexs.forEach(index => {
        self.$set(self.columnVisibles, index, isShow);
      });
    },

    //<el-table>自带的方法 start
    setCurrentRow(row) {
      this.$refs.pageTable.setCurrentRow(row);
    },
    // 选中的表格
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  watch: {
    data() {
      this.setData(this.data ? this.data : []);
    },
    visibleIndexs(newValue, oldValue) {
      let self = this;
      var willHideIndexs = [],
        willShowIndexs = [];

      willShowIndexs = newValue.filter(index => {
        return oldValue.indexOf(index) === -1;
      });

      willHideIndexs = oldValue.filter(index => {
        return newValue.indexOf(index) === -1;
      });

      self.oprColumns(willShowIndexs, true);
      self.oprColumns(willHideIndexs, false);
    }
  },
  beforeUpdate() {
    this.$nextTick(() => {
      this.$refs.pageTable.doLayout();
    });
  },
  mounted() {
    let self = this;

    if (self.$refs.pageTable.$slots.default && self.dynamicColumnSetting) {
      self.$refs.pageTable.$slots.default.forEach((columnIns, index) => {
        if (columnIns.componentOptions === undefined) {
          return;
        }
        let props = columnIns.componentOptions.propsData;
        if (props.label === undefined && props.type !== "selection") {
          return;
        }
        // 保存所有列信息
        self.columnInfos.push({
          label: props.type === "selection" ? "复选框" : props.label,
          index: index,
          disabled: props.type === "selection" ? true : false
        });
        // 记录初始展示的列
        if (self.hidenIndexs.indexOf(index) === -1) {
          self.visibleIndexs.push(index);
        }
      });
      // 总是显示的列，不可隐藏
      self.alwaysShowColumnIndexs.forEach(
        index => (self.columnInfos[index].disabled = true)
      );
      // 处理初始隐藏列
      self.oprColumns(self.hidenIndexs, false);
    }
  }
};
</script>

<style lang="scss">
.page-table-ctn {
  width: 100%;
}

.col-setting-popover {
  min-width: 100px;
  padding: 9px 16px;
  .col-setting-title {
    color: #7f8b93;
    font-size: 12px;
  }
  .col-setting-group {
    .el-checkbox {
      display: block;
      margin-top: 5px;
    }
  }
}
</style>
