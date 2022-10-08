<template>
    <el-container class="table_wrap">
        <el-main style="padding:0">
            <el-form
                class="wrap_in table_wrap"
                label-position="right"
                label-width="100px"
                :inline="true"
                :model="topForm"
                style="padding: 15px 20px 0 20px;background: #F8f8f8;"
            >
                <el-form-item label="组织机构">
                    <tree-select
                    	ref="treeSelect_"
                        style="width: 180px;"
                        size="mini"
                        v-if="true"
                        :options="orgTreeData_ins"
                        :props="orgDefaultProps"
                        :clearable="true"
                        v-model="topForm.orgId"
                        :accordion="true"
                        @getValue="getValue($event)"
                    />
                </el-form-item>

                <el-form-item label="关联Web角色">
                    <el-select
                    	clearable
                        size="mini"
                        v-model="topForm.roleId"
                        placeholder="角色"
                        style="width:140px;"
                    >
                        <el-option
                            v-for="item in roleData_w"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="关联App角色">
                    <el-select
                    	clearable
                        size="mini"
                        v-model="topForm.appRoleId"
                        placeholder="角色"
                        style="width:140px;"
                    >
                        <el-option
                            v-for="item in roleData_a"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="登录名">
                    <el-input
                        size="mini"
                        v-model="topForm.username"
                        placeholder="用户名"
                        style="width:120px;"
                    ></el-input>
                </el-form-item>

                <el-form-item label="姓名">
                    <el-input
                        size="mini"
                        v-model="topForm.name"
                        placeholder="姓名"
                        style="width:120px;"
                    ></el-input>
                </el-form-item>

                <el-form-item label="联系电话">
                    <el-input
                        size="mini"
                        v-model="topForm.mobile"
                        placeholder="电话"
                        style="width:140px;"
                    ></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button
                        style="margin-left: 20px;"
                        size="mini"
                        @click="searchPage"
                        class="newButtonColor btnSpace SearchBTN"
                    >查询</el-button>
                    <el-button @click="cancels" size="mini" class="SearchBTN otherBTN">清空</el-button>
                </el-form-item>
            </el-form>

            <div
                class="table-top-button"
                style="padding: 15px 20px 2px 20px;border-top:1px solid #eeeeee;"
            >
                <el-button @click="addUserClick" class="newButtonColor btnSpace listBTN">新增用户</el-button>
                <el-button @click="delUsersClick" class="BatchDeleteColor btnSpace listBTN">批量注销</el-button>
                <el-button size="mini" style="border: 1px solid #1396C2;color: #1396C2;" class="btnSpace listBTN otherBTN" @click="resetPassClick">密码重置</el-button>
                <el-button size="mini" style="border: 1px solid #1396C2;color: #1396C2;" class="listBTN otherBTN" @click="linkRoleClick">关联Web角色</el-button>
                <el-button size="mini" style="border: 1px solid #1396C2;color: #1396C2;" class="listBTN otherBTN" @click="linkRoleClick_">关联App角色</el-button>
            </div>
<!--max-height="620"-->
            <pagetable
                style="padding: 5px"
                ref="pagetable"
                :data="tableData"
                :current-page="currentPage"
                :pageSize="pageSize"
                :total="total"
                @selection-change="handleSelectionChange"
                @refresh-data="handleRefresh"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
            >
                <el-table-column type="index" width="50"></el-table-column>

                <el-table-column type="selection" width="50" align="center"></el-table-column>

                <el-table-column
                    label="登录名"
                    :show-overflow-tooltip="true"
                    prop="username"
                    width="100"
                ></el-table-column>

                <el-table-column label="姓名" show-overflow-tooltip prop="name" width="100"></el-table-column>

                <el-table-column label="电话" show-overflow-tooltip prop="mobile" width="150"></el-table-column>
                
                <el-table-column label="用户状态" show-overflow-tooltip prop="status" 
                	:formatter="user_status"
                	width="150"></el-table-column>

                <el-table-column
                    label="Web角色"
                    show-overflow-tooltip
                    prop="roleId"
                    :formatter="roleNameFormat_w"
                ></el-table-column>
                
                <el-table-column
                    label="App角色"
                    show-overflow-tooltip
                    prop="appRoleId"
                    :formatter="roleNameFormat_a"
                ></el-table-column>

                <!--<el-table-column
                    label="用户类型"
                    show-overflow-tooltip
                    prop="userType"
                    :formatter="roleTypeFormat"
                ></el-table-column>-->


                <el-table-column
                    label="组织机构"
                    show-overflow-tooltip
                    prop="orgId"
                    :formatter="orgNameFormat"
                ></el-table-column>

                <el-table-column label="部门" prop="deptName" show-overflow-tooltip>
                	
                </el-table-column>

                <el-table-column
                    label="有效期"
                    show-overflow-tooltip
                    prop="expireTime"
                    :formatter="DateTimeFormat"
                    width="150"
                ></el-table-column>

                <el-table-column fixed="right" label="操作" width="260">
                    <template slot-scope="scope">
                        <el-button
                        	size="mini"
                            class="common-btn buleBTN"
                            @click="openDetail(scope.$index, scope.row)"
                        >详情</el-button>
                        <el-button size="mini" class="common-btn buleBTN" @click="openEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button size="mini" class="delete-btn redBTN" 
                        	v-if="scope.row.status!='3'"
                        	@click="Delete(scope.$index, scope.row)">注销</el-button>
                        <el-button
                            v-if="scope.row.orgServiceType!='1' && scope.row.orgServiceType<=5 || scope.row.orgServiceType==10"
                            style="width: 72px;"
                            class="common-btn buleBTN"
                            @click="handlePower(scope.$index, scope.row)"
                        >数据权限</el-button>
                    </template>
                </el-table-column>
            </pagetable>
        </el-main>
        <user-power ref="userPower" />
        <useraddupdate ref="useraddupdate" />
        <userdetail ref="userdetail" />
        <userrolelink ref="userrolelink" />
    </el-container>
