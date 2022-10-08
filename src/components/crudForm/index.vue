/*
* @name : 表格框架页组件
* @author : FuYaJuan
* @参数 { fieldList :  {Array} 表格字段 }
* @参数 { queryParam :  {Object} 查询条件对象 }
* @参数 { api :  {Function} 查询接口函数 }
* @参数 { exportFn : {Function()} 分页中的导出函数 }
* @参数 { showIndex :  {Boolean} 是否显示序号，默认显示 }
* @参数 { showColumnSetting :  {Boolean} 是否开启动态列设置，默认显示 }
* @参数 { showExportBtn :  {Boolean} 是否显示导出按钮，默认显示 }
* @参数 { showCellClick :  {Boolean} 是否开启动态列设置，默认关闭 }
* @参数 { showCheckbox :  {Boolean} 是否显示复选框， 默认显示 }
* @参数 { page :  {Boolean} 是否带分页， 默认带分页 }
* @参数 { fixed :  {String} 列是否固定在左侧或者右侧，默认右侧 }
* @参数 { tableOptionWidth : {String} 最后一列的宽度 }
* @参数 { sortBy:后端翻译的表格字段要在fieldList中加上未翻译之前的字段名,否则会影响后端排序,不需要排序功能的列加上noSort:true 用法示例{ name: "组织机构", value: "orgName" ,sortBy:"orgId",noSort:true}}
* @参数 { showCellClick :  {Boolean} 是否开启动态列设置，默认关闭 }
* @事件 { getDataInit :  {Function()} 重新查询第一页的表格数据 }
* @事件 { handleCurrentChange :  {Function()} 重新查询当前页的表格数据 }
* @事件 { getMultipleSelection : {Function()} 获取表格多行选中的数据 }
* @version 1.0
* @edit: 2020/05/20
*/

