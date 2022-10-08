<template>
    <div>
        <div class="s">
            <el-button size="mini" class="listBTN newButtonColor" @click="addBtn">新增</el-button>
        </div>

        <div>
            <el-dialog
                :title="title"
                :visible.sync="dialogFormVisible"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                width="1100px"
            >
                <el-form ref="form" :model="sizeForm" label-width="110px" size="small" class="qw">
                    <!-- 业务类型 -->
                    <div class="k">
                        <el-form-item label="业务类型" class="a" prop="busType">
                            <el-select @change="changeModelClick" v-model="sizeForm.busType" class="kz">
                                <el-option v-for="item in busType" :key="item.value" :label="item.name" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <!-- 组织机构 -->
                    <div class="K">
                        <el-form-item label="组织机构" prop="orgId" class="k" label-width="180">
                            <el-input v-model="this.orgname" :disabled="true" class="regPage"></el-input>
                        </el-form-item>
                    </div>
                    <!-- 审核页面 -->
                    <div class="ReviewPage">
                        <el-form-item label="审核页面" prop="resPath">
                            <el-input class="inputPage" placeholder="请输入内容" v-model="sizeForm.resPath" :disabled="true"> </el-input>
                        </el-form-item>
                    </div>
                    <!-- 申请人所属组织机构 -->
                    <div class="gropPage">
                        <el-form-item label="申请人所属组织机构" prop="applyOrgIds" label-width="180">
                            <el-cascader
                                v-model="sizeForm.applyOrgIds"
                                placeholder="申请人所属组织机构"
                                :options="orgTreeDataFlow"
                                :props="{
                                    multiple: true,
                                    value: 'id',
                                    label: 'name',
                                    children: 'children',
                                    emitPath: false,
                                    checkStrictly: true
                                }"
                                filterable
                                clearable
                                class="applyOrgId"
                            ></el-cascader>
                        </el-form-item>
                    </div>
                    <!-- 审批人 -->
                    <div>
                        <el-form-item label="审批人">
                            <el-button type="small" class="listBTN newButtonColor" @click="addFlow">新增流程</el-button>
                            <div class="block">
                                <el-timeline>
                                    <el-row v-for="(item, index) in sizeForm.checkList" :key="index">
                                        <el-timeline-item :timestamp="'第' + (index + 1) + '层审查'" placement="top" color="#008ab6">
                                            <!-- 删除按钮 -->
                                            <el-button type="mini" class="deleted" @click="deletedAddFlow(index)">删除</el-button>
                                            <el-row class="selectBox">
                                                <!-- 组织机构 -->
                                                <el-col :span="7" style="margin-right: 25px">
                                                    <el-form-item :prop="`checkList.${index}.orgId`" :rules="rulesFrom.orgId">
                                                        <el-cascader
                                                            v-model="item.orgId"
                                                            size="mini"
                                                            :options="orgTreeDataFlow"
                                                            :props="orgDefaultProps"
                                                            clearable
                                                            emitPath="false"
                                                            :change-on-select="true"
                                                            :show-all-levels="false"
                                                            @change="clearFirstData($event, index)"
                                                        ></el-cascader>
                                                    </el-form-item>
                                                </el-col>
                                                <!-- 部门 -->
                                                <el-col :span="7" style="margin-right: 25px">
                                                    <el-form-item :prop="`checkList.${index}.deptId`" :rules="rulesFrom.deptId">
                                                        <el-cascader
                                                            v-model="item.deptId"
                                                            size="mini"
                                                            :options="branchAll[index]"
                                                            :props="orgiztionProps"
                                                            clearable
                                                            :change-on-select="true"
                                                            :show-all-levels="false"
                                                            @change="clearSecondData($event, index)"
                                                        ></el-cascader>
                                                    </el-form-item>
                                                </el-col>
                                                <!-- 负责人 -->
                                                <el-col :span="8">
                                                    <el-select v-model="item.userId" placeholder="请选择负责人">
                                                        <el-option
                                                            v-for="item in principal[index]"
                                                            :key="item.id"
                                                            :label="item.name"
                                                            :value="item.id"
                                                        >
                                                        </el-option>
                                                    </el-select>
                                                </el-col>
                                            </el-row>
                                        </el-timeline-item>
                                    </el-row>
                                </el-timeline>
                            </div>
                        </el-form-item>
                    </div>
                </el-form>

                <div class="dialog-footer">
                    <el-button size="small" @click="save" class="editorBTN btnSpace bouncedHold">确定</el-button>
                    <el-button size="small" @click="cancel" class="editorBTN cancelBTN">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { getPowerOrgTree } from '@/api/commonApi'; //引入所属机构API
