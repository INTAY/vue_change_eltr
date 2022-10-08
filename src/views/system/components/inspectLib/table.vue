<template>
    <div id="table-wrap">
        <div style="margin-left: 18px">
            <el-button class="listBTN BatchDeleteColor" @click="batchDelete">批量删除</el-button>
        </div>
        <div class="table_width">
            <el-table
                :data="tableData"
                :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                stripe
                @selection-change="handleSelectionChange"
                style="width: 100%; margin-bottom: 20px"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <el-table-column label="名称" show-overflow-tooltip prop="libName"></el-table-column>

                <el-table-column label="上级" show-overflow-tooltip prop="parentName"></el-table-column>
                <el-table-column v-if="showJC == ''" label="使用维度" prop="inspType" show-overflow-tooltip :formatter="inspTypeFormat">
                </el-table-column>
                <el-table-column v-else width="500" label="检查项信息" show-tooltip-when-overflow>
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.inspectLibDetails" :key="index">
                            {{ item.recName + '、' }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width="180" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="modify(scope.row)" class="common-btn">修改</el-button>
                        <el-button v-if="showJC != ''" @click="config(scope.row)" class="widthBTN">配置检查项</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="page-wrap-fixed" id="page-wrap-fixed">
            <el-pagination
                :current-page.sync="pageData.current"
                :page-size="pageData.size"
                :total="pageData.total"
                :page-sizes="[10, 20, 30, 40, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper, slot"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            >
                <span class="el-pagination__jump page-option-wrap">
                    <a class="el-icon-refresh page-option-icon" @click="refresh" href="javascript:;" title="刷新">
                    </a>
                </span>
            </el-pagination>
        </div>

        <!-- 配置弹出层 -->
        <dialog-config ref="dialogConfig" />
        <!-- <el-dialog
      title="配置参数"
      :visible.sync="dialogInspectVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="800px"
    >
  </el-dialog> -->

        <!-- 修改 -->
        <dialog-add ref="dialogAdd" @getTreeTableData="getTreeTableData" />
    </div>
</template>

<script>
import dialogConfig from './dialogConfig';
import dialogAdd from './dialogAdd';
import { queryPage, batchDelete } from '@/api/system/inspectLib';
export default {
    components: {
        dialogConfig,
        dialogAdd
    },
    data() {
        return {
            dialogInspectVisible: false,
            showJC: '', // 是否显示检查项信息
            param: {},
            tableData: [],
            multipleSelection: [],
            pageData: {
                total: 0,
                current: 1,
                size: 10
            }
        };
    },
    created() {
        this.param.parentId = '-1';
        this.queryPage();
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
         * 刷新树和表格数据
         */
        getTreeTableData() {
            // 查询表格数据
            this.param.current = 0;
            this.queryPage();
            // 刷新树
            this.$emit('getInspectLibTree');
        },
        /**
         * 修改
         */
        modify(row) {
            console.log(this.showJC, 'showjc');
            // console.log(this.$parent.$parent.$parent.$refs.dialogAdd.sign,"parent");
            //  this.showJC == '-1' && this.$parent.$parent.$parent.sign = false;
            //  if (  this.showJC == '-1') {
            //  this.$parent.$parent.$parent.$refs.dialogAdd.sign = false;
            // }
            console.log(row, '行数据');
            let dialogAdd = this.$refs.dialogAdd;
            console.log(dialogAdd.sign, '标记');
            dialogAdd.dialogFormVisible = true;
            if (this.showJC == -1) {
                dialogAdd.sign = false;
            } else {
                dialogAdd.sign = true;
            }

            dialogAdd.sizeForm = JSON.parse(JSON.stringify(row));
            dialogAdd.sizeForm.inspType = row.inspType + '';
        },
        /**
         * 查询
         */
        // async queryPage() {
        //     const { data: res } = await queryPage(this.param);
        //     this.tableData = res.records;
        //     this.pageData = {
        //         total: res.total,
        //         current: res.current,
        //         size: res.size
        //     };
        // },
        queryPage() {
            queryPage(this.param).then((res) => {
                this.tableData = res.data.records;
                // console.log(this.tableData, "this.tableData");

                // 分页
                this.pageData = {
                    total: res.data.total,
                    current: res.data.current,
                    size: res.data.size
                };
            });
        },
        /**
         * 批量删除
         */
        batchDelete() {
            let multipleSelection = this.multipleSelection;
            if (multipleSelection.length === 0) {
                this.$message({
                    message: '请选择要删除的数据！',
                    type: 'warning'
                });
            } else {
                this.$confirm('确定要删除吗?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    confirmButtonClass: 'messagebox-button',
                    cancelButtonClass: 'messagebox-button'
                }).then(() => {
                    let ids = [];
                    for (let i in multipleSelection) {
                        ids.push(multipleSelection[i].id);
                    }
                    batchDelete(ids).then((res) => {
                        if (res.code === '000000' && res.data) {
                            this.$message({
                                showClose: true,
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.getTreeTableData();
                        } else {
                            this.$message({
                                message: res.data,
                                type: 'warning'
                            }).catch((err) => {
                                this.$message.error('删除失败');
                            });
                        }
                    });
                });
            }
        },

        /**
         * 检查项弹出层
         */
        config(row) {
            console.log(row, 'row');
            this.$refs.dialogConfig.dialogFormVisible = true;
            this.$refs.dialogConfig.tableData = [];
            this.$refs.dialogConfig.tableDatas.libId = row.id;
            this.$refs.dialogConfig.queryInspectList();
        },
        /**
         * 删除
         */
        // remove(row) {
        //   this.$confirm("确认删除?", "提示", {
        //     confirmButtonText: "确定",
        //     cancelButtonText: "取消",
        //     type: "",
        //   })
        //     .then(() => {
        //       // 调用删除接口
        //       remove(row.id).then((res) => {
        //         if (res.code === "000000" && res.data) {
        //           this.$message({
        //             type: "success",
        //             message: "删除成功!",
        //           });
        //           // 重新查询表格数据和树
        //           this.getTreeTableData();
        //         } else {
        //           this.$message.error(res.mesg);
        //         }
        //       });
        //     })
        //     .catch(() => {});
        // },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        /**
         * 每条页数变化
         */
        handleSizeChange(val) {
            this.pageData.size = val;
            this.pageData.current = 1;
            this.param.size = this.pageData.size;
            this.param.current = this.pageData.current;
            this.queryPage();
        },
        /**
         * 点击某页
         */
        handleCurrentChange(val) {
            this.pageData.current = val;
            this.param.size = this.pageData.size;
            this.param.current = this.pageData.current;
            this.queryPage();
        },
        /**
         * 刷新
         */
        refresh() {
            this.queryPage();
        },
        // 使用维度格式化
        inspTypeFormat(row, column, cellValue, index) {
            if (cellValue == 1) {
                return '站使用';
            }
            if (cellValue == 2) {
                return '桩使用';
            } else {
                return '';
            }
        }
    }
};
</script>
<style lang="scss" scoped>
#table-wrap {
    width: 100%;
}
.table_width {
    padding: 0 15px;
}
.widthBTN {
    width: 70px;
    height: 24px;
    padding: 0px;
    font-size: 12px;
    color: #1396c2 !important;
    background-color: #edf7fb !important;
    border-color: #cbdee7 !important;
}

.widthBTN:focus,
.widthBTN:hover {
    border-color: #1396c2 !important;
}
</style>