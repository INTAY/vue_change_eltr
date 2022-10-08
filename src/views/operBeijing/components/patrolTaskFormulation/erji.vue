<template>
    <div>
        <div style="display: inline">
            <el-button class="newButtonColor btnSpace listBTN" @click="addDialogFormVisible">新增</el-button>
        </div>
        <div style="display: inline">
            <el-button class="newButtonColor btnSpace listBTN" @click="notOperateQ">未处理问题</el-button>
        </div>
        <!-- 新增 -->
        <el-dialog
            :title="isModify ? '修改' : '新增'"
            :visible.sync="dialogFormVisible"
            width="950px"
            class="yw"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            :before-close="handleClose"
        >
            <!-- 运维模块 -->
            <!-- 站点选择 -->
            <el-row>
                <el-col :span="3">
                    <div class="title"><i />站点选择</div>
                </el-col>
                <el-col :span="2"
                    ><el-button class="newButtonColor staSlect" style="margin-top: 8px" plain @click="selectStation"
                        >选择</el-button
                    ></el-col
                >
                <el-button class="BatchDeleteColor staDel" style="margin-top: 8px" plain @click="delStationData">删除</el-button>
            </el-row>

            <div style="margin-top: 5px">
                <!-- 已选站点 -->
                <el-table
                    :data="stationData"
                    style="width: 100%"
                    max-height="400px"
                    :header-cell-style="{ background: '#f8f8f8 !important', color: '#000' }"
                    @selection-change="staChange"
                >
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                    <el-table-column prop="regName" label="区县" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="stationName" label="站点名称" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="address" label="站点地址" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="totalStakeNum" label="总桩数" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="zlStakeNum" label="直流充电桩数" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="jlStakeNum" label="交流充电桩数" show-tooltip-when-overflow></el-table-column>
                    <!-- <el-table-column prop="groupId" label="充电站点运营编码" show-tooltip-when-overflow></el-table-column> -->
                </el-table>
            </div>
            <!-- =============运维模块================= -->
            <div class="title"><i />运维模块</div>
            <el-form ref="form" label-width="105px" :model="baseInfo" :rules="rules" size="mini">
                <div class="OpsModule">
                    <el-form-item label="模块名称:" style="margin-top: 7px">
                        <el-select size="mini" filterable class="inputWidth" v-model="modelName" @change="getListByInspId">
                            <el-option v-for="item in modelNameMap" :key="item.id" :value="item.id" :label="item.inspName"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主模块:">
                        <div class="OpsMain" v-for="(item, index) in modelList" :key="index">
                            <el-popover placement="bottom" width="550" trigger="hover">
                                <el-table :data="item.children" stripe>
                                    <el-table-column type="index" width="50"> </el-table-column>
                                    <el-table-column property="libName" :label="item.libName"></el-table-column>
                                </el-table>
                                <el-button slot="reference" class="btnClass">{{ item.libName }}</el-button>
                            </el-popover>
                        </div>
                    </el-form-item>
                    <!-- </el-form> -->
                </div>
                <!-- =============基本信息================= -->
                <div class="title"><i />基本信息</div>
                <div class="OpsModule">
                    <el-form-item label="截止时间:" style="margin-top: 5px" prop="deadline">
                        <el-date-picker
                            style="width: 200px"
                            size="mini"
                            type="datetime"
                            v-model="baseInfo.deadline"
                            :picker-options="{
                                selectableRange: startTimeRange,
                                disabledDate(time) {
                                    return time.getTime() < Date.now() - 8.64e7;
                                }
                            }"
                            :default-time="nowTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm"
                            clearable
                            placeholder="选择日期时间"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="巡视原因:" prop="inspectReason">
                        <el-input type="textarea" v-model="baseInfo.inspectReason"></el-input>
                    </el-form-item>
                    <div>
                        <el-form-item label="照片：">
                            <!-- <div class="img_sty" v-for="item in urlList" :key="item">
                                <el-image :preview-src-list="urlList" style="width: 100px; height: 100px" :src="item"></el-image>
                            </div> -->
                            <div class="upload-demo">
                                <el-upload
                                    ref="upload"
                                    :action="`${this.BASE_API}/filestore/fileStore/uploadMultipartFileStore?uploadType=5`"
                                    list-type="picture-card"
                                    :file-list="fileList"
                                    :headers="headers"
                                    multiple
                                    :on-remove="handleRemove"
                                    :auto-upload="true"
                                    :on-success="handleImageSuccess"
                                    :on-change="handleChange"
                                    :before-upload="beforeUpload"
                                    accept=".jpg,.png,.JPEG,.JPG,.PNG,.gif,.GIF,.jpeg"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <!-- </div> -->

            <!-- 确认和取消按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="save" size="mini" class="editorBTN btnSpace bouncedHold">确 定</el-button>
                <el-button size="mini" class="editorBTN cancelBTN" @click="cancelAdd">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 选择站点 -->
        <el-dialog
            title="站点选择"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            top="20vh"
            :modal="true"
            :visible.sync="selectStationVisible"
            width="950px"
            class="dialogClass selectedDialog"
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
                        <el-button size="small" class="newButtonColor SearchBTN" @click="stationSubmit(true)">查询</el-button>
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
                    ref="staTable"
                >
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column type="selection" align="center" :reserve-selection="true" width="55"></el-table-column>
                    <el-table-column prop="regName" label="区县" width="80"></el-table-column>
                    <el-table-column prop="stationName" label="站点名称" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="address" label="站点地址" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="groupName" label="负责部门" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="totalStakeNum" label="总桩数" width="70"></el-table-column>
                    <el-table-column prop="zlStakeNum" label="直流充电桩数"></el-table-column>
                    <el-table-column prop="jlStakeNum" label="交流充电桩数"></el-table-column>
                    <el-table-column prop="groupId" label="运营编码" show-tooltip-when-overflow width="80"></el-table-column>
                </el-table>
                <div class="page-wrap">
                    <el-pagination
                        @size-change="staSizeChange"
                        @current-change="staCurrentChange"
                        :page-size="staPageData.size"
                        :total="staPageData.total"
                        :current-page="staPageData.current"
                        :page-sizes="[10, 20, 30, 40, 50, 100]"
                        layout="total, sizes, prev, pager, next, jumper, slot"
                    >
                        <span class="el-pagination__jump page-option-wrap">
                            <a class="el-icon-refresh page-option-icon" href="javascript:;" @click="staRefresh" title="刷新">
                                <!-- <img src="/static/img/7.png" /> -->
                            </a>
                        </span>
                    </el-pagination>
                </div>
            </div>

            <!-- 确认和取消按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="pushSource" class="editorBTN btnSpace bouncedHold">确 定</el-button>
                <el-button class="editorBTN cancelBTN" @click="selectStationVisible = false">取 消</el-button>
            </span>
        </el-dialog>

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
            <!-- <div class="chooseTable">
                <el-table :data="pbData" style="width: 100%" :header-cell-style="{ background: '#f1f1f1', color: '#000' }" ref="staTable">
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column prop="id" label="任务编号" show-tooltip-when-overflow>
                        <template slot-scope="scope">
                            <el-button class="click_cell" type="text" @click="qusDetail(scope.row)">{{ scope.row.id }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="apply_man_name" label="发布人" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="created_time" label="发布时间" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="org_id" label="所属部门" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="inspect_reason" label="问题描述" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="state" label="任务状态"></el-table-column>
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
                            <a class="el-icon-refresh page-option-icon" href="javascript:;" @click="troubleRefresh" title="刷新"> </a>
                        </span>
                    </el-pagination>
                </div>
            </div> -->
            <div class="nestedTable">
                <crud-form
                    :field-list="fieldList"
                    :api="queryProblem"
                    :queryParam="formInline"
                    :showCheckbox="false"
                    :showColumnHandle="false"
                    :showExportBtn="false"
                    ref="crudForm"
                >
                </crud-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import crudForm from '@/components/crudForm/index';
import { region } from '@/api/platform/generalOverview';
import { DICTDATA, getDict } from '@/api/dict';
import {
    getListByInspId,
    addTasks,
    queryStationAndStakeNum,
    queryList,
    taskModify,
    queryProblem,
    getDetails
} from '@/api/operBeijing/patrolTaskFormulation';
import moment from 'moment';
const nowTime = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}` + '';
import Vue from 'vue';
import { BASE_API } from '@/api/request';
const tonken = Vue.cookie.get('token');
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/api/request.js';
export default {
    data() {
        let getInfo = (row) => {
            let dialog = this.$parent.$parent;
            // console.log(dialog.urlList, '图片列表全选');
            dialog.isIgnore = true;
            dialog.sign = 0;
            dialog.taskId = row.id;
            dialog.taskState = row.state;
            // console.log(dialog.taskState, 'dialog.taskState');
            dialog.dialogFormVisible = true;
            getDetails(row.id).then((res) => {
                if (res.code === '000000') {
                    dialog.taskDetail = res;
                    // console.log(this.taskDetail, '站点');
                    dialog.zoneForm = {
                        taskName: res.data.taskName,
                        orgName: res.data.orgName,
                        deadline: res.data.deadline,
                        state: res.data.state,
                        endDate: res.data.endDate,
                        inspectReason: res.data.inspectReason,
                        createdTime: res.data.createdTime,
                        state: res.data.state,
                        duration: res.data.duration,
                        inspName: res.data.inspName
                    };
                    dialog.stationData = [
                        {
                            regName: res.data.regName,
                            staName: res.data.staName,
                            addr: res.data.addr,
                            totalStakeNum: res.data.totalStakeNum,
                            zlStakeNum: res.data.zlStakeNum,
                            jlStakeNum: res.data.jlStakeNum
                        }
                    ];
                    dialog.modelList = res.data.inspectContentDetVos;
                }
            });
        };
        return {
            urlList: [],
            nowTime,
            BASE_API,
            fileList: [{ url: '' }], // 文件上传
            headers: { Authorization: 'Bearer ' + tonken },
            startTimeRange: '',
            isModify: false,
            isRevert: '', // 任务状态
            stationData: [], //  新增的站点数据
            regionMap: [], //  区县map
            staMap: [], //  站点map
            selectData: [], //  选中的站点数据
            selectStationVisible: false, //  选择站点的弹窗
            stationForm: {
                taskType: 4
            },
            modelList: [], //  子模块的遍历
            staChangeMap: [],
            seen: false,
            current: 0,
            modelName: '', //  选择的模块id
            modelNameMap: [], //  下拉框的主模块
            alreadySelection: [], //  站点选择中的以选中
            staPageData: {
                total: 0,
                current: 1,
                size: 0
            },
            pageData: {
                total: 0,
                current: 1,
                size: 0
            },
            checkValue: '',
            upForm: {
                size: '',
                current: '',
                fileType: '',
                name: ''
            },
            rules: {
                inspectReason: [{ required: true, message: '请填写巡视原因', trigger: 'blur' }],
                deadline: [{ required: true, message: '请选择截止时间', trigger: 'change' }]
            },

            dialogFormVisible: false, //  新增
            type: [],
            notOperateQs: false, //  未处理问题的开关
            dialogImageUrl: '',
            dialogVisible: false,
            baseInfo: {
                taskName: '',
                deadline: '',
                orgName: '',
                state: '',
                endDate: '',
                inspectReason: '',
                createdTime: '',
                duration: ''
            },
            pbData: [],
            urlArr: [],
            queryProblem,
            formInline: {
                taskType: 4
            },
            fieldList: [
                { name: '任务编号', value: 'id', type: 'link', clickFn: getInfo },
                { name: '发布人', value: 'apply_man_name' },
                { name: '发布时间', value: 'created_time' },
                { name: '所属部门', value: 'org_id' },
                { name: '巡视原因', value: 'inspect_reason' },
                { name: '任务状态', value: 'state' },
                // { name: '忽略原因', value: 'inspect_reason' }
            ]
        };
    },
    components: {
        crudForm
    },
    computed: {
        deadline() {
            return this.baseInfo.deadline;
        }
    },
    watch: {
        deadline: {
            handler(newValue, oldValue) {
                if (newValue) {
                    let nowDate = moment().format('YYYY-MM-DD HH:mm:ss');
                    // console.log(nowDate, 'nowDate');
                    let dt = nowDate.split(' ');
                    // console.log(dt, 'dt');
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
    },
    mounted() {
        //  查询运维模块列表
        this.getModelMap();
        region(sessionStorage.getItem('regId')).then((res) => {
            if (res.code == '000000') {
                this.regionMap = res.data;
            }
        });
    },
    methods: {
        // 未处理问题
        notOperateQ() {
            // this.queryProblem({ taskType: 4 });
            this.notOperateQs = true;
        },
        handleRemove(file, fileList) {
            let _this = this;
            for (var i = 0; i < _this.fileList.length; i++) {
                if (file.uid == _this.fileList[i].uid) {
                    _this.fileList.splice(i, 1);
                }
            }
        },
        // handlePictureCardPreview(file) {
        //     console.log(file, 'file');
        //     this.dialogImageUrl = file.url;
        //     this.dialogVisible = true;
        // },

        getRowkeys(row) {
            return row.stationId;
        },
        //  通过区县查站点
        queryByCondition(arg) {
            let params = { regId: arg, state: '' };
            queryStationAndStakeNum(params).then((res) => {
                // console.log(res, 'res');
                if (res.code == '000000') {
                    this.staMap = res.data.records;
                }
            });
        },
        //  查询运维模块列表
        getModelMap() {
            queryList({
                inspType: 4
            }).then((res) => {
                if (res.code === '000000') {
                    this.modelNameMap = res.data;
                    // console.log(this.modelNameMap, 'this.modelNameMap');
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
            this.queryStations(this.stationForm);
        },

        // 新增页面 已选站点删除
        delStationData() {
            // console.log(this.staChangeMap, 'this.staChangeMap');
            this.staChangeMap.forEach((item) => {
                for (let i = 0; i < this.stationData.length; i++) {
                    if (this.stationData[i].stationId === item.stationId) {
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
            // console.log(arr, 'arr');
            this.stationData = this.unique(arr);
            // this.stationData = arr;
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
        // 查询站点
        queryStations(data) {
            queryStationAndStakeNum(data).then((res) => {
                // console.log(res, '站点信息');
                if (res.code == '000000') {
                    this.selectData = res.data.records;
                    this.staPageData = {
                        total: res.data.total,
                        current: res.data.current,
                        pageSize: res.data.size
                    };
                }
            });
        },
        staChange(val) {
            this.staChangeMap = val;
        },
        // 上传成功
        handleImageSuccess(res, file, fileList) {
            // this.urlArr.push([res.data[0].url]);
            // console.log(!!res, '上传图片');
        },

        // 删除附件
        handleRemove(file, fileList) {
            let _this = this;
            for (var i = 0; i < _this.fileList.length; i++) {
                if (file.uid == _this.fileList[i].uid) {
                    _this.fileList.splice(i, 1);
                }
            }
        },
        // 新增/修改
        save() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.stationData.length == 0) {
                        this.$message({
                            message: '请选择站点！',
                            type: 'warning'
                        });
                        return;
                    }
                    if (!this.modelName) {
                        this.$message({
                            message: '请选择模块名称！',
                            type: 'warning'
                        });
                        return;
                    }
                    // showFullScreenLoading();
                    let params = {},
                        inspectObjs = [];
                    this.stationData.length > 0 &&
                        this.stationData.forEach((item) => {
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
                        // 新增
                        params = {
                            taskType: 4,
                            inspId: this.modelName,
                            inspectObjs: inspectObjs,
                            deadline: this.baseInfo.deadline,
                            inspectReason: this.baseInfo.inspectReason,
                            docUrls: []
                        };
                        if (!!this.fileList) {
                            for (let i = 0; i < this.fileList.length; i++) {
                                params.docUrls.push(this.fileList[i].response.data[0].url);
                            }
                        }
                        // console.log(params, 'paramsparams');
                        addTasks(params)
                            .then((res) => {
                                // tryHideFullScreenLoading();
                                if (res.code === '000000') {
                                    this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });

                                    this.reset();
                                    this.$parent.$parent.$refs.crudForm.getDataInit();
                                } else {
                                    this.$message.error(res.data);
                                }
                            })
                            .catch((err) => {
                                // tryHideFullScreenLoading();
                                this.$message.error('添加失败');
                            });
                    } else {
                        // 修改
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
                        // console.log(modifyList, '----------');
                        params = {
                            taskType: 4,
                            id: this.$parent.$parent.taskId,
                            inspId: this.modelName,
                            inspectObjs: inspectObjs,
                            taskName: this.baseInfo.taskName,
                            deadline: this.baseInfo.deadline,
                            // orgName: this.baseInfo.orgName,
                            endDate: this.baseInfo.endDate,
                            inspectReason: this.baseInfo.inspectReason,
                            createdTime: this.baseInfo.createdTime,
                            state: this.baseInfo.state,
                            duration: this.baseInfo.duration,
                            docUrls: modifyList
                        };
                        // console.log(params, 'data');
                        taskModify(params).then((res) => {
                            // tryHideFullScreenLoading();
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
                                this.reset();
                                this.$parent.$parent.dialogFormVisible = false;
                                // 重新查询列表
                                if (this.$parent.$parent.sign == 1) {
                                    this.$parent.$parent.$refs.crudForm.getDataInit();
                                } else {
                                    // this.queryProblem();
                                    this.$refs.crudForm.getDataInit();
                                    this.$parent.$parent.$refs.crudForm.getDataInit();
                                }
                            }
                        });
                    }
                }
            });
        },
        handleClose() {
            this.reset();
        },
        cancelAdd() {
            this.reset();
        },
        // 重置
        reset() {
            // this.zoneForm = {};
            this.modelName = '';
            this.modelList = [];
            this.stationData = [];
            this.stationForm = {};
            this.selectData = [];
            this.baseInfo = {};
            this.stationForm.taskType = 4;
            this.dialogFormVisible = false;
            this.$refs.upload.clearFiles();
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
            this.$parent.$parent.sign = 1;
            this.isModify = false;
            this.fileList = [];
            this.dialogFormVisible = true;
        },
        //  待选站点的查询
        stationSubmit(isSerachBtn) {
            //  如果是点击查询进来的，就从第一页开始查询
            if (isSerachBtn) {
                this.stationForm.current = 1;
            }
            this.queryStations(this.stationForm);
        },
        // 站点分页相关
        staRefresh() {
            this.stationForm.size = this.staPageData.size;
            this.stationForm.current = this.staPageData.current;
            this.queryStations(this.stationForm);
        },
        /**
         * 每页条数变化
         */
        staSizeChange(val) {
            this.stationForm.size = val;
            this.stationForm.current = this.staPageData.current;
            this.queryStations(this.stationForm);
        },
        /**
         * 点击某页
         */
        staCurrentChange(val) {
            this.staPageData.current = val;
            this.stationForm.size = this.staPageData.pageSize;
            this.stationForm.current = val;
            this.queryStations(this.stationForm);
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
            // console.log(file);
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
        }
    }
};
</script>
<style lang="scss" scoped>
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
        position: absolute; // left: 40%;
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
    padding-top: 12px;
    box-sizing: border-box;
    border: 1px solid #efefef;
    background-color: #f8f8f8; //主模块
    .OpsMain {
        position: relative;
        display: inline-block;
        margin: 0 15px 10px 0; //按钮的半透明颜色
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
    margin: 15px 0 15px 2px;
    width: 70px;
    i {
        float: left;
        width: 4px;
        height: 14px;
        background: #24b3ca;
        margin-right: 10px;
        margin-top: 3px;
        border-radius: 5px;
    }
}

.staSlect {
    width: 100px;
    background: #1396c2;
    color: white;
    border-radius: 3px;
    margin-left: -10px;
}

.staDel {
    width: 100px;
    background: white;
    border-radius: 3px;
    float: right;
    margin-right: 5px;
}

.selectedDialog {
    /deep/ .el-dialog__body {
        padding: 0px;
    } //选择 -- 已选
    .selected {
        position: relative;
        font-size: 14px;
        padding: 0 90px 0 120px;
        border-bottom: 1px solid #dfdfdf;
        background-color: #f5f5f5;
        box-sizing: border-box; //已选
        .chonse {
            position: absolute;
            color: #232323;
            top: 21px;
            left: 45px;
            .number {
                color: #017aa2;
            }
        } //更多
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
        } //标签
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
    padding: 0 45px;
}

.yi {
    margin: 15px 0 -10px 0;
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
.click_cell {
    color: #1396c2 !important;
    font-size: 14px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
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
.img_sty {
    display: inline-block;
    margin-right: 10px;

    /deep/ .el-image {
        border-radius: 5px;
    }
}
// .upload-demo {
//     display: inline-block;
//     vertical-align: top;
// }
</style>