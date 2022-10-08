<template>
    <div>
        <crud-form
            :field-list="fieldList"
            :showCheckbox="false"
            :api="getEcommissionPage"
            :queryParam="formInline"
            :tableOptionWidth="180"
            :page="false"
            ref="crudForm"
        >
            <template slot="searchBar">
                <topform ref="topform" />
            </template>

            <template slot="tableTopOptionLeft">
                <erji ref="erji" />
            </template>

            <template slot="tableOption" slot-scope="scope">
                <el-button @click="detail(scope.row)" class="common-btn" size="mini">详情</el-button>
                <el-button @click="remove(scope.row)" class="delete-btn" size="mini">删除</el-button>
            </template>
        </crud-form>
        <dialog-detail ref="dialogDetail" />
    </div>
</template>

<script>
import crudForm from '@/components/crudForm/index';
import topform from './components/workflow/topform';
import erji from './components/workflow/erji';
import dialogDetail from './components/workflow/dialogDetail';
import { getRegId } from '@/api/property/photovoltaic';
import { getEcommissionPage, busConfigDel, busConfigParticulars } from '@/api/system/workflow';
import { DICTDATA, getDict } from '@/api/dict';
import request from '@/api/request';
import LoginVue from '../Login/Login.vue';

export default {
    components: { crudForm, topform, erji, dialogDetail },
    data() {
        // 状态判断
        // let formatterState = (row) => {
        //     let state;
        //     //利用三元表达式判断
        //     (row.state == 1 && (state = '启用')) || (state = '停用');
        //     return state;
        // };
        return {
            regTreeData: [], //区域数据
            formInline: {},
            formInline: {},
            busType: null, //业务类型
            state: null,
            getEcommissionPage, // 分页查询流程配置
            fieldList: [
                { name: '业务类型', value: 'busTypeName', noSort: true },
                { name: '流程名称', value: 'descr', noSort: true },
                { name: '组织机构', value: 'orgName', noSort: true },
                { name: '申请人所属组织机构', value: 'applyOrgName', noSort: true }
            ]
        };
    },
    mounted() {
        this.init();
        //业务类型
        getDict(DICTDATA.BUSINSS_TYPE).then((res) => {
            this.busType = res;
        });
        //初始化调用详情
        this.detail();
    },
    methods: {
        init() {
            this.queryRegTree().then(() => {
                this.$refs.topform.setData();
                this.$refs.erji.setData();
            });
        },
        // 删除
        remove(row) {
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: ''
            }).then(() => {
                busConfigDel(row)
                    .then((res) => {
                        if (res.code === '000000') {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.$refs.crudForm.getDataInit();
                        } else {
                            this.$message.error(res.data);
                        }
                    })
                    .catch((res) => {});
            });
        },
        //详情
        async detail(row) {
            // console.log(row,"列数据");
            // return;
            //请求数据
            const { data: res } = await busConfigParticulars(row);
            let dialogDetail = this.$refs.dialogDetail;
            //清空数据
            dialogDetail.form = {};
            //把数据赋值里面
            dialogDetail.form = res;
            //判断数据是否为空
            if (res.checkList != null) {
                //过滤的空数组
                let newArr = res.checkList.filter((item, index, arr) => {
                    //判断是有数据的就返回
                    if (
                        item.deptId != null ||
                        item.orgId != null ||
                        item.userId != null ||
                        item.deptName != '' ||
                        item.orgName != '' ||
                        item.userName != ''
                    ) {
                        return arr[index];
                    }
                });
                //把过滤的数据赋值给checkList
                dialogDetail.form.checkList = newArr;
            }

            //数据放在里面
            dialogDetail.dialogDetailVisible = true;
        },
        // 停用
        async stopify(row) {
            //调用停启用接口
            const { data: res } = await busConfigDel(row.id);
            //刷新表单
            this.$refs.crudForm.handleCurrentChange(this.$refs.crudForm.listInfo.query.current); //this.$refs.crudForm.listInfo.query.current)是获取当前页
        },
        //地区数据查询
        queryRegTree() {
            return new Promise((resolve, reject) => {
                getRegId().then((res) => {
                    this.regTreeData = this.getTreeData(res.data.children);
                    resolve();
                });
            });
        },
        // 递归判断列表，把最后的children设为undefined
        getTreeData(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].children.length < 1) {
                    // children若为空数组，则将children设为undefined
                    data[i].children = undefined;
                } else {
                    // children若不为空数组，则继续 递归调用 本方法
                    this.getTreeData(data[i].children);
                }
            }
            return data;
        }
    }
};
</script>

<style lang="scss" scoped>
.default-class {
    width: 100%;
    height: 100%;
    .list {
        height: 100%;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
    }
}
/deep/ .table-header{
    height: 37px !important;
}
</style>