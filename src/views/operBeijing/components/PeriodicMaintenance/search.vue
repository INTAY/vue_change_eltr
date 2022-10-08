<template>
    <div>
        <!-- 引入组织 -->
        <search ref="form" :form="form" :formData="formData" :listTypeInfo="listTypeInfo" @handleChanges="handleC"> </search>
    </div>
</template>

<script>
import search from '@/components/searchBox/searchBox.vue'; //引入搜索栏
import { queryStationByRegAndName, region } from '@/api/operation/stopAndRestore';
import { getOperationTreeTaske } from '@/api/commonApi'; //处理部门接口查询
import { DICTDATA, getDict, translatorDict } from '@/api/dict';

export default {
    components: { search },
    data() {
        return {
            listTypeInfo: {  //(这里面的字段要和form中list的字段名称一样)
                regIdList: [], // 区县数据
                staIdLIst: [], //站点名称数据
                orgIdList: [], //处理部门数据
                stateList: [], //任务状态数据
                evnetStatusList: []  //车联网状态数据
            },

            //表单的事项选择
            form: [
                {
                    label: '区县',
                    value: 'regId',
                    type: 'select',
                    prop: 'regId',
                    list: 'regIdList'
                },
                {
                    label: '站点名称',
                    value: 'staId',
                    type: 'select',
                    prop: 'staId',
                    list: 'staIdLIst' 
                },
                {
                    label: '任务名称',
                    value: 'taskName',
                    type: 'input',
                    prop: 'taskName'
                },
                {
                    label: '任务编号',
                    value: 'id',
                    type: 'input',
                    prop: 'id'
                },
                {
                    label: '处理部门',
                    value: 'orgId',
                    type: 'select',
                    prop: 'orgId',
                    list: 'orgIdList'
                },
                {
                    show: 'datePicker',
                    label: '任务制定时间',
                    value: 'getTime',
                    type: 'daterange',
                    prop: 'getTime'
                },
                {
                    label: '任务状态',
                    value: 'state',
                    type: 'select',
                    prop: 'state',
                    list: 'stateList'
                },
                {
                    label: '车联网状态',
                    value: 'evnetStatus',
                    type: 'select',
                    list: 'evnetStatusList',
                    prop: 'evnetStatus'
                },
                {
                    tag: '查询',
                    value: 'search',
                    type: 'button',
                    className: 'newButtonColor SearchBTN'
                },
                {
                    tag: '清除',
                    value: 'cancel',
                    type: 'button'
                }
            ],
            //表单数据选择
            formData: {
                taskType: 3
            }
        };
    },
    created() {
        //任务状态
        getDict(DICTDATA.TASK_XS).then((res) => {
            // 先清空，防止状态叠加
            this.listTypeInfo.stateList = [];
            //赋值
            for (let i = 0; i < res.length; i++) {
                this.listTypeInfo.stateList.push({
                    id: res[i].value,
                    name: res[i].name
                });
            }
        });
        //车联网状态
        getDict(DICTDATA.CAR_INTERNET_STATUS).then((res) => {
            // 先清空，防止状态叠加
            this.listTypeInfo.evnetStatusList = [];
            //赋值
            for (let i = 0; i < res.length; i++) {
                this.listTypeInfo.evnetStatusList.push({
                    id: res[i].value,
                    name: res[i].name
                });
            }
        });

        if (!!this.$route.query.id) {
            this.formData.id = this.$route.query.id;
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        //组件触发事件
        handleC(flag, val) {
            switch (flag) {
                case 'regId': //区县联动站点
                    this.queryByCondition(val);
                    break;
                case 'getTime': //赋值时间
                    this.disposeTime(val);
                    break;
                case 'search': //搜索按钮
                    this.search(this.formData);
                    break;
                case 'cancel': //清空按钮
                    this.reset();
                    break;
                default:
                    break;
            }
        },
        async init() {
            //进来先清空数据
            this.listTypeInfo.regIdList = [];
            this.listTypeInfo.orgIdList = [];
            //  获取区域信息(区县)
            region(sessionStorage.getItem('regId')).then((res) => {
                if (res.code == '000000') {
                    this.listTypeInfo.regIdList = res.data;
                    this.listTypeInfo.staIdLIst = [];
                }
            });
            //处理部门
            const res = await getOperationTreeTaske(3);
            this.listTypeInfo.orgIdList = res.data;
        },
        // 根据区域查站点
        queryByCondition(arg) {
            this.listTypeInfo.staIdLIst = [];
            let params = { regId: arg, stationName: '' };
            queryStationByRegAndName(params).then((res) => {
                if (res.code == '000000') {
                    //站点名称赋值
                    for (let i = 0; i < res.data.records.length; i++) {
                        this.listTypeInfo.staIdLIst.push({
                            id: res.data.records[i].stationId,
                            name: res.data.records[i].stationName
                        });
                    }
                }
            });
        },
        //时间处理
        disposeTime(val) {
            this.formData.startTime = val[0];
            this.formData.endTime = val[1];
        },
        //查询
        search(val) {
            this.$parent.$parent.formInline = this.formData;
            this.$nextTick(() => {
                this.$parent.getDataInit();
            });
        },
        //清空
        reset() {
            //清空查询条件
            this.formData = {};
            //查询分类的重新赋值
            this.formData.taskType = 3;
            this.formData.order = 'desc';
            this.formData.sortColumn = 'created_time';
        }
    }
};
</script>

<style>
</style>