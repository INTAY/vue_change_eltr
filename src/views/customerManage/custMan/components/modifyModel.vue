<template>
    <!-- 修改 -->
    <el-dialog title="修改" :visible.sync="modifyDialogVisible" width="50%">
        <div class="content-add-dialog">
            <el-form ref="form" :model="modifyMapSource" label-width="80px">
                <el-col :span="12">
                    <el-form-item label="类型">
                        <el-select v-model="modifyMapSource.region" style="width: 320px" placeholder="请选择">
                            <el-option label="问题" value="0"></el-option>
                            <el-option label="信息" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="标签">
                        <el-input v-model="modifyMapSource.name" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="标题">
                        <el-input v-model="modifyMapSource.name" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="解答">
                        <el-input type="textarea" v-model="modifyMapSource.desc" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
                
                <el-col :span="24">
                    <el-form-item v-if="modifyMapSource.region == 1" label="附件">
                        浏览
                        <span style="color: red">仅支持word、execl、pdf、jpg、png、gif、ceb</span>
                    </el-form-item>
                </el-col>
                <el-col :span="13" :offset="6">
                    <el-form-item>
                       <el-button class="bouncedHold btnSpace operate" size="mini" @click="add">确认</el-button>
                       <el-button size="mini" class="cancelBTN operate" @click="cancel">取消</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        data() {
            return {
                //  修改弹窗控制器
                modifyDialogVisible: true,
                //  修改数据集合
                modifyMapSource: {},
            }
        },
        props: {
            // propName: {
            //     type: Number,
            //     default: ''
            // },
        },
        methods: {
            cancel() {
                    
            },
            add() {
                
            }
        },
            
    }
</script>

<style lang="scss" scoped>
    .operate {
        width: 150px;
    }
</style>