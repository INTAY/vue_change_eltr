<template>
    <div class="paddingLeft" style="padding-bottom: 100px;white-space: nowrap;">
        <div class="table-top">
            <div class="table-top-a">
                <div class="table-info green"></div>&nbsp;
                <span style="color: rgb(40,176,114);font-size: 14px;">及时&nbsp;&nbsp;&nbsp;</span>
                <div class="table-info red"></div>&nbsp;
                <span style="color: rgb(237, 110, 109);font-size: 14px;">不及时&nbsp;&nbsp;&nbsp;</span>
                <div class="table-info orange"></div>&nbsp;
                <span style="color: rgb(228, 140, 53);font-size: 14px">延迟或不稳定</span>
            </div>
        </div>
        <el-table :data="tableData" ref="tableSour" :header-cell-style="{background:'#f1f1f1',color:'#000'}" @sort-change="changeSort"  stripe style="width: 100%;">
            <el-table-column  type="index" width="50" align="left"  sortable show-tooltip-when-overflow  label="序号"/>
            <el-table-column label="区县" prop="regId" align="left" v-if="colData[0].istrue"  sortable show-tooltip-when-overflow />
            <el-table-column label="站点" prop="stationId" align="left" v-if="colData[1].istrue"  sortable width="200" show-tooltip-when-overflow />
            <el-table-column label="充电桩编号" prop="stakeId" align="left" v-if="colData[2].istrue"  sortable width="200" show-tooltip-when-overflow />
            <el-table-column label="充电枪编号" prop="connectorId" align="left" v-if="colData[3].istrue"  sortable width="200" show-tooltip-when-overflow />
            <el-table-column label="采集时间" prop="fesSampTime" align="left" v-if="colData[4].istrue"  sortable width="200" show-tooltip-when-overflow />
            <el-table-column label="推送备注" prop="msg" align="left" v-if="colData[5].istrue"  sortable width="200" show-tooltip-when-overflow />
            <el-table-column label="反馈时间" prop="respTime" align="left" v-if="colData[6].istrue"  sortable width="200" show-tooltip-when-overflow />
            <el-table-column label="上传时间" prop="sampTime" align="left"  v-if="colData[7].istrue" sortable width="200" show-tooltip-when-overflow />
            <el-table-column label="前置状态" prop="preState" align="left" v-if="colData[8].istrue"  sortable width="200" show-tooltip-when-overflow/>
            <el-table-column label="接收时间" prop="receiveTime" align="left"  v-if="colData[9].istrue" sortable show-tooltip-when-overflow width="180"/>
            <el-table-column label="接收健康值" prop="receiveHealth" align="left" v-if="colData[10].istrue" sortable width="90">
                <template slot-scope="scope">
                    <div class="table-inlines red" v-if="scope.row.receiveHealth == 0" @click="getHealth(scope.row)"></div>
                    <div class="table-inlines green" v-if="scope.row.receiveHealth == 1" @click="getHealth(scope.row)"></div>
                    <div class="table-inlines orange" v-if="scope.row.receiveHealth == 2" @click="getHealth(scope.row)"></div>
                </template>
            </el-table-column>
            <el-table-column label="推送状态" prop="status"  v-if="colData[11].istrue" align="left" sortable width="200" show-tooltip-when-overflow />
            <el-table-column label="推送时间" prop="reqTime" v-if="colData[12].istrue"  align="left" sortable width="200" show-tooltip-when-overflow />
            <el-table-column label="推送结果" prop="ret" v-if="colData[13].istrue"  align="left" sortable width="200" show-tooltip-when-overflow />
            <el-table-column label="推送健康值" prop="pushHealth" align="left" v-if="colData[14].istrue"  sortable width="90">
                <template slot-scope="scope">
                    <div
                        class="table-inlines red"
                        v-if="scope.row.pushHealth == 0"
                        @click="pushHealth(scope.row)"
                    ></div>
                    <div
                        class="table-inlines green"
                        v-if="scope.row.pushHealth == 1"
                        @click="pushHealth(scope.row)"
                    ></div>
                    <div
                        class="table-inlines orange"
                        v-if="scope.row.pushHealth == 2"
                        @click="pushHealth(scope.row)"
                    ></div>
                </template>
            </el-table-column>
            <el-table-column width="40" fixed="right">
                <template slot="header">
                    <el-popover placement="bottom" min-width="80" trigger="click" popper-class="col-setting-popover" >
                    <el-button slot="reference" size="small" type="text" icon="el-icon-setting" style="padding:0; border-color:#f1f1f1;"></el-button>
                    <div class="col-setting-title">展示列设置</div>
                    <el-checkbox-group style="height: 600px;overflow-y: scroll;" v-model="colOptions" :min="1" class="col-setting-group">
                        <el-checkbox v-for="item in colSelect" :label="item" :key="item">{{item}}</el-checkbox>
                    </el-checkbox-group>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <div>
            <el-dialog title="当天24小时所有接收记录" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="getRecordDialog">
                <div style="width: 12px;height: 12px;background:rgb(40, 176, 114);display: inline-block;"></div>&nbsp;&nbsp;当前接收记录
                <el-table
                    :data="getTableData"
                    stripe
                    style="font-size: 14px"
                    :header-cell-style="{background:'#f1f1f1',color:'#000'}"
                    highlight-current-row
                    :row-style="rowClass"
                >
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column
                        label="(充电设施)上传时间"
                        prop="sampTime"
                        align="left"
                        show-tooltip-when-overflow
                    />
                    <el-table-column
                        label="(前置模块)采集时间"
                        prop="fesSampTime"
                        align="left"
                        show-tooltip-when-overflow
                    />
                    <el-table-column
                        label="(省级应用)接收时间"
                        prop="receiveTime"
                        align="left"
                        show-tooltip-when-overflow
                    />
                    <el-table-column
                        label="接收延时(ms)"
                        prop="delayInfo"
                        align="left"
                        show-tooltip-when-overflow
                    />
                </el-table>
                <div class="di">
                    <el-pagination
                        style="display: inline-block"
                        @size-change="handleSizeChange1"
                        @current-change="handleCurrentChange1"
                        :current-page="getPageData.current"
                        :page-sizes="[10, 20, 30, 40, 50]"
                        :page-size="getPageData.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="getPageData.total"
                    ></el-pagination>
                    <el-button size="mini" @click="refresh1">刷新</el-button>
                </div>
            </el-dialog>
            <el-dialog
                title="当天24小时所有推送记录"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                :visible.sync="pushRecordDialog"
                width="50%"
                :row-style="rowClass"
            >
                <div style="width: 12px;height: 12px;background: rgb(40, 176, 114);display: inline-block;"></div>&nbsp;&nbsp;当前接收记录
                <el-table
                    :data="pushTableData"
                    stripe
                    style="font-size: 14px"
                    :header-cell-style="{background:'#f1f1f1',color:'#000'}"
                    highlight-current-row
                >
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column
                        label="(省级应用)推送时间"
                        prop="reqTime"
                        align="left"
                        show-tooltip-when-overflow
                    />
                    <el-table-column
                        label="推送结果"
                        prop="result"
                        align="left"
                        show-tooltip-when-overflow
                    />
                    <el-table-column
                        label="推送备注"
                        prop="note"
                        align="left"
                        show-tooltip-when-overflow
                    />
                    <el-table-column
                        label="(e充网)反馈时间"
                        prop="respTime"
                        align="left"
                        show-tooltip-when-overflow
                    />
                    <el-table-column
                        label="推送延时"
                        prop="delayInfo"
                        align="left"
                        show-tooltip-when-overflow
                    />
                </el-table>
                <div class="di">
                    <el-pagination
                        style="display: inline-block"
                        @size-change="handleSizeChange2"
                        @current-change="handleCurrentChange2"
                        :current-page="pushPageData.current"
                        :page-sizes="[10, 20, 30, 40, 50]"
                        :page-size="pushPageData.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pushPageData.total"
                    ></el-pagination>
                    <el-button size="mini" @click="refresh2">刷新</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { queryByPage, dispatchById, confirmedById, getDetails, queryUser } from '../../../../api/operation/orderManage';
