<template>
  <div style="padding:0 0px;" class="table_wrap">
    <div class="table-top-button">
    	<el-button @click="addIns" class="newButtonColor btnSpace listBTN">新增下级机构</el-button>
    	<el-button @click="addPro" class="newColor btnSpace listBTN">新增部门</el-button>
      <el-button class="BatchDeleteColor btnSpace listBTN" @click="remove">批量删除</el-button>
      <!--<el-button @click="handleDownload" :loading="downloadLoading" class="listBTN otherBTN">批量导出</el-button>-->
    </div>
    <pagetable
      ref="pagetable"
      :data="jgtab"
      :current-page="currentPage"
      :pageSize="pageSize"
      :total="total"
      @selection-change="handleSelectionChange"
      @refresh-data="handleRefresh"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange">
        <el-table-column show-overflow-tooltip type="index" width="50"></el-table-column>

        <el-table-column show-overflow-tooltip type="selection" width="50" align="center"></el-table-column>

        <el-table-column show-overflow-tooltip label="名称" prop="name"  width="120"></el-table-column>

        <el-table-column show-overflow-tooltip label="类型" prop="type" :formatter="typeFormat" width="80"></el-table-column>

        <el-table-column show-overflow-tooltip label="业务类型" prop="serviceType" :formatter="serviceTypeFormat" width="120"></el-table-column>

        <el-table-column show-overflow-tooltip label="联系电话" prop="linkPhone" width="130"></el-table-column>

        <el-table-column show-overflow-tooltip label="联系人" prop="linkName" width="110"></el-table-column>

        <el-table-column show-overflow-tooltip label="所属区域" prop="regionId" :formatter="regFormat"></el-table-column>

        <el-table-column label="操作" width="260" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" class="common-btn buleBTN" @click="detailrev(scope.$index, scope.row) ">详情</el-button>
            <el-button size="mini" class="common-btn buleBTN" @click="xgopen(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" class="delete-btn redBTN" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button style="width: 72px;" v-if="scope.row.serviceType == 1 || (scope.row.serviceType > 5 && scope.row.serviceType < 10)" size="mini" class="common-btn buleBTN" @click="handlePower(scope.$index, scope.row)">
            	数据权限
            </el-button>
          </template>
        </el-table-column>
    </pagetable>

    <div>
      <!-- 组织机构详情 -->
      <el-dialog class="dia_power" title="组织机构详情" :visible.sync="detailShow" width="980px" :close-on-click-modal="false":modal-append-to-body='false'>
          <div style="box-sizing: border-box;padding: 0px 28px;position: relative;top: -18px;">
          <p class="p_title"><b>丨</b>基本信息</p>
          <div style="display: flex;">
          	<el-image
              style="width: 190px; height: 200px;margin-right: 10px;"
              :src="xqform.picUrl"
              fit="fill">
            </el-image>
        <el-form :inline="true" :model="xqform" label-width="100px" size="mini" style="flex:1;">
          <el-row type="flex" justify="start" align="middle" class="rowbg2">
            <el-col :span="12">
              <span class="a_label">组织机构名称：</span>
              <span class="b_label">{{xqform.name}}</span>
              
            </el-col>
            <el-col :span="12">
              <span class="a_label">组织机构简称：</span> 
              <span class="b_label">{{xqform.simpleName}}</span>
              
            </el-col>
          </el-row>

          <el-row type="flex" justify="start" align="middle" class="rowbg">
            <el-col :span="12">
              <span class="a_label">业务分类：</span>{{xqform.serviceTypeName}}
            </el-col>
            <el-col :span="12">
              <span class="a_label">上级组织机构：</span>
              <span class="b_label">{{xqform.parentName}}</span>
            </el-col>
          </el-row>

          <el-row type="flex" justify="start" align="middle" class="rowbg2">
            <el-col :span="12">
              <span class="a_label">联系人：</span>{{xqform.linkName}}
            </el-col>
            <el-col :span="12">
              <span class="a_label">联系电话：</span>{{xqform.linkPhone}}
            </el-col>
          </el-row>


          <el-row type="flex" justify="start" align="middle" class="rowbg">
            <el-col :span="12">
              <span class="a_label">所属区域：</span>
              <span class="b_label">{{xqform.regionId}}</span>
            </el-col>
            <el-col :span="12">
              <span class="a_label">详细地址：</span>
              <span class="b_label">{{xqform.addresDesc}}</span>
            </el-col>
          </el-row>

          <el-row type="flex" justify="start" align="middle" class="rowbg2">
            <el-col :span="12">
             <span class="a_label">经度：</span>{{xqform.longitude}}
            </el-col>
            <el-col :span="12">
              <span class="a_label">纬度：</span>{{xqform.latitude}}
            </el-col>
          </el-row>
        </el-form>
         </div>
	<div v-if="tableData2.length>0">
         <p class="p_title"><b>丨</b>数据权限</p>
          <div>

         	<div class="ins_site">

         		<section style="padding: 0;">
         			<el-table
			    :data="tableData2"
			    ref="multipleTable"
			    stripe
			    height="300"
			    style="width: 100%;">

			    <el-table-column
			      label="序号"
			      type="index"
			      width="55">
			    </el-table-column>


			    <el-table-column
			      prop="staName"
			      label="站点名称">
			    </el-table-column>

			    <el-table-column
			      prop="orgName"
			      label="所属组织机构">
			    </el-table-column>

			    <el-table-column
			      prop="typeName"
			      label="站点类型">
			    </el-table-column>

			    <el-table-column
			      prop="engTypeName"
			      label="能源类型">
			    </el-table-column>

			    <el-table-column
			    	width="60"
			      label="状态">
			      <template slot-scope="scope">{{ scope.row.staType}}</template>
			    </el-table-column>

			    <el-table-column
			      prop="name"
			      label="配变容量">
			    </el-table-column>

			    <el-table-column
			      prop="regName"
			      label="所属区域">
			    </el-table-column>

			  </el-table>
         		</section>
         	</div>


          </div>
