<template>
  <div class="tree_wrap_" style="height: 100%;">
    <div style="border-bottom:1px solid #C8C8C8;background-color:white;">
      <el-button class="topn" icon="el-icon-search" @click="changfangxing"></el-button>
      <el-dropdown @command="handleDropMenuSel">
        <el-button class="topn"><i class="el-icon-plus el-icon--bottom"></i></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="neworg">新增机构</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button class="topn" icon="el-icon-close" @click="handleOrgDel"></el-button>
      <el-button class="topn" icon="el-icon-refresh" @click="refreshtreeBtn"></el-button>
    </div>
    <el-input
      v-show="changfangxings"
      size="mini"
      suffix-icon="el-icon-search"
      placeholder="输入关键字进行查找"
      style="border-bottom: 2px solid #1EA7BF;margin-bottom: 3px;"
      v-model="filterText" clearable>
    </el-input>
    <div class="tree_explain">
    	说明:
    	<i class="el-icon-office-building" style="color: #0a8db9;"></i>机构
          <i class="el-icon-notebook-2" style="color: #fd7575;margin-left: 8px;"></i>部门
    </div>
    <div style="overflow: auto;height: 100%;padding-bottom: 98px">
    <el-tree
    	:key="treeKey"
      :filter-node-method="filterNode"
      :data="insData"
      :props="defaultProps"
      node-key="id"
      highlight-current
      :default-expanded-keys="num"
      :expand-on-click-node="true"
      accordion
      lazy
      :load="loadNode"
      ref="tree"
      @node-click="handleNodeClick">
      <span slot-scope="{ node, data }" style="display: inline-block;width: 95%; position: relative;"
      		@dblclick = "douNum(data)"
      		>
        <span>
          
          <i v-if="data.type == 1" class="el-icon-office-building iconPadding" style="color: #0a8db9;"></i>
          <i v-else class="el-icon-notebook-2" style="color: #fd7575;margin-right: 4px !important;"></i>
          
          <span>{{node.label}}</span>
          <span v-if="data.isShow" style="position:absolute;right:5px;height:100%;vertical-align:middle;">
            <el-button @click.prevent.stop="() => sortClick(1,node,data)" size="mini" icon="el-icon-bottom" circle type="primary" style="padding:2px;"></el-button>
            <el-button @click.prevent.stop="() => sortClick(2,node,data)" size="mini" icon="el-icon-top" circle type="primary" style="padding:2px;margin-left:0;"></el-button>
          </span>
        </span>
      </span>
    </el-tree>