import { stateMonitor, queryPushList, queryReceiveList } from '@/api/platform/generalOverview';
import moment from 'moment';
import { DICTDATA, translatorDict } from '@/api/dict';
export default {
    data() {
        return {
            yesterday: '',
            getRecordDialog: false,
            pushRecordDialog: false,
            pushTableData: [],
            pageData: {
                total: 0,
                current: 1,
                size: 10
            },
            pushPageData: {
                total: 0,
                current: 1,
                size: 10
            },
            getPageData: {
                total: 0,
                current: 1,
                size: 10
            },
            exampleData: {},
            tableData: [],
            getTableData: [],
            getParams: {
                stakeNo: '',
                size: '',
                current: '',
            },
            pushParams: {
                stakeNo: '',
                size: '',
                current: '',
            },
            colData: [
                { title: "区县", istrue: true },
                { title: "站点", istrue: true },
                { title: "充电桩编号", istrue: true },
                { title: "充电枪编号", istrue: true },
                { title: "采集时间", istrue: true },
                { title: "推送备注", istrue: true },
                { title: "反馈时间", istrue: true },
                { title: "上传时间", istrue: true },
                { title: "前置状态", istrue: true },
                { title: "接收时间", istrue: true },
                { title: "接收健康值", istrue: true },
                { title: "推送状态", istrue: true },
                { title: "推送时间", istrue: true },
                { title: "推送结果", istrue: true },
                { title: "推送健康值", istrue: true },
            ],
            colOptions: [],
            colSelect: [],
            currentId: ''
        };
    },
    created () {
        let _this = this;
        for (let i = 0; i < _this.colData.length; i++) {
            _this.colSelect.push(_this.colData[i].title);
            if (_this.colSelect.length > 22) {
                continue;
            }
            _this.colOptions.push(_this.colData[i].title);
        }
    },
    watch: {
        colOptions(valArr) {
        var arr = this.colSelect.filter((i) => valArr.indexOf(i) < 0);
        this.colData.filter((i) => {
            if (arr.indexOf(i.title) != -1) {
            i.istrue = false;
            this.$nextTick(() => {
                // this.$refs.tableDataRef.doLayout();
            });
            } else {
            i.istrue = true;
            this.$nextTick(() => {
                // this.$refs.tableDataRef.doLayout();
            });
            }
        });
        },
    },
    mounted() {
        moment.locale('zh-cn');
        let today = {};
        let _today = moment();
        this.yesterday = _today.subtract(1, 'days').format('YYYY-MM-DD'); /*前一天的时间*/
        //  只有在不是路由挑过来的时候调用
        if(Object.values(this.$route.params).length==0) {
            this.queryPage({
                pushTimeEnd:this.yesterday,
                pushTimeStart: this.yesterday,
                sortCol: 'reqTime',
                sortType: -1
            })
        }
        
    },
    methods: {
        rowClass(row, index) {
            if (row.row.id == this.currentId) {
                return {"background-color": "rgb(40,176,114)"}
            }
        },
        changeSort (val) {
            if(val.order == null) return

            let orderSort;
            //  升序
            if(val.order && val.order == "ascending") {
                orderSort = 1
            }
            //  降序
            if(val.order == "descending") {
                orderSort = -1  
            }
            let params = this.$parent.$refs.fillBar.formInline
            if (params.getTime && params.getTime.length > 0) {
                params.pushTimeEnd = moment(params.getTime[1]).format("YYYY-MM-DD")
                params.pushTimeStart = moment(params.getTime[0]).format("YYYY-MM-DD")
            }
            delete params.getTime
            params.sortCol = val.prop
            params.sortType = orderSort
            this.queryPage(params)
        },
        forwardStatusFor(value) {
            if (value == '0001') {
                return '故障';
            } else if (value == '0002') {
                return '待机';
            } else if (value == '0003') {
                return '工作';
            } else if (value == '0004') {
                return '离线';
            } else if (value == '0005') {
                return '充满';
            } else {
                return '充电暂停';
            }
        },
        queryPage(param) {
            stateMonitor(param).then((res) => {
                this.tableData = res.data.records;
                // 渲染分页控件数据
                this.pageData = {
                    total: res.data.total,
                    current: res.data.current,
                    size: res.data.size
                };
                this.$parent.$refs.pageModule.pageData = this.pageData;
            });
        },
        getHealth(arg) {
            this.currentId = arg.id
            // this.getPageData = arg
            this.getParams = {
                stakeNo: arg.stakeId,
                size: this.getPageData.size,
                current: this.getPageData.current
            };
            this.getRecordDialog = true;
            queryReceiveList(this.getParams).then((res) => {
                this.getTableData = res.data.records;
                this.getPageData = {
                    total: res.data.total,
                    current: res.data.current,
                    size: res.data.size
                };
            });
        },
        pushHealth(arg) {
            this.currentId = arg.id
            this.pushParams = {
                stakeNo: arg.stakeId,
                size: this.pushPageData.size,
                current: this.pushPageData.current
            };
            this.pushRecordDialog = true;
            queryPushList(this.pushParams).then((res) => {
                this.pushTableData = res.data.records;
                this.pushPageData = {
                    total: res.data.total,
                    current: res.data.current,
                    size: res.data.size
                };
            });
        },
        refresh1() {
            let param = {
                stakeId: this.getParams.stakeNo
            }
            this.getHealth(param);
        },
        refresh2() {
            let param = {
                stakeId: this.pushParams.stakeNo
            }
            this.pushHealth(param);
        },
        handleSizeChange1(val) {
            let param = {
                stakeId: this.getParams.stakeNo
            }
            this.getPageData.size = val;
            this.getHealth(param);
        },
        handleCurrentChange1(val) {
            this.getPageData.current = val;
            let param = {
                stakeId: this.getParams.stakeNo
            }
            this.getHealth(param);
        },
        handleSizeChange2(val) {
            let param = {
                stakeId: this.pushParams.stakeNo
            }
            this.pushPageData.size = val;
            this.pushHealth(param);
        },
        handleCurrentChange2(val) {
            let param = {
                stakeId: this.pushParams.stakeNo
            }
            this.pushPageData.current = val;
            this.pushHealth(param);
        }
    }
};
</script>

