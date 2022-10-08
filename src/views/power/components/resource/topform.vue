<template>
    <div class="search-form">
        <!-- 引入组织 -->
        <search ref="form" :form="form" :formData="formData" @handleChanges="handleC"> </search>
    </div>
</template>

<script>
import isNil from 'lodash/isNil';
import search from '@/components/searchBox/searchBox.vue';

export default {
    components: { search },
    data() {
        return {
            //表单的事项选择
            form: [
                {
                    label: '状态',
                    value: 'status',
                    type: 'select',
                    collapseTags: true,
                    multiple: true,
                    list: 'statusList',
                    required: true,
                    clearable: true
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
            formData: {}
        };
    },
    methods: {
        //表单的点击事件
        handleC(flag, val) {
            switch (flag) {
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
        search(val) {
            this.$parent.$parent.$parent.$refs.biaoge.parentId = ''; //清空id
            this.$parent.$parent.$parent.$refs.biaoge.url = val.url; //路径地址传送过去
            this.$parent.$parent.$parent.$refs.biaoge.name = val.name; //路径名称传送过去
            this.$parent.$parent.$parent.$refs.biaoge.query(); //重新刷新页面
        },
        reset() {
            this.formData = {}; //清空传输的数据
            this.$refs.form.$refs.form.clearValidate(); // 清空表单
        }
    }
};
</script>

<style lang="scss" scoped>
.el-form-item {
    margin-bottom: 0px;
}
.search-form {
    padding-top: 25px;
}
</style>