<template>
    <div>
        <div class="s-o-t-wrap">
            <!--查询条件 -->
            <div class="search-wrap" v-if="searShow">
                <slot name="searchBar" />
            </div>

            <!-- 操作 -->
            <div class="table-top-option-wrap" v-if="btnShow">
                <div class="left">
                    <slot name="tableTopOptionLeft" />
                </div>
                <div class="right">
                    <slot name="tableTopOptionRight" />
                </div>
            </div>

            <!-- 表格   v-loading="loading" element-loading-text="加载中..." -->
            <div class="table-wrap" id="table-wrap">
                <el-table
                    ref="crudForm"
                    :data="tableData"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                    @cell-click="cellClick"
                    header-row-class-name="table-header"
                    cell-class-name="table-body-td"
                    :cell-style="columnStyle"
                    stripe
                >
                    <el-table-column v-if="showIndex" type="index" width="50" align="center" />
                    <el-table-column v-if="showCheckbox" type="selection" width="55" align="center" />
                    <el-table-column
                        v-for="(item, index) in fieldList.filter((item) => !item.hidden)"
                        :key="index"
                        :label="item.name"
                        :prop="item.value"
                        :width="item.width"
                        show="true"
                        v-if="item.show"
                        :sortable="item.noSort ? false : 'custom'"
                        :formatter="item.formatter ? item.formatter : null"
                        :sort-by="item.sortBy ? item.sortBy : item.value"
                        show-tooltip-when-overflow
                    >
                        <template slot-scope="scope">
                            <el-button
                                class="click_cell"
                                v-if="item.type === 'link'"
                                type="text"
                                size="small"
                                @click="item.clickFn(scope.row)"
                                >{{ item.formatter ? item.formatter(scope.row) : scope.row[item.value] }}</el-button>
                            <template v-else>{{ item.formatter ? item.formatter(scope.row) : scope.row[item.value] }}</template>
                        </template>
                    </el-table-column>
                    <el-table-column :fixed="fixed" :width="tableOptionWidth" :label="tableOptionName" align="left" v-if="showColumnHandle">
                        <template slot-scope="scope">
                            <slot name="tableOption" :row="scope.row" />
                        </template>
                    </el-table-column>

                    <el-table-column width="40" :fixed="fixed" v-if="showColumnSetting">
                        <template slot="header">
                            <el-popover placement="bottom" min-width="80" trigger="click" popper-class="col-setting-popover">
                                <el-button
                                    class="set_btn"
                                    slot="reference"
                                    type="text"
                                    icon="el-icon-setting"
                                    style="padding: 0; border-color: #f1f1f1"
                                    title="展示列设置"
                                ></el-button>
                                <div class="col-setting-title">展示列设置</div>
                                <el-checkbox-group v-model="colOptions" :min="1" class="col-setting-group">
                                    <el-checkbox v-for="item in colSelect" :label="item" :key="item">{{ item }}</el-checkbox>
                                </el-checkbox-group>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <!-- 分页 -->
        <div class="page-wrap-fixed" v-if="page" id="page-wrap-fixed">
            <el-pagination
                :current-page.sync="listInfo.query.current"
                :page-size="listInfo.query.size"
                :total="listInfo.pageTotal"
                :page-sizes="[10, 20, 30, 40, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper, slot"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            >
                <span class="el-pagination__jump page-option-wrap">
                    <span v-if="showExportBtn">
                        <a class="el-icon-upload2 page-option-icon" href="javascript:;" @click="exportTable" title="导出"> </a>
                        <i class="split-line"></i>
                    </span>

                    <span>
                        <a class="el-icon-refresh page-option-icon" href="javascript:;" @click="refresh" title="刷新"> </a>
                    </span>
                </span>
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CRUDForm',
    props: {
        // 表格字段配置
        fieldList: {
            type: Array,
            default: []
        },
        // 查询条件
        queryParam: {
            type: Object,
            default: {}
        },
        // 获取数据的接口
        api: {
            type: Function
        },
        // 导出
        exportFn: {
            type: Function
        },
        // 最后一列显示的列名
        tableOptionName: {
            type: String,
            default: '操作'
        },
        // 是否带分页
        page: {
            type: Boolean,
            default: true
        },
        // 表格是否显示序号
        showIndex: {
            type: Boolean,
            default: true
        },
        // 表格是否显示复选框
        showCheckbox: {
            type: Boolean,
            default: true
        },
        // 列是否固定在左侧或者右侧
        fixed: {
            type: String,
            default: 'right'
        },
        // 最后一列的宽度
        tableOptionWidth: {
            type: Number,
            default: 220
        },
        // 是否开启动态列设置
        showColumnSetting: {
            type: Boolean,
            default: true
        },
        // 是否显示导出按钮
        showExportBtn: {
            type: Boolean,
            default: true
        },
        // 是否显示操作列
        showColumnHandle: {
            type: Boolean,
            default: true
        },
        columnNum: {
            type: Number,
            default: 8
        },
        searShow: {
            type: Boolean,
            default: true
        },
        btnShow: {
            type: Boolean,
            default: true
        }
    },
    components: {},
    data() {
        return {
            colOptions: [],
            colSelect: [],
            tableData: [],
            exportData: {
                headers: [],
                values: []
            },
            multipleSelection: [],
            // loading: false,
            listInfo: {
                pageTotal: 0, // 总条数
                pageSizes: [5, 10, 20, 50, 100], // 分页数量列表
                query: {
                    // 查询条件
                    current: 1, // 当前页
                    size: 20 // 每页条数
                }
            }
        };
    },
    created() {
        this.getData(this.api);
    },
    mounted() {
        let elementResizeDetectorMaker = require('element-resize-detector');
        let tableWidth = document.getElementById('table-wrap');
        let pageWidth = document.getElementById('page-wrap-fixed');
        let erd = elementResizeDetectorMaker();
        erd.listenTo(tableWidth, function (element) {
            pageWidth.style.width = element.offsetWidth + 'px';
        });
        for (let i = 0; i < this.fieldList.length; i++) {
            this.colSelect.push(this.fieldList[i].name);
            if (this.showColumnSetting) {
                if (this.colSelect.length > Number(this.columnNum)) {
                    continue;
                }
            }
            this.colOptions.push(this.fieldList[i].name);
        }
    },
    watch: {
        colOptions(colArr) {
            let self = this;
            for (let i in self.fieldList) {
                if (colArr.indexOf(self.fieldList[i].name) === -1) {
                    self.fieldList[i].show = false;
                } else {
                    self.fieldList[i].show = true;
                }
            }
        }
        // queryParam(val) {
        //     console.log(val);
        //     if (val) {
        //         this.getData(this.api);
        //     }
        // }
    },
    beforeUpdate() {
        this.$nextTick(() => {
            this.$refs.crudForm.doLayout();
        });
    },
    methods: {
        // 分页-刷新
        refresh() {
            this.getData(this.api);
        },
        // 导出
        exportTable() {
            if (!this.tableData.length) {
                this.$message({
                    showClose: true,
                    message: '列表数据为空,无法导出!',
                    type: 'warning'
                });
                return;
            }
            this.exportData.headers = [];
            this.exportData.values = [];
            for (let i = 0; i < this.fieldList.length; i++) {
                if (this.fieldList[i].show == true) {
                    this.exportData.headers.push(this.fieldList[i].name);
                    this.exportData.values.push(this.fieldList[i].value);
                }
            }
            this.exportFn ? this.exportFn() : null;
        },
        // 表格多行选中
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 获取表格多行选择的数据
        getMultipleSelection() {
            return this.multipleSelection;
        },
        // 调用接口 获取数据
        getData(api) {
            // this.loading = true;
            return new Promise((resolve, reject) => {
                api(this.handleParams())
                    .then((res) => {
                        // this.loading = false;
                        if (res.code === '000000') {
                            const d = res.data;
                            // 区分list和分页
                            if (!!d.records) {
                                this.tableData = d.records;
                            } else {
                                this.tableData = res.data;
                            }

                            this.listInfo.pageTotal = d.total;
                            this.listInfo.query.size = d.size;
                            this.listInfo.query.current = d.current;
                        } else {
                            this.$message.error(res.data);
                        }
                    })
                    .catch((err) => {
                        // this.loading = false;
                        this.$message.error('数据加载失败!');
                    });
            });
        },
        // 重新查询第一页的表格数据
        getDataInit() {
            this.getData(this.api);
        },
        // 处理接口调用所需的参数
        handleParams() {
            const obj = {};
            for (const key in this.queryParam) {
                if (this.queryParam[key] || this.queryParam[key] === 0) {
                    obj[key] = this.queryParam[key];
                }
            }
            return { ...this.listInfo.query, ...obj };
        },
        // pageSize 改变时会触发
        handleSizeChange(val) {
            const query = this.listInfo.query;
            query.size = val; // 每页条数
            query.current = 1; // 每页条数切换，重置当前页
            this.getData(this.api);
        },
        // currentPage 改变时会触发
        handleCurrentChange(val) {
            this.listInfo.query.current = val; // 当前页
            this.getData(this.api);
        },
        // 列排序
        sortChange(column) {
            this.queryParam.sortColumn = column.column.sortBy;
            if (column.order === 'ascending') {
                this.queryParam.order = 'asc';
            } else {
                this.queryParam.order = 'desc';
            }

            this.getData(this.api);
        },
        // 点击列
        columnStyle(row, column, rowIndex, columnIndex) {
            for (let i = 0; i < this.fieldList.length; i++) {
                if (!!this.fieldList[i].clickable) {
                    if (row.column.label == this.fieldList[i].name) {
                        return 'color: #1396c2; cursor: pointer;';
                    } else {
                        continue;
                    }
                }
            }
        },
        // 表格点击事件
        cellClick(row, column, cell, event) {
            this.$emit('cell-click', row, column, cell, event);
        }
    }
};
</script>