import { getDepartment, queryByDeptData, busConfigAdd } from '@/api/system/workflow'; //增加接口API
import logVue from '../../../operBeijing/components/PeriodicTaskOrder/log.vue';

export default {
    data() {
        //校验数据判断新增选择流程是否等于"null"
        var orgIdData = (rule, value, callback) => {
            if (value === 'null') {
                callback(new Error('请选择组织机构'));
            } else {
                callback();
            }
        };
        var deptIdData = (rule, value, callback) => {
            if (value === 'null') {
                callback(new Error('请选择部门'));
            } else {
                callback();
            }
        };
        return {
            //规则校验
            rulesFrom: {
                orgId: [{ required: true, validator: orgIdData, trigger: 'blur' }],
                deptId: [{ required: true, validator: deptIdData, trigger: 'blur' }]
            },
            title: '',
            orgname: sessionStorage.getItem('orgName'),
            dialogFormVisible: false,
            sizeForm: {
                busType: '',
                orgId: '',
                resPath: '',
                checkList: []
            },
            groupId: ['北京运维班组', '江苏运维班组', '湖南运维班组'],
            checkValue: '',
            orgDefaultProps: {
                //组织机构选择
                value: 'id',
                label: 'name',
                children: 'children',
                emitPath: false //中返回选中的节点，不返回数据
            },
            orgiztionProps: {
                //所属部门
                value: 'id',
                label: 'name',
                children: 'children',
                emitPath: false
            },
            principalAllProps: {
                //负责人
                value: 'id',
                label: 'name',
                // children: 'children',
                emitPath: false
            },
            orgTreeDataFlow: [], //新增流程所属机构
            branchAll: [], //所属部门
            principal: [], //负责人
            busType: [], //业务类型
            resPath: null,
            IsPrincipal: false //判断是否有负责人
        };
    },
    created() {
        getPowerOrgTree().then((res) => {
            //新增流程所属机构
            this.orgTreeDataFlow = this.filterTree(res.data, 2);
            // //强制性刷新DOM
            // this.$forceUpdate()
        });
    },
    methods: {
        handleSelect(item) {
            this.sizeForm.staId = item.id;
        },
        //业务类型
        setData() {
            this.busType = this.$parent.$parent.busType;
        },
        //组织机构与所属部门数据联动
        async clearFirstData(id, index) {
            //根据组织机构查询所属部门
            const { data: res } = await getDepartment(id);
            //把获取的组织机构的部门复制给所属部门
            this.branchAll[index] = res;
            //强制性刷新DOM
            this.$forceUpdate();
        },
        //所属部门与负责人数据联动
        async clearSecondData(id, index) {
            //根据所属部门挂在的负责人查询
            const { data: res } = await queryByDeptData(id);
            //把查询到的负责人赋值
            this.principal[index] = res;

            //当返回的负责人数据不为零的时候,新增成功
            if (res.length != '0') {
                this.IsPrincipal = true;
            }
            //强制性刷新DOM
            this.$forceUpdate();
        },

        //新增弹框打开
        addBtn() {
            this.title = '新增流程配置';
            this.dialogFormVisible = true;
            //数据清除
            this.sizeForm = {
                busType: '',
                orgId: JSON.parse(sessionStorage.getItem('orgId')),
                resPath: '',
                checkList: []
            };
        },
        //新增流程
        addFlow() {
            //新增流程增加流程控制
            this.sizeForm.checkList.push({ orgId: '', deptId: '', userId: '', level: this.sizeForm.checkList.length + 1 });
            this.branchAll.push([]);
            this.principal.push([]);
        },
        //新增流程 --> 删除按钮
        deletedAddFlow(i) {
            this.sizeForm.checkList.splice(i, 1);
            //删除后,判断level是否等于index + 1；如果不等于则level字段内容分改成index + 1，并返回数组
            let newArray = this.sizeForm.checkList.map((obj, index, arr) => {
                if (obj.level != index + 1) {
                    obj.level = index + 1;
                }
                return obj;
            });
            this.sizeForm.checkList = newArray;
            //删除相对应的数据
            this.branchAll.splice(i, 1);
            this.principal.splice(i, 1);
        },
        //新增 ----> 确定
        save() {
            //判断流程是否有新增且是否有相应的负责人
            if (this.IsPrincipal) {
                this.$refs['form'].validate(async (valid) => {
                    if (valid) {
                        try {
                            //增加按钮请求
                            const { data: res } = await busConfigAdd(this.sizeForm);
                            //重新刷新表单
                            this.$parent.$parent.$refs.crudForm.getDataInit();
                            //关闭弹窗
                            this.dialogFormVisible = false;
                            this.IsPrincipal = false;
                            //判断请求返回值，返回信息
                            if (res) {
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                            } else {
                                this.$message({
                                    message: '本条数据已经存在',
                                    type: 'warning'
                                });
                            }
                        } catch (error) {
                            this.$message.error(error);
                        }
                    } else {
                        this.$message.error('新增失败,有问题');
                    }
                });
            } else {
                this.$message.error('审核人没有添加或部门下没有挂载相应的负责人');
            }
        },
        //新增 ---> 取消
        cancel() {
            this.branchAll = [];
            //关闭弹窗
            this.dialogFormVisible = false;
            this.IsPrincipal = false;
        },
        //省市区三联框点击后触发
        handleChange(value) {
            this.sizeForm.regId = value[value.length - 1]; //取地区里最后一个值发给后端
        },
        //业务类型选择联动 --->网页URL
        changeModelClick(value) {
            //查询remark,查询url
            const dataUrl = this.busType.find((item) => {
                if (item.value == value) return item.remark;
            });
            //把页面url赋值给this.sizeForm.resPath
            this.sizeForm.resPath = dataUrl.remark;
        },
        //组织机构组织和部门过滤
        filterTree(data, type) {
            var newData = data.filter((x) => x.type !== type);
            newData.forEach((x) => x.children && (x.children = this.filterTree(x.children, type)));
            return newData;
        },
        //删除
        deletedIcon(val, i) {
            this.groupId.splice(i, 1);
        }
    }
};
</script>
<style lang="scss" scoped>
.qw {
    width: 1000px;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    padding-left: 25px;
}

