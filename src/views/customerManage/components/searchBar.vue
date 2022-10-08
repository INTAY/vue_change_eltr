<template>
    <div class="box">
        <el-form :inline="true" class="demo-form-inline" :model="formInline" label-width="80px">
            <el-form-item label="标签">
                <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.stakeNo" clearable></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker size="mini" class="picker-width" v-model="formInline.getTime"  type="daterange"  range-separator="至"  start-placeholder="开始时间"  end-placeholder="结束时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="创建人">
                <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.stakeNo" clearable></el-input>
            </el-form-item>
            <el-form-item label="标题">
                <el-input size="mini" placeholder="请输入" class="inputWidth" v-model="formInline.stakeNo" clearable></el-input>
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
    export default {
        data() {
            return {
                formInline: {}
            }
        },
        methods: {
            queryMap() {

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