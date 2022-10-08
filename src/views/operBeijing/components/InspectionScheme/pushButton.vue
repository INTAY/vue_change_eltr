<template>
    <div>
        <div class="table-top-option-wrap">
            <div class="left">
                <el-button class="newButtonColor listBTN" size="mini" @click="addDialog">新增</el-button>
                <el-button class="BatchDeleteColor listBTN" size="mini" @click="batchDelete">批量删除</el-button>
            </div>
        </div>

        <!-- 弹出层 新增预案 -->
        <el-dialog
            title="新增模块任务"
            :modal-append-to-body="false"
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            class="yw"
            width="900px"
        >
            <div>
                <div class="form-item">
                    <div class="form-item-title"><span class="line"></span>基本信息</div>
                    <div class="form-item-content">
                        <el-form ref="form" :rules="rules" :model="formInline" label-width="85px" size="small" class="xy">
                            <el-row>
                                <el-col :span="9">
                                    <el-form-item label="模块名称" prop="inspName">
                                        <el-input v-model="formInline.inspName"></el-input>
                                    </el-form-item>
                                </el-col>
                                <!-- <el-col :span="8">
                  <el-form-item label="状态" prop="state">
                    <el-select v-model="formInline.state" placeholder="请选择">
                      <el-option
                        v-for="item in status"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->
                                <el-col :span="9">
                                    <el-form-item label="任务类型" prop="inspType">
                                        <el-select v-model="formInline.inspType" placeholder="请选择">
                                            <el-option
                                                v-for="item in inspectType"
                                                :key="item.value"
                                                :label="item.name"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </div>

                <div class="form-item">
                    <div class="form-item-title"><span class="line"></span>运维模块任务</div>
                    <div class="case-content">
                        <div class="left">
                            <div class="title">待选模块任务</div>
                            <div class="cont">
                                <el-tree
                                    ref="caseLibTree"
                                    default-expand-all
                                    :data="caseLibTreeData"
                                    :props="defaultProps"
                                    show-checkbox
                                    node-key="id"
                                >
                                    <span class="span-ellipsis" slot-scope="{ node }">
                                        <span :title="node.label">{{ node.label }}</span>
                                    </span>
                                </el-tree>
                            </div>
                        </div>

                        <div class="middle">
                            <div>
                                <button class="move" @click="moveAdd" title="添加"></button>
                            </div>
                        </div>

                        <div class="right">
                            <div class="title">
                                <div style="float: left">已选模块任务</div>
                                <div style="float: right; margin-right: 5px">
                                    <!-- <el-button class="btn-small" type="danger" @click="removeTreeData">删除</el-button> -->
                                </div>
                            </div>
                            <div class="cont">
                                <el-tree
                                    ref="caseSelectedTree"
                                    default-expand-all
                                    :data="caseSelectTreeData"
                                    show-checkbox
                                    :props="defaultProps"
                                    node-key="id"
                                >
                                    <span class="node-cus" slot-scope="{ node, data }">
                                        <span class="span-ellipsis" :title="node.label">{{ node.label }}</span>
                                        <span>
                                            <el-button type="text" size="mini" class="del_btn" @click="() => removeTreeData(node, data)"
                                                >移除</el-button
                                            >
                                        </span>
                                    </span>
                                </el-tree>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div slot="footer" class="dialog-footer dialog-btn">
                <el-button class="editorBTN btnSpace bouncedHold" size="mini" @click="save">确认</el-button>
                <el-button size="mini" class="editorBTN cancelBTN" @click="dialogFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getDict, DICTDATA } from '@/api/dict';
import { add, batchDelete, updateById } from '@/api/operation/inspectScheme';
import { getInspectLibTree } from '@/api/system/inspectLib';

