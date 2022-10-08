<template>
    <div>
        <tree-select
            ref="treeSelect"
            :props="orgDefaultProps"
            :options="usersTreeData"
            clearable
            accordion
            @getValue="getValue($event)"
            height="200"
        />
    </div>
</template>
<script>
import { getUserTree } from '@/api/operBeijing/patrolTaskFormulation';
import { DICTDATA, getDict, translatorDict } from '@/api/dict';
import treeSelect from '@/components/treeSelect/nodeTree';
export default {
    components: { treeSelect },
    data() {
        return {
            usersTreeData: [],
            orgDefaultProps: {
                value: 'id',
                label: 'name',
                children: 'children'
            }
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // 用户树
            getUserTree().then((res) => {
                if (res.code === '000000') {
                    this.usersTreeData = res.data.children;
                }
            });
        },
        getValue(value) {
            let formInline = this.$parent.$parent.$parent.formInline;
            if (!!value) {
                if (!!value.serviceType) {
                    if (value.serviceType == 1) {
                        formInline.dispatchOrgId = value.id;
                        formInline.dispatchManId = '';
                    } else if (value.serviceType == 2) {
                        formInline.dispatchManId = value.id;
                        formInline.dispatchOrgId = '';
                    }
                }
            } else {
                formInline.dispatchOrgId = '';
                formInline.dispatchManId = '';
            }
        }
    }
};
</script>
<style lang="scss" scoped>
</style>