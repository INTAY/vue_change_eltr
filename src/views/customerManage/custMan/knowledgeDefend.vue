<template>
    <div>
        <el-col :span="3">
            <div style="border-bottom: 1px solid #c8c8c8; background-color: white">
                <el-button class="topn" icon="el-icon-plus" @click="addFun"></el-button>
                <el-button class="topn" icon="el-icon-edit-outline" @click="isdisabled = false"></el-button>
                <el-button class="topn" icon="el-icon-close" @click="delFun"></el-button>
            </div>
            <el-input placeholder="请输入文字" v-model="filterText" clearable>
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <div class="tree-wraps bg-color-fa c-border">
                <el-tree
                    ref="tree"
                    :data="treeData"
                    default-expand-all
                    node-key="id"
                    :filter-node-method="filterNode"
                    current-node-key="-1"
                    :expand-on-click-node="false"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                    :highlight-current="true"
                >
                    <span class="span-ellipsis" slot-scope="{ node }">
                        <span :title="node.label">{{ node.label }}</span>
                    </span>
                </el-tree>
            </div>
        </el-col>

        <el-col :span="21">
            <div class="submitForm">
                <el-button type="primary" @click="isdisabled = !isdisabled" class="modifyBtn">修改</el-button>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm bg-color-fa c-border">
                    <el-form-item label="id" prop="parentId">
                        <el-input class="wid400" v-model="ruleForm.id" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="知识库类别名称" prop="knowledgeType">
                        <el-input class="wid400" v-model="ruleForm.knowledgeType" :disabled="isdisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="知识库类编码" prop="knowledgeCode">
                        <el-input class="wid400" v-model="ruleForm.knowledgeCode" :disabled="isdisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="知识库类别描述" prop="knowledgeTypeDesc">
                        <el-input
                            style="width: 600px"
                            type="textarea"
                            v-model="ruleForm.knowledgeTypeDesc"
                            :disabled="isdisabled"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="参数值" prop="paramValue">
                        <el-input class="wid400" v-model="ruleForm.paramValue" :disabled="isdisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="参数序号" prop="sortNo">
                        <el-input class="wid400" v-model.number="ruleForm.sortNo" :disabled="isdisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="操作时间" prop="desc">
                        <el-input class="wid400" v-model="ruleForm.createdTime" disabled></el-input>
                    </el-form-item>
                    <el-form-item v-if="!isdisabled">
                        <el-button style="width: 180px" type="primary" @click="submitForm('ruleForm')">确定</el-button>
                        <el-button style="width: 180px" @click="resetForm('ruleForm')">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-col>
         <el-dialog title="新增" :visible.sync="addVisible">
             <el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px" class="addForm">
                    <!-- <el-form-item label="id" prop="parentId">
                        <el-input class="wid400" v-model="addForm.id" disabled></el-input>
                    </el-form-item> -->
                    <el-form-item label="知识库类别名称" prop="knowledgeType">
                        <el-input class="wid400" v-model="addForm.knowledgeType"></el-input>
                    </el-form-item>
                    <el-form-item label="知识库类编码" prop="knowledgeCode">
                        <el-input class="wid400" v-model="addForm.knowledgeCode"></el-input>
                    </el-form-item>
                    <el-form-item label="知识库类别描述" prop="knowledgeTypeDesc">
                        <el-input
                            style="width: 600px"
                            type="textarea"
                            v-model="addForm.knowledgeTypeDesc"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="参数值" prop="paramValue">
                        <el-input class="wid400" v-model="addForm.paramValue"></el-input>
                    </el-form-item>
                    <el-form-item label="参数序号" prop="sortNo">
                        <el-input class="wid400" v-model="addForm.sortNo"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="操作时间" prop="desc">
                        <el-input class="wid400" v-model="addForm.createdTime" disabled></el-input>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button style="width: 180px" type="primary" @click="submitAddForm('addForm')">确定</el-button>
                        <el-button style="width: 180px" @click="addVisible = false">取消</el-button>
                    </el-form-item>
                </el-form>
         </el-dialog>
    </div>
</template>
<script>
import { getTree, getKnowType, modKnowType, addKnowType, delKnowType} from '@/api/customerService/knowledgeLibrary';
import { modify } from '@/api/system/inspectLib';
import { type } from '@/components/upload/picUpload';
import moment from 'moment';

