<template>
    <div>
        <el-input placeholder="请输入文字" v-model="filterText1" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <div class="tree-wrap">
            <el-tree
                ref="tree"
                :data="treeData"
                default-expand-all
                node-key="id"
                current-node-key="-1"
                :expand-on-click-node="false"
                :props="defaultProps"
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
                :highlight-current="true"
            >
                <span class="span-ellipsis" slot-scope="{ node }">
                    <span :title="node.label">{{ node.label }}</span>
                </span>
            </el-tree>
        </div>
    </div>
</template>
<script>
import { getTree } from '@/api/customerService/knowledgeLibrary';
export default {
    data() {
        return {
            filterText1: '',
            defaultProps: {
                children: 'children',
                label: 'knowledgeTypeDesc'
            },
            treeData: [],
            parentId: ''
        };
    },
    mounted() {
        this.getInspectLibTree();
    },
    watch:{
        filterText1(val) {
        console.log(val,'过滤');
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.knowledgeTypeDesc.indexOf(value) !== -1;
        },
        handleNodeClick(data) {
            console.log(data, '--------------');
            this.parentId = data.id;
            let question = this.$parent.$parent.$parent.$refs.content.$refs.question,
                info = this.$parent.$parent.$parent.$refs.content.$refs.info,
                switchAt = this.$parent.$parent.$parent.$refs.content.activeSwitch;
            if (switchAt == 1) {
                info.queryData({
                    knowledgeTypeId: data.id,
                    type: 1
                });
            } else {
                question.queryData({
                    knowledgeTypeId: data.id,
                    type: 2
                });
            }

        },
        getInspectLibTree() {
            getTree().then((res) => {
                if (res.code == '000000') {
                    this.treeData = [res.data];
                    // console.log(this.treeData, '=======')
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.selfMenu {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.menuItem {
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    user-select: none;
}
</style>
