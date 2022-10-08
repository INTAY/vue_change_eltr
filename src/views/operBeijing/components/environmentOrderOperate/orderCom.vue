<template>
    <div class="workOrder">
        <el-container class="contanier">
            <el-aside width="151px">
                <el-menu class="asideMeun">
                    <template v-for="(item,index) in menuMap" >
                        <el-menu-item :index="index.toString()" :key="item.id" @click="pushMenuIndex(item,index)">
                            <i class="el-icon-d-arrow-right"></i>
                            <span slot="title">{{item.libName}}</span> 
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-aside>
            <el-main>
                <!-- 详情 -->
                <detail v-show="showNo==0" ref="detail"/>
                <!-- 除桩和配电箱都显示这个 -->
                <station v-show="showNo==1" ref="station" :receiveInfo="propModelData"/>
                <!-- 桩巡视 -->
                <facility v-show="showNo==2" ref="facility" :receiveInfo="propModelData" :receiveChildModel="subContentVos"/>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import station from './components/station.vue';
import facility from './components/facility.vue';
import detail from './components/detail.vue';
import Bus from '../../../../../src/components/bus.js';
import { getOrderDetail, getSubContent, getChildDetail } from '@/api/operation/planTasks';
import { receiveInfo } from '@/api/platform/generalOverview';

export default {
    components: {
        station,
        facility,
        detail
    },
    data () {
        return {
            menuIndex: 0,
            menuMap: [],
            propModelData: [],  //  这是需要传给对应子模块的详情数据
            subContentVos: [],  //  桩巡视子模块的头
            showNo: 0,   //  展示哪一块详情
        }
    },
    props: ["currentIndex"],
    watch: {
        currentIndex(newVal) {
            this.showNo = newVal
        }
    },
    //  得到工单id
    created() {
        Bus.$on('sendOrderId', (data) => {
            this.getOrderDetail(data);
        });
    },
    methods: {
        //  通过点击左侧菜单，显示详情
        pushMenuIndex(row, index) {
            this.getSubContent({id: row.id, inspType: row.inspType})
            //  到站
            if(row.inspType == 1) {
                this.showNo = 1
            }else {
                //  到桩
                this.showNo = 2
            }
            this.$emit('listenEvent', this.showNo)
        },
        
        //  点击主模块获取子模块详情
        async getSubContent(data) {
            const { data: res } = await getSubContent(data);
            //  桩巡视
            if(this.showNo == 2) {
                for (const i in res.inspectStakeVos) {
                    res.inspectStakeVos[i].displate = false;
                }
                this.propModelData = res.inspectStakeVos  
                return
            }else {
                this.propModelData = res.inspectStationVos[0] //  

            }
        },
        //  获取显示的菜单
        async getOrderDetail(id) {
            const { data: res } = await getOrderDetail(id);
            this.menuMap = res.inspectContentDetVos
        },
    },
};
</script>

<style lang="scss" scoped>
.workOrder {
    border: 1px solid #dfe4ed;
    .contanier {
        .el-main {
            padding: 20px 15px 15px 15px;
        }
        .el-aside {
            background-color: #f6f6f6;
            border-right: 1px solid #dfe4ed;
        }
        .el-menu {
            background-color: #f6f6f6;
            border: none;
        }
        .el-menu-item {
            height: 34px;
            line-height: 30px;
            color: #606266;
            font-size: 13.5px;
        }
        .el-icon-d-arrow-right {
            font-size: 13.5px;
        }
        .el-menu-item.is-active {
            background-color: #e7f5f9 !important;
            color: #1396c2 !important;
        }
    }
}
</style>