<template>
    <div>
        <crud-form
            :field-list="fieldList"
            :api="getQueryByPage"
            :exportFn="exportAssetSite"
            :queryParam="formInline"
            max-height="690"
            :tableOptionWidth="220"
            ref="crudForm"
        >
            <template slot="searchBar">
                <topform ref="topform" :queryParam="formInline" />
            </template>

            <template slot="tableTopOptionLeft">
                <erji ref="erji" />
            </template>
            <template slot="tableTopOptionRight">
                <excel-upload :import-url="importUrl" />
                <el-button class="newButtonColor listBTN" plain @click="downloadExcelTem">下载Excel模版</el-button>
            </template>

            <template slot="tableOption" slot-scope="scope">
                <el-button @click="detail(scope.row)" class="common-btn" size="mini">详情</el-button>
                <el-button @click="modify(scope.row)" class="common-btn" size="mini">修改</el-button>
                <el-button @click="remove(scope.row)" class="delete-btn" size="mini">删除</el-button>
            </template>
        </crud-form>
        <biaoge ref="biaoge" />
    </div>
</template>

<script>
import crudForm from '@/components/crudForm/index';
import biaoge from './components/site/biaoge';
import erji from './components/site/erji';
import topform from './components/site/topform';
import { sxqxzk } from '@/api/power/institution';
import { getOrgTree } from '@/api/property/garden';
import { getQueryByPage, exportStation, menuDelete } from '@/api/property/site';
import { DICTDATA, getDict, translatorDict } from '@/api/dict';
import excelUpload from '@/components/upload/excelUpload';
import request from '@/api/request';
import { stationUrl } from '@/utils/downloadTemUrls';