</div>

    <!-- 新增部门 -->
    <el-dialog title="新增部门" :visible.sync="xzbm" width="910px" :close-on-click-modal="false"
    	@open="submitButtonDisabled_bm = false" @close="closeBm"
    	 :modal-append-to-body='false'>
      <el-form
        ref="xzbmForm"
        :model="xzbmForm"
        :rules="rules"
        label-width="100px"
      >
      <el-row>
          <el-col :span="12">
            <el-form-item label="组织名称" prop="name">
              <el-input v-model="xzbmForm.name"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="业务分类" prop="serviceType">
              <el-select v-model="xzbmForm.serviceType" style="width: 100%;" @change="fnType">
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
              <el-select v-model="xzbmForm.factId" style="width: 100%;">
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
            <el-form-item label="联系电话" prop="linkPhone">
              <el-input v-model="xzbmForm.linkPhone" type="tel" maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          
           <el-col :span="12">
            <el-form-item label="联系人">
              <el-input v-model="xzbmForm.linkName"></el-input>
            </el-form-item>
          </el-col>
          
        	<el-col :span="12">
            <el-form-item label="所属区域">
              <el-cascader
              	 style="width: 100%;"
                v-model="xzbmForm.regionId"
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
              <el-input v-model="xzbmForm.addresDesc">
                <el-button slot="append" @click="showmapsel" icon="el-icon-map-location" style="width:50px;"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
       
        	<el-col :span="12">
            <el-form-item label="经度">
              <el-input v-model="xzbmForm.longitude"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度">
              <el-input v-model="xzbmForm.latitude"></el-input>
            </el-form-item>
          </el-col>
          
        </el-row>

        <el-form-item label="照片">
          <singleimageupload @on-success="handleImageSuccess2" style="width:100px;height:100px;"/>
        </el-form-item>
      
      </el-form>
      

      <span slot="footer">
        <el-button @click="addDept" style="margin-top: 20px;margin-bottom: 15px;" :disabled="submitButtonDisabled_bm" type="primary">确定</el-button>
        <el-button  @click="xzbm = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 新增组织组织 -->
    <el-dialog title="新增组织机构" :visible.sync="addjg" width="930px" :close-on-click-modal="false" 
    	@open="submitButtonDisabled_zz = false"
    	:modal-append-to-body='false'>
      <el-form
        ref="xzjgform"
        :model="xzjgform"
        label-width="100px"
        :rules="rules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织名称" prop="name">
              <el-input v-model="xzjgform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织简称">
              <el-input v-model="xzjgform.simpleName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="业务分类" prop="serviceType">
              <el-select v-model="xzjgform.serviceType" style="width: 100%;" @change="fnType">
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
              <el-select v-model="xzjgform.factId" style="width: 100%;">
                <el-option
                  v-for="item in proList"
                  :key="item.id"
                  :label="item.factName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="parentShow"> 
          	<el-form-item label="上级组织" prop="">
          		<el-select-tree
          			disabled
                  	style="width: 100%;"
		            v-if="true"
		            :popover-min-width="200"
		            :default-expand-all="false"
		            :data="insData"
		            :props="orgDefaultProps"
		            :clearable="true"
		            v-model="xzjgform.parentId"
		            :checkStrictly="true"
		          />
            </el-form-item>
          </el-col>
        
          <el-col :span="12">
            <el-form-item label="联系电话" prop="linkPhone">
              <el-input v-model="xzjgform.linkPhone" type="tel" maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="联系人">
              <el-input v-model="xzjgform.linkName"></el-input>
            </el-form-item>
          </el-col>
       
        	
          <el-col :span="12">
            <el-form-item label="所属区域">
              <el-cascader
              	 style="width: 100%;"
                v-model="xzjgform.regionId"
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
              <el-input v-model="xzjgform.addresDesc">
                <el-button slot="append" @click="showmapsel" icon="el-icon-map-location" style="width:50px;"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        
          <el-col :span="12">
            <el-form-item label="经度">
              <el-input v-model="xzjgform.longitude"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="纬度">
              <el-input v-model="xzjgform.latitude"></el-input>
            </el-form-item>
          </el-col>
          
        </el-row>

        <el-form-item label="照片">
          <singleimageupload @on-success="handleImageSuccess" style="width:100px;height:100px;"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" style="margin-top: 20px;margin-bottom: 15px;" :disabled="submitButtonDisabled_zz" @click="addorg">确定</el-button>
        <el-button @click="addjg=false">取消</el-button>
      </span>
    </el-dialog>

    <mapseldialog @map-confirm="handleMapConfirm" ref="mapseldialog"/>
  </div>
</template>
<script>
  import { add } from "@/api/power/institution";
  import { treecx ,cx} from "@/api/power/institution";
  import _sortBy from 'lodash/sortBy';
  import { findTreeId } from "@/utils/validate";
  import { isNil } from 'lodash';
  import { produceList } from '@/api/menu';
  import mapseldialog from '@/components/mapseldialog'
  import singleimageupload from '@/components/upload/singleimageupload'
