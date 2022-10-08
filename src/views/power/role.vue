<template>
  <el-container style="height:100%;" class="table_wrap">
    <el-aside width="200px" style="border-right:1px solid #eeeeee;background: #f7f7f7;padding-top: 35px;position: relative;overflow: hidden;box-sizing: border-box;padding-bottom: 20px;">
      <tree ref="tree"/>
    </el-aside>
    <el-main style="padding:0 20px 0 0;">
      <biaoge ref="biaoge"/>
    </el-main>
  </el-container>
</template>

<script>
import tree from "./components/role/tree";
import biaoge from "./components/role/biaoge";
import { getResTree } from "@/api/power/resource";
import { mapState,mapMutations } from 'vuex'
export default {
	name:'role',
  data() {
    return {
      resTreeData: []
    };
  },
  components: { tree, biaoge },
  computed:{
  	...mapState(['resTree']),
  },
  mounted() {
  	this.getTreeData();
    if(this.resTreeData.length==0){
      this.getTreeData();
    }
  },
  destroyed() {

  },
  methods: {
  	...mapMutations(['set_v_resTree']),
    getTreeData(){
      getResTree().then(res => {
        if("000000"==res.code){
          this.resTreeData = res.data
          this.set_v_resTree(res.data)
        }else{
          this.$message.error(res.mesg);
        }
      })
    }
  }
};

</script>