<style lang="scss" scoped>
.pagetable {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 100%;
    height: 40px;
    background-color: #f1f1f1;
    .el-pagination {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        span,
        a {
            display: inline-block;
        }
        a {
            width: 20px;
            height: 23px;
            color: #1396c2;
            font-size: 14px;
            font-weight: 800;
            margin-right: 16px;
        }
    }
}
.s-o-t-wrap {
    margin-bottom: 45px;
}

.search-wrap {
    background-color: #fcfcfc;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 16px 30px 6px;

    /deep/ .el-input {
        width: 180px;
    }
    /deep/ .el-date-editor.el-input__inner {
        width: 180px;
    }
    /deep/ .el-form-item {
        margin: 0 15px 8px 0;
    }
    /deep/ .el-form-item__label {
        width: 91px;
        text-align: right;
    }
    /deep/ .el-range-editor .el-range__icon,
    /deep/ .el-range-editor {
        padding-right: 0;
        display: none;
    }
    /deep/ .el-range__close-icon {
        color: #c0c4cc;
        font-size: 13px;
        width: 15px;
    }
}

.table-top-option-wrap {
    margin: 10px 15px;
    overflow: hidden;

    .left {
        float: left;

        >>> .el-button--primary {
            width: 120px;
            height: 32px;
            border-radius: 2px;
        }
    }
    .right {
        float: right;

        >>> .el-button {
            width: 120px;
            height: 32px;
            border-radius: 2px;
        }
    }
}

.table-wrap {
    padding: 0 15px;
    .el-table th {
        padding: 2px 0;
    }
    /deep/ .el-table__header th {
        padding: 5px 0 0 !important;
        font-size: 13px !important;
    }
    .click_cell {
        color: #1396c2 !important;
        font-size: 14px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
    }
    .set_btn {
        color: #1396c2 !important;
        font-size: 13px;
        border: none;
    }
}
.table-wrap >>> .table-header {
    background-color: #f1f1f1;
    color: #232323;
    font-weight: bold;

    th {
        background-color: #f1f1f1;
    }
}
.table-wrap >>> .table-body-td {
    color: #232323;
    padding: 3px 0;
}
>>> .el-table--striped .el-table__body tr.el-table__row--striped.el-table__row--striped.el-table__row--striped td {
    background-color: #f7f7f7 !important; /*替换为你需要的颜色，觉得优先级不够就加!important*/
}
</style>