import { mapState,mapMutations } from "vuex";
  export default {
    //监听树状图搜索框
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
      	treeKey: '',
        filterText: "",
        parentShow:false,
        serviceTypes: [],
        proList:[],
        parentTypes:JSON.parse(localStorage.getItem('insData')),
        regTreeData: JSON.parse(localStorage.getItem('regTree')),
        value: "", //联级选择器获取的
        changfangxings: false,
        addjg: false,//组织机构添加显示
        xzbm: false,//部门添加显示
        num:[],
        num2:[],
        send: {},
        submitButtonDisabled_zz:false,
        submitButtonDisabled_bm:false,
        xzbmForm: {factId:null},//新增部门表单
        xzjgform: {
          addresDesc: null,
          factId:null,
          longitude: null,
          latitude: null
        },//新增组织单
        data:[],
        orgDefaultProps: {
	        label: "name",
	        children: "children",
	        value: "id",
	        checkStrictly: true,
	        expandTrigger: "hover"
	      },
        defaultProps: {
          checkStrictly: true,
        children: "children",
        value: "id",
        label: "name"
        },
        proSign:false,
        rules: {
          name: [{ required: true, message: "不能为空", trigger: "blur" }],
          parentId: [{ required: true, message: "不能为空", trigger: "blur" }],
          serviceType: [{ required: true, message: "不能为空", trigger: "blur" }],
          linkPhone: [
        { required: false, message: "不能为空", trigger: "blur" },
        { validator: isMobileNumber, trigger: "blur" }
        ],
        },
        selOrg: null, //选择的树
        nodes:null,
        resolves:null,
      };
    },
    components: { mapseldialog, singleimageupload },
    created() {
    	produceList().then(res=>{
    		this.setData()
	  		this.proList = res.data;
	  	})
    },
    watch:{
    	selOrg(a){
    		if (a != null && a) {
    			this.parentShow = true;
    		}else{
    			this.parentShow = false;
    		}
    	},
    	filterText(val) {
        	this.$refs.tree.filter(val);
        }
    },
    computed:{
  	  ...mapState(['insData','regTree']),
    },
    methods: {
    	loadNode(node=null, resolve=null,param = null){
    		treecx().then(res=>{
		  		if (node.level === 0){
	    			resolve(res.data)
	    			this.resolves = resolve;
	       		}else{
	       			cx({current: 1,size: 9999,parentId:node.data.id}).then(res=>{
	       				this.resolves = resolve;
	       				resolve(res.data.records)
	       			})
	       		}
		  	})
      },
    	fnType(data){
    		if (data == '3') {
    			this.proSign = true;
    		}else{
    			this.proSign = false;
    			if (this.xzbmForm.serviceType == '3') {
    				this.xzbmForm.factId="";
    			} if (this.xzjgform.serviceType == '3') {
    				this.xzjgform.factId="";
    			}
    		}
    	},
    	mouseenter(data) {
          this.$set(data, 'isShow', true)
      },
      // 鼠标移出
      mouseleave(data) {
        this.$set(data, 'isShow', false)
      },
      setData(){
        this.serviceTypes = this.$parent.$parent.$parent.serviceTypes;
        this.orgTypes = this.$parent.$parent.$parent.orgTypes;
      },
      refreshtree(){
      	this.$parent.$parent.$parent.cxtree();
//    	this.loadNode(this.nodes,this.resolves)
      },
      refreshtreeBtn(){
      	this.num = this.num2;
      	this.treeKey = +new Date()
      },
      handleDropMenuSel(command){
        if("neworg"===command){
						this.selOrg = null;
            this.addjg = true;
        }
      },
      //新增组织
      addorg() {
        this.$refs["xzjgform"].validate(valid => {
          if (valid) {
          	this.submitButtonDisabled_zz = true;
            this.addjg = false;
            this.xzjgform.type = 1;
            if(this.selOrg===null){
              this.xzjgform.parentId = JSON.parse(sessionStorage.getItem('user')).orgId;
            }else{
              this.xzjgform.parentId = this.selOrg.id;
            }
            
            add(this.xzjgform).then(res => {
              if("000000"!=res.code){
              	this.submitButtonDisabled_zz = false;
                this.$message.error(res.mesg);
              }else{
              	this.xzjgform = {};
              	if(this.selOrg===null){
              		this.refreshtree();
              	  this.submitButtonDisabled_zz = true;
	              treecx().then(res=>{
				  		this.$parent.$parent.$parent.$refs.biaoge.jgtab = res.data;
				  		this.$parent.$parent.$parent.$refs.biaoge.total = res.data.length;
				  		this.data = res.data;
				  	})
	            }else{
	            	this.submitButtonDisabled_zz = true;
	                this.$parent.$parent.$parent.handleNodeClick(this.selOrg);
	                this.refreshtree();
	            }
                this.$message.success(res.mesg);
              }
            });
          }
        });
      },
      //新增部门
      addDept(){
        this.$refs["xzbmForm"].validate(valid => {
          if (valid) {
          	this.submitButtonDisabled_bm = true;
            this.xzbm = false;
            this.xzbmForm.parentId = this.selOrg.id;
            this.xzbmForm.type = 2;
            add(this.xzbmForm).then(res => {
              if("000000"!=res.code){
              	this.submitButtonDisabled_bm = false;
                this.$message.error(res.mesg);
              }else{
              	this.xzbmForm = {};
              	this.submitButtonDisabled_bm = true;
                this.$parent.$parent.$parent.handleNodeClick(this.selOrg);
                this.refreshtree();
                this.$message.success(res.mesg);
                if (this.sign) {
                	this.num = null
                }
              }
            });
          }
        });
      },
      //点击弹出框
      changfangxing() {
        this.changfangxings = !this.changfangxings;
      },
      // 搜索关键字
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      //点击树状图
      handleNodeClick(data,Node) {
      	this.nodes = Node;
      	this.$parent.$parent.$parent.$refs.biaoge.currentPage = 1;
        this.selOrg = data;
        this.$parent.$parent.$parent.handleNodeClick(data);
        this.num2 = findTreeId(this.insData,data.id)
//      console.log(this.num2)
      },
      //双击
      douNum(data){
      	this.num = findTreeId(this.insData,data.id)
      },
      //排序
      sortClick(type,node,data){
        var sortdata = [];
        if(type===1){
          sortdata = _sortBy(node.childNodes, function(item) {
            return item.data.id //orderNum;
          });
        }else{
          sortdata = _sortBy(node.childNodes, function(item) {
            return -item.data.id //orderNum;
          });
        }

        var newdata = [];
        for(var i=0; i < sortdata.length; i++){
          newdata.push(sortdata[i].data);
        }
        this.$refs.tree.updateKeyChildren(data.id,newdata);
      },
      closeBm(){
      	this.xzbmForm = {}
      },
      //叉叉按钮
      handleOrgDel(){
        if(isNil(this.selOrg)){
          this.$message.warning("请选择要删除的内容");
        }else{
//        this.$parent.$parent.$parent.$refs.biaoge.handleDelete(null,this.selOrg);
          this.$parent.$parent.$parent.$refs.biaoge.handleDelete(null,this.selOrg);
        }
      },
      handleImageSuccess(imageUrl) {
        this.xzjgform.picUrl = imageUrl;
      },
      handleImageSuccess2(imageUrl) {
        this.xzbmForm.picUrl = imageUrl;
      },
      showmapsel(){
        this.$refs.mapseldialog.open({lng: this.xzjgform.longitude, lat: this.xzjgform.latitude});
      },
      handleChange(value) {
        this.xzjgform.regionId = value[value.length - 1];
      },
      //地图选点确定处理
      handleMapConfirm(addres){
        this.xzjgform.addresDesc = addres.province+addres.city+addres.district+addres.addr
        this.xzjgform.longitude = addres.lng
        this.xzjgform.latitude = addres.lat
      }
    }
  };
</script>
<style scoped>
	.tree_explain{
		padding-left: 10px;
		line-height: 24px;
		margin: 2px;
		border: 1px solid #D9D9D9;
		background: #EEEEEE;
		border-radius: 3px;
		font-size: 14px;
		color:#7E7E7E;
	}
	.tree_wrap_{
		height: 100%;
	}
	/*::-webkit-scrollbar{display:none;}*/
  .topn {
    background: white ;
    border: white ;
    color: black ;
    margin-left: 1px;
    width: 45px;
  }
.el-select{
  	width: 100%;
  }
  .el-cascader{
  	width: 100%;
  }
  .iconPadding {
    margin-right: 5px;
  }
</style>
