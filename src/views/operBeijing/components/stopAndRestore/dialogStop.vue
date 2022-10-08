<template>
    <div>
        <!-- 弹出层 新增停复运申请 -->
        <el-dialog
            :title="this.signal == 0 ? '停运申请' : '复运申请'"
            :modal-append-to-body="false"
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            top="9vh"
            class="title"
            width="1050px"
            :before-close="handleCloseApplicationForm"
        >
            <div>
                <div class="form-item" style="margin-right: 2px">
                    <div class="form-item-title"><span class="line"></span>基本信息</div>
                    <div class="form-item-content">
                        <el-form ref="form" :model="formInline" :rules="rules" :inline="true" size="mini">
                            <el-row v-if="this.signal == 1">
                                <el-col :span="7">
                                    <el-form-item label="申请时间" prop="optStartTime">
                                        <el-date-picker
                                            class="picker_width"
                                            size="mini"
                                            type="datetime"
                                            v-model="formInline.optStartTime"
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
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row v-if="this.signal == 0">
                                <el-col :span="5">
                                    <el-form-item label="停运类型" prop="offType">
                                        <el-select size="mini" v-model="formInline.offType" class="selectWidth">
                                            <el-option
                                                v-for="item in offStreamType"
                                                :key="item.value"
                                                :label="item.name"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="5">
                                    <el-form-item label="停运标记" prop="offLabel">
                                        <el-select size="mini" v-model="formInline.offLabel" class="selectWidth">
                                            <el-option
                                                v-for="item in offStreamMark"
                                                :key="item.value"
                                                :label="item.name"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item label="申请停运时间" prop="optStartTime">
                                        <el-date-picker
                                            class="picker_width"
                                            size="mini"
                                            type="datetime"
                                            v-model="formInline.optStartTime"
                                            :picker-options="{
                                                selectableRange: startTimeRange,
                                                disabledDate(time) {
                                                    if (!!formInline.preReworkTime) {
                                                        return (
                                                            time.getTime() > new Date(formInline.preReworkTime).getTime() ||
                                                            time.getTime() < Date.now() - 8.64e7
                                                        );
                                                    } else {
                                                        return time.getTime() < Date.now() - 8.64e7;
                                                    }
                                                }
                                            }"
                                            :default-time="nowTime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            format="yyyy-MM-dd HH:mm"
                                            clearable
                                            placeholder="选择日期时间"
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item label="预计复运时间">
                                        <el-date-picker
                                            class="picker_width"
                                            size="mini"
                                            type="datetime"
                                            v-model="formInline.preReworkTime"
                                            :picker-options="{
                                                selectableRange: startTimeRange0,
                                                disabledDate(time) {
                                                    if (!!formInline.optStartTime) {
                                                        return (
                                                            time.getTime() <
                                                            new Date(formInline.optStartTime).getTime() - 1 * 24 * 60 * 60 * 1000
                                                        );
                                                    } else {
                                                        return time.getTime() < Date.now() - 8.64e7;
                                                    }
                                                }
                                            }"
                                            :default-time="nowTime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            format="yyyy-MM-dd HH:mm"
                                            clearable
                                            placeholder="选择日期时间"
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-form-item label="申请原因" prop="reason">
                                    <el-input type="textarea" v-model="formInline.reason" class="textarea_width"></el-input>
                                </el-form-item>
                            </el-row>
                            <el-row>
                                <el-form-item label="上传附件" style="margin-left: 8px">
                                    <el-upload
                                        class="upload-demo"
                                        ref="upload"
                                        :action="`${this.BASE_API}/filestore/fileStore/uploadMultipartFileStore?uploadType=5`"
                                        :on-remove="handleRemove"
                                        multiple
                                        :limit="1"
                                        :headers="headers"
                                        :file-list="fileList"
                                        :on-success="handleImageSuccess"
                                        :on-change="handleChange"
                                        :auto-upload="true"
                                        :before-upload="beforeUpload"
                                        accept=".doc,.docx,.pdf,.jpg,.png,.JPEG,.JPG,.PNG,.ceb,.gif,.GIF,.jpeg"
                                    >
                                        <el-button slot="trigger" size="mini" class="newButtonColor btn_width">浏览</el-button>
                                        <span class="file_tip">仅支持doc、docx、pdf、jpg、png、gif、ceb文件.</span>
                                    </el-upload>
                                </el-form-item>
                            </el-row>
                        </el-form>
                    </div>
                </div>
                <!-- 搜索区域 -->
                <div class="form-item form-item-a">
                    <div class="dev-wrap">
                        <div class="single org">
                            <!-- 表格区域 -->
                            <div class="item-sel">
                                <!-- <div class="left"> -->
                                <div>
                                    <div class="form-item-title">
                                        <span class="line"></span><span>已选充电站/桩</span>&nbsp; &nbsp;<el-button
                                            class="newButtonColor btn_width"
                                            size="mini"
                                            @click="searchSite"
                                            >选择</el-button
                                        >
                                    </div>
                                    <select-table ref="selectTable" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <el-button class="editorBTN btnSpace bouncedHold" size="mini" @click="saveApplicationForm">确认</el-button>
                <el-button size="mini" class="editorBTN cancelBTN" @click="cancelSaveApplicationForm">取消</el-button>
            </div>
        </el-dialog>
        <!-- 查询站点弹框 -->
        <!-- 查询站点弹框 -->
        <!-- 查询站点弹框 -->
        <!-- 查询站点弹框 -->
        <!-- 查询站点弹框 -->
        <div>
            <el-dialog
                title="选择充电站"
                :modal-append-to-body="false"
                :visible.sync="siteDialogFormVisible"
                :close-on-click-modal="false"
                top="10vh"
                class="title"
                width="900px"
                :before-close="handleCloseASiteForm"
            >
                <div>
                    <div class="form-item">
                        <div class="form-item-content">
                            <el-form ref="siteForm" :model="siteForm" :rules="rules" :inline="true" size="mini">
                                <el-row :gutter="5">
                                    <el-col :span="8">
                                        <el-form-item label="区县">
                                            <el-select
                                                size="mini"
                                                v-model="siteForm.regId"
                                                @change="queryByCondition(siteForm.regId)"
                                                clearable
                                            >
                                                <el-option
                                                    v-for="item in regionMap"
                                                    :key="item.id"
                                                    :value="item.id"
                                                    :label="item.name"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="9">
                                        <el-form-item label="站点名称">
                                            <el-select size="mini" filterable v-model="siteForm.id" clearable>
                                                <el-option
                                                    v-for="item in staMap"
                                                    :key="item.stationId"
                                                    :value="item.stationId"
                                                    :label="item.stationName"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-form-item>
                                            <el-button size="mini" class="newButtonColor SearchBTN" @click="querySite">查询</el-button>
                                            <el-button size="mini" class="otherBTN SearchBTN" @click="clearSite">清空</el-button>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                    </div>
                    <div class="form-item form-item-a">
                        <!-- 表格区域 -->
                        <div class="item-sel">
                            <div class="cont">
                                <el-table
                                    :data="siteTableData"
                                    :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                                    stripe
                                    max-height="400px"
                                    style="width: 100%"
                                >
                                    <el-table-column type="index" width="50" />
                                    <el-table-column width="50">
                                        <template slot-scope="scope">
                                            <el-radio
                                                :label="scope.$index"
                                                v-model="radio"
                                                @change.native="getCurrentRow(scope.row)"
                                                >{{&nbsp;}}</el-radio
                                            >
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="站点名称" show-overflow-tooltip prop="staName" align="left"></el-table-column>
                                    <el-table-column label="区县" show-overflow-tooltip prop="regName"></el-table-column>
                                    <el-table-column label="地址" prop="addr"></el-table-column>
                                    <el-table-column
                                        label="站状态"
                                        show-overflow-tooltip
                                        prop="state"
                                        :formatter="stateFormat"
                                    ></el-table-column>
                                </el-table>
                            </div>
                            <!-- 分页 -->
                            <div class="page-wrap">
                                <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :page-size="pageData.size"
                                    :total="pageData.total"
                                    :current-page="pageData.current"
                                    :page-sizes="[10, 20, 30, 40, 50, 100]"
                                    layout="total, sizes, prev, pager, next, jumper, slot"
                                >
                                    <span class="el-pagination__jump page-option-wrap">
                                        <a class="el-icon-refresh page-option-icon" href="javascript:;" @click="refresh" title="刷新">
                                            <!-- <img src="/static/img/7.png" /> -->
                                        </a>
                                    </span>
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </div>
                <div slot="footer">
                    <el-button class="editorBTN btnSpace bouncedHold" size="mini" @click="nextStep">下一步</el-button>
                    <el-button size="mini" class="editorBTN cancelBTN" @click="siteDialog">取消</el-button>
                </div>
            </el-dialog>
        </div>
        <!--  选择充电桩弹框-->
        <!--  选择充电桩弹框-->
        <!--  选择充电桩弹框-->
        <!--  选择充电桩弹框-->
        <!--  选择充电桩弹框-->

        <div>
            <el-dialog
                title="选择充电桩"
                :modal-append-to-body="false"
                :visible.sync="chargeDialogFormVisible"
                :close-on-click-modal="false"
                class="title"
                width="900px"
                top="11vh"
                :before-close="handleCloseCharge"
            >
                <div>
                    <div class="form-item">
                        <div>
                            <div>
                                <!-- <span>   :class="{ title: true, bgc_fault: siteInfo.state != '正常使用' }" -->
                                <span>
                                    <el-button type="text" class="form-item-title">
                                        {{ formInline.staName }}
                                        <span style="color: #24b3ca; font-size: 13px; font-weight: normal"
                                            >【{{ translatorDict(DICTDATA.UNIT_TYPE, Number(formInline.staStatus)) }}】</span
                                        >
                                    </el-button>
                                    <!-- <el-button type="text" size="mini" v-if="this.signal == '0'" class="stopAllBtn stop_recover_btn"> -->
                                    <!-- <el-button type="text" size="mini" v-if="this.signal == '0'" :class="{stopAllBtn:true, stop_recover_btn:true,ceshi:checked}"> -->
                                    <span class="checked_btn" v-if="this.signal == '0'">
                                        <el-checkbox :class="{ checked_bgc: checked }" v-model="checked">整站停运</el-checkbox>
                                    </span>
                                    <!-- </el-button> -->
                                    <!-- <el-button type="text" size="mini" v-else class="recoverAllBtn stop_recover_btn"> -->
                                    <span class="checked_recover_btn" v-else>
                                        <el-checkbox :class="{ checked_bgc: checked }" v-model="checked">整站复运</el-checkbox>
                                    </span>
                                    <!-- </el-button> -->
                                </span>
                            </div>
                        </div>
                        <div class="form-item-content">
                            <el-form ref="chargeForm" :model="chargeForm" :rules="rules" :inline="true" size="mini">
                                <el-row>
                                    <el-col :span="6" style="margin-right:10px;">
                                        <el-form-item label="桩编号">
                                            <el-input size="mini" v-model="chargeForm.id" clearable placeholder="请输入" class="input_w"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" style="margin-right:10px;">
                                        <el-form-item label="桩名称" >
                                            <el-input size="mini" v-model="chargeForm.devName" clearable placeholder="请输入" class="input_w"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" style="margin-right:10px;">
                                        <el-form-item label="桩类型">
                                            <el-select size="mini" v-model="chargeForm.devType" clearable class="input_w">
                                                <el-option
                                                    v-for="item in stakeType"
                                                    :key="item.value"
                                                    :label="item.name"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="5" >
                                        <el-form-item>
                                            <el-button size="mini" class="newButtonColor SearchBTN" @click="searchCharge">查询</el-button>
                                            <el-button size="mini" class="otherBTN SearchBTN" @click="clearCharge">清空</el-button>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                    </div>
                    <div class="form-item form-item-a">
                        <!-- 表格区域 -->
                        <div class="item-sel">
                            <div class="cont">
                                <el-table
                                    :data="chargeTableData"
                                    ref="multipleTable"
                                    :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                                    stripe
                                    max-height="405"
                                    @selection-change="handleSelectionChangeT"
                                    style="width: 100%"
                                >
                                    <el-table-column type="index" align="center" width="50" />
                                    <el-table-column type="selection" :selectable="isDisabled" disabled="true" width="45" align="center" />
                                    <el-table-column
                                        label="桩编号"
                                        width="170px"
                                        show-overflow-tooltip
                                        prop="id"
                                        align="left"
                                    ></el-table-column>

                                    <el-table-column label="桩名称" show-overflow-tooltip prop="devName"></el-table-column>
                                    <el-table-column label="产权单位" prop="orgName" show-overflow-tooltip></el-table-column>
                                    <el-table-column
                                        label="桩类型"
                                        show-overflow-tooltip
                                        prop="engSupType"
                                        :formatter="devTypeFormat"
                                    ></el-table-column>
                                    <el-table-column label="桩状态" prop="state" :formatter="stateFormat"></el-table-column>
                                    <el-table-column
                                        label="申请时间"
                                        v-if="this.signal == 1"
                                        show-overflow-tooltip
                                        prop="expireDate"
                                    ></el-table-column>
                                    <el-table-column
                                        label="预计复运时间"
                                        show-overflow-tooltip
                                        v-if="this.signal == 1"
                                        prop="fillTime"
                                    ></el-table-column>
                                    <el-table-column label="厂家名称" prop="factName" show-overflow-tooltip></el-table-column>
                                </el-table>
                            </div>
                            <!-- 分页 -->
                            <!-- <div class="page-wrap">
                                <el-pagination
                                    @size-change="handleSizeChangeT"
                                    @current-change="handleCurrentChangeT"
                                    :page-size="pageDataT.size"
                                    :total="pageDataT.total"
                                    :current-page="pageDataT.current"
                                    :page-sizes="[10, 20, 30, 40, 50, 100]"
                                    layout="total, sizes, prev, pager, next, jumper, slot"
                                >
                                    <span class="el-pagination__jump page-option-wrap">
                                        <a class="el-icon-refresh page-option-icon" href="javascript:;" @click="refreshT" title="刷新">
                                        </a>
                                    </span>
                                </el-pagination>
                            </div> -->
                        </div>
                    </div>
                </div>
                <div slot="footer">
                    <el-button class="editorBTN btnSpace bouncedHold" @click="sendChargeList" v-if="!checked" size="mini">确定</el-button>
                    <el-button class="editorBTN btnSpace bouncedHold" @click="allSiteRecover" v-if="checked" size="mini">确定</el-button>
                    <el-button size="mini" class="editorBTN cancelBTN" @click="cancelCharge">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {
    queryStationByRegAndName,
    region,
    addProOptApplyBj,
    queryStations,
    queryChargeList,
    getOrgById,
    updateById
} from '@/api/operBeijing/stopAndRestore';
import { getDict, DICTDATA, translatorDict } from '@/api/dict';
import selectTable from './selectTable';
import Vue from 'vue';
import { BASE_API } from '@/api/request';
const tonken = Vue.cookie.get('token');
import moment from 'moment';
const nowTime = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}` + '';
export default {
    data() {
        return {
            // isModify: false,
            DICTDATA,
            translatorDict,
            startTimeRange: '',
            startTimeRange0: '',
            nowTime,
            orgId: '',
            regId: '',
            siteTableData: [], // 站点表格数据
            offStreamType: [], // 停运类型
            signal: null, // 0是停运 1是复运
            siteDialogFormVisible: false, //站点
            chargeDialogFormVisible: false,
            // formSearch: {},
            dialogFormVisible: false,
            formInline: {
                flag: null,
                applySource: '',
                proOptDevForms: null, //停复运设备
                staId: '',
                regId: '',
                planType: '', // 计划停运类型
                url: '',
                staStatus: '', // 申请时刻站状态
                staName: '', //站名字
                applyOrg: '' // 组织机构
            }, //停运申请form
            rules: {
                offType: [{ required: true, message: '请选择停运类型', trigger: 'change' }],
                offLabel: [{ required: true, message: '请选择停运标记', trigger: 'change' }],
                optStartTime: [{ required: true, message: '请选择申请时间', trigger: 'change' }],
                reason: [{ required: true, message: '请填写申请原因', trigger: 'blur' }]
            },
            fileList: [], // 文件上传
            siteForm: {
                state: '',
                regId: ''
            }, // 站点
            chargeForm: {}, //充电桩
            chargeTableData: [], //充电桩表格数据
            pageData: {
                total: 0,
                current: 1,
                pageSize: 10
            },

            staMap: [], //站
            regionMap: [], //区域
            radio: null,
            SelectionCharge: [], //选中的桩
            headers: { Authorization: 'Bearer ' + tonken },
            BASE_API,
            stakeType: [], // 桩类型
            staId: '', //站点id
            selectSite: [], // 选中的站点
            checked: false
        };
    },
    components: {
        selectTable
    },
    computed: {
        optStartTime() {
            return this.formInline.optStartTime;
        },
        preReworkTime() {
            return this.formInline.preReworkTime;
        }
    },
    watch: {
        optStartTime: {
            immediate: true,
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
        },
        preReworkTime: {
            immediate: true,
            handler(newValue, oldValue) {
                if (newValue) {
                    let nowDate = moment().format('YYYY-MM-DD HH:mm:ss');
                    let dt = nowDate.split(' ');
                    let nv = newValue.split(' ');
                    let st = '';
                    if (!!this.formInline.optStartTime) {
                        let ot = this.formInline.optStartTime.split(' ');
                        if (ot[0] === nv[0]) {
                            st = dt[1];
                        } else {
                            st = '00:00:00';
                        }
                    } else {
                        if (newValue.split(' ')[0] == dt[0]) {
                            st = dt[1];
                        } else {
                            st = '00:00:00';
                        }
                    }
                    this.startTimeRange0 = st + ' - 23:59:59';
                }
            }
        }
    },

    created() {
        this.orgId = JSON.parse(sessionStorage.getItem('user')).orgId;
    },
    mounted() {
        this.getRegId();
        // 223 能量补给类型
        getDict(DICTDATA.ENERGY_SUPPLY_TYPE).then((res) => {
            this.stakeType = res;
        });
        // 停运类型
        getDict(DICTDATA.OFF_STREAM_TYPE).then((res) => {
            this.offStreamType = res;
        });
        // 停运标记
        getDict(DICTDATA.OFF_STREAM_MARK).then((res) => {
            this.offStreamMark = res;
        });
        // this.init();
    },
    methods: {
        getRegId() {
            getOrgById(this.orgId).then((res) => {
                if (res.code === '000000') {
                    this.regId = res.data.regionId;
                }
                this.regionMap = [];
                //  获取区域信息
                if (!!this.regId) {
                    region(this.regId).then((res) => {
                        if (res.code == '000000') {
                            this.regionMap = res.data;
                            this.staMap = [];
                        }
                    });
                }
            });
        },

        //监控上传文件列表
        handleChange(file, fileList) {
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

            const whiteList = ['doc', 'docx', 'pdf', 'jpg', 'png', 'gif', 'ceb'];

            if (whiteList.indexOf(fileSuffix) === -1) {
                this.$msg('上传文件只能是 doc、docx、pdf、jpg、png、gif、ceb', 'error');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isLt2M) {
                this.$msg('上传文件大小不能超过 2MB', 'error');
                return false;
            }
        },

        // 上传成功
        handleImageSuccess(res, file, fileList) {
            // console.log(res, '上传成功');
            if (res.code === '000000') {
                this.formInline.url = this.fileList[0].response.data[0].url;
            }
        },

        // 根据区域查站点
        queryByCondition(arg) {
            this.staMap = [];
            let params = { regId: arg, state: '' };
            if (this.signal == '0') {
                // 停运
                params = { regId: arg, state: 5 };
            } else {
                // 复运
                params = { regId: arg, state: 6 };
            }
            queryStationByRegAndName(params).then((res) => {
                if (res.code == '000000') {
                    this.staMap = res.data.records;
                    // console.log(this.staMap,"this.staMap");
                }
            });
        },

        // 表格单选框
        getCurrentRow(row) {
            // console.log(row, 'row');
            this.selectSite = [];
            this.staId = row.id;
            this.formInline.staStatus = row.state;
            this.formInline.staId = row.staId;
            this.formInline.regId = row.regId;
            this.formInline.staName = row.staName;
            this.selectSite.push(row);
        },
        // 文件上传
        submitUpload() {
            this.$refs.upload.submit();
        },
        // 删除附件
        handleRemove(file, fileList) {
            let _this = this;
            for (let i = 0; i < _this.fileList.length; i++) {
                if (file.uid == _this.fileList[i].uid) {
                    _this.fileList.splice(i, 1);
                    this.formInline.url = '';
                }
            }
            if (!!file.response) {
                if (!!file.response.data.url) {
                    this.formInline.url = '';
                }
            }
        },
        handlePreview(file) {
            // console.log(file);
        },
        // 选择站点弹框
        searchSite() {
            this.radio = null;
            // 如果是停运
            if (this.signal == '0') {
                this.queryStations({ regId: this.regId, state: 5 });
                // this.queryStations({ state: 5 });
            } else {
                // 这是复运
                this.queryStations({ regId: this.regId, state: 6 });
                // this.queryStations({});
            }
            this.siteDialogFormVisible = true;
        },
        // 查询站点
        queryStations(data) {
            queryStations(data).then((res) => {
                // console.log(res, '站点信息');
                if (res.code == '000000') {
                    this.siteTableData = res.data.records;
                    this.pageData = {
                        total: res.data.total,
                        current: res.data.current,
                        pageSize: res.data.size
                    };
                }
            });
        },
        // 条件查询站点
        querySite() {
            let params = {};
            params.id = this.siteForm.id;
            if (this.signal == '0') {
                params.state = 5;
                if (!this.siteForm.regId) {
                    params.regId = this.regId;
                } else {
                    params.regId = this.siteForm.regId;
                }
                this.queryStations(params);
            } else {
                params.state = 6;
                if (!this.siteForm.regId) {
                    params.regId = this.regId;
                } else {
                    params.regId = this.siteForm.regId;
                }
                this.queryStations(params);
            }
        },
        //清空查询站点条件
        clearSite() {
            this.siteForm = {};
        },
        handleCloseASiteForm() {
            this.siteForm = {};
            this.radio = null;
            this.staId = '';
            this.siteDialogFormVisible = false;
        },
        siteDialog() {
            this.radio = null;
            this.siteForm = {};
            this.staId = '';
            this.siteDialogFormVisible = false;
        },
        // 下一步
        nextStep() {
            this.chargeForm = {};
            if (!this.staId) {
                this.$message({
                    message: '请选择站点!',
                    type: 'error'
                });
                return false;
            } else {
                if (this.signal == '0') {
                    this.queryChargeList({ staId: this.staId, state: 5, size: 999 });
                    this.chargeDialogFormVisible = true;
                } else {
                    this.queryChargeList({ staId: this.staId, state: 6, size: 999 });
                    this.chargeDialogFormVisible = true;
                }
            }
        },
        //条件查询桩
        searchCharge() {
            this.chargeForm.staId = this.staId;
            this.chargeForm.size = 999;
            if (this.signal == '0') {
                this.chargeForm.state = 5;
                this.queryChargeList(this.chargeForm);
            } else {
                this.chargeForm.state = 6;
                this.queryChargeList(this.chargeForm);
            }
        },
        // 清空桩查询条件
        clearCharge() {
            this.chargeForm = {};
        },
        isDisabled(row, index) {
            // console.log(this.checked, 'check');
            if (!this.checked) {
                document.getElementsByClassName('el-checkbox__input')[2].classList.remove('is-disabled');
                return 1;
            } else {
                document.getElementsByClassName('el-checkbox__input')[2].classList.add('is-disabled');
                document.getElementsByClassName('el-checkbox__original')[2].disabled = true;
                return 0;
            }
        },
        // 整站停/复运确定
        allSiteRecover() {
            // console.log(this.signal, 'signal');
            this.$refs.selectTable.isSiteSelectTable = true;
            this.checked = false;
            if (this.signal == '0') {
                this.formInline.flag = 1;
                this.formInline.planType = 1;
            } else {
                this.formInline.flag = 1;
                this.formInline.planType = 2;
            }
            this.siteDialogFormVisible = false;
            this.chargeDialogFormVisible = false;
            this.$refs.selectTable.selectTable = this.selectSite;
            this.formInline.staId = this.staId;
            // console.log(this.formInline, 'form');
        },
        // 关闭选桩弹窗
        handleCloseCharge() {
            this.checked = false;
            this.chargeTableData = [];
            this.chargeDialogFormVisible = false;
        },
        // 发送选中的桩列表
        sendChargeList() {
            if (this.SelectionCharge == 0) {
                this.$message({
                    message: '请选择充电桩!',
                    type: 'error'
                });
                return false;
            } else {
                this.$refs.selectTable.isSiteSelectTable = false;
                this.checked = false;
                this.formInline.flag = 0;
                this.siteDialogFormVisible = false;
                this.chargeDialogFormVisible = false;
                this.$refs.selectTable.selectTable = this.SelectionCharge;
                this.formInline.staId = this.staId;
                if (this.signal == '0') {
                    this.formInline.planType = 1;
                } else {
                    this.formInline.planType = 2;
                }
            }
        },

        // 保存
        saveApplicationForm() {
            // console.log(_this.fileList,"上传文件的格式");
            let _this = this;
            // 校验
            // return;
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (selectTable.length == 0) {
                        this.$message({
                            message: '已选充电站/桩不能为空！',
                            type: 'warning'
                        });
                        return;
                    } else {
                        let selectTable = this.$refs.selectTable.selectTable;
                        _this.radio = null;
                        _this.formInline.applyOrg = this.orgId;
                        _this.formInline.applySource = 1; // 来源
                        _this.formInline.proOptDevForms = selectTable; //桩列表

                        if (!!this.formInline.id) {
                            if (!!_this.fileList[0]) {
                                if (!!_this.fileList[0].url) {
                                    _this.formInline.url = _this.fileList[0].url;
                                }
                            }
                            // console.log(_this.formInline, '_this.formInline');
                            updateById(_this.formInline)
                                .then((res) => {
                                    if (res.code === '000000') {
                                        this.$message({
                                            message: '修改成功',
                                            type: 'success'
                                        });

                                        let parent = _this.$parent.$parent.$parent.$refs;
                                        parent.operateDetail.detailInfo = [];
                                        parent.operateDetail.dialogFormVisible = false;
                                        parent.crudForm.getDataInit();
                                        _this.applicationFormInit();
                                    } else {
                                        _this.$message.error(res.data);
                                    }
                                })
                                .catch((res) => {
                                    _this.$message.error('修改失败！');
                                });
                        } else {
                            // 给devid赋值
                            for (let i = 0; i < _this.formInline.proOptDevForms.length; i++) {
                                _this.formInline.proOptDevForms[i].devId = _this.formInline.proOptDevForms[i].id;
                            }
                            if (_this.formInline.flag != 0) {
                                _this.formInline.proOptDevForms = [];
                            }
                            // console.log(_this.formInline, '_this.formInline');
                            // return;
                            addProOptApplyBj(_this.formInline)
                                .then((res) => {
                                    if (res.code === '000000') {
                                        _this.$message({
                                            showClose: true,
                                            message: '保存成功！',
                                            type: 'success'
                                        });
                                        // 重新查询数据
                                        _this.$parent.$parent.$parent.$refs.crudForm.getDataInit();
                                        _this.applicationFormInit();
                                    } else {
                                        _this.$message.error(res.data);
                                    }
                                })
                                .catch((res) => {
                                    _this.$message.error('保存失败！');
                                });
                        }
                    }
                }
            });
        },
        // 取消保存
        cancelSaveApplicationForm() {
            this.applicationFormInit();
        },
        // 关闭弹窗
        handleCloseApplicationForm() {
            this.applicationFormInit();
        },
        applicationFormInit() {
            this.dialogFormVisible = false;
            this.$refs.selectTable.selectTable = [];
            this.fileList = [];
            this.formInline = {};
            this.$refs['form'].resetFields();
        },
        // 桩pageSize 变化
        // handleSizeChangeT(val) {
        //     let chargeForm = this.chargeForm;
        //     this.pageDataT.pageSize = val;
        //     chargeForm.size = this.pageDataT.pageSize;
        //     chargeForm.current = this.pageDataT.current;
        //     this.queryChargeList(chargeForm);
        // },
        // //  桩 点击某页
        // handleCurrentChangeT(val) {
        //     let chargeForm = this.chargeForm;
        //     this.pageDataT.current = val;
        //     chargeForm.size = this.pageDataT.pageSize;
        //     chargeForm.current = this.pageDataT.current;
        //     this.queryChargeList(chargeForm);
        // },
        // // 桩 分页-刷新
        // refreshT() {
        //     let chargeForm = this.chargeForm;
        //     chargeForm.size = this.pageDataT.pageSize;
        //     chargeForm.current = this.pageDataT.current;
        //     this.queryChargeList(chargeForm);
        // },
        // 选中的桩
        handleSelectionChangeT(val) {
            this.SelectionCharge = val;
        },
        // 桩页面取消
        cancelCharge() {
            this.checked = false;
            this.chargeTableData = [];
            this.chargeDialogFormVisible = false;
        },
        // 查询桩
        queryChargeList(params) {
            //   this.loading = true;
            queryChargeList(params).then((res) => {
                // this.loading = false;
                // console.log(res, 'chargeTableData');
                this.chargeTableData = res.data.records;
                // this.pageDataT = {
                //     total: res.data.total,
                //     current: res.data.current,
                //     pageSize: res.data.size
                // };
            });
        },

        // 站pageSize 变化
        handleSizeChange(val) {
            this.pageData.pageSize = val;
            let siteForm = this.siteForm;
            let params = {};
            params.current = this.pageData.current;
            params.size = this.pageData.pageSize;
            params.staId = siteForm.staId;
            if (this.signal == '0') {
                params.state = 5;
                if (!siteForm.regId) {
                    params.regId = this.regId;
                } else {
                    params.regId = siteForm.regId;
                }
                this.queryStations(params);
            } else {
                params.state = 6;
                if (!siteForm.regId) {
                    params.regId = this.regId;
                } else {
                    params.regId = siteForm.regId;
                }

                this.queryStations(params);
            }
        },
        //  站点击某页
        handleCurrentChange(val) {
            this.pageData.current = val;
            let siteForm = this.siteForm;
            let params = {};
            params.current = this.pageData.current;
            params.size = this.pageData.pageSize;
            params.staId = siteForm.staId;
            if (this.signal == '0') {
                params.state = 5;
                if (!siteForm.regId) {
                    params.regId = this.regId;
                } else {
                    params.regId = siteForm.regId;
                }
                this.queryStations(params);
            } else {
                params.state = 6;
                if (!siteForm.regId) {
                    params.regId = this.regId;
                } else {
                    params.regId = siteForm.regId;
                }
                this.queryStations(params);
            }
        },
        // 站分页-刷新
        refresh() {
            let siteForm = this.siteForm;
            let params = {};
            params.current = this.pageData.current;
            params.size = this.pageData.pageSize;
            params.staId = siteForm.staId;
            if (this.signal == '0') {
                params.state = 5;
                if (!siteForm.regId) {
                    params.regId = this.regId;
                } else {
                    params.regId = siteForm.regId;
                }
                this.queryStations(params);
            } else {
                params.state = 6;
                if (!siteForm.regId) {
                    params.regId = this.regId;
                } else {
                    params.regId = siteForm.regId;
                }
                this.queryStations(params);
            }
        },

        // 桩状态格式化 字典200
        stateFormat(row, column, cellValue, index) {
            if (cellValue !== '') {
                return translatorDict(DICTDATA.UNIT_TYPE, cellValue);
            } else {
                return '';
            }
        },
        // 桩类型格式化
        devTypeFormat(row, column, cellValue, index) {
            if (cellValue !== '') {
                return translatorDict(DICTDATA.ENERGY_SUPPLY_TYPE, cellValue);
            } else {
                return '';
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.focus_btn {
    width: 200px;
    height: 35px;
    color: #fff !important;
    margin-right: 12px;
    background-color: #105972;
}
.focus_btn:focus,
.focus_btn:hover {
    color: #fff;
    background-color: #116c8a;
}

// .stopAllBtn {
// color: #fff;
// border-color: #e68282;
// background-color: #fef3f3;
// /deep/ .el-checkbox__inner {
//     border-color: #eb8f8f;
// }
// }
.ceshi {
    background-color: #f3aeae !important;
}
.checked_btn {
    .checked_bgc {
        background-color: #ad0000 !important;
    }
    .el-checkbox {
        display: inline-block;
        background-color: #fef3f3;
        border: 1px solid #e68282;
        width: 120px;
        height: 32px;
        line-height: 30px;
        text-align: center;
        color: #ad0000;
        border-radius: 3px;
    }
    /deep/ .el-checkbox__inner {
        border-color: #eb8f8f;
    }
    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #ad0000;
    }
    /deep/ .el-checkbox__inner::after {
        border: 1px solid #ad0000;
        border-left: 0;
        border-top: 0;
    }
    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff !important;
    }
    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #fff;
    }
}
.checked_recover_btn {
    .checked_bgc {
        background-color: #1396c2 !important;
    }
    .el-checkbox {
        display: inline-block;
        background-color: #edf7fb;
        border: 1px solid #6ab1d3;
        width: 120px;
        height: 32px;
        line-height: 30px;
        text-align: center;
        color: #0b7ea4;
        border-radius: 3px;
    }
    /deep/ .el-checkbox__inner {
        border-color: #5eabc5;
    }
    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #1396c2;
    }
    /deep/ .el-checkbox__inner::after {
        border: 1px solid #1396c2;
        border-left: 0;
        border-top: 0;
    }
    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff !important;
    }
    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #fff;
    }
}

// // .stopAllBtn:focus,
// .stopAllBtn:hover {
//     // color: #fff;
//     // background-color: #f5adad;
//     background-color: #ad0000;
// }

// .recoverAllBtn {
//     border: 1px solid #6ab1d3;
//     background-color: #edf7fb;
//     /deep/ .el-checkbox__label {
//         color: #0b7ea4;
//     }
//     /deep/ .el-checkbox__inner {
//         border-color: #5eabc5;
//     }
// }
// .stop_recover_btn {
//     width: 110px;
//     height: 32px;
// }

/deep/ .el-upload {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    outline: none;
    border: none;
    width: 130px;
    height: 35px;
}

.listBTN {
    margin-left: 5px;
}
.dialog-btn {
    margin: 20px 0 10px;
}

/deep/ .el-dialog__body {
    padding: 0 40px 1px 30px;
}
/deep/ .form-item .el-form-item--mini.el-form-item {
    margin: 10px 0;
}
.t-a-c {
    text-align: center;

    .el-input__inner {
        text-align: center !important;
    }
}
.el-table {
    margin-bottom: 10px;
}
.el-button--primary {
    background-color: #006080;
    border-color: #006080;
}

.el-button--primary:hover {
    color: #fff;
}

.el-button--mini,
.el-button--small {
    border-radius: 2px;
}

.selectWidth {
    width: 120px;
}

.width-240 {
    width: 240px;
}

.width-620 {
    width: 620px;
}

.form-item {
    .file_tip {
        color: red !important;
        vertical-align: super;
        font-size: 12px;
        margin-left: 3px;
    }
    /deep/ .el-upload {
        height: 31px;
        width: 83px;
    }
    vertical-align: baseline;
    .form-item-content {
        padding: 0 10px;
        border: 1px solid #efefef;
        .textarea_width {
            width: 863px !important;
        }
    }
    .search-wrap {
        height: 48px;
        line-height: 24px;
    }
    .form-item-title {
        margin-top: 5px;
        font-size: 13.5px;
        line-height: 30px;
        color: #434343;
        margin-bottom: 5px;
        font-weight: 500;

        .line {
            display: inline-block;
            vertical-align: middle;
            width: 4px;
            height: 14px;
            margin-right: 10px;
            background-color: #24b3ca;
            border-radius: 4px;
            margin-top: -3px;
        }
    }
    .site_btn_restore {
        width: 100px;
        height: 25px;
        line-height: 0;
        color: #f1f1f1;
        background-color: #006080;
        border-radius: 3px;
    }
}
.form-item-a {
    margin-top: 5px;
}
.item-sel {
    overflow: hidden;
    .daixuan {
        font-weight: 700;
        color: #1e1e1e;
        display: inline-block;
        margin-right: 5px;
    }
    .add-btn {
        width: 135px;
    }
    .left {
        width: 490px;
        float: left;
        border: 1px solid #eaeaea;
        border-radius: 4px;

        .title {
            background-color: #f1f1f1;
            color: #00607f;
            height: 35px;
            line-height: 35px;
            padding-left: 10px;
            font-weight: bold;
        }

        .cont {
            height: 300px;
            padding: 10px;
            overflow-y: auto;
            margin-bottom: 10px;
        }
    }

    .middle {
        margin-left: 550px;
    }

    .right {
        width: 580px;
        float: left;
        border: 1px solid #eaeaea;
        border-radius: 4px;

        .title {
            background-color: #f1f1f1;
            color: #00607f;
            height: 35px;
            line-height: 35px;
            padding-left: 10px;
            font-weight: bold;
        }

        .cont {
            height: 300px;
            padding: 10px;
            overflow-y: auto;
        }
    }
}

/deep/ .el-form-item__label {
    color: #909090 !important;
}
.input_w {
    width: 150px;
}
/deep/ .btn_width {
    width: 80px;
    border-radius: 2px;
}
.picker_width {
    width: 170px;
}
/deep/ .el-input--prefix .el-input__inner {
    padding-left: 10px;
}
</style>
