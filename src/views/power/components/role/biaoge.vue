<template>
    <div class="table_wrap">
        <div class="table-top-button">
            <el-button
                @click="handleNewMenuClick"
                :disabled="submitButtonDisabled"
                class="newButtonColor btnSpace listBTN"
            >{{btnText}}</el-button>
            <el-button :disabled="submitButtonDisabled" @click="handleDelMenuClick" class="BatchDeleteColor listBTN">批量删除</el-button>
        </div>

        <!-- 表格 -->
        <pagetable
            ref="pagetable"
            :data="jstab"
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

            <el-table-column show-overflow-tooltip label="菜单名称" prop="name"></el-table-column>

            <el-table-column
                show-overflow-tooltip
                label="类型"
                prop="type"
                :formatter="typeFormat"
                width="70"
            ></el-table-column>

            <el-table-column
                show-overflow-tooltip
                label="关联资源"
                prop="resourceId"
                :formatter="resNameFormat"
            ></el-table-column>

            <el-table-column
                label="菜单类型"
                show-overflow-tooltip
                prop="isApp"
                :formatter="resNameFormat2"
            ></el-table-column>

            <el-table-column show-overflow-tooltip label="图标" prop="icon"></el-table-column>

            <el-table-column show-overflow-tooltip label="描述" prop="description"></el-table-column>

            <el-table-column label="序号" prop="orderNum" width="50"></el-table-column>

            <el-table-column fixed="right" label="操作" width="140">
                <template slot-scope="scope">
                    <el-button
                        class="common-btn buleBTN"
                        size="mini"
                        :disabled="submitButtonDisabled"
                        @click="openEdit(scope.$index, scope.row)"
                    >修改</el-button>
                    <el-button
                        class="delete-btn redBTN"
                        size="mini"
                        :disabled="submitButtonDisabled"
                        @click="Delete(scope.$index, scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </pagetable>

        <menuaddupdate ref="menuaddupdate"></menuaddupdate>
    </div>
</template>

