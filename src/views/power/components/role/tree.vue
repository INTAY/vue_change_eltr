<template>
  <div class="role_tree_wrap" style="height: 100%;">
    <div style="border-bottom:1px solid #C8C8C8;background-color:white; display: flex;position: absolute;top: 0px;z-index: 7;">
      <el-tooltip effect="dark" content="查询" placement="top-start">
        <el-button class="topn" icon="el-icon-search" @click="changfangxing"></el-button>
      </el-tooltip>

      <el-tooltip effect="dark" content="新增角色" placement="top-start">
        <el-button class="topn" :disabled="submitButtonDisabled_" icon="el-icon-plus" @click="handleAddRole"></el-button>
      </el-tooltip>

      <el-tooltip effect="dark" content="删除角色或菜单" placement="top-start">
        <el-button :disabled="submitButtonDisabled_" class="topn" icon="el-icon-close" @click="handleRoleDel"></el-button>
      </el-tooltip>

      <el-tooltip effect="dark" content="刷新角色菜单树" placement="top-start">
        <el-button class="topn" icon="el-icon-refresh" @click="renderTree"></el-button>
      </el-tooltip>
    </div>
    <el-input
      v-show="changfangxings"
      size="mini"
      suffix-icon="el-icon-search"
      placeholder="输入关键字进行查找"
      style="border-bottom: 2px solid #1EA7BF;margin-bottom: 3px;"
      v-model="filterText" clearable>
    </el-input>
    
    <div style="overflow: auto;height: 99%; ">
    <el-tree
      :key="treeKey"
      style="background-color:#f7f7f7;"
      :filter-node-method="filterNode"
      :props="defaultProps"
      node-key="id"
      accordion
      highlight-current
      :expand-on-click-node=true
      :default-expanded-keys="num"
      @node-contextmenu="rightClick"
      ref="tree"
      lazy
      :load="loadNode"
      @node-click="handleNodeClick2"
      @current-change="handleNodeClick">
      <span slot-scope="{ node, data }" style="display: inline-block;width: 95%; position: relative;"
      		@mouseenter="mouseenter(data)"
            @mouseleave="mouseleaves(data)">
        <span>
          <i style="margin-right: 4px;" v-if="node.expanded && node.childNodes.length==0" class="el-icon-document-remove"></i>
          <i style="margin-right: 4px;" v-if="node.expanded && node.childNodes.length>0" class="el-icon-folder-opened"></i>
          <i style="margin-right: 4px;" v-else-if="data.children!=null && data.children.length==0" class="el-icon-document-remove"></i>
          <span>{{node.label}}</span>
          <span v-if="data.isShow_" style="position:absolute;right:5px;height:100%;vertical-align:middle;">
          	<!--//阻止事件-->
            <el-button @click.prevent.stop="() => moves(1,node,data)" size="mini" icon="el-icon-bottom" circle class="bouncedHold" style="padding:2px;"></el-button>
            <el-button @click.prevent.stop="() => moves(2,node,data)" size="mini" icon="el-icon-top" circle class="bouncedHold" style="padding:2px;margin-left:3px;"></el-button>
          </span>
        </span>
      </span>
    </el-tree>
      </div>
      
      
      <el-dialog
      	width="600px"
    :title="title"
    :close-on-click-modal="false"
    :modal-append-to-body='false'
    :visible.sync="addRoleVisable"
    @open="submitButtonDisabled = false"
	>
      <el-form  style="position: relative;left: -47px;"
      	:model="newRole"
      ref="newRole"
      :rules="rules"
  		label-width="120px"
        >
        <el-form-item label="角色" style="text-align: left;" prop="name">
          <el-input placeholder="请输入角色名称" v-model="newRole.name"></el-input>
        </el-form-item>
        
        <el-form-item label="类型" style="text-align: left;" prop="isApp">
        	<el-select v-model="newRole.isApp" clearable placeholder="请选择类型" style="width: 100%;"> 
                <el-option
                    v-for="item in ele"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
            </el-select>
        </el-form-item>

          <el-button :disabled="submitButtonDisabled" style="width: 200px;margin-left: 104px;margin-top: 18px;margin-bottom: 11px;" class="bouncedHold" @click="addUpdatRole">确定</el-button>
          <el-button style="width: 200px;margin-left: 20px;" @click="addRoleVisable=false">取消</el-button>

      </el-form>
    </el-dialog>
    <div id="righrmenu" v-show="rightMenuVisible" @mouseleave="rightMenuVisible=false">
      <el-menu @select="handleMenuSel">
        <el-menu-item index="1" v-if="isRole" class="menuItem">复制</el-menu-item>
        <el-menu-item index="2" class="menuItem" :disabled="paseMenuDisabled || submitButtonDisabled_">粘贴</el-menu-item>
        <el-menu-item v-if="rightMenuFreshVisible" :disabled="submitButtonDisabled_" index="3" class="menuItem">修改</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
