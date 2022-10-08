<template>
    <div class="tree dict_tree">
        <el-input prefix-icon="el-icon-search" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-divider style="height: auto" />
        <el-tree
        	:key="treeKey"
            :props="props"
            :load="loadNode"
            node-key="id"
            lazy
            :default-expanded-keys="num"
            :filter-node-method="filterNode"
            ref="tree"
            style="background-color: #fafafa; margin-top: -10px"
            @node-click="handleNodeClick2"
            @current-change="handleNodeClick"
            :expand-on-click-node="false"
            accordion
        >
        <span slot-scope="{ node, data }"
        	style="display: inline-block;width: 95%; position: relative;"
      		@mouseenter="mouseenter(data)"
            @mouseleave="mouseleave(data)">
        <span>
          <span>{{node.label}}</span>
          <span v-if="data.isShow" style="position:absolute;right:15px;height:100%;vertical-align:middle;">
          	<!--//阻止事件-->
            <el-button @click.prevent.stop="() => nodeUp(node,data)" size="mini" icon="el-icon-top" circle class="bouncedHold" style="padding:2px;"></el-button>
            <el-button @click.prevent.stop="() => nodeDown(node,data)" size="mini" icon="el-icon-bottom" circle class="bouncedHold" style="padding:2px;margin-left:3px;"></el-button>
          </span>
        </span>
      </span>
      
            <!--<span
                slot-scope="{node, data }"
                class="custom-tree-node"
                @mouseenter="mouseenter(data)"
                @mouseleave="mouseleave(data)"
            >
                <span @mouseenter="mouseenter(data)">
                    <i :class="node.icon" />
                    {{node.label}}
                </span>
                <span class="el-ic">
                    <i
                        v-show="data.isShow"
                        size="mini"
                        style="padding:2px;margin-left:5px;margin-top: 15%"
                        @click="() => nodeUp(node,data)"
                        class="tagClass"
                    >
                        <el-image :src="imgUp" />
                    </i>
                    <i
                        v-show="data.isShow"
                        size="mini"
                        style="padding:2px; "
                        @click="() => nodeDown(node,data)"
                    >
                        <el-image :src="imgDown" />
                    </i>
                </span>
            </span>-->
        
        </el-tree>
        <el-dialog :visible.sync="modifyWin">
            <el-menu>
                <el-menu-item>
                    <span slot="title">添加分类</span>
                </el-menu-item>
            </el-menu>
        </el-dialog>
    </div>
</template>
<script>
import { treelb, findByParentId, getPicValue, xiuGai, cx } from '../../../../api/system/dict';
import imgUp from '../../../../assets/image/arrow_up.png';
import imgDown from '../../../../assets/image/arrow_down.png';
import _sortBy from 'lodash/sortBy';

