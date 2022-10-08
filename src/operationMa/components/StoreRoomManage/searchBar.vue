<template>
  <div>
    <el-form :inline="true" :model="form">
      <el-form-item label="库房名称">
        <el-input class="txtbox-default" clearable v-model="form.houseName" placeholder="请输入库房名称"></el-input>
      </el-form-item>

      <el-form-item label="组织机构">
        <el-input
          id="orgIdTxt"
          class="txtbox-default"
          v-model="form.orgName"
          placeholder="请选择组织机构"
          @focus="showOrgTree"
        ></el-input>

        <!-- 组织机构树 -->
        <div class="org-tree-wrap" ref="treeWrap" v-show="visibleOrgTree">
          <el-tree
            ref="tree"
            :data="orgTreeData"
            default-expand-all
            node-key="id"
            :expand-on-click-node="false"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :highlight-current="true"
          >
            <span class="span-ellipsis" slot-scope="{ node }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button size="mini" class="SearchBTN newButtonColor" @click="search">查询</el-button>
        <el-button size="mini" class="SearchBTN otherBTN" @click="clearForm">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getOrgTree } from "@/api/operation/inspectScheme";
export default {
  data() {
    return {
      form: {},
      orgTreeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      visibleOrgTree: false
    };
  },
  mounted() {
    // 点击其他地方隐藏组织机构树
    var self = this;
    document.addEventListener("click", e => {
      if (
        self.$refs.treeWrap &&
        !self.$refs.treeWrap.contains(e.target) &&
        e.target.id != "orgIdTxt"
      ) {
        self.visibleOrgTree = false;
      }
    });
  },
  methods: {
    /**
     * 查询
     */
    search() {
      this.$parent.queryParam = this.form;
      this.$parent.getDataInit();
    },
    /**
     * 清空
     */
    clearForm() {
      this.form = {};
    },
    /**
     * 组织机构树选中
     */
    handleNodeClick(item) {
      this.form.orgName = item.name;
      this.form.orgId = item.id;
      this.visibleOrgTree = false;
    },
    /**
     * 选择组织机构文本框聚焦
     */
    showOrgTree() {
      this.visibleOrgTree = true;
      // 获取组织机构树接口调用
      this.getOrgTree();
    },
    /**
     * 获取组织机构树接口调用
     * 该接口的参数未确定，目前无参，获取所有组织机构，后面考虑数据权限时再确定参数
     */
    getOrgTree() {
      if (this.orgTreeData && this.orgTreeData.length < 1) {
        getOrgTree().then(res => {
          this.orgTreeData = res.data;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.org-tree-wrap {
  height: 150px;
  overflow-y: auto;
  position: absolute;
  left: 0;
  top: 40px;
  right: 0;
  z-index: 2;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
}
</style>