import {addRole, updateRole, queryRole, roleDelete, pasteRole} from '@/api/power/role'
import { updetaMenu } from "@/router";
import {queryMenu,pasteMenu,deleteMenu,updateMenu} from '@/api/power/menu'
import _sortBy from 'lodash/sortBy';
import { isNil } from 'lodash';

export default {
  //监听树状图搜索框
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    roleIds(val) {
    	if (val == JSON.parse(sessionStorage.getItem('user')).roleId) {
    		this.$parent.$parent.$parent.$refs.biaoge.submitButtonDisabled = true;
    		this.submitButtonDisabled_ = true;
    	}else{
    		this.$parent.$parent.$parent.$refs.biaoge.submitButtonDisabled = false;
    		this.submitButtonDisabled_ = false;
    	}
    }
  },
  components: { },
  data() {
    return {
    	roleIds:'',
    	submitButtonDisabled:false,
    	submitButtonDisabled_:false,
    	title:'',
    	isRole:false,
      filterText: "",
      changfangxings: false,
      defaultProps: {
      	key:"id",
        children: "children",
        label: "name"
      },
      num:[],
      rightMenuVisible: false,
      rightMenuFreshVisible: true,
      selNodeData: {
      	roleId:null
      },
      rules: {
          name: [
            { required: true, message: '角色名称不能为空', trigger: 'change' }
          ],
          isApp: [
            { required: true, message: '角色类型不能为空', trigger: 'blur' }
          ]
        },
      rightClickNodeData: null,//右键点击节点
      copyNodeData: null,
      addRoleVisable: false,
      newRole:{},
      ele:[{name:'Web用户',id:0},{name:'App用户',id:1},],
      roleAddFormCss: {
        margintop: 0,
        marginleft: 40
      },
      nodes:null,
      roleAddOrUpdate: "add",
      treeKey: '',    // 控制tree渲染的key
      paseMenuDisabled: true,  //控制粘贴按钮是否可用,
      rightNodes:null,
      resolves:null,
    };
  },
  created(){
  	
  },
  mounted() {
	  	var params = { name: this.filterText,size: 9999};
	  	queryRole(params).then(res => {
	  		if (res.data.records.length) {
	  			this.$parent.$parent.$parent.$refs.biaoge.cx(res.data.records[0].id,"-1",1);
	  			this.num = [res.data.records[0].id]
	  			this.roleIds = res.data.records[0].id;
	  		}
	    });
  },
  methods: {
  	mouseenter(data) {
          if (data.type=='1' || data.type=='2') {
			this.$set(data, 'isShow_', true)
    	  }
      },
      // 鼠标移出
      mouseleaves(data) {
        this.$set(data, 'isShow_', false)
      },
      //移动排序
      moves(type,node,data){
      	let datas =[];
      	if (node.data.type == '1') {
      		var params = { size: 9999,roleId: node.data.roleId,parentId: data.parentId};
	        queryMenu(params).then(res => {
	          datas = res.data.records.sort(function(a,b){return a.orderNum - b.orderNum});
	          	//1是下  2是上
	            if (type == '1') {
		      		if(data.id == datas[datas.length-1].id){
		      		}else{
						let index_  = datas.findIndex(item => item.name === data.name);
						let jsonData = JSON.parse(JSON.stringify(datas));
//						let jsonData = datas;
						let params_1 = jsonData[index_]
						let params_2 = jsonData[index_+1]
						params_1.orderNum = datas[index_+1].orderNum
						params_2.orderNum = datas[index_].orderNum
						//请求交换
						updateMenu(params_1).then(res=>{
							updateMenu(params_2).then(res=>{});
							queryMenu(params).then(res => {
	          datas = res.data.records.sort(function(a,b){return a.orderNum - b.orderNum});
							updetaMenu()
							})
							this.treeKey = + new Date();
							if (data.parentId = "1255772695874605058") {
								this.num = [data.roleId,data.parentId] 
							}else{
								this.num = [data.roleId]  //打开上次的节点
							}
							this.$parent.$parent.$parent.$refs.biaoge.cx(this.selNodeData.id,"-1",1);
						});
						
		      		}	
		      	}else if (type == '2') {
		      		if(data.id == datas[0].id){

		      		}else{
		      			let index_  = datas.findIndex(item => item.name === data.name);
						let jsonData = JSON.parse(JSON.stringify(datas));
//						let jsonData = datas;
						let params_1 = jsonData[index_]
						let params_2 = jsonData[index_ -1]
						params_1.orderNum = datas[index_-1].orderNum
						params_2.orderNum = datas[index_].orderNum
						//请求交换
						updateMenu(params_1).then(res=>{
							updateMenu(params_2).then(res=>{});
							queryMenu(params).then(res => {  
	          datas = res.data.records.sort(function(a,b){return a.orderNum - b.orderNum});
							updetaMenu()
							})
							this.treeKey = + new Date();
							if (data.parentId = "1255772695874605058") {
								this.num = [data.roleId,data.parentId] 
							}else{
								this.num = [data.roleId]  //打开上次的节点
							}
						}); //交换
						this.$parent.$parent.$parent.$refs.biaoge.cx(this.selNodeData.id,"-1",1);
		      		}
		      		
		      	}
	        });
      	} else if(node.data.type == '2'){   //这是页面
      		var params = { size: 9999,roleId: node.data.roleId,parentId: node.data.parentId};
	        queryMenu(params).then(res => {
	          datas = res.data.records.sort(function(a,b){return a.orderNum - b.orderNum});
	           if (type == '1') {  //下
		      		if(data.id == datas[datas.length-1].id){
		      		}else{
						let index_  = datas.findIndex(item => item.name === data.name);
						let jsonData = JSON.parse(JSON.stringify(datas));
//						let jsonData = datas;
						let params_1 = jsonData[index_]
						let params_2 = jsonData[index_+1]
						params_1.orderNum = datas[index_+1].orderNum
						params_2.orderNum = datas[index_].orderNum
						//请求交换
						updateMenu(params_1).then(res=>{
							updateMenu(params_2).then(res=>{});
							queryMenu(params).then(res => {
	          datas = res.data.records.sort(function(a,b){return a.orderNum - b.orderNum});
							updetaMenu()
							})
							this.treeKey = + new Date();
							this.num = [data.roleId,data.parentId]  //打开上次的节点
							this.$parent.$parent.$parent.$refs.biaoge.cx(this.selNodeData.roleId,this.selNodeData.id,this.selNodeData.type+1);
						});
						
		      		}	
		      	}else if (type == '2') { //上
		      		if(data.id == datas[0].id){
		      			updetaMenu()
		      		}else{
		      			let index_  = datas.findIndex(item => item.name === data.name);
						let jsonData = JSON.parse(JSON.stringify(datas));
//						let jsonData = datas;
						let params_1 = jsonData[index_]
						let params_2 = jsonData[index_ -1]
						params_1.orderNum = datas[index_-1].orderNum
						params_2.orderNum = datas[index_].orderNum
						//请求交换
						updateMenu(params_1).then(res=>{
							updateMenu(params_2).then(res=>{});
							queryMenu(params).then(res => {  
	          datas = res.data.records.sort(function(a,b){return a.orderNum - b.orderNum});
							updetaMenu()
							})
							this.treeKey = + new Date();
						this.num = [data.roleId,data.parentId]//打开上次的节点
						this.$parent.$parent.$parent.$refs.biaoge.cx(this.selNodeData.roleId,this.selNodeData.id,this.selNodeData.type+1);
						}); //交换
						
		      		}
		      		
		      	}
	        });
      	} else{
      		datas =[]
      	}
        
      	
      	
      	
      },
    getRoles(){
      var params = { name: this.filterText,size: 9999};
      queryRole(params).then(res => {
        if("000000"!=res.code){
          this.$message.error(res.mesg);
        }else{
          this.renderTree();
        }
      })
    },
    // 刷新key值，重新渲染tree
    renderTree() {
      this.treeKey = +new Date();
    },
    rest() {
      this.loadNode(this.nodes,this.resolves)
    },
    changfangxing() {
      this.changfangxings = !this.changfangxings;
    },
    //右键点击
    rightClick(MouseEvent, data, Node, element){
    	this.rightNodes = Node;
      //只有点击角色才显示修改
      this.rightMenuVisible = true
      this.rightClickNodeData = data;
      righrmenu.style.cssText = "position: fixed; left: " + (MouseEvent.clientX - 15) + 'px' + "; top: " + (MouseEvent.clientY - 25) + 'px; z-index: 999; cursor:pointer;';
      if(data.type == '1' || data.type == '2'){
        //点击的是菜单
        this.isRole = true
        this.rightMenuFreshVisible = false
      }else{
      	this.isRole = false
      	this.rightMenuFreshVisible = true
      }
      },
      handleNodeClick2(data,Node=null){
      	this.nodes = Node;
      },
    //点击树状图事件
    handleNodeClick(data,Node=null) {
    	if (data.roleId) {
    		this.roleIds = data.roleId;
    	}else{
    		this.roleIds = data.id;
    	}
    	if (Node) {
    		this.nodes = Node;
    	}
    	if (data.roleType) {
    		this.num = [data.id] 
    	}else{
    		if (data.type == '1') {
    			this.num =[data.roleId,data.id]
    		}else if (data.type == '2'){
    			this.num =[data.roleId,data.parentId]
    		}
    	}
    	
    	this.$parent.$parent.$parent.$refs.biaoge.selTreeData = data;
    	this.$parent.$parent.$parent.$refs.biaoge.currentPage = 1;
      this.$parent.$parent.$parent.$refs.biaoge.pageSize = 20;
    	this.$parent.$parent.$parent.$refs.biaoge.sign = false;
      this.$parent.$parent.$parent.$refs.biaoge.$refs.menuaddupdate.ids = [data.id];
      this.$parent.$parent.$parent.$refs.biaoge.ids = [data.id];
      this.selNodeData = data;
      this.$parent.$parent.$parent.$refs.biaoge.setSelTreeData(data)
      //表格条件查询
      if(this.selNodeData.roleId){
        //菜单
        this.$parent.$parent.$parent.$refs.biaoge.cx(this.selNodeData.roleId,this.selNodeData.id,this.selNodeData.type+1);
      }else{
        //角色
        this.$parent.$parent.$parent.$refs.biaoge.cx(this.selNodeData.id,"-1",1);
      }
      if (data.type && data.type == 2) {
    		this.$parent.$parent.$parent.$refs.biaoge.btnText = '新增按钮'
    	}else {
    		this.$parent.$parent.$parent.$refs.biaoge.btnText = '新增菜单'
    	}
    },
    loadNode(node=null, resolve=null,param = null){
    		if (node.level === 0){
        //加载所有角色
        var params = {size: 9999};
        queryRole(params).then(res => {
          resolve(res.data.records);
        });
      }else if (node.level === 1){
        //角色展开，加载parentId为-1的资源
        var params = { size: 9999,roleId: node.data.id,parentId: "-1"};
        queryMenu(params).then(res => {
        		let childrendDta = [];
                for (var i = 0; i < res.data.records.length; i++) {
                        childrendDta.push(res.data.records[i]);
                }
                //排序
                childrendDta = _sortBy(childrendDta, function (item) {
                    return item.orderNum;
                });

                if (resolve) {
                    resolve(childrendDta); //动态加载时
                } else {
                    //更新节点时：
                    node.childNodes = [];
                    node.doCreateChildren(childrendDta);
                    this.resolves = resolve;
                }
        });
      }
      else if (node.data.type == 1){
        //加载菜单的下级菜单
        var params = { size: 9999,roleId: node.data.roleId,parentId: node.data.id};
        queryMenu(params).then(res => {
          		let childrendDta = [];
                for (var i = 0; i < res.data.records.length; i++) {
                        childrendDta.push(res.data.records[i]);
                }
                //排序
                childrendDta = _sortBy(childrendDta, function (item) {
                    return item.orderNum;
                });

                if (resolve) {
                    resolve(childrendDta); //动态加载时
                } else {
                    //更新节点时：
                    node.childNodes = [];
                    node.doCreateChildren(childrendDta);
                    this.resolves = resolve;
                }
        });
      }else{
      	resolve([]);
      }
//    else if (node.level === 3){
//      //加载菜单的下级菜单
//      var params = { size: 9999,roleId: node.data.roleId,parentId: node.data.id};
//      queryMenu(params).then(res => {
//        		let childrendDta = [];
//              for (var i = 0; i < res.data.records.length; i++) {
//                      childrendDta.push(res.data.records[i]);
//              }
//              //排序
//              childrendDta = _sortBy(childrendDta, function (item) {
//                  return item.orderNum;
//              });
//
//              if (resolve) {
//                  resolve(childrendDta); //动态加载时
//              } else {
//                  //更新节点时：
//                  node.childNodes = [];
//                  node.doCreateChildren(childrendDta);
//                  this.resolves = resolve;
//              }
//      });
//    }
      
    },
    //叉叉按钮
    handleRoleDel(){
      var that = this;
      if(isNil(this.selNodeData)){
        this.$message.warning("请选择要删除的内容");
      }else{
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "messagebox-button",
          cancelButtonClass: "messagebox-button"
        }).then(() => {
          if(that.selNodeData.roleId){
            that.deleteMenuAction(this.selNodeData.id);
            that.renderTree()
          }else{
            that.deleteRoleAction(this.selNodeData.id);
            that.renderTree()
          }
        });
      }
    },
    deleteRoleAction(roleId){
      roleDelete(roleId).then(res => {
        if("000000"!=res.code){
          this.$message.error(res.mesg);
        }else{
          this.$message.success(res.mesg);
          this.renderTree();
        }
      })
    },
    deleteMenuAction(menuId){
      deleteMenu(menuId).then(res => {
        if("000000"!=res.code){
          this.$message.error(res.mesg);
        }else{
          this.$message.success(res.mesg);
          this.renderTree();
        }
      })
    },
    refreshtree(){
//    this.renderTree();
      this.rest();
    },
    //树搜索关键字
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleAddRole(){
    	this.title='新增角色'
      this.roleAddOrUpdate = "add"
      this.roleAddFormCss.margintop = 0
      this.addRoleVisable = true
      this.newRole = {}
    },
    handleMenuSel(index){
      this.rightMenuVisible = false
      if(index==="1"){
        //复制
        this.copyNodeData = JSON.parse(JSON.stringify((this.rightClickNodeData)))
        this.paseMenuDisabled = false
      }else if(index==="2"){
        //粘贴
        if(this.copyNodeData==null){
          this.$message.info("请先复制");
          return;
        }else{
        	pasteMenu(this.copyNodeData.id,this.rightClickNodeData.id).then(res => {
	            if("000000"!=res.code){
	              this.$message.error(res.mesg);
	            }else{
	              this.$message.success(res.mesg);
	              if (this.rightClickNodeData.type == '1') {
					this.renderTree();
					this.$parent.$parent.$parent.$refs.tree.num = [this.rightClickNodeData.roleId,this.rightClickNodeData.id];
				}else if (this.rightClickNodeData.type == '2') {
					this.renderTree();
					this.$parent.$parent.$parent.$refs.tree.num = [this.rightClickNodeData.roleId,this.rightClickNodeData.parentId];
				}else if(this.rightClickNodeData.type == '3'){
					
				}else{
					this.renderTree();
					this.$parent.$parent.$parent.$refs.tree.num = [this.rightClickNodeData.id];
				}
				
	            }
	          })
        }
       
       
        this.copyNodeData = null
        this.paseMenuDisabled = true
      }else if(index==="3"){
        //修改 test
        this.roleAddOrUpdate = "update"
        this.title = '修改角色'
        this.newRole = {name:this.rightClickNodeData.name,isApp:this.rightClickNodeData.isApp}
        this.addRoleVisable = true
      }
    },
    addUpdatRole(){
      this.$refs['newRole'].validate((valid) => {
          if (valid) {
          	this.submitButtonDisabled = true;
            //表单公共部分，模块
           if(this.roleAddOrUpdate==="add"){
		        addRole(this.newRole).then(res => {
		          if("000000"!=res.code){
		            this.$message.error(res.mesg);
		          }else{
		            this.$message.success(res.mesg);
		            this.addRoleVisable = false
		            this.renderTree();
		          }
		          this.submitButtonDisabled = false;
		        })
		      }else{
		        this.newRole.id = this.rightClickNodeData.id
		        updateRole(this.newRole).then(res => {
		          if("000000"!=res.code){
		            this.$message.error(res.mesg);
		          }else{
		            this.$message.success(res.mesg);
		            this.addRoleVisable = false
		            this.renderTree();
		          }
		          this.submitButtonDisabled = false;
		        })
		      }
            
          }
        })
      

    }
  }
};
</script>

<style lang="scss">
  .role_tree_wrap .topn {
    background: white;
    border: white ;
    color: black;
    margin-left: 5px !important;
    font-size: 14px;
    width: 45px;text-align: center;
  }
</style>
