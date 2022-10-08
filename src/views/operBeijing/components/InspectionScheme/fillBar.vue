<template>
  <div class="t">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="模块名称">
        <el-input size="mini" v-model="formInline.inspName" placeholder="请输入模块名称" class="inputWidth"></el-input>
      </el-form-item>

      <el-form-item label="任务类型" class="interval">
        <el-select size="mini" v-model="formInline.inspType" placeholder="请选择任务类型" class="selectWidth">
          <el-option
            v-for="item in inspectType"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="组织机构" class="interval" style="position: relative;">
        <el-input class="kz" id="orgIdTxt" v-model="formInline.orgName" placeholder="请选择组织机构" @focus="showOrgTree"></el-input>

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
      </el-form-item> -->

      <el-form-item>
        <el-button size="mini" class="newButtonColor SearchBTN" @click="onSubmit()">查询</el-button>
        <el-button size="mini" class="otherBTN SearchBTN" @click="empty()">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDict, DICTDATA, getDictList } from "@/api/dict";
// import { getOrgTree } from "@/api/operation/inspectScheme";
export default {
  data() {
    return {
      status: [],
      formInline: {},
      orgTreeData: [],
      inspectType:[],// 任务类型
      // visibleOrgTree: false,
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  created() {
    // 获取状态字典 400
    getDict(DICTDATA.DEVOPS_TASK_TYPE).then(res => {
      this.inspectType = res;
    });
  },
  mounted() {
    // 点击其他地方隐藏组织机构树
    var self = this;
    document.addEventListener("click", e => {
      if (self.$refs.treeWrap && !self.$refs.treeWrap.contains(e.target) && e.target.id != "orgIdTxt") {
        self.visibleOrgTree = false;
      }
    });
  },
  methods: {
    /**
     * 查询
     */
    onSubmit() {
      this.$parent.$refs.formTable.queryPage(this.formInline);
    },
    /**
     * 清空
     */
    empty() {
      this.formInline = {};
    },
    // /**
    //  * 组织机构树选中
    //  */
    // handleNodeClick(item) {
    //   this.formInline.orgName = item.name;
    //   this.formInline.orgId = item.id;
    //   this.visibleOrgTree = false;
    // },
    // /**
    //  * 选择组织机构文本框聚焦
    //  */
    // showOrgTree() {
    //   this.visibleOrgTree = true;
    //   // 获取组织机构树接口调用
    //   this.getOrgTree();
    // },
    // /**
    //  * 获取组织机构树接口调用
    //  * 该接口的参数未确定，目前无参，获取所有组织机构，后面考虑数据权限时再确定参数
    //  */
    // getOrgTree() {
    //   if (this.orgTreeData && this.orgTreeData.length < 1) {
    //     getOrgTree().then(res => {
    //       this.orgTreeData = res.data;
    //     });
    //   }
    // }
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

.t {
  padding-top: 16px;
  padding-left: 20px;
  border-bottom: 1px solid #eeeeee;
  background: #fcfcfc;
  .inputWidth {
    //input框的长度
    width: 135px;
  }
  .selectWidth {
    //selct选择框长度
    width: 150px;
  }
  .searchColor {
    //查询按钮的背景颜色和字体颜色
    background-color: #006080;
    color: #fff;
  }
  .emptyColor {
    //清空按钮字体颜色
    color: #006080;
  }
  .interval {
    //表单之间的间隔
    padding-left: 40px;
  }
}
</style>
