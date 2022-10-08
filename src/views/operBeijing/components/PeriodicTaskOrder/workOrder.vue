<template>
    <div class="workOrder">
        <el-container class="contanier">
            <div class="asideColor">
                <el-aside width="200px">
                    <el-menu class="asideMeun" text-color="#000" active-text-color="#1e7d9b">
                        <el-menu-item :index="i.toString()" v-for="(item, i) in itemtable" :key="i" @click="checkHandle(item, i)">
                            <i class="el-icon-d-arrow-right"></i>
                            <span slot="title">{{ item.libName }}</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
            </div>
            <el-main>
                <!-- 工单详情 -->
                <order-Detail v-show="ops.detailOrder" />
                <!-- 站巡视 -->
                <inspection-Site v-show="ops.inspectionSite" />
                <!-- 桩巡视 -->
                <inspection-Plie v-show="ops.inspectionPlie" />
            </el-main>
        </el-container>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import orderDetail from './workOrder/workOrderDetail'; //工单详情
import inspectionSite from './workOrder/inspectionSite'; //站巡视
import inspectionPlie from './workOrder/inspectionPlie'; //桩巡视
import { getOrderDetail, getSubContent, getChildDetail } from '@/api/operation/planTasks';
import { receiveInfo } from '@/api/platform/generalOverview';
import Bus from '@/components/bus.js';

export default {
    components: {
        orderDetail,
        inspectionSite,
        inspectionPlie,
    },
    data() {
        return {
            itemtable: [],
        };
    },
    computed: {
        //引用vuex
        ...mapState(['ops'])
    },
    mounted() {
        Bus.$on('ISTake',(e) =>{
            this.getOrderDetail(e);
        })
        
    },
    methods: {
        //引用vuex操作数据
        ...mapMutations(['set_detailOrder', 'set_checkOrderOther']),
        //  获取显示的菜单
        async getOrderDetail(id) {

            const { data: res } = await getOrderDetail(id);
            
            this.itemtable = res.inspectContentDetVos
            

        },
        //侧边栏操作
        checkHandle(...value) {
            this.getSubContent({id: value[0].id, inspType: value[0].inspType})
            this.set_detailOrder(true);
            //判断桩与其他的区别
            this.set_checkOrderOther(value[0].inspType);
            sessionStorage.setItem("isHasCheckItem",value[0].isHasCheckItem)
            
            
        },
        async getSubContent(data) {
            const { data: res } = await getSubContent(data);
            //判断是否有切换          
            Bus.$emit('set_orderDate',res)

        }
    }
};
</script>

<style lang="scss" scoped>
.workOrder {
    .contanier {
        .el-menu {
            border: none;
            background-color: #f6f6f6;
        }
        .asideColor {
            background-color: #f6f6f6;
        }
    }
}
.el-menu-item.is-active {
    background-color: #d7eaf0 !important;
}
</style>