<template>
  <div>
    <div class="s">
      <el-button size="mini" class="newButtonColor listBTN" @click="addWin = true">新增工单</el-button>
    </div>
    <div>
      <el-dialog title="新增工单" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="addWin"
                 class="yw" width="1150px" top="18vh" style="left:80px">
        <div>
          <div class="form-item">
            <div class="form-item-title"><span class="line"/>基本信息</div>
            <div class="form-item-content">
              <el-form label-width="120px" size="small" class="xy" :model="formAdd" :rules="formAddRules"  ref="formAddRulesForm">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="工单类型" prop="type">
                      <el-select class="kz" size="mini" v-model="formAdd.type" placeholder="请选择" clearable>
                        <el-option v-for="item in orderTypes"
                                   :key="item.value"
                                   :value="item.value"
                                   :label="item.name">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="工单级别" prop="level">
                      <el-select class="kz" size="mini" v-model="formAdd.level" placeholder="请选择" clearable>
                        <el-option v-for="item in orderLevel"
                                   :key="item.value"
                                   :value="item.value"
                                   :label="item.name">
                        </el-option>
                        </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="计划完成时间" prop="planFinishTime">
                      <el-date-picker class="kz" v-model="formAdd.planFinishTime" format="yyyy-MM-dd HH:mm"
                                      type="datetime" size="mini"
                                      placeholder="选择日期"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <br/>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="联系人" prop="linkMan">
                      <el-input class="kz" v-model="formAdd.linkMan" placeholder="请输入内容"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="联系电话" prop="tel">
                      <el-input class="kz" v-model="formAdd.tel" placeholder="请输入内容"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <div class="form-item">
            <div class="form-item-title">
              <span class="line"/>设备
            </div>
            <div class="form-item-content case-info">
              <div class="dev-wrap">
                <div class="single org">
                  <div class="search-wrap">
                    <el-form :inline="true" label-width="120px" :rules="rules" ref="ruleForm" :model="formAddDevice" class="demo-form-inline">
                        <el-form-item label="行政区域" prop="regId">
                          <el-cascader
                            v-model="formAddDevice.regId"
                            size="mini"
                            prop="regId"
                            :options="regTreeData"
                            :props="defaultProps"
                            clearable
                            @change="handleChange"
                            placeholder="请选择"
                          ></el-cascader>
                      </el-form-item>
                      <el-form-item label="充电站" prop="staId">
                        <el-select size="mini"  v-model="formAddDevice.staIdList"  filterable placeholder="请选择" >
                          <el-option
                            v-for="item in chargeList"
                            :key="item.id"
                            :value="item"
                            :label="item.staName">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="设备类型" prop="endDate">
                        <el-select  size="mini" v-model="formAddDevice.devType" placeholder="请选择" clearable>
                          <el-option v-for="item in deviceType"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.name">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="状态" prop="endDate">
                        <el-select size="mini" v-model="formAddDevice.state" placeholder="请选择" clearable>
                          <el-option v-for="item in deviceStatus"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.name">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item>
                        <el-button size="mini" class="newButtonColor SearchBTN" @click="querySource('ruleForm', formAddDevice)">查询</el-button>
                      </el-form-item>
                      <el-form-item>
                        <el-button size="mini" plain class="otherBTN SearchBTN" @click="clearMap">清空</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div class="item-sel">
                    <!-- 表格区域 -->
                      <div class="item-sel">
                        <div>
                          <span class="daixuan">待选设备</span>
                          <span>
                            <el-button class="newButtonColor listBTN" size="mini" @click="addSourceMap">设备选择</el-button>
                          </span>
                          <div class="cont">
                            <el-table  :data="tableData_devunsel"  :header-cell-style="{background:'#f1f1f1',color:'#000'}"  stripe  @selection-change="handleSelectionChange"  style="width: 100%">
                              <el-table-column type="selection" width="45" align="center"></el-table-column>
                              <el-table-column  label="编号"  :show-overflow-tooltip="true"  prop="id"  align="center"></el-table-column>
                              <el-table-column  label="充电设施名称"  :show-overflow-tooltip="true"  prop="devName"  align="left"></el-table-column>
                              <el-table-column  label="所属站点"  :show-overflow-tooltip="true"  prop="stationName"  align="left"></el-table-column>
                              <el-table-column  label="设备类型" :formatter="deviceTypeFormat"  align="center" prop="devType"></el-table-column>
                              <el-table-column label="所属组织机构" align="center" prop="orgName"></el-table-column>
                              <el-table-column  label="行政区域"  :show-overflow-tooltip="true"  prop="regId"  align="center"></el-table-column>
                              <el-table-column  label="状态" :formatter="sheetStatusFormat"  :show-overflow-tooltip="true"  prop="state"  align="left"></el-table-column>
                            </el-table>
                          </div>
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
                          </el-pagination>
                        </div>

                        <div style="margin-top: 50px;">
                          <span class="daixuan">已选设备</span>
                          <span>
                            <el-button class="BatchDeleteColor listBTN" size="mini" @click="removeDevSel">批量删除</el-button>
                          </span>
                          <div class="cont">
                            <el-table  :data="tableData_devsel"  :header-cell-style="{background:'#f1f1f1',color:'#000'}"  stripe  @selection-change="handleSelectionChangeDevSel"  style="width: 100%">
                              <el-table-column type="selection" width="45" align="center"></el-table-column>
                              <el-table-column  label="编号"  :show-overflow-tooltip="true"  prop="devId"  align="center"></el-table-column>
                              <el-table-column  label="充电设施名称"  :show-overflow-tooltip="true"  prop="devName"  align="left"></el-table-column>
                              <el-table-column  label="所属站点"  :show-overflow-tooltip="true"  prop="stationName"  align="left"></el-table-column>
                              <el-table-column label="描述" align="center" prop="descr">
                                  <template slot-scope="scope">
                                    <el-input
                                      type="text"
                                      v-model="scope.row.descr"
                                    ></el-input>
                                  </template>
                              </el-table-column>
                              <el-table-column label="发生时间" align="center" prop="generaTime">
                                  <template slot-scope="scope">
                                      <el-date-picker v-model="scope.row.generaTime" format="yyyy-MM-dd HH:mm"
                                      type="datetime" size="mini"
                                      placeholder="选择日期"/>
                                  </template>
                              </el-table-column>
                            </el-table>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br/>
        <div class="dialog-footer">
          <el-button class="editorBTN btnSpace bouncedHold"  size="small" @click="saveForm('formAddRulesForm')">确认</el-button>
          <el-button class="editorBTN cancelBTN" size="small" @click="addWin = false">取消</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
    import {queryChargeList,queryChargeDevice,addWorkSheet,getStationsByregId} from '@/api/operation/orderManage'
    import {getOrgById} from '@/api/operation/statisticAnalysis'
    import {getDict,DICTDATA,translatorDict} from "@/api/dict";
    export default {
        data() {
            return {
                addWin: false,
                regionId: '',
                orderTypes: this.$parent.$refs.fillBar.orderTypes,
                regTreeData: [],
                formAdd: {},
                formAddDevice: {},
                defaultProps: {
                    children: "children",
                    value: "id",
                    label: "name"
                },
                pageData: {
                  total: 0,
                  current: 1,
                  pageSize: 10
                },
                multipleSelection:[],
                tableData_devunsel: [],
                tableData_devsel: [],
                multipleSelectionDevSel: [],
                chargeList: [],
                orderTypes: [],
                orderLevel: [],
                deviceType: [],
                deviceStatus: [],
                rules: {
                  regId: [
                    { required: true, message: '请选择', trigger: 'change' },
                  ],
                  staIdList: [
                    { required: true, message: '请选择', trigger: 'change' },
                  ],
                },
                formAddRules: {
                  type: [
                    { required: true, message: '请选择', trigger: 'change' },
                  ],
                  level: [
                    { required: true, message: '请选择', trigger: 'change' },
                  ],
                  planFinishTime: [
                    { required: true, message: '请选择', trigger: 'change' },
                  ],
                  linkMan: [
                    { required: true, message: '请填写', trigger: 'blur'} ,
                    { min: 2, max: 5, message: '长度在 2 到 10 个字符' },
                    { validator:function(rule,value,callback){
                          //校验中文的正则：/^[\u4e00-\u9fa5]{0,}$/
                          if(/^[\u4e00-\u9fa5]{0,}$/.test(value) == false){
                              callback(new Error("请输入中文"));
                          }else{
                              //校验通过
                              callback();
                          }
                        }, trigger: 'blur'
                    },
                  ],
                  tel: [
                    { required: true, message: '请填写', trigger: 'blur' },
                    { validator:function(rule,value,callback){
                          if(/^1[34578]\d{9}$/.test(value) == false){
                                callback(new Error("请输入正确的手机号"));
                          }else{
                                callback();
                          }
                        }, trigger: 'blur'
                    },
                  ],
                }
            }
        },
        mounted () {
            this.getDictCode()
        },
        methods: {
            //  获取字典
            getDictCode() {
                getDict(DICTDATA.ORDER_TYPE).then(res => {
                    this.orderTypes = res;
                })
                getDict(DICTDATA.ORDER_LEVEL).then(res => {
                    this.orderLevel = res;
                })
                getDict(DICTDATA.DEVICE_TYPE).then(res => {
                    this.deviceType = res;
                })
                getDict(DICTDATA.DEVICE_STATUS).then(res => {
                    this.deviceStatus = res;
                })
            },
            //
            sheetStatusFormat: function(row, column, cellValue, index) {
              if (cellValue !== "") {
                    return translatorDict(DICTDATA.DEVICE_STATUS, cellValue);
                } else {
                    return "";
                }
            },
            //
            deviceTypeFormat(row, column, cellValue, index) {
              if (cellValue !== "") {
                    return translatorDict(DICTDATA.DEVICE_TYPE, cellValue);
                } else {
                    return "";
                }
            },
            //  城市数据
            setData() {
                this.regTreeData = this.$parent.regTreeData;
            },
            //  选中城市
            handleChange(value) {
                this.formAddDevice.regId = value[value.length - 1]; //取地区里最后一个值发给后端
                this.queryChargeList(value[value.length - 1])
            },
            //  选中table
            handleSelectionChange(val) {
              this.multipleSelection = val;
            },
            //
            addSourceMap() {
              if (this.multipleSelection.length === 0) {
                  this.$message({
                    message: "请选择设备！",
                    type: "warning"
                  });
                } else {
                  // 判断是否重复添加
                  for (var i in this.multipleSelection) {
                    for (var j in this.tableData_devsel) {
                      if (this.multipleSelection[i].id === this.tableData_devsel[j].id) {
                        this.$message({
                          message: "不能重复选择设备！",
                          type: "warning"
                        });
                        return;
                      }
                    }
                  }
                  this.multipleSelection.forEach(element => {
                    this.tableData_devsel.push({
                      descr: '',
                      devId: element.id,
                      devName: element.devName,
                      devType: element.devType,
                      generaTime: '',
                      state: element.state,
                      stationName: element.stationName
                    })
                  });
                }
            },
            removeDevSel(){
              if (this.multipleSelectionDevSel.length > 0) {
                for (var i in this.multipleSelectionDevSel) {
                  for (var j in this.tableData_devsel) {
                    if (
                      this.multipleSelectionDevSel[i].id === this.tableData_devsel[j].id
                    ) {
                      this.tableData_devsel.splice(j, 1);
                      break;
                    }
                  }
                }
              }
            },
            //  第二个table选中
            handleSelectionChangeDevSel(val) {
              this.multipleSelectionDevSel = val;
            },
            //  获取充电站列表
            queryChargeList(param) {
              getStationsByregId(param).then(res=>{
                if(res.code == '000000'){
                  this.chargeList = res.data
                }
              })
            },
            //  查询
            querySource(formName,args) {
              let params = {
                regId: args.regId || '',
                staId: args.staId || '',
                devType: args.devType || '',
                state: args.state || '',
                current: args.current
              }
              this.$refs[formName].validate((valid) => {
                if (valid) {
                  queryChargeDevice(params).then(res=>{
                    if(res.code == '000000') {
                      this.tableData_devunsel = res.data.records
                      this.pageData = {
                        total: res.data.total,
                        current: res.data.current,
                        pageSize: res.data.size
                      };
                    }
                  })
                } else {
                  return false;
                }
              });
            },
            //  清空
            clearMap() {
              this.formAddDevice = {}
              this.chargeList = []
            },
            saveForm(formName) {
              let param = {
                sheetType: this.formAdd.type,
                sheetLevel:this.formAdd.level ,
                planFinishTime: this.formAdd.planFinishTime,
                linkMan: this.formAdd.linkMan,
                tel: this.formAdd.tel,
                regId: this.formAddDevice.regId,
                staId: this.formAddDevice.staIdList.id,
                addr: this.formAddDevice.staIdList.addr,
                staName: this.formAddDevice.staIdList.staName,
                workSheetDevForms: this.tableData_devsel
              }

              if(!param.regId) {
                this.$message({  message: "请选择行政区域",  type: "warning"}); return
              }
              if(!param.staId) {
                this.$message({  message: "请选择充电桩",  type: "warning"});return
              }
              this.$refs[formName].validate((valid) => {
                if (valid) {
                  addWorkSheet(param).then(res=>{
                    if(res.code === '000000') {
                      this.addWin = false
                      this.$message({
                        message: "新增工单成功",
                        type: "success"
                      });
                      this.$refs[formName].resetFields();
                      this.formAddDevice = {}
                      this.tableData_devsel = []
                      this.tableData_devunsel = []
                      this.$parent.$refs.formTable.queryPage({});
                    }
                  })
                } else {
                  return false;
                }
              });

            },
            handleSizeChange(val) {
              let params = {
                regId: this.formAddDevice.regId || '',
                staId: this.formAddDevice.staId || '',
                devType: this.formAddDevice.devType || '',
                state: this.formAddDevice.state || '',
                current: 1,
                size: val
              }
              this.querySource('ruleForm',params);
            },
            handleCurrentChange(val) {
              let params = {
                regId: this.formAddDevice.regId || '',
                staId: this.formAddDevice.staId || '',
                devType: this.formAddDevice.devType || '',
                state: this.formAddDevice.state || '',
                current: val,
              }
              this.querySource('ruleForm', params);
            },
        }
    };
