<template>
    <div>
        <div class="s">
            <el-button class="newButtonColor btnSpace listBTN" @click="addDialogFormVisible" style="margin-left: 7px">新增</el-button>
        </div>
        <!-- 新增 -->
        <el-dialog
            title="新增"
            :visible.sync="dialogFormVisible"
            width="950px"
            top="150px"
            class="yw"
            @close="colseDia"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
        >
       <el-form ref="form" :model="zoneForm" label-width="110px" size="small" :rules="rules">
        <div style="border: 1px solid #F2F2F2;background: #F8F8F8;padding: 14px 0px;">
               <div style="padding-left: 20px;margin-bottom: 10px;">
               	<span style="font-size: 18px;font-weight: 800;margin-right: 12px;float: left;line-height: 36px;">特巡对象</span>
               	<el-checkbox-group v-model="checkList">
				    <div class="OpsMain" v-for="(item, index) in modelList" :key="index">
                    <el-popover placement="top" width="460" trigger="hover">
                        <el-table :data="item.children" stripe>
                            <el-table-column type="index" width="50"> </el-table-column>
                            <el-table-column property="libName" label="子模块名称"></el-table-column>
                        </el-table>
                        <el-button slot="reference" class="btnClass">
                        	<!--<el-checkbox style="color: #3488A0;" @change="handleCheckedCitiesChange(item.id)" :label="index" :key="item.id">{{item.libName}}</el-checkbox>-->
                        	<el-checkbox style="color: #3488A0;padding:0 15px;" @change="handleCheckedCitiesChange(item)" :label="item" :key="item.id">{{item.libName}}</el-checkbox>
                        </el-button>
                    </el-popover>
                </div>
               	</el-checkbox-group>
               </div>
                <!-- 站点选择 -->
                <div v-if="checkShow('2')||checkShow('1')">
                <el-row>
                    <el-col :span="5" style="padding-left: 20px;margin-top: 10px;">
                    	第<span style="font-size: 24px;font-weight: 800;color: #1294C4;">1</span>步
                        <span class="title" style="margin-left: 10px;">站点选择</span>
                    </el-col>
                    <el-col :span="3"
                        ><el-button class="staSlect" style="margin-top: 10px" plain @click="siteCheckBtn"
                            >选择</el-button
                        ></el-col>
                        
                    <el-button class="staDel" style="margin-top: 14px" plain @click="delStationData">删除</el-button>
                    
                </el-row>
                <div style="padding: 0 20px">
                    <el-table
                        :data="stationData"
                        style="width: 100%"
                        :header-cell-style="{ background: '#ededed !important', color: '#000' }"
                        @selection-change="staChange"
                    >
                        <el-table-column type="index" width="50" label="序号" />
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="regName" label="区县"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="stationName" label="站点名称"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="address" label="站点地址"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="totalStakeNum" label="总桩数"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="zlStakeNum" label="直流充电桩数"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="jlStakeNum" label="交流充电桩数"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="groupName" label="所属部门"></el-table-column>
                    </el-table>
                </div>
                </div>
                <!-- 桩选择 -->
                <div v-if="checkShow('2')">
                <el-row>
                    <el-col :span="5" style="padding-left: 20px;margin-top: 10px;">
                    	第<span style="font-size: 24px;font-weight: 800;color: #1294C4;">2</span>步
                        <span class="title" style="margin-left: 10px;">桩选择</span>
                    </el-col>
                    <el-col :span="3"
                        ><el-button class="staSlect" style="margin-top: 10px" plain @click="devCheckBtn"
                            >选择</el-button
                        ></el-col
                    >
                    <el-button class="staDel" style="margin-top: 14px" plain @click="deldevData">删除</el-button>
                </el-row>
                <div style="padding: 0 20px">
                    <el-table
                        :data="stationData2"
                        style="width: 100%"
                        stripe
                        :header-cell-style="{ background: '#ededed !important', color: '#000' }"
                        @selection-change="staChange2"
                    >
                        <el-table-column type="index" width="50" label="序号" />
		                <el-table-column type="selection" align="center" width="55"></el-table-column>
		                <el-table-column show-overflow-tooltip prop="regName" label="区县"></el-table-column>
		                <el-table-column show-overflow-tooltip prop="addr" label="站点地址"></el-table-column>
		                <el-table-column show-overflow-tooltip prop="stakeName" label="桩名称"></el-table-column>
		                <el-table-column show-overflow-tooltip prop="stakeNo" label="桩编号"></el-table-column>
		                <el-table-column show-overflow-tooltip prop="stakeStatus" label="桩状态"></el-table-column>
		                <el-table-column show-overflow-tooltip prop="stakeType" label="桩类型"></el-table-column>
                    </el-table>
                </div>
                </div>
            </div>
                <el-row >
                    <el-col :span="5" style="padding-left: 20px;margin: 10px 0px">
                        <span class="title"><i />基本信息</span>
                    </el-col>
                </el-row>
                <div style="border: 1px solid #F2F2F2;background: #F8F8F8;padding:20px 0px 8px 0px;">
                	
                	<el-form-item label="截至时间" prop="deadline" style="margin-bottom: 20px !important;">
		            <el-date-picker
				      v-model="zoneForm.deadline"
				      type="datetime"
		              value-format="yyyy-MM-dd HH:mm:ss"
				      placeholder="选择日期">
				    </el-date-picker>
		          </el-form-item>
		          
				 <el-form-item label="巡视原因" prop="inspectReason" style="margin-bottom: 20px !important;">
		            <el-input type="textarea" v-model="zoneForm.inspectReason" class="xzcs2" clearable />
		          </el-form-item>
		          
				    
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
			</el-form>
            <div slot="footer">
                <el-button size="mini" @click="save" class="bouncedHold editorBTN btnSpace">派发</el-button>
                <el-button size="mini" @click="quxiao" class="cancelBTN editorBTN">取消</el-button>
            </div>
        </el-dialog>
        
        <!-- 选择站点 -->
        <el-dialog
            title="站点选择"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            top="20vh"
            :modal="true"
            :visible.sync="selectStationVisible"
            width="900px"
            class="dialogClass"
            @close="siteClear"
        >
            <el-form :inline="true" :model="stationForm" label-width="100px" class="demo-form-inline">
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
                            <el-option v-for="item in staMap" :key="item.stationId" :value="item.stationId" :label="item.stationName"> </el-option>
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
                height="300px"
                :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                @selection-change="alreadySelectMap"
            >
                <el-table-column type="index" width="50" label="序号" />
                <el-table-column type="selection" align="center" width="55"></el-table-column>
                <el-table-column show-overflow-tooltip prop="regName" label="区县"></el-table-column>
                <el-table-column show-overflow-tooltip prop="stationName" label="站点名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="address" label="站点地址"></el-table-column>
                <el-table-column show-overflow-tooltip prop="totalStakeNum" label="总桩数"></el-table-column>
                <el-table-column show-overflow-tooltip prop="zlStakeNum" label="直流充电桩数"></el-table-column>
                <el-table-column show-overflow-tooltip prop="jlStakeNum" label="交流充电桩数"></el-table-column>
                <el-table-column show-overflow-tooltip prop="groupName" label="所属部门"></el-table-column>
            </el-table>
            <div class="block" style="text-align: center;">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="obj1.current"
                    :page-sizes="[15, 40, 80, 100]"
                    :page-size="obj1.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="obj1.total"
                ></el-pagination>
            </div>

            <div slot="footer">
                <el-button size="mini" :disabled="siteBtnDis" @click="pushSource" class="bouncedHold editorBTN btnSpace">确认</el-button>
                <el-button size="mini" @click="selectStationVisible = false" class="cancelBTN editorBTN">取消</el-button>
            </div>
        </el-dialog>
        <!-- 选择桩 -->
        <el-dialog
            title="桩选择"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            top="20vh"
            :modal="true"
            :visible.sync="devVisible"
            width="900px"
            class="dialogClass"
            @close="devClear"
        >
            <el-form :inline="true" :model="devForm" label-width="100px" class="demo-form-inline">
                <div class="yi">
                	<el-form-item label="充电桩编号">
                        <el-input v-model="devForm.stakeNo" placeholder="请输入" class="kz" clearable />
                    </el-form-item>
                	<el-form-item label="桩名称">
                        <el-input v-model="devForm.stakeName" placeholder="请输入" class="kz" clearable />
                    </el-form-item>
                    <el-form-item label="桩类型">
                        <el-select size="mini" filterable class="inputWidth" v-model="devForm.engSupType" clearable>
                            <el-option v-for="item,index in devTypes" :key="item.id" :value="item.value" :label="item.name"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" class="newButtonColor SearchBTN" @click="devSubmit()">查询</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <el-table
                :data="selectData2"
                style="width: 100%"
                height="300px"
                :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                @selection-change="alreadySelectMap2"
            >
                <el-table-column type="index" width="50" label="序号" />
                <el-table-column type="selection" align="center" width="55"></el-table-column>
                <el-table-column show-overflow-tooltip prop="regName" label="区县"></el-table-column>
                <el-table-column show-overflow-tooltip prop="addr" label="站点地址"></el-table-column>
                <el-table-column show-overflow-tooltip prop="stakeName" label="桩名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="stakeNo" label="桩编号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="stakeStatus" label="桩状态"></el-table-column>
                <el-table-column show-overflow-tooltip prop="stakeType" label="桩类型"></el-table-column>
            </el-table>
            <div class="block" style="text-align: center;">
                <el-pagination
                    @size-change="handleSizeChange2"
                    @current-change="handleCurrentChange2"
                    :current-page="obj2.current"
                    :page-sizes="[15, 40, 80, 100]"
                    :page-size="obj2.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="obj2.total"
                ></el-pagination>
            </div>

            <div slot="footer">
                <el-button size="mini" @click="pushDev" class="bouncedHold editorBTN btnSpace">确认</el-button>
                <el-button size="mini" @click="devVisible = false" class="cancelBTN editorBTN">取消</el-button>
            </div>
        </el-dialog>
        
    </div>