export default {
    data() {
        return {
            //
            filterText: '',
            //
            defaultProps: {
                children: 'children',
                label: 'knowledgeTypeDesc'
            },
            treeData: [],
            parentId: '',
            ruleForm: {},
            createdTime: '',
            addForm: {
                id: '',
                createdTime: ''
            },
            rules: {
                knowledgeType: [
                    { required: true, message: '请输入知识库类别名称', trigger: 'blur' }
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                knowledgeCode: [{ required: true, message: '请选择知识库类别编码', trigger: 'blur' }]
            },
            isdisabled: true, //  点修改后的操作
            // addDisabled: true, 
            addVisible: false
        };
    },
    mounted() {
        this.getInspectLibTree();
        this.getDetail(-1)
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.knowledgeTypeDesc.indexOf(value) !== -1;
        },
        //  获取树
        getInspectLibTree() {
            getTree().then((res) => {
                if (res.code == '000000') {
                    this.treeData = [res.data];
                }
            });
        },
        //  点击树节点获取当前节点详情
        handleNodeClick(data) {
            //  1、获取父节点   如果是null 那就是 -1 反之就是data.parentId
            if(data.parentId == null) {
                this.parentId = -1
            }else {
                this.parentId = data.id
            }
            //  2、获取当前数据的id
            this.addForm.id = data.id
            this.ruleForm.id = data.id
            //  3、获取操作时间
            this.addForm.createdTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            this.ruleForm.createdTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            //  4、查详情
            this.getDetail(data.id)
            //  5、切换的时候要禁止详情操作
            this.isdisabled = true
            this.$refs.ruleForm.clearValidate();
        },
        getDetail(val) {
            getKnowType(val).then((res) => {
                if (res.code === '000000') {
                    this.ruleForm = {
                        id: res.data.id,
                        knowledgeType: res.data.knowledgeType,
                        knowledgeCode: res.data.knowledgeCode,
                        knowledgeTypeDesc: res.data.knowledgeTypeDesc,
                        paramValue: res.data.paramValue,
                        sortNo: res.data.sortNo,
                        createdTime: moment(res.data.createdTime).format("YYYY-MM-DD HH:mm:ss")
                    }
                    // this.ruleForm = res.data;
                }
            });
        },
        //  修改树
        submitForm(formName) {
            if(!this.ruleForm.id) {
                this.$message({type: 'warning', message: '请先选择知识库后，再进行操作'})
                return
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.ruleForm.id,
                        knowledgeTypeForm: this.ruleForm
                    }
                    modKnowType(params).then((res) => {
                        if (res.code == '000000') {
                            this.getInspectLibTree()
                            this.$message({ type: 'success', message: '修改成功'});
                            //  清空表单
                            this.isdisabled = true
                            this.getDetail(this.parentId)
                            // this.$refs[formName].resetFields();
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        //  新增树
        submitAddForm(formName) {
            
            this.addForm.parentId = this.parentId
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    addKnowType(this.addForm).then((res) => {
                        if (res.code == '000000') {
                            //  刷新树结构
                            this.getInspectLibTree()
                            this.$message({ type: 'success', message: '新增成功'});
                            this.addVisible = false
                            //  清空表单
                            this.$refs[formName].resetFields();
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        addFun() {
            if(!this.parentId) {
                this.$message({type: 'warning', message: '请先选择知识库后，再进行操作'})
                return
            }
            this.addVisible = true

        },
        //  清空表单
        resetForm(formName) {
            this.isdisabled = true
            this.getDetail(this.parentId)
            // this.$refs[formName].resetFields();
        },
        //  删除树
        delFun() {
            if(!this.parentId) {
                this.$message({type: 'warning', message: '请先选择知识库后，再进行操作'})
                return
            }

            this.$confirm('确认删除该条数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delKnowType(this.parentId).then(res=> {
                        //  刷新树结构
                        this.getInspectLibTree()
                        if(res.code == '000000') {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message: '该类别下存在下级类别，请先逐个删除子级类别',
                                type: 'warning'
                            });
                        }
                    })
                }).catch(() => {
                    
                });
            
        },
        refreshtree() {},
        KeyUpEnter() {},
    }
};
</script>
<style lang="scss" scoped>
.modifyBtn {
    width: 240px;
    height: 45px;
    border-radius: 5px;
    margin-bottom: 20px;
}
.c-border {
    border: 1px solid #e0e0e0;
}
.tree-wraps {
    min-height: 500px;
}
.wid400 {
    width: 400px;
}
.submitForm {
    padding: 20px 100px;
    .ruleForm {
        width: 80%;
        padding: 20px 40px;
    }
}
.bg-color-fa {
    background-color: rgb(250, 250, 250);
}
/deep/.el-form-item {
    margin-bottom: 22px !important;
}
.topn {
    background: white;
    border: white;
    color: black;
    margin-left: 1px;
    width: 32%;
}
</style>
