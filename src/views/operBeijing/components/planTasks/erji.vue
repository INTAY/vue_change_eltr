<template>
    <div>
        <div style="margin: 7px">
            <el-button class="newButtonColor btnSpace listBTN" @click="addDialogFormVisible" style="margin-left: 7px">新增</el-button>
        </div>
        <!-- 新增 -->
        <el-dialog
            title="新增"
            :visible.sync="dialogFormVisible"
            width="950px"
            class="yw"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
        >
            <!-- 运维模块 -->
            <div class="title"><i />运维模块</div>
            <div class="OpsModule">
                <el-form ref="form" :model="zoneForm" label-width="90px" size="mini">
                    <el-form-item label="模块名称:">
                        <el-select
                            size="mini"
                            filterable
                            class="inputWidth"
                            v-model="modelName"
                            clearable
                            @change="getListByInspId"
                        >
                            <el-option v-for="item in modelNameMap" :key="item.id" :value="item.id" :label="item.inspName"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主模块:">
                        <div class="OpsMain" v-for="(item, index) in modelList" :key="index">
                            <el-popover placement="bottom" width="400" trigger="hover">
                                <el-table :data="item.children" stripe>
                                    <el-table-column type="index" width="50"> </el-table-column>
                                    <el-table-column property="libName" label="子模块名称"></el-table-column>
                                </el-table>
                                <el-button slot="reference" class="btnClass">{{ item.libName }}</el-button>
                            </el-popover>
                        </div>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 站点选择 -->
            <el-row>
                <el-col :span="3">
                    <div class="title"><i />站点选择</div>
                </el-col>
                <el-col :span="2"
                    ><el-button class="newButtonColor staSlect" style="margin: 10px 0 0 -30px" plain @click="selectStation"
                        >选择</el-button
                    ></el-col
                >
                <el-button class="BatchDeleteColor staDel" style="margin-top: 12px" plain @click="delStationData">删除</el-button>
            </el-row>

            <div>
                <el-table
                    :data="stationData"
                    style="width: 100%;"
                    :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                    @selection-change="staChange"
                >
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                    <el-table-column prop="regName" label="区县"></el-table-column>
                    <el-table-column prop="stationName" label="站点名称" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="address" label="站点地址" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="groupName" label="所属部门" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="totalStakeNum" label="总桩数"></el-table-column>
                    <el-table-column prop="zlStakeNum" label="直流充电桩数"></el-table-column>
                    <el-table-column prop="jlStakeNum" label="交流充电桩数"></el-table-column>
                </el-table>
            </div>

            <!-- 确认和取消按钮 -->
            <!-- <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save" class="realButton">确 定</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
            </span> -->

            <span slot="footer" class="dialog-footer">
                <el-button @click="save" size="mini" class="editorBTN btnSpace bouncedHold">确 定</el-button>
                <el-button size="mini" class="editorBTN cancelBTN" @click="dialogFormVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 选择站点 -->
        <el-dialog
            title="站点选择"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            top="30vh"
            :modal="true"
            :visible.sync="selectStationVisible"
            width="60%"
            class="dialogClass selectedDialog"
            show-tooltip-when-overflow
        >
            <el-form :inline="true" :model="stationForm" label-width="84px" class="demo-form-inline">
                <div class="yi">
                    <el-form-item label="区县">
                        <el-select
                            size="mini"
                            class="inputWidth"
                            v-model="stationForm.regId"
                            clearable
                            @change="queryByCondition(stationForm.regId)"
                        >
                            <el-option v-for="item in regionMap" :key="item.id" :value="item.id" :label="item.name"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="站点名称">
                        <el-select size="mini" filterable class="inputWidth" v-model="stationForm.stationId" clearable>
                            <el-option v-for="item in staMap" :key="item.stationId" :value="item.stationId" :label="item.stationName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" class="newButtonColor SearchBTN" @click="stationSubmit(true)">查询</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <div class="chooseTable">
                <el-table
                    :data="selectData"
                    style="width: 100%"
                    :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                    @selection-change="alreadySelectMap"
                    :row-key="getRowkeys"
                    show-tooltip-when-overflow
                    ref="staTable"
                >
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column type="selection" align="center" :reserve-selection="true" width="55"></el-table-column>
                    <el-table-column prop="regName" label="区县" width="180"></el-table-column>
                    <el-table-column prop="stationName" label="站点名称" width="180"></el-table-column>
                    <el-table-column prop="totalStakeNum" label="总桩数"></el-table-column>
                    <el-table-column prop="zlStakeNum" label="直流充电桩数"></el-table-column>
                    <el-table-column prop="jlStakeNum" label="交流充电桩数"></el-table-column>
                    <el-table-column prop="address" label="站点地址"></el-table-column>
                    <el-table-column prop="groupName" label="所属部门"></el-table-column>
                    <el-table-column prop="groupId" label="充电站点运营编码" width="185"></el-table-column>
                </el-table>
                <div class="dl">
                    <el-pagination
                        style="display: inline-block"
                        @size-change="staSizeChange"
                        @current-change="staCurrentChange"
                        :current-page="pageData.current"
                        :page-sizes="[10, 20, 30, 40, 50]"
                        :page-size="pageData.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pageData.total"
                    ></el-pagination>
                    <el-button size="mini" @click="refresh">刷新</el-button>
                </div>
            </div>

            <!-- 确认和取消按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="pushSource" class="realButton">确 定</el-button>
                <el-button @click="selectStationVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { region } from '@/api/platform/generalOverview';
