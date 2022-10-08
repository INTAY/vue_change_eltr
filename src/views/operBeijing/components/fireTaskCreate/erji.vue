<template>
    <div>
        <div style="margin: 10px 15px">
            <div style="display: inline">
                <el-button class="newButtonColor btnSpace listBTN" @click="addDialogFormVisible" style="margin-left: 7px">新增</el-button>
            </div>
            <div style="display: inline">
                <el-button class="newButtonColor btnSpace listBTN" @click="notOperateQ" style="margin-left: 7px">未处理问题</el-button>
            </div>
        </div>
        <!-- 新增 -->
        <el-dialog
            title="新增"
            :visible.sync="dialogFormVisible"
            width="960px"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            class="add_dialog"
        >
            <!-- =============站点选择================= -->
            <el-row>
                <el-col :span="3">
                    <div class="title"><i />站点选择</div>
                </el-col>
                <el-col :span="2"
                    ><el-button class="staSlect" style="margin-top: 14px" plain @click="selectStation">选择</el-button></el-col
                >
                <el-button class="staDel" style="margin-top: 14px" plain @click="delStationData">删除</el-button>
            </el-row>

            <div style="margin-top: 5px">
                <el-table
                    :data="stationData"
                    style="width: 100%"
                    max-height="400px"
                    :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                    @selection-change="staChange"
                >
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                    <el-table-column prop="regName" label="区县" width="180"></el-table-column>
                    <el-table-column prop="stationName" label="站点名称" width="180"></el-table-column>
                    <el-table-column prop="address" label="站点地址"></el-table-column>
                    <el-table-column prop="groupName" label="所属部门"></el-table-column>
                    <el-table-column prop="totalStakeNum" label="总桩数"></el-table-column>
                    <el-table-column prop="zlStakeNum" label="直流充电桩数"></el-table-column>
                    <el-table-column prop="jlStakeNum" label="交流充电桩数"></el-table-column>
                </el-table>
            </div>
            <!-- =============运维模块================= -->
            <div class="title"><i />运维模块</div>
            <div class="OpsModule">
                <el-form ref="form" :model="zoneForm" label-width="80px" size="mini">
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
                            <el-option v-for="item in modelNameMap" :key="item.id" :value="item.id" :label="item.inspName"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主模块：">
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
            <!-- =============基本信息================= -->
            <div class="title"><i />基本信息</div>
            <div class="OpsModule">
                <el-form ref="form" :model="baseInfo" label-width="80px">
                    <el-form-item label="截止时间：">
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
                    <el-form-item label="维护原因：">
                        <el-input type="textarea" v-model="baseInfo.inspectReason"></el-input>
                    </el-form-item>
                    <el-form-item label="照片：">
                        <el-upload
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
                            accept=".jpg,.png,.JPEG,.JPG,.PNG,.jpeg"
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 确认和取消按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save" class="realButton">确 定</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
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
                    <el-table-column prop="regName" label="区县" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="stationName" label="站点名称" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="address" label="站点地址" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="totalStakeNum" label="总桩数"></el-table-column>
                    <el-table-column prop="zlStakeNum" label="直流充电桩数"></el-table-column>
                    <el-table-column prop="jlStakeNum" label="交流充电桩数"></el-table-column>
                    <el-table-column prop="groupName" label="所属部门" show-tooltip-when-overflow></el-table-column>
                    <el-table-column prop="groupId" label="充电站点运营编码" show-tooltip-when-overflow></el-table-column>
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
                    <!-- <el-button size="mini" @click="exportFun">导出</el-button> -->
                </div>
            </div>

            <!-- 确认和取消按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="pushSource" class="realButton">确 定</el-button>
                <el-button @click="selectStationVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 未处理问题 -->
        <el-dialog
            title="未处理问题"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            top="30vh"
            :modal="true"
            :visible.sync="notOperateQs"
            width="950px"
            class="dialogClass selectedDialog"
        >
            <!-- <div class="chooseTable">
                <el-table
                    :data="notOperateQsList"
                    style="width: 100%"
                    :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                    ref="staTable"
                >
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column prop="id" label="任务编号" width="180">
                        <template slot-scope="scope">
                            <el-button class="click_cell" type="text" @click="handleOperateQs(scope.row)">{{ scope.row.id }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="apply_man_name" label="发布人" width="180"></el-table-column>
                    <el-table-column prop="created_time" label="发布时间"></el-table-column>
                    <el-table-column prop="org_id" label="所属部门"></el-table-column>
                    <el-table-column prop="state" label="任务状态"></el-table-column>
                </el-table>
                <div class="dl">
                    <el-pagination
                        style="display: inline-block"
                        @size-change="operateSizeChange"
                        @current-change="operateCurrentChange"
                        :current-page="notOperateData.current"
                        :page-sizes="[10, 20, 30, 40, 50]"
                        :page-size="notOperateData.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="notOperateData.total"
                    ></el-pagination>
                    <el-button size="mini" @click="refresh">刷新</el-button>
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
        <modifyOrder ref="modifyOrder" />
    </div>
</template>
<script>
import crudForm from '@/components/crudForm/index';
import { region } from '@/api/platform/generalOverview';
import { addTasks, queryStationAndStakeNum, getListByInspId, queryList, queryProblem, getDetails } from '@/api/operation/planTasks';
import { DICTDATA, getDict } from '@/api/dict';
import Vue from 'vue';
import modifyOrder from './modifyOrder.vue';
let nowTime = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}` + '';
import moment from 'moment';
const tonken = Vue.cookie.get('token');
import { BASE_API } from '@/api/request';

export default {
    data() {
        let handleOperateQs = (row) => {
            let dialog = this.$parent.$parent;
            dialog.isIgnore = true;
            dialog.operateOrderId = row.id;
            //  当前状态
            dialog.taskState = row.state;
            dialog.dialogFormVisible = true;
            dialog.urlArr = [];
            dialog.checkAll = false;
            this.$parent.$parent.$refs.modifyOrder.isFrom = 'notOperate';
            getDetails(row.id).then((res) => {
                if (res.code === '000000') {
                    dialog.urlList = res.data.docUrls;

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
                        inspName: res.data.inspName,
                        inspId: res.data.inspId,
                        inspectContentDetVos: res.data.inspectContentDetVos
                    };
                    dialog.stationData = [
                        {
                            regName: res.data.regName,
                            staName: res.data.staName,
                            addr: res.data.addr,
                            totalStakeNum: res.data.totalStakeNum,
                            zlStakeNum: res.data.zlStakeNum,
                            jlStakeNum: res.data.jlStakeNum,
                            groupId: res.data.groupId
                        }
                    ];
                    dialog.baseInfo = res.data;
                }
            });
        };
        return {
            nowTime,
            startTimeRange: '',
            stationData: [], //  新增的站点数据
            regionMap: [], //  区县map
            staMap: [], //  站点map
            selectData: [], //  选中的站点数据
            selectStationVisible: false, //  选择站点的弹窗
            stationForm: {},
            modelList: [], //  子模块的遍历
            staChangeMap: [],
            modelName: '', //  选择的模块id
            modelNameMap: [], //  下拉框的主模块
            alreadySelection: [], //  站点选择中的以选中
            pageData: {
                total: 0,
                current: 1,
                size: 0
            },
            notOperateData: {
                total: 0,
                current: 1,
                size: 0
            },
            dialogFormVisible: false, //  新增的遥控器
            zoneForm: {},
            type: [],
            notOperateQs: false, //  未处理问题的开关
            dialogImageUrl: '',
            dialogVisible: false,
            baseInfo: {},
            notOperateQsList: [],
            notOperateParams: {
                taskType: 9
            },
            //  图片上传相关
            BASE_API,
            headers: { Authorization: 'Bearer ' + tonken },
            fileList: [],
            uploadSucc: false,
            //  图片上传end
            formInline: {
                taskType: 9
            },
            queryProblem,
            fieldList: [
                { name: '任务编号', value: 'id', type: 'link', clickFn: handleOperateQs },
                { name: '发布人', value: 'apply_man_name' },
                { name: '发布时间', value: 'created_time' },
                { name: '所属部门', value: 'org_id' },
                { name: '问题描述', value: 'inspect_reason' },
                { name: '任务状态', value: 'state' }
            ]
        };
    },
    components: {
        modifyOrder,
        crudForm
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

    methods: {
        notOperateQ() {
            // this.queryProblem({ taskType: 8 });
            this.notOperateQs = true;
        },
        handleRemove(file) {
            console.log(file);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleDownload(file) {
            console.log(file);
        },
        getRowkeys(row) {
            return row.stationId;
        },
        //  通过区县查站点
        queryByCondition(arg) {
            let params = {
                regId: arg,
                stationName: '',
                taskType: 9
            };
            queryStationAndStakeNum(params).then((res) => {
                if (res.code == '000000') {
                    this.staMap = res.data.records;
                }
            });
        },
        //  查询运维模块列表
        getModelMap() {
            queryList({
                inspType: 9
            }).then((res) => {
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
            //  统一上传图片
            this.uploadSucc = true;

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
                taskType: 9,
                deadline: this.baseInfo.deadline,
                inspectReason: this.baseInfo.inspectReason,
                docUrls: []
            };
            if (inspectObjs.length == 0) {
                this.$message({ message: '请选择站点！', type: 'warning' });
                return;
            }
            if (!this.modelName) {
                this.$message({ message: '请选择模块名称！', type: 'warning' });
                return;
            }
            if (!this.baseInfo.deadline) {
                this.$message({ message: '请选择截止时间！', type: 'warning' });
                return;
            }
            if (!this.baseInfo.inspectReason) {
                this.$message({ message: '请填写维护原因！', type: 'warning' });
                return;
            }
            if (!!this.fileList) {
                for (let i = 0; i < this.fileList.length; i++) {
                    //  新上传的图片
                    if (this.fileList[i].response) {
                        params.docUrls.push(this.fileList[i].response.data[0].url);
                    } else {
                        params.docUrls.push(this.fileList[i].url);
                    }
                }
            }
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
                        this.baseInfo = {};
                        this.$refs.upload.clearFiles();
                    } else {
                        this.$message.error(res.data);
                    }
                })
                .catch((err) => {
                    this.$message.error('添加失败1');
                });
        },
        //  未处理问题
        // async queryProblem(data) {
        //     this.notOperateQs = true;
        //     const { data: res } = await queryProblem(data);
        //     this.notOperateQsList = res.records;
        //     this.notOperateData = {
        //         total: res.total,
        //         current: res.current,
        //         pageSize: res.size
        //     };
        // },

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
            this.stationForm.taskType = 9;
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
        //  =============图片上传相关==============
        //监控上传文件列表
        handleChange(file, fileList) {
            //  点击确定不执行以下操作
            if (this.uploadSucc) return;
            let existFile = fileList.slice(0, fileList.length - 1).find((f) => f.name === file.name);
            if (existFile) {
                this.$message.error('当前文件已经存在!');
                fileList.pop();
            }

            this.fileList = fileList;
        },
        beforeUpload(file) {
            const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);
            const whiteList = ['word', 'execl', 'pdf', 'jpg', 'png', 'gif', 'ceb'];
            if (whiteList.indexOf(fileSuffix) === -1) {
                this.$msg('上传文件只能是 word、execl、pdf、jpg、png、gif、ceb', 'error');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$msg('上传文件大小不能超过 2MB', 'error');
                return false;
            }
        },
        handleRemove(file, fileList) {
            let _this = this;
            for (var i = 0; i < _this.fileList.length; i++) {
                if (file.uid == _this.fileList[i].uid) {
                    _this.fileList.splice(i, 1);
                }
            }
        },
        //  =====end==========图片上传相关======================
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
        },
        // ===========未处理问题相关================
        // operateSizeChange(val) {
        //     this.notOperateParams.size = val;
        //     this.notOperateParams.current = this.notOperateData.current;
        //     this.queryProblem(this.notOperateParams);
        // },
        // operateCurrentChange(val) {
        //     this.pageData.current = val;
        //     this.notOperateParams.size = this.notOperateData.pageSize;
        //     this.notOperateParams.current = val;
        //     this.queryProblem(this.notOperateParams);
        // }
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
        display: inline-block;
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
    }
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
</style>