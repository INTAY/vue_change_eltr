<template>
    <div class="default-class">
        <div class="list">
            <fill-bar ref="fillBar" />
            <form-table ref="formTable" />
            <pag-module style="position: fixed;bottom: 0px;" ref="pageModule" />
        </div>
    </div>
</template>

<script>
import fillBar from './components/fillBar'; //引入formInput框栏
import formTable from './components/formTable'; // 引入form表格
import pagModule from './components/pagModule'; // 引入分页模块
import moment from "moment";

export default {
    components: {
        fillBar, // fromInput框
        formTable, // form表格
        pagModule //分页模块
    },
    data() {
        return {
            regTreeData: [],
            nowDate: moment().locale('zh-cn').format('YYYY-MM-DD')
        };
    },
    mounted() {
        //  只有在不是路由跳转过来的时候才初始化查询
        if(Object.values(this.$route.params).length==0) {
            this.$refs.formTable.queryPage(
                {
                    pushStart: this.nowDate,
                    pushEnd: this.nowDate,
                    sortCol: 'push_time',
                    sortType: -1
                }
            );
        }
    },
    methods: {
        onSubmit() {},
        empty() {}
    }
};
</script>

<style lang="scss" scoped>
.default-class {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
</style>