import { batchDelete } from '@/api/property/garden';
import { addTasks, queryStationAndStakeNum, getListByInspId, queryList } from '@/api/operation/planTasks';
import { DICTDATA, getDict } from '@/api/dict';
import Vue from 'vue';

const tonken = Vue.cookie.get('token');

export default {
    data() {
        return {
            stationData: [], //  新增的站点数据
            regionMap: [], //  区县map
            staMap: [], //  站点map
            selectData: [], //  选中的站点数据
            selectStationVisible: false, //  选择站点的弹窗
            stationForm: {},
            modelList: [], //  子模块的遍历
            staChangeMap: [],
            seen: false,
            current: 0,
            modelName: '', //  选择的模块id
            modelNameMap: [], //  下拉框的主模块
            alreadySelection: [], //  站点选择中的以选中
            pageData: {
                total: 0,
                current: 1,
                size: 0
            },
            sign: false,
            checkValue: '',
            upForm: {
                size: '',
                current: '',
                fileType: '',
                name: ''
            },
            currentPage: 1,
            pageSize: 20,
            total: 40,

            dialogFormVisible: false, //  新增的遥控器
            zoneForm: {},
            rules: {
                zoneName: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
                zoneType: [{ required: true, message: '请选择园区类型', trigger: 'change' }],
                orgId: [{ required: true, message: '请选择组织机构', trigger: 'blur' }],
                state: [{ required: true, message: '请选择行政区域', trigger: 'change' }],
                regId: [{ required: true, message: '请选择行政区域', trigger: 'change' }]
            },
            type: []
        };
    },
    mounted() {
        //  查询运维模块列表
        this.getModelMap();
        region(sessionStorage.getItem('regId')).then((res) => {
            if (res.code == '000000') {
                this.regionMap = res.data;
            }
        });
        this.stationSubmit(false);
    },
    methods: {
        getRowkeys(row) {
            return row.stationId;
        },
        //  通过区县查站点
        queryByCondition(arg) {
            let params = { regId: arg, stationName: '', taskType: 7 };
            queryStationAndStakeNum(params).then((res) => {
                if (res.code == '000000') {
                    this.staMap = res.data.records;
                }
            });
        },
        //  查询运维模块列表
        getModelMap() {
            queryList({ inspType: 1 }).then((res) => {
                if (res.code === '000000') {
                    this.modelNameMap = res.data;
                }
            });
        },
        //  获取子模块的信息
        getListByInspId() {
            getListByInspId(this.modelName).then((res) => {
                if (res.code === '000000') {
                    this.modelList = res.data;
                }
            });
        },

        //  模块移入
        mouseEnter(index, id) {
            this.seen = true;
            this.current = index;
            this.childrenModelList = [];
            this.modelList.forEach((item) => {
                item.children.forEach((i) => {
                    if (i.parentId == id) {
                        this.childrenModelList.push(i);
                    }
                });
            });
        },
        //  模块移出
        mouseleave() {
            this.seen = false;
            this.current = null;
        },

        //  站点已选列表
        alreadySelectMap(val) {
            this.alreadySelection = val;
        },
        //  点击站点选择清空待选站点的数据
        selectStation() {
            if (this.alreadySelection.length > 0) {
                this.$refs.staTable.clearSelection();
            }
            this.selectStationVisible = true;
        },

        // 新增页面 已选站点删除
        delStationData() {
            this.staChangeMap.forEach((item) => {
                for (let i = 0; i < this.stationData.length; i++) {
                    if (this.stationData[i].regId === item.regId) {
                        this.stationData.splice(i, 1);
                        break;
                    }
                }
            });
        },
        //  待选页面的确定按钮
        pushSource() {
            this.selectStationVisible = false;
            let arr = [...this.alreadySelection, ...this.stationData];
            this.stationData = this.unique(arr);
        },
        //  站点去重
        unique(arr) {
            //  判断新选的数据。是否
            //  这是判断去重
            const res = new Map();
            return arr.filter((arr) => !res.has(arr.stationId) && res.set(arr.stationId, 1));
        },
        setData() {
            this.type = this.$parent.$parent.type;
        },
        staChange(val) {
            this.staChangeMap = val;
        },
        // 新增
        save() {
            if (!this.modelName) {
                this.$message({ message: '请选择模块名称！', type: 'warning' });
                return;
            }
            let params = {},
                inspectObjs = [];
            this.stationData.length > 0 &&
                this.stationData.forEach((item) => {
                    inspectObjs.push({
                        addr: item.address,
                        regId: item.regId,
                        staId: item.stationId,
                        staName: item.stationName,
                        groupId: item.groupId,
                        acStake: item.jlStakeNum,
                        dcStake: item.zlStakeNum,
                        totalStake: item.totalStakeNum
                    });
                });
            params = {
                inspId: this.modelName,
                inspectObjs: inspectObjs,
                taskType: 1
            };
            addTasks(params)
                .then((res) => {
                    if (res.code === '000000') {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        this.$parent.$parent.$refs.crudForm.getDataInit();
                        this.zoneForm = {};

                        this.modelName = '';
                        this.modelList = [];
                        this.stationData = [];
                        this.stationForm = {};
                        this.selectData = [];
                    } else {
                        this.$message.error(res.data);
                    }
                })
                .catch((err) => {
                    this.$message.error('添加失败');
                });
        },
        // 批量删除
        batchDelete() {
            let multipleSelection = this.$parent.$parent.$refs.crudForm.multipleSelection;
            if (multipleSelection.length === 0) {
                this.$message({
                    message: '请选择要删除的数据！',
                    type: 'warning'
                });
            } else {
                this.$confirm('确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
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
                            this.$parent.$refs.biaoge.getQueryByPage();
                        }
                    });
                });
            }
        },

        //新增dialog显示
        addDialogFormVisible() {
            this.sign = true;
            this.dialogFormVisible = true;
        },
        //  待选站点的查询
        stationSubmit(isSerachBtn) {
            //  如果是点击查询进来的，就从第一页开始查询
            if (isSerachBtn) {
                this.stationForm.current = 1;
            }
            this.stationForm.taskType = 1;
            queryStationAndStakeNum(this.stationForm).then((res) => {
                if (res.code === '000000') {
                    this.selectData = res.data.records;
                    this.pageData = {
                        total: res.data.total,
                        current: res.data.current,
                        pageSize: res.data.size
                    };
                }
            });
        },

        //  =====================分页相关=============
        refresh() {
            this.stationForm.size = this.pageData.size;
            this.stationForm.current = this.pageData.current;
            this.stationSubmit();
        },
        /**
         * 每页条数变化
         */
        staSizeChange(val) {
            this.stationForm.size = val;
            this.stationForm.current = this.pageData.current;
            this.stationSubmit();
        },
        /**
         * 点击某页
         */
        staCurrentChange(val) {
            this.pageData.current = val;
            this.stationForm.size = this.pageData.pageSize;
            this.stationForm.current = val;
            this.stationSubmit();
        }
    }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
    padding: 0 30px 30px;
}

