<template>
    <div>
        <div>
            <el-button size="mini" class="newButtonColor listBTN FontData" @click="addlication">新增</el-button>

            <el-button size="mini" class="newButtonColor listBTN FontData" @click="notOperateQ">未处理问题</el-button>
        </div>
        <!-- 新增模块 -->
        <el-dialog
            :title="isModify ? '修改' : '新增'"
            :close-on-click-modal="false"
            :visible.sync="visible"
            :modal-append-to-body="false"
            :modal="true"
            @open="submitButtonDisabled = false"
            width="1020px"
        >
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
            <!-- 基础信息 -->
            <div class="title">
                <div class="sign"></div>
                <div>基础信息</div>
            </div>
            <div class="basic commonModule">
                <el-form :model="formInline">
                    <el-form-item label="截止时间" label-position="left">
                        <el-date-picker
                            v-model="formInline.deadline"
                            type="datetime"
                            placeholder="选择日期时间"
                            :picker-options="{
                                selectableRange: startTimeRange,
                                disabledDate(time) {
                                    return time.getTime() < Date.now() - 8.64e7;
                                }
                            }"
                            :default-time="nowTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="维护原因" label-position="left">
                        <el-input
                            type="textarea"
                            v-model="formInline.inspectReason"
                            :autosize="{ minRows: 4, maxRows: 8 }"
                            class="textareaInput"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="照片">
                        <el-upload
                            class="upload-demo"
                            ref="upload"
                            :action="`${this.BASE_API}/filestore/fileStore/uploadMultipartFileStore?uploadType=5`"
                            list-type="picture-card"
                            :file-list="fileList"
                            :headers="headers"
                            multiple
                            :on-remove="handleRemove"
                            :auto-upload="true"
                            :on-change="handleChange"
                            :before-upload="beforeUpload"
                            accept=".jpg,.png,.JPEG,.JPG,.PNG,.gif,.GIF,.jpeg"
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 确认和取消按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save" class="realButton">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
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
                    <el-button type="primary" @click="RealCheck" class="realButton">确 定</el-button>
                    <el-button @click="CancelDel">取 消</el-button>
                </span>
            </el-dialog>
        </div>
        <!-- 未处理问题 -->
        <el-dialog
            title="未处理问题"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            top="18vh"
            :modal="true"
            :visible.sync="notOperateQs"
            width="60%"
            class="dialogClass selectedDialog"
        >
            <div class="chooseTable">
                <el-table
                    :data="pbData"
                    style="width: 100%"
                    :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                    ref="staTable"
                    @sort-change="sortChange"
                >
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column prop="id" label="任务编号" show-tooltip-when-overflow>
                        <template slot-scope="scope">
                            <el-button class="click_cell" type="text" @click="qusDetail(scope.row)">{{ scope.row.id }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="apply_man_name" label="发布人" show-tooltip-when-overflow sortable="custom"></el-table-column>
                    <el-table-column prop="created_time" label="发布时间" show-tooltip-when-overflow sortable="custom"></el-table-column>
                    <el-table-column prop="org_id" label="所属部门" show-tooltip-when-overflow sortable="custom"></el-table-column>
                    <el-table-column prop="inspect_reason" label="问题描述" show-tooltip-when-overflow sortable="custom"></el-table-column>
                    <el-table-column prop="state" label="任务状态" sortable="custom"></el-table-column>
                </el-table>
                <div class="page-wrap">
                    <el-pagination
                        @size-change="troubleSizeChange"
                        @current-change="troubleCurrentChange"
                        :page-size="pageData.size"
                        :total="pageData.total"
                        :current-page="pageData.current"
                        :page-sizes="[10, 20, 30, 40, 50, 100]"
                        layout="total, sizes, prev, pager, next, jumper, slot"
                    >
                        <span class="el-pagination__jump page-option-wrap">
                            <a class="el-icon-refresh page-option-icon" href="javascript:;" @click="troubleRefresh" title="刷新"></a>
                        </span>
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import crudForm from '@/components/crudForm/index';
import { getDict, DICTDATA } from '@/api/dict';
import { queryStationByRegAndName, region } from '@/api/operBeijing/stopAndRestore';
import { queryStationAndStakeNum, getListByInspId, queryList } from '@/api/operation/planTasks'; //新增模块(运维模块：模块名称(queryList))
import { addTasks, queryProblem, getDetails, taskModify } from '@/api/operBeijing/patrolTaskFormulation'; //未处理问题
import { BASE_API } from '@/api/request';
import moment from 'moment';
var nowTime = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}` + '';

const tonken = Vue.cookie.get('token');
import { mapState, mapMutations } from 'vuex';

export default {
    components: { crudForm },
    data() {
        return {
            startTimeRange: '',
            nowTime,
            BASE_API,
            isModify: false,
            fileList: [], // 文件上传
            headers: { Authorization: 'Bearer ' + tonken },
            visible: null,
            changeVisibleDialog: null, //选择按钮
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
            },
            ruleForm: {
                img: '', //图片的绑定需要用它赋值地址
                actionsUrl: '/api' + '/grouplesson/edit' //地址最好是拼接一下
            },
            //---------未处理问题弹窗
            notOperateQs: false, //  未处理问题的开关
            pbData: [], //未处理问题数据
            taskDetailProblem: [],
            querFrom: {
                taskType: 5
            }
        };
    },
    computed: {
        ...mapState(['ops']),
        deadline() {
            return this.formInline.deadline;
        }
    },

    mounted() {
        //新增 --- 运维模块 --- 模块名称
        this.getModelMap();
        this.init();
    },
    methods: {
        // 引入vuex
        ...mapMutations(['set_Sign']),
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
        //根据区域查站点
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
            const { data: res } = await queryList({ inspType: 5 });
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
            //进入默认查询
            this.formInline.current = 1;
            this.formInline.taskType = 5;

            //数据请求接口
            queryStationAndStakeNum(this.formInline).then((res) => {
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
        // 照片
        handleRemove(file, fileList) {
            let _this = this;
            for (var i = 0; i < _this.fileList.length; i++) {
                if (file.uid == _this.fileList[i].uid) {
                    _this.fileList.splice(i, 1);
                }
            }
        },
        //监控上传文件列表
        handleChange(file, fileList) {
            //  点击确定不执行以下操作
            // if (this.uploadSucc) return;
            let existFile = fileList.slice(0, fileList.length - 1).find((f) => f.name === file.name);
            if (existFile) {
                this.$message.error('当前文件已经存在!');
                fileList.pop();
            }

            this.fileList = fileList;
        },
        //  上传之前
        beforeUpload(file) {
            const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);

            const whiteList = ['jpg', 'png', 'JPEG', 'JPG', 'PNG', 'gif', 'GIF', 'jpeg'];

            if (whiteList.indexOf(fileSuffix) === -1) {
                this.$msg('上传文件只能是 jpg、png、JPEG、JPG、JPG、PNG、gif、jpeg', 'error');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isLt2M) {
                this.$msg('上传文件大小不能超过 2MB', 'error');
                return false;
            }
        },
        //新增 -->确认
        save() {
            //判断字段是否必填

            if (this.siteData.length == 0) {
                this.$message({ message: '请选择站点', type: 'warning' });
                return;
            }
            if (!this.OpsModuleForm.modelName) {
                this.$message({ message: '请选择模块名称！', type: 'warning' });
                return;
            }
            if (!this.formInline.deadline) {
                this.$message({ message: '请选截止时间！', type: 'warning' });
                return;
            } else if (!this.formInline.inspectReason) {
                this.$message({ message: '请选维护原因！', type: 'warning' });
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
                        totalStake: item.totalStakeNum,
                        dcStake: item.zlStakeNum,
                        acStake: item.jlStakeNum,
                        groupId: item.groupId
                    });
                });
            if (!this.isModify) {
                params = {
                    inspId: this.OpsModuleForm.modelName,
                    inspectObjs: inspectObjs,
                    deadline: this.formInline.deadline,
                    inspectReason: this.formInline.inspectReason,
                    docUrls: [],
                    taskType: 5
                };
                if (!!this.fileList) {
                    for (let i = 0; i < this.fileList.length; i++) {
                        params.docUrls.push(this.fileList[i].response.data[0].url);
                    }
                }
                addTasks(params)
                    .then((res) => {
                        if (res.code == '000000') {
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                            this.visible = false;
                            this.$parent.$parent.$refs.crudForm.getDataInit();
                            this.OpsModuleForm = {};

                            this.OpsModule = [];
                            this.siteData = [];
                            this.formInline = {}; //清空选择模块中的查询按钮
                            this.selectData = [];
                            this.fileList = [];
                        } else {
                            this.$message({
                                message: res.data,
                                type: 'error'
                            });
                        }
                    })
                    .catch((err) => {
                        this.$message.error('添加失败');
                        this.$parent.$parent.$refs.crudForm.getDataInit();
                    });
            } else {
                let modifyList = [];
                if (!!this.fileList) {
                    for (let i = 0; i < this.fileList.length; i++) {
                        //  新上传的图片
                        if (!!this.fileList[i].response) {
                            modifyList.push(this.fileList[i].response.data[0].url);
                        } else {
                            modifyList.push(this.fileList[i].url);
                        }
                    }
                }
                params = {
                    taskType: 5,
                    id: this.$parent.$parent.$refs.opsdetails.taskId,
                    inspId: this.OpsModuleForm.modelName,
                    inspectObjs: inspectObjs,
                    taskName: this.formInline.taskName,
                    deadline: this.formInline.deadline,
                    endDate: this.formInline.endDate,
                    inspectReason: this.formInline.inspectReason,
                    createdTime: this.formInline.createdTime,
                    state: this.formInline.state,
                    duration: this.formInline.duration,
                    docUrls: modifyList
                };
                taskModify(params).then((res) => {
                    if (res.code !== '000000') {
                        this.$message({
                            message: res.data,
                            type: 'error'
                        });
                    } else {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.OpsModuleForm = {};

                        this.OpsModule = [];
                        this.siteData = [];
                        this.formInline = {}; //清空选择模块中的查询按钮
                        this.selectData = [];
                        this.fileList = [];
                        this.visible = false;
                        // 重新查询列表
                        if (this.ops.sign) {
                            //详情
                            this.$parent.$parent.$refs.opsdetails.visible = false;
                            //主页面刷新
                            this.$parent.$parent.$refs.crudForm.getDataInit();
                        } else {
                            //关闭未处理问题
                            this.$parent.$parent.$refs.opsdetails.visible = false;
                            //未处理问题刷新
                            this.notOperateQ();
                            //主页面刷新
                            this.$parent.$parent.$refs.crudForm.getDataInit();
                        }
                    }
                });
            }
        },
        // 取消
        cancel() {
            this.visible = false;
            this.OpsModuleForm = {}; //先清空数值
            this.OpsModule = [];
            this.siteData = [];
            this.formInline = {}; //清空选择模块中的查询按钮
            this.selectData = [];
            this.fileList = [];
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
                this.formInline.taskType = 5;
            }
            //数据请求接口
            queryStationAndStakeNum(this.formInline).then((res) => {
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
        //选择 --- 清空
        clear() {
            this.formInline = {};
            this.formInline.taskType = 5;
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
        //选择 -- 取消
        CancelDel() {
            this.changeVisibleDialog = false;
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
        },
        //  =====================分页相关=============
        refresh() {
            this.formInline.size = this.pageData.size;
            // this.formInline.taskType = 5;
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
        },
        //---------------- 未处理问题
        notOperateQ() {
            this.queryProblem({ taskType: 5 });
            this.notOperateQs = true;
        },
        async queryProblem(data) {
            const { data: res } = await queryProblem(data);
            this.pbData = res.records;
            this.pageData = {
                total: res.total,
                current: res.current,
                pageSize: res.size
            };
        },
        qusDetail(row) {
            let dialog = this.$parent.$parent.$refs.opsdetails;
            dialog.isIgnore = true;
            //标记
            this.set_Sign(false);
            dialog.taskId = row.id;
            dialog.taskState = row.state;
            dialog.visible = true;
            getDetails(row.id).then((res) => {
                if (res.code === '000000') {
                    this.taskDetailProblem = res;
                    dialog.taskDetail = res;
                    dialog.OpsModuleForm = res.data;
                    dialog.siteData = [
                        {
                            regName: res.data.regName,
                            staName: res.data.staName,
                            addr: res.data.addr,
                            totalStakeNum: res.data.totalStakeNum,
                            zlStakeNum: res.data.zlStakeNum,
                            jlStakeNum: res.data.jlStakeNum
                        }
                    ];
                    dialog.Basic = [
                        { name: '任务名称:', message: res.data.taskName },
                        { name: '专用充电站:', message: res.data.staName },
                        { name: '处理部门:', message: res.data.orgName },
                        { name: '截止时间:', message: res.data.deadline },
                        { name: '任务状态:', message: res.data.state },
                        { name: '持续时间:', message: res.data.duration },
                        { name: '实际结束时间:', message: res.data.endDate },
                        { name: '任务制定时间:', message: res.data.createdTime },
                        { name: '忽略原因:', message: res.data.ignoreReason },
                        { name: '维护原因:', message: res.data.inspectReason }
                    ];
                }
            });
        },
        //------------未处理问题分页------------
        troubleSizeChange(val) {
            let params = {
                size: val,
                taskType: 5,
                current: this.pageData.current,
            };
            this.queryProblem(params);
        },
        troubleRefresh() {
            let params = {
                size: this.pageData.size,
                taskType: 5,
                current: this.pageData.current
            };
            this.queryProblem(params);
        },
        /**
         * 点击某页
         */
        troubleCurrentChange(val) {
            this.pageData.current = val;
            let params = {
                size: this.pageData.current,
                taskType: 5,
                current: val
            };

            this.queryProblem(params);
        },
        sortChange(column) {
            console.log(column);
            this.querFrom.sortColumn = column.prop;
            console.log(this.querFrom.sortColumn);
            if (column.order === 'ascending') {
                this.querFrom.order = 'asc';
            } else {
                this.querFrom.order = 'desc';
            }
            this.queryProblem(this.querFrom);
        }
    },
    watch: {
        deadline: {
            handler(newValue, oldValue) {
                if (newValue) {
                    let nowDate = moment().format('YYYY-MM-DD HH:mm:ss');
                    let dt = nowDate.split(' ');
                    let st = '';

                    if (newValue.split(' ')[0] == dt[0]) {
                        st = dt[1];
                    } else {
                        st = '00:00:00';
                    }
                    this.startTimeRange = st + ' - 23:59:59';
                }
            }
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
    margin-bottom: 25px;
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
    padding: 21px 45px;
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

.basic {
    padding: 10px 30px 18px;
}
.commonModule {
    box-sizing: border-box;
    border: 1px solid #efefef;
    margin-bottom: 29px;
    background-color: #f8f8f8;
}
//维护意见
.textInput {
    margin-bottom: 25px;
}
//理由
.textareaInput {
    width: 800px;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item,
/deep/ .el-upload--picture-card {
    width: 100px;
    height: 100px;
}
/deep/ .el-upload--picture-card {
    line-height: 105px;
}
.big_pic {
    /deep/ .el-dialog__body {
        padding: 10px 10px 5px;
    }
}
</style>