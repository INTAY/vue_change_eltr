<template>
  <el-dialog
    :title="!dataForm.id ? '新增用户' : '修改用户'"
    :close-on-click-modal="false"
    :visible.sync="visible"
	:modal-append-to-body='false'    
    :modal="true"
    @open="submitButtonDisabled = false"
    @close="cancel_"
    width="1020px">
    <el-form
    	style="margin-left: 2px;margin-right: 20px;"
      :model="dataForm"
      ref="dataForm"
      :rules="dataRule"
      :inline="false"
      label-width="120px"
      size="mini">

      <el-row>
        <el-col :span="8">
          <el-form-item label="登录名" prop="username">
            <el-input v-model="dataForm.username" clearable></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :span="8">
          <el-form-item label="用户姓名" prop="name">
            <el-input v-model="dataForm.name" clearable></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :span="8">
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="dataForm.mobile" clearable></el-input>
          </el-form-item>
        </el-col>
        </el-row>
        
      	<el-row>
        <el-col :span="8">
          <el-form-item label="所属组织" prop="orgId">
          	<el-select-tree
          		style="width: 202px;"
            size="mini"
            v-if="true"
            :popover-min-width="200"
            :default-expand-all="false"
            :data="orgTreeData_ins"
            :props="orgDefaultProps"
            :clearable="true"
            v-model="dataForm.orgId"
            :checkStrictly="true"
            @change="fn"
          />
          </el-select>
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item label="所属部门" prop="deptId">
            <el-select v-model="dataForm.deptId" clearable placeholder="所属部门" style="width: 202px;" >
              <el-option
                v-for="item in types"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="dataForm.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        </el-row>
        
      	<el-row>
        <el-col :span="8">
          <el-form-item label="身份证号" prop="cardCode">
            <el-input v-model="dataForm.cardCode" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dataForm.email" clearable></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :span="8">
          <el-form-item label="关联Web角色" prop="">
          	<el-select  size="mini" clearable v-model="dataForm.roleId" placeholder="关联Web角色" style="width:202px;">
	          	<el-option
	            v-for="item in roleData_w"
	            :key="item.id"
	            :label="item.name"
	            :value="item.id">
	          </el-option>
          </el-select>
          </el-form-item>
        </el-col>
        </el-row>
        
      	<el-row>
  		<el-col :span="8">
          <el-form-item label="关联App角色" prop="">
          	<el-select  size="mini" clearable v-model="dataForm.appRoleId" placeholder="关联App角色" style="width:202px;">
	          	<el-option
	            v-for="item in roleData_a"
	            :key="item.id"
	            :label="item.name"
	            :value="item.id">
	          </el-option>
          </el-select>
          </el-form-item>
        </el-col>
      	<el-col :span="8">
          <el-form-item label="过期日期" prop="expireTime" class="rel-form-item-row">
            <el-date-picker type="date" style="width: 202px;" placeholder="过期日期" value-format="yyyy-MM-ddTHH:mm:ss.000+0800" v-model="dataForm.expireTime"></el-date-picker>
          </el-form-item>
        </el-col>
        
        <!--<el-col :span="8">
          <el-form-item label="用户类型" prop="expireTime">
            <el-select v-model="dataForm.userType" placeholder="账户类型" style="width: 202px;" >
              <el-option
                v-for="item in userTypeList"
                :key="item.name"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>-->
        
        <el-col :span="8">
          <el-form-item label="是否外协" prop="isExt" class="rel-form-item-row">
            <el-radio-group v-model="dataForm.isExt">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        
      	
        </el-row>
        
      	<el-row>
      		<el-col :span="8">
          <el-form-item label="外协单位名称" prop="extName">
            <el-input v-model="dataForm.extName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资质证书" prop="qualify">
            <el-select v-model="dataForm.qualify" placeholder="资质证书" @visible-change="getQualifyData"style="width: 202px;" clearable>
              <el-option
                v-for="item in qualifyList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="8">
          <el-form-item label="资质等级" prop="qualifyGrade">
            <el-select v-model="dataForm.qualifyGrade" placeholder="资质等级" @visible-change="getQualifyGradeData" style="width: 202px;" clearable>
              <el-option
                v-for="item in qualifyGradeList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      	
        </el-row>
        
      	<el-row>
  		<el-col :span="8">
          <el-form-item label="学历" prop="edu">
            <el-select v-model="dataForm.edu" placeholder="学历" @visible-change="getEduData" style="width: 202px;" clearable>
              <el-option
                v-for="item in eduList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入职时间" prop="entryTime">
            <el-date-picker type="date" placeholder="入职时间" value-format="yyyy-MM-ddTHH:mm:ss.000+0800" v-model="dataForm.entryTime" style="width: 202px;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="初次工作时间" prop="initWorkTime">
            <el-date-picker type="date" placeholder="初次工作时间" style="width: 202px;" value-format="yyyy-MM-ddTHH:mm:ss.000+0800" v-model="dataForm.initWorkTime"></el-date-picker>
          </el-form-item>
        </el-col>
        
        </el-row>
        
      	<el-row>
      		<el-col :span="8">
          <el-form-item label="工作时薪" prop="salary">
            <el-input placeholder="工作时薪" v-model.number="dataForm.salary" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否负责人" prop="isLeader">
            <el-radio-group v-model="dataForm.isLeader">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="职责描述" prop="description">
        <el-input type="textarea" v-model="dataForm.description"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" style="position: relative;top: -15px;">
      <el-button size="mini" class="bouncedHold btnSpace editorBTN" :disabled='submitButtonDisabled' @click="dataFormSubmit()">确定</el-button>
      <el-button size="mini" class="editorBTN cancelBTN" @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getChildren } from "@/api/power/resource";
  import { cx ,treecx} from "@/api/power/institution";
  import {addUser, updateUser} from "@/api/power/user";
  import _sortBy from 'lodash/sortBy';
  import _find from 'lodash/find';
  import { getDict, DICTDATA } from "@/api/dict";

  export default {
    data () {
      var isMobileNumber= (rule, value, callback) => {
        if (!value) {
          return callback(new Error('不能为空'))
        } else {
          const reg = /^1[1|2|3|4|5|7|8|9][0-9]\d{8}$/;
          if (reg.test(value)) {
            callback()
          } else {
            return callback(new Error('请输入正确的手机号'))
          }
        }
      };
      var isMobileUsername= (rule, value, callback) => {
          const reg = /^[a-zA-Z0-9_]{0,}$/;
          if (!reg.test(value)) {
          	return callback(new Error('登录名不能包含中文'))
          } else {
            callback()
          }
      };
      var isEmail = (rule, value, callback) => {
       if (!value) {
         callback();
       } else {
         const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
         const email = reg.test(value);
         if (!email) {
           callback(new Error("邮箱格式如:admin@163.com"));
         } else {
           callback();
         }
       }
      };
      var isCardId = (rule, value, callback) => {
       if (!value) {
         callback();
       } else {
        const reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(([0-2][1-9])|10|20|30|31)\d{3}(\d|X|x)$/;
         const card = reg.test(value);
         if (!card) {
           //判断座机为12位
           callback(new Error("身份证格式不正确"));
         } else {
           callback();
         }
       }
      };
      var isPrice = (rule, value, callback) => {
       if (!value) {
         callback();
       } else {
         var reg = /^-?\d{1,4}(?:.\d{1,2})?$/;
         if (reg.test(value)) {
           callback();
         } else {
           callback(new Error("数字格式:0-9999或小数点后可加1到2位"));
         }
       }
      };
      return {
        visible: false,
        types:[],
        submitButtonDisabled:false,
        dataForm: {
          userType: 1
        },
        dataRule: {
          username: [
            { required: true, message: '登录名不能为空', trigger: 'blur' },
            { validator: isMobileUsername, trigger: "blur" },
            { min: 3, max: 20, message: '登录名长度在3到20个字符', trigger: 'blur' }
          ],
          userType: [
            { required: true, message: '类型不能为空', trigger: 'blur' }
          ],
          orgId: [
            { required: true, message: '所属组织不能为空', trigger: 'blur' }
          ],
          deptId: [
            { required: true, message: '所属部门不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: "请输入手机号码", trigger: "blur" },
            { validator: isMobileNumber, trigger: "blur" }
          ],
          email: [{ validator: isEmail, trigger: "blur" }],
          cardCode: [{ validator: isCardId, trigger: "blur" }],
          salary: [{ validator: isPrice, trigger: "blur" }],
        },
        orgTreePopuVisible: false,
        orgTreeData_ins: [],
        roleData_w: [],
        roleData_a: [],
        orgTreeProps: {
          label: 'name',
          children: 'children'
        },
        userTypeList: [],
        qualifyList: [],
        orgDefaultProps: {
        label: "name",
        children: "children",
        value: "id",
        checkStrictly: true,
        expandTrigger: "hover"
      },
        qualifyGradeList: [],
        eduList: []
      }
    },
    created(){
//  	this.getUserTypeData()
    },
    mounted() {

    },
    methods: {
    	cancel_(){
//  		this.$parent.$parent.getTableData()
    	},
    	fn(data){
    		cx({current: 1, size: 999, parentId:data}).then(res=>{
          	this.types = this.filterTree(res.data.records,1)
          	this.dataForm.deptId = "";
          })
    	},
    	filterTree(data, type) {
    		var newData = data.filter(x => x.type !== type)
    		newData.forEach(x => x.children && (x.children = this.filterTree(x.children, type)))
    		return newData
    	},
      init (data=null) {
      	treecx().then((res) => {
            this.orgTreeData_ins = this.filterTree(res.data,2);
            this.roleData_w = this.$parent.$parent.roleData_w
	        this.roleData_a = this.$parent.$parent.roleData_a
	        this.visible = true;
	        if(data!=null){
	          this.dataForm = data;
	          cx({current: 1, size: 999, parentId:data.orgId}).then(res=>{
	          	this.types = this.filterTree(res.data.records,1)
	          })
	        }else{
	          this.dataForm = {"deptId":''}
	          this.types = []
	        }
        });
      },
      dataFormSubmit(){
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
          	this.submitButtonDisabled = true;
            if(this.dataForm.id){
              this.updateAction(this.dataForm);
            }else{
              this.addAction(this.dataForm);
            }
          }
        })
      },
      updateAction(entity){
        updateUser(entity).then(res => {
          if("000000"==res.code){
          	this.submitButtonDisabled = true;
          	this.$parent.$parent.getTableData()
            this.$message.success("修改成功");
            this.visible = false;
          }else{
          	this.submitButtonDisabled = false;
            this.$message.error(res.data);
          }
        });
      },
      addAction(entity){
        addUser(entity).then(res => {
          if("000000"==res.code){
          	this.submitButtonDisabled = true;
          	this.$parent.$parent.getTableData()
            this.$message.success("添加成功");
            this.visible = false;
          }else{
          	this.submitButtonDisabled = false;
            this.$message.error(res.data);
          }
        });
      },
      //资源菜单树选中
      orgTreeCurrentChangeHandle (data, node) {
        this.orgTreePopuVisible = false
        this.dataForm.orgId = data.id
        this.dataForm.orgName = data.name
      },
      clearOrgName () {
        this.dataForm.orgId = null
        this.dataForm.orgName = null
      },
      getUserTypeData(){
          getDict(DICTDATA.USER_TYPE).then(res => {
            this.userTypeList = res;
          });
      },
      getQualifyData(value){
        if(value && this.qualifyList.length==0){
          getDict(DICTDATA.QUALITY_TYPE).then(res => {
            this.qualifyList = res;
          });
        }
      },
      getQualifyGradeData(value){
        if(value && this.qualifyGradeList.length==0){
          getDict(DICTDATA.QUALITY_GRDADE).then(res => {
            this.qualifyGradeList = res;
          });
        }
      },
      getEduData(value){
        if(value && this.qualifyList.length==0){
          getDict(DICTDATA.EDU).then(res => {
            this.eduList = res;
          });
        }
      },
    }
  }
</script>
