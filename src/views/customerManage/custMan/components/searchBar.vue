<template>
    <div class="box">
        <el-form :inline="true" class="demo-form-inline" :model="formInline" label-width="80px">
            <el-form-item label="标签">
                <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.labels" clearable></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker size="mini" v-model="formInline.createdTime" type="date" placeholder="选择日期"> </el-date-picker>
            </el-form-item>
            <el-form-item label="创建人">
                <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.createdBy" clearable></el-input>
            </el-form-item>
            <el-form-item label="标题">
                <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.title" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" class="newButtonColor btnSpace SearchBTN" @click="queryMap">查询</el-button>
                <el-button size="mini" @click="formInline = {}" class="SearchBTN cancelBTN">清空</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    // import {  } from "@/api/customerService/knowledgeLibrary";
    import moment from 'moment'
    export default {
        data() {
            return {
                formInline: {
                    labels: '',
                    createdTime: '',
                    createdBy: '',
                    title: '',
                    type: 1,  //  1信息  2问题
                },
                switchWith: 1, //  获取当前展示那个模块
                question: null,  //  问题模块
                info: null,  //  信息
            }
        },
        mounted() {
            this.switchWith = this.$parent.$parent.$parent.$refs.content.activeSwitch
            this.question = this.$parent.$parent.$parent.$refs.content.$refs.question
            this.info = this.$parent.$parent.$parent.$refs.content.$refs.info
                //  1 信息，2问题
            this.queryMap()
        },
        methods: {
            queryMap() {
                console.log(this.$parent.$parent.$parent.$refs.tree.parentId)
                console.log(this.formInline)
                //  判断当前选择的模块是哪个，然后去查哪里的数据
                if(this.switchWith ==1) {
                    this.info.queryData({
                        labels: this.formInline.labels,
                        createdTime: this.formInline.createdTime ? moment(this.formInline.createdTime).format('YYYY-MM-DD') : '',
                        createdBy: this.formInline.createdBy,
                        title: this.formInline.title,
                        knowledgeTypeId: this.$parent.$parent.$parent.$refs.tree.parentId||'-1',
                        type: 1
                    })
                }else {
                    this.question.queryData({
                        labels: this.formInline.labels,
                        createdTime: moment(this.formInline.createdTime).format('YYYY-MM-DD'),
                        createdBy: this.formInline.createdBy,
                        title: this.formInline.title,
                        knowledgeTypeId: this.$parent.$parent.$parent.$refs.tree.parentId||'-1',
                        type: 2
                    })
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
.box {
    padding: 20px 10px 10px 10px;
    background-color: #F3F3F3;
    border-top: 1px solid #D3D3D3;
    .inputWidth {
        width: 170px;
    }
    .searchColor {
        //查询按钮的背景颜色和字体颜色
        background-color: #006080;
        color: #fff;
    }
    .emptyColor {
        //清空按钮字体颜色
        color: #006080;
    }
}
</style>