<style lang="scss" scoped>
.paddingLeft {
    //全局布局
    padding: 0 20px;
}
.el-form-item__label {
    width: 80px;
}
/deep/ .el-table {
    background-color: #f2f2f2;
}

.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}

.form-item-title {
    font-size: 16px;
    line-height: 30px;
    color: #434343;
    margin-bottom: 5px;
    .line {
        display: inline-block;
        vertical-align: middle;
        width: 4px;
        height: 14px;
        margin-right: 10px;
        background-color: #24b3ca;
        border-radius: 4px;
    }
}

td.el-table__expanded-cell {
    background-color: #f2f2f2;
}
textarea {
    width: 100%;
    min-height: 100px;
}
.dialog-p {
    text-align: center;
}
.form-item-content {
    background-color: #fcfcfc;
    border: 1px solid #eee;
    padding: 15px;
}
.disable-label {
    color: #c0c0c0 !important;
}
.table-inlines {
    width: 60px;
    height: 20px;
}
.green {
    background-color: rgb(40, 176, 114);
    cursor: pointer;
    margin: 0 auto;
    margin-top: 7px;
}
.green:hover,
.green:focus {
    background-color: rgb(82, 202, 148);
}

.red {
    background-color: rgb(237, 110, 109);
    margin: 0 auto;
    cursor: pointer;
    margin-top: 7px;
}
.red:hover,
.red:focus {
    background-color: rgb(238, 130, 130);
}

.orange {
    background-color: rgb(228, 140, 53);
    margin: 0 auto;
    cursor: pointer;
    margin-top: 7px;
}
.bg-247 {
    background-color: rgb(247, 247, 247);
}
.bg-235 {
    background-color: rgb(235, 235, 235);
}
.table-info {
    width: 10px;
    height: 10px;
    display: inline-block;
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
.table-top {
    display: flex;
    justify-content: flex-end;
}
.table-top-a {
    width: 249px;
}
/deep/ .el-dialog__body {
    padding: 30px 40px 30px 50px;
}
.di {
    margin-top: 20px;
}
</style>
