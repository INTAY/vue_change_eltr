<template>
    <div>
        <!-- 新增 弹出层 -->
        <el-dialog
            title="新增运维模块"
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            width="500px"
        >
            <el-form ref="form" :model="sizeForm" :rules="rule" label-width="80px" size="small">
                <el-form-item label="上级方案">
                    <span>{{ sizeForm.parentName }}</span>
                </el-form-item>

                <el-form-item label="方案名称" prop="libName">
                    <el-input v-model="sizeForm.libName" class="kz"></el-input>
                </el-form-item>

                <!-- <el-form-item label="排序">
          <el-input v-model="sizeForm.sortNo" class="kz"></el-input>
        </el-form-item> -->
                <el-form-item label="使用维度" v-if="sign==true" prop="inspType">
                    <el-radio v-model="sizeForm.inspType" label="1">站使用</el-radio>
                    <el-radio v-model="sizeForm.inspType" label="2">桩使用</el-radio>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-form-option">
                <el-button type="primary" class="btn-long" size="small" @click="add">确认</el-button>
                <el-button size="small" class="btn-long" @click="dialogFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { add, modify } from '@/api/system/inspectLib';
export default {
    data() {
        return {
            sign: true,
            dialogFormVisible: false,
            sizeForm: {
                inspType: '1',
            },
            rule: {
                libName: [
                    { required: true, message: '请输入方案名称', trigger: 'blur' },
                    {
                        min: 1,
                        max: 100,
                        message: '长度在 1 到 100 个字符',
                        trigger: 'blur'
                    }
                ],
                inspType: [{ required: true, message: '请选择使用维度', trigger: 'blur' }]
            }
        };
    },
    created() {},
    methods: {
        add() {
            let self = this;
            // 校验
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.sizeForm.id && this.sizeForm.id !== '') {
                        modify(this.sizeForm).then((res) => {
                            if (res.code === '000000' && res.data) {
                                this.$message({
                                    showClose: true,
                                    message: '修改成功！',
                                    type: 'success'
                                });
                                self.dialogFormVisible = false;
                                // 重新查询数据
                                this.$emit('getTreeTableData');
                            } else {
                                this.$message.error(res.mesg);
                            }
                        });
                    } else {
                        add(this.sizeForm).then((res) => {
                            if (res.code === '000000' && res.data) {
                                this.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                self.dialogFormVisible = false;
                                // 重新查询数据
                                this.$emit('getTreeTableData');
                            } else {
                                this.$message.error(res.mesg);
                            }
                        });
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.dialog-form-option {
    text-align: center;

    .btn-long {
        width: 120px;
    }
}
</style>