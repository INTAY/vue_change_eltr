<template>
  <el-container style="height:100%;" class="table_wrap">
    <el-aside width="200px" style="border-right:1px solid #eeeeee;padding-top:10px;background: #f7f7f7;">
      <tree ref="tree" @treeNodeClick="queryTableData"/>
    </el-aside>
    <el-main style="padding: 0;">
      <topform @searchButClick="queryTableData"/>
      <erji ref="erji"/>
      <biaoge ref="biaoge"/>
    </el-main>
    <add-or-update ref="addOrUpdate" @addsuccess="adResSuccess"></add-or-update>
  </el-container>
</template>

<script>
  import tree from "./components/resource/tree";
  import topform from "./components/resource/topform";
  import erji from "./components/resource/erji";
  import biaoge from "./components/resource/biaoge";
  import isNil from 'lodash/isNil';
  import { getDictSync, DICTDATA } from "@/api/dict";
  import AddOrUpdate from './components/resource/add-or-update'
import { mapState,mapMutations } from 'vuex'
  
  import { getResTree } from "@/api/power/resource";
  
  export default {
  	name:'resource',
    data() {
      return {
        resTypes: [],//资源类型,翻译使用，可能多个子组件都使用，所以放在父组件里面
        parentId: "-1",//树选中节点的ID
        type: 1,//树选中节点的type
        searchName: null  //模糊查询名称
      };
    },
    components: { tree, biaoge,topform,erji,AddOrUpdate },
    mounted() {
      this.init();
    },
    methods: {
    	...mapMutations(['set_v_resTree']),
      //页面初始化，如加载翻译使用的字典参数
      async init(){
        //顺序调用，保证先加载字典表
        await this.getResType()
        this.queryTableData(null,-1)
      },
      //查询资源类型字典
      async getResType(){
        this.resTypes = await getDictSync(DICTDATA.RESOURCE_TYPE)
      },
      //查询表格数据
      queryTableData(name=null,parentId=null,type=null){
        if(!isNil(parentId)){
          this.parentId = parentId;
        }
        if(!isNil(type)){
          this.type = type;
        }
        this.searchName = name;
        this.$refs.biaoge.query(this.searchName,this.parentId);
      },
      //添加按钮事件处理
      handleAddButClick(data=null,parentId=null){
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(null, parentId, this.type+1);
        });
      },
      //表格修改按钮处理
      handleUpdateButClick(rowdata){
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(JSON.parse(JSON.stringify(rowdata)),JSON.parse(JSON.stringify(rowdata)).parentId);
        });
      },
      //添加资源成功处理
      adResSuccess(){
        this.queryTableData(null,null);
      }
    },
    beforeRouteLeave (to, from, next) {
      	getResTree().then(res => {
	        if("000000"==res.code){
	          this.set_v_resTree(res.data)
	        }else{
	          this.$message.error(res.mesg);
	        }
	      })
		next();
	  }
  };
</script>