export default {
    data() {
        return {
            inspectType: [], // 任务类型
            visibleOrgTree: false,
            formInline: {
                orgName: '',
                libId: ''
            },
            status: [],
            orgTreeData: [],
            defaultProps: {
                children: 'children',
                label: 'libName'
            },
            orgDefaultProps: {
                children: 'children',
                label: 'name'
            },
            dialogFormVisible: false,
            addFormVisible: false, //新增预案名称
            addForm: {},
            caseLibTreeData: [],
            caseSelectTreeData: [],
            caseSelectTreeDataOrigin: [],
            rules: {
                inspName: [
                    {
                        required: true,
                        message: '请输入名称',
                        trigger: ['blur', 'change']
                    },
                    {
                        min: 1,
                        max: 100,
                        message: '长度在 1 到 100 个字符',
                        trigger: ['blur', 'change']
                    }
                ],
                inspType: [
                    {
                        required: true,
                        message: '请选择任务类型',
                        trigger: ['blur', 'change']
                    }
                ],
                state: [
                    {
                        required: true,
                        message: '请选择状态',
                        trigger: ['blur', 'change']
                    }
                ]
            }
        };
    },
    created() {
        // 获取状态字典
        getDict(DICTDATA.INSPECT_CONTENT_STATUS).then((res) => {
            this.status = res;
        });
        // 获取状态字典 400
        getDict(DICTDATA.DEVOPS_TASK_TYPE).then((res) => {
            this.inspectType = res;
        });
    },
    methods: {
        /**
         * 删除已选的运维方案
         */
        removeTreeData(node, data) {
            this.$refs.caseSelectedTree.remove(node);
        },
        /**
         * 批量删除
         */
        batchDelete() {
            let multipleSelection = this.$parent.$refs.formTable.multipleSelection;
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
                            // 重新查询数据
                            this.$parent.$refs.formTable.queryPage({
                                current: 1
                            });
                        } else {
                            this.$message({
                                message: res.data,
                                type: 'warning'
                            }).catch((err) => {
                                this.$message.error('删除失败');
                            });
                        }
                    });
                });
            }
        },
        /**
         * 保存
         */
        save() {
            // 校验
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.caseSelectTreeData.length === 0) {
                        this.$message({
                            message: '请选择运维方案！',
                            type: 'warning'
                        });
                        return;
                    } else {
                        this.formInline.libId = this.formInline.id;
                        this.formInline.inspectContentDetForms = this.caseSelectTreeData;
                        if (this.formInline.id && this.formInline.id !== '') {
                            updateById(this.formInline).then((res) => {
                                if (res.code !== '000000') {
                                    this.$message({
                                        message: res.mesg,
                                        type: 'warning'
                                    });
                                } else {
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    this.dialogFormVisible = false;
                                    let params = this.$parent.$refs.fillBar.formInline
                                    // 重新查询列表
                                    this.$parent.$refs.formTable.queryPage(params);
                                }
                            });
                        } else {
                            add(this.formInline).then((res) => {
                                if (res.code !== '000000') {
                                    this.$message({
                                        message: res.mesg,
                                        type: 'warning'
                                    });
                                } else {
                                    this.$message({
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    this.dialogFormVisible = false;

                                    // 重新查询列表
                                    this.$parent.$refs.formTable.queryPage({
                                        current: 1
                                    });
                                }
                            });
                        }
                    }
                }
            });
        },
        /**
         * 显示新增弹出层
         */
        addDialog() {
            this.formInlineInit();
            this.getInspectLibTree();
            this.resetForm();
            this.dialogFormVisible = true;
        },
        /**
         * 清空组织机构信息
         */
        clearOrg() {
            this.formInline.orgName = '';
            this.formInline.orgId = '';
        },
        /**
         * 表单初始化
         */
        resetForm() {
            if (this.$refs['form'] !== undefined) {
                this.$refs['form'].resetFields();
            }
        },
        /**
         * 组织机构树选中
         */
        handleNodeClick(item) {
            this.formInline.orgName = item.name;
            this.formInline.orgId = item.id;
            this.visibleOrgTree = false;
        },
        /**
         * 选择组织机构文本框聚焦
         */
        showOrgTree() {
            this.visibleOrgTree = true;
            // 获取组织机构树接口调用
            this.getOrgTree();
        },
        /**
         * 获取组织机构树接口调用
         */
        getOrgTree() {
            if (this.orgTreeData && this.orgTreeData.length < 1) {
                getOrgTree().then((res) => {
                    this.orgTreeData = res.data;
                });
            }
        },
        // 表单初始化
        formInlineInit() {
            this.formInline = {};
            // 状态默认为“启用”
            this.formInline.status = 1;
            this.caseSelectTreeData = [];
            this.caseSelectTreeDataOrigin = [];
            // 清空已选择的树节点
            let caseLibTree = this.$refs.caseLibTree;
            if (caseLibTree) {
                caseLibTree.setCheckedKeys([]);
            }
        },
        /**
         * 获取运维预案库树
         */
        getInspectLibTree() {
            if (this.caseLibTreeData && this.caseLibTreeData.length < 1) {
                getInspectLibTree(-1).then((res) => {
                    this.caseLibTreeData = [res.data];
                });
            }
        },
        /**
         * 添加到“已选运维预案”
         */
        moveAdd() {
            let selectedTreeData = this.$refs.caseLibTree.getCheckedNodes(false, true);
            let lgh = this.buildTreeData(selectedTreeData);
            if (lgh.length > 0) {
                this.caseSelectTreeData = lgh;
            }
        },
        buildTreeData(list) {
            let map = {};
            let result = [];
            for (let i in list) {
                if (list[i].children) {
                    delete list[i].children;
                }
            }

            // 判断是否已添加过
            if (this.caseSelectTreeDataOrigin.length > 0) {
                for (let i in list) {
                    let flag = false;
                    for (let j in this.caseSelectTreeDataOrigin) {
                        if (this.caseSelectTreeDataOrigin[j].id === list[i].id) {
                            flag = true;
                            break;
                        }
                    }
                    // 有重复的
                    if (!flag) {
                        this.caseSelectTreeDataOrigin.push(list[i]);
                    }
                }
            } else {
                this.caseSelectTreeDataOrigin = list;
            }

            // 以id为key，便于查找
            this.caseSelectTreeDataOrigin.forEach((item) => {
                map[item.id] = item;
            });

            // 组织成树形结构的数据
            this.caseSelectTreeDataOrigin.forEach((item) => {
                let parent = map[item.parentId]; // item的pid若与map对象的键相同，则item为父级节点
                let label = '';
                item.label = item.name;
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                    parent.children.forEach((_item) => {
                        _item.label = _item.name;
                    });
                } else {
                    result.push(item);
                }
            });
            return result;
        }
    }
};
</script>

