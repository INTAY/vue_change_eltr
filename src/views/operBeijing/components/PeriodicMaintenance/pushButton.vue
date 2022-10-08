<template>
    <div>
        <div>
            <el-button size="mini" class="newButtonColor listBTN FontData" @click="addlication">新增</el-button>
        </div>
        <!-- 新增模块 -->
        <el-dialog
            title="新增"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :modal-append-to-body="false"
            :modal="true"
            @open="submitButtonDisabled = false"
            width="1020px"
        >
            <!-- 运维模块 -->
            <div class="title">
                <div class="sign"></div>
                <div>运维模块</div>
            </div>
            <div class="OpsModule">
                <el-form ref="form" :model="OpsModuleForm" label-width="80px" size="mini">
                    <el-form-item label="模块名称">
                        <el-select v-model="OpsModuleForm.modelName" placeholder="请选择活动区域" clearable @change="getListByInspId">
                            <el-option
                                v-for="(item, index) in modelNameMap"
                                :key="index"
                                :value="item.id"
                                :label="item.inspName"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主模块">
                        <div class="OpsMain" v-for="(item, index) in OpsModule" :key="index">
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
            <div class="changeSite">
                <div class="title">
                    <div class="sign"></div>
                    <div>站点选择</div>
                </div>
                <el-button @click="toggleSelection" class="newButtonColor listBTN changeList btnChagesite">选择</el-button>
                <el-button @click="deleteSelection" class="redBTN listBTN deleteList btnChagesite">删除</el-button>
                <!-- 列表 -->
                <el-table
                    ref="multipleTable"
                    :data="siteData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    stripe
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
            <!-- 确认和取消按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save" class="realButton bouncedHold editorBTN">确 定</el-button>
                <el-button @click="cancel" class="editorBTN cancelBTN">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 弹出层 选择按钮  -->
        <div class="selectedDialog">
            <el-dialog
                title="选择充电站"
                :close-on-click-modal="false"
                :visible.sync="changeVisibleDialog"
                :modal-append-to-body="false"
                :modal="true"
                @open="submitButtonDisabled = false"
                width="1020px"
                style="paddding: 0px"
            >
                <!-- 已经 -->
                <div :class="{ selected: true, selected_immobilizationhight: this.more, selected_outHight: !this.more }">
                    <div class="chonse">
                        <span class="real">已选择</span>
                        (<span class="number">{{ this.alreadySelection.length }}</span
                        >)
                    </div>
                    <div class="more" @click="moreSelecte" v-if="this.alreadySelection != false">
                        <div>更多</div>
                        <i :class="more ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
                    </div>
                    <div class="selectedTags">
                        <el-tag
                            size="medium"
                            :key="index"
                            v-for="(tag, index) in this.alreadySelection"
                            :disable-transitions="true"
                            closable
                            @close="handleClose(tag)"
                        >
                            {{ tag.stationName }}
                        </el-tag>
                    </div>
                </div>
                <!-- 表格 -->
                <div class="chooseTable">
                    <el-form :inline="true" :model="formInline">
                        <el-form-item label="区县">
                            <el-select
                                size="mini"
                                class="inputWidth"
                                v-model="formInline.regId"
                                @change="queryByCondition(formInline.regId)"
                                clearable
                            >
                                <el-option v-for="item in regionMap" :key="item.id" :value="item.id" :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="站点名称" class="a">
                            <el-select size="mini" filterable class="inputWidth" v-model="formInline.stationId" clearable>
                                <el-option
                                    v-for="item in staMap"
                                    :key="item.id"
                                    :value="item.stationId"
                                    :label="item.stationName"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item>
                            <el-button size="mini" class="newButtonColor SearchBTN" @click="search(true)">查询</el-button>
                            <el-button size="mini" class="otherBTN SearchBTN" @click="clear">清空</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table
                        ref="chooseTable"
                        :data="selectData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        stripe
                        @selection-change="alreadySelectMap"
                    >
                        <el-table-column type="index" width="50"> </el-table-column>
                        <el-table-column type="selection" width="50"> </el-table-column>
                        <el-table-column prop="regName" label="区县"> </el-table-column>
                        <el-table-column prop="stationName" label="站点名称" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="address" label="站点地址" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="totalStakeNum" label="总桩数" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="zlStakeNum" label="直流电桩数" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="jlStakeNum" label="交流电桩数" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="staOperNum" label="充电站运营编码" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="groupName" label="所属部门" show-overflow-tooltip></el-table-column>
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
                    <el-button type="primary" @click="RealCheck" style="width: 150px" class="realButton bouncedHold editorBTN"
                        >确 定</el-button
                    >
                    <el-button @click="CancelCheck" class="editorBTN cancelBTN" style="width: 150px">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import crudForm from '@/components/crudForm/index';
