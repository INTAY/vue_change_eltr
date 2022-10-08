<template>
    <div>
        <div class="s">
        	<el-button class="newButtonColor btnSpace listBTN" @click="addDialogFormVisible" style="margin-left: 7px">新增</el-button>
            <el-button class="newButtonColor btnSpace listBTN" @click="problem" style="margin-left: 7px">未处理问题
            	
            </el-button>
            
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
       <el-form ref="form" :model="zoneForm" label-width="110px" size="small" :rules="rules">
        <div style="border: 1px solid #F2F2F2;background: #F8F8F8;padding: 14px 0px;">
               <div style="padding-left: 20px;margin-bottom: 10px;">
               	<span style="font-size: 18px;font-weight: 800;margin-right: 8px;">特巡对象</span>
               	<el-checkbox-group v-model="checkList">
				    <div class="OpsMain" v-for="(item, index) in modelList" :key="index">
                    <el-popover placement="bottom" width="460" trigger="hover">
                        <el-table :data="item.children" stripe>
                            <el-table-column type="index" width="50"> </el-table-column>
                            <el-table-column property="libName" label="子模块名称"></el-table-column>
                        </el-table>
                        <el-button slot="reference" class="btnClass">
                        	<el-checkbox style="color: #3488A0;" @change="handleCheckedCitiesChange(item.id)" :label="index" :key="item.id">{{item.libName}}</el-checkbox>
                        </el-button>
                    </el-popover>
                </div>
               	</el-checkbox-group>
               </div>
                <!-- 站点选择 -->
                <div v-if="checkShow(1)||checkShow(0)">
                <el-row>
                    <el-col :span="5" style="padding-left: 20px;margin-top: 10px;">
                    	第<span style="font-size: 24px;font-weight: 800;color: #1294C4;">1</span>步
                        <span class="title" style="margin-left: 10px;">站点选择</span>
                    </el-col>
                    <el-col :span="3"
                        ><el-button class="staSlect" style="margin-top: 10px" plain @click="selectStationVisible = true"
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
                </div>
                <!-- 桩选择 -->
                <div v-if="checkShow(0)">
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
                        :header-cell-style="{ background: '#f1f1f1', color: '#000' }"
                        @selection-change="staChange2"
                    >
                        <el-table-column type="index" width="50" label="序号" />
		                <el-table-column type="selection" align="center" width="55"></el-table-column>
		                <el-table-column prop="regName" label="区县" width="180"></el-table-column>
		                <el-table-column prop="addr" label="站点地址"></el-table-column>
		                <el-table-column prop="stakeName" label="桩名称"></el-table-column>
		                <el-table-column prop="stakeNo" label="桩编号"></el-table-column>
		                <el-table-column prop="stakeStatus" label="桩状态"></el-table-column>
		                <el-table-column prop="stakeType" label="桩类型"></el-table-column>
                    </el-table>
                </div>
                </div>
            </div>
                <el-row >
                    <el-col :span="5" style="padding-left: 20px;margin: 10px 0px;">
                        <span class="title"><i />基本信息</span>
                    </el-col>
                </el-row>
                <div style="border: 1px solid #F2F2F2;background: #F8F8F8;padding: 14px 40px;">
                	<div>截至时间&nbsp;&nbsp;&nbsp;
		        	<el-date-picker
				      v-model="upForm.deadline"
				      type="datetime"
		              value-format="yyyy-MM-dd HH:mm:ss"
				      placeholder="选择日期">
				    </el-date-picker>
				 	</div>
				 
                	<div style="margin-top: 10px;">巡视原因&nbsp;&nbsp;&nbsp;
		        	<el-input type="textarea" v-model="upForm.inspectReason" class="xzcs2" clearable />
				    </div>
                	<div style="margin-top: 10px;">照片&nbsp;&nbsp;&nbsp;
                		<el-image
		              class="kz"
		              :src="imgs"
		              style="width: 80px; height: 80px;  border-radius:5px 5px 5px;"
		              placeholder="暂无图片"
		            ></el-image>
		            <el-link style="color: #88C7DB;" @click="addimg">点击添加图片</el-link>
                </div>
            </div>    
			</el-form>
            <div slot="footer">
                <el-button size="mini" @click="save" class="bouncedHold editorBTN btnSpace">确定</el-button>
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
                height="300px"
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
                        <el-select size="mini" filterable class="inputWidth" v-model="devForm.type" clearable>
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
                <el-table-column prop="regName" label="区县" width="180"></el-table-column>
                <el-table-column prop="addr" label="站点地址"></el-table-column>
                <el-table-column prop="stakeName" label="桩名称"></el-table-column>
                <el-table-column prop="stakeNo" label="桩编号"></el-table-column>
                <el-table-column prop="stakeStatus" label="桩状态"></el-table-column>
                <el-table-column prop="stakeType" label="桩类型"></el-table-column>
            </el-table>

            <div slot="footer">
                <el-button size="mini" @click="pushDev" class="bouncedHold editorBTN btnSpace">确认</el-button>
                <el-button size="mini" @click="devVisible = false" class="cancelBTN editorBTN">取消</el-button>
            </div>
        </el-dialog>
        
        
        <!--图片-->
        <div>
	      <el-dialog
	        title="图片本地上传"
	        :modal-append-to-body="false"
	        :close-on-click-modal="false"
	        top="30vh"
	        :modal="true"
	        :visible.sync="uploadWin"
	        width="880px"
	        class="dialogClass"
	      >
	        <el-form>
	          <el-form-item label="图片上传" class>
	            <el-upload
	              class="upload-demo"
	              :data="fileData"
	              ref="upload"
	              :action="uploadUrl"
	              :before-upload="beforeUpload"
	              list-type="picture-card"
	              :show-file-list="true"
	              :multiple="false"
	              :file-list="fileList"
	              :on-success="handleImageSuccess"
	              :headers="headers"
	              :auto-upload="true"
	              :limit="1"
	              accept=".png, .jpg, .gif, .svg"
	              :on-progress="uploadVideoProcess"
	            >
	              <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过2MB</div>
	              <i class="el-icon-plus" />
	            </el-upload>
	          </el-form-item>
	        </el-form>
	      </el-dialog>
	    </div>
        
    </div>
