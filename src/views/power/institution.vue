<template>
  <el-container style="height:100%;" class="table_wrap">
    <el-aside width="200px" style="border-right:1px solid #eeeeee;background: #f7f7f7;position: relative;overflow: hidden;box-sizing: border-box;">
      <tree ref="tree"/>
    </el-aside>
    <el-main style="padding:0;">
      <Detail ref="detail"/>
      <topform ref="topform"/>
      <biaoge ref="biaoge"/>
    </el-main>
  </el-container>
</template>

<script>
import tree from "./components/institution/tree";
import biaoge from "./components/institution/biaoge";
import topform from "./components/institution/topform"
import Detail from './components/institution/detail';
import { getDict, DICTDATA } from "@/api/dict";
import {find,isNil} from 'lodash';
import { treecx, sxqxzk} from "@/api/power/institution";
import { mapState,mapMutations } from "vuex";
export default {
	name:"institution",
  data() {
    return {
      serviceTypes: [],//业务分类，字典类型103
      orgTypes:[], //组织类型，字典类型101
      treeData:[], //树数据
    };
  },
  components: { tree,biaoge,topform,Detail },
  mounted() {
    this.init();
  },
  destroyed() {
  },
  methods: {
  	...mapMutations(['set_insData']),
    //页面初始化，如加载翻译使用的字典参数
    init(){
      this.getServiceTypes().then(()=>{
        this.getOrgTypes().then(()=>{
            this.$refs.topform.setData();
            this.$refs.biaoge.setData();
            this.$refs.tree.setData();
        });
      });
      this.cxtree();
    },
    //查询业务分类字典
    getServiceTypes(){
      return new Promise((resolve, reject) => {
        getDict(DICTDATA.SERVICE_TYPE).then(res => {
          this.serviceTypes = res;
          resolve();
        });
      });
    },
    //查询组织类型字典
    getOrgTypes(){
      return new Promise((resolve, reject) => {
        getDict(DICTDATA.ORG_TYPE).then(res => {
          this.orgTypes = res;
          resolve();
        });
      });
    },
    // 树状图查询
    cxtree() {
      treecx().then(res => {
      	this.set_insData(res.data)
//      this.$refs.tree.data = res.data;
        this.$refs.tree.parentTypes = res.data;
        this.$refs.biaoge.orgTreeData = res.data;
        this.$refs.tree.treeKey = +new Date()
        this.$refs.tree.num = this.$refs.tree.num2
      });
    },
  
    handleNodeClick(data) {
      data.serviceTypeName = this.transServiceType(data.serviceType);
      this.$refs.detail.update(data);
      this.$refs.biaoge.ids = data.id;
      this.$refs.biaoge.cx();
    },
    transServiceType(typeId){
      var dict = find(this.serviceTypes,{"value":typeId});
      return isNil(dict) ? "":dict.name;
    }
  }
};

</script>

<style lang="scss" scoped>
</style>