export default {
    data() {
        return {
        	num:['-1'],
            modifyWin: false,
            filterText: '',
            params: {},
            props: {
                label: 'name',
                children: 'zones',
                isLeaf: 'leaf'
            },
            imgUp: imgUp,
            imgDown: imgDown,
            tree_key: 0,
            nodes: null,
            resolve: [],
            scrollTop_:"",
            treeKey:''
        };
    },
    created() {
        this.getTreeTable(); //页面加载时请求列表数据渲染接口
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
    	rest(){
    		this.loadNode(this.nodes,this.resolve)
    	},
    	rests(){
    		let that = this;
    		this.treeKey = +new Date();
    		
    		setTimeout(function(){
    			that.$parent.$refs.treeScr.scrollTop = that.scrollTop_;
    		},1200)
    		
    	},
        //懒加载
        loadNode(node, resolve) {
            if (node.level == 0) { 
                this.params.value = '-1';
                getPicValue(this.params).then((res) => {
                    return resolve([res.data]);
                });this.resolve = resolve;
            }
            // 加载tree的二级节点
            if (node.level == 1) {
                    this.params.value = node.key;
                    findByParentId(this.params).then((res) => {
                        let childrendDta = [];
		                for (var i = 0; i < res.data.length; i++) {
		                        childrendDta.push(res.data[i]);
		                }
		                //排序
		                childrendDta = _sortBy(childrendDta, function (item) {
		                    return item.orderNum;
		                });
		                if (resolve) {
		                	this.resolve = resolve;
		                    resolve(childrendDta); //动态加载时
		                } else {
		                    //更新节点时：
		                    node.childNodes = [];
		                    node.doCreateChildren(childrendDta);
		                    this.resolve = resolve;
		                }
                    });
            }
            // 加载tree的三级以及大于三的节点
            if (node.level > 1) {
                    this.params.value = node.data.value;
                    findByParentId(this.params).then((res) => {
                        let childrendDta = [];
		                for (var i = 0; i < res.data.length; i++) {
		                        childrendDta.push(res.data[i]);
		                }
		                //排序
		                childrendDta = _sortBy(childrendDta, function (item) {
		                    return item.orderNum;
		                });
		                if (resolve) {
		                    resolve(childrendDta); //动态加载时
		                    this.resolve = resolve;
		                } else {
		                    //更新节点时：
		                    node.childNodes = [];
		                    node.doCreateChildren(childrendDta);
		                    this.resolve = resolve;
		                }
                    });
            }
        },
        filterNode(value, data) {
            if (!value) {
                return true;
            }
            
            if(isNaN(Number(value))){
            	if (data.name != null) {
	                return data.name.indexOf(value) !== -1;
	            }
            }else{
            	if (data.value != null) {
	                return data.value == value;
	            }
            }
            	
        		
            
            
            
        },
        getTreeTable() {
            treelb()
                .then((res) => {
                    this.data = [res.data];
                })
                .catch((err) => {

                });
        },
        handleNodeClick2(data,Node=null){
	      	this.nodes = Node;
	      },
        handleNodeClick(data,Node) {
        	if (Node) {
        		this.nodes = Node;
        	}else{
        		this.nodes = null;
        	}
        	this.$parent.$refs.erji.ids = data.value;
        	this.scrollTop_ = this.$parent.$refs.treeScr.scrollTop;
        	if (data.id == '-1') {
        		this.num = ['-1']
        	}else{
        		this.num = ['-1',data.id]
        	}
            var params = {};
            this.$parent.$refs.tf.formInline = data;
            params.parentId = data.value;
            cx(params).then((res) => {
                // console.log(res);
                this.$parent.$refs.biaoge.tableData = res.data.records;
                this.$parent.$refs.biaoge.currentPage = res.data.current;
                this.$parent.$refs.biaoge.pageData.pageSize = res.data.size;
                this.$parent.$refs.biaoge.pageData.total = res.data.total;
            });
        },
        // 鼠标移入
        mouseenter(data) {
            if (data.name.indexOf('字典') !== -1) {
                this.$set(data, 'isShow', false);
            } else {
                this.$set(data, 'isShow', true);
            }
        },
        // 鼠标移出
        mouseleave(data) {
            this.$set(data, 'isShow', false);
        },
        // 上移
        nodeUp(node, data) {
        	this.scrollTop_ = this.$parent.$refs.treeScr.scrollTop;
            if (data.sortNo === 1) {
                this.$message.error('该节点排序序号为1，不可上移');
                return false;
            }
            xiuGai({
                id: data.id,
                sortNo: node.previousSibling.data.sortNo,
                name: data.name,
                parentId: data.parentId,
                value: data.value,
                remark: data.remark
            }).then((res) => {
                this.$message.success('上移成功！');
            });
            // node.previousSibling.data当前节点前一个节点的数据
            xiuGai({
                id: node.previousSibling.data.id,
                sortNo: data.sortNo,
                name: node.previousSibling.data.name,
                parentId: node.previousSibling.data.parentId,
                value: node.previousSibling.data.value,
                remark: node.previousSibling.data.remark
            }).then((res) => {
                this.rests()
            });
        },
        //下移
        nodeDown(node, data) {
        	this.scrollTop_ = this.$parent.$refs.treeScr.scrollTop;
            if (node.nextSibling.data === undefined) {
                this.$message.error('该节点为最后的节点，不可下移');
                return false;
            }
            xiuGai({
                id: data.id,
                sortNo: node.nextSibling.data.sortNo,
                name: data.name,
                parentId: data.parentId,
                value: data.value,
                remark: data.remark
            }).then((res) => {
                this.$message.success('下移成功！');
            });
            xiuGai({
                id: node.nextSibling.data.id,
                sortNo: data.sortNo,
                name: node.nextSibling.data.name,
                parentId: node.nextSibling.data.parentId,
                value: node.nextSibling.data.value,
                remark: node.nextSibling.data.remark
            }).then((res) => {
                this.rests()
            });
        }
    }
};
</script>
<style lang="scss" scoped>

/deep/ .el-input__inner {
    border: 0 none !important;
    height: 42px;
}

.el-divider {
    background-color: #1ea7bf;
    margin-top: -2px;
    position: relative;
    height: 2px;
}

</style>
<style rel="stylesheet/scss" lang="scss">
.dict_tree {
    width: 200px;
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: black;
    }

    .tagClass {
        font-size: 18px;
        font-weight: 600;
        margin-top: 10%;
        padding: 0 2px;
    }

    .el-ic {
        padding: 0 1px;
        display: none;
        margin-top: 11%;
    }

    .el-tree-node__content:hover .el-ic {
        width: 200px;
        color: #428bca !important;
        display: inline-block;
    }

    .el-tree-node__content:hover {
        font-weight: bold;
    }

    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content :hover {
        .el-tree-node__expand-icon.is-leaf {
            color: transparent;
            cursor: default;
        }


        .el-tree-node__expand-icon {
            font-weight: bold;
        }
    }

    .el-dialog__body {
        .upload-container .image-preview .image-preview-wrapper img {
            height: 100px;
        }

        .el-dialog .el-collapse-item__wrap {
            padding-top: 0px;
        }

        .spatial_img {
            .el-collapse-item__wrap {
                margin-bottom: 0;
                padding-top: 0px;
            }
        }

        .upload-container .image-preview .image-preview-wrapper {
            width: 120px;
        }

        .upload-container .image-preview .image-preview-action {
            line-height: 100px;
            height: 100px;
        }
    }

    .el-checkbox__input.is-checked + .el-checkbox__label {
        color: black;
        font-weight: bold;
    }
}
</style>