</template>
<script>
import { region, queryStationByRegAndName } from '@/api/platform/generalOverview';
import { batchDelete } from '@/api/property/garden';
import { addTasks, queryStationAndStakeNum, getListByInspId, queryList } from '@/api/operation/planTasks';
import { getListByInspType,queryOperationBjStake } from '@/api/operation/flawAfault';
import { queryData } from '@/api/system/picture'; //查询列表和删除选项
import { DICTDATA, getDict } from '@/api/dict';
import request from "@/api/request";
import Vue from "vue";
export default {
    data() {
    	const tonken = Vue.cookie.get("token");
        return {
            stationData: [],//  新增的站点数据
            regionMap: [],//  区县map
            staMap: [],//  站点map
            selectData: [],//  选中的站点数据
            selectStationVisible: false,//  选择站点的弹窗
            devVisible: false,//  选择桩的弹窗
            stationForm: {},
            devForm:{},
            modelList: [], //  子模块的遍历
            staChangeMap: [],
            headers: { Authorization: "Bearer " + tonken },
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
		        fileType: 1,
		        filename: "",
		        type: 1,
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
            selectData2:[], staChangeMap2:[],stationData2:[],alreadySelection2:[],
            checkList:[],
            devTypes:[],
            type: [],
            uploadWin: false,
            checkedCities:'',
            siteBtnDis:false,
        };
    },
        
    created(){
    	getDict(DICTDATA.STAKE_TYPE).then((res) => {
	      this.devTypes = res;
	    });
    	this.uploadUrl = request.uploadUrl();
    },
    mounted() {
//  	this.modelList=[{"id":"1324304580331175938","libId":null,"libName":"桩巡视","inspType":2,"inspId":"1324304580306010114","parentId":"1324304580318593026","sortNo":13,"remark":"","errorCnt":null,"children":[{"id":"1324304580339564546","libId":null,"libName":"使用测电设备检查充电桩是否存在漏电现象","inspType":null,"inspId":"1324304580306010114","parentId":"1324304580331175938","sortNo":null,"remark":null,"errorCnt":null,"children":[]},{"id":"1324304580347953153","libId":null,"libName":"检查充电桩是否有异味、异响、明火及安全隐患","inspType":null,"inspId":"1324304580306010114","parentId":"1324304580331175938","sortNo":null,"remark":null,"errorCnt":null,"children":[]},{"id":"1324304580356341762","libId":null,"libName":"检查急停按钮是否处于按下状态，护板是否完好","inspType":null,"inspId":"1324304580306010114","parentId":"1324304580331175938","sortNo":null,"remark":null,"errorCnt":null,"children":[]},{"id":"1324304580364730370","libId":null,"libName":"检查充电桩屏幕是否黑屏、提示充电桩故障，充电桩指示灯是否正常","inspType":null,"inspId":"1324304580306010114","parentId":"1324304580331175938","sortNo":null,"remark":null,"errorCnt":null,"children":[]}]},{"id":"1324304580377313282","libId":null,"libName":"站巡视","inspType":1,"inspId":"1324304580306010114","parentId":"1324304580318593026","sortNo":null,"remark":null,"errorCnt":null,"children":[{"id":"1324304580385701890","libId":null,"libName":"查看充电站场地地面有无塌陷裂缝等缺陷","inspType":null,"inspId":"1324304580306010114","parentId":"1324304580377313282","sortNo":null,"remark":null,"errorCnt":null,"children":[]},{"id":"1324304580394090497","libId":null,"libName":"查看场站地面是否整洁，有无杂物阻碍正常充电","inspType":null,"inspId":"1324304580306010114","parentId":"1324304580377313282","sortNo":null,"remark":null,"errorCnt":null,"children":[]},{"id":"1324304580402479105","libId":null,"libName":"查看雨雪天气，巡视充电区域是否有积水、结冰现象","inspType":null,"inspId":"1324304580306010114","parentId":"1324304580377313282","sortNo":null,"remark":null,"errorCnt":null,"children":[]}]},{"id":"1324304580415062018","libId":null,"libName":"附属设施","inspType":1,"inspId":"1324304580306010114","parentId":"1324304580318593026","sortNo":null,"remark":null,"errorCnt":null,"children":[{"id":"1324304580423450625","libId":null,"libName":"检查充电车位限位器是否完好","inspType":null,"inspId":"1324304580306010114","parentId":"1324304580415062018","sortNo":null,"remark":null,"errorCnt":null,"children":[]},{"id":"1324304580431839233","libId":null,"libName":"防撞杆是否完好，有无晃动情况","inspType":null,"inspId":"1324304580306010114","parentId":"1324304580415062018","sortNo":null,"remark":null,"errorCnt":null,"children":[]},{"id":"1324304580440227841","libId":null,"libName":"检查防雨棚（罩）是否完好，有无晃动情况","inspType":null,"inspId":"1324304580306010114","parentId":"1324304580415062018","sortNo":null,"remark":null,"errorCnt":null,"children":[]}]},
//  	{"id":"1324304580448616450","libId":null,"libName":"消防","inspType":1,"inspId":"1324304580306010114","parentId":"1324304580318593026","sortNo":null,"remark":null,"errorCnt":null,"children":[{"id":"1324304580461199361","libId":null,"libName":"消防器材是否完好","inspType":null,"inspId":"1324304580306010114","parentId":"1324304580448616450","sortNo":null,"remark":null,"errorCnt":null,"children":[]}]},{"id":"1324304580469587969","libId":null,"libName":"安防","inspType":1,"inspId":"1324304580306010114","parentId":"1324304580318593026","sortNo":null,"remark":null,"errorCnt":null,"children":[{"id":"1324304580477976578","libId":null,"libName":"视频监控柜外观是否完好","inspType":null,"inspId":"1324304580306010114","parentId":"1324304580469587969","sortNo":null,"remark":null,"errorCnt":null,"children":[]}]},{"id":"1324304580486365185","libId":null,"libName":"配电柜","inspType":1,"inspId":"1324304580306010114","parentId":"1324304580318593026","sortNo":null,"remark":null,"errorCnt":null,"children":[{"id":"1324304580498948097","libId":null,"libName":"检查配电柜外观是否完好","inspType":null,"inspId":"1324304580306010114","parentId":"1324304580486365185","sortNo":null,"remark":null,"errorCnt":null,"children":[]},{"id":"1324304580507336706","libId":null,"libName":"检查配电柜内连接构件、线缆是否正常","inspType":null,"inspId":"1324304580306010114","parentId":"1324304580486365185","sortNo":null,"remark":null,"errorCnt":null,"children":[]}]}
//		]
        this.queryData();
        //  查询运维模块列表
        region(sessionStorage.getItem("regId")).then((res) => {
            if (res.code == '000000') {
                this.regionMap = res.data;
            }
        });
    },
    methods: {
    	devCheckBtn(){
    		if (this.stationData&&this.stationData.length) {
    			this.devVisible = true
    			this.devSubmit()
    		}else{
    			this.$message.warning('请先选择站');
    		}
    	},
    	checkShow(data){
    		return this.checkList.some(item=>item == data)
    	},
    	handleCheckedCitiesChange(item){
    		console.log(item)
    		this.modelName = item;
    	},
    	//关闭站框
    	siteClear(){
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
    	uploadVideoProcess(event, file, fileList) {
      //弹出上传加载
	      this.updateLoading = true;
	    },
	    // 图片上传之前
	    beforeUpload(file) {
	      let picStyle = /^image\/(jpeg|png|jpg)$/.test(file.type);
	      const isLt2M = file.size / 1024 / 1024 < 2;
	      if (!picStyle) {
	        this.$message.error("上传头像图片只能是 JPG/PNG/GIF 格式!");
	        return false;
	      }
	      if (!isLt2M) {
	        this.$message.error("上传头像图片大小不能超过 2MB!");
	        return false;
	      }
	      this.fileData.filename = file.name;
	      if (this.fileData.filename.length > 50) {
	        this.$message.error("文件名称太长,请做修改!");
	        return false;
	      }
	      return picStyle && isLt2M;
	    },
	    // 上传成功操作
	    handleImageSuccess(res, file, fileList) {
	      if ("000000" == res.code) {
//	        this.sizeForm.picUrl = res.data[0].picUrl;
	        this.imgs = res.data[0].url;
	        this.uploadWin = false;
	      } else {
	        this.$message.error(res.mesg);
	      }
	      
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
            this.alreadySelection = val;
        },
        //  桩已选列表
        alreadySelectMap2(val) {
            this.alreadySelection2 = val;
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
                size:'9999',
            }
            queryStationAndStakeNum(params).then(res => {
                if (res.code === '000000') {
                    this.selectData = res.data.records
                }
            })
        },
        //  桩查询
        devSubmit() {
            let params = {
                size:'9999',
                stationId:this.stationData[0].stationId,
                stakeNo:this.devForm.stakeNo,
                stakeName:this.devForm.stakeName,
            }
            queryOperationBjStake(params).then(res => {
                if (res.code === '000000') {
                	console.log(res.data.records[0])
                    this.selectData2 = res.data.records
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
                        staName: item.stationName
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
            params = {
            	inspId: this.modelName,
                inspectObjs: inspectObjs_,
                stakeIds: stakeIds_,
                taskType: 2,
                deadline: this.upForm.deadline,
                inspectReason: this.upForm.inspectReason,
            };
            addTasks(params)
                .then((res) => {
                	if(res.code="000000"){
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
               		}else{
               			this.$message.error(`${res.data}`);
               		}
                }).catch((err) => {
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
        	getListByInspType(2).then(res=>{
        		if (res.code="000000") {
        			this.sign = true;
            		this.dialogFormVisible = true;
            		this.modelList =res.data
        		}
        	})
            
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
        
    }
};
</script>
<style lang="scss" scoped>
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