<script>
import { queryRole } from '@/api/power/role';
import { queryMenu, deleteMenu, deleteMenus } from '@/api/power/menu';
import pagetable from '@/components/pagetable';
import menuaddupdate from './menu-add-update';
import { getDict, DICTDATA } from '@/api/dict';
import { find, isNil } from 'lodash';
import { mapState,mapMutations } from 'vuex'
export default {
    data() {
        return {
            btnText: '新增菜单',
            jstab: [],
            removeButDisabled: true,
            submitButtonDisabled: false,
            SelectionArray: [],
            pageSize: 20,
            currentPage: 1,
            total: 5,
            selTreeData: null,
            resTypes: [],
            ids: [],
            sign: true,
            resTreeData: []
        };
    },
    components: { pagetable, menuaddupdate },
    created() {},
    computed:{
	  	...mapState(['resTree']),
	  },
    mounted() {
        this.getResType().then(() => {});
    },
    watch: {
        btnText(a) {
            if (a == '新增按钮') {
                this.$refs.menuaddupdate.btnText1 = '新增按钮';
                this.$refs.menuaddupdate.btnText2 = '修改按钮';
            } else {
                this.$refs.menuaddupdate.btnText1 = '新增菜单';
                this.$refs.menuaddupdate.btnText2 = '修改菜单';
            }
        }
    },
    methods: {
        setSelTreeData(data) {
            this.selTreeData = data;
        },
        //查询资源类型字典
        getResType() {
            return new Promise((resolve, reject) => {
                getDict(DICTDATA.RESOURCE_TYPE).then((res) => {
                    this.resTypes = res;
                    resolve();
                });
            });
        },
        cx(roleId = null, parentId = null, type = null) {
            var data = {};
            data.current = this.currentPage;
            data.size = this.pageSize;
            if (roleId != null) {
                data.roleId = roleId;
            }
            if (parentId != null) {
                data.parentId = parentId;
            }
            queryMenu(data).then((res) => {
                this.jstab = res.data.records.sort(function (a, b) {
                    return a.orderNum - b.orderNum;
                });
                this.pageSize = res.data.size;
                this.currentPage = res.data.current;
                this.total = res.data.total;
            });
        },
        typeFormat(row, column, cellValue, index) {
            var dict = find(this.resTypes, { value: cellValue });
            if (dict == null) {
                return '';
            } else {
                return dict.name;
            }
        },
        resNameFormat(row, column, cellValue, index) {
            this.resTreeData = this.resTree;
            var resdata = this.searchTree(this.resTreeData, cellValue);
            return resdata ? resdata.name : '';
        },
        resNameFormat2(row, column, cellValue, index) {
            if (cellValue) {
                return 'App';
            } else {
                return 'Web';
            }
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
        //表格选择框事件
        handleSelectionChange(val) {
            if (val.length) {
                this.removeButDisabled = false;
            } else {
                this.removeButDisabled = true;
            }
            this.SelectionArray = val;
        },
        // 分页点击事件
        handleSizeChange(val) {
            this.pageSize = val;
            if (this.sign) {
                this.cx();
            } else {
                if (this.$parent.$parent.$parent.$refs.tree.selNodeData.roleId) {
                    this.cx(
                        this.$parent.$parent.$parent.$refs.tree.selNodeData.roleId,
                        this.$parent.$parent.$parent.$refs.tree.selNodeData.id,
                        this.$parent.$parent.$parent.$refs.tree.selNodeData.type + 1
                    );
                } else {
                    this.cx(this.$parent.$parent.$parent.$refs.tree.selNodeData.id, '-1', 1);
                }
            }
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            if (this.sign) {
                this.cx();
            } else {
                if (this.$parent.$parent.$parent.$refs.tree.selNodeData.roleId) {
                    this.cx(
                        this.$parent.$parent.$parent.$refs.tree.selNodeData.roleId,
                        this.$parent.$parent.$parent.$refs.tree.selNodeData.id,
                        this.$parent.$parent.$parent.$refs.tree.selNodeData.type + 1
                    );
                } else {
                    this.cx(this.$parent.$parent.$parent.$refs.tree.selNodeData.id, '-1', 1);
                }
            }
        },
        handleRefresh() {
            this.currentPage = 1;
            if (this.sign) {
                this.cx();
            } else {
                if (this.$parent.$parent.$parent.$refs.tree.selNodeData.roleId) {
                    this.cx(
                        this.$parent.$parent.$parent.$refs.tree.selNodeData.roleId,
                        this.$parent.$parent.$parent.$refs.tree.selNodeData.id,
                        this.$parent.$parent.$parent.$refs.tree.selNodeData.type + 1
                    );
                } else {
                    this.cx(this.$parent.$parent.$parent.$refs.tree.selNodeData.id, '-1', 1);
                }
            }
        },
        handleNewMenuClick() {
            if (this.selTreeData === null) {
                this.$message.warning('请先选择所属菜单或角色后再添加其子菜单');
                return;
            }
            if (this.selTreeData.roleId) {
                //树选中的是菜单
                if (this.selTreeData.type === 1) {
                    //树选中的是菜单,类型为模块，新建页面
                    this.$refs.menuaddupdate.init(null, this.selTreeData.id, 2, this.selTreeData.roleId);
                } else if (this.selTreeData.type === 2) {
                    //树选中的是菜单,类型为页面，新建按钮
                    this.$refs.menuaddupdate.init(null, this.selTreeData.id, 3, this.selTreeData.roleId);
                } else {
                    this.$message.warning('请先选择所属菜单后再添加其子菜单');
                }
            } else {
                //树选中的是角色，角色下只能新增模块
                this.$refs.menuaddupdate.init(null, null, null, this.selTreeData.id);
            }
        },
        handleDelMenuClick() {
            if (this.SelectionArray.length == 0) {
                this.$message.info('请先选中删除的菜单');
                return;
            }
            this.$confirm('确定要删除吗?', '', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning',
	          confirmButtonClass: "messagebox-button",
	          cancelButtonClass: "messagebox-button"
	        }).then(() => {
	          var ids = [];
	            for (var i = 0; i < this.SelectionArray.length; i++) {
	                ids[i] = this.SelectionArray[i].id;
	            }
	            console.log(ids)
	            console.log(this.selTreeData)
	            deleteMenus(ids).then((res) => {
	                if ('000000' == res.code) {
	                    this.$message({
	                        message: '删除成功',
	                        type: 'success'
	                    });
	                    this.$parent.$parent.$parent.$refs.tree.handleNodeClick(this.selTreeData);
	                    this.$parent.$parent.$parent.$refs.tree.refreshtree();
	                } else {
	                    this.$message.error(res.mesg);
	                }
	            });
	        });
            
            
            
            
        },
        openEdit(index, rowdata) {
            this.$refs.menuaddupdate.init(JSON.parse(JSON.stringify(rowdata)), null, null, null);
        },
        // 删除
        Delete(index, row) {
            let id = row.id;
            this.$confirm('确定要删除吗?', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                confirmButtonClass: 'messagebox-button',
                cancelButtonClass: 'messagebox-button'
            })
                .then(() => {
                    deleteMenu(id).then((res) => {
                        if ('000000' == res.code) {
                            this.$message({
                                message: res.mesg,
                                type: 'success'
                            });
                            this.$parent.$parent.$parent.$refs.tree.handleNodeClick(this.selTreeData);
                            this.$parent.$parent.$parent.$refs.tree.refreshtree();
                        } else {
                            this.$message.error(res.mesg);
                        }
                    });
                })
                .catch(() => {});
        }
    }
};
</script>

<style type="text/css" lang="scss">
.table_wrap {
    .table-action-button {
        padding: 4px 8px 3px 8px;
        margin: 5px 1px;
    }
    .red {
        color: #ff4949;
    }
}
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