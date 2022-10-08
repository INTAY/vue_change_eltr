<template>
  <div id="table-wrap">
    <div style="margin:0 15px;">
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#f1f1f1',color:'#000'}"
        stripe
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="index" width="50" align="center"></el-table-column>

        <el-table-column type="selection" width="100" align="center"></el-table-column>

        <el-table-column label="模块名称" prop="inspName" width="550" show-overflow-tooltip></el-table-column>
        <el-table-column label="任务类型" :formatter="inspTypeFormat" prop="inspType"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button class="buleBTN" @click="detail(scope.row)" size="mini">详情</el-button>
            <el-button class="buleBTN" @click="modify(scope.row)" size="mini">修改</el-button>
            <el-button
              class="buleBTN"
              @click="changeStatus(scope.row)"
              size="mini"
              v-if="tableData[scope.$index].status == '2'"
            >启用</el-button>
            <el-button
              class="redBTN"
              @click="changeStatus(scope.row)"
              size="mini"
              v-if="tableData[scope.$index].status == '1'"
            >停用</el-button>
            <el-button class="redBTN" @click="deleteItem(scope.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-wrap-fixed" id="page-wrap-fixed">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageData.pageSize"
        :total="pageData.total"
        :current-page="pageData.current"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper, slot"
      >
        <span class="el-pagination__jump page-option-wrap">
          <a class="el-icon-refresh page-option-icon" href="javascript:;" @click="refresh" title="刷新">
            <!-- <img src="/static/img/7.png" /> -->
          </a>
          <i class="split-line"></i>
          <a  class="el-icon-upload2 page-option-icon" href="javascript:;" @click="exportTable" title="导出">
            <!-- <img src="/static/img/8.png" /> -->
          </a>
        </span>
      </el-pagination>
    </div>

    <!-- <div class="di"> -->
    <!-- <el-pagination
        style="display: inline-block"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageData.current"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageData.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
      ></el-pagination>
      <el-button size="mini">刷新</el-button>
    </div>-->
    <!-- </div> -->
  </div>
</template>

<script>
import { DICTDATA, translatorDict } from '@/api/dict';
import { queryPage, updateStatus, remove, getDetail } from '@/api/operation/inspectScheme';
export default {
    data() {
        return {
            multipleSelection: [],
            pageData: {
                total: 0,
                current: 1,
                pageSize: 10
            },
            tableData: []
        };
    },
    created() {
        this.queryPage({});
    },
    mounted() {
        let elementResizeDetectorMaker = require('element-resize-detector');
        let tableWidth = document.getElementById('table-wrap');
        let pageWidth = document.getElementById('page-wrap-fixed');
        let erd = elementResizeDetectorMaker();
        erd.listenTo(tableWidth, function (element) {
            pageWidth.style.width = element.offsetWidth + 'px';
        });
    },
    methods: {
        /**
         * 格式化 类型
         */
        inspTypeFormat(row, column, cellValue, index) {
            if (cellValue !== '') {
                return translatorDict(DICTDATA.DEVOPS_TASK_TYPE, cellValue);
            } else {
                return '';
            }
        },
        /**
         * 修改
         */
        modify(row) {
            let pushButton = this.$parent.$refs.pushButton;
            pushButton.formInlineInit();
            pushButton.getInspectLibTree();
            pushButton.resetForm();
            pushButton.dialogFormVisible = true;
            getDetail(row.id).then((res) => {
                pushButton.formInline = res.data;
                let map = [];
                map.push(res.data.inspectContentDetVo)
                pushButton.caseSelectTreeData = map;
            });
        },
        /**
         * 查看详情
         */
        detail(row) {
            let dialogDetail = this.$parent.$refs.dialogDetail;
            dialogDetail.formInline = {};
            dialogDetail.caseSelectTreeData = [];
            dialogDetail.dialogDetailVisible = true;
            getDetail(row.id).then((res) => {
                dialogDetail.formInline = res.data;
                dialogDetail.caseSelectTreeData = res.data.inspectContentDetVo.children;
            });
        },
        /**
         * 分页查询
         */
        queryPage(param) {
            queryPage(param).then((res) => {
                this.tableData = res.data.records;

                // 渲染分页控件数据
                this.pageData = {
                    total: res.data.total,
                    current: res.data.current,
                    pageSize: res.data.size
                };
            });
        },
        /**
         * 每页条数变化
         */
        handleSizeChange(val) {
            console.log(this.$parent, 'this.$parent');
            let formInline = this.$parent.$refs.fillBar.formInline;
            this.pageData.pageSize = val;
            formInline.size = this.pageData.pageSize;
            formInline.current = this.pageData.current;
            this.queryPage(formInline);
        },
        /**
         * 点击某页
         */
        handleCurrentChange(val) {
            let formInline = this.$parent.$refs.fillBar.formInline;
            this.pageData.current = val;
            formInline.size = this.pageData.pageSize;
            formInline.current = this.pageData.current;
            this.queryPage(formInline);
        },
        refresh() {
            let formInline = this.$parent.$refs.fillBar.formInline;
            formInline.size = this.pageData.pageSize;
            formInline.current = this.pageData.current;
            this.queryPage(formInline);
        },
        // 导出
        exportTable() {},
        // 启用/停用
        changeStatus(row) {
            var msg = '停用';
            if (row.status == 2) {
                msg = '启用';
            }
            this.$confirm('确认' + msg + '?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: ''
            })
                .then(() => {
                    // 修改状态
                    updateStatus(row.id).then((res) => {
                        if (res.code === '000000') {
                            this.$message({
                                showClose: true,
                                message: msg + '成功！',
                                type: 'success'
                            });

                            // 重新查询数据
                            this.queryPage();
                        } else {
                            this.$message({
                                message: res.mesg,
                                type: 'warning'
                            });
                        }
                    });
                })
                .catch(() => {});
        },
        // 删除
        deleteItem(row) {
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: ''
            })
                .then(() => {
                    remove(row.id).then((res) => {
                        if (res.code === '000000') {
                            this.$message({
                                showClose: true,
                                message: '删除成功！',
                                type: 'success'
                            });

                            // 重新查询数据
                            this.queryPage();
                        } else {
                            this.$message({
                                message: res.mesg,
                                type: 'warning'
                            });
                        }
                    });
                })
                .catch(() => {});
        },
        /**
         * 表格选中
         */
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
    }
};
</script>

<style lang="scss" scoped>
#table-wrap {
    // padding: 0 15px;
    margin-bottom: 55px;
}

.table-link {
    border: 0;
}

.table-link.start {
    color: #07ef32;
}

.table-link.stop {
    color: #ff0000;
}

.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
    margin-bottom: 0;
}

.block {
    display: inline-block;
}

.di {
    position: fixed;
    bottom: 0px;
    background: #f7f7f7;
    z-index: 999;
    text-align: center;
    left: 220px;
    right: 0;
    padding: 10px 0;
    line-height: 25px;
}
</style>
