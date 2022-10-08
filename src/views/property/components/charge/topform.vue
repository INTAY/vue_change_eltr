<template>
    <div class="t">
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <div class="yi">
                <el-form-item size="mini" label="设施名称" class="a">
                    <el-input v-model="form.devName" clearable class="styleClass" />
                </el-form-item>
                <el-form-item size="mini" label="组织机构" class="a">
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
                    <el-cascader
                        ref="region"
                        v-model="regValue"
                        :options="areas"
                        :props="props"
                        size="mini"
                        clearable
                        filterable
                        class="styleClass"
                        @change="handleChange"
                    />
                </el-form-item>
                <el-form-item size="mini" label="所属充电站" class="a">
                    <el-autocomplete
                        ref="autoComplete"
                        v-model="state"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        @select="handleSelect"
                        clearable
                        class="styleClass"
                    />
                </el-form-item>
                <!-- <el-form-item size="mini" label="设备类型" class="a">
          <el-select class="styleClass" clearable v-model="form.devType">
            <el-option
              v-for="item in deviceTypes"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
                <el-form-item size="mini" label="状态" class="a">
                    <el-select class="styleClass" clearable v-model="form.state">
                        <el-option v-for="item in devicesStatus" :key="item.value" :label="item.name" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-button size="mini" class="newButtonColor SearchBTN" @click="query">查询</el-button>
                <el-button size="mini" class="otherBTN SearchBTN" @click="clearForm">清空</el-button>
            </div>
        </el-form>
    </div>
</template>
<style lang="scss" scoped>
form.el-form.demo-form-inline.el-form--inline {
    height: 100%;
}

.styleClass {
    width: 180px;
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

.a {
    padding-left: 10px;
}

.yi {
    margin: 18px 15px -5px;
}

/deep/ .el-input__inner {
    height: 30px !important;
}
</style>
<script>
import { getAreas, getOrgTree } from '../../../../api/operation/pushButton';
import { DICTDATA, getDict } from '../../../../api/dict';
import { getStationList, exportData } from '../../../../api/property/charge';
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
            stations: [],
            params: {},
            state: ''
        };
    },
    components: { treeSelect },
    created() {
        getPowerOrgTree().then((res) => {
            for (let i = 0; i < res.data.length; i++) {
                this.orgsTree.push(res.data[i]);
            }
        });
        this.queryRegTree(-1);
        // 获取设备状态
        getDict(DICTDATA.INFRASTRUCTURE_STATUS).then((res) => {
            this.devicesStatus = res;
        });
        // 获取设备分类
        // getDict(DICTDATA.CHARGE_TYPE).then((res) => {
        //   this.deviceTypes = res;
        // });
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
                        //将想要展示的数据作为value
                        i.value = i.staName;
                    }
                    let restaurants = res.data;
                    cb(restaurants);
                });
            }
        },
        // 充电桩选中事件
        handleSelect(item) {
            this.form.staId = item.id;
        },
        // 树的点击事件
        handleNodeClick(node) {
            this.node.value = node.id;
            this.node.name = node.name;
            this.form.orgId = node.id;
            getStationList(this.form).then((res) => {
                this.stations = res.data;
            });
            this.$refs.nodeSelect.blur();
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
        // 多级联动选择器选中事件
        handleChange() {
            const checkedNodes = this.$refs['region'].getCheckedNodes();
            this.form.regId = checkedNodes[0].data.id;
            getStationList(this.form).then((res) => {
                this.stations = res.data;
            });
        },
        query() {
            if (this.regValue.length !== 0) {
                this.form.regId = this.regValue[this.regValue.length - 1];
            } else {
                this.form.regId = '';
            }
            this.$parent.$refs.biaoge.queryList(this.form);
        },
        // 导出
        exportAssetStake(params) {
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
                if (item.property !== undefined) {
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
                exportData(seclectFormLine)
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
            this.regValue = '';
            this.state = '';
            this.$refs.treeSelect.valueTitle = '';
        }
    }
};
</script>