//  主模块鼠标移入移出样式
.main-model {
    display: flex;
    .item-model {
        width: 200px;
        background: rgb(226, 243, 250);
        border: 1px solid rgb(190, 229, 224);
        margin-left: 10px;
        color: #006080;
        text-align: center;
        position: relative;
    }
    .item-table {
        position: absolute;
        // left: 40%;
        top: 100px;
        border: 1px solid #ebebeb;
        box-shadow: #ebebeb 3px 3px 3px 3px;
        z-index: 5;
        background: white;
        padding: 20px;
    }
}
//运维模块
.OpsModule {
    padding: 20px 0 5px;
    box-sizing: border-box;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    //主模块
    .OpsMain {
        position: relative;
        display: inline-block;
        margin-right: 15px;
        //按钮的半透明颜色
        .btnClass {
            color: #187fa2;
            border-radius: 3px;
            border: 1px solid #b9e2f9;
            background-color: #e2f3fa;
        }
        .btnClass:hover {
            color: #187fa2;
            border-radius: 3px;
            border: 1px solid #7ec0db;
            background-color: #c2e5f3;
        }
    }
}
.bg-items {
    padding: 10px 20px;
    background: rgb(248, 248, 248);
}

.title {
    margin: 15px 0;
    // width: 70px;
    i {
        width: 4px;
        height: 14px;
        // display: inline-block;
        background: #24b3ca;
        margin-right: 10px;
        margin-top: 3px;
        float: left;
        border-radius: 5px;
    }
}
.staSlect {
    width: 100px;
    background: #1396c2;
    color: white;
    border-radius: 5px;
    margin-left: -10px;
}
.staDel {
    width: 100px;
    background: white;
    color: rgb(211, 47, 46);
    border-radius: 3px;
    float: right;
    border: 1px solid rgb(211, 47, 46);
}