</script>

<style lang="scss" scoped>
    .form-item-content {
        background-color: #fcfcfc;
        border: 1px solid #eee;
        padding: 15px 15px 0;
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

    .item-sel .left[data-v-9dd3591a] {
        width: 510px;
        float: left;
        border: 1px solid #EAEAEA;
        border-radius: 4px;
    }

    .item-sel .right[data-v-9dd3591a] {
        width: 520px;
        float: left;
        border: 1px solid #EAEAEA;
        border-radius: 4px;
    }

    .move {
        width: 45px;
        height: 45px;
        background: #24B3CA url(../../../../assets/image/arrow-right.png) no-repeat center center;
        background-size: 26px;
        border: 0;
        border-radius: 50%;
        padding: 0;
        cursor: pointer;
        outline: none;
        margin-top: 150%;
    }
    .daixuan {
      font-weight: 600;
    }
    .item-sel {
        overflow: hidden;
        .left {
            width: 490px;
            float: left;
            border: 1px solid #EAEAEA;
            border-radius: 4px;
            .title {
                background-color: #f1f1f1;
                color: #00607F;
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
        .middle {
            width: 75px;
            height: 300px;
            float: left;
            text-align: center;
            padding-top: 60px;
        }
        .right {
            width: 508px;
            float: left;
            border: 1px solid #EAEAEA;
            border-radius: 4px;
            .title {
                background-color: #f1f1f1;
                color: #00607F;
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

    .kz {
        width: 200px;
        margin-right: 120px;
    }

    .s {
        padding: 15px 40px;
        .push {
            color: white;
            background: #006080;
            width: 120px;
        }
    }
</style>