</div>
          </div>
      </el-dialog>

      <div>
        <!-- 修改组织 -->
        <el-dialog class="upde_" :title="up_info" :visible.sync="amend" width="910px" 
        	@open="submitButtonDisabled2 = false"
        	:close-on-click-modal="false":modal-append-to-body='false'>
          <el-form
            ref="Form"
            :model="Form"
            :rules="rules"
            label-width="100px"
            size="mini"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="组织名称" prop="name">
                  <el-input v-model="Form.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="组织简称">
                  <el-input v-model="Form.simpleName"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="业务分类" prop="serviceType" @change="fnType">
                  <el-select v-model="Form.serviceType">
                    <el-option
                      v-for="item in serviceTypes"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              
              <el-col :span="12" v-if="proSign">
            <el-form-item label="设备厂家" prop="">
              <el-select v-model="Form.factId" style="width: 100%;">
                <el-option
                  v-for="item in proList"
                  :key="item.id"
                  :label="item.factName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
              
              <el-col :span="12">
              	<!--//上级组织机构-->
                <el-form-item label="上级组织">
                  <el-select-tree
                  	disabled
                  	style="width: 100%;"
		            size="mini"
		            v-if="true"
		            :popover-min-width="200"
		            :default-expand-all="false"
		            :data="orgTreeData"
		            :props="orgDefaultProps"
		            :clearable="true"
		            v-model="Form.parentId"
		            :checkStrictly="true"
		            :accordion='true'
		            @getValue="getValue($event)"
		          />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="组织类型" prop="serviceType">
                  <el-select v-model="Form.type">
                    <el-option
                      v-for="item in serviceTypes_"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              
              <el-col :span="12">
                <el-form-item label="联系电话" prop="linkPhone">
                  <el-input v-model="Form.linkPhone" type="tel" maxlength="11"></el-input>
                </el-form-item>
              </el-col>
              

            	<el-col :span="12">
                <el-form-item label="联系人">
                  <el-input v-model="Form.linkName"></el-input>
                </el-form-item>
              </el-col>
            	<el-col :span="12">
                <el-form-item label="所属区域">
                  <el-cascader
                    v-model="regionId"
                    size="mini"
                    :options="regTree"
                    :props="defaultProps"
                    clearable
                    @change="handleChange"
                  ></el-cascader>
                </el-form-item>
              </el-col>

            	<el-col :span="12">
                <el-form-item label="详细地址">
                  <el-input v-model="Form.addresDesc">
                    <el-button slot="append" @click="showmapsel" icon="el-icon-map-location" style="width:50px;"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            	<el-col :span="12">
                <el-form-item label="经度">
                  <el-input v-model="Form.longitude"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
            <el-col :span="12">
                <el-form-item label="纬度">
                  <el-input v-model="Form.latitude"></el-input>
                </el-form-item>
              </el-col>
			</el-row>
            <el-form-item label="照片">
              <singleimageupload @on-success="handleImageSuccess"/>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button class="bouncedHold" :disabled='submitButtonDisabled2' @click="addBiaoge('Form')">确定</el-button>
            <el-button  @click="amend = false">取消</el-button>
          </span>
        </el-dialog>

        <mapseldialog @map-confirm="handleMapConfirm" ref="mapseldialog"/>
      </div>
      <!--配置-->
      <el-dialog
      	class="power_info_wrap_dia"
      	@open="submitButtonDisabled = false"
      	title="配置数据权限" :visible.sync="isPower" width="1160px" :close-on-click-modal="false":modal-append-to-body='false'>
      	<div style="box-sizing: border-box;padding: 0px 28px;position: relative;top: -22px;">
      	<p class="p_title"><b>丨</b>基本信息</p>
		 <div class="power_content" :class="!isShrink?'sh_height':''">
          <img class="shrink_imgs" @click="shrink" v-show="isShrink" src="../../../../assets/image/dou_tp.png"/>
          <img class="shrink_imgs" @click="shrink" v-show="!isShrink" src="../../../../assets/image/dou_bm.png"/>

          <el-row justify="start" align="middle">
            <el-col :span="8">
              <p>组织机构名称：</p>
              <p class="b_label">{{xqform.name}}</p>
            </el-col>
            <el-col :span="8">
            	<p>组织机构简称：</p>
              <p class="b_label">{{xqform.simpleName}}</p>
            </el-col>
            <el-col :span="8">
              <p>业务分类：</p>
              <p class="b_label">{{xqform.serviceTypeName}}</p>
            </el-col>
          </el-row>

          <el-row type="" justify="start" align="middle">
            <el-col :span="8">
               <p>上级组织机构：</p>
              <p class="b_label">{{xqform.parentName}}</p>
            </el-col>
            <el-col :span="8">
              <p>联系人：</p>
              <p class="b_label">{{xqform.linkName}}</p>
            </el-col>
            <el-col :span="8">
            	<p>联系电话：</p>
             <p class="b_label"> {{xqform.linkPhone}}</p>
            </el-col>
          </el-row>

          <el-row type="" justify="start" align="middle">
            <el-col :span="8">
            	<p>所属区域：</p>
              <p class="b_label">{{xqform.regionId}}</p>
            </el-col>
            <el-col :span="16">
              <p>详细地址：</p>
              <p class="b_label">{{xqform.addresDesc}}</p>
            </el-col>
          </el-row>
          <el-row type="" justify="start" align="middle">
            <el-col :span="8">
            	<p>经度：</p>
              <p>{{xqform.longitude}}</p>
            </el-col>
            <el-col :span="8">
              <p>纬度：</p>
              <p>{{xqform.latitude}}</p>
            </el-col>
          </el-row>
          <el-row type="" justify="start" align="middle">
          	<el-col :span="8">
            	<p>图片：</p>
              <p>
              	<el-image
	              style="width: 100px; height: 100px"
	              :src="xqform.picUrl"
	              fit="fill">
	            </el-image>
              </p>
            </el-col>
          </el-row>
		 </div>
		 <!--上面是基本信息-->
		 <p class="p_title"><b>丨</b>数据权限</p>
		 <div class="power_content_per">
		    	<power-site v-if="isPower" ref="site" :details="inDeatils"/>
		 </div>
		 </div>
		 <span slot="footer" style="position: relative;top: -16px;">
            <el-button class="bouncedHold" @click="powerAff">确定</el-button>
            <el-button  @click="isPower = false">取消</el-button>
          </span>
		
		
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import { cx, menuDelete, xiuGai,piliangDelete,treeAll,updatePower,getPower,treecx} from "@/api/power/institution";
  import pagetable from "@/components/pagetable"
  import {find,isNil,merge,omitBy,isNull} from 'lodash';
  import mapseldialog from '@/components/mapseldialog'
