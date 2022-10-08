<template>
  <el-container style="height: 100%">
    <el-aside
      width="200px"
      style="border-right: 1px solid #eeeeee; background: #f7f7f7"
    >
      <div
        style="border-bottom: 1px solid #c8c8c8; background-color: white"
        class="tree_wrap_"
      >
        <el-tooltip effect="dark" content="新增" placement="bottom">
          <el-button class="topn" icon="el-icon-plus" @click="add"></el-button>
        </el-tooltip>

        <el-tooltip effect="dark" content="删除" placement="bottom">
          <el-button
            class="topn"
            icon="el-icon-close"
            @click="handleNodeDel"
          ></el-button>
        </el-tooltip>
      </div>

      <div style="height: 100%; position: relative">
        <div>
          <el-input
            size="mini"
            suffix-icon="el-icon-search"
            placeholder="输入关键字进行查找"
            style="border-bottom: 2px solid #1ea7bf; margin-bottom: 3px"
            v-model="filterText"
            clearable
          ></el-input>
        </div>
        <div class="tree-wrap">
          <el-tree
            ref="tree"
            :key="treeKey"
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
            <span
           
              class="span-ellipsis"
              slot-scope="{ node }"
            >
              <span :title="node.label"  v-for="item in treeData"
            :key="item.index" >{{ node.label }}</span>
            </span>
          </el-tree>
        </div>

        <!-- 新增 -->
        <dialog-add ref="dialogAdd" @getTreeTableData="getTreeTableData" />
      </div>
    </el-aside>
    <el-main style="padding: 0">
      <!-- 查询条件 -->
      <div class="search-wrap">
        <el-form :inline="true" :model="formInline">
          <el-form-item size="mini" label="名称">
            <el-input
              v-model="formInline.libName"
              placeholder
              class="inputWidth"
            ></el-input>
          </el-form-item>

          <el-form-item size="mini">
            <el-button
              class="newButtonColor SearchBTN"
              size="mini"
              @click="search"
              >查询</el-button
            >
            <el-button size="mini" class="otherBTN SearchBTN" @click="clear"
              >清空</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格 -->
      <div class="table-wrap">
        <tableComp ref="tableComp" @getInspectLibTree="getInspectLibTree" />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { handleNodeDel, getInspectLibTree } from "@/api/system/inspectLib";
import dialogAdd from "./components/inspectLib/dialogAdd";
import tableComp from "./components/inspectLib/table";

export default {
  components: {
    tableComp,
    dialogAdd,
  },
  data() {
    return {
      // sign: false,
      nodeId: "", // 节点的id
      parentId: "",
      treeKey: "",
      filterText: "",
      formInline: {},
      searchStr: "",
      treeData: [],
      selectNode: {},
      defaultProps: {
        children: "children",
        label: "libName",
      },
    };
  },
  mounted() {
       // 获取方案库树
      this.getInspectLibTree();
    //  console.log(  this.$refs.tableComp,"表格");
  },
  watch: {
    filterText(val) {
      // console.log(val, "过滤");
      this.$refs.tree.filter(val);
    },
    
  },
  methods: {
    // 过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.libName.indexOf(value) !== -1;
    },
    /**
     * 刷新树和表格数据
     */
    getTreeTableData() {
      this.getInspectLibTree();
      this.$refs.tableComp.queryPage();
    },
    /**
     * 获取方案库树
     */
    getInspectLibTree() {
      getInspectLibTree(-1).then((res) => {
        this.treeData = [res.data];
        // console.log(this.treeData,'this.treeData');
      });
    },
    /**
     * 树点击
     */
    handleNodeClick(data) {
      if (data.id == '-1') {
              this.$refs.dialogAdd.sign = true;
      }else{
        this.$refs.dialogAdd.sign = false;
      }
      if (data.parentId.length>2) {
        return false;
      }
      this.nodeId = data.id;
      this.parentId = data.parentId;
      this.$refs.tableComp.showJC = data.parentId;
      let tableComp = this.$refs.tableComp;
      tableComp.param = {
        parentId: data.id,
        current: 0,
      };

      if (data.parentId != -1 && data.parentId != "") {
        return;
      } else {
        tableComp.queryPage();
        // this.$refs.tableComp.$forceUpdate();
      }

    },
    /**
     * 新增
     */
    add() {
      if (this.parentId != -1 && this.parentId != "") {
        this.$message({
          message: "3级菜单不能添加子级菜单!",
          type: "warning",
        });
        return;
      } else {
        let dialogAdd = this.$refs.dialogAdd;
        dialogAdd.dialogFormVisible = true;
        dialogAdd.sizeForm = {};
        let currentNode = this.$refs.tree.getCurrentNode();
        dialogAdd.sizeForm.parentId = currentNode.id;
        dialogAdd.sizeForm.parentName = currentNode.libName;
      }
    },
    /**
     * 查询
     */
    search() {
      this.$refs.tableComp.param.parentId = this.$refs.tree.getCurrentNode().id;
      this.$refs.tableComp.param.libName = this.formInline.libName;
      this.$refs.tableComp.queryPage();
    },
    /**
     * 清空
     */
    clear() {
      this.formInline.libName = "";
    },
    // x删除
    handleNodeDel() {
      var that = this;
      if (that.nodeId != "") {
        this.$confirm("确认删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        confirmButtonClass: "messagebox-button",
		cancelButtonClass: "messagebox-button"
        }).then(() => {
          handleNodeDel(this.nodeId)
            .then((res) => {
              if (res.data && res.code === "000000") {
                this.$message({
                  message: "删除成功",
                  type: "success",
                });
                this.getInspectLibTree();
              } else {
                this.$message.error(res.mesg);
              }
            })
            .catch((err) => {
              this.$message.error(res.mesg);
            });
        });
      }
    },

    /**
     * 批量删除
     */
    // removeAll() {
    //   let multipleSelection = this.$refs.tableComp.multipleSelection;

    //   if (multipleSelection.length > 0) {
    //     let ids = [];
    //     for (var i in multipleSelection) {
    //       ids.push(multipleSelection[i].id);
    //     }

    //     this.$confirm("确定要删除吗?", "提示", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning",
    //     }).then(() => {
    //       removeAll(ids).then((res) => {
    //         if (res.code === "000000" && res.data) {
    //           this.$message({
    //             showClose: true,
    //             message: "批量删除成功！",
    //             type: "success",
    //           });

    //           // 重新查询数据
    //           this.getTreeTableData();
    //         } else {
    //           this.$message.error(res.mesg);
    //         }
    //       });
    //     });
    //   } else {
    //     this.$message({
    //       message: "请选择要删除的数据！",
    //       type: "warning",
    //     });
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.topn {
  background: white;
  border: white;
  color: #232323;
  margin-left: 1px;
  width: 90px;
}

.inputWidth {
  //input框的长度
  width: 180px;
}

.search-wrap {
  padding: 18px 20px 0;
  background: #fcfcfc;
}

.table-option-wrap {
  margin-top: -4px;
  padding: 10px 15px 0;
  border-top: 1px solid #eee;
}

// .table-wrap {
//   padding: 0 10px;
// }

// .btn-wrap {
//   margin: 10px 0;
//   text-align: center;
// }

.tree-wrap {
  position: absolute;
  top: 38px;
  left: 0;
  right: 0;
  bottom: 5px;
  // overflow-y: auto;
}

.search-input-inspectlib {
  width: 100%;
}
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.search-input-inspectlib .el-input--suffix .el-input__inner {
  border-radius: 0;
}
// .no_drop {
//   cursor: no-drop;
//   color: #666 !important;
// }
</style>
