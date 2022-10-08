<template>
  <el-dialog
    :title="!dataForm.id ? btnText1 : btnText2"
    :close-on-click-modal="false"
    :modal-append-to-body='false'
    :visible.sync="visible"
    width="700px"
    @open="submitButtonDisabled = false"
    >
    <el-form
    	style="margin-left: 15px;margin-right: 27px;"
      :model="dataForm"
      ref="dataForm"
      :rules="dataRule"
      :inline="false"
      label-width="100px"
      size="mini">

      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="dataForm.name"></el-input>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单类型" prop="type">
            <el-select v-model="dataForm.type" placeholder="请选择菜单类型" @change="selcetChange" style="width:100%;">
              <el-option
                v-for="item in resTypes"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="关联资源" prop="resourceId">
            <el-popover
              width="300"
              ref="resListPopover"
              placement="bottom-start"
              v-model="popuresvisible"
              trigger="click">
              <el-input
							  placeholder="请输入路径进行过滤"
							  v-model="filterText">
							</el-input>
              <el-tree
                style="height:350px;overflow-y:auto;overflow-x: scroll;"
                :props="resListTreeProps"
                node-key="id"
                ref="resListTree"
                :data="resTree"
                accordion
                :filter-node-method="filterNode"
                @current-change="resListTreeCurrentChangeHandle"
                :default-expand-all="false"
                :highlight-current="true"
                :expand-on-click-node="false">
              </el-tree>
            </el-popover>
            <el-input v-model="dataForm.resName" v-popover:resListPopover :readonly="true" clearable @clear='clearResName'></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="图标" prop="icon">
            <el-input v-model="dataForm.icon" placeholder="输入icon类名"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="排序号" prop="orderNum">
            <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="dataForm.description"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" style="position: relative;top: -18px;">
      <el-button size="small" class="bouncedHold btnSpace editorBTN" type="primary" :disabled="submitButtonDisabled" @click="dataFormSubmit()">确定</el-button>
      <el-button size="small" class="editorBTN cancelBTN" @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getChildren } from "@/api/power/resource";
  import { updetaMenu } from "@/router";
  import {addMenu, updateMenu, deleteMenu, deleteMenus} from "@/api/power/menu";
  import _sortBy from 'lodash/sortBy';
  import _find from 'lodash/find';
  import { mapState,mapMutations } from 'vuex'
  export default {
    data () {
      return {
      	filterText: '',
        visible: false,
        btnText1:'新增菜单',
        btnText2:'修改菜单',
        submitButtonDisabled:false,
        dataForm: {
          name: null,
          resName: null,
          resourceId: null
        },
        dataRule: {
          resourceId: [
            { required: true, message: '关联资源不能为空', trigger: 'change' }
          ],
          name: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' }
          ]
        },
        resTypes:[],
        resListTreeProps: {
          label: 'name',
          children: 'children'
        },
        popuresvisible: false,
      }
    },
    created(){
    },
    watch: {
      filterText(val) {
        this.$refs.resListTree.filter(val);
      }
    },
    computed:{
	  	...mapState(['resTree']),
	  },
    mounted() {

    },
    methods: {
    	filterNode(value, data) {
        if (!value) {return true;}
        else{
        	if (data.url && data.url.length) {
        		return data.url.indexOf(value) != -1;
        	}
        }
     },
      init (data=null,parentId=null,addtype=null,roleId=null) {
      	this.dataRule.resourceId[0].required = true;
        this.visible = true;
        if(data!=null){
          //修改
          this.dataForm = data;
          if (data.type == '1') {
				this.$parent.$parent.$parent.$parent.$refs.tree.num = [data.roleId];
			}else if (data.type == '2') {
				this.$parent.$parent.$parent.$parent.$refs.tree.num = [data.roleId,data.parentId];
			}
          this.resListTreeSetCurrentNode()
        }else{
          //新增
          this.dataForm = {}
          this.dataForm.roleId = roleId
          if(parentId!=null){
            //指定了新增菜单的parentId,新增的菜单为页面或接口
            this.dataForm.parentId = parentId;
            if(addtype!=null){
              this.dataForm.type = addtype;
            }else{
              this.dataForm.type = 2;//没指定添加菜单类型，默认页面
            }
          }else{
          	this.dataForm.resourceId = null;
            //没有指定parentId则新增的菜单默认为模块，parentId=-1
            this.dataForm.parentId = "-1";
            this.dataForm.type = 1
          }
          this.dataForm.orderNum = this.$parent.total+1;
        }
        this.resTypes = this.$parent.resTypes
      },
      selcetChange(value){
        this.$forceUpdate()
      },
      //资源菜单树选中
      resListTreeCurrentChangeHandle (data, node) {
      	this.dataRule.resourceId[0].required = false;
        this.popuresvisible = false
        this.dataForm.name = data.name
        this.dataForm.resourceId = data.id
        this.dataForm.resName = data.name
      },
      //资源菜单树设置当前选中节点
      resListTreeSetCurrentNode () {
        this.dataForm.resName = ""
        if (this.dataForm.resourceId) {
          this.$nextTick(() => {
            this.$refs.resListTree.setCurrentKey(this.dataForm.resourceId)
            var resdata = this.searchTree(this.resTree,this.dataForm.resourceId)
            if(resdata!=null){
              this.dataForm.resName = resdata.name
              this.$forceUpdate()
            }
          });
        }
      },
      searchTree(tree, id){
        var stark = [];
        stark = stark.concat(tree);

        while(stark.length) {
          var temp = stark.shift();
          if(temp.children) {
            stark = stark.concat(temp.children);
          }
          if(temp.id === id) {
            return temp;
          }
        }
        return null;
      },
      clearResName () {
        this.dataForm.resourceId = null
        this.dataForm.resName = null
      },
      loadNode(node=null, resolve=null){
        var parentId = "-1";
        if(node.data==undefined){
          parentId = "-1";
        }else{
          parentId = node.data.id;
        }
        getChildren(parentId).then(res => {
          //排序
          var childrendDta = _sortBy(res.data, function(item) {
            return item.orderNum;
          });
          resolve(childrendDta);
        });
      },
      dataFormSubmit(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
          	this.submitButtonDisabled = true;
            //表单公共部分，模块
            var entity = {
              name: this.dataForm.name,
              description: this.dataForm.description,
              parentId: this.dataForm.parentId,
              type: this.dataForm.type,
              orderNum: this.dataForm.orderNum,
              icon: this.dataForm.icon,
              resourceId: this.dataForm.resourceId,
              roleId: this.dataForm.roleId
            };

            if(this.dataForm.id){
              entity.id = this.dataForm.id;
              this.updateAction(entity);
            }else{
              this.addAction(entity);
            }
          }
        })
      },
      updateAction(entity){
        updateMenu(entity).then(res => {
          if("000000"==res.code){
          	this.submitButtonDisabled = true;
            this.$message.success("修改成功");
            this.visible = false;
            updetaMenu();
            this.$parent.$parent.$parent.$parent.$refs.tree.handleNodeClick(this.$parent.selTreeData)
            this.$parent.$parent.$parent.$parent.$refs.tree.refreshtree()
//          if(entity.parentId == '-1'){
//          	this.$parent.$parent.$parent.$parent.$refs.tree.refreshtree();
//          	this.$parent.$parent.$parent.$parent.$refs.tree.num = [entity.roleId];
//          }else{
//          	this.$parent.$parent.$parent.$parent.$refs.tree.refreshtree();
//          	this.$parent.$parent.$parent.$parent.$refs.tree.num = [entity.roleId,entity.parentId];
//          }
          }else{
          	this.submitButtonDisabled = false;
            this.$message.error(res.mesg);
          }
        });
      },
      addAction(entity){
        addMenu(entity).then(res => {
          if("000000"==res.code){
          	this.submitButtonDisabled = true;
            this.$message.success("添加成功");
            this.visible = false;
            this.$parent.$parent.$parent.$parent.$refs.tree.handleNodeClick(this.$parent.selTreeData)
            this.$parent.$parent.$parent.$parent.$refs.tree.refreshtree()
            updetaMenu();
//          if(entity.parentId == '-1'){
//          	this.$parent.$parent.$parent.$parent.$refs.tree.refreshtree();
//          	this.$parent.$parent.$parent.$parent.$refs.tree.num = [entity.roleId];
//          }else{
//          	this.$parent.$parent.$parent.$parent.$refs.tree.refreshtree();
//          	this.$parent.$parent.$parent.$parent.$refs.tree.num = [entity.roleId,entity.parentId];
//          }
            
          }else{
          	this.submitButtonDisabled = false;
            this.$message.error(res.mesg);
          }
        });
      }
    }
  }
</script>