//import PowerArea from './power/Area'
  import PowerSite from './power/Site'
  import { produceList } from '@/api/menu';
  import singleimageupload from '@/components/upload/singleimageupload'
import {getRegNameByCode} from '@/utils/area'
  import Cascader from '@/components/cascader'
  import { mapState,mapMutations } from "vuex";
  export default {
  data() {
  	var isMobileNumber= (rule, value, callback) => {
        if (!value) {
          callback()
        } else {
          const reg = /^1[1|2|3|4|5|7|8|9][0-9]\d{8}$/;
          const regs = /^(0\\d{2}-\\d{8}(-\\d{1,4})?)|(0\\d{3}-\\d{7,8}(-\\d{1,4})?)$/;
          if (reg.test(value)||regs.test(value)) {
            callback()
          } else {
            return callback(new Error('请输入正确的手机号或座机号'))
          }
        }
      };
    return {
    	removeButDisabled:true,
    	submitButtonDisabled:false,
    	submitButtonDisabled2:false,
    	ids:"",
    	up_info:'',
    	proSign:false,
      regionId:[],
      sscont:{},//获取搜索值
      jgtab: [],
      isShrink:false,
      detailShow: false,
      table:[],
      proList:[],
      serviceTypes_:[
      {name:"单位",value:1},
      {name:"部门",value:2},
      ],
      xqform: {},
      tableData2:[],
      activeName:'1',
      Form: {},
      shHeight:"",
      amend: false,//修改框
      SelectionArray:[],//批量删除
      rules: {
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        parentId: [{ required: true, message: "不能为空", trigger: "blur" }],
        serviceType: [{ required: true, message: "不能为空", trigger: "blur" }],
        linkPhone: [
        { required: false, message: "不能为空", trigger: "blur" },
        { validator: isMobileNumber, trigger: "blur" }
        ],
      },
      pageSize: 20,
      currentPage: 1,
      total: 0,
      isPower:false,
	  items:[1111,2222,3333,4444],
      serviceTypes: [],
      parentTypes:[],
      orgTypes:[],
      butEnabled: true,
      detail:null,
      defaultProps: {
        checkStrictly: true,
        children: "children",
        value: "id",
        label: "name"
      },
      downloadLoading: false,
      inDeatils:[],
      orgDefaultProps: {
        label: "name",
        children: "children",
        value: "id",
        checkStrictly: true,
        expandTrigger: "hover"
      },
      orgTreeData:JSON.parse(localStorage.getItem('insData'))
    };
  },
  components: {pagetable,mapseldialog, singleimageupload,Cascader,PowerSite},
  created() {
  	this.serviceTypes = this.$parent.$parent.$parent.serviceTypes;
      this.orgTypes = this.$parent.$parent.$parent.orgTypes;
  	produceList().then(res=>{
  		this.proList = res.data;
  	})
  	treecx().then(res=>{
  		this.jgtab = res.data
  		this.total = res.data.length;
  	})
  },
  computed:{
  	  ...mapState(['regTree']),
    },
  mounted() {

  },
  watch: {
    SelectionArray(value) {
      if(value.length==0){
        this.butEnabled = true;
      }else{
        this.butEnabled = false;
      }
    }
  },
  methods: {
  	fnType(data){
		if (data == '3') {
			this.proSign = true;
		}else{
			this.proSign = false;
			if (this.Form.serviceType == '3') {
				this.Form.factId="";
			}
		}
	},
  	addIns(){
  		if(this.$parent.$parent.$parent.$refs.tree.selOrg && this.$parent.$parent.$parent.$refs.tree.selOrg != null){
  			this.$parent.$parent.$parent.$refs.tree.proSign = false;
	  		this.$parent.$parent.$parent.$refs.tree.xzjgform = {};
	  		this.$parent.$parent.$parent.$refs.tree.xzjgform.parentId = this.$parent.$parent.$parent.$refs.tree.selOrg.id;
	  		this.$parent.$parent.$parent.$refs.tree.sign = 0;
	  		this.$parent.$parent.$parent.$refs.tree.addjg = true;
  		}
  		else{
  			this.$message.warning('请选择组织父级');
  		}
  		
  	},
  	addPro(){
  		if(this.$parent.$parent.$parent.$refs.tree.selOrg && this.$parent.$parent.$parent.$refs.tree.selOrg != null){
  			this.$parent.$parent.$parent.$refs.tree.proSign = false;
	  		this.$parent.$parent.$parent.$refs.tree.xzbmform = {};
	  		this.$parent.$parent.$parent.$refs.tree.xzjgform.parentId = this.$parent.$parent.$parent.$refs.tree.selOrg.id;
	  		this.$parent.$parent.$parent.$refs.tree.sign = 0;
	  		this.$parent.$parent.$parent.$refs.tree.xzbm = true;
  		}
  		else{
  			this.$message.warning('请选择部门父级');
  		}
  		
  	},
  	test(){

  	},
  	handleClick(){

  	},
  	shrink(){
  		this.isShrink = !this.isShrink;
  	},
  	getValue(value) {
      this.formInline.orgId = value;
    },
  	 // 详情 //handlePower
    detailrev(index, row) {
    	this.detailShow = true;
	      this.xqform = row;
	      this.xqform.serviceTypeName = this.serviceTypeFormat(null,null,row.serviceType)
	      if(row.serviceType == 1 || (row.serviceType > 5 && row.serviceType < 10)){
	      	updatePower({
		      	orgId:row.id,
		      	flag:0,
		      	size:999,
		      }).then(res=>{
		      	if(res.code == "000000" && res.data!="暂无数据!"){
		      		this.tableData2 = res.data.records
		      	}else{
		      		this.tableData2 = []
		      		this.$message.error(res.data);
		      	}
		      })
	      }else{
	      	this.tableData2 = []
	      }
    },
  	powerAff(){
  		this.submitButtonDisabled = true;
			const PAMAMS = {
				flag:1,
				orgId:this.xqform.id,
				stringList:this.$refs.site.watchTag,
			}
			this.isPower = false;
			updatePower(PAMAMS).then(res=>{
				if("000000"==res.code){
		          this.$message({
			          message: '操作成功',
			          type: 'success'
			        })
		          this.submitButtonDisabled = true;
		        }else{
		        	this.submitButtonDisabled = false;
		          this.$message.error(res.data);
		        }
			})
  	},
  	//数据权限
  	handlePower(index,data){
			this.isPower = true
			this.xqform = data; 
			this.xqform.serviceTypeName = this.serviceTypeFormat(null,null,data.serviceType);
	  		updatePower({orgId:data.id,flag:0,size:9999}).then(res=>{
	  			if(res.code == "000000"){
	  				this.$refs.site.serviceType = data.serviceType;
						this.$refs.site.tableData2 = res.data.records;
						this.$refs.site.newTableData2 = res.data.records;
						this.$refs.site.onSubmit();
	  			}else{
	  				this.$message.error(res.data);
	  			}
	  		})
  	},
    setData(){
      this.serviceTypes = this.$parent.$parent.$parent.serviceTypes;
      this.orgTypes = this.$parent.$parent.$parent.orgTypes;
    },
    cx(params) {
      var data = {};
      data.current = this.currentPage;
      data.size = this.pageSize;
      if(!isNil(params)){
        merge(data, params);
      }else{
      	data.parentId = this.ids;
      }
      data = omitBy(data, item => item === '' || isNull(item));
      cx(data).then(res => {
        this.jgtab = res.data.records;
        this.pageSize = res.data.size
        this.currentPage = res.data.current
        this.total = res.data.total
      });
    },
    typeFormat(row, column, cellValue, index){
      var dict = find(this.orgTypes,{"value":cellValue});
      return isNil(dict) ? "":dict.name;
    },
    serviceTypeFormat(row, column, cellValue, index){
      var dict = find(this.serviceTypes,{"value":cellValue});
      return isNil(dict) ? "":dict.name;
    },
    regFormat(row, column, cellValue, index){
      if(isNil(cellValue)){
        return "";
      }else{
        return getRegNameByCode(cellValue);
      }
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm('确定要删除吗?', '', {
      	cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        confirmButtonClass: "messagebox-button",
        cancelButtonClass: "messagebox-button"
      }).then(() => {
        this.deleteOrgById(row);
      }).catch(() => {

      });
    },
    deleteOrgById(org){
      menuDelete(org.id).then(res => {
        if("000000"!=res.code){
          this.$message.error(res.mesg);
        }else{
        	this.cx({parentId:org.parentId})
          //刷新树数据
          this.$parent.$parent.$parent.$refs.tree.refreshtree();
//        this.$parent.$parent.$parent.cxtree();
          this.$message.success(res.mesg);
        }
      });
    },
    orgNameTrans(orgId){
      var treeData = this.$parent.$parent.$parent.treeData;
      var dict = find(treeData,{"id":orgId});
      return isNil(dict) ? "":dict.name;
    },
    // 修改
    xgopen(index, row) {
    	if (row.type == '1') {this.up_info = '修改组织机构'}else{this.up_info = '修改部门'}
      this.amend = true;
      this.regionId = JSON.parse(JSON.stringify(row)).regionId;
      this.Form = JSON.parse(JSON.stringify(row));
      if (this.Form.serviceType == '3') {
			this.proSign = true;
	  }else{
	  	this.proSign = false;
	  }
    },
    addBiaoge(formName) {
      // 发送当前列表修改后的数据
      this.$refs[formName].validate((valid) => {
        if (valid) {
        	this.submitButtonDisabled2 = true;
          this.amend = false;
          xiuGai(this.Form).then(res => {
            if("000000"!=res.code){
            	this.submitButtonDisabled2 = false;
              this.$message.error(res.mesg);
            }else{
              this.$message.success(res.mesg);
              this.submitButtonDisabled2 = true;
              this.cx();//表格重新获取
              this.$parent.$parent.$parent.$refs.tree.refreshtree();
            }
          }).catch(err => {
          	this.submitButtonDisabled2 = false;
            this.$message.error('修改失败');
          });
        }
      });
    },
    qux(formName){
      this.$refs[formName].resetFields();
      this.amend = false;
    },
    //批量删除
    remove() {
      let arr = [];
      if(this.SelectionArray.length==0){
        this.$message.info("请先选中删除的组织或部门")
        return
      }
      this.SelectionArray.map(item => {
        arr.push(item.id);
      });
      this.$confirm('确定要删除吗?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: "messagebox-button",
    		cancelButtonClass: "messagebox-button"
        }).then(() => {
            piliangDelete(arr).then(res => {
		        if("000000"!=res.code){
		          this.$message.error(res.mesg);
		        }else{
		          this.cx();
		          this.$parent.$parent.$parent.$refs.tree.refreshtree();
//		          this.$parent.$parent.$parent.cxtree();
		          this.$message.success(res.mesg);
		          this.SelectionArray = [];
		        }
		      });
        });
      
      
      
    },
     //表格选择框事件
    handleSelectionChange(val){
    	if (val.length) {
    		this.removeButDisabled = false
    	}else{
    		this.removeButDisabled = true
    	}
      this.SelectionArray = val;
    },
     // 分页点击事件
    handleSizeChange(val) {
      this.pageSize = val;
      if (this.$parent.$parent.$parent.$refs.tree.selOrg) {
      	this.$parent.$parent.$parent.handleNodeClick(this.$parent.$parent.$parent.$refs.tree.selOrg);
      }else{
      	this.cx(this.$parent.$parent.$parent.$refs.topform.ss);
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.$parent.$parent.$parent.$refs.tree.selOrg) {
      	this.$parent.$parent.$parent.handleNodeClick(this.$parent.$parent.$parent.$refs.tree.selOrg);
      }else{
      	this.cx(this.$parent.$parent.$parent.$refs.topform.ss);
      }
    },
    handleRefresh(){
      if (this.$parent.$parent.$parent.$refs.tree.selOrg) {
      	this.$parent.$parent.$parent.handleNodeClick(this.$parent.$parent.$parent.$refs.tree.selOrg);
      }else{
      	this.cx();
      }
    },
    handleImageSuccess(imageUrl) {
      this.Form.picUrl = imageUrl;
    },
    //省市区三联框点击后触发
    handleChange(value) {
      let arr = value;
      this.Form.regionId = arr[arr.length - 1]; //取地区里最后一个值发给后端
    },
    handleChanges(value) {
      this.Form.regionId = val;
    },
    showmapsel(){
      this.$refs.mapseldialog.open({lng: this.Form.longitude, lat: this.Form.latitude});
    },
    //地图选点确定处理
    handleMapConfirm(addres){
      this.Form.addresDesc = addres.province+addres.city+addres.district+addres.addr
      this.Form.longitude = addres.lng
      this.Form.latitude = addres.lat
    },
    //导出
    handleDownload() {
      if (this.SelectionArray.length) {
        this.downloadLoading = true
        import('@/utils/Export2Excel').then(excel => {
          const tHeader = ['id', '名称', '简称', '所属组织机构', '区域标识', '描述', '类型', '业务类型', '联系人', '联系电话']
          const filterVal = ['id', 'name', 'simpleName', 'parentId', 'regionId', 'description', 'type', 'serviceType', 'linkName', 'linkPhone']
          const list = this.SelectionArray
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "组织机构信息"
          })
        });
        this.$refs.pagetable.clearSelection()
        this.downloadLoading = false
      } else {
        this.$message({
          message: '请先选择需要导出的记录',
          type: 'warning'
        })
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
    
  }
};
</script>
<style lang="scss">
	.table_wrap{
		.table-action-button{
			padding: 4px 8px 3px 8px;
			margin: 5px 1px;
		}
		.red{
			color: #ff4949;
		}
		.el-dialog__footer .el-button{
		margin-right: 40px;
	}
  .el-tabs__item{
  	background: #f7f7f7;
  }
  .upde_ .el-form-item{
  	width: 90%;
  }
  /*.power_content_per .is-active{
  	background: #006172 !important;
  	color: white !important;
  }*/
		
	}
	