.k {
    width: 450px;
    margin-right: 10px;
}

//审核页面
.ReviewPage {
    width: 100%;
}
.inputPage {
    width: 680px;
}
.regPage {
    width: 220px;
}
.gropPage {
    width: 100%;
    box-sizing: border-box;
}
//时间线
.el-timeline {
    width: 700px;
    padding: 0;
}
.block {
    margin-top: 20px;
    //删除按钮
    .deleted {
        position: absolute;
        right: 0;
        top: 0;
        // right: 11px;
        width: 80px;
        background-color: #f15e5e;
        border-color: #f15e5e;
        color: #fff;
        border-radius: 3px;
    }
    // 点击变色
    .deleted:focus,
    .deleted:hover {
        background-color: #c54242;
    }
    //select选择框
    .selectBox {
        margin-top: 22px;
    }
    /deep/.el-form-item {
        width: 190px;
    }
}
//底部
.dialog-footer {
    margin-left: 230px;
}
.deletedIcon {
    margin-left: 8px;
    color: #f15e5e;
}
.gropMessage {
    margin-left: 15px;
    border: none;
    border-radius: 3px;
    background-color: #e7f1f2;
}
.applyOrgId {
    width: 680px;
}
/deep/.el-form-item__label {
    width: 130px !important;
}
/deep/.el-tag.el-tag--info {
    color: #232323;
}
</style>