</template>
<script>
import { region, queryStationByRegAndName } from '@/api/platform/generalOverview';
import { addTasks, queryStationAndStakeNum, getListByInspId, queryList } from '@/api/operation/planTasks';
import { getListByInspType,queryOperationBjStake } from '@/api/operation/flawAfault';
import { DICTDATA, getDict } from '@/api/dict';
import { BASE_API } from '@/api/request';
import Vue from "vue";
export default {
    data() {
    	var isMobileNumber= (rule, value, callback) => {
		    if (!value) {
		      callback()
		    } else {
		    	const start = new Date(); 
		    	const end = new Date(value); 
		      if (start < end) {
		        callback()
		      } else {
		        return callback(new Error('截止时间必须晚于当前时间'))
		      }
		    }
		  };
    	const tonken = Vue.cookie.get("token");
        return {
            stationData: [],//  新增的站点数据
            regionMap: [],//  区县map
            staMap: [],//  站点map
            selectData: [],//  选中的站点数据
            selectStationVisible: false,//  选择站点的弹窗
            devVisible: false,//  选择桩的弹窗
            stationForm: {stationId:""},
            devForm:{},
            modelList: [], //  子模块的遍历
            staChangeMap: [],
            headers: { Authorization: "Bearer " + tonken },
            seen: false, 
            current: 0,
            modelName: null, //  选择的模块id
            modelNameMap: [], //  下拉框的主模块
            alreadySelection: [],  //  站点选择中的以选中
            obj1:{current:1, size:15, total:1,},
            obj2:{current:1, size:15, total:1,},
            pageData: {
                total: 0,
                current: 1,
                size: 0
            },
            imgs:"",
            sign: false,
            checkValue: '',
            upForm: {
                size: '',
                current: '',
                fileType: '',
                name: ''
            },
            fileList: [],
            fileData: {
		        fileType: 5,
		        filename: "",
		        type: 5,
		      },
            currentPage: 1,
            pageSize: 20,
            total: 40,
            dialogFormVisible: false,//  新增的遥控器
            zoneForm: {},
            rules: {
                inspectReason : [{ required: true, message: '请输入巡视原因', trigger: 'blur' }],
                deadline: [
                { required: true, message: '请选择截至时间', trigger: 'change' },
                { validator: isMobileNumber, trigger: "blur" }
                ],
            },
            selectData2:[], staChangeMap2:[],stationData2:[],alreadySelection2:[],
            checkList:[],
            checkLists:[],
            devTypes:[],
            type: [],
            uploadWin: false,
            checkedCities:'',
            siteBtnDis:false,
            BASE_API,
        };
    },
        
    created(){
    	getDict(DICTDATA.ENERGY_SUPPLY_TYPE).then((res) => {
	      this.devTypes = res;
	    });
    },
    mounted() {
        //  查询运维模块列表
        region(sessionStorage.getItem("regId")).then((res) => {
            if (res.code == '000000') {
                this.regionMap = res.data;
            }
        });
    },
    methods: {
    	siteCheckBtn(){
    		this.selectStationVisible = true;
    		this.stationSubmit()
    	},
    	devCheckBtn(){
    		if (this.stationData&&this.stationData.length) {
    			this.devVisible = true
    			this.devSubmit()
    		}else{
    			this.$message.warning('请先选择站');
    		}
    	},
    	checkShow(data){
//  		return this.checkList.some(item=>item == data)
    		return this.checkLists.some((item,index)=>item == data)
    	},
    	handleCheckedCitiesChange(item){
    		this.checkLists = this.checkList.map(item=>item.inspType);
    		this.modelName = this.checkList.map(item=>item.id);
    	},
    	//关闭站框
    	siteClear(){
    		this.obj1={};
    		this.alreadySelection = [];
    		this.selectData = [];
    	},
    	//关闭桩站框
    	devClear(){
    		this.alreadySelection2 = [];
    		this.selectData2 = [];
    	},
    	addimg(){
    		this.uploadWin = true;
    	},
        //  查询运维模块列表
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
//      	if (this.checkShow(0)) {
        	if (this.checkShow('2')) {
        		if (val.length>1) {
        			this.siteBtnDis = true;
        			this.$message.warning('巡视对象为桩只能选择一个站');
        			return false
        		}else{
        			this.siteBtnDis = false;
        		}
//      	}else{
//      		console.log(99999999999999)
//      	}
        	}else{
//      		
        	}
            this.alreadySelection = val;
        },
        //  桩已选列表
        alreadySelectMap2(val) {
            this.alreadySelection2 = val;
        },
        //  通过区县查站点
        queryByCondition(arg) {
            let params = { regId: arg,size:9999 };
            queryStationAndStakeNum(params).then((res) => {
                if (res.code == '000000') {
                    this.staMap = res.data.records;
                    this.stationForm.stationId = ""
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
            	taskType:2,
            	stationId: this.stationForm.stationId,
                regId: this.stationForm.regId,
                size:this.obj1.size,
                current:this.obj1.current,
            }
            queryStationAndStakeNum(params).then(res => {
                if (res.code === '000000') {
                    this.selectData = res.data.records
                    this.obj1.size = res.data.size
                    this.obj1.current = res.data.current
                    this.obj1.total = res.data.total
                }
            })
        },
        handleSizeChange(val) {
            this.obj1.size = val;
            this.stationSubmit();
        },
        handleCurrentChange(val) {
            this.obj1.current = val;
            this.stationSubmit();
        },
        handleSizeChange2(val) {
            this.obj2.size = val;
            this.devSubmit();
        },
        handleCurrentChange2(val) {
            this.obj2.current = val;
            this.devSubmit();
        },
        //  桩查询
        devSubmit() {
            let params = {
                size:'9999',
                size:this.obj2.size,
                current:this.obj2.current,
                stationId:this.stationData[0].stationId,
                stakeNo:this.devForm.stakeNo,
                stakeName:this.devForm.stakeName,
                engSupType:this.devForm.engSupType,
            }
            queryOperationBjStake(params).then(res => {
                if (res.code === '000000') {
                    this.selectData2 = res.data.records;
                    this.obj2.size = res.data.size
                    this.obj2.current = res.data.current
                    this.obj2.total = res.data.total
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
        //  已选桩删除
        deldevData() {
            this.staChangeMap2.forEach((item) => {
                for (let i = 0; i < this.stationData2.length; i++) {
                    if (this.stationData2[i].regId === item.regId) {
                        this.stationData2.splice(i, 1);
                        break;
                    }
                }
            });
        },
        pushSource() {
        	this.stationData = this.alreadySelection
            this.selectStationVisible = false;
//          let arr = [...this.alreadySelection,...this.stationData]
//          this.stationData = this.unique(arr)
        },
        pushDev() {
        	this.stationData2 = this.alreadySelection2
            this.devVisible = false;
//          let arr = [...this.alreadySelection,...this.stationData]
//          this.stationData = this.unique(arr)
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
        staChange2(val) {
            this.staChangeMap2 = val
        },
        // 新增
        save() {
        	if (this.checkShow('2') && this.checkShow('1')) {
        		if (this.stationData2.length == 0 && this.stationData.length == 0) {
        			this.$message({
	                    message: '请选桩',
	                    type: 'warning'
	                });
	                return false;
        		}
        	}
        	else if (this.checkShow('1')) {
        		if (this.stationData.length == 0) {
        			this.$message({
	                    message: '请选站',
	                    type: 'warning'
	                });
	                return false;
        		}
        	}
        	else if (this.checkShow('2')) {
        		if (this.stationData2.length == 0 || this.stationData.length == 0) {
        			this.$message({
	                    message: '请选桩',
	                    type: 'warning'
	                });
	                return false;
        		}
        	}else{
    			this.$message({
                    message: '您未请选择特巡对象',
                    type: 'warning'
                });
                return false;
        	}
        	
			this.$refs.form.validate((valid) => {
	          if (valid) {
	          	let params = {}
	        	let inspectObjs_ = []
	        	let stakeIds_ = []
	        	if (this.stationData.length > 0) {
	        		this.stationData.forEach((item) => {
	                    inspectObjs_.push({
	                        addr: item.address,
	                        regId: item.regId,
	                        staId: item.stationId,
	                        groupId: item.groupId,
	                        staName: item.stationName,
	                        totalStake: item.totalStakeNum,
                            dcStake: item.zlStakeNum,
                            acStake: item.jlStakeNum,
	                    });
	                });
	        	}else{
	        		inspectObjs_ = []
	        	}
	        	
	        	if (this.stationData2.length > 0) {
	        		stakeIds_ = this.stationData2.map(item=>item.stakeNo);
	        	}else{
	        		stakeIds_ = []
	        	}
	        	if (1) {
		            params = {
		            	inspIds:this.modelName,
		                inspectObjs: inspectObjs_,
		                stakeIds: stakeIds_,
		                taskType: 2,
		                deadline: this.zoneForm.deadline,
		                inspectReason: this.zoneForm.inspectReason,
		                docUrls: [],
		            };
		            if (this.fileList) {
	                    for (let i = 0; i < this.fileList.length; i++) {
	                        params.docUrls.push(this.fileList[i].response.data[0].url);
	                    }
	                }
		            addTasks(params)
		                .then((res) => {
		                	if(res.code=="000000"){
			                    this.$message({
			                        message: '添加成功',
			                        type: 'success'
			                    });
			                    this.dialogFormVisible = false;
			                    this.$parent.$parent.$refs.crudForm.getDataInit();
			                    this.zoneForm = {};
			                    this.upForm = {};
			                    this.stationData = []
			                    this.stationData2 = []
								this.checkList = []
								this.checkLists = []
		               		}else{
		               			this.$message.error(`${res.data}`);
		               		}
		                }).catch((err) => {
		                    this.$message.error('添加失败');
		                    this.$parent.$parent.$refs.crudForm.getDataInit();
		                    this.zoneForm = {};
		                    this.upForm = {};
		                    this.stationData = []
		                    this.stationData2 = []
							this.checkList = []
							this.checkLists = []
	                })
	            } else {
	            	
	            	
	            }
	        	
	        	
	          }
	        })

        },
        colseDia(){
        	this.zoneForm = {};
            this.upForm = {};
            this.stationData = []
            this.stationData2 = []
			this.checkList = []
			this.checkLists = []
			this.fileList = []
        },
        // 取消
        quxiao() {
            this.dialogFormVisible = false;
        },
        //新增dialog显示
        addDialogFormVisible() {
        	getListByInspType(2).then(res=>{
        		if (res.code="000000") {
        			this.sign = true;
            		this.dialogFormVisible = true;
            		this.modelList =res.data
        		}
        	})
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
        
        
        
        
    }
};
</script>
<style lang="scss" scoped>
/deep/ .el-upload-list--picture-card .el-upload-list__item,
/deep/ .el-upload--picture-card {
    width: 100px;
    height: 100px;
}
/deep/ .el-upload--picture-card {
    line-height: 105px;
}
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
	font-size: 16px;
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