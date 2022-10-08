<template>
    <div>
        <el-tree
            :key="treeKey"
            style="background-color:#f7f7f7;padding-left:10px;"
            :props="defaultProps"
            node-key="id"
            highlight-current
            accordion
            :expand-on-click-node="true"
            :default-expanded-keys="num"
            lazy
            ref="tree"
            :load="loadNode"
            @node-contextmenu="rightClick"
            @current-change="handleNodeClick"
        >
            <span
                slot-scope="{ node, data }"
                style="display: inline-block;width: 95%; position: relative;"
                @mouseenter="mouseenter(data)"
                @mouseleave="mouseleaves(data)"
            >
                <span>
                    <i
                    	 style="margin-right: 4px;"
                        v-if="node.expanded && node.childNodes.length==0"
                        class="el-icon-document-remove"
                    ></i>
                    <!--<i
                        v-if="node.expanded && node.childNodes.length>0"
                        class="el-icon-folder-opened"
                    ></i>-->
                    <i
                    	 style="margin-right: 4px;"
                        v-else-if="data.children!=null && data.children.length==0"
                        class="el-icon-document-remove"
                    ></i>
                    <i style="margin-right: 4px;" v-else class="el-icon-folder"></i>
                    <span>{{node.label}}</span>
                    <span
                        v-if="data.isShow"
                        style="position:absolute;right:5px;height:100%;vertical-align:middle;"
                    >
                        <!--//阻止事件-->
                        <el-button
                            @click.prevent.stop="() => moves(1,node,data)"
                            size="mini"
                            icon="el-icon-bottom"
                            circle
                            class="bouncedHold"
                            style="padding:2px;"
                        ></el-button>
                        <el-button
                            @click.prevent.stop="() => moves(2,node,data)"
                            size="mini"
                            icon="el-icon-top"
                            circle
                            class="bouncedHold"
                            style="padding:2px;margin-left:3px;"
                        ></el-button>
                    </span>
                </span>
            </span>
        </el-tree>
        <div
            style="position: fixed;z-index: 999; cursor:pointer;"
            v-bind:style="{left: rightmenuleft+'px', top: rightmenutop+'px'}"
            v-show="rightMenuVisible"
            @mouseleave="rightMenuVisible=false"
        >
            <el-menu @select="handleRightMenuSel" class="selfMenu">
                <el-menu-item index="1" class="menuItem">刷新</el-menu-item>
            </el-menu>
        </div>
    </div>
</template>
<script>
import { getChildren, getResTree, xiuGai } from '@/api/power/resource';
import { findTreeId } from '@/utils/validate';
import _sortBy from 'lodash/sortBy';

export default {
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            nodes:null,
            resolves:null,
            treeKey: '',
            treeData: [],
            num: ['-1'],
            rightMenuVisible: false,
            rightMenuSelNode: null,
            rightmenuleft: 0,
            rightmenutop: 0
        };
    },
    created() {
        getResTree().then((res) => {
            this.treeData = res.data;
        });
    },
    mounted() {},
    methods: {
        mouseenter(data) {
            if (data.type == '1' || data.type == '2') {
                this.$set(data, 'isShow', true);
            }
        },
        // 鼠标移出
        mouseleaves(data) {
            this.$set(data, 'isShow', false);
        },
        moves(type, node, data) {
            let datas = [];
            let params = data.parentId;
            getChildren(params).then((res) => {
                datas = res.data.sort(function (a, b) {
                    return a.orderNum - b.orderNum;
                });
                //1是下  2是上
                if (type == '1') {
                    if (data.id == datas[datas.length - 1].id) {
                    } else {

                        let index_ = datas.findIndex((item) => item.name === data.name);
                        let jsonData = JSON.parse(JSON.stringify(datas));
                        let params_1 = jsonData[index_];
                        let params_2 = jsonData[index_ + 1];
                        params_1.orderNum = datas[index_ + 1].orderNum;
                        params_2.orderNum = datas[index_].orderNum;
                        //请求交换
                        xiuGai(params_1).then((res) => {
                            xiuGai(params_2).then((res) => {});
                            getChildren(params).then((res) => {
                                datas = res.data.sort(function (a, b) {
                                    return a.orderNum - b.orderNum;
                                });
                            });
                            this.treeKey = +new Date();
                            this.num = ['-1'].concat(findTreeId(this.treeData, data.id)); //打开上次的节点
                        });
                    }
                } else if (type == '2') {
                    if (data.id == datas[0].id) {
                    } else {
                        let index_ = datas.findIndex((item) => item.name === data.name);
                        let jsonData = JSON.parse(JSON.stringify(datas));
                        let params_1 = jsonData[index_];
                        let params_2 = jsonData[index_ - 1];
                        params_1.orderNum = datas[index_ - 1].orderNum;
                        params_2.orderNum = datas[index_].orderNum;
                        //请求交换
                        xiuGai(params_1).then((res) => {
                            xiuGai(params_2).then((res) => {});
                            getChildren(params).then((res) => {
                                datas = res.data.sort(function (a, b) {
                                    return a.orderNum - b.orderNum;
                                });
                            });
                            this.treeKey = +new Date();
                            this.num = ['-1'].concat(findTreeId(this.treeData, data.id)); //打开上次的节点
                        }); //交换
                    }
                }
            });
        },
        handleNodeClick(data, Node, element) {
        	this.nodes = Node;
            this.num = ['-1'].concat(findTreeId(this.treeData, data.id));
            this.$parent.$parent.$parent.$refs.biaoge.currentPage = 1;
            this.$parent.$parent.$parent.$refs.biaoge.parentId = data.id;
            this.$parent.$parent.$parent.$refs.biaoge.query();
            this.$emit('treeNodeClick', null, data.id, data.type);
        },
        loadNode(node = null, resolve = null) {
            if (node.level === 0) {
                return resolve([{ id: '-1', name: '资源管理', type: 0 }]);
            }
            var parentId = '-1';
            if (node.data == undefined) {
                parentId = '-1';
            } else {
                parentId = node.data.id;
            }
            getChildren(parentId).then((res) => {
                var childrendDta = [];
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].type != 3) {
                        //类型3按钮不显示
                        childrendDta.push(res.data[i]);
                    }
                }
                //排序
                var childrendDta = _sortBy(childrendDta, function (item) {
                    return item.orderNum;
                });

                if (resolve) {
                    resolve(childrendDta); //动态加载时
                } else {
                    //更新节点时：
                    node.childNodes = [];
                    node.doCreateChildren(childrendDta);
                    this.resolves = resolve;
                }
            });
        },
        sortClick(type, node, data) {
            var sortdata = [];
            if (type === 1) {
                sortdata = _sortBy(node.childNodes, function (item) {
                    return item.data.orderNum;
                });
            } else {
                sortdata = _sortBy(node.childNodes, function (item) {
                    return -item.data.orderNum;
                });
            }

            var newdata = [];
            for (var i = 0; i < sortdata.length; i++) {
                newdata.push(sortdata[i].data);
            }
            this.$refs.tree.updateKeyChildren(data.id, newdata);
        },
        //右键点击
        rightClick(MouseEvent, data, Node, element) {
            this.rightMenuSelNode = Node;
            this.rightmenutop = MouseEvent.clientY - 25;
            this.rightmenuleft = MouseEvent.clientX - 10;
            this.rightMenuVisible = true;
        },
        //弹出菜单选项
        rest(){
        	this.loadNode(this.nodes,this.resolves)
        },
        handleRightMenuSel() {
            this.rightMenuVisible = false;
            this.loadNode(this.rightMenuSelNode)
        }
    }
};
</script>
<style>
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