<style lang="scss" scoped>
.node-cus {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;

    .el-button--text {
        border: none;
    }
}
.org-tree-wrap {
    height: 150px;
    overflow-y: auto;
    position: absolute;
    left: 0;
    top: 33px;
    right: 0;
    z-index: 2;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
}

.table-top-option-wrap {
    margin: 10px 15px;
    overflow: hidden;

    .left {
        float: left;

        >>> .el-button--primary {
            width: 120px;
            height: 32px;
            border-radius: 2px;
        }
    }
    .right {
        float: right;

        >>> .el-button {
            width: 120px;
            height: 32px;
            border-radius: 2px;
        }
    }
}
.demo-ruleForm {
    //新增预案表单弹窗
    padding-right: 50px; // 表单内边距50px；

    .dialog-footer {
        // 底部表单按钮 区域
        display: flex;
    }
}

.move {
    width: 45px;
    height: 45px;
    background: #24b3ca url(../../../../assets/image/arrow-right.png) no-repeat center center;
    background-size: 26px;
    border: 0;
    border-radius: 50%;
    padding: 0;
    cursor: pointer;
    outline: none;
}

.form-item {
    margin-bottom: 10px;

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
            vertical-align: revert;
            width: 4px;
            height: 14px;
            margin-right: 10px;
            background-color: #24b3ca;
            border-radius: 4px;
        }
    }
}

.case-content {
    overflow: hidden;

    .left {
        width: 390px;
        float: left;
        border: 1px solid #eaeaea;
        border-radius: 4px;

        .title {
            background-color: #f1f1f1;
            color: #00607f;
            height: 35px;
            line-height: 35px;
            padding-left: 10px;
            font-weight: bold;
        }

        .cont {
            height: 300px;
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
        width: 390px;
        float: left;
        border: 1px solid #eaeaea;
        border-radius: 4px;

        .title {
            background-color: #f1f1f1;
            color: #00607f;
            height: 35px;
            line-height: 35px;
            padding-left: 10px;
            font-weight: bold;
            overflow: hidden;
        }

        .cont {
            height: 300px;
            overflow-y: auto;
        }
    }
}
.del_btn {
    color: #d42f2f;
    font-size: 13px;
}
/deep/ .span-ellipsis{
    width: 251px !important;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
