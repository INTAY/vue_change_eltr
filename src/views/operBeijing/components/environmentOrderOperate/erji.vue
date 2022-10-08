<template>
    <div>
        <div class="s">
            <el-button class="newButtonColor btnSpace listBTN" @click="addDialogFormVisible" style="margin-left: 7px">新增</el-button>
        </div>
        <!-- 新增 -->
        <el-dialog
            title="新增"
            :visible.sync="dialogFormVisible"
            width="60%"
            class="yw"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
        >
            <el-form ref="form" :model="zoneForm" label-width="110px" size="small" :rules="rules">
                <!-- 运维模块 -->
                <div class="title"><i />运维模块</div>
                <div class="bg-items">
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="模块名称：">
                                <el-select
                                    size="mini"
                                    filterable
                                    class="inputWidth"
                                    v-model="modelName"
                                    style="margin-left: 10px"
                                    clearable
                                    @change="getListByInspId"
                                >
                                    <el-option v-for="item in modelNameMap" :key="item.id" :value="item.id" :label="item.inspName">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="主模块：">
                                <!-- 模块移入移出 -->
                                <div class="main-model">
                                    <div
                                        v-for="(item, index) in modelList"
                                        :key="item.id"
                                        class="item-model"
                                        @mouseenter="mouseEnter(index, item.id)"
                                        @mouseleave="mouseleave()"
                                    >
                                        {{ item.lable }}
                                        <!-- 遍历项 -->
                                        <div v-show="seen && index == current" class="item-table">
                                            <el-table
                                                :data="modelList"
                                                style="width: 500px"
                                                :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                                                @selection-change="handleSelectionChange"
                                            >
                                                <el-table-column type="index" width="50" />
                                                <el-table-column prop="lable" label="子模块名称"></el-table-column>
                                            </el-table>
                                        </div>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <!-- 站点选择 -->
                <el-row>
                    <el-col :span="3">
                        <div class="title"><i />站点选择</div>
                    </el-col>
                    <el-col :span="2"
                        ><el-button class="staSlect" style="margin-top: 14px" plain @click="selectStationVisible = true"
                            >选择</el-button
                        ></el-col
                    >
                    <el-button class="staDel" style="margin-top: 14px" plain @click="delStationData">删除</el-button>
                </el-row>
                <div style="padding: 0 20px">
                    <el-table
                        :data="stationData"
                        style="width: 100%"
                        :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                        @selection-change="staChange"
                    >
                        <el-table-column type="index" width="50" label="序号" />
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                        <el-table-column prop="regName" label="区县" width="180"></el-table-column>
                        <el-table-column prop="stationName" label="站点名称" width="180"></el-table-column>
                        <el-table-column prop="address" label="站点地址"></el-table-column>
                        <el-table-column prop="totalStakeNum" label="总桩数"></el-table-column>
                        <el-table-column prop="zlStakeNum" label="直流充电桩数"></el-table-column>
                        <el-table-column prop="jlStakeNum" label="交流充电桩数"></el-table-column>
                    </el-table>
                </div>
            </el-form>

            <div class="nn">
                <el-button size="mini" @click="save" class="bouncedHold editorBTN btnSpace">确定</el-button>
                <el-button size="mini" @click="quxiao" class="cancelBTN editorBTN">取消</el-button>
            </div>
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
            class="dialogClass"
        >
            <el-form :inline="true" :model="stationForm" label-width="120px" class="demo-form-inline">
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
                            <el-option v-for="item in staMap" :key="item.id" :value="item.id" :label="item.name"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" class="newButtonColor SearchBTN" @click="stationSubmit()">查询</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <el-table
                :data="selectData"
                style="width: 100%"
                :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                @selection-change="alreadySelectMap"
            >
                <el-table-column type="index" width="50" label="序号" />
                <el-table-column type="selection" align="center" width="55"></el-table-column>
                <el-table-column prop="regName" label="区县" width="180"></el-table-column>
                <el-table-column prop="stationName" label="站点名称" width="180"></el-table-column>
                <el-table-column prop="address" label="站点地址"></el-table-column>
                <el-table-column prop="totalStakeNum" label="总桩数"></el-table-column>
                <el-table-column prop="zlStakeNum" label="直流充电桩数"></el-table-column>
                <el-table-column prop="jlStakeNum" label="交流充电桩数"></el-table-column>
            </el-table>

            <div class="nn">
                <el-button size="mini" @click="selectStationVisible = false" class="bouncedHold editorBTN btnSpace">关闭</el-button>
                <el-button size="mini" @click="pushSource" class="cancelBTN editorBTN">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { region, queryStationByRegAndName } from '@/api/platform/generalOverview';