.selectedDialog {
    //选择 -- 已选
    .selected {
        position: relative;
        font-size: 14px;
        padding: 0 90px 0 120px;
        border-bottom: 1px solid #dfdfdf;
        background-color: #f5f5f5;
        box-sizing: border-box;
        //已选
        .chonse {
            position: absolute;
            color: #232323;
            top: 21px;
            left: 45px;
            .number {
                color: #017aa2;
            }
        }
        //更多
        .more {
            display: flex;
            position: absolute;
            top: 21px;
            right: 30px;
            color: #2684a8;
            cursor: pointer;
            i {
                margin: 2px 0 0 4px;
                font-size: 14px;
                font-weight: 600;
                color: #858585;
            }
        }
        //标签
        .selectedTags {
            width: 100%;
            height: 100%;
            padding-top: 10px;
            .el-tag {
                margin: 8px 8px 5px 0;
                /deep/ .el-icon-close {
                    color: #d30000;
                    font-size: 18px;
                }
            }
        }
    }
    .selected_immobilizationhight {
        height: 60px;
        overflow: hidden;
    }
    .selected_outHight {
        height: auto;
        padding-bottom: 15px;
    }
}
.chooseTable {
    padding: 10px 55px 0 45px;
}
.yi {
    margin-top: 10px;
}
.dl {
    background: #f7f7f7;
    z-index: 999;
    text-align: center;
    left: 220px;
    right: 0;
    padding: 10px 0;
    line-height: 25px;
}
/deep/ .el-form-item__label {
    color: #909090 !important;
}
</style>