export default {
    data() {
        // 状态
        let statusFormat = (row) => {
            return translatorDict(DICTDATA.INFRASTRUCTURE_STATUS, Number(row.state));
        };
        // 状态
        let engTypeFormat = (row) => {
            return translatorDict(DICTDATA.ENERGY_TYPE, Number(row.engType));
        };
        // 站类型
        let siteTypeFormat = (row) => {
            return translatorDict(DICTDATA.SITE_TYPE, Number(row.staType));
        };
        // 建设场所
        let buildTypeFormat = (row) => {
            return translatorDict(DICTDATA.CONSTRUCTION_TYPE, Number(row.buildType));
        };
        // let formatDate = (row) => {
        //   return formatDateTime(row.fillTime);
        // };
        // // 行政区域
        return {
            buildType: [], //建设场所类型
            status: [], // 基础设施状态200
            type: [], // 站类型 220
            energyType: [], // 能源类型 221
            constructionType: [], //建设场所类型224
            orgTreeData: [],
            regTreeData: [], //区域数据
            formInline: {},
            getQueryByPage,
            fieldList: [
                { name: '编号', value: 'id' },
                { name: '站点名称', value: 'staName' },
                { name: '能源类型', value: 'engType', formatter: engTypeFormat },
                { name: '组织机构', value: 'orgName' },
                { name: '行政区域', value: 'regName' },
                { name: '状态', value: 'state', formatter: statusFormat },
                { name: '站点类型', value: 'staType', formatter: siteTypeFormat },
                { name: '建设场所', value: 'buildType', formatter: buildTypeFormat },
                { name: '所属台区', value: 'areaName' },
                { name: '所属园区', value: 'zoneName' },
                { name: '占地面积', value: 'floorArea' },
                { name: '地址', value: 'addr' },
                { name: '经度', value: 'lng' },
                { name: '纬度', value: 'lat' },
                { name: '配变容量', value: 'transCap' },
                { name: '营业时间', value: 'busHours' },
                { name: '联系人', value: 'link' },
                { name: '联系电话', value: 'tel' },
                { name: '服务电话', value: 'svrTel' },
                { name: '投运时间', value: 'optTime' },
                { name: '停车信息描述', value: 'parkInfo' },
                { name: '停车费用描述', value: 'parkFee' },
                { name: '充电费用描述', value: 'eleFee' },
                { name: '服务费用描述', value: 'svrFee' },
                { name: '支付方式描述', value: 'payment' }
            ],
            importUrl: ''
        };
    },
    components: { crudForm, topform, erji, biaoge, excelUpload },
    created() {
        this.init();
        this.importUrl = request.importExcelStationUrl();
        // 获取状态字典
        getDict(DICTDATA.INFRASTRUCTURE_STATUS).then((res) => {
            this.status = res;
        });
        getDict(DICTDATA.SITE_TYPE).then((res) => {
            this.type = res;
        });
        getDict(DICTDATA.ENERGY_TYPE).then((res) => {
            this.energyType = res;
        });
        getDict(DICTDATA.CONSTRUCTION_TYPE).then((res) => {
            this.constructionType = res;
        });
        getOrgTree().then((res) => {
            this.orgTreeData = res.data;
        });
    },
    methods: {
        init() {
            this.queryRegTree().then(() => {
                this.$refs.topform.setData();
                this.$refs.erji.setData();
                this.$refs.biaoge.setData();
            });
        },
        //下载excel 模版
        downloadExcelTem() {
            let a = document.createElement('a');
            a.href = stationUrl;
            a.click();
        },

        //详情
        /**
         * 查看详情
         */
        detail(row) {
            let biaoge = this.$refs.biaoge;
            biaoge.xiangqing = true;
            biaoge.form = JSON.parse(JSON.stringify(row));
            biaoge.form.state = translatorDict(DICTDATA.INFRASTRUCTURE_STATUS, Number(row.state));
            biaoge.form.staType = translatorDict(DICTDATA.SITE_TYPE, Number(row.staType));
            biaoge.form.engType = translatorDict(DICTDATA.ENERGY_TYPE, Number(row.engType));
            biaoge.form.buildType = translatorDict(DICTDATA.CONSTRUCTION_TYPE, Number(row.buildType));
        },

        // 修改
        modify(row) {
            let biaoge = this.$refs.biaoge;
            biaoge.sign = true;
            if (biaoge.checkValue != '') {
                biaoge.checkValue = '';
            }
            biaoge.form = JSON.parse(JSON.stringify(row));
            if (biaoge.form.picUrl) {
                biaoge.imageUrl = biaoge.form.picUrl;
            }
            biaoge.dialogFormVisible = true;
        },
        // 删除
        remove(row) {
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: ''
            }).then(() => {
                menuDelete(row.id)
                    .then((res) => {
                        if (res.code === '000000') {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.$refs.crudForm.getDataInit();
                        } else {
                            this.$message.error('删除失败');
                        }
                    })
                    .catch((err) => {
                        this.$message.error('删除失败');
                    });
            });
        },
        //地区数据查询，翻译使用
        queryRegTree() {
            return new Promise((resolve, reject) => {
                sxqxzk().then((res) => {
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
        },

        //导出
        exportAssetSite() {
            // this.$refs.crudForm.queryParam = this.$refs.topform.formInline;
            this.$refs.topform.formInline.headers = this.$refs.crudForm.exportData.headers;
            this.$refs.topform.formInline.values = this.$refs.crudForm.exportData.values;
            console.log(this.$refs.topform.formInline, '导出的数据');
            // this.$refs.crudForm.getDataInit();
            this.$confirm('确认导出吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: ''
            })
                .then(() => {
                    this.$message({
                        message: '正在导出，请稍候...',
                        type: 'info'
                    });
                    exportStation(this.$refs.topform.formInline).then((res) => {
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
                    });
                })
                .catch((err) => {
                    this.$message.error(res.data);
                });
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
.aniu {
    color: white !important;
    background: #006080 !important;
    width: 120px;
}
/deep/ .table-top-option-wrap {
    margin: 0 !important;
}
/deep/ .table-top-option-wrap .right {
    height: 30px;
    margin-top: 10px;
    margin-right: 15px;
}
</style>