import { getDict, DICTDATA } from '@/api/dict';
import { queryStationByRegAndName, region } from '@/api/operBeijing/stopAndRestore';
import { addTasks, queryStationAndStakeNum, getListByInspId, queryList } from '@/api/operation/planTasks'; //新增模块(运维模块：模块名称(queryList))

export default {
    components: { crudForm },
    data() {
        return {
            visible: null,
            changeVisibleDialog: null, //选择按钮
            more: true,
            fileList: [],
            formInline: {}, //站点
            staMap: [], //站
            regionMap: [], //区域
            OpsModuleForm: {},
            modelNameMap: [], //  下拉框的主模块
            OpsModule: [],
            //新增 --> 站点选择 ---> 列表数据
            siteData: [],
            //新增 --> 站点选择 --->列表改变数据
            staChangeMap: [],
            //新增 --->站点选择 --->选择 --->列表
            selectData: [],
            //新增 --->站点选择 --->选择 --->已经选择(新增 --->站点选择 --->选择 --->已选)
            alreadySelection: [],
            //分页
            pageData: {
                total: 0,
                current: 1,
                size: 0
            }
        };
    },
    mounted() {
        //新增 --- 运维模块 --- 模块名称
        this.getModelMap();
        this.init();
    },
    methods: {
        init() {
            this.regionMap = [];
            //  获取区域信息(区县)
            region(sessionStorage.getItem('regId')).then((res) => {
                if (res.code == '000000') {
                    this.regionMap = res.data;
                    this.staMap = [];
                }
            });
        },
        // 根据区域查站点
        queryByCondition(arg) {
            this.staMap = [];
            let params = { regId: arg, stationName: '' };
            queryStationByRegAndName(params).then((res) => {
                if (res.code == '000000') {
                    this.staMap = res.data.records;
                }
            });
            //强制性刷新
            this.$forceUpdate();
        },
        //新 -->运维 ---> 模块名称
        async getModelMap() {
            const { data: res } = await queryList({ inspType: 3 });
            this.modelNameMap = res;
        },
        //新 -->运维 -->  获取子模块的信息
        async getListByInspId() {
            const { data: res } = await getListByInspId(this.OpsModuleForm.modelName);
            this.OpsModule = res;
        },
        staChange(val) {
            this.staChangeMap = val;
        },
        // 已选站点删除
        deleteSelection() {
            this.staChangeMap.forEach((item) => {
                for (let i = 0; i < this.siteData.length; i++) {
                    if (this.siteData[i].regId === item.regId) {
                        this.siteData.splice(i, 1);
                        break;
                    }
                }
            });
        },
        //新增
        addlication() {
            this.visible = true;
        },
        //选择按钮
        toggleSelection() {
            this.changeVisibleDialog = true;
            this.alreadySelection = []; //清空赋值
            this.selectData = []; //清空已选
            //分页默认清空
            this.pageData = {
                total: 0,
                current: 1,
                pageSize: 0
            };
            //进入默认查询接口
            this.formInline.current = 1;
            this.formInline.taskType = 3;
            //数据请求接口
            queryStationAndStakeNum(this.formInline).then((res) => {
                if (res.code === '000000') {
                    console.log(res, 'resDATA');
                    this.selectData = res.data.records;
                    this.pageData = {
                        total: res.data.total,
                        current: res.data.current,
                        pageSize: res.data.size
                    };
                }
            });
        },
        //更多按钮
        moreSelecte() {
            this.more = !this.more;
        },
        //关闭标签(tag)
        handleClose(tag) {
            this.alreadySelection.splice(this.alreadySelection.indexOf(tag), 1);
        },
        //新增 -->确认
        save() {
            //判断字段是否必填
            if (!this.OpsModuleForm.modelName) {
                this.$message({ message: '请选择模块名称！', type: 'warning' });
                return;
            }
            if (this.siteData == []) {
                this.$message({ message: '请选择站点', type: 'warning' });
                return;
            }
            let params = {};
            let inspectObjs = [];
            this.siteData.length > 0 &&
                this.siteData.forEach((item) => {
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
                inspId: this.OpsModuleForm.modelName,
                inspectObjs: inspectObjs,
                taskType: 3
            };
            addTasks(params)
                .then((res) => {
                    if (res.code == '000000') {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.visible = false;
                        this.$parent.$parent.$refs.crudForm.getDataInit();
                        this.OpsModuleForm = {};

                        this.OpsModule = [];
                        this.siteData = [];
                        this.formInline = {}; //清空选择模块中的查询按钮
                        this.selectData = [];
                    } else {
                        this.$message.error(res.data);
                    }
                })
                .catch((err) => {
                    this.$message.error('添加失败');
                    this.$parent.$parent.$refs.crudForm.getDataInit();
                });
        },
        // 取消
        cancel() {
            this.visible = false;
            this.OpsModuleForm = {}; //先清空数值
        },
        //选择 -- 已经选择
        alreadySelectMap(val) {
            this.alreadySelection = val;
        },
        //选择 --- 查询
        search(isSerachBtn) {
            //  如果是点击查询进来的，就从第一页开始查询
            if (isSerachBtn) {
                this.formInline.current = 1;
                this.formInline.taskType = 3;
            }
            //数据请求接口
            queryStationAndStakeNum(this.formInline).then((res) => {
                if (res.code === '000000') {
                    console.log(res, 'resDATA');
                    this.selectData = res.data.records;
                    this.pageData = {
                        total: res.data.total,
                        current: res.data.current,
                        pageSize: res.data.size
                    };
                }
            });
        },
        //选择 --- 清空
        clear() {
            this.formInline = {};
            this.formInline.taskType = 3;
        },
        //选择 -- 确认
        RealCheck() {
            this.changeVisibleDialog = false; //关闭选择弹窗
            let arr = [...this.alreadySelection, ...this.siteData];
            this.siteData = this.unique(arr);
            //清除查询
            this.formInline = {};
            //分页清空
            this.pageData = {
                total: 1,
                current: 1,
                size: 10
            };
        },
        // 去重
        unique(arr) {
            const res = new Map();
            return arr.filter((arr) => !res.has(arr.stationId) && res.set(arr.stationId, 1));
        },
        //选择 -- 取消
        CancelCheck() {
            this.changeVisibleDialog = false; //关闭选择弹窗
            this.formInline = {};
            //分页清空
            this.pageData = {
                total: 1,
                current: 1,
                size: 10
            };
        },
        //  =====================分页相关=============
        refresh() {
            this.formInline.size = this.pageData.size;
            this.formInline.current = this.pageData.current;
            this.search(); //调用查询接口
        },

        //每页条数变化

        staSizeChange(val) {
            this.formInline.size = val;
            this.formInline.current = this.pageData.current;
            this.search(); //调用查询接口
        },
        // 点击某页
        staCurrentChange(val) {
            this.pageData.current = val;
            this.formInline.size = this.pageData.pageSize;
            this.formInline.current = val;
            this.search(); //调用查询接口
        }
    }
};
</script>

<style lang="scss" scoped>
//标题样式
.title {
    display: flex;
    font-size: 16px;
    margin-bottom: 18px;
    .sign {
        width: 4px;
        height: 15px;
        margin-top: 4px;
        margin-right: 9px;
        border-radius: 5px;
        font-weight: 500;
        background-color: #24b3ca;
    }
}
//运维模块
.OpsModule {
    padding: 30px;
    box-sizing: border-box;
    border: 1px solid #efefef;
    margin-bottom: 29px;
    background-color: #f8f8f8;
    //主模块
    .OpsMain {
        position: relative;
        display: inline-block;

        margin-right: 20px;
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
//站点选择
.changeSite {
    position: relative;
    //按钮公共样式
    .btnChagesite {
        position: absolute;
        top: -7px;
        font-size: 14px;
        border-radius: 3px;
    }
    //选择按钮
    .changeList {
        left: 100px;
    }
    //删除按钮
    .deleteList {
        right: 0;
    }
    .paginationStyle {
        margin-top: 20px;
    }
}
//确认按钮
.realButton {
    margin-right: 25px;
}
.selectedDialog {
    /deep/ .el-dialog__body {
        padding: 0px;
    }
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
    padding: 21px 55px 0 45px;
}
//分页
.dl {
    background: #f7f7f7;
    z-index: 999;
    text-align: center;
    left: 220px;
    right: 0;
    padding: 10px 0;
    line-height: 25px;
}
.FontData {
    font-size: 14px;
}
/deep/ .el-dialog__body {
    padding: 30px 6;
}
</style>