import { batchDelete } from '@/api/property/garden';
import { addTasks, queryStationAndStakeNum, getListByInspId, queryList } from '@/api/operation/planTasks';
import { queryData } from '@/api/system/picture'; //查询列表和删除选项
import { DICTDATA, getDict } from '@/api/dict';
import Vue from 'vue';

const tonken = Vue.cookie.get('token');

export default {
    data() {
        return {
            stationData: [],//  新增的站点数据
            regionMap: [],//  区县map
            staMap: [],//  站点map
            selectData: [],//  选中的站点数据
            selectStationVisible: false,//  选择站点的弹窗
            stationForm: {},
            modelList: [], //  子模块的遍历
            staChangeMap: [],
            seen: false, 
            current: 0,
            modelName: '', //  选择的模块id
            modelNameMap: [], //  下拉框的主模块
            alreadySelection: [],  //  站点选择中的以选中
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

            dialogFormVisible: false,//  新增的遥控器
            zoneForm: {},
            rules: {
                zoneName: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
                zoneType: [{ required: true, message: '请选择园区类型', trigger: 'change' }],
                orgId: [{ required: true, message: '请选择组织机构', trigger: 'blur' }],
                state: [{ required: true, message: '请选择行政区域', trigger: 'change' }],
                regId: [{ required: true, message: '请选择行政区域', trigger: 'change' }]
            },
            type: [],
        };
    },
    mounted() {
        this.queryData();
        //  查询运维模块列表
        this.getModelMap();
        region(sessionStorage.getItem("regId")).then((res) => {
            if (res.code == '000000') {
                this.regionMap = res.data;
            }
        });
    },
    methods: {
        //  查询运维模块列表
        getModelMap() {
            queryList({inspType: 1}).then((res) => {
                if (res.code === '000000' ) {
                    this.modelNameMap = res.data;
                }
            });
        },
        //  获取子模块的信息
        getListByInspId() {
            getListByInspId(this.modelName).then((res) => {
                if (res.code === '000000') {
                }
            });
        },
        //  站点选择
        stationChoose() {
            let params = {};
            queryStationAndStakeNum().then((res) => {
                if (res.code === '000000') {
                    this.modelNameMap = res.data;
                }
            });
        },
        //  模块移入
        mouseEnter(index, id) {
            this.seen = true;
            this.current = index;
        },
        //  模块移出
        mouseleave() {
            this.seen = false;
            this.current = null;
        },
        // 表格选择
        handleSelectionChange() {},
        //  站点已选列表
        alreadySelectMap(val) {
            this.alreadySelection = val;
        },
        //  通过区县查站点
        queryByCondition(arg) {
            let params = { regId: arg, stationName: '' };
            queryStationByRegAndName(params).then((res) => {
                if (res.code == '000000') {
                    this.staMap = res.data;
                }
            });
        },
        //  合并单元格
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            console.log(row, column, rowIndex, columnIndex);
            if (columnIndex === 0) {
                //用于设置要合并的列
                if (rowIndex % 2 === 0) {
                    //用于设置合并开始的行号
                    return {
                        rowspan: 2, //合并的行数
                        colspan: 1 //合并的列数，设为０则直接不显示
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        },
        //  站点查询
        stationSubmit() {
            let params = {
                regId: this.stationForm.regId,
            }
            queryStationAndStakeNum(params).then(res => {
                if (res.code === '000000') {
                    console.log(res.data);
                    this.selectData = res.data.records
                }
            })
        },
        //  已选站点删除
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
        pushSource() {
            this.selectStationVisible = false;
            let arr = [...this.alreadySelection,...this.stationData]
            this.stationData = this.unique(arr)
        },
        unique(arr) { 
        　　const res = new Map();  
        　　return arr.filter((arr) => !res.has(arr.regId) && res.set(arr.regId, 1)) 
        },
        setData() {
            this.type = this.$parent.$parent.type;
        },
        staChange(val) {
            this.staChangeMap = val
        },
        // 新增
        save() {
            let params = {},
                inspectObjs = [];
            this.stationData.length > 0 &&
                this.stationData.forEach((item) => {
                    inspectObjs.push({
                        addr: item.address,
                        regId: item.regId,
                        staId: item.stationId,
                        staNam: item.stationName
                    });
                });
            params = {
                inspId: this.modelName,
                inspectObjs: inspectObjs,
                taskType: 7
            };
            addTasks(params)
                .then((res) => {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.dialogFormVisible = false;
                    this.$parent.$parent.$refs.crudForm.getDataInit();
                    this.zoneForm = {};
                    
                    this.modelName = ''
                    this.modelList = []
                    this.stationData = []
                    this.stationForm = {}
                    this.selectData = []

                })
                .catch((err) => {
                    this.$message.error('添加失败');
                    this.$parent.$parent.$refs.crudForm.getDataInit();
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
        // 取消
        quxiao() {
            this.dialogFormVisible = false;
        },

        //新增dialog显示
        addDialogFormVisible() {
            this.sign = true;
            this.dialogFormVisible = true;
            // this.$refs['form'].resetFields();
        },
        // 获取图片
        queryData(data) {
            queryData(data)
                .then((res) => {
                    this.pageSize = res.data.size;
                    this.currentPage = res.data.current;
                    this.total = res.data.total;
                })
                .catch((err) => {
                    this.$message.error('查询失败');
                });
        },
        // 分页点击事件
        handleSizeChange(val) {
            this.pageSize = val;
            this.upForm.size = this.pageSize;
            this.upForm.current = 1;
            this.queryData(this.upForm); //点击选择每页显示多少数据就会发送size，让页面显示多少条，并且默认第一个页面
        },
        handleCurrentChange(val) {
            this.upForm.size = this.pageSize;
            this.upForm.current = val;
            this.queryData(this.upForm); //点击第几页就会发送要显示的页数过去
        },
        // 清空查询
        clearForm() {
            this.upForm = {};
            this.queryData();
        },
        //  =====================分页相关=============
        refresh1() {
            let formInline = this.formInline;
            formInline.size = this.pageData.size;
            formInline.current = this.pageData.current;
            this.queryData(formInline);
        },
        /**
         * 每页条数变化
         */
        handleSizeChange1(val) {
            let formInline = this.formInline;
            this.pageData.size = val;
            formInline.size = this.pageData.size;
            formInline.current = this.pageData.current;
            this.queryData(formInline);
        },
        /**
         * 点击某页
         */
        handleCurrentChange1(val) {
            let formInline = this.formInline;
            this.pageData.current = val;
            formInline.size = this.pageData.pageSize;
            formInline.current = this.pageData.current;
            this.queryData(formInline);
        }
    }
};
</script>
<style lang="scss" scoped>
//  主模块鼠标移入移出样式
.main-model {
    display: flex;
    .item-model {
        width: 150px;
        background: rgb(226, 243, 250);
        border: 1px solid rgb(190, 229, 224);
        margin-left: 10px;
        color: #006080;
        text-align: center;
    }
    .item-table {
        position: absolute;
        left: 40%;
        top: 10vh;
        z-index: 5;
        background: white;
        padding: 20px;
    }
}
.bg-items {
    padding: 10px 20px;
    background: rgb(248, 248, 248);
}

// 二级
.qw {
    width: 1000px;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
}

.nn {
    display: flex;
    justify-content: center;
}

.bz {
    width: 175px;
}

.dw {
    margin-right: 125px;
    display: flex;
}

.dw span {
    margin-top: 8px;
    margin-left: 5px;
}

.dw1 {
    padding-right: 4px;
}
.kz {
    width: 280px;
    margin-right: 30px;
}

.dq {
    width: 90px;
}

.ww {
    margin-right: 42px;
}

.tup {
    width: 105px;
    height: 102px;
}

.ya {
    width: 674px;
    height: 70px;
    background: #006080;
    margin-left: 32px;
}

.xzcs2 {
    width: 600px;
}

.k {
    width: 450px;
}

// 图片
.tp {
    width: 800px;
    // display: flex;
}

.ws {
    width: 70px;
    height: 70px;
}

.tpsc {
    display: flex;
}

.ani {
    margin-top: 40px;
    margin-right: 10px;
    font-size: 12px;
}

.tpscwz {
    margin-top: 40px;
    color: red;
    font-size: 12px;
}

.ntx[data-v-679118c6] {
    margin-left: 81px;
}

.ntx[data-v-679118c6][data-v-679118c6] {
    margin-left: 0;
}

.ntd[data-v-679118c6] {
    margin-left: 50px;
}

/deep/ .kp .el-form-item__label:before {
    content: '*';
    color: #ff4949;
    height: 32px;
    margin-right: 3px;
    font-size: 14px;
}

/deep/ .k .el-form-item__label {
    color: #606266;
}

/deep/ .el-input-group__append button.el-button {
    width: 65px;
}

/deep/ .aniu {
    color: white !important;
    background: #006080 !important;
    width: 120px;
}
.title {
    margin: 20px;
    i {
        width: 4px;
        height: 14px;
        display: inline-block;
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
    margin-left: -20px;
}
.staDel {
    width: 100px;
    background: white;
    color: rgb(211, 47, 46);
    border-radius: 3px;
    float: right;
    border: 1px solid rgb(211, 47, 46);
    margin-right: 20px;
}
</style>
