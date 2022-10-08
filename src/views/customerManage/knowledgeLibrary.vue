<template>
    <el-row>
        <el-col :span="3">
            <!-- 结构树 -->
            <tree ref="tree"></tree>
        </el-col>
        <el-col :span="21">
            <!-- 查询条件 -->
            <search-bar ref="searchBar"></search-bar>
                <!-- 页面的主体 -->
                <main-content ref="content"></main-content>
        </el-col>
    </el-row>
</template>


<script>
    import tree from './components/tree';
    import searchBar from './components/searchBar';
    import mainContent from './components/mainContent';
    export default {
        data() {
            return {
            }
        },
        components: {
            tree,
            searchBar,
            mainContent
        },
    }
</script>

<style lang="scss" scoped>

</style>