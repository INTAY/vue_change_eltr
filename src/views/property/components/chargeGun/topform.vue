<template>
    <div class="t">
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <div class="yi">
                <el-form-item size="mini" label="充电枪名称" class="a">
                    <el-input v-model="form.devName" clearable class="styleClass" />
                </el-form-item>
                <el-form-item size="mini" label="所属机构" class="a">
                    <tree-select
                        ref="treeSelect"
                        v-model="form.orgId"
                        :props="orgDefaultProps"
                        :options="orgsTree"
                        :clearable="isClearable"
                        :accordion="isAccordion"
                        @getValue="getValue($event)"
                        class="styleClass"
                    />
                </el-form-item>
                <el-form-item size="mini" label="行政区域" class="a">
                    <el-cascader v-model="regValue" ref="region" :options="areas" :props="props" size="mini" clearable class="styleClass" />
                </el-form-item>
                <el-form-item size="mini" label="所属充电站" class="a">
                    <el-autocomplete
                        ref="autoComplete"
                        v-model="state"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        @select="handleSelect"
                        class="styleClass"
                        clearable
                    />
                </el-form-item>
                <el-form-item size="mini" label="充电设施" class="a">
                    <selectVue v-model="form.parentId" :options-list="chargeDevices" class="styleClass" />
                </el-form-item>
                <el-form-item size="mini" label="状态" class="a">
                    <selectVue v-model="form.state" filterable :options-list="devicesStatus" class="styleClass" />
                </el-form-item>
                <el-form-item style="margin-top: -0.25%">
                    <el-button size="mini" class="newButtonColor SearchBTN" @click="query">查询</el-button>
                    <el-button size="mini" class="SearchBTN otherBTN" @click="clearForm">清空</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
import { getAreas, getOrgTree } from '../../../../api/operation/pushButton';
import { DICTDATA, getDict } from '../../../../api/dict';
import { getStationList, queryByPage } from '../../../../api/property/charge';
import { exportConn } from '../../../../api/property/chargeGun';
import selectVue from '../../../../components/selectVue';
import treeSelect from '../../../../components/treeSelect/treeSelect';
import { getPowerOrgTree } from '../../../../api/commonApi';

export default {
    data() {
        return {
            form: {},
            regValue: [],
            props: {
                checkStrictly: true,
                label: 'name',
                children: 'children',
                value: 'id'
            },
            // 组织结构树
            orgsTree: [],
            isClearable: true, // 可清空（可选）
            isAccordion: true, // 可收起（可选）
            orgDefaultProps: {
                value: 'id',
                label: 'name',
                children: 'children'
            },
            areas: [],
            devicesStatus: [],
            chargeDevices: [],
            stations: [],
            state: '',
            params: {}
        };
    },
    components: { selectVue, treeSelect },
    created() {
        getPowerOrgTree().then((res) => {
            // console.log(res)
            for (let i = 0; i < res.data.length; i++) {
                this.orgsTree.push(res.data[i]);
            }
        });
        this.queryRegTree(-1);
        // 获取设备状态
        getDict(DICTDATA.INFRASTRUCTURE_STATUS).then((res) => {
            this.devicesStatus = res;
        });
    },
    methods: {
        getValue(value) {
            this.form.orgId = value;
        },

        // 充电桩的数据
        querySearchAsync(queryString, cb) {
            if (queryString !== '') {
                this.params.staName = queryString;
                getStationList(this.params).then((res) => {
                    for (let i of res.data) {
                        i.value = i.staName; //将想要展示的数据作为value
                    }
                    let restaurants = res.data;
                    cb(restaurants);
                });
            }
        },
        // 充电站选中事件
        handleSelect(item) {
            this.params = {};
            this.form.staId = item.id;
            this.params.staId = item.id;
            this.chargeDevices = [];
            queryByPage(this.params).then((res) => {
                for (let i = 0; i < res.data.records.length; i++) {
                    let selectValue = {};
                    selectValue.value = res.data.records[i].id;
                    selectValue.name = res.data.records[i].devName;
                    this.chargeDevices.push(selectValue);
                }
            });
        },
        //地区数据查询，翻译使用
        queryRegTree(id) {
            return new Promise((resolve, reject) => {
                getAreas(id).then((res) => {
                    this.areas = this.getTreeData(res.data.children);
                    resolve();
                });
            });
        },
        getTreeData(data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].children.length < 1) {
                    // children若为空数组，则将children设为undefined
                    data[i].children = undefined;
                } else {
                    // children若不为空数组，则继续 递归调用 本方法
                    this.getTreeData(data[i].children);
                }
            }
            return data;
        },
        query() {
            if (this.regValue.length !== 0) {
                this.form.regId = this.regValue[this.regValue.length - 1];
            }
            this.$parent.$refs.biaoge.queryList(this.form);
        },
        exportAssetConn(params) {
            if (this.$parent.$refs.biaoge.tableData.length == 0) {
                this.$message({
                    showClose: true,
                    message: '列表数据为空,无法导出!',
                    type: 'warning'
                });
                return;
            }

            //   当前选择的table列
            let nowColList = this.$parent.$refs.biaoge.$refs.tableDataRef.layout.store.states.columns;
            //  选择的查询条件
            let seclectFormLine = this.form;
            //  置空
            seclectFormLine.headers = [];
            seclectFormLine.values = [];
            //  掐头去尾 去undefind
            let filerList = nowColList.slice(1, nowColList.length - 1).filter((item, index, arr) => {
                if (item.property != undefined) {
                    return arr;
                }
            });
            //  格式化
            filerList.forEach((item) => {
                seclectFormLine.headers.push(item.label);
                seclectFormLine.values.push(item.property);
            });
            console.log(seclectFormLine, 'seclectFormLine');
            // 确认导出提示
            this.$confirm('确认导出吗?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: ''
            }).then(() => {
                this.$message({
                    message: '正在导出，请稍候...',
                    type: 'info'
                });
                if (this.regValue.length !== 0) {
                    this.form.regId = this.regValue[this.regValue.length - 1];
                }
                exportConn(this.form)
                    .then((res) => {
                        if (res.code === '000000') {
                            let aLink = document.createElement('a');
                            aLink.href = res.data;
                            aLink.click();

                            this.$message({
                                message: res.mesg,
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: res.data,
                                type: 'warning'
                            });
                        }
                    })
                    .catch((err) => {
                        this.$message.error(res.data);
                    });
            });
        },
        clearForm() {
            this.form = {};
            this.state = '';
            this.$refs.treeSelect.valueTitle = '';
        }
    }
};
</script>

<style lang="scss" scoped>
form.el-form.demo-form-inline.el-form--inline {
    height: 100%;
}

.styleClass {
    width: 180px;
}

.t {
    border-bottom: 1px solid #eeeeee !important;
    background: #fcfcfc !important;
    min-height: 35px;
}

.yi {
    margin: 18px 25px -12px;
}

.btk {
    width: 150px !important;
}

.xzk {
    width: 190px !important;
}

.xxzk {
    width: 190px;
}

.xan {
    color: white !important;
    background: #006080 !important;
    width: 60px;
    height: 30px;
}

.zxan {
    color: #006080 !important;
    height: 30px;
}

.demo-form-inline {
    height: 40px;
}

/deep/ .el-input__inner {
    height: 30px !important;
}

.el-form--inline .el-form-item {
    margin-right: 25px !important;
}
</style>
