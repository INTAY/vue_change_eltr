<template>
    <div class="oper_reco">
        <crud-form :field-list="fieldList" :showCheckbox="false" :api="getEcommissionPage" :queryParam="formInline" ref="crudForm">
            <template slot="searchBar">
                <el-form size="mini" :inline="true" :model="sear" ref="refform" class="ref_form">
                    <el-form-item label="通知类型" class="a">
                        <el-select size="mini" v-model="formInline.busType" placeholder="全部" class="xzk">
                            <el-option value>请选择</el-option>
                            <el-option v-for="item in sear.busType" :key="item.value" :value="item.value" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="通知时间">
                        <el-date-picker
                            v-model="formInline.value"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                            @change="timeQuantum"
                        ></el-date-picker>
                    </el-form-item>

                    <el-form-item label="处理状态" class="a">
                        <el-select size="mini" v-model="formInline.state" placeholder="全部" class="xzk">
                            <el-option value>请选择</el-option>
                            <el-option v-for="item in sear.state" :key="item.value" :value="item.value" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="search" class="newButtonColor SearchBTN">查询</el-button>
                        <el-button @click="rese" class="otherBTN SearchBTN">清空</el-button>
                    </el-form-item>
                </el-form>
            </template>

            <template slot="tableOption" slot-scope="{ index, row }">
                <el-button
                    @click="detail(row)"
                    size="mini"
                    :class="row.state == '0' ? 'buleBTN' : 'grayBTN'"
                    :disabled="!(row.state == 0)"
                    >{{ row.state == '0' ? '处理' : '已处理' }}</el-button
                >
            </template>
        </crud-form>
        <!--  -->

        <!-- 处理状态 -->
        <el-dialog :title="this.user.pathData.descr" :close-on-click-modal="false" :visible.sync="visible" :modal-append-to-body="false">
            <div v-for="(content, index) in openListValue" :key="index">
                <!-- component标签创建动态组件，is属性指向谁，就显示哪个组件 -->
                <div v-if="content.relPath == user.pathUrl">
                    <component
                        :key="content.index"
                        :is="content.component"
                        :ref="content.refName"
                        :refName="content.refName"
                        @visblie="parentFn"
                    ></component>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import crudForm from '@/components/crudForm/index';
import { getEcommissionPage } from '@/api/system/announcements';
import { DICTDATA, translatorDict, getDict } from '@/api/dict';
import { getRegNameByCode } from '@/utils/area';
import { mapState, mapMutations } from 'vuex';
import { openModules } from '@/config/index';

export default {
    components: {
        crudForm
    },
    watch: {
        value(a) {
            this.sear.chagStartDate = a[0];
            this.sear.chagEndDate = a[1];
        },
        isRun: {
            handler(val, oldVal) {
                this.tagSkipChanage(val); 
            },
            deep: false,
            immediate: true,
        },
        isChange: {
            handler(val, oldVal) {
                this.tagSkipChanage(); 
            },
            deep: false,
            immediate: true,
        },
    },

    data() {
        // 时间格式处理
        let formatterTime = (row) => {
            let sendTime = row.sendTime.split('.')[0].replace('T', ' ');
            return sendTime;
        };
        //字典码转换
        let formatterState = (row) => {
            return translatorDict(DICTDATA.WHETHER, Number(row.state));
        };
        let formatterDevType = (row) => {
            return translatorDict(DICTDATA.BUSINSS_TYPE, Number(row.busType));
        };
        return {
            openList: [],
            openListValue: [],
            sear: {
                id: '',
                busType: null,
                sendTime: null,
                state: []
            },
            isActive: true,
            value: '',
            pathUrl: 'system/about.vue',
            visible: false,
            serviceTypes: JSON.parse(localStorage.getItem('dict-103')),
            siteArr: [],
            formInline: {
                order: 'desc', //排序
                sortColumn: 'sendTime'
            },
            getEcommissionPage,
            fieldList: [
                {
                    name: '通知类型',
                    value: 'busType',
                    formatter: formatterDevType
                },
                {
                    name: '标题',
                    value: 'descr',
                    showOverflowTooltip: true
                },
                {
                    name: '通知时间',
                    value: 'sendTime',
                    formatter: formatterTime
                },
                {
                    name: '处理状态',
                    value: 'state',
                    formatter: formatterState
                }
            ],
        };
    },
    created() {
        this.init();
        this.set_isRun(false)
    },
    computed: {
        ...mapState(['user', 'ops']),
        //id变化的标识
        isChange() {
            return this.$store.state.ops.isChange;
        },
        //是否打开查询的节流阀
        isRun() {
            return this.$store.state.ops.isRun;
        },
    },
    methods: {
        ...mapMutations(['SET_PATHDATA', 'SET_PATHURL', 'set_isChange', 'set_isRun']),
        init() {
            // 设备状态202
            getDict(DICTDATA.WHETHER).then((res) => {
                this.sear.state = res;
            });
            getDict(DICTDATA.BUSINSS_TYPE).then((res) => {
                this.sear.busType = res;
            });
        },
        /**
         * 查询
         */
        search() {
            this.formInline.id = ''
            // 置空监听的id
            this.$parent.formInline = this.sear;
            this.$refs.crudForm.getDataInit();
        },
        //处理
        detail(row) {
            if (row.todoType === 2) {
                if (row.busType == 3) {
                    // 周期保养任务
                    this.$router.push({ path: '../operBeijing/PeriodicMaintenance/PeriodicTaskFormulation', query: { id: row.id } });
                }
                if (row.busType == 4) {
                    // 计划巡视任务
                    this.$router.push({ path: '../operBeijing/planToTour/planTasks', query: { id: row.id } });
                }
                if (row.busType == 5) {
                    // 停运申请
                    this.$router.push({ path: '../operBeijing/stopAndRestore', query: { id: row.id } });
                }
                if (row.busType == 6) {
                    // 复运申请
                    this.$router.push({ path: '../operBeijing/stopAndRestore', query: { id: row.id } });
                }
            } else {
                this.visible = true;
            }

            //传到带打开页面的数据
            this.SET_PATHDATA(row);
            //用于判断的数据
            this.SET_PATHURL(row.resPath);
            //所有审核的页面，实现配置好的
            this.openList = openModules()[0];
            this.openListValue = this.openList.modules;
        },
        //清空
        rese() {
            //清除查询条件
            this.formInline = {};
        },
        timeQuantum(e) {
            this.formInline.startTime = e[0];
            this.formInline.endTime = e[1];
        },
        //接受子组件传过来的值，关闭弹窗
        parentFn(payload) {
            this.visible = payload;
        },
        //跳转并单个查询
        tagSkipChanage(val) {
            if (val) {
                //先置空查询模块的所有数据
                this.formInline.busType = ''
                this.formInline.endTime = ''
                this.formInline.startTime = ''
                this.formInline.state =  ''
                //通过id查询
                this.formInline.id = this.ops.onBussin.id;
                this.$refs.crudForm.getDataInit();
                //关闭单个查询通道
                this.set_isRun(false);
                //清空id
                (this.formInline.id = ''),
                    //清空标识符id
                    this.set_isChange('');
                    this.formInline.value = []
            }
        }
    }
};
</script>

<style lang="scss" scoped>
</style>