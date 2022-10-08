<template>
  <div>
    <div class="s">
      <el-button size="mini" class="newButtonColor listBTN" @click="confirmMethod">维修确认</el-button>
      <el-button size="mini" class="BatchDeleteColor listBTN" @click="batchDelete">批量报废</el-button>
    </div>
  </div>
</template>

<script>
    import {
        batchScrapSpare,
        batchUpdateOk
    } from '../../../../api/operation/oldPartsLibrary'

    export default {
        data() {
            return {

            }
        },
        methods: {
            confirmMethod() {
                let multipleSelection = this.$parent.$refs.formTable.multipleSelection;
                if (multipleSelection.length === 0) {
                    this.$message({
                        message: "请选择要维修的数据！",
                        type: "warning"
                    });
                } else {
                    this.$confirm("确定要维修吗?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        let ids = [];
                        for (let i in multipleSelection) {
                            ids.push(multipleSelection[i].id);
                        }
                        batchUpdateOk(ids).then(res => {
                            if (res.code === "000000" && res.data) {
                                this.$message({
                                    showClose: true,
                                    message: "维修成功！",
                                    type: "success"
                                });

                                // 重新查询数据
                                this.$parent.$refs.formTable.queryPage({
                                    current: 1
                                });
                            } else {
                                this.$message({
                                    message: `维修失败，${res.data}`,
                                    type: "warning"
                                });
                            }
                        });
                    });
                }
            },
            batchDelete() {
                let multipleSelection = this.$parent.$refs.formTable.multipleSelection;
                if (multipleSelection.length === 0) {
                    this.$message({
                        message: "请选择要报废的数据！",
                        type: "warning"
                    });
                } else {
                    this.$confirm("确定要报废吗?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        let SpareInfoScrapForm = {}
                        let ids = [];
                        for (let i in multipleSelection) {
                            ids.push(multipleSelection[i].id);
                        }
                        SpareInfoScrapForm.ids = ids
                        SpareInfoScrapForm.scrapDesc = multipleSelection[0].scrapDesc
                        batchScrapSpare(SpareInfoScrapForm).then(res => {
                            if (res.code === "000000" && res.data) {
                                this.$message({
                                    showClose: true,
                                    message: "报废成功！",
                                    type: "success"
                                });

                                // 重新查询数据
                                this.$parent.$refs.formTable.queryPage({
                                    current: 1
                                });
                            } else {
                                this.$message({
                                    message: `报废失败，${res.data}`,
                                    type: "warning"
                                });
                            }
                        });
                    });
                }
            },
        },
        mounted() {

        }
    };
</script>

<style lang="scss" scoped>
    .s {
        padding: 15px 40px;
        .push {
            color: white;
            background: #006080;
            width: 120px;
        }
    }
</style>
