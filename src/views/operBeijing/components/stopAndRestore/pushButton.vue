<template>
    <div>
        <div>
            <el-button size="mini" class="newButtonColor listBTN" @click="stopApplication">停运申请</el-button>
            <el-button size="mini" class="newButtonColor listBTN" @click="startApplication" ref="startApplication">复运申请</el-button>
        </div>

        <!-- 弹出层 停复运  -->
        <dialog-stop ref="dialogStop" />
    </div>
</template>

<script>
// import axios from "axios";
import dialogStop from './dialogStop';
export default {
    components: {
        dialogStop
        // dialogRestore
    },
    data() {
        return {};
    },
    mounted() {},
    methods: {
        // 停运申请
        stopApplication() {
            let dialogStop = this.$refs.dialogStop;
            // dialogStop.isModify =false;
            dialogStop.signal = 0;
            dialogStop.formInline = {};
            dialogStop.dialogFormVisible = true;
        },
        // 复运申请
        startApplication() {
            let dialogStop = this.$refs.dialogStop;
            // dialogStop.isModify =false;
            dialogStop.signal = 1;
            dialogStop.formInline = {};
            dialogStop.dialogFormVisible = true;
        }
    }
};
</script>

<style lang="scss" scoped>
</style>