</style>
<style lang="scss" scoped>
._info_wrap_dia{
	.b_label{
		white-space: nowrap;
		overflow: hidden; 
		text-overflow:ellipsis;
	}
}
.p_title {
	font-size: 16px;
  	margin:15px 0px 10px -2px;
	 b{color: #1396c2;}
}
.ins_site{
	display: flex;
	aside{
		width: 220px;margin-right: 10px;background: #F3F3F3;
	}
	section{
		flex: 1;
	}
}

.el-tag{margin-right: 5px;}
.dia_power{
	.a_label{
		display: inline-block;width: 120px;text-align: right;
		color: #A9A9A9;
	}
	.b_label{
		white-space: nowrap;
		overflow: hidden; 
		text-overflow:ellipsis;
	}
}
.dia_power .tite_icon{
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-left: 5px;
    margin-right: 8px;
    border-radius: 50%;
    background: #005673;
}

.power_content_per{
	background: #fcfcfc;
	border: 1px solid #EEEEEE;
	box-sizing: border-box;
}
.el-row{

}
.el-col{
	display: flex;
	p{margin: 3px 0;}
	p:nth-child(odd){width: 150px;text-align: right; color: #A9A9A9;}
	p:nth-child(even){flex:1;text-align: left; }
}
  .rowbg{
    padding: 10px;
    height: 40px;
  }
  .rowbg2{
    @extend .rowbg;
    background-color:#f7f7f7;
  }
  .el-select{
  	width: 100%;
  }
  .el-cascader{
  	width: 100%;
  }
  .power_content{
	background: #fcfcfc;
	border: 1px solid #EEEEEE;
	box-sizing: border-box;
	overflow: hidden;
	padding: 10px 16px;
	position: relative;
}
.shrink_imgs{
		position: absolute;
		right: 0;top: 0;
		cursor: pointer;
		z-index: 5;
	}
.sh_height{
	height: 38px;
}
.sh_height2{ 
	height: 80px;
}
//滚动条样式
*::-webkit-scrollbar {
    width: 7px;
    height: 9px;
    background-color: transparent;
} /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
*::-webkit-scrollbar-track {
    background-color: #f0f6ff;
} /*定义滚动条轨道 内阴影+圆角*/
*::-webkit-scrollbar-thumb {
    background-color: #dbdbdb;
    border-radius: 6px;
} /*定义滑块 内阴影+圆角*/
*::-webkit-scrollbar-thumb:hover {
    background-color: #c2c2c2;
    border-radius: 6px;
} /*定义滑块 内阴影+圆角*/
.scrollbarHide::-webkit-scrollbar {
    display: none;
}
.scrollbarShow::-webkit-scrollbar {
    display: block;
}
</style>

