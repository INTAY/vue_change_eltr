<template>
    <div>
        <el-dialog title="修改" :visible.sync="modifyFormVisible" width="60%" class="yw" :close-on-click-modal="false" :modal-append-to-body="false">
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

            <div style="padding: 0 20px">
                <el-table :data="stationData" style="width: 100%" :header-cell-style="{ background: '#f1f1f1', color: '#000' }" @selection-change="staChange">
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                    <el-table-column prop="regName" label="区县" width="180"></el-table-column>
                    <el-table-column prop="staName" label="站点名称" width="180"></el-table-column>
                    <el-table-column prop="addr" label="站点地址"></el-table-column>
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
                        <el-select size="mini" filterable class="inputWidth" v-model="modelName" style="margin-left: 10px" clearable @change="getListByInspId">
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
                
                        <el-date-picker v-model="baseInfo.deadline" type="datetime" value-format="yyyy-MM-dd hh:mm:ss" placeholder="选择日期时间"></el-date-picker>
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
                <el-button @click="modifyFormVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 选择站点 -->
        <el-dialog title="站点选择" :modal-append-to-body="false" :close-on-click-modal="false" top="30vh" :modal="true" :visible.sync="selectStationVisible" width="60%" class="dialogClass selectedDialog">
            <el-form :inline="true" :model="stationForm" label-width="84px" class="demo-form-inline">
                <div class="yi">
                    <el-form-item label="区县">
                        <el-select size="mini" class="inputWidth" v-model="stationForm.regId" clearable @change="queryByCondition(stationForm.regId)">
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
                <el-table :data="selectData" style="width: 100%" :header-cell-style="{ background: '#f1f1f1', color: '#000' }" @selection-change="alreadySelectMap" :row-key="getRowkeys" ref="staTable">
                    <el-table-column type="index" width="50" label="序号" />
                    <el-table-column type="selection" align="center" :reserve-selection="true" width="55"></el-table-column>
                    <el-table-column prop="regName" label="区县" width="180"></el-table-column>
                    <el-table-column prop="stationName" label="站点名称" width="180"></el-table-column>
                    <el-table-column prop="address" label="站点地址"></el-table-column>
                    <el-table-column prop="totalStakeNum" label="总桩数"></el-table-column>
                    <el-table-column prop="zlStakeNum" label="直流充电桩数"></el-table-column>
                    <el-table-column prop="jlStakeNum" label="交流充电桩数"></el-table-column>
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
    </div>
</template>
<script>
    import {
        region
    } from '@/api/platform/generalOverview';
    import {
        addTasks,
        queryStationAndStakeNum,
        getListByInspId,
        queryList,
        queryProblem,
        reDispatch
    } from '@/api/operation/planTasks';
    import Vue from 'vue';
    import { BASE_API } from '@/api/request';
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
                modelName: '', //  选择的模块id
                modelNameMap: [], //  下拉框的主模块
                alreadySelection: [], //  站点选择中的以选中
                pageData: {
                    total: 0,
                    current: 1,
                    size: 0
                },
                modifyFormVisible: false, //  新增的遥控器
                zoneForm: {},
                type: [],
                baseInfo: {},
                notOperateParams: {},
                orderID: '',
                //  图片上传相关
                BASE_API,
                headers: { Authorization: 'Bearer ' + tonken },
                fileList: [],
                uploadSucc: false,
                isFrom: ''
                //  图片上传end
            };
        },
        mounted() {
            
            //  查询运维模块列表
            this.getModelMap();
            region(sessionStorage.getItem("regId")).then((res) => {
                if (res.code == '000000') {
                    this.regionMap = res.data;
                }
            });
            this.stationSubmit(false)
        },
        methods: {
            getRowkeys(row) {
                return row.stationId;
            },
            //  通过区县查站点
            queryByCondition(arg) {
                let params = {
                    regId: arg,
                    stationName: '',
                    taskType: 7
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
                    inspType: 7
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
                this.uploadSucc = true
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
                            totalStake: item.totalStakeNum,
                        });
                    });
                params = {
                    inspId: this.modelName,
                    inspectObjs: inspectObjs,
                    taskType: 7,
                    deadline:this.baseInfo.deadline,
                    inspectReason: this.baseInfo.inspectReason,
                    docUrls: []
                };
                if (inspectObjs.length == 0) {
                    this.$message({ message: '请选择站点！', type: 'warning'});
                    return;
                }
                if (!this.modelName) {
                    this.$message({ message: '请选择模块名称！', type: 'warning'});
                    return;
                }
                if (!this.baseInfo.deadline) {
                    this.$message({ message: '请选择截止时间！', type: 'warning'});
                    return;
                }
                if (!this.baseInfo.inspectReason) {
                    this.$message({ message: '请填写维护原因！', type: 'warning'});
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
                reDispatch(this.orderID,params)
                    .then((res) => {
                        if (res.code === '000000') {
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.modifyFormVisible = false;
                            //    还有未处理问题，修改完成后没有重新掉接口  todo
                            //  判断从哪里来的
                            if(this.isFrom == 'notOperate') {
                                this.$parent.$refs.erji.queryProblem({taskType: 7})
                            }else {
                                this.$parent.$refs.crudForm.getDataInit()
                                this.$parent.$refs.crudForm.dialogFormVisible = false
                            }
                            this.zoneForm = {};

                            this.modelName = '';
                            this.modelList = [];
                            this.stationData = [];
                            this.stationForm = {};
                            this.selectData = [];
                            this.baseInfo = {}
                        } else {
                            this.$message.error(res.data);
                        }
                    })
            },
            //  待选站点的查询
            stationSubmit(isSerachBtn) {
                //  如果是点击查询进来的，就从第一页开始查询
                if (isSerachBtn) {
                    this.stationForm.current = 1;
                }
                this.stationForm.taskType = 7
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
                const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
                const whiteList = ["word", "execl", "pdf", "jpg", "png", "gif", "ceb"];
                if (whiteList.indexOf(fileSuffix) === -1) {
                    this.$msg("上传文件只能是 word、execl、pdf、jpg、png、gif、ceb", "error");
                    return false;
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$msg("上传文件大小不能超过 2MB", "error");
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
        padding: 30px;
        box-sizing: border-box;
        border: 1px solid #efefef;
        margin-bottom: 29px;
        background-color: #f8f8f8; //主模块
        .OpsMain {
            position: relative;
            display: inline-block;
            margin-right: 20px; //按钮的半透明颜色
            margin-top: 10px;
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
        margin: 20px;
        width: 70px;
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
        margin-left: -10px;
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
    /deep/ .el-textarea__inner {
        display: block;
        resize: vertical;
        padding: 5px 15px;
        line-height: 1.5;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 80%;
        font-size: inherit;
        color: #606266;
        background-color: #FFFFFF;
        background-image: none;
        border: 1px solid #DCDFE6;
        border-radius: 2px;
        -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
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
</style>