</template>

<script>
import treeSelect from '@/components/treeSelect/treeSelect';
import pagetable from '@/components/pagetable';
import { queryByPage, deleteUsers, deletUser, resetPass, getUserPower } from '@/api/power/user';
import useraddupdate from './components/user/user-add-update';
import userdetail from './components/user/user-detail';
import userrolelink from './components/user/user-role-link';
import UserPower from './components/user/user-power';
import { treecx } from '@/api/power/institution';
import { queryRole } from '@/api/power/role';
import { find, isNil, merge, omitBy, isNull } from 'lodash';
import { formatDate } from '@/utils/DateFormat';
import { DICTDATA, getDict, translatorDict } from "@/api/dict";
export default {
	name:'user',
    data() {
        return {
            removeButDisabled: true,
            topForm: {},
            tableData: [],
            selectionArray: [],
            pageSize: 20,
            currentPage: 1,
            total: 0,
            orgTreeData: [],
            orgTreeData_ins: [],
            areaData:[],
            roleData: [],
            roleData_w: [],
            roleData_a: [],
            user_data: [],
            orgDefaultProps: {
                label: 'name',
                children: 'children',
                value: 'id',
                checkStrictly: true,
                expandTrigger: 'hover'
            }
        };
    },
    components: { pagetable, useraddupdate, userdetail, userrolelink, UserPower, treeSelect },
    created(){
    	getDict(DICTDATA.USER_STATUS).then(res => {
          this.user_data = res;
        });
    	treecx().then((res) => {
            this.orgTreeData_ins = this.$refs.useraddupdate.filterTree(res.data,2);
        });
    	this.getOrgTreeData().then(() => {
        	this.getTableData();
        });
    	queryRole({size:9999,isApp:1}).then((res) => {
            this.roleData_a = res.data.records
        });
    	queryRole({size:9999,isApp:0}).then((res) => {
            this.roleData_w = res.data.records
        });
    },
    mounted() {
        
    },
    methods: {
        //数据权限
        handlePower(index, data) {
        	console.log(data)
        	this.$refs.userPower.init(data);
            if (data.orgServiceType == '4') {
                this.$refs.userPower.flag = '';
            } 
            else if (data.orgServiceType == '10'){
            	this.$refs.userPower.flag = 'arop';
            	let that_ = this;
            	setTimeout(function(){
            		that_.$refs.userPower.$refs.arop.ids= data.id;
            		that_.$refs.userPower.$refs.arop.refeshs();
            	},50)
            }else {
            	this.$refs.userPower.flag = 'text';
                getUserPower(data.id).then((res) => {
	            	if(res.code == "000000"){
	            		if (res.data.length) {
	                		this.areaData = res.data[0].objList;
	                	}else{
	                		this.areaData = []
	                	}
	                	this.$refs.userPower.$refs.areas.refeshs();
	            	}else{
	            		this.$message.error(res.mesg);
	            	}
	           	});
            }
//      	console.log(this.$refs.userPower.flag)
        },
        //表格选择框事件
        handleSelectionChange(val) {
            if (val.length) {
                this.removeButDisabled = false;
            } else {
                this.removeButDisabled = true;
            }
            let data = val.map((item) => {
                return item.id;
            });
            this.selectionArray = val;
        },
        // 分页点击事件
        handleSizeChange(val) {
            this.pageSize = val;
            this.getTableData();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getTableData();
        },
        handleRefresh() {
            this.currentPage = 1;
            this.getTableData();
        },
        getOrgTreeData() {
            return new Promise((resolve, reject) => {
                treecx().then((res) => {
                    this.orgTreeData = res.data;
                    resolve();
                });
            });
        },
        getValue(value) {
            this.topForm.orgId = value;
        },

        getRoleData() {
            return new Promise((resolve, reject) => {
                var params = { size: 9999 };
                queryRole(params).then((res) => {
                    this.roleData = res.data.records;
                    localStorage.setItem('roleDatas', JSON.stringify(this.roleData));
                    resolve();
                });
            });
        },
        getTableData() {
            var data = {};
            data.current = this.currentPage;
            data.size = this.pageSize;

            if (!isNil(this.topForm)) {
                merge(data, this.topForm);
            }
            data = omitBy(data, (item) => item === '' || isNull(item));
            queryByPage(data).then((res) => {
                if ('000000' == res.code) {
                    this.tableData = res.data.records;
                    this.total = res.data.total;
                } else {
                    this.$message.error(res.mesg);
                }
            });
        },
        searchPage() {
        	this.currentPage = 1;
            this.getTableData();
        },
        user_status(row, column, cellValue, index){
        	var dict = find(this.user_data, { value: cellValue });
            return dict ? dict.name : '';
        },
        roleNameFormat_w(row, column, cellValue, index) {
            var role = find(this.roleData_w, { id: cellValue });
            return role ? role.name : '';
        },
        roleNameFormat_a(row, column, cellValue, index) {
            var role = find(this.roleData_a, { id: cellValue });
            return role ? role.name : '';
        },
        roleTypeFormat2(row, column, cellValue, index) {
            let serviceTypes = JSON.parse(localStorage.getItem('dict-103'));
            var dict = find(serviceTypes, { value: cellValue });
            return isNil(dict) ? '' : dict.name;
        },
        roleTypeFormat(row, column, cellValue, index) {
            if (row.userType == '1') {
                return 'web用户';
            } else if (row.userType == '2') {
                return 'app用户';
            }
        },
        orgNameFormat(row, column, cellValue, index) {
            var org = this.searchTree(this.orgTreeData, cellValue);
            return org ? org.name : '';
        },
        orgNameFormat2(row, column, cellValue, index) {
            var det = this.searchTree(this.orgTreeData, cellValue);
            return det ? det.name : '';
        },
        formatDate_(data) {
            if (data) {
                return '至 ' + data.substring(0, 10);
            } else {
                return '';
            }
        },
        DateTimeFormat(row, column, cellValue, index) {
            return this.formatDate_(cellValue);
        },
        searchTree(tree, id) {
            var stark = [];
            stark = stark.concat(tree);

            while (stark.length) {
                var temp = stark.shift();
                if (temp.children) {
                    stark = stark.concat(temp.children);
                }
                if (temp.id === id) {
                    return temp;
                }
            }
            return null;
        },
        addUserClick() {
            this.$refs.useraddupdate.init();
        },
        delUsersClick() {
            if (this.selectionArray.length == 0) {
                this.$message.info('请先选中要删除的用户');
                return;
            }
            //warning
            this.$confirm('确定要注销吗?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                confirmButtonClass: "messagebox-button",
        		cancelButtonClass: "messagebox-button"
            }).then(() => {
                let arr = [];
                this.selectionArray.forEach((item) => {
                    arr.push(item.id);
                });

                deleteUsers(arr).then((res) => {
                    if ('000000' == res.code) {
                        this.getTableData();
                        this.$message({
                            message: '注销成功',
                            type: 'success'
                        });
                    } else {
                        this.$message.error(res.mesg);
                    }
                });
            });
        },
        resetPassClick() {
            let data = this.selectionArray.map((item) => {
                return item.id;
            });
            if (this.selectionArray.length == '0') {
                this.$message.warning('请先选中要重置密码的一个用户');
                return;
            }
            this.$confirm('确定要重置吗?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                confirmButtonClass: "messagebox-button",
        		cancelButtonClass: "messagebox-button"
            }).then(() => {
                resetPass(data).then((res) => {
                    if ('000000' == res.code) {
                        this.$message({
                            message: `${res.data}`,
                            type: 'success'
                        });
                        this.getTableData();
                    } else {
                        this.$message.error(`${res.data}`);
                    }
                });
            });
        },
        linkRoleClick() {
            if (this.selectionArray.length == '0') {
                this.$message.warning('请先选中一个用户');
                return;
            }
            let data = this.selectionArray.map((item) => {
                return item.id;
            });
            queryRole({size:9999,isApp:0}).then((res) => {
            	this.$refs.userrolelink.title="Web角色分配"
                this.$refs.userrolelink.init(data,res.data.records)
            });
            
        },
        linkRoleClick_() {
            if (this.selectionArray.length == '0') {
                this.$message.warning('请先选中一个用户');
                return;
            }
            let data = this.selectionArray.map((item) => {
                return item.id;
            });
            queryRole({size:9999,isApp:1}).then((res) => {
            	this.$refs.userrolelink.title="App角色分配"
                this.$refs.userrolelink.init(data,res.data.records)
            });
        },
        openEdit(index, rowdata) {
            this.$refs.useraddupdate.init(JSON.parse(JSON.stringify(rowdata)));
        },
        //详情
        openDetail(index, rowdata) {
            if (rowdata.orgServiceType == '1' || (rowdata.orgServiceType > 5 && rowdata.orgServiceType < 10)) {
                this.$refs.userdetail.sign = 2;
                this.$refs.userdetail.init(rowdata);
                this.$refs.userdetail.isShrink = true;
            }else if(rowdata.orgServiceType == '10'){
            	this.$refs.userdetail.type = '组织和地区';
            	getUserPower(rowdata.id).then((res) => {
                	if (res.code == "000000") {
                		if (res.data&&res.data.length) {
                			for(let i = 0; i < res.data.length; i ++){
                				if (res.data[i].objType == '1') {
                					if (res.data[i].objList.length) {
                						this.$refs.userdetail.insDatas = res.data[i].objList;
                					}else{
                						this.$refs.userdetail.insDatas = [];
                					}
                				}else{
                					if (res.data[i].objList.length) {
                						this.$refs.userdetail.areaData = res.data[i].objList;
                					}else{
                						this.$refs.userdetail.areaData = [];
                					}
                				}
                			}
                		}else{
                			this.$refs.userdetail.data = []
                		}
                		this.$refs.userdetail.init(rowdata);
                	}else{
                		this.$message.error(res.mesg);
                	}
                });
            }else {
                this.$refs.userdetail.sign = 1;
                if (rowdata.orgServiceType != '5') {
                    this.$refs.userdetail.type = '地区';
                    getUserPower(rowdata.id).then((res) => {
                    	if (res.code == "000000") {
                    		if (res.data&&res.data.length) {
                    			this.$refs.userdetail.data = res.data[0].objList;
                    		}else{
                    			this.$refs.userdetail.data = []
                    		}
                    		
                    	}else{
                    		this.$message.error(res.mesg);
                    	}
                    });
                    this.$refs.userdetail.init(rowdata);
                } else {
                    getUserPower(rowdata.id).then((res) => {
                        if (res.data[0].objType == '5') {
                            this.$refs.userdetail.type = '运营商';
                        } else if (res.data[0].objType == '4') {
                            this.$refs.userdetail.type = '台区';
                        }
                        this.$refs.userdetail.data = res.data[0].objList;
                    });
                    this.$refs.userdetail.init(rowdata);
                }
            }
        },
        Delete(index, rowdata) {
            this.$confirm('确定要注销吗?',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                confirmButtonClass: "messagebox-button",
        		cancelButtonClass: "messagebox-button"
            }).then(() => {
                deletUser(rowdata.id).then((res) => {
                    if ('000000' == res.code) {
                        this.getTableData();
                        this.$message({
                            message: '注销成功',
                            type: 'success'
                        });
                    } else {
                        this.$message.error(res.mesg);
                    }
                });
            });
        },
        cancels() {
        	this.$refs.treeSelect_.valueTitle=""
            this.topForm = {};
        }
    }
};
</script>
<style type="text/css" lang="scss">
.wrap_in .el-form-item {
    margin-bottom: 10px;
}
.table_wrap {
    .table-action-button {
        padding: 4px 8px 3px 8px;
        margin: 5px 1px;
        background: #e6eff2 !important;
        border-color: #99bfcc;
        color: #23a4a4;
        border-radius: 2px;
    }
    .red {
        color: #ff4949;
    }
